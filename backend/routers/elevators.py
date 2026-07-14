from fastapi import APIRouter, Query
from typing import List, Optional
from data_loader import get_cached_elevators

# 💡 교육용 주석: DB 대신 CSV/JSON 파일에서 파싱한 데이터를 메모리 캐시로 제공하는 라우터입니다.

router = APIRouter()

@router.get("/")
def get_elevators(
    stationName: Optional[str] = Query(None, description="역 이름으로 필터링"),
    line: Optional[str] = Query(None, description="호선으로 필터링"),
    has_coordinates: Optional[bool] = Query(None, description="좌표 있는 것만 필터링"),
):
    """엘리베이터 전체 목록을 반환합니다. 선택적 필터링 가능."""
    elevators = get_cached_elevators()
    
    # 💡 교육용 주석: 필터 조건이 있으면 해당하는 것만 골라냅니다.
    if stationName:
        elevators = [e for e in elevators if stationName in e["station_name"]]
    if line:
        elevators = [e for e in elevators if line in e["line"]]
    if has_coordinates is not None:
        elevators = [e for e in elevators if e["has_coordinates"] == has_coordinates]
    
    return elevators

@router.get("/stats")
def get_elevator_stats():
    """엘리베이터 데이터의 통계 정보를 반환합니다."""
    elevators = get_cached_elevators()
    
    total = len(elevators)
    with_coords = sum(1 for e in elevators if e["has_coordinates"])
    seoul_count = sum(1 for e in elevators if e["source"] == "서울교통공사")
    gyeonggi_count = sum(1 for e in elevators if e["source"] == "경기도")
    
    return {
        "total": total,
        "with_coordinates": with_coords,
        "without_coordinates": total - with_coords,
        "seoul_count": seoul_count,
        "gyeonggi_count": gyeonggi_count,
    }

@router.get("/{elevator_id}")
def get_elevator(elevator_id: str):
    """단일 엘리베이터 상세 정보를 반환합니다."""
    elevators = get_cached_elevators()
    for e in elevators:
        if e["id"] == elevator_id:
            return e
    return {"error": "Elevator not found"}
