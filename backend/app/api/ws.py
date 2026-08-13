from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.websockets import manager
from app.models import Session as DBSession, User, ConversationMember
from datetime import datetime, timezone
import uuid

router = APIRouter()

async def get_ws_current_user(websocket: WebSocket, db: Session):
    session_token = websocket.cookies.get("session_token")
    if not session_token:
        return None
        
    db_session = db.query(DBSession).filter(DBSession.token == session_token).first()
    if not db_session:
        return None
        
    expires_at = db_session.expires_at
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
        
    if expires_at < datetime.now(timezone.utc):
        return None
        
    user = db.query(User).filter(User.id == db_session.user_id).first()
    return user

@router.websocket("")
async def websocket_endpoint(websocket: WebSocket, db: Session = Depends(get_db)):
    print("WEBSOCKET CONNECTION ATTEMPT!")
    user = await get_ws_current_user(websocket, db)
    if not user:
        print("WEBSOCKET NO USER!")
        await websocket.close(code=1008)
        return
        
    print(f"WEBSOCKET CONNECTING USER {user.id}")
    await manager.connect(websocket, str(user.id))
    
    # Broadcast user online status to all conversations they are part of
    # To keep it simple, we can just let clients periodically fetch online status,
    # or implement a global presence system later.
    
    try:
        while True:
            data = await websocket.receive_json()
            # Simple relay of typing events for now
            if data.get("type") in ["TYPING_STARTED", "TYPING_STOPPED"]:
                conversation_id = data.get("conversation_id")
                if conversation_id:
                    # Get all members of the conversation
                    members = db.query(ConversationMember).filter(
                        ConversationMember.conversation_id == conversation_id
                    ).all()
                    member_ids = [str(m.user_id) for m in members if m.user_id != user.id]
                    
                    data["user_id"] = str(user.id)
                    await manager.broadcast_to_users(member_ids, data)
                
    except WebSocketDisconnect:
        manager.disconnect(websocket, str(user.id))
