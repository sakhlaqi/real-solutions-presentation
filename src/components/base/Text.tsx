/**
 * Text Component
 * Typography component with variants
 */

import React from 'react';
import './Text.css';

export interface TextProps {
  as?: 'p' | 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  variant?: 'body' | 'caption' | 'subtitle' | 'overline';
  color?: 'primary' | 'secondary' | 'error' | 'success' | 'warning';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  align?: 'left' | 'center' | 'right';
  children: React.ReactNode;
  className?: string;
}

export const Text: React.FC<TextProps> = ({
  as: Component = 'p',
  variant = 'body',
  color,
  weight = 'normal',
  align = 'left',
  children,
  className = '',
}) => {
  const classes = [
    'text',
    `text-${variant}`,
    color ? `text-color-${color}` : '',
    `text-weight-${weight}`,
    `text-align-${align}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <Component className={classes}>{children}</Component>;
};

export default Text;
