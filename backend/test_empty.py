from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import sessionmaker, declarative_base
from fastapi.testclient import TestClient

Base = declarative_base()
class User(Base):
    __tablename__ = "users_test"
    id = Column(Integer, primary_key=True)

engine = create_engine("sqlite:///:memory:")
SessionLocal = sessionmaker(bind=engine)

app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/login")
def login(db = Depends(get_db)):
    try:
        user = db.query(User).first()
        if not user:
            raise HTTPException(status_code=401)
    except Exception as e:
        print("EXCEPTION:", type(e).__name__)
        raise

client = TestClient(app)
response = client.post("/login")
print("STATUS:", response.status_code)
