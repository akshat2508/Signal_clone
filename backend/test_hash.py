import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from app.core.security import pwd_context
from app.core.database import SessionLocal
from app.models import User

db = SessionLocal()
user = db.query(User).filter(User.username == "test_user_99").first()
if user:
    print(f"Hash: {user.password_hash}")
    print(f"Valid with 'password123'? {pwd_context.verify('password123', user.password_hash)}")
    print(f"Valid with 'password123 '? {pwd_context.verify('password123 ', user.password_hash)}")
    print(f"Valid with 'password123\n'? {pwd_context.verify('password123\n', user.password_hash)}")
else:
    print("User not found!")
