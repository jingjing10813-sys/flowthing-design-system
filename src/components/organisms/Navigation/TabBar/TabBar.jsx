import React from 'react';
import { Home, LayoutGrid, Thermometer, Settings } from 'lucide-react'; 
import styles from './TabBar.module.css';

// Static TabBar - displays smart home navigation context without interaction
const TabBar = () => {
    const tabs = [
        { id: 'home', icon: Home },
        { id: 'devices', icon: LayoutGrid },
        { id: 'climate', icon: Thermometer },
        { id: 'settings', icon: Settings },
    ];

    return (
        <div className={styles.tabBarWrapper}>
            <nav className={styles.tabBar}>
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    // First tab (home) is always shown as active for visual context
                    const isActive = tab.id === 'home';
                    
                    return (
                        <div 
                            key={tab.id}
                            className={`${styles.tabItem} ${isActive ? styles.active : ''}`}
                        >
                            <Icon 
                                size={26}
                                strokeWidth={isActive ? 2.5 : 2} 
                            />
                        </div>
                    );
                })}
            </nav>
        </div>
    );
};

export default TabBar;
