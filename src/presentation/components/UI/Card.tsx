import React from 'react';
import './Card.css';

// 💡 교육용 주석: Card 컴포넌트입니다. 관련된 정보를 하나의 박스로 묶어 시각적으로 깔끔하게 보여줍니다.
interface CardProps {
  variant?: 'pricing' | 'color-block' | 'color-block-navy';
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ variant = 'pricing', children }) => {
  return (
    <div className={`card card-${variant}`}>
      {children}
    </div>
  );
};
