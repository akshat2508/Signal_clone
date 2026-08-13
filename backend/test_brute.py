import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from app.core.security import pwd_context
from app.core.database import SessionLocal
from app.models import User

db = SessionLocal()
user = db.query(User).filter(User.username == "test_user_99").first()
if user:
    hash_str = user.password_hash
    passwords = [
        "password123", "password123 ", " password123", "password1234", "password12",
        "Password123", "passWord123", "password 123", "password!23",
        "passwrod123", "psasword123", "test_user_99", "123456789", "123456",
        "password", "password123\n", "\npassword123"
    ]
    for p in passwords:
        if pwd_context.verify(p, hash_str):
            print(f"FOUND PASSWORD: '{p}'")
            sys.exit(0)
    print("Not found among common guesses.")
