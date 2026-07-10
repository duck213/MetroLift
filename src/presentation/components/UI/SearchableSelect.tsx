import React, { useState } from 'react';
import './SearchableSelect.css';
import { Button } from './Button';

// 💡 교육용 주석: 사용자가 역 이름을 타이핑하면, 목록에서 필터링해서 보여주는 '검색 가능한 셀렉트 박스' 입니다.
interface SearchableSelectProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (val: string) => void;
  options: string[];
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  label,
  placeholder,
  value,
  onChange,
  options
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredOptions = options.filter(opt => opt.includes(searchTerm));

  const handleSelect = (opt: string) => {
    onChange(opt);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="searchable-select-container">
      <label className="select-label">{label}</label>
      <div className="select-input-wrapper">
        <input 
          type="text"
          className="select-input"
          placeholder={value || placeholder}
          value={isOpen ? searchTerm : value}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
            if (!isOpen) onChange('');
          }}
          onFocus={() => setIsOpen(true)}
        />
        {value && !isOpen && (
           <button className="clear-btn" onClick={() => onChange('')}>×</button>
        )}
      </div>

      {isOpen && (
        <div className="select-dropdown">
          <ul className="select-list">
            {filteredOptions.length > 0 ? (
              filteredOptions.map(opt => (
                <li key={opt} className="select-item" onClick={() => handleSelect(opt)}>
                  {opt}
                </li>
              ))
            ) : (
              <li className="select-item empty">검색 결과가 없습니다.</li>
            )}
          </ul>
          <div className="select-actions">
            <Button variant="secondary" onClick={() => setIsOpen(false)}>취소</Button>
          </div>
        </div>
      )}
    </div>
  );
};
