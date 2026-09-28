import React, { useState, useRef } from 'react';
import { SoundHigh, SoundOff } from 'iconoir-react';
import styles from './SpeakerVolumeControl.module.css';

const SpeakerVolumeControl = ({ 
  initialVolume = 50,
  onChange // 볼륨 변경 콜백
}) => {
    // sliderPos: 0 (Top/Max Vol) to 100 (Bottom/Min Vol)
    // Inverted logic: Volume 100 = 0% Top Offset. Volume 0 = 100% Top Offset.
    const [sliderPos, setSliderPos] = useState(100 - Math.min(100,Math.max(0,initialVolume)));
    const sliderRef = useRef(null);
    const isDragging = useRef(false);
    const startY = useRef(0);
    const startSliderPos = useRef(0);

    const handlePointerDown = (e) => {
        if(e.button!==0||!e.isPrimary)return;
        isDragging.current = true;
        startY.current = e.clientY;
        startSliderPos.current = sliderPos;
        e.currentTarget.setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e) => {
        if (!isDragging.current || !sliderRef.current) return;

        const deltaY = e.clientY - startY.current;
        const height = sliderRef.current.getBoundingClientRect().height;
        const deltaPercentage = (deltaY / height) * 100;
        
        let newPos = startSliderPos.current + deltaPercentage;

        // Clamp betweeen 0 and 100
        if (newPos < 0) newPos = 0;
        if (newPos > 100) newPos = 100;

        setSliderPos(newPos);
        
        // onChange 콜백 호출
        if (onChange) {
            const newVolume = Math.round(100 - newPos);
            onChange(newVolume);
        }
    };

    const handlePointerUp = (e) => {
        isDragging.current = false;
        if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId);
    };

    // Derived Volume Value (0-100)
    const volume = Math.round(100 - sliderPos);

    // Icon Logic
    const splitPercent = sliderPos;
    const topIconIsOnBlack = splitPercent < 8; // Top icon on filled black part

    const getTopIconStyle = () => {
        return {
             top: '24px',
             color: topIconIsOnBlack ? 'var(--comp-slider-icon-color-light)' : 'var(--comp-slider-icon-color-dark)',
             transform: 'translateX(-50%)',
             opacity: 1
        };
    };

    const isMuted = volume === 0;

    return (
        <div className={styles.container}>
            <div className={styles.sliderWrapper}>
                <div 
                    className={styles.sliderContainer}
                    ref={sliderRef}
                    style={{'--volume-split':`${sliderPos}%`}}
                    role="slider"
                    tabIndex={0}
                    aria-label="Volume"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={volume}
                    onKeyDown={e=>{
                        const delta={ArrowUp:-1,ArrowRight:-1,ArrowDown:1,ArrowLeft:1}[e.key];
                        if(delta===undefined&&e.key!=='Home'&&e.key!=='End')return;
                        e.preventDefault();
                        const next=e.key==='Home'?100:e.key==='End'?0:Math.min(100,Math.max(0,sliderPos+delta));
                        setSliderPos(next);onChange?.(Math.round(100-next));
                    }}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerUp}
                    onLostPointerCapture={()=>{isDragging.current=false;}}
                >
                    {/* Top Frame (Empty/Inactive) */}
                    <div 
                        className={styles.frameTop} 
                    />

                    {/* Bottom Frame (Filled/Active) */}
                    <div 
                        className={styles.frameBottom}
                    />

                    {/* One volume icon: top during playback, bottom when muted. */}
                    {isMuted ? <div className={styles.icon} style={{bottom:'24px',color:'var(--sys-color-text-tertiary)'}}>
                        <SoundOff width={24} height={24}/>
                    </div> : <div className={styles.icon} style={getTopIconStyle()}>
                        <SoundHigh width={24} height={24}/>
                    </div>}

                </div>
            </div>
        </div>
    );
};

export default SpeakerVolumeControl;
