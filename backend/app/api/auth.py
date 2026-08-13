from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models import User, Session as DBSession
from app import schemas
from app.core.security import get_password_hash, verify_password, create_session
from app.api.deps import CurrentUser

router = APIRouter()

@router.post("/register", response_model=schemas.UserResponse)
def register(user_in: schemas.RegisterRequest, db: Session = Depends(get_db)):
    username_lower = user_in.username.lower()
    
    print(f"DEBUG REGISTER: username='{username_lower}', password=repr({repr(user_in.password)})")
    
    if db.query(User).filter(User.username == username_lower).first():
        raise HTTPException(status_code=400, detail="Username already registered")
        
    if user_in.phone_number and db.query(User).filter(User.phone_number == user_in.phone_number).first():
        raise HTTPException(status_code=400, detail="Phone number already registered")
        
    user = User(
        username=username_lower,
        display_name=user_in.display_name,
        phone_number=user_in.phone_number,
        password_hash=get_password_hash(user_in.password),
        avatar_url=user_in.avatar_url
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    # Registration successful. They must now call /verify or login.
    return user

@router.post("/verify")
def verify_otp(req: schemas.OTPVerifyRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == req.username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    if req.otp != "123456":
        raise HTTPException(status_code=400, detail="Invalid OTP")
        
    return {"message": "OTP verified successfully"}

@router.post("/login", response_model=schemas.UserResponse)
def login(req: schemas.LoginRequest, response: Response, db: Session = Depends(get_db)):
    print(f"DEBUG LOGIN: username='{req.username}', password=repr({repr(req.password)})")
    user = db.query(User).filter(User.username == req.username.lower()).first()
    
    if not user:
        print(f"DEBUG: User not found in DB for '{req.username.lower()}'")
        raise HTTPException(status_code=401, detail="Incorrect username or password")
        
    print(f"DEBUG: User found: {user.username}. Verifying password...")
    is_valid = verify_password(req.password, user.password_hash)
    print(f"DEBUG: Password valid: {is_valid}")
    
    if not is_valid:
        raise HTTPException(status_code=401, detail="Incorrect username or password")
        
    # Create session
    db_session = create_session(db, user.id)
    
    # Set cookie
    response.set_cookie(
        key="session_token",
        value=db_session.token,
        httponly=True,
        secure=False, # Set to True in production with HTTPS
        samesite="lax",
        max_age=7 * 24 * 60 * 60 # 7 days
    )
    
    # Set online status
    user.is_online = True
    db.commit()
    
    return user

@router.post("/logout")
def logout(response: Response, current_user: CurrentUser, db: Session = Depends(get_db)):
    # Delete session
    # Normally we'd need the token to delete the specific session, 
    # but we can just invalidate all sessions for the user or the latest one for MVP
    db.query(DBSession).filter(DBSession.user_id == current_user.id).delete()
    
    current_user.is_online = False
    db.commit()
    
    response.delete_cookie("session_token")
    return {"message": "Logged out successfully"}

@router.get("/me", response_model=schemas.UserResponse)
def get_me(current_user: CurrentUser):
    return current_user
