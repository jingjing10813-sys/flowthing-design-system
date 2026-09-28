import React from 'react';
import styles from './TemperatureControl.module.css';
import IndicatorDot from '../../../atoms/IndicatorDot/IndicatorDot';
import CircularGauge from '../Gauge/CircularGauge';
import Readout from '../../Display/Readout/Readout';
import { Action } from '../../Binary';
import { Minus, Plus } from 'iconoir-react';

const TemperatureControl = ({ 
  targetTemp = 24, 
  currentTemp = 24,
  onChange, 
  min = 18, 
  max = 30,
  gradientColors,
  gradientId
}) => {
  // Constants
  const size = 300;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;
  
  // Angle configuration (135 to 405 degrees)
  const startAngle = 135;
  const endAngle = 405;
  const totalAngle = endAngle - startAngle;

  // Helpers
  const polarToCartesian = (centerX, centerY, r, angleInDegrees) => {
    const angleInRadians = (angleInDegrees * Math.PI) / 180.0;
    return {
      x: centerX + (r * Math.cos(angleInRadians)),
      y: centerY + (r * Math.sin(angleInRadians))
    };
  };

  const mapTempToAngle = (temp) => {
    const clamped = Math.min(Math.max(temp, min), max);
    const ratio = (clamped - min) / (max - min);
    return startAngle + (ratio * totalAngle);
  };

  // 1. Calculate Angles
  const currentAngle = mapTempToAngle(currentTemp);
  const targetAngle = mapTempToAngle(targetTemp);

  // 2. Determine Range for Arc
  const rangeStartAngle = Math.min(currentAngle, targetAngle);
  const rangeEndAngle = Math.max(currentAngle, targetAngle);
  
  // 3. Calculate Arc Length for DashArray
  const rangeAngleSpan = rangeEndAngle - rangeStartAngle;
  const segmentLength = (rangeAngleSpan / 360) * circumference;

  // 4. Calculate Offset for Position
  const angleFromStart = rangeStartAngle - startAngle;
  const offsetLength = (angleFromStart / 360) * circumference;
  
  // 5. Calculate Dot Positions
  const currentPos = polarToCartesian(center, center, radius, currentAngle);
  const targetPos = polarToCartesian(center, center, radius, targetAngle);

  // Handlers
  const handleIncrease = () => {
    if (targetTemp < max) onChange(targetTemp + 1);
  };

  const handleDecrease = () => {
    if (targetTemp > min) onChange(targetTemp - 1);
  };

  return (
    <div className={styles.container}>
      {/* Molecule: Circular Gauge */}
      <CircularGauge
        size={size}
        radius={radius}
        center={center}
        strokeWidth={strokeWidth}
        startAngle={startAngle}
        totalAngle={totalAngle}
        circumference={circumference}
        segmentLength={segmentLength}
        offsetLength={offsetLength}
        gradientColors={gradientColors}
        gradientId={gradientId}
      />

      {/* Atom: Indicators (Positioned Absolutely) */}
      <div 
        className={styles.indicatorWrapper} 
        style={{ left: currentPos.x, top: currentPos.y }}
      >
        <IndicatorDot variant="current" />
      </div>

      <div 
        className={styles.indicatorWrapper} 
        style={{ left: targetPos.x, top: targetPos.y }}
      >
        <IndicatorDot variant="target" />
      </div>

      {/* Controls & Readout */}
      <div className={styles.controls}>
        <Action
          onClick={handleDecrease}
          disabled={targetTemp <= min}
          aria-label="Decrease temperature"
          icon={<Minus width={24} height={24} />}
        />

        {/* Molecule: Readout */}
        <Readout 
          value={targetTemp} 
          unit="°" 
          label="설정 온도" 
        />

        <Action
          onClick={handleIncrease}
          disabled={targetTemp >= max}
          aria-label="Increase temperature"
          icon={<Plus width={24} height={24} />}
        />
      </div>
    </div>
  );
};

export default TemperatureControl;
