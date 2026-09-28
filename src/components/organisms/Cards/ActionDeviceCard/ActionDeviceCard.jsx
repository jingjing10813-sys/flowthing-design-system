import styles from './ActionDeviceCard.module.css';
import DeviceInfo from '../../../molecules/Display/DeviceInfo/DeviceInfo';
import Button from '../../../atoms/Button/Button';

const ActionDeviceCard = ({ 
  name,
  detailLabel,
  actionLabel, 
  location,
  status, 
  isPlaying = false, 
  onAction,
  icon,
  onClick, /* New Prop */
  isConnected = true,
  style = {},
  className = '',
  isFullWidth = true
}) => {
  
  let buttonVariant = 'neumorph';
  if (!isConnected) {
    buttonVariant = 'ghost';
  } else if (!isPlaying) {
    buttonVariant = 'neumorph-dark';
  }

  const offlineStyle = !isConnected ? { opacity: 0.65 } : {};

  const handleAction = (e) => {
    e.stopPropagation();
    if (isConnected) onAction && onAction();
  };

  return (
    <div 
      className={`
        ${styles.card} 
        ${isPlaying && isConnected ? styles.active : ''} 
        ${!isFullWidth ? styles.compact : ''}
        ${className}
      `} 
      style={{ ...offlineStyle, ...style, cursor: 'default' }}
    >
      <div className={styles.infoWrapper} role={onClick ? 'button' : undefined} tabIndex={onClick ? 0 : undefined} aria-label={onClick ? (detailLabel || `${name || 'Device'} details`) : undefined} onClick={onClick} onKeyDown={onClick ? e => { if(e.key==='Enter'||e.key===' '){e.preventDefault();onClick(e);} } : undefined} style={{cursor:onClick?'pointer':undefined}}>
        <DeviceInfo 
          name={name} 
          location={location}
          status={status} 
          isOn={isPlaying} 
        />
      </div>
      <div className={styles.actionWrapper}>
        <Button 
          aria-label={actionLabel || name || 'Device control'}
          active={isPlaying} 
          icon={icon} 
          onClick={handleAction}
          variant={buttonVariant}
          disabled={!isConnected}
        />
      </div>
    </div>
  );
};

export default ActionDeviceCard;
