import React from 'react';
import styles from './CircularGauge.module.css';

/**
 * CircularGauge Molecule
 * 
 * Renders a circular track and a colored progress arc.
 * Pure presentation component - layout and logic should be handled by parent.
 */
const CircularGauge = ({ 
  size = 300,
  radius,
  strokeWidth = 24,
  center,
  startAngle = 135,
  totalAngle,
  circumference,
  segmentLength,
  offsetLength,
  gradientId = "tempGradient",
  gradientColors
}) => {
  const defaultGradient = [
    { offset: "0%", color: "var(--color-temp-warm)" },
    { offset: "50%", color: "var(--color-temp-neutral)" },
    { offset: "100%", color: "var(--color-temp-cool)" }
  ];

  const stops = gradientColors || defaultGradient;

  return (
    <svg className={styles.gaugeSvg} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <linearGradient 
          id={gradientId}
          gradientUnits="userSpaceOnUse"
          gradientTransform={`rotate(-${startAngle} ${center} ${center})`}
          x1="0" y1={size} x2={size} y2={size}
        >
          {stops.map((stop, index) => (
            <stop key={index} offset={stop.offset} stopColor={stop.color} />
          ))}
        </linearGradient>
      </defs>
      
      {/* Track (Gray Rail) */}
      <circle
        className={styles.track}
        cx={center}
        cy={center}
        r={radius}
        strokeWidth={strokeWidth}
        transform={`rotate(${startAngle} ${center} ${center})`}
        strokeDasharray={`${(totalAngle / 360) * circumference} ${circumference}`}
        strokeDashoffset={0}
      />

      {/* Range (Colored Arc) */}
      {segmentLength > 0 && (
        <circle
          className={styles.progress}
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={strokeWidth}
          transform={`rotate(${startAngle} ${center} ${center})`}
          strokeDasharray={`${segmentLength} ${circumference}`}
          strokeDashoffset={-offsetLength}
          style={{ stroke: `url(#${gradientId})` }}
        />
      )}
    </svg>
  );
};

export default CircularGauge;
