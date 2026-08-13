from pydantic import BaseModel, ConfigDict, Field
from typing import List, Optional
from datetime import datetime
from uuid import UUID

# Users
class UserBase(BaseModel):
    username: str
    display_name: str
    phone_number: Optional[str] = None
    avatar_url: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: UUID
    is_online: bool
    last_seen_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)

# Auth
class LoginRequest(BaseModel):
    username: str
    password: str

class RegisterRequest(UserBase):
    password: str

class OTPVerifyRequest(BaseModel):
    username: str
    otp: str # For assignment, this will be mocked to 123456

# Contacts
class ContactResponse(BaseModel):
    id: UUID
    owner_user_id: UUID
    contact_user_id: UUID
    nickname: Optional[str] = None
    contact_user: Optional[UserResponse] = None

    model_config = ConfigDict(from_attributes=True)

class AddContactRequest(BaseModel):
    contact_user_id: UUID
    nickname: Optional[str] = None

# Messages
class MessageBase(BaseModel):
    body: str
    message_type: str = "TEXT"
    reply_to_message_id: Optional[UUID] = None

class MessageCreate(MessageBase):
    pass

class MessageResponse(MessageBase):
    id: UUID
    conversation_id: UUID
    sender_id: UUID
    sender: Optional[UserResponse] = None
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

# Conversations
class ConversationBase(BaseModel):
    type: str # DIRECT or GROUP
    name: Optional[str] = None
    avatar_url: Optional[str] = None

class ConversationCreateGroup(BaseModel):
    name: str
    member_ids: List[UUID]

class ConversationCreateDirect(BaseModel):
    contact_user_id: UUID

class ConversationMemberResponse(BaseModel):
    id: UUID
    user_id: UUID
    role: str
    joined_at: datetime
    user: Optional[UserResponse] = None

    model_config = ConfigDict(from_attributes=True)

class ConversationResponse(ConversationBase):
    id: UUID
    created_at: datetime
    updated_at: datetime
    # We can add members and latest message dynamically in the API response

    model_config = ConfigDict(from_attributes=True)

class ConversationListResponse(ConversationResponse):
    latest_message: Optional[MessageResponse] = None
    unread_count: int = 0
    members: List[ConversationMemberResponse] = []
