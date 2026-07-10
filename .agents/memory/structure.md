# MetroLift 프로젝트 구조 (Directory Structure)

최근 리팩토링(UI/API/Data 분리)이 반영된 애플리케이션의 디렉토리 구조 및 각 역할에 대한 설명입니다.

```text
MetroLift/
├── .agents/                    # AI 에이전트 관련 설정 및 메모리 공간
│   ├── memory/                 # 에이전트가 기억해야 할 정보 (현재 파일 위치)
│   ├── rules/                  # 에이전트 행동 규칙 (예: education.md)
│   └── workflows/              # 커스텀 워크플로우 (기능 추가 가이드 등)
├── docs/                       # 프로젝트 기획 및 디자인 문서 보관함
│   ├── bible/                  # 기획 원본 문서 (PRD, 기능명세, 기술스택)
│   └── design/                 # 디자인 시스템 및 UI 컴포넌트 규격 명세서
├── public/                     # 정적 에셋 파일 (파비콘 등)
├── src/                        # 프론트엔드 애플리케이션 핵심 소스 코드
│   ├── api/                    # API 통신 레이어 (데이터 가져오기 역할)
│   │   └── mockApi.js          # 실제 서버 통신을 흉내내는 가짜 API 호출 함수
│   ├── assets/                 # 이미지, 로고, 아이콘 등 정적 리소스
│   ├── components/             # 재사용 가능한 UI 컴포넌트 모음 (전시관 역할)
│   │   ├── Button.jsx          # 공통 버튼 컴포넌트
│   │   ├── Card.jsx            # 공통 카드 레이아웃 컴포넌트
│   │   └── ElevatorBottomSheet.jsx # 엘리베이터 상태를 보여주는 하단 시트 컴포넌트
│   ├── data/                   # 정적 가짜 데이터(Mock JSON) 보관 (창고 역할)
│   │   └── mockData.js         # 하드코딩된 강남역 엘리베이터 더미 데이터
│   ├── App.css                 # 메인 앱 전용 컴포넌트 스타일링
│   ├── App.jsx                 # 애플리케이션 메인 엔트리 및 전체 화면 구성 (총괄 매니저 역할)
│   ├── index.css               # 디자인 시스템 기반 전역 CSS 변수 및 기본 스타일 세팅
│   └── main.jsx                # React 앱을 렌더링하는 진입점(Entry Point)
├── generate_tree.sh            # 디렉토리 구조를 가져오기 위해 작성된 Shell 스크립트
├── index.html                  # 메인 HTML 템플릿
├── package.json                # 프로젝트 의존성 라이브러리 및 실행 스크립트 목록
└── vite.config.js              # Vite 빌드 도구 설정 파일
```

### 💡 구조화 핵심 포인트 (UI/API/Data 분리)
* **`src/data`**: 화면에 표시될 **가짜 데이터(Mock Data)** 가 물리적으로 독립된 곳입니다.
* **`src/api`**: 데이터를 네트워크를 통해 가져오는 로직을 시뮬레이션합니다. 추후 **실제 백엔드 API URL로 쉽게 교체** 가능합니다.
* **`src/components`**: 화면을 어떻게 그릴지에만 집중하는 **독립적인 UI 조각**들입니다. 외부(`App.jsx`)에서 주입해주는 데이터를 받아 화면을 구성합니다.
* **`src/App.jsx`**: 데이터를 `api`에서 가져와 상태(State)를 관리하고, 로딩 처리를 한 뒤 `components`에 데이터를 넘겨주는 **컨트롤 타워** 역할을 수행합니다.
