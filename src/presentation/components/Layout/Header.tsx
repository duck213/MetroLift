import React from 'react';
import { Globe, Bell } from 'lucide-react';
import './Header.css';

// 💡 교육용 주석: 화면 최상단에 고정되는 헤더입니다. 앱의 얼굴 역할을 합니다.
export const Header: React.FC = () => {
  return (
    <header className="mobile-header">
      <button className="icon-btn">
        <Globe size={24} />
      </button>
      <h1 className="header-title">MetroLift</h1>
      <button className="icon-btn">
        <Bell size={24} />
      </button>
    </header>
  );
};
