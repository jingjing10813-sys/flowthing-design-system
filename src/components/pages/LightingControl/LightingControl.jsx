import { useExperienceState } from '../Dashboard/experience-state';
import React from 'react';
import styles from './LightingControl.module.css';
import TabBar from '../../organisms/Navigation/TabBar/TabBar';
import dashboardBg from '../../../assets/images/dashboard_bg_mono.png';
import { NavArrowLeft, SystemShut } from 'iconoir-react';
import BinaryDeviceCard from '../../organisms/Cards/BinaryDeviceCard/BinaryDeviceCard';
import AdaptiveLightSlider from '../../molecules/Linear/AdaptiveLightSlider/AdaptiveLightSliderNew';
import Readout from '../../molecules/Display/Readout/Readout';
import ColorTemperatureSlider from '../../molecules/Linear/ColorTemperatureSlider/ColorTemperatureSlider';
import Chip from '../../atoms/Chip/Chip';

// Helper to get presentable color from Kelvin (Linear interpolation)
const getVisualColorFromTemp = (kelvin) => {
    // Clamp range
    const minK = 3000;
    const maxK = 6000;
    const k = Math.min(Math.max(kelvin, minK), maxK);
    
    // Normalize 0.0 - 1.0
    const t = (k - minK) / (maxK - minK);

    // Warm (3000K) - Soft Warm White
    const startColor = { r: 255, g: 200, b: 140 }; // Much softer yellow-orange
    // Cool (6000K) - Bright Cool White (Cyan/Blue tint, no Purple)
    const endColor = { r: 235, g: 250, b: 255 }; 

    const r = Math.round(startColor.r + (endColor.r - startColor.r) * t);
    const g = Math.round(startColor.g + (endColor.g - startColor.g) * t);
    const b = Math.round(startColor.b + (endColor.b - startColor.b) * t);

    return `rgb(${r}, ${g}, ${b})`;
};

// Helper to dim RGB color
const dimRgb = (rgbString, factor = 0.6) => {
    const match = rgbString.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (!match) return rgbString;
    
    const [_, r, g, b] = match;
    const dim = (val) => Math.round(val * factor);
    
    return `rgb(${dim(r)}, ${dim(g)}, ${dim(b)})`;
};

const LightingControl = ({ onNavigate, roomName = 'Living Room', deviceName = 'Main Light' }) => {
    const [navTab, setNavTab] = useExperienceState('lighting', 'navTab', 'devices');
    const [isLightOn, setIsLightOn] = useExperienceState('lighting', 'isLightOn', true);
    const [brightness, setBrightness] = useExperienceState('lighting', 'brightness', 0);
    const [colorTemp, setColorTemp] = useExperienceState('lighting', 'colorTemp', 4500);

    return (
        <div className={styles.page} data-device-screen>
            <div className={styles.backgroundLayer}>
                <img src={dashboardBg} alt="" className={styles.backgroundImage} />
                <div className={styles.colorOverlay} />
            </div>

            <div className={styles.content} data-device-content>
                <div className={styles.header}>
                    <button className={styles.backButton} onClick={() => onNavigate && onNavigate('dashboard')}>
                        <NavArrowLeft width={24} height={24} />
                    </button>
                    <div className={styles.headerTitle}>
                        <span className={styles.headerSubtitle}>{roomName}</span>
                        <span className={styles.headerMainTitle}>{deviceName}</span>
                    </div>
                </div>
                
                <div className={styles.cardRow}>
                    <BinaryDeviceCard 
                        status={isLightOn ? "On" : "Off"}
                        isOn={isLightOn}
                        onToggle={() => setIsLightOn(!isLightOn)}
                        icon={<SystemShut width={24} height={24} />}
                        style={{ width: '100%' }}
                        variant="minimal"
                    />
                </div>

                {/* Brightness Control Card */}
                <div className={`${styles.sliderCard} ${!isLightOn ? styles.controlsDisabled : ''}`}>
                    <div className={styles.readoutContainer}>
                        <span className={styles.readoutValue}>{Math.round(brightness)}%</span>
                        <span className={styles.readoutLabel}>Brightness</span>
                    </div>
                    
                    <div className={styles.sliderCenterColumn}>
                        <span className={styles.sliderLimitLabel}>Light</span>
                        <AdaptiveLightSlider 
                            value={brightness}
                            onChange={setBrightness}
                            height={340}
                            style={{ width: '140px' }}
                            activeColor={getVisualColorFromTemp(colorTemp)}
                            inactiveColor={dimRgb(getVisualColorFromTemp(colorTemp), 0.7)}
                        />
                        <span className={styles.sliderLimitLabel}>Dark</span>
                    </div>
                </div>

                {/* Secondary Controls: Color Temperature */}
                {/* Secondary Controls: Color Temperature */}
                <div className={`${styles.tempControlRow} ${!isLightOn ? styles.controlsDisabled : ''}`}>
                    <div className={styles.tempHeader}>
                        <span className={styles.sectionTitle}>Color Temperature</span>
                        <span className={styles.tempValue}>{colorTemp}K</span>
                    </div>
                    <ColorTemperatureSlider 
                        value={colorTemp}
                        onChange={setColorTemp}
                    />
                </div>

                {/* Secondary Controls: Mode Selection */}
                {/* Secondary Controls: Mode Selection */}
                <div className={`${styles.modeRow} ${!isLightOn ? styles.controlsDisabled : ''}`} style={{ marginBottom: 120 }}>
                    <span className={styles.sectionTitle}>Mode</span>
                    <div className={styles.chipGroup}>
                        <Chip 
                            label="Relax" 
                            variant="translucent"
                            active={colorTemp === 3000}
                            onClick={() => setColorTemp(3000)} 
                        />
                        <Chip 
                            label="Reading" 
                            variant="translucent"
                            active={colorTemp === 4200}
                            onClick={() => setColorTemp(4200)} 
                        />
                        <Chip 
                            label="Activity" 
                            variant="translucent"
                            active={colorTemp === 6000}
                            onClick={() => setColorTemp(6000)} 
                        />
                    </div>
                </div>
                
                <TabBar activeTab={navTab} onTabChange={setNavTab} />
            </div>
        </div>
    );
};

export default LightingControl;
