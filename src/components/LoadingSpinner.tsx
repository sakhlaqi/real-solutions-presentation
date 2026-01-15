/**
 * Loading Spinner Component
 * Reusable loading indicator
 */

import React from 'react';
import './LoadingSpinner.css';

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  message,
  fullScreen = false,
}) => {
  const content = (
    <div className={`loading-spinner-container ${fullScreen ? 'loading-fullscreen' : ''}`}>
      <div className={`loading-spinner loading-spinner-${size}`} />
      {message && <p className="loading-message">{message}</p>}
    </div>
  );

  return content;
};

export default LoadingSpinner;
