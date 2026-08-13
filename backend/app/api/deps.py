from typing import Annotated
from fastapi import Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from app.core.database import get_db
from app.models import Session as DBSession, User

def get_current_user(request: Request, db: Session = Depends(get_db)) -> User:
    session_token = request.cookies.get("session_token")
    
    if not session_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
        
    db_session = db.query(DBSession).filter(DBSession.token == session_token).first()
    
    if not db_session:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid session"
        )
        
    # Make sure expires_at is timezone aware for comparison
    expires_at = db_session.expires_at
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
        
    if expires_at < datetime.now(timezone.utc):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session expired"
        )
        
    user = db.query(User).filter(User.id == db_session.user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
        
    return user

CurrentUser = Annotated[User, Depends(get_current_user)]
