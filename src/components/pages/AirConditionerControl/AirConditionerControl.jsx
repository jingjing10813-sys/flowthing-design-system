import { useExperienceState } from '../Dashboard/experience-state';
import React from 'react';
import styles from './AirConditionerControl.module.css';
import TabBar from '../../organisms/Navigation/TabBar/TabBar';
import dashboardBg from '../../../assets/images/dashboard_bg_mono.png';
import { NavArrowLeft, SystemShut } from 'iconoir-react';
import BinaryDeviceCard from '../../organisms/Cards/BinaryDeviceCard/BinaryDeviceCard';
import TemperatureControl from '../../molecules/Circular/TemperatureControl/TemperatureControl';
import Chip from '../../atoms/Chip/Chip';
import Dropdown from '../../molecules/Selection/Dropdown/Dropdown'; // Keep for other uses if needed, or remove if unused.
import Slider from '../../molecules/Linear/Slider/Slider';
import ToggleBtn from '../../molecules/ToggleBtn/ToggleBtn';

const AirConditionerControl = ({ onNavigate }) => {
    const [navTab, setNavTab] = useExperienceState('airconditioner', 'navTab', 'devices');
    const [isOn, setIsOn] = useExperienceState('airconditioner', 'isOn', true);
    const [targetTemp, setTargetTemp] = useExperienceState('airconditioner', 'targetTemp', 24);
    const [currentTemp, setCurrentTemp] = useExperienceState('airconditioner', 'currentTemp', 26);
    const [activeMode, setActiveMode] = useExperienceState('airconditioner', 'activeMode', 'Cooling');
    
    // Smart Schedule State
    const [timerEnabled, setTimerEnabled] = useExperienceState('airconditioner', 'timerEnabled', false);
    const [timerValue, setTimerValue] = useExperienceState('airconditioner', 'timerValue', '1 hr'); // Default string matching option
    
    const [wakeUpEnabled, setWakeUpEnabled] = useExperienceState('airconditioner', 'wakeUpEnabled', false);
    const [wakeUpValue, setWakeUpValue] = useExperienceState('airconditioner', 'wakeUpValue', '7:00 AM'); // Default string matching option

    // Determine status text based on state and temperature difference
    const getStatus = () => {
        if (!isOn) return "Off";
        if (targetTemp < currentTemp) return "Cooling";
        if (targetTemp > currentTemp) return "Heating";
        return "Idle";
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
                        <span className={styles.headerSubtitle}>Living Room</span>
                        <span className={styles.headerMainTitle}>Air Conditioner</span>
                    </div>
                </div>
                
                {/* Power Toggle Card */}
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

                {/* Main Temperature Control Card */}
                <div className={`${styles.mainControlCard} ${!isOn ? styles.controlsDisabled : ''}`}>
                    {/* Current Mode Display (Top Right) */}
                    <div className={styles.currentModeDisplay}>
                        {activeMode} Mode
                    </div>

                    <div className={styles.readoutContainer}>
                        <span className={styles.readoutValue}>{currentTemp}°C</span>
                        <span className={styles.readoutLabel}>Current Temp</span>
                    </div>
                    
                    <TemperatureControl 
                        targetTemp={targetTemp}
                        currentTemp={currentTemp}
                        onChange={setTargetTemp}
                        min={18}
                        max={30}
                        gradientId="acGradient"
                        gradientColors={[
                          { offset: "0%", color: "var(--sys-color-temp-ac-cool-strong)" }, /* Deep Blue (Low Temp) */
                          { offset: "50%", color: "var(--sys-color-temp-ac-cool-mid)" },
                          { offset: "100%", color: "var(--sys-color-temp-ac-cool-weak)" } /* Gray (High Temp) */
                        ]}
                    />
                </div>

                {/* Mode Selection */}
                <div className={`${styles.sectionRow} ${!isOn ? styles.controlsDisabled : ''}`}>
                    <span className={styles.sectionTitle}>Mode</span>
                    <div className={styles.chipGroup}>
                        <Chip 
                            label="Dehumidify" 
                            variant="translucent"
                            active={activeMode === 'Dehumidify'}
                            onClick={() => setActiveMode('Dehumidify')} 
                        />
                        <Chip 
                            label="Cooling" 
                            variant="translucent"
                            active={activeMode === 'Cooling'}
                            onClick={() => setActiveMode('Cooling')} 
                        />
                        <Chip 
                            label="Auto" 
                            variant="translucent"
                            active={activeMode === 'Auto'}
                            onClick={() => setActiveMode('Auto')} 
                        />
                    </div>
                </div>

                {/* Smart Schedule */}
                <div className={`${styles.sectionRow} ${!isOn ? styles.controlsDisabled : ''}`} style={{ paddingBottom: 120 }}>
                    <span className={styles.sectionTitle}>Smart Schedule</span>
                    
                    {/* Scheduled Off */}
                    <ScheduleCard 
                        title="Scheduled Off"
                        isOn={timerEnabled}
                        onToggle={() => setTimerEnabled(!timerEnabled)}
                        valueDescription={timerEnabled ? `In ${timerValue}` : "Off"}
                    >
                        <Dropdown 
                            options={[
                                { label: '30 Minutes', value: '30 min' },
                                { label: '1 Hour', value: '1 hr' },
                                { label: '2 Hours', value: '2 hrs' },
                                { label: '4 Hours', value: '4 hrs' },
                                { label: '8 Hours', value: '8 hrs' },
                            ]}
                            value={timerValue}
                            onChange={(opt) => setTimerValue(opt.value)}
                            placeholder="Duration"
                            disabled={!timerEnabled}
                            style={{ width: '100%' }}
                        />
                    </ScheduleCard>

                    {/* Scheduled On */}
                    <ScheduleCard 
                        title="Scheduled On"
                        isOn={wakeUpEnabled}
                        onToggle={() => setWakeUpEnabled(!wakeUpEnabled)}
                        valueDescription={wakeUpEnabled ? `At ${wakeUpValue}` : "Off"}
                    >
                         <Dropdown 
                            options={[
                                { label: '6:00 AM', value: '6:00 AM' },
                                { label: '6:30 AM', value: '6:30 AM' },
                                { label: '7:00 AM', value: '7:00 AM' },
                                { label: '7:30 AM', value: '7:30 AM' },
                                { label: '8:00 AM', value: '8:00 AM' },
                                { label: '18:00 (6 PM)', value: '6:00 PM' },
                                { label: '19:00 (7 PM)', value: '7:00 PM' },
                            ]}
                            value={wakeUpValue}
                            onChange={(opt) => setWakeUpValue(opt.value)}
                            placeholder="Time"
                            disabled={!wakeUpEnabled}
                            style={{ width: '100%' }}
                        />
                    </ScheduleCard>
                </div>

                <TabBar activeTab={navTab} onTabChange={setNavTab} />
            </div>
        </div>
    );
};

// Helper Sub-component for capability cards
const ScheduleCard = ({ title, isOn, onToggle, valueDescription, children }) => (
    <div className={`${styles.capabilityCard} ${!isOn ? styles.disabled : ''}`}>
        <div className={styles.cardHeader}>
            <div className={styles.cardTitleBlock}>
                <span className={styles.cardTitle}>{title}</span>
                <span className={`${styles.cardStatus} ${!isOn ? styles.inactive : ''}`}>
                    {valueDescription}
                </span>
            </div>
            <ToggleBtn isOn={isOn} onToggle={onToggle} size="small" />
        </div>
        {isOn && (
            <div className={styles.controlsArea}>
                {children}
            </div>
        )}
    </div>
);

// Helper for time formatting (decimal hours to HH:MM AM)
const formatTime = (decimalTime) => {
    const hrs = Math.floor(decimalTime);
    const mins = Math.round((decimalTime - hrs) * 60);
    const minsStr = mins < 10 ? `0${mins}` : mins;
    return `${hrs}:${minsStr} AM`;
};

export default AirConditionerControl;
