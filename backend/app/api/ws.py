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

@router.websocket("/{conversation_id}")
async def websocket_endpoint(websocket: WebSocket, conversation_id: str, db: Session = Depends(get_db)):
    user = await get_ws_current_user(websocket, db)
    if not user:
        await websocket.close(code=1008)
        return
        
    # Check authorization
    try:
        conv_uuid = uuid.UUID(conversation_id)
    except ValueError:
        await websocket.close(code=1008)
        return
        
    member = db.query(ConversationMember).filter(
        ConversationMember.conversation_id == conv_uuid,
        ConversationMember.user_id == user.id
    ).first()
    
    if not member:
        await websocket.close(code=1008)
        return
        
    await manager.connect(websocket, conversation_id, str(user.id))
    
    # Broadcast user online
    await manager.broadcast_to_conversation(
        conversation_id,
        {
            "type": "USER_ONLINE",
            "conversation_id": conversation_id,
            "user_id": str(user.id)
        }
    )
    
    try:
        while True:
            data = await websocket.receive_json()
            # Simple relay of typing events for now
            if data.get("type") in ["TYPING_STARTED", "TYPING_STOPPED"]:
                data["user_id"] = str(user.id)
                data["conversation_id"] = conversation_id
                await manager.broadcast_to_conversation(conversation_id, data)
                
    except WebSocketDisconnect:
        manager.disconnect(websocket, conversation_id, str(user.id))
        await manager.broadcast_to_conversation(
            conversation_id,
            {
                "type": "USER_OFFLINE",
                "conversation_id": conversation_id,
                "user_id": str(user.id)
            }
        )
