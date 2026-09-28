import { useExperienceState } from '../Dashboard/experience-state';
import React from 'react';
import styles from './WasherControl.module.css';
import TabBar from '../../organisms/Navigation/TabBar/TabBar';
import dashboardBg from '../../../assets/images/dashboard_bg_mono.png';
import { NavArrowLeft, SystemShut } from 'iconoir-react';
import BinaryDeviceCard from '../../organisms/Cards/BinaryDeviceCard/BinaryDeviceCard';
import Chip from '../../atoms/Chip/Chip';
import Button from '../../atoms/Button/Button';

const WasherControl = ({ onNavigate }) => {
    const [navTab, setNavTab] = useExperienceState('washer', 'navTab', 'devices');
    const [isOn, setIsOn] = useExperienceState('washer', 'isOn', true);
    const [operationalState, setOperationalState] = useExperienceState('washer', 'operationalState', 'Stopped'); // Stopped, Running, Paused
    const [mode, setMode] = useExperienceState('washer', 'mode', 'Normal'); // Normal, Delicate, Heavy Duty, Whites
    const [temperature, setTemperature] = useExperienceState('washer', 'temperature', 'Warm'); // Cold, Warm, Hot

    const getStatus = () => {
        if (!isOn) return "Off";
        return operationalState;
    };

    const handleStart = () => {
        if (isOn && operationalState === 'Stopped') {
            setOperationalState('Running');
        }
    };

    const handlePause = () => {
        if (isOn && operationalState === 'Running') {
            setOperationalState('Paused');
        }
    };

    const handleStop = () => {
        if (isOn) {
            setOperationalState('Stopped');
        }
    };

    return (
        <div className={styles.page} data-device-screen>
            <div className={styles.backgroundLayer}>
                <img src={dashboardBg} alt="" className={styles.backgroundImage} />
                <div className={styles.colorOverlay} />
            </div>

            <div className={styles.content} data-device-content>
                {/* Header */}
                <div className={styles.header}>
                    <button className={styles.backButton} onClick={() => onNavigate && onNavigate('dashboard')}>
                        <NavArrowLeft width={24} height={24} />
                    </button>
                    <div className={styles.headerTitle}>
                        <span className={styles.headerSubtitle}>Laundry Room</span>
                        <span className={styles.headerMainTitle}>Washer</span>
                    </div>
                </div>
                
                {/* Power Toggle Card (1st Card) */}
                <div className={styles.cardRow}>
                    <BinaryDeviceCard 
                        status={getStatus()}
                        isOn={isOn}
                        onToggle={() => setIsOn(!isOn)}
                        icon={<SystemShut width={24} height={24} />}
                        style={{ width: '100%' }}
                        variant="minimal"
                    />
                </div>

                {/* Main Interaction Card (2nd Card) - Buttons Only */}
                <div className={`${styles.mainControlCard} ${!isOn ? styles.controlsDisabled : ''}`}>
                    {/* Readout (Top Left) */}
                    <div className={styles.readoutContainer}>
                        <span className={styles.readoutValue}>{operationalState}</span>
                        <span className={styles.readoutLabel}>Current Status</span>
                    </div>

                    {/* Status Badge (Top Right) */}
                    {isOn && (
                        <div className={styles.statusBadge}>
                           {mode}
                        </div>
                    )}

                    {/* Control Buttons (Main Interaction) */}
                    <div className={styles.mainButtonRow}>
                        <Button 
                            variant="neumorphDark"
                            onClick={handleStart}
                            disabled={!isOn || operationalState !== 'Stopped'}
                            active={operationalState === 'Running'}
                            style={{ width: '64px', height: '64px' }}
                        >
                            Start
                        </Button>
                        <Button 
                            variant="neumorphDark"
                            onClick={handlePause}
                            disabled={!isOn || operationalState !== 'Running'}
                            style={{ width: '64px', height: '64px' }}
                        >
                            Pause
                        </Button>
                        <Button 
                            variant="neumorphDark"
                            onClick={handleStop}
                            disabled={!isOn || operationalState === 'Stopped'}
                            style={{ width: '64px', height: '64px' }}
                        >
                            Stop
                        </Button>
                    </div>
                </div>

                {/* Secondary Controls - Below Main Card */}
                <div className={`${styles.secondaryControls} ${!isOn ? styles.controlsDisabled : ''}`}>
                    {/* Wash Mode Section */}
                    <div className={styles.controlSection}>
                        <span className={styles.sectionTitle}>Wash Mode</span>
                        <div className={styles.chipGroup}>
                            <Chip 
                                label="Normal" 
                                variant="translucent"
                                active={mode === 'Normal'}
                                onClick={() => setMode('Normal')}
                            />
                            <Chip 
                                label="Delicate" 
                                variant="translucent"
                                active={mode === 'Delicate'}
                                onClick={() => setMode('Delicate')}
                            />
                            <Chip 
                                label="Heavy" 
                                variant="translucent"
                                active={mode === 'Heavy Duty'}
                                onClick={() => setMode('Heavy Duty')}
                            />
                            <Chip 
                                label="Whites" 
                                variant="translucent"
                                active={mode === 'Whites'}
                                onClick={() => setMode('Whites')}
                            />
                        </div>
                    </div>

                    {/* Water Temperature Section */}
                    <div className={styles.controlSection}>
                        <span className={styles.sectionTitle}>Water Temperature</span>
                        <div className={styles.chipGroup}>
                            <Chip 
                                label="Cold" 
                                variant="translucent"
                                active={temperature === 'Cold'}
                                onClick={() => setTemperature('Cold')}
                            />
                            <Chip 
                                label="Warm" 
                                variant="translucent"
                                active={temperature === 'Warm'}
                                onClick={() => setTemperature('Warm')}
                            />
                            <Chip 
                                label="Hot" 
                                variant="translucent"
                                active={temperature === 'Hot'}
                                onClick={() => setTemperature('Hot')}
                            />
                        </div>
                    </div>
                </div>
                
                <TabBar activeTab={navTab} onTabChange={setNavTab} />
            </div>
        </div>
    );
};

export default WasherControl;
