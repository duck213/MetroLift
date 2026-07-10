기술 스택 정의 (Technical Stack)

내가 쓰고 있는 휴대폰이 아이폰 기종이므로 웹 기반으로 구현 부탁드립니다. 

이 서비스는 외국인 고령자 및 장애인을 대상으로 하므로, 웹 기반의 크로스 플랫폼 애플리케이션 형태가 적합하며 다음과 같은 기술 스택을 제안합니다.

• Frontend (모바일 앱/웹):
 o Framework: Flutter 또는 React Native (Android와 iOS 동시 지원 가능).
 o Styling: 사용자 요청에 따른 그라디언트(Gradient) 디자인 적용 및 접근성을 고려한 고대비 UI.
 o Maps: Google Maps JavaScript API를 사용하여 글로벌 현지화(Localization) 기능 적용.

---

• Backend:
 o Runtime: Node.js 또는 Python (공공데이터의 JSON/CSV 연동 및 처리에 유리).
 o Database: Firebase (실시간 데이터 연동 및 즐겨찾기 저장용) 또는 PostgreSQL.

---

• Data & APIs:
 o Location Data: 서울교통공사 편의시설 위치정보 API 및 국가철도공단 역사별 엘리베이터 이동동선 API.
 o Real-time Status: 지하철 승강기 가동현황 API (정상, 점검, 고장 상태 확인).
 o Localization: Google Maps의 language 및 region 매개변수를 활용한 다국어 지원
