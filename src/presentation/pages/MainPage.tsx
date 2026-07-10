import React, { useState } from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { Header } from '../components/Layout/Header';
import { SearchPanel } from '../components/Domain/SearchPanel';
import './MainPage.css';

const mapContainerStyle = {
  width: '100%',
  height: '100%'
};

const center = {
  lat: 37.4979,
  lng: 127.0276 // 강남역 기준 좌표
};

export const MainPage: React.FC = () => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: '' // 구글 맵 API KEY (빈 값 시 개발자용 워터마크 표시)
  });

  const [departure, setDeparture] = useState('');
  const [arrival, setArrival] = useState('');

  const handleRouteSearch = (dep: string, arr: string) => {
    setDeparture(dep);
    setArrival(arr);
    // 💡 교육용 주석: 출발지와 도착지가 세팅되면 콘솔에 로그를 남기고, 향후 API 연동 로직이 들어갑니다.
    console.log(`경로 검색: ${dep} -> ${arr}`);
  };

  return (
    <div className="main-page">
      <Header />
      
      <div className="map-container">
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={14}
            options={{
              disableDefaultUI: true, // 구글맵의 불필요한 기본 UI 숨김
            }}
          >
            {/* 추후 엘리베이터 마커 및 경로 렌더링 영역 */}
          </GoogleMap>
        ) : (
          <div className="map-placeholder">
            지도를 불러오는 중입니다...
          </div>
        )}
      </div>

      <SearchPanel onSearch={handleRouteSearch} />
    </div>
  );
};
