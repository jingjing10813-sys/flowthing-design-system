import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import styles from './ColorTemperatureSlider.module.css';

import SliderThumb from '../../../atoms/SliderThumb/SliderThumb';

const ColorTemperatureSlider = ({ value = 4000, min = 2700, max = 6500, onChange }) => {
    const containerRef = useRef(null);
    const [width, setWidth] = useState(0);
    const knobWidth = 40;
    const padding = 0;

    const x = useMotionValue(0);

    // Initialize position based on value
    useEffect(() => {
        if (width > 0) {
            const range = max - min;
            const percentage = (value - min) / range;
            const maxPos = width - knobWidth - (padding * 2);
            x.set(percentage * maxPos + padding);
        }
    }, [width, value, min, max, x]);

    useEffect(() => {
        if (containerRef.current) {
            setWidth(containerRef.current.offsetWidth);
        }
        
        const handleResize = () => {
             if (containerRef.current) {
                setWidth(containerRef.current.offsetWidth);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);


    const handlePointerDown = (e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
    };

    const handleDrag = (event, info) => {
        const currentX = x.get();
        const maxPos = width - knobWidth - (padding * 2);
        
        // Normalize x from padding to maxPos+padding
        const effectiveX = Math.max(0, currentX - padding);
        const percentage = effectiveX / maxPos;
        
        const newValue = Math.round(percentage * (max - min) + min);
        const clampedValue = Math.min(Math.max(newValue, min), max);
        
        if (onChange) {
            onChange(clampedValue);
        }
    };

    return (
        <div ref={containerRef} className={styles.container}>
             <motion.div
                className={styles.knobWrapper}
                style={{ x, y: "-50%" }}
                drag="x"
                dragConstraints={containerRef}
                dragElastic={0}
                dragMomentum={false}
                onDrag={handleDrag}
                onPointerDown={handlePointerDown}
            >
               <SliderThumb className={styles.knobRefactored} />
            </motion.div>
        </div>
    );
};

export default ColorTemperatureSlider;
