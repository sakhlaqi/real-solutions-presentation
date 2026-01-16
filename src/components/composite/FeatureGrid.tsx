/**
 * Feature Grid Component
 * Display features in a responsive grid
 */

import React from 'react';
import { Card, Text, Heading } from '@sakhlaqi/ui';
import './FeatureGrid.css';

export interface Feature {
  id: string;
  icon?: string;
  title: string;
  description: string;
}

export interface FeatureGridProps {
  title?: string;
  subtitle?: string;
  features: Feature[];
  columns?: 2 | 3 | 4;
}

export const FeatureGrid: React.FC<FeatureGridProps> = ({
  title,
  subtitle,
  features,
  columns = 3,
}) => {
  return (
    <section className="feature-grid-section">
      <div className="container">
        {(title || subtitle) && (
          <div className="feature-grid-header">
            {title && <Heading level={2} className="feature-grid-title">{title}</Heading>}
            {subtitle && <Text size="lg" className="feature-grid-subtitle">{subtitle}</Text>}
          </div>
        )}
        <div className={`feature-grid feature-grid-cols-${columns}`}>
          {features.map((feature) => (
            <Card key={feature.id} padding="lg">
              {feature.icon && (
                <div className="feature-icon" aria-hidden="true">
                  {feature.icon}
                </div>
              )}
              <Heading level={3} className="feature-title">{feature.title}</Heading>
              <Text color="secondary">{feature.description}</Text>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureGrid;
