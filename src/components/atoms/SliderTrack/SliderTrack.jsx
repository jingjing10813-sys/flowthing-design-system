import React, { forwardRef } from 'react';
import styles from './SliderTrack.module.css';

/**
 * SliderTrack Atom
 * 
 * Visual component representing the background track of a slider.
 */
const SliderTrack = forwardRef(({ 
  children,
  className = '',
  ...props 
}, ref) => {
  return (
    <div 
      ref={ref}
      className={`${styles.track} ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
});

SliderTrack.displayName = 'SliderTrack';

export default SliderTrack;
