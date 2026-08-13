from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker
from .config import settings

# Render provides 'postgres://' but SQLAlchemy 1.4+ requires 'postgresql://'
db_url = settings.DATABASE_URL
if db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql://", 1)

connect_args = {"check_same_thread": False, "timeout": 15} if db_url.startswith("sqlite") else {}

engine = create_engine(
    db_url, 
    connect_args=connect_args
)

if settings.DATABASE_URL.startswith("sqlite"):
    # WAL mode is persistent in SQLite, we don't need to set it on every connection.
    # Setting it on every connection can cause 'database is locked' if concurrent connections exist.
    pass

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
