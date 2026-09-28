import { useExperienceState } from '../Dashboard/experience-state';
import React from 'react';
import styles from './SmartCurtainControl.module.css';
import TabBar from '../../organisms/Navigation/TabBar/TabBar';
import dashboardBg from '../../../assets/images/dashboard_bg_mono.png';
import { NavArrowLeft, NavArrowRight, Pause } from 'iconoir-react';
import { Blinds } from 'lucide-react'; // Using Lucide for Blinds icon specifically
import BinaryDeviceCard from '../../organisms/Cards/BinaryDeviceCard/BinaryDeviceCard';
import HorizontalSlider from '../../molecules/Linear/HorizontalSlider/HorizontalSlider';
import ToggleBtn from '../../molecules/ToggleBtn/ToggleBtn';
import Dropdown from '../../molecules/Selection/Dropdown/Dropdown';

const SmartCurtainControl = ({ onNavigate }) => {
    const [navTab, setNavTab] = useExperienceState('curtain', 'navTab', 'devices');
    const [isOpen, setIsOpen] = useExperienceState('curtain', 'isOpen', true); // Power state? Or just Open/Close state? Let's use it as "Master Toggle"
    const [curtainLevel, setCurtainLevel] = useExperienceState('curtain', 'curtainLevel', 50); // 0 = Closed, 100 = Open
    
    // Smart Schedule State
    const [timerEnabled, setTimerEnabled] = useExperienceState('curtain', 'timerEnabled', false);
    const [timerValue, setTimerValue] = useExperienceState('curtain', 'timerValue', '1 hr');
    
    const [wakeUpEnabled, setWakeUpEnabled] = useExperienceState('curtain', 'wakeUpEnabled', false);
    const [wakeUpValue, setWakeUpValue] = useExperienceState('curtain', 'wakeUpValue', '7:00 AM');

    const getStatus = () => {
        if (!isOpen) return "Closed"; // If power off, assume closed? Or just "Locked"? Let's say "Closed"
        if (curtainLevel === 0) return "Closed";
        if (curtainLevel === 100) return "Fully Open";
        return `${curtainLevel}% Open`;
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
                        <span className={styles.headerMainTitle}>Smart Curtain</span>
                    </div>
                </div>
                
                {/* Master Toggle Card */}
                <div className={styles.cardRow}>
                    <BinaryDeviceCard 
                        status={isOpen ? "Open" : "Closed"} // Changed from "Active"
                        isOn={isOpen}
                        onToggle={() => setIsOpen(!isOpen)}
                        icon={<Blinds size={24} />}
                        style={{ width: '100%' }}
                        variant="minimal"
                    />
                </div>

                {/* Main Control Card */}
                <div className={`${styles.mainControlCard} ${!isOpen ? styles.controlsDisabled : ''}`}>


                    <div className={styles.readoutContainer}>
                        <span className={styles.readoutValue}>{Math.round(curtainLevel)}%</span>
                        <span className={styles.readoutLabel}>Openness</span>
                    </div>
                    
                    {/* Content Wrapper to ensure layout containment */}
                    <div className={styles.sliderContentWrapper}>
                        {/* Horizontal Slider Component */}
                        <HorizontalSlider 
                            min={0} 
                            max={100} 
                            value={curtainLevel} 
                            onChange={setCurtainLevel}
                            // Customize icons
                            leftIcon={<Blinds size={24} color="#515151" />}
                            rightIcon={null} // Hide icon on non-filled side
                            iconFade={false} // Disable fading effect
                            showValue={false} // Hide value below slider
                        />

                        {/* Control Buttons (Figma Design) */}
                        <div className={styles.controlButtonsRow}>
                            {/* Close Button (Left) - Slider to 0 */}
                            <button className={styles.controlBtn} onClick={() => setCurtainLevel(0)} title="닫기">
                                <div className={styles.btnInnerShadow} />
                                <NavArrowLeft width={24} height={24} color="#515151" strokeWidth={1.5} />
                            </button>
                            
                            {/* Pause Button (Middle) */}
                            <button className={styles.controlBtn} onClick={() => {}} title="일시정지">
                                <div className={styles.btnInnerShadow} />
                                <Pause width={24} height={24} color="#515151" strokeWidth={1.5} />
                            </button>

                            {/* Open Button (Right) - Slider to 100 */}
                            <button className={styles.controlBtn} onClick={() => setCurtainLevel(100)} title="열기">
                                <div className={styles.btnInnerShadow} />
                                <NavArrowRight width={24} height={24} color="#515151" strokeWidth={1.5} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Smart Schedule */}
                <div className={`${styles.sectionRow} ${!isOpen ? styles.controlsDisabled : ''}`} style={{ paddingBottom: 120 }}>
                    <span className={styles.sectionTitle}>Smart Schedule</span>
                    
                    {/* Close Timer */}
                    <ScheduleCard 
                        title="Auto Close"
                        isOn={timerEnabled}
                        onToggle={() => setTimerEnabled(!timerEnabled)}
                        valueDescription={timerEnabled ? `In ${timerValue}` : "Off"}
                    >
                        <Dropdown 
                            options={[
                                { label: '30 Minutes', value: '30 min' },
                                { label: '1 Hour', value: '1 hr' },
                                { label: 'sunset', value: 'Sunset' },
                            ]}
                            value={timerValue}
                            onChange={(opt) => setTimerValue(opt.value)}
                            placeholder="Duration"
                            disabled={!timerEnabled}
                            style={{ width: '100%' }}
                        />
                    </ScheduleCard>

                    {/* Open Timer */}
                    <ScheduleCard 
                        title="Auto Open"
                        isOn={wakeUpEnabled}
                        onToggle={() => setWakeUpEnabled(!wakeUpEnabled)}
                        valueDescription={wakeUpEnabled ? `At ${wakeUpValue}` : "Off"}
                    >
                         <Dropdown 
                            options={[
                                { label: '6:00 AM', value: '6:00 AM' },
                                { label: '7:00 AM', value: '7:00 AM' },
                                { label: 'Sunrise', value: 'Sunrise' },
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

export default SmartCurtainControl;
