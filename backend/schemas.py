from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

# 💡 교육용 주석: 프론트엔드와 주고받는 데이터의 '검문소' 역할을 하는 모델들입니다.

class ElevatorBase(BaseModel):
    station_name: str
    status: str
    location_type: str
    lat: float
    lng: float

class Elevator(ElevatorBase):
    id: str
    last_updated: datetime
    
    class Config:
        from_attributes = True

class FacilityBase(BaseModel):
    station_name: str
    type: str
    location_desc: str
    status: Optional[str] = None

class Facility(FacilityBase):
    id: str
    
    class Config:
        from_attributes = True

class BookmarkCreate(BaseModel):
    user_id: str
    target_id: str
    target_type: str

class Bookmark(BookmarkCreate):
    id: str
    created_at: datetime
    
    class Config:
        from_attributes = True
