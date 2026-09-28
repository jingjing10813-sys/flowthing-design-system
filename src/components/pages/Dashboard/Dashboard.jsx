import { useState } from 'react';
import styles from './Dashboard.module.css';
import Chip from '../../atoms/Chip/Chip';
import BinaryDeviceCard from '../../organisms/Cards/BinaryDeviceCard/BinaryDeviceCard';
import ActionDeviceCard from '../../organisms/Cards/ActionDeviceCard/ActionDeviceCard';
import TabBar from '../../organisms/Navigation/TabBar/TabBar';
import dashboardBg from '../../../assets/images/dashboard_bg_mono.png';
import { SunLight, HalfMoon, LogOut, LightBulb, Play, Pause, Wind, SoundHigh, Settings, WashingMachine, Fridge } from 'iconoir-react';

const Dashboard = ({ onNavigate }) => { // Accepting onNavigate prop for App-level routing shim (since App.jsx handles 'pages' via state)
    const [activeTab, setActiveTab] = useState('All');
    const [navTab, setNavTab] = useState('home');

    // Room Gradients for Dynamic Overlay (0% -> 100%)
    const roomGradients = {
        'All': { start: 'var(--sys-color-gradient-orange-start)', end: 'var(--sys-color-gradient-orange-end)' },
        'Living Room': { start: 'var(--sys-color-gradient-blue-start)', end: 'var(--sys-color-gradient-blue-end)' },
        'Bedroom': { start: 'var(--sys-color-gradient-green-start)', end: 'var(--sys-color-gradient-green-end)' },
        'Kitchen': { start: 'var(--sys-color-gradient-purple-start)', end: 'var(--sys-color-gradient-purple-end)' }
    };

    const currentGradient = roomGradients[activeTab] || roomGradients['All'];

    // Mock Date
    const today = new Date();
    const dateOptions = { weekday: 'long', month: 'long', day: 'numeric' };
    const dateString = today.toLocaleDateString('en-US', dateOptions);

    // Initial Device Data with Room Property and Navigation Target
    const [devices, setDevices] = useState([
        { id: 'light1', name: 'Main Light', type: 'binary', room: 'Living Room', isOn: true, status: '88%', icon: 'bulb', targetPage: 'lighting', span: 2 },
        { id: 'ac1', name: 'Air Conditioner', type: 'binary', room: 'Living Room', isOn: true, status: '23°C', icon: 'ac', targetPage: 'airconditioner', span: 2 }, 
        { id: 'speaker', name: 'Speaker', type: 'action', room: 'Living Room', isPlaying: false, status: 'Paused', icon: 'speaker', span: 1 }, 
        { id: 'washer', name: 'Washer', type: 'binary', room: 'Kitchen', isOn: false, status: 'Stopped', icon: 'washer', targetPage: 'washer', span: 1 },
        { id: 'refrigerator', name: 'Refrigerator', type: 'binary', room: 'Kitchen', isOn: true, status: '3°C | -18°C', icon: 'fridge', targetPage: 'refrigerator', span: 1 },
        { id: 'light2', name: 'Bedroom Light', type: 'binary', room: 'Bedroom', isOn: false, status: 'Off', icon: 'bulb', targetPage: 'lighting', span: 1 },
        { id: 'light3', name: 'Kitchen Light', type: 'binary', room: 'Kitchen', isOn: false, status: 'Disconnected', icon: 'bulb', isConnected: false, span: 1 },
        { id: 'master', name: 'Master Switch', type: 'binary', room: 'All', isOn: true, status: 'All On', icon: 'bulb', span: 1 }
    ]);

    const toggleDevice = (id) => {
        setDevices(prev => prev.map(d => {
            if (d.id === id) {
                if (d.type === 'action') {
                     return { ...d, isPlaying: !d.isPlaying, status: !d.isPlaying ? "Playing" : "Paused" };
                }
                return { ...d, isOn: !d.isOn, status: !d.isOn ? 'On' : 'Off' };
            }
            return d;
        }));
    };

    // Filter Devices
    const filteredDevices = activeTab === 'All' 
        ? devices 
        : devices.filter(d => d.room === activeTab || d.room === 'All');

    // Device Icons (Inline SVGs for specific devices)


    // Tabs
    const tabs = ['All', 'Living Room', 'Bedroom', 'Kitchen'];

    return (
        <div className={styles.dashboard} data-device-screen>
            <div className={styles.backgroundLayer}>
                <img src={dashboardBg} alt="" className={styles.backgroundImage} />
                <div 
                    className={styles.colorOverlay} 
                    style={{ 
                        background: `linear-gradient(180deg, ${currentGradient.start} 0%, ${currentGradient.end} 100%)`,
                        mixBlendMode: 'screen' 
                    }} 
                />
            </div>
            
            <div className={styles.content} data-device-content>
                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.greetingBlock}>
                        <span className={styles.date}>{dateString}</span>
                        <h1 className={styles.greeting}>Good Morning, <br/>Flowthing</h1>
                    </div>
                    <div className={styles.profileIcon} />
                </div>

                {/* Scenes - Horizontal Scroll */}
                <div className={styles.scenesSection}>
                    <h2 className={styles.sectionTitle}>Scenes</h2>
                    <div className={styles.sceneScroll}>
                        <div className={styles.sceneCard}>
                            <div className={`${styles.sceneIcon} ${styles.morning}`}>
                                <SunLight width={20} height={20} color="#FFF" />
                            </div>
                            <span className={styles.sceneLabel}>Morning</span>
                        </div>
                        <div className={styles.sceneCard}>
                            <div className={`${styles.sceneIcon} ${styles.night}`}>
                                <HalfMoon width={20} height={20} color="#FFF" />
                            </div>
                            <span className={styles.sceneLabel}>Night</span>
                        </div>
                        <div className={styles.sceneCard}>
                            <div className={`${styles.sceneIcon} ${styles.away}`}>
                                <LogOut width={20} height={20} color="#FFF" />
                            </div>
                            <span className={styles.sceneLabel}>Away</span>
                        </div>
                    </div>
                </div>

                {/* Devices */}
                <div className={styles.section} style={{ marginBottom: 120 }}>
                    <div className={styles.deviceHeader}>
                         <h2 className={styles.sectionTitle}>Devices</h2>
                    </div>
                    
                    <div className={styles.tabs}>
                        {tabs.map(tab => (
                            <Chip 
                                key={tab}
                                label={tab} 
                                variant={activeTab === tab ? 'solid' : 'translucent'} 
                                active={activeTab === tab} 
                                onClick={() => setActiveTab(tab)}
                            />
                        ))}
                    </div>

                    <div className={styles.grid}>
                        {filteredDevices.map(device => {
                            // Icon Selection
                            let icon = <LightBulb width={24} height={24} />;
                            if (device.icon === 'speaker') icon = <SoundHigh width={24} height={24} />;
                            if (device.icon === 'ac') icon = <Wind width={24} height={24} />;
                            if (device.icon === 'settings') icon = <Settings width={24} height={24} />;
                            if (device.icon === 'washer') icon = <WashingMachine width={24} height={24} />;
                            if (device.icon === 'fridge') icon = <Fridge width={24} height={24} />;

                            const isFullWidth = device.span === 2;

                            if (device.type === 'action') {
                                return (
                                    <ActionDeviceCard
                                        key={device.id}
                                        name={device.name}
                                        status={device.status}
                                        isPlaying={device.isPlaying}
                                        onAction={() => toggleDevice(device.id)}
                                        icon={icon}
                                        className={device.span === 2 ? styles.span2 : ''}
                                        onClick={() => onNavigate && onNavigate(device.id)} 
                                        isFullWidth={isFullWidth}
                                    />
                                );
                            }
                            return (
                                <BinaryDeviceCard 
                                    key={device.id}
                                    name={device.name}
                                    status={device.status}
                                    isOn={device.isOn}
                                    onToggle={() => toggleDevice(device.id)}
                                    icon={icon}
                                    isActuatable={device.id === 'refrigerator' ? false : true}
                                    isConnected={device.isConnected !== false}
                                    className={device.span === 2 ? styles.span2 : ''}
                                    style={{ 
                                        ...(device.span === 2 ? { width: '100%' } : {}),
                                        ...(device.icon === 'ac' ? { 
                                            '--comp-button-icon-color-active': 'var(--sys-color-status-cool)',
                                            '--sys-color-status-active': 'var(--sys-color-status-cool)'
                                        } : {}),
                                        ...(device.id === 'refrigerator' ? {
                                            '--comp-button-filled-color': 'var(--sys-color-status-cool)',
                                            '--sys-color-status-active': 'var(--sys-color-status-cool)'
                                        } : {})
                                    }}
                                    onClick={() => device.targetPage && onNavigate && onNavigate(device.targetPage)}
                                    isFullWidth={isFullWidth}
                                />
                            );
                        })}
                    </div>
                </div>
                <TabBar activeTab={navTab} onTabChange={setNavTab} />
            </div>
        </div>
    );
};

export default Dashboard;
