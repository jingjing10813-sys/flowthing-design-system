import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, useMotionTemplate } from 'framer-motion';
import SliderThumb from '../../../atoms/SliderThumb/SliderThumb';
import { HalfMoon, SunLight } from 'iconoir-react';
import './AdaptiveLightSliderNew.css';

export default function AdaptiveLightSlider({ value, onChange, activeColor = "rgb(255, 245, 225)", inactiveColor = "rgb(220, 215, 210)" }) {
    const constraintsRef = useRef(null);

    // Container dimensions
    // Height: 272px
    // Knob: 81px
    // Drag range: 272 - 81 = 191px roughly.
    // Top (High Intensity): Y = 23px
    // Bottom (Low Intensity): Y = 173px
    const y = useMotionValue(173); // Start at bottom (Low/Off)

    const inputY = [23, 173];
    
    // Background Color (Light State)
    const bgColor = useTransform(y, [23, 173], [
        activeColor,        // High Intensity (Dynamic Color)
        inactiveColor       // Low Intensity (Dynamic Color)
    ]);
    
    // Dark Gradient Overlay Opacity (Visible when Off)
    const gradientOpacity = useTransform(y, [165, 173], [0, 1]);

    // Glow Opacity Logic
    const glowOpacity = useTransform(y, [23, 165, 172, 173], [1, 0.8, 0.5, 0]);

    // Icon Opacity
    // Moon visible only at very bottom (effectively off)
    const moonOpacity = useTransform(y, [170, 173], [0, 1]); 
    // Sun visible as soon as we leave bottom
    const sunOpacity = useTransform(y, [170, 173], [1, 0]);

    // Shadow Color Logic (Dynamic adaptation)
    // Top (On): Dynamic active color with opacity
    // Bottom (Off): Black (Standard shadow)
    
    // Helper to add alpha to rgb string and darken it for shadow
    const getShadowColor = (colorStr, alpha) => {
        const match = colorStr.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (!match) return `rgba(180, 130, 80, ${alpha})`; // Fallback
        
        // Darken color significantly for shadow visibility on similar colored bg
        const darken = (val) => Math.max(0, Math.round(val * 0.65));
        
        return `rgba(${darken(match[1])}, ${darken(match[2])}, ${darken(match[3])}, ${alpha})`;
    };

    const shadowColor = useTransform(y, [23, 173], [
        getShadowColor(activeColor, 0.5), 
        "rgba(0, 0, 0, 0.25)"
    ]);
    const knobShadow = useMotionTemplate`0px 12px 24px 0px ${shadowColor}`;
    
    const sliderRef = useRef(null);
    const isDragging = useRef(false);
    const startY = useRef(0);
    const startYValue = useRef(0);
    useEffect(() => {
        if (typeof value === 'number' && !isDragging.current) {
            y.set(173 - Math.min(100, Math.max(0, value)) * 1.5);
        }
    }, [value, y]);

    const handlePointerDown = (e) => {
        isDragging.current = true;
        startY.current = e.clientY;
        startYValue.current = y.get();
        e.currentTarget.setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e) => {
        if (!isDragging.current) return;
        const deltaY = e.clientY - startY.current;
        const newY = startYValue.current + deltaY;
        // Clamp: Top 23, Bottom 173
        const clampedY = Math.min(Math.max(newY, 23), 173);
        y.set(clampedY);

        if (onChange) {
            const percentage = Math.round(((173 - clampedY) / 150) * 100);
            onChange(percentage);
        }
    };

    const handlePointerUp = (e) => {
        isDragging.current = false;
        e.currentTarget.releasePointerCapture(e.pointerId);
    };

    return (
        <motion.div
            className="adaptive-slider-container"
            ref={sliderRef}
            style={{
                background: bgColor,
                cursor: 'grab',
                touchAction: 'none'
            }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
        >
            {/* Dark Gradient Overlay (Off State) */}
            <motion.div 
                style={{ 
                    opacity: gradientOpacity, 
                    background: 'var(--slider-gradient-silver-vertical)',
                    position: 'absolute', 
                    inset: 0, 
                    zIndex: 1, 
                    pointerEvents: 'none'
                }} 
            />

            {/* Glow Effect Layer */}
            <motion.div 
                className="adaptive-slider-glow"
                style={{ 
                    opacity: glowOpacity,
                    background: `radial-gradient(circle at center bottom, #FFFFFF 10%, ${activeColor} 50%, transparent 70%)`
                }}
            />

            <div ref={constraintsRef} className="adaptive-slider-constraints" />

            <motion.div
                style={{ y, x: "-50%" }}
                className="adaptive-slider-knob-wrapper-v2" 
            >
                <motion.div className="adaptive-slider-knob-shadow" style={{ boxShadow: knobShadow }} />
                <SliderThumb className="adaptive-slider-thumb-v2">
                    <div className="adaptive-slider-icon-wrapper">
                        {/* Sun Icon */}
                        <motion.div 
                            style={{ opacity: sunOpacity, position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                            <SunLight width={24} height={24} color="#333" strokeWidth={2.5} /> 
                        </motion.div>
                        
                        {/* Moon Icon */}
                        <motion.div 
                            style={{ opacity: moonOpacity, position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                             <HalfMoon width={24} height={24} color="#666" strokeWidth={2} />
                        </motion.div>
                    </div>
                </SliderThumb>
            </motion.div>
        </motion.div>
    );
}
