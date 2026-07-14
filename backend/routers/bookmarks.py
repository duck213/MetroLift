from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
import uuid

import models
import schemas
from database import get_db

router = APIRouter()

# 💡 교육용 주석: 즐겨찾기의 생성(POST), 조회(GET), 삭제(DELETE) 3가지 기능을 제공합니다.

@router.post("/", response_model=schemas.Bookmark, status_code=status.HTTP_201_CREATED)
def create_bookmark(bookmark: schemas.BookmarkCreate, db: Session = Depends(get_db)):
    """즐겨찾기를 새로 추가합니다."""
    db_bookmark = models.Bookmark(
        id=f"B{uuid.uuid4().hex[:8].upper()}",
        user_id=bookmark.user_id,
        target_id=bookmark.target_id,
        target_type=bookmark.target_type
    )
    db.add(db_bookmark)
    db.commit()
    db.refresh(db_bookmark)
    return db_bookmark

@router.get("/", response_model=List[schemas.Bookmark])
def get_bookmarks(user_id: str = Query(..., description="사용자 ID"), db: Session = Depends(get_db)):
    """특정 사용자의 즐겨찾기 목록을 조회합니다."""
    # 💡 교육용 주석: user_id 기준으로 DB에서 해당 사용자가 저장한 즐겨찾기만 가져옵니다.
    return db.query(models.Bookmark).filter(models.Bookmark.user_id == user_id).all()

@router.delete("/{bookmark_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_bookmark(bookmark_id: str, db: Session = Depends(get_db)):
    """즐겨찾기를 삭제합니다."""
    # 💡 교육용 주석: 삭제할 대상이 없으면 404 에러를 반환합니다.
    db_bookmark = db.query(models.Bookmark).filter(models.Bookmark.id == bookmark_id).first()
    if db_bookmark is None:
        raise HTTPException(status_code=404, detail="Bookmark not found")
    db.delete(db_bookmark)
    db.commit()
    return None
