import React from 'react';
import styles from './Button.module.css';

/**
 * Button Component (Atom)
 * 
 * Represents a button with simplified states:
 * - Active (Binary: On)
 * - Default (Binary: Off)
 * - Disabled (Interactive State)
 * 
 * Maps to Figma properties: 
 * - Binary = On | Off
 * - Disabled = true | false
 */
const Button = ({ 
  active = false, // Functionally maps to "Binary = On/Off"
  disabled = false, // Functionally maps to "Disabled" state
  variant = 'neumorph', // 'neumorph' | 'filled' | 'ghost' | 'neumorphDark'
  onClick, 
  icon,
  children,
  className = '',
  ...props 
}) => {
  // Determine variant class
  let variantClass = styles.off; // Default (neumorph off)
  
  if (variant === 'filled') {
    variantClass = styles.filled;
  } else if (variant === 'ghost') {
    variantClass = styles.ghost;
  } else if (variant === 'neumorph-dark') {
    variantClass = styles.neumorphDark;
  } else {
    // Neumorph logic
    if (disabled) {
      variantClass = styles.disabled;
    } else if (active) {
      variantClass = styles.on;
    }
  }

  return (
    <button
      className={`${styles.root} ${variantClass} ${className}`}
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
      aria-pressed={active}
      aria-disabled={disabled}
      {...props}
    >
      {icon && <div className={styles.icon}>{icon}</div>}
      {children && <span className={styles.label}>{children}</span>}
    </button>
  );
};

export default Button;
