import React, { useState } from 'react';
import Button from '../../../atoms/Button/Button';

/**
 * Binary Action Molecule (Trigger)
 * 
 * Represents a momentary trigger action.
 * - Composed of: Button (Atom)
 * - Interaction: 
 *   - Press down: Active State (Visual feedback)
 *   - Release: Default State + Fires Action
 * - Tokens: Uses Button atom's Design Tokens.
 */
const Action = ({ 
  onClick,       // Action callback
  icon,
  disabled = false,
  ...props 
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const handlePointerDown = () => {
    if (!disabled) setIsPressed(true);
  };

  const handlePointerUp = () => {
    if (!disabled) setIsPressed(false);
  };

  const handlePointerLeave = () => {
    if (isPressed) setIsPressed(false);
  };

  return (
    <Button
      active={isPressed} // Map pressed state to Atom's active prop
      disabled={disabled}
      onClick={onClick}
      icon={icon}
      onMouseDown={handlePointerDown}
      onMouseUp={handlePointerUp}
      onMouseLeave={handlePointerLeave}
      onTouchStart={handlePointerDown}
      onTouchEnd={handlePointerUp}
      {...props}
    />
  );
};

export default Action;
