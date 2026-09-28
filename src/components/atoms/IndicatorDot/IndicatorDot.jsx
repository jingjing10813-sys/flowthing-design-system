import React from 'react';
import styles from './IndicatorDot.module.css';

/**
 * IndicatorDot Atom
 * 
 * Represents a position indicator on a circular track.
 * Used in TemperatureControl and potentially other gauge-like inputs.
 * 
 * @param {string} variant - 'target' (solid) or 'current' (glass)
 * @param {string} className - Additional classes
 * @param {object} style - Inline styles (mostly for positioning)
 */
const IndicatorDot = ({ 
  variant = 'target', 
  className = '',
  style,
  ...props 
}) => {
  const variantClass = styles[variant] || styles.target;

  return (
    <div 
      className={`${styles.dot} ${variantClass} ${className}`} 
      style={style}
      {...props}
    />
  );
};

export default IndicatorDot;
