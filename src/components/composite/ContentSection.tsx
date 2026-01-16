/**
 * Content Section Component
 * Flexible content section with title and body
 */

import React from 'react';
import { Heading, Text } from '@sakhlaqi/ui';
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
        {title && <Heading level={2} className="content-title">{title}</Heading>}
        {subtitle && <Text size="lg" className="content-subtitle">{subtitle}</Text>}
        <div className="content-body">{children}</div>
      </div>
    </section>
  );
};

export default ContentSection;
