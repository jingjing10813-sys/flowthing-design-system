import React, { useState, useRef, useEffect } from 'react';
import { NavArrowDown } from 'iconoir-react';
import styles from './Dropdown.module.css';

const Dropdown = ({ 
  options = [], 
  value, 
  onChange, 
  placeholder = 'Select...',
  disabled = false,
  className = '',
  style = {}
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const toggleOpen = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Find label for current value
  const selectedOption = options.find(opt => opt.value === value);
  const displayLabel = selectedOption ? selectedOption.label : placeholder;

  return (
    <div 
      className={`${styles.container} ${className}`} 
      style={style}
      ref={containerRef}
    >
      <div 
        className={`${styles.trigger} ${isOpen ? styles.isOpen : ''} ${disabled ? styles.disabled : ''}`} 
        onClick={toggleOpen}
      >
        <span>{displayLabel}</span>
        <div className={styles.icon}>
          <NavArrowDown width={12} height={12} strokeWidth={1.5} color="currentColor" />
        </div>
      </div>

      <div className={`${styles.menu} ${isOpen ? styles.isOpen : ''}`}>
        {options.map((option) => (
          <div 
            key={option.value} 
            className={`${styles.item} ${value === option.value ? styles.selected : ''}`}
            onClick={() => handleSelect(option)}
          >
            {option.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dropdown;
