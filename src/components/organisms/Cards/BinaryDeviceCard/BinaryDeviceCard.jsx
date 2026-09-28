import styles from './BinaryDeviceCard.module.css';
import DeviceInfo from '../../../molecules/Display/DeviceInfo/DeviceInfo';
import Button from '../../../atoms/Button/Button';

const BinaryDeviceCard = ({ 
  name,
  detailLabel,
  actionLabel,
  location, 
  status, 
  isOn, 
  onToggle,
  icon,
  onClick, /* New Prop for Navigation */
  isActuatable = true,
  showControl = true,
  isConnected = true,
  variant = 'default',
  style = {},
  className = '',
  isFullWidth = true /* Default to true if not specified */
}) => {
  
  // Determine Button Variant
  let buttonVariant = 'neumorph';
  if (!isConnected) {
    buttonVariant = 'ghost';
  } else if (!isActuatable) {
    buttonVariant = 'filled';
  } else if (!isOn) {
    buttonVariant = 'neumorph-dark';
  }

  // Determine Card Opacity for Offline state
  const offlineStyle = !isConnected ? { opacity: 0.65 } : {};

  const handleToggle = (e) => {
    e.stopPropagation(); // Prevent card click
    if (isConnected && isActuatable) onToggle && onToggle();
  };

  return (
    <div 
      className={`
        ${styles.card} 
        ${variant === 'minimal' ? styles.cardMinimal : ''} 
        ${isOn && isConnected ? styles.active : ''} 
        ${!isFullWidth ? styles.compact : ''} 
        ${className}
      `} 
      style={{ ...offlineStyle, ...style, cursor: 'default' }}
    >
      <div className={`${styles.infoWrapper} ${variant === 'minimal' ? styles.infoWrapperMinimal : ''}`} role={onClick ? 'button' : undefined} tabIndex={onClick ? 0 : undefined} aria-label={onClick ? (detailLabel || `${name || 'Device'} details`) : undefined} onClick={onClick} onKeyDown={onClick ? e => { if(e.key==='Enter'||e.key===' '){e.preventDefault();onClick(e);} } : undefined} style={{cursor:onClick?'pointer':undefined}}>
        <DeviceInfo 
          name={name} 
          location={location}
          status={status}
          isOn={isOn} 
          variant={variant}
        />
      </div>
      {showControl && <div className={styles.actionWrapper}>
        <Button 
          aria-label={actionLabel || name || 'Device control'}
          active={isOn} 
          icon={icon} 
          onClick={handleToggle}
          variant={buttonVariant}
          disabled={!isConnected || !isActuatable}
        />
      </div>}
    </div>
  );
};

export default BinaryDeviceCard;
