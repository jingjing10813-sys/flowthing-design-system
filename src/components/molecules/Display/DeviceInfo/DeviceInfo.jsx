import React from 'react';
import styles from './DeviceInfo.module.css';

const DeviceInfo = ({ 
  name, 
  status, 
  isOn = false,
  location,
  variant = 'default'
}) => {
  if (variant === 'minimal') {
      return (
        <div className={styles.container}>
            <div className={styles.statusContainerMinimal}>
                {/* Caption 'Status' removed for simplicity */}
                <span className={`${styles.statusMinimal} ${isOn ? styles.onMinimal : ''}`}>
                    {status}
                </span>
            </div>
        </div>
      );
  }

  return (
    <div className={styles.container}>
      {location && <span className={styles.location}>{location}</span>}
      <div className={styles.nameRow}>
          {name && <h3 className={styles.name}>{name}</h3>}
          <span className={`${styles.status} ${isOn ? styles.on : ''}`}>{status}</span>
      </div>
    </div>
  );
};

export default DeviceInfo;
