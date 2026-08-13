from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models import Contact, User
from app import schemas
from app.api.deps import CurrentUser

router = APIRouter()

@router.get("/", response_model=List[schemas.ContactResponse])
def get_contacts(current_user: CurrentUser, db: Session = Depends(get_db)):
    contacts = db.query(Contact).filter(Contact.owner_user_id == current_user.id).all()
    # Populate contact_user manually for the response since relationship may need to be defined
    for c in contacts:
        c.contact_user = db.query(User).filter(User.id == c.contact_user_id).first()
    return contacts

@router.post("/", response_model=schemas.ContactResponse)
def add_contact(req: schemas.AddContactRequest, current_user: CurrentUser, db: Session = Depends(get_db)):
    if req.contact_user_id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot add yourself as contact")
        
    existing = db.query(Contact).filter(
        Contact.owner_user_id == current_user.id,
        Contact.contact_user_id == req.contact_user_id
    ).first()
    
    if existing:
        raise HTTPException(status_code=409, detail="Contact already exists")
        
    contact = Contact(
        owner_user_id=current_user.id,
        contact_user_id=req.contact_user_id,
        nickname=req.nickname
    )
    db.add(contact)
    db.commit()
    db.refresh(contact)
    contact.contact_user = db.query(User).filter(User.id == contact.contact_user_id).first()
    return contact

@router.delete("/{contact_id}")
def delete_contact(contact_id: str, current_user: CurrentUser, db: Session = Depends(get_db)):
    contact = db.query(Contact).filter(
        Contact.id == contact_id, 
        Contact.owner_user_id == current_user.id
    ).first()
    
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
        
    db.delete(contact)
    db.commit()
    return {"message": "Contact removed"}
