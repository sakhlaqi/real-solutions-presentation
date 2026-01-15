/**
 * Content Section Component
 * Flexible content section with title and body
 */

import React from 'react';
import './ContentSection.css';

export interface ContentSectionProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  backgroundColor?: string;
  textAlign?: 'left' | 'center' | 'right';
}

export const ContentSection: React.FC<ContentSectionProps> = ({
  title,
  subtitle,
  children,
  backgroundColor,
  textAlign = 'left',
}) => {
  const style = backgroundColor ? { backgroundColor } : undefined;

  return (
    <section className="content-section" style={style}>
      <div className={`container content-align-${textAlign}`}>
        {title && <h2 className="content-title">{title}</h2>}
        {subtitle && <p className="content-subtitle">{subtitle}</p>}
        <div className="content-body">{children}</div>
      </div>
    </section>
  );
};

export default ContentSection;
