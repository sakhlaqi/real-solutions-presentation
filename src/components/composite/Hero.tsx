/**
 * Hero Section Component
 * Large header section with title, subtitle, and CTA
 */

import React from 'react';
import { Button } from '@sakhlaqi/ui';
import './Hero.css';

export interface HeroProps {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  onCtaClick?: () => void;
  backgroundImage?: string;
  align?: 'left' | 'center';
}

export const Hero: React.FC<HeroProps> = ({
  title,
  subtitle,
  ctaText,
  ctaLink,
  onCtaClick,
  backgroundImage,
  align = 'center',
}) => {
  const handleCtaClick = () => {
    if (onCtaClick) {
      onCtaClick();
    } else if (ctaLink) {
      window.location.href = ctaLink;
    }
  };

  const style = backgroundImage
    ? { backgroundImage: `url(${backgroundImage})` }
    : undefined;

  return (
    <section className={`hero hero-align-${align}`} style={style}>
      <div className="hero-overlay">
        <div className="container hero-content">
          <h1 className="hero-title">{title}</h1>
          {subtitle && <p className="hero-subtitle">{subtitle}</p>}
          {ctaText && (
            <Button size="lg" onClick={handleCtaClick}>
              {ctaText}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
