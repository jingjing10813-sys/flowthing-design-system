import { useExperienceState } from '../Dashboard/experience-state';
import React from 'react';
import styles from './SpeakerControl.module.css';
import TabBar from '../../organisms/Navigation/TabBar/TabBar';
import dashboardBg from '../../../assets/images/dashboard_bg_mono.png';
import { NavArrowLeft, SystemShut, Play, Pause, FastArrowRight, FastArrowLeft, MusicDoubleNote } from 'iconoir-react';
import BinaryDeviceCard from '../../organisms/Cards/BinaryDeviceCard/BinaryDeviceCard';
import Button from '../../atoms/Button/Button';
import SpeakerVolumeControl from '../../organisms/SpeakerVolumeControl/SpeakerVolumeControl';

const SpeakerControl = ({ onNavigate }) => {
    const [navTab, setNavTab] = useExperienceState('speaker', 'navTab', 'devices');
    const [isOn, setIsOn] = useExperienceState('speaker', 'isOn', true);
    const [volume, setVolume] = useExperienceState('speaker', 'volume', 50); // 0-100%
    const [isPlaying, setIsPlaying] = useExperienceState('speaker', 'isPlaying', true); // true = Playing, false = Paused
    const [currentTrack, setCurrentTrack] = useExperienceState('speaker', 'currentTrack', 'lofi hip hop radio - beats to relax/study to'); // 현재 재생중인 곡

    // Matter 데이터 매핑:
    // speaker.py의 LevelControl.currentLevel (127/254) ≈ 50%
    // speaker.py의 MediaPlayback.currentState (0 = Playing)

    const getPlaybackStatus = () => {
        if (!isOn) return "Off";
        return isPlaying ? "Playing" : "Paused";
    };

    return (
        <div className={styles.page} data-device-screen>
            <div className={styles.backgroundLayer}>
                <img src={dashboardBg} alt="" className={styles.backgroundImage} />
                <div className={styles.colorOverlay} />
            </div>

            <div className={styles.content} data-device-content>
                {/* Header - LightingControl 패턴과 동일 */}
                <div className={styles.header}>
                    <button className={styles.backButton} onClick={() => onNavigate && onNavigate('dashboard')}>
                        <NavArrowLeft width={24} height={24} />
                    </button>
                    <div className={styles.headerTitle}>
                        <span className={styles.headerSubtitle}>Living Room</span>
                        <span className={styles.headerMainTitle}>Speaker</span>
                    </div>
                </div>
                
                {/* Power Toggle Card - 기존 패턴 재사용 */}
                <div className={styles.cardRow}>
                    <BinaryDeviceCard 
                        status={getPlaybackStatus()}
                        isOn={isOn}
                        onToggle={() => setIsOn(!isOn)}
                        icon={<SystemShut width={24} height={24} />}
                        style={{ width: '100%' }}
                        variant="minimal"
                    />
                </div>

                {/* Volume Control Card - 카드 구조 유지, 슬라이더만 organism */}
                <div className={`${styles.sliderCard} ${!isOn ? styles.controlsDisabled : ''}`}>
                    {/* Now Playing Badge (우측 상단) */}
                    {isOn && isPlaying && (
                        <div className={styles.nowPlayingBadge}>
                            <MusicDoubleNote width={16} height={16} strokeWidth={2} />
                            <span>{currentTrack}</span>
                        </div>
                    )}
                    
                    <div className={styles.readoutContainer}>
                        <span className={styles.readoutValue}>{Math.round(volume)}%</span>
                        <span className={styles.readoutLabel}>Volume</span>
                    </div>
                    
                    <div className={styles.sliderCenterColumn}>
                        <SpeakerVolumeControl 
                            initialVolume={volume}
                            onChange={setVolume}
                        />
                    </div>
                </div>

                {/* Playback Controls - 새로운 패턴 (MediaPlayback 클러스터) */}
                <div className={`${styles.playbackRow} ${!isOn ? styles.controlsDisabled : ''}`}>
                    <span className={styles.sectionTitle}>Playback</span>
                    <div className={styles.buttonGroup}>
                        <Button 
                            icon={<FastArrowLeft width={24} height={24} strokeWidth={2} />}
                            variant="neumorph"
                            onClick={() => console.log('Previous')}
                            disabled={!isOn}
                            aria-label="Previous track"
                        />
                        <Button 
                            icon={isPlaying ? <Pause width={28} height={28} strokeWidth={2} /> : <Play width={28} height={28} strokeWidth={2} />}
                            variant="neumorph"
                            active={isPlaying}
                            onClick={() => setIsPlaying(!isPlaying)}
                            disabled={!isOn}
                            aria-label={isPlaying ? "Pause" : "Play"}
                            style={{ width: '72px', height: '72px' }} // 중앙 버튼 더 크게
                        />
                        <Button 
                            icon={<FastArrowRight width={24} height={24} strokeWidth={2} />}
                            variant="neumorph"
                            onClick={() => console.log('Next')}
                            disabled={!isOn}
                            aria-label="Next track"
                        />
                    </div>
                </div>
                
                <TabBar activeTab={navTab} onTabChange={setNavTab} />
            </div>
        </div>
    );
};

export default SpeakerControl;
