import React from 'react';
import styles from './SliderThumb.module.css';

/**
 * SliderThumb Atom
 * 
 * Visual component representing the draggable handle.
 */
const SliderThumb = React.forwardRef(({ 
  isActive = false,
  className = '',
  style = {},
  children,
  ...props 
}, ref) => {
  return (
    <div 
      ref={ref}
      className={`${styles.thumb} ${isActive ? styles.active : ''} ${className}`} 
      style={style}
      {...props}
    >
      {children}
    </div>
  );
});

export default SliderThumb;
