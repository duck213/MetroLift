import React from 'react';
import './Button.css';

// 💡 교육용 주석: Button 컴포넌트입니다. (마치 식당의 예쁜 그릇과 같이 UI를 담당합니다)
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'icon-circular';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', children, ...props }) => {
  return (
    <button className={`btn btn-${variant}`} {...props}>
      {children}
    </button>
  );
};
