from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.core.database import get_db
from app.models import User
from app import schemas
from app.api.deps import CurrentUser

router = APIRouter()

@router.get("/", response_model=List[schemas.UserResponse])
def get_users(current_user: CurrentUser, db: Session = Depends(get_db)):
    # In a real app this would be paginated and restricted.
    return db.query(User).all()

@router.get("/search", response_model=List[schemas.UserResponse])
def search_users(q: str, current_user: CurrentUser, db: Session = Depends(get_db)):
    if not q:
        return []
    search_term = f"%{q}%"
    return db.query(User).filter(
        or_(
            User.username.ilike(search_term),
            User.display_name.ilike(search_term),
            User.phone_number.ilike(search_term)
        )
    ).all()
