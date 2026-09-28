import React from 'react';
import styles from './Chip.module.css';

const Chip = ({ 
  label, 
  active = false, 
  variant = 'solid', // 'solid' | 'ghost'
  onClick,
  className = '',
  style = {}
}) => {
  return (
    <div 
      className={`
        ${styles.chip} 
        ${styles[variant]} 
        ${active ? styles.active : ''} 
        ${className}
      `}
      onClick={onClick}
      style={style}
    >
      {label}
    </div>
  );
};

export default Chip;
