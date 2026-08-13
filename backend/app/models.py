import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Text, Enum, Uuid
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

def get_utc_now():
    return datetime.now(timezone.utc)

class User(Base):
    __tablename__ = "users"
    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = Column(String, unique=True, index=True, nullable=False)
    phone_number = Column(String, unique=True, index=True, nullable=True)
    display_name = Column(String, nullable=False)
    avatar_url = Column(String, nullable=True)
    password_hash = Column(String, nullable=False)
    is_online = Column(Boolean, nullable=False, default=False)
    last_seen_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=get_utc_now)
    updated_at = Column(DateTime(timezone=True), default=get_utc_now, onupdate=get_utc_now)

class Session(Base):
    __tablename__ = "sessions"
    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(Uuid(as_uuid=True), ForeignKey("users.id"), index=True, nullable=False)
    token = Column(String, unique=True, index=True, nullable=False)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(DateTime(timezone=True), default=get_utc_now)

class Contact(Base):
    __tablename__ = "contacts"
    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    owner_user_id = Column(Uuid(as_uuid=True), ForeignKey("users.id"), index=True, nullable=False)
    contact_user_id = Column(Uuid(as_uuid=True), ForeignKey("users.id"), index=True, nullable=False)
    nickname = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), default=get_utc_now)

class Conversation(Base):
    __tablename__ = "conversations"
    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    type = Column(String, nullable=False) # DIRECT or GROUP
    name = Column(String, nullable=True)
    avatar_url = Column(String, nullable=True)
    created_by = Column(Uuid(as_uuid=True), ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), default=get_utc_now)
    updated_at = Column(DateTime(timezone=True), default=get_utc_now, index=True)

class ConversationMember(Base):
    __tablename__ = "conversation_members"
    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    conversation_id = Column(Uuid(as_uuid=True), ForeignKey("conversations.id"), index=True, nullable=False)
    user_id = Column(Uuid(as_uuid=True), ForeignKey("users.id"), index=True, nullable=False)
    role = Column(String, nullable=False) # ADMIN or MEMBER
    joined_at = Column(DateTime(timezone=True), default=get_utc_now)
    left_at = Column(DateTime(timezone=True), nullable=True)
    last_read_message_id = Column(Uuid(as_uuid=True), nullable=True) # Cannot add FK here directly if tables depend on each other, will handle dynamically or in logic

class Message(Base):
    __tablename__ = "messages"
    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    conversation_id = Column(Uuid(as_uuid=True), ForeignKey("conversations.id"), index=True, nullable=False)
    sender_id = Column(Uuid(as_uuid=True), ForeignKey("users.id"), nullable=False)
    sender = relationship("User", foreign_keys=[sender_id])
    body = Column(Text, nullable=False)
    message_type = Column(String, nullable=False, default="TEXT") # TEXT | IMAGE | FILE | SYSTEM
    reply_to_message_id = Column(Uuid(as_uuid=True), ForeignKey("messages.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), default=get_utc_now, index=True)
    updated_at = Column(DateTime(timezone=True), default=get_utc_now, onupdate=get_utc_now)
    deleted_at = Column(DateTime(timezone=True), nullable=True)

class MessageReceipt(Base):
    __tablename__ = "message_receipts"
    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    message_id = Column(Uuid(as_uuid=True), ForeignKey("messages.id"), index=True, nullable=False)
    user_id = Column(Uuid(as_uuid=True), ForeignKey("users.id"), index=True, nullable=False)
    status = Column(String, nullable=False) # SENT | DELIVERED | READ
    created_at = Column(DateTime(timezone=True), default=get_utc_now)
    updated_at = Column(DateTime(timezone=True), default=get_utc_now, onupdate=get_utc_now)
