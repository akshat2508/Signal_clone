from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.api import auth, users, contacts, conversations, ws

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(contacts.router, prefix="/api/contacts", tags=["contacts"])
app.include_router(conversations.router, prefix="/api/conversations", tags=["conversations"])
app.include_router(ws.router, prefix="/ws/conversations", tags=["websocket"])

@app.get("/health")
def health_check():
    return {"status": "ok"}
