from sqlalchemy import Column, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
import datetime
from database import Base

# 💡 교육용 주석: 파이썬 클래스를 데이터베이스 테이블로 만들어주는(ORM) 설계도입니다.

class User(Base):
    __tablename__ = "users"
    id = Column(String(50), primary_key=True, index=True)
    nickname = Column(String(50), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    bookmarks = relationship("Bookmark", back_populates="user")

class Station(Base):
    __tablename__ = "stations"
    name = Column(String(50), primary_key=True, index=True)
    line = Column(String(20))

    elevators = relationship("Elevator", back_populates="station")
    facilities = relationship("Facility", back_populates="station")

class Elevator(Base):
    __tablename__ = "elevators"
    id = Column(String(50), primary_key=True, index=True)
    station_name = Column(String(50), ForeignKey("stations.name"))
    status = Column(String(20), nullable=False) # 정상, 점검, 고장
    location_type = Column(String(20), nullable=False) # 지상, 지하
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    last_updated = Column(DateTime, default=datetime.datetime.utcnow)

    station = relationship("Station", back_populates="elevators")

class Facility(Base):
    __tablename__ = "facilities"
    id = Column(String(50), primary_key=True, index=True)
    station_name = Column(String(50), ForeignKey("stations.name"))
    type = Column(String(50), nullable=False)
    location_desc = Column(String(255), nullable=False)
    status = Column(String(50))

    station = relationship("Station", back_populates="facilities")

class Bookmark(Base):
    __tablename__ = "bookmarks"
    id = Column(String(50), primary_key=True, index=True)
    user_id = Column(String(50), ForeignKey("users.id"))
    target_id = Column(String(50), nullable=False)
    target_type = Column(String(20), nullable=False) # ELEVATOR or ROUTE
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="bookmarks")
