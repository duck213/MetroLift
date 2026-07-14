from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base, SessionLocal
import models
from routers import elevators, facilities, bookmarks
from data_loader import get_cached_elevators

# 💡 교육용 주석: 데이터베이스 테이블을 실제로 생성합니다. (만약 없으면 만듭니다)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="MetroLift API", description="MetroLift 백엔드 서버 - 수도권 지하철 엘리베이터 정보")

# 💡 교육용 주석: CORS 설정 - 프론트엔드(React)에서 백엔드로 요청할 수 있게 허용하는 '출입 허가증'입니다.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 개발 중에는 모든 출처 허용
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 💡 교육용 주석: 각 기능별 라우터(창구)를 메인 앱에 등록합니다.
app.include_router(elevators.router, prefix="/api/elevators", tags=["elevators"])
app.include_router(facilities.router, prefix="/api/facilities", tags=["facilities"])
app.include_router(bookmarks.router, prefix="/api/bookmarks", tags=["bookmarks"])

# 💡 교육용 주석: 서버 시작 시 CSV/JSON 데이터를 미리 로드합니다.
@app.on_event("startup")
def startup_event():
    data = get_cached_elevators()
    total = len(data)
    with_coords = sum(1 for e in data if e["has_coordinates"])
    print(f"🚇 엘리베이터 데이터 로드 완료: 총 {total}건 (좌표 매칭: {with_coords}건)")

@app.get("/")
def read_root():
    return {"message": "Welcome to MetroLift API! 수도권 지하철 엘리베이터 정보 서비스입니다."}
