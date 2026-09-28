import React, { useState, useRef } from 'react';
import { SunLight, HalfMoon } from 'iconoir-react';
import SliderHandle from '../../../atoms/SliderHandle/SliderHandle';
import './VerticalSlider.css';

const VerticalSlider = ({ moonColor = "white", sunColor = "#515151", handlePosition = "in-bottom", variant = "standard", showIcons = true }) => {
    // sliderPos: 0 (Top/Dark) to 100 (Bottom/Bright)
    const [sliderPos, setSliderPos] = useState(50);
    const sliderRef = useRef(null);
    const isDragging = useRef(false);
    const startY = useRef(0);
    const startSliderPos = useRef(0);

    const isBlind = variant === 'blind';

    const handlePointerDown = (e) => {
        isDragging.current = true;
        startY.current = e.clientY;
        startSliderPos.current = sliderPos;
        e.currentTarget.setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e) => {
        if (!isDragging.current || !sliderRef.current) return;

        const deltaY = e.clientY - startY.current;
        const height = sliderRef.current.getBoundingClientRect().height;
        
        // Convert deltaY to percentage
        const deltaPercentage = (deltaY / height) * 100;
        
        // New position is start position + delta
        let newPos = startSliderPos.current + deltaPercentage;

        // Clamp betweeen 0 and 100
        if (newPos < 0) newPos = 0;
        if (newPos > 100) newPos = 100;

        setSliderPos(newPos);
    };

    const handlePointerUp = (e) => {
        isDragging.current = false;
        e.currentTarget.releasePointerCapture(e.pointerId);
    };

    // Value Display Logic (Based on handlePosition)
    // in-bottom: Top is 100 (Bright), Bottom is 0 (Dark) -> Inverted logic relative to sliderPos (0 at top)?
    // User Request: "in-bottom case: slider all down is 0, all up is 100"
    // sliderPos 0 = Top, sliderPos 100 = Bottom.
    // So for in-bottom: 100 - sliderPos. (Top=100, Bottom=0)
    
    // in-top: "slider all up is 0, all down is 100"
    // sliderPos 0 = Top, sliderPos 100 = Bottom.
    // So for in-top: sliderPos. (Top=0, Bottom=100)

    const displayValue = Math.round(handlePosition === 'in-bottom' ? 100 - sliderPos : sliderPos);

    // Handle Position Logic
    // in-bottom: 6px BELOW split line.
    // in-top: 6px ABOVE split line.
    
    const getHandleStyle = () => {
        const baseStyle = { top: `${sliderPos}%` };
        
        if (handlePosition === 'in-bottom') {
            // Position 6px BELOW the split (sliderPos)
            return {
                ...baseStyle,
                transform: 'translate(-50%, 6px)' 
            };
        } else {
            // Position 6px ABOVE the split (sliderPos)
            // Handle height is 4px. To be "above", we generally align bottom of handle to split-6px?
            // Or just center alignment offset? 
            // Let's assume Top of handle is at split - 6px - handleHeight(4px).
            return {
                ...baseStyle,
                transform: 'translate(-50%, calc(-100% - 6px))'
            };
        }
    };
    
    // Icon Animations
    // Center Top Offset = 124px (Approx)
    // Default Padding = 24px

    // Moon (Top Icon) Logic:
    // At 0% (Dark/Top): Opacity 0 (Disappears).
    // At 100% (Bright/Bottom): Centered (Suggests darkening).

    const getMoonStyle = () => {
        let top = '24px';
        let opacity = 1;

        if (sliderPos <= 50) {
            // 0 to 50: Moon fades IN. Position Fixed at 24px.
            // At 0: Opacity 0.
            // At 50: Opacity 1.
            opacity = sliderPos / 50;
            top = '24px';
        } else {
            // 50 to 100: Moon moves DOWN to Center. Opacity 1.
            // At 50: Top 24px.
            // At 100: Top 124px.
            const ratio = (sliderPos - 50) / 50;
            const px = 24 + (100 * ratio); // 24 + 100 = 124
            top = `${px}px`;
            opacity = 1;
        }
        return { top, opacity };
    };

    // Sun (Bottom Icon) Logic:
    // At 0% (Dark/Top): Centered (Suggests brightening). 
    // At 100% (Bright/Bottom): Opacity 0 (Disappears).

    const getSunStyle = () => {
        let bottom = '24px';
        let opacity = 1;

        if (sliderPos <= 50) {
            // 0 to 50: Sun moves DOWN from Center to Bottom. Opacity 1.
            // At 0: Bottom 124px.
            // At 50: Bottom 24px.
            // ratio: increases as sliderPos increases
            const ratio = sliderPos / 50; // 0 -> 1
            // We want 124 -> 24.
            // 124 - (100 * ratio)
            const px = 124 - (100 * ratio);
            bottom = `${px}px`;
            opacity = 1;
        } else {
            // 50 to 100: Sun is at Bottom. Fades OUT.
            // At 50: Opacity 1.
            // At 100: Opacity 0.
            const ratio = (sliderPos - 50) / 50; // 0 -> 1
            opacity = 1 - ratio;
            bottom = '24px';
        }
        return { bottom, opacity };
    };

    return (
        <div className="vertical-slider-wrapper">
            <div
                className={`vertical-slider-container ${variant}`}
                ref={sliderRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                style={{ cursor: isDragging.current ? 'grabbing' : 'grab' }}
            >
                {/* Frames */}
                <div
                    className="vertical-slider-frame-top"
                    style={{ 
                        height: `${sliderPos}%`,
                        display: isBlind ? 'flex' : undefined,
                        flexDirection: isBlind ? 'column' : undefined,
                        overflow: 'hidden'
                    }}
                >
                    {isBlind && Array.from({ length: 18 }).map((_, i) => (
                        <div key={i} className="blind-slat" />
                    ))}
                </div>

                <div
                    className="vertical-slider-frame-bottom"
                    style={{ height: `${100 - sliderPos}%` }}
                />

                {/* Icons */}
                {showIcons && (
                    <>
                        <div className="vertical-slider-icon" style={getMoonStyle()}>
                            <HalfMoon width={24} height={24} strokeWidth={1.5} color={moonColor} />
                        </div>
                        <div className="vertical-slider-icon" style={{ ...getSunStyle(), top: 'auto', bottom: getSunStyle().bottom }}>
                            <SunLight width={24} height={24} strokeWidth={1.5} color={sunColor} />
                        </div>
                    </>
                )}

                {/* Handle */}
                <div
                    className="vertical-slider-handle-container"
                    style={getHandleStyle()}
                >
                    <SliderHandle />
                </div>

            </div>

            <div className="vertical-slider-value">
                {displayValue}%
            </div>
        </div>
    );
};

export default VerticalSlider;