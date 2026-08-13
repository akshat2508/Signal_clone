import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from app.core.security import get_password_hash, verify_password

password = "password123"
hash_str = get_password_hash(password)
print(f"Hash: {hash_str}")
is_valid = verify_password(password, hash_str)
print(f"Is valid: {is_valid}")
