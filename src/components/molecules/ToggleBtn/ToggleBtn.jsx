import React from 'react';
import SliderThumb from '../../atoms/SliderThumb/SliderThumb';
import styles from './ToggleBtn.module.css';

/**
 * ToggleBtn Molecule
 * 
 * A toggle switch component using SliderThumb as the handle.
 * Replicates the Figma design with specific gradients and animations.
 * 
 * @param {boolean} isOn - Current toggle state.
 * @param {function} onToggle - Callback function when toggled.
 * @param {string} className - Optional external class implementation.
 */
const ToggleBtn = ({ isOn = false, onToggle, className = '', size = 'medium' }) => {
  return (
    <div 
      className={`${styles.container} ${isOn ? styles.on : styles.off} ${size === 'small' ? styles.small : ''} ${className}`}
      onClick={onToggle}
    >
      <SliderThumb 
        className={`${styles.thumbOverride} ${isOn ? styles.thumbOn : styles.thumbOff}`}
      />
    </div>
  );
};

export default ToggleBtn;
