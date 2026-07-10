// 💡 교육용 주석: 도메인 계층입니다. 
// 식당의 '레시피'나 '식재료 규격'에 해당합니다. 화면이나 서버가 어떻게 생겼든, 우리 앱에서 엘리베이터란 이런 데이터라는 걸 정의합니다.

export interface Elevator {
  id: string;
  stationName: string;
  status: '정상' | '점검' | '고장';
  locationType: '지상' | '지하';
  coordinates: {
    lat: number;
    lng: number;
  };
}
