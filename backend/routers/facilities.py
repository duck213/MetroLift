from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

import models
import schemas
from database import get_db

router = APIRouter()

@router.get("/", response_model=List[schemas.Facility])
def get_facilities(stationName: str = None, db: Session = Depends(get_db)):
    if stationName:
        return db.query(models.Facility).filter(models.Facility.station_name == stationName).all()
    return db.query(models.Facility).all()
