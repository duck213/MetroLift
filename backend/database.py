from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://metrolift:metropass@localhost:5432/metrolift_db")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# 💡 교육용 주석: 데이터베이스와의 연결 통로(세션)를 만들어주는 함수입니다.
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
