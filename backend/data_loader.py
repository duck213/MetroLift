import json
import csv
import re
import random
from pathlib import Path

# 💡 교육용 주석: 데이터 파일 3종(서울JSON, 서울CSV, 경기도CSV)을 읽어서
# 역 이름 기준으로 합치는(Join) '데이터 조리사' 모듈입니다.

DATA_DIR = Path(__file__).parent / "data"

def _parse_wkt_point(wkt_str: str):
    """WKT 형식 'POINT(경도 위도)'에서 위도/경도를 추출합니다."""
    # 💡 교육용 주석: POINT(127.017 37.573) → lng=127.017, lat=37.573
    match = re.match(r"POINT\(([\d.]+)\s+([\d.]+)\)", wkt_str)
    if match:
        lng = float(match.group(1))
        lat = float(match.group(2))
        return lat, lng
    return None, None

def _load_json_coordinates():
    """JSON 파일에서 역 이름별 좌표 목록을 구축합니다."""
    # 💡 교육용 주석: JSON 파일은 좌표(위도/경도)를 가진 유일한 데이터입니다.
    json_path = DATA_DIR / "서울시 지하철역 엘리베이터 위치정보.json"
    coords_by_station = {}
    
    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    for item in data.get("DATA", []):
        station_name = item.get("sbwy_stn_nm", "").strip()
        wkt = item.get("node_wkt", "")
        lat, lng = _parse_wkt_point(wkt)
        
        if station_name and lat and lng:
            if station_name not in coords_by_station:
                coords_by_station[station_name] = []
            coords_by_station[station_name].append({
                "lat": lat,
                "lng": lng,
                "node_id": item.get("node_id"),
                "node_type_cd": item.get("node_type_cd", "0"),
                "sgg_nm": item.get("sgg_nm", ""),
                "emd_nm": item.get("emd_nm", "")
            })
    
    return coords_by_station

def _clean_station_name(name: str) -> str:
    """역명에서 괄호와 번호를 제거하여 매칭 키를 만듭니다."""
    # 💡 교육용 주석: '서울역(1)' → '서울역', '건대입구' → '건대입구'
    cleaned = re.sub(r"\(.*?\)", "", name).strip()
    if cleaned.endswith("역"):
        cleaned = cleaned[:-1]  # '서울역' → '서울'
    return cleaned

def _load_seoul_csv():
    """서울교통공사 CSV에서 엘리베이터 정보를 읽습니다."""
    csv_path = DATA_DIR / "서울교통공사_엘리베이터 설치현황_20260211.csv"
    elevators = []
    
    with open(csv_path, "r", encoding="cp949") as f:
        reader = csv.DictReader(f)
        for row in reader:
            elevators.append({
                "source": "서울교통공사",
                "line": row.get("호선", "").strip(),
                "station_name": row.get("역  명", "").strip(),
                "elevator_id": row.get("관리번호(호기)", "").strip(),
                "exit_number": row.get("(근접)출입구번호", "").strip(),
                "location_detail": row.get("시작층(상세위치)", "").strip(),
                "start_floor_type": row.get("시작층(지상_지하)", "").strip(),
                "start_floor": row.get("시작층(운행역층)", "").strip(),
                "end_floor_type": row.get("종료층(지상_지하)", "").strip(),
                "end_floor": row.get("종료층(운행역층)", "").strip(),
                "capacity_persons": row.get("정원(인원수)", "").strip(),
                "capacity_kg": row.get("정원(중량)", "").strip(),
                "serial_number": row.get("승강기 일련번호", "").strip(),
            })
    
    return elevators

def _load_gyeonggi_csv():
    """경기도 CSV에서 엘리베이터 정보를 읽습니다."""
    csv_path = DATA_DIR / "경기도역사내승강기현황.csv"
    elevators = []
    
    with open(csv_path, "r", encoding="cp949") as f:
        reader = csv.DictReader(f)
        for row in reader:
            elevators.append({
                "source": "경기도",
                "line": row.get("선명", "").strip(),
                "station_name": row.get("역명", "").strip(),
                "elevator_id": row.get("역코드", "").strip() + "-" + row.get("출입구번호", "").strip(),
                "exit_number": row.get("출입구번호", "").strip(),
                "location_detail": row.get("위치", "").strip(),
                "start_floor_type": row.get("시작층명", "").strip(),
                "start_floor": row.get("시작운행층수", "").strip(),
                "end_floor_type": row.get("종료층명", "").strip(),
                "end_floor": row.get("종료운행층수", "").strip(),
                "capacity_persons": row.get("정원수", "").strip(),
                "capacity_kg": row.get("정원무게", "").strip(),
                "serial_number": "",
            })
    
    return elevators

def load_all_elevators():
    """3개의 데이터 소스를 합치고 좌표를 매칭하여 반환합니다."""
    # 💡 교육용 주석: 이 함수가 메인 조리사입니다.
    # CSV에서 상세 정보를, JSON에서 좌표를 가져와 역 이름으로 합칩니다.
    
    coords_map = _load_json_coordinates()
    seoul_data = _load_seoul_csv()
    gyeonggi_data = _load_gyeonggi_csv()
    
    all_elevators = seoul_data + gyeonggi_data
    result = []
    
    for idx, elev in enumerate(all_elevators):
        raw_name = elev["station_name"]
        clean_name = _clean_station_name(raw_name)
        
        # 좌표 매칭 시도: 원본 이름 → 정리된 이름 순서로 검색
        coords_list = coords_map.get(raw_name) or coords_map.get(clean_name)
        
        if not coords_list:
            # 역 이름에서 '역' 붙여서 재시도
            coords_list = coords_map.get(clean_name + "역")
        
        if coords_list:
            # 좌표가 여러개면 첫번째 사용
            coord = coords_list[0]
            lat, lng = coord["lat"], coord["lng"]
        else:
            # 좌표 매칭 실패 시 None
            lat, lng = None, None
        
        # 지상/지하 판별
        location_type = "지하"
        if elev["start_floor_type"] == "지상" or elev["end_floor_type"] == "지상":
            location_type = "지상"
        
        result.append({
            "id": f"EL-{idx+1:04d}",
            "station_name": raw_name,
            "line": elev["line"],
            "source": elev["source"],
            "elevator_id": elev["elevator_id"],
            "exit_number": elev["exit_number"],
            "location_detail": elev["location_detail"],
            "location_type": location_type,
            "start_floor": elev["start_floor"],
            "end_floor": elev["end_floor"],
            "capacity_persons": elev["capacity_persons"],
            "capacity_kg": elev["capacity_kg"],
            "status": "정상",  # 기본값 (실시간 API 연동 전까지)
            "lat": lat,
            "lng": lng,
            "has_coordinates": lat is not None,
        })
    
    return result

# 서버 시작 시 한 번만 로드하여 메모리에 캐싱
_cached_elevators = None

def get_cached_elevators():
    """캐싱된 엘리베이터 데이터를 반환합니다."""
    global _cached_elevators
    if _cached_elevators is None:
        _cached_elevators = load_all_elevators()
    return _cached_elevators
