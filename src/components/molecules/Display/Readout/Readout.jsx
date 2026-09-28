import React from 'react';
import styles from './Readout.module.css';

/**
 * Readout Molecule
 * 
 * Displays a value with a unit and a label underneath.
 * Commonly used inside gauges or control panels.
 */
const Readout = ({ 
  value, 
  unit = '°', 
  label 
}) => {
  return (
    <div className={styles.display}>
      <span className={styles.valueWrapper}>
        {value}
        <span className={styles.unit}>{unit}</span>
      </span>
      {label && <span className={styles.label}>{label}</span>}
    </div>
  );
};

export default Readout;
