from typing import List
import uuid
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc
from app.core.database import get_db
from app.models import Conversation, ConversationMember, Message, MessageReceipt, User
from app import schemas
from app.api.deps import CurrentUser

router = APIRouter()

@router.get("/", response_model=List[schemas.ConversationListResponse])
def get_conversations(current_user: CurrentUser, db: Session = Depends(get_db)):
    # Find all conversations the user is part of
    member_records = db.query(ConversationMember).filter(
        ConversationMember.user_id == current_user.id
    ).all()
    
    conv_ids = [m.conversation_id for m in member_records]
    
    conversations = db.query(Conversation).filter(
        Conversation.id.in_(conv_ids)
    ).order_by(desc(Conversation.updated_at)).all()
    
    result = []
    for conv in conversations:
        # Get latest message
        latest_msg = db.query(Message).filter(
            Message.conversation_id == conv.id
        ).order_by(desc(Message.created_at)).first()
        
        # Get unread count
        unread_count = db.query(MessageReceipt).join(Message).filter(
            MessageReceipt.user_id == current_user.id,
            MessageReceipt.status != "READ",
            Message.conversation_id == conv.id
        ).count()
        
        # Get members
        members = db.query(ConversationMember).filter(ConversationMember.conversation_id == conv.id).all()
        for m in members:
            m.user = db.query(User).filter(User.id == m.user_id).first()
            
        conv_response = schemas.ConversationListResponse.model_validate(conv)
        conv_response.latest_message = latest_msg
        conv_response.unread_count = unread_count
        conv_response.members = members
        result.append(conv_response)
        
    return result

@router.post("/direct", response_model=schemas.ConversationResponse)
def create_direct(req: schemas.ConversationCreateDirect, current_user: CurrentUser, db: Session = Depends(get_db)):
    # Check if a direct conversation already exists
    # Find all direct conversations user is in
    user_convs = db.query(ConversationMember.conversation_id).filter(
        ConversationMember.user_id == current_user.id
    ).subquery()
    
    existing = db.query(Conversation).join(ConversationMember).filter(
        Conversation.type == "DIRECT",
        Conversation.id.in_(user_convs),
        ConversationMember.user_id == req.contact_user_id
    ).first()
    
    if existing:
        return existing
        
    conv = Conversation(type="DIRECT")
    db.add(conv)
    db.commit()
    db.refresh(conv)
    
    db.add_all([
        ConversationMember(conversation_id=conv.id, user_id=current_user.id, role="MEMBER"),
        ConversationMember(conversation_id=conv.id, user_id=req.contact_user_id, role="MEMBER")
    ])
    db.commit()
    
    return conv

@router.post("/group", response_model=schemas.ConversationResponse)
def create_group(req: schemas.ConversationCreateGroup, current_user: CurrentUser, db: Session = Depends(get_db)):
    conv = Conversation(
        type="GROUP",
        name=req.name,
        created_by=current_user.id
    )
    db.add(conv)
    db.commit()
    db.refresh(conv)
    
    members = [ConversationMember(conversation_id=conv.id, user_id=current_user.id, role="ADMIN")]
    for user_id in req.member_ids:
        if user_id != current_user.id:
            members.append(ConversationMember(conversation_id=conv.id, user_id=user_id, role="MEMBER"))
            
    db.add_all(members)
    db.commit()
    
    return conv

@router.get("/{conversation_id}", response_model=schemas.ConversationResponse)
def get_conversation(conversation_id: uuid.UUID, current_user: CurrentUser, db: Session = Depends(get_db)):
    member = db.query(ConversationMember).filter(
        ConversationMember.conversation_id == conversation_id,
        ConversationMember.user_id == current_user.id
    ).first()
    if not member:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    conv = db.query(Conversation).filter(Conversation.id == conversation_id).first()
    return conv

@router.get("/{conversation_id}/messages", response_model=List[schemas.MessageResponse])
def get_messages(conversation_id: uuid.UUID, current_user: CurrentUser, limit: int = 50, db: Session = Depends(get_db)):
    member = db.query(ConversationMember).filter(
        ConversationMember.conversation_id == conversation_id,
        ConversationMember.user_id == current_user.id
    ).first()
    if not member:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    messages = db.query(Message).filter(
        Message.conversation_id == conversation_id
    ).order_by(desc(Message.created_at)).limit(limit).all()
    
    # Return chronologically
    return list(reversed(messages))

@router.post("/{conversation_id}/messages", response_model=schemas.MessageResponse)
async def send_message(conversation_id: uuid.UUID, req: schemas.MessageCreate, current_user: CurrentUser, db: Session = Depends(get_db)):
    member = db.query(ConversationMember).filter(
        ConversationMember.conversation_id == conversation_id,
        ConversationMember.user_id == current_user.id
    ).first()
    if not member:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    message = Message(
        conversation_id=conversation_id,
        sender_id=current_user.id,
        body=req.body,
        message_type=req.message_type,
        reply_to_message_id=req.reply_to_message_id
    )
    db.add(message)
    
    # Update conversation updated_at
    conv = db.query(Conversation).filter(Conversation.id == conversation_id).first()
    if conv:
        from app.models import get_utc_now
        conv.updated_at = get_utc_now()
        
    db.commit()
    db.refresh(message)
    
    # Create receipts for all other members
    members = db.query(ConversationMember).filter(ConversationMember.conversation_id == conversation_id).all()
    receipts = []
    for m in members:
        if m.user_id != current_user.id:
            receipts.append(MessageReceipt(
                message_id=message.id,
                user_id=m.user_id,
                status="SENT"
            ))
    
    if receipts:
        db.add_all(receipts)
        db.commit()
        
    # Broadcast to WebSocket
    from app.core.websockets import manager
    from app.schemas import MessageResponse
    
    msg_response = MessageResponse.model_validate(message).model_dump(mode='json')
    
    await manager.broadcast_to_conversation(
        str(conversation_id),
        {
            "type": "NEW_MESSAGE",
            "message": msg_response
        }
    )
        
    return message
