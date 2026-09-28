import React, { useState, useRef } from 'react';
import { SunLight, HalfMoon } from 'iconoir-react';
import SliderHandle from '../../../atoms/SliderHandle/SliderHandle';
import './HorizontalSlider.css';

const HorizontalSlider = ({ 
    leftIcon = <HalfMoon width={24} height={24} strokeWidth={1.5} color="#515151" />, // Default Left
    rightIcon = <SunLight width={24} height={24} strokeWidth={1.5} color="white" />, // Default Right
    leftIconColor, 
    rightIconColor,
    handlePosition = "in-left",
    variant = "standard", 
    showIcons = true,
    iconFade = true,
    showValue = true, // New prop: Default to true to maintain existing behavior elsewhere
    width = "100%", 
    height = "116px",
    min = 0,
    max = 100,
    value, // Controlled value from parent
    onChange // Callback to update parent state
}) => {
    // sliderPos: 0 (Left) to 100 (Right)
    // Use controlled value if provided, otherwise use internal state
    const [internalSliderPos, setInternalSliderPos] = useState(50);
    const sliderPos = value !== undefined ? value : internalSliderPos;
    const sliderRef = useRef(null);
    const isDragging = useRef(false);
    const startX = useRef(0);
    const startSliderPos = useRef(0);

    const isBlind = variant === 'blind';

    const handlePointerDown = (e) => {
        isDragging.current = true;
        startX.current = e.clientX;
        startSliderPos.current = sliderPos;
        e.currentTarget.setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e) => {
        if (!isDragging.current || !sliderRef.current) return;

        const deltaX = e.clientX - startX.current;
        const sliderWidth = sliderRef.current.getBoundingClientRect().width;
        
        // Convert deltaX to percentage
        const deltaPercentage = (deltaX / sliderWidth) * 100;
        
        // New position is start position + delta
        let newPos = startSliderPos.current + deltaPercentage;

        // Clamp betweeen 0 and 100
        if (newPos < 0) newPos = 0;
        if (newPos > 100) newPos = 100;

        // Update parent state if onChange is provided, otherwise update internal state
        if (onChange) {
            onChange(newPos);
        } else {
            setInternalSliderPos(newPos);
        }
    };

    const handlePointerUp = (e) => {
        isDragging.current = false;
        e.currentTarget.releasePointerCapture(e.pointerId);
    };

    // Value Display Logic
    const displayValue = Math.round(sliderPos);

    // Handle Position Logic
    const getHandleStyle = () => {
        const baseStyle = { left: `${sliderPos}%` };
        
        // Handle Rotation & Offset Logic
        // The handle is natively a horizontal bar (58px wide).
        // For HorizontalSlider, we rotate it 90deg to be a vertical bar.
        
        // Position relative to the split line:
        // "in-left": 10px LEFT of split line. (Was 6px, increased by 4px)
        // "in-right": 10px RIGHT of split line.
        
        const offset = handlePosition === 'in-left' ? '-10px' : '10px';
        
        return {
            ...baseStyle,
            // 1. Center the container at the point (-50%, -50%)
            // 2. Apply offset (X axis)
            // 3. Rotate 90deg (Vertical Handle)
            transform: `translate(calc(-50% + ${offset}), -50%) rotate(90deg)`
        };
    };
    
    // Icon Animations (Left / Right)
    const getLeftIconStyle = () => {
        let left = '24px';
        let opacity = 1;

        if (sliderPos <= 50) {
            // 0 to 50: Left Icon fades IN (if enabled). Fixed at 24px.
            opacity = iconFade ? sliderPos / 50 : 1;
            left = '24px';
        } else {
            // 50 to 100: Left Icon moves RIGHT to Center (50% - 12px).
            const ratio = (sliderPos - 50) / 50;
            // Interpolate from 24px to calc(50% - 12px)
            left = `calc(24px + (${ratio} * (50% - 36px)))`;
            opacity = 1;
        }
        return { left, opacity };
    };

    const getRightIconStyle = () => {
        let right = '24px';
        let opacity = 1;

        if (sliderPos <= 50) {
            // 0 to 50: Right Icon moves LEFT from Center. Opacity 1.
            const ratio = sliderPos / 50; 
            // We want 124 -> 24.
            const px = 124 - (100 * ratio);
            right = `${px}px`;
            opacity = 1;
        } else {
            // 50 to 100: Right Icon fixed at Right. Fades OUT (if enabled).
            const ratio = (sliderPos - 50) / 50;
            opacity = iconFade ? (1 - ratio) : 1;
            right = '24px';
        }
        return { right, opacity };
    };

    return (
        <div className="horizontal-slider-wrapper">
            <div
                className={`horizontal-slider-container ${variant}`}
                ref={sliderRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                style={{ 
                    cursor: isDragging.current ? 'grabbing' : 'grab',
                    width: width,
                    height: height
                }}
            >
                {/* Frames */}
                <div
                    className="horizontal-slider-frame-left"
                    style={{ 
                        width: `${sliderPos}%`,
                        display: isBlind ? 'flex' : undefined,
                        flexDirection: isBlind ? 'row' : undefined,
                        overflow: 'hidden'
                    }}
                >
                    {isBlind && Array.from({ length: 18 }).map((_, i) => (
                        <div key={i} className="blind-slat-vertical" />
                    ))}
                </div>

                <div
                    className="horizontal-slider-frame-right"
                    style={{ width: `${100 - sliderPos}%` }}
                />

                {/* Icons */}
                {showIcons && (
                    <>
                        {/* Left Icon (Inside Fill usually) */}
                        {leftIcon && (
                            <div className="horizontal-slider-icon" style={getLeftIconStyle()}>
                                {leftIcon}
                            </div>
                        )}
                        
                        {/* Right Icon (Outside Fill usually) */}
                        {rightIcon && (
                            <div className="horizontal-slider-icon" style={{ ...getRightIconStyle(), left: 'auto', right: getRightIconStyle().right }}>
                                {rightIcon}
                            </div>
                        )}
                    </>
                )}

                {/* Handle */}
                <div
                    className="horizontal-slider-handle-container"
                    style={getHandleStyle()}
                >
                    {/* Rotate handle for Horizontal? Or keep dot? Default handle is round, so orientation doesn't matter. */}
                    <SliderHandle />
                </div>

            </div>

            {showValue && (
                <div className="horizontal-slider-value">
                    {displayValue}%
                </div>
            )}
        </div>
    );
};

export default HorizontalSlider;
