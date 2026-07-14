# MetroLift RESTFul API 명세서

본 문서는 `FUNCTIONS.md`의 기능 명세와 현재 정의된 엘리베이터 데이터 모델을 바탕으로 작성된 백엔드 연동용 API 스펙입니다.

> 💡 **교육용 주석 (API와 RESTful이란?)**
> - **API (Application Programming Interface)**: 식당의 '점원'과 같습니다. 손님(프론트엔드)이 메뉴(요청)를 점원에게 말하면, 점원이 주방(백엔드)에서 요리(데이터)를 가져와 줍니다.
> - **RESTful**: 점원에게 주문하는 '표준화된 방식(규칙)'입니다. 예를 들어 "엘리베이터 정보 줘(GET)", "새로운 신고 등록해(POST)"처럼 정해진 동사(HTTP 메서드)와 주소(Endpoint)를 사용하는 약속입니다.
> - **Endpoint**: 식당의 '테이블 번호'나 '주문 창구'처럼, 특정 데이터에 접근하기 위한 고유한 URL 주소입니다.
> - **JSON (JavaScript Object Notation)**: 점원이 주방에서 가져오는 음식(데이터)을 담는 '표준 도시락통' 모양입니다. 키와 값으로 이루어져 있어 읽기 쉽습니다.

---

## 1. 엘리베이터 및 지도 도메인 (Elevator & Map)

### 1.1 엘리베이터 전체 목록 조회
지도 상에 엘리베이터 마커를 표시하고 실시간 가동 현황(정상, 점검 중, 고장)을 확인하기 위해 사용합니다. (기능 명세서의 '핵심 지도 기능' 및 '실시간 가동 현황')

- **URL**: `/api/elevators`
- **Method**: `GET`
- **Query Parameters**:
  - `stationName` (선택): 특정 지하철역만 필터링할 때 사용
- **Response (Success - 200 OK)**:
  ```json
  {
    "value": [
      {
        "id": "EL-0001",
        "station_name": "서울역(1)",
        "line": "1호선",
        "source": "서울교통공사",
        "elevator_id": "내부#1",
        "exit_number": "시청 방면5-1",
        "location_detail": "시청 방면5-1",
        "location_type": "지하",
        "start_floor": "2",
        "end_floor": "1",
        "capacity_persons": "11",
        "capacity_kg": "750",
        "status": "정상",
        "lat": 37.557295,
        "lng": 126.973120,
        "has_coordinates": true
      }
    ],
    "Count": 1
  }
  ```

### 1.2 단일 엘리베이터 상세 정보 조회
- **URL**: `/api/elevators/{id}`
- **Method**: `GET`
- **Response (Success - 200 OK)**: 해당 엘리베이터 객체 1개 반환

---

## 2. 동선 및 길 찾기 도메인 (Navigation)

### 2.1 엘리베이터 중심 최적 경로 조회
출구-개찰구-승강장을 연결하는 단절 없는 엘리베이터 중심 동선과 이동 난이도, 예상 시간을 제공합니다. (기능 명세서의 '출구-개찰구-승강장 연결 동선', '이동 난이도 및 예상 시간 제공')

- **URL**: `/api/routes`
- **Method**: `GET`
- **Query Parameters**:
  - `startStation`: 출발역 (예: 강남역)
  - `endStation`: 도착역 (예: 양재역)
- **Response (Success - 200 OK)**:
  ```json
  {
    "routeId": "R001",
    "estimatedTimeMinutes": 15,
    "difficultyLevel": "쉬움",
    "path": [
      {
        "step": 1,
        "instruction": "강남역 2번 출구 지상 엘리베이터 탑승",
        "elevatorId": "E001"
      },
      {
        "step": 2,
        "instruction": "지하 1층 대합실에서 2호선 개찰구 방향으로 50m 이동"
      }
    ]
  }
  ```

---

## 3. 편의시설 도메인 (Facilities)

### 3.1 역별 교통약자 편의시설 조회
장애인 화장실, 휠체어 급속충전기, 수어 영상 전화기 등의 위치를 제공합니다. (기능 명세서의 '편의시설 연계 정보')

- **URL**: `/api/facilities`
- **Method**: `GET`
- **Query Parameters**:
  - `stationName`: 조회할 역사 이름
- **Response (Success - 200 OK)**:
  ```json
  [
    {
      "id": "F001",
      "type": "장애인 화장실",
      "location": "지하 1층 2번 출구 방면",
      "status": "이용 가능"
    },
    {
      "id": "F002",
      "type": "휠체어 급속충전기",
      "location": "지하 2층 개찰구 안쪽",
      "status": "이용 가능"
    }
  ]
  ```

---

## 4. 사용자 편의 및 커뮤니티 (User & Community)

### 4.1 즐겨찾기 추가
자주 방문하는 역이나 경로를 저장하여 빠르게 접근할 수 있도록 합니다. (기능 명세서의 '즐겨찾기')

- **URL**: `/api/bookmarks`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "userId": "user_12345",
    "targetId": "E001",
    "type": "ELEVATOR" 
  }
  ```
- **Response (Success - 201 Created)**: 생성된 즐겨찾기 정보 반환

### 4.2 즐겨찾기 목록 조회
사용자가 저장한 즐겨찾기 목록을 조회합니다.

- **URL**: `/api/bookmarks?user_id={user_id}`
- **Method**: `GET`
- **Response (Success - 200 OK)**:
  ```json
  [
    {
      "id": "B12345678",
      "user_id": "user_12345",
      "target_id": "E001",
      "target_type": "ELEVATOR",
      "created_at": "2023-10-27T10:00:00Z"
    }
  ]
  ```

### 4.3 즐겨찾기 삭제
지정된 즐겨찾기 항목을 삭제합니다.

- **URL**: `/api/bookmarks/{bookmark_id}`
- **Method**: `DELETE`
- **Response (Success - 204 No Content)**: 삭제 성공 시 빈 본문 반환
