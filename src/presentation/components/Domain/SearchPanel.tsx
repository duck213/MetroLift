import React, { useState } from 'react';
import './SearchPanel.css';
import { SearchableSelect } from '../UI/SearchableSelect';
import { Button } from '../UI/Button';
import { Card } from '../UI/Card';

interface SearchPanelProps {
  onSearch: (departure: string, arrival: string) => void;
}

const STATION_OPTIONS = ['강남역', '역삼역', '선릉역', '삼성역', '종합운동장역', '양재역', '신논현역', '판교역'];

export const SearchPanel: React.FC<SearchPanelProps> = ({ onSearch }) => {
  const [departure, setDeparture] = useState('');
  const [arrival, setArrival] = useState('');

  const handleConfirm = () => {
    onSearch(departure, arrival);
  };

  return (
    <div className="search-panel-container">
      <Card variant="pricing">
        <h2 className="search-panel-title">경로 검색</h2>
        <div className="search-inputs">
          <SearchableSelect 
            label="출발지"
            placeholder="출발 역을 검색하세요"
            value={departure}
            onChange={setDeparture}
            options={STATION_OPTIONS}
          />
          
          <SearchableSelect 
            label="도착지"
            placeholder={departure ? "도착 역을 검색하세요" : "출발지를 먼저 입력하세요"}
            value={arrival}
            onChange={(val) => {
              if (departure) setArrival(val);
            }}
            options={departure ? STATION_OPTIONS.filter(opt => opt !== departure) : []}
          />
        </div>
        <div className="search-panel-actions">
          <Button variant="primary" onClick={handleConfirm} style={{ width: '100%' }}>
            경로 찾기
          </Button>
        </div>
      </Card>
    </div>
  );
};
