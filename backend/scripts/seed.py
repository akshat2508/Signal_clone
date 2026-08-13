import os
import sys
import uuid
from datetime import datetime, timezone, timedelta
from sqlalchemy.orm import Session

sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from app.core.database import SessionLocal
from app.models import (
    User, Contact, Conversation, ConversationMember, 
    Message, MessageReceipt
)
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def seed_db():
    db = SessionLocal()
    
    # Check if we already have users
    if db.query(User).count() > 0:
        print("Database already seeded")
        return
        
    print("Seeding database...")
    
    # Create Users
    users_data = [
        {"username": "alice", "display_name": "Alice Johnson", "phone_number": "+12345678901", "is_online": True},
        {"username": "bob", "display_name": "Bob Smith", "phone_number": "+12345678902", "is_online": False},
        {"username": "charlie", "display_name": "Charlie Brown", "phone_number": "+12345678903", "is_online": True},
        {"username": "david", "display_name": "David Miller", "phone_number": "+12345678904", "is_online": False},
        {"username": "emma", "display_name": "Emma Wilson", "phone_number": "+12345678905", "is_online": True},
    ]
    
    users = []
    base_time = datetime.now(timezone.utc) - timedelta(days=5)
    
    for i, u in enumerate(users_data):
        user = User(
            id=uuid.uuid4(),
            username=u["username"],
            display_name=u["display_name"],
            phone_number=u["phone_number"],
            password_hash=get_password_hash("password123"),
            is_online=u["is_online"],
            last_seen_at=base_time + timedelta(days=i) if not u["is_online"] else None
        )
        db.add(user)
        users.append(user)
    
    db.commit()
    
    alice, bob, charlie, david, emma = users
    
    # Create Contacts
    contacts = [
        Contact(owner_user_id=alice.id, contact_user_id=bob.id),
        Contact(owner_user_id=alice.id, contact_user_id=charlie.id),
        Contact(owner_user_id=bob.id, contact_user_id=alice.id),
    ]
    db.add_all(contacts)
    db.commit()
    
    # Create Direct Conversation: Alice & Bob
    conv1 = Conversation(id=uuid.uuid4(), type="DIRECT")
    db.add(conv1)
    db.commit()
    
    db.add_all([
        ConversationMember(conversation_id=conv1.id, user_id=alice.id, role="MEMBER"),
        ConversationMember(conversation_id=conv1.id, user_id=bob.id, role="MEMBER")
    ])
    
    # Create Group Conversation: Alice, Charlie, David
    conv2 = Conversation(
        id=uuid.uuid4(), 
        type="GROUP", 
        name="Project Team",
        created_by=alice.id
    )
    db.add(conv2)
    db.commit()
    
    db.add_all([
        ConversationMember(conversation_id=conv2.id, user_id=alice.id, role="ADMIN"),
        ConversationMember(conversation_id=conv2.id, user_id=charlie.id, role="MEMBER"),
        ConversationMember(conversation_id=conv2.id, user_id=david.id, role="MEMBER")
    ])
    
    db.commit()
    
    # Create Messages
    m1 = Message(
        id=uuid.uuid4(),
        conversation_id=conv1.id,
        sender_id=alice.id,
        body="Hey Bob, how are you?",
        created_at=base_time + timedelta(hours=1)
    )
    m2 = Message(
        id=uuid.uuid4(),
        conversation_id=conv1.id,
        sender_id=bob.id,
        body="I'm good! Just working on the assignment.",
        created_at=base_time + timedelta(hours=1, minutes=5)
    )
    
    m3 = Message(
        id=uuid.uuid4(),
        conversation_id=conv2.id,
        sender_id=charlie.id,
        body="Is everyone ready for the meeting?",
        created_at=base_time + timedelta(hours=2)
    )
    
    db.add_all([m1, m2, m3])
    db.commit()
    
    # Create Receipts
    r1 = MessageReceipt(message_id=m1.id, user_id=bob.id, status="READ")
    r2 = MessageReceipt(message_id=m2.id, user_id=alice.id, status="READ")
    r3 = MessageReceipt(message_id=m3.id, user_id=alice.id, status="DELIVERED")
    r4 = MessageReceipt(message_id=m3.id, user_id=david.id, status="SENT")
    
    db.add_all([r1, r2, r3, r4])
    db.commit()
    
    print("Database seeded successfully!")

if __name__ == "__main__":
    seed_db()
