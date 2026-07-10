import { Elevator } from '../../domain/entities/Elevator';
import mockData from './mockElevatorData.json';

// 💡 교육용 주석: 데이터 계층 (Data Layer) 입니다.
// 식당의 '식재료 창고' 역할입니다. 아직 진짜 서버(공급업체)가 없기 때문에 mockData라는 '가짜 식재료'를 꺼내줍니다.
// 나중에 서버가 생기면, 여기 내용만 API 통신(fetch 등)으로 바꾸면 끝입니다!

export const fetchElevatorsMock = async (): Promise<Elevator[]> => {
  // 실제 API 통신처럼 보이도록 약간의 지연(delay) 추가 (0.5초 대기)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockData as Elevator[]);
    }, 500);
  });
};
