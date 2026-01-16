/**
 * CTA Section Component
 * Call-to-action section with message and button
 */

import React from 'react';
import { Button } from '@sakhlaqi/ui';
import './CTASection.css';

export interface CTASectionProps {
  title: string;
  description?: string;
  buttonText: string;
  buttonLink?: string;
  onButtonClick?: () => void;
  backgroundColor?: string;
}

export const CTASection: React.FC<CTASectionProps> = ({
  title,
  description,
  buttonText,
  buttonLink,
  onButtonClick,
  backgroundColor,
}) => {
  const handleClick = () => {
    if (onButtonClick) {
      onButtonClick();
    } else if (buttonLink) {
      window.location.href = buttonLink;
    }
  };

  const style = backgroundColor ? { backgroundColor } : undefined;

  return (
    <section className="cta-section" style={style}>
      <div className="container cta-content">
        <h2 className="cta-title">{title}</h2>
        {description && <p className="cta-description">{description}</p>}
        <Button size="lg" variant="secondary" onClick={handleClick}>
          {buttonText}
        </Button>
      </div>
    </section>
  );
};

export default CTASection;
