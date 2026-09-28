import React, { useState, useRef, useEffect } from 'react';
import SliderTrack from '../../../atoms/SliderTrack/SliderTrack';
import SliderThumb from '../../../atoms/SliderThumb/SliderThumb';
import styles from './Slider.module.css';

/**
 * Linear Slider Molecule
 * 
 * Combines SliderTrack and SliderThumb to provide a draggable slider.
 * Supports continuous and step-based values.
 * 
 * Props:
 * - value: number (Current value)
 * - min: number (Minimum value)
 * - max: number (Maximum value)
 * - step: number (Optional, step increment. If provided, acts as Step Slider)
 * - onChange: function (Callback with new value)
 */
const Slider = ({ 
  value, 
  min = 0, 
  max = 100, 
  step, 
  onChange,
  className = '',
  disabled = false
}) => {
  const [isActive, setIsActive] = useState(false);
  const trackRef = useRef(null);

  // Calculate percentage for display
  const percentage = Math.min(Math.max(((value - min) / (max - min)) * 100, 0), 100);

  const handleInteract = (clientX) => {
    if (disabled || !trackRef.current) return;

    const rect = trackRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const rawRatio = x / rect.width;
    let newValue = rawRatio * (max - min) + min;

    // Apply step snapping
    if (step) {
      const steps = Math.round((newValue - min) / step);
      newValue = min + (steps * step);
    }

    // Clamp value
    newValue = Math.max(min, Math.min(max, newValue));

    if (onChange) {
      onChange(newValue);
    }
  };

  const handleMouseDown = (e) => {
    setIsActive(true);
    handleInteract(e.clientX);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    handleInteract(e.clientX);
  };

  const handleMouseUp = () => {
    setIsActive(false);
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  };

  const handleTouchStart = (e) => {
    setIsActive(true);
    handleInteract(e.touches[0].clientX);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);
  };

  const handleTouchMove = (e) => {
    handleInteract(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    setIsActive(false);
    window.removeEventListener('touchmove', handleTouchMove);
    window.removeEventListener('touchend', handleTouchEnd);
  };

  // Cleanup
  useEffect(() => {
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return (
    <div 
      className={`${styles.container} ${disabled ? styles.disabled : ''} ${className}`}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <SliderTrack ref={trackRef}>
        <div 
          className={styles.fill} 
          style={{ width: `${percentage}%` }} 
        />
        
        {/* Render Step Ticks */}
        {step && (
          <div className={styles.ticks}>
            {Array.from({ length: Math.floor((max - min) / step) + 1 }).map((_, i) => {
              const tickValue = min + (i * step);
              if (tickValue > max) return null; // Safety check
              const tickPercent = ((tickValue - min) / (max - min)) * 100;
              
              // Tick is active if it's within the filled range
              const isTickFilled = tickPercent <= percentage;
              
              // Label is active ONLY if it matches the current value
              const isLabelActive = Math.abs(tickValue - value) < 0.001;

              // Check if first or last
              const isFirst = i === 0;
              const isLast = i === Math.floor((max - min) / step);
              const hideTickDot = isFirst || isLast;
              
              return (
                <React.Fragment key={tickValue}>
                  {/* Internal Tick - Shows fill progress. Hidden for first/last. */}
                  {!hideTickDot && (
                    <div 
                      className={`${styles.tick} ${isTickFilled ? styles.active : ''}`}
                      style={{ left: `${tickPercent}%` }}
                    />
                  )}
                  {/* Step Label (Number) - Highlights strictly current value */}
                  <span 
                    className={`${styles.label} ${isLabelActive ? styles.active : ''}`}
                    style={{ left: `${tickPercent}%` }}
                  >
                    {tickValue}
                  </span>
                </React.Fragment>
              );
            })}
          </div>
        )}

        <SliderThumb 
          isActive={isActive}
          style={{ left: `${percentage}%` }}
        />
      </SliderTrack>
    </div>
  );
};

export default Slider;
