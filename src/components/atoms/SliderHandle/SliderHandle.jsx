import React from 'react';
import styles from './SliderHandle.module.css';

/**
 * SliderHandle Atom
 * 
 * Visual component representing the draggable bar handle.
 * Typically used in LightControlSlider.
 */
const SliderHandle = React.forwardRef(({ 
  className = '',
  style = {},
  ...props 
}, ref) => {
  return (
    <div 
      ref={ref}
      className={`${styles.handle} ${className}`} 
      style={style}
      {...props}
    />
  );
});

export default SliderHandle;
