import { useExperienceState } from '../Dashboard/experience-state';
import React from 'react';
import styles from './RefrigeratorControl.module.css';
import TabBar from '../../organisms/Navigation/TabBar/TabBar';
import dashboardBg from '../../../assets/images/dashboard_bg_mono.png';
import { NavArrowLeft, Fridge } from 'iconoir-react';
import Readout from '../../molecules/Display/Readout/Readout';
import Slider from '../../molecules/Linear/Slider/Slider';
import Chip from '../../atoms/Chip/Chip';
import BinaryDeviceCard from '../../organisms/Cards/BinaryDeviceCard/BinaryDeviceCard';

const RefrigeratorControl = ({ onNavigate }) => {
    const [navTab, setNavTab] = useExperienceState('refrigerator', 'navTab', 'devices');
    const [fridgeTemp, setFridgeTemp] = useExperienceState('refrigerator', 'fridgeTemp', 3);
    const [freezerTemp, setFreezerTemp] = useExperienceState('refrigerator', 'freezerTemp', -18);
    const [powerFreeze, setPowerFreeze] = useExperienceState('refrigerator', 'powerFreeze', false);

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
                        <span className={styles.headerSubtitle}>Kitchen</span>
                        <span className={styles.headerMainTitle}>Refrigerator</span>
                    </div>
                </div>

                {/* 1st Card: Reused BinaryDeviceCard as Info Card */}
                <div className={styles.cardRow}>
                    <BinaryDeviceCard 
                        name="Refrigerator"
                        status={`${fridgeTemp}°C | ${freezerTemp}°C`}
                        isOn={true}
                        onToggle={() => {}}
                        icon={<Fridge width={24} height={24} />}
                        isActuatable={false}
                        isConnected={true}
                        style={{ 
                           '--comp-button-filled-color': 'var(--sys-color-status-cool)',
                           '--sys-color-status-active': 'var(--sys-color-status-cool)',
                           boxShadow: 'none'
                        }}
                        isFullWidth={true}
                    />
                </div>

                {/* 2nd Card: Fridge Temperature */}
                <div className={styles.mainControlCard}>
                    <div className={styles.readoutContainer}>
                        <span className={styles.readoutValue}>{fridgeTemp}°C</span>
                        <span className={styles.readoutLabel}>Fridge</span>
                    </div>
                    
                    <div className={styles.sliderWrapper}>
                         <Slider 
                            value={fridgeTemp}
                            onChange={setFridgeTemp}
                            min={-2}
                            max={8}
                            step={1}
                        />
                        <div className={styles.sliderLabels}>
                            <span>-2°C</span>
                            <span>8°C</span>
                        </div>
                    </div>
                </div>

                {/* 3rd Card: Freezer Temperature */}
                <div className={styles.mainControlCard}>
                    <div className={styles.readoutContainer}>
                        <span className={styles.readoutValue}>{freezerTemp}°C</span>
                        <span className={styles.readoutLabel}>Freezer</span>
                    </div>
                    
                     <div className={styles.sliderWrapper}>
                        <Slider 
                            value={freezerTemp}
                            onChange={setFreezerTemp}
                            min={-24}
                            max={-16}
                            step={1}
                        />
                        <div className={styles.sliderLabels}>
                            <span>-24°C</span>
                            <span>-16°C</span>
                        </div>
                    </div>
                </div>

                {/* Bottom Section: Quick Freeze */}
                <div className={styles.bottomControls}>
                    <span className={styles.sectionTitle}>Quick Options</span>
                    <div className={styles.chipContainer}>
                        <Chip 
                            label="Power Freeze"
                            variant="translucent"
                            active={powerFreeze}
                            onClick={() => setPowerFreeze(!powerFreeze)}
                        />
                    </div>
                </div>
                
                <TabBar activeTab={navTab} onTabChange={setNavTab} />
            </div>
        </div>
    );
};

export default RefrigeratorControl;
