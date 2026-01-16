/**
 * Landing Page Component
 * Dynamically renders landing page from tenant configuration
 */

import React, { useMemo } from 'react';
import { Heading, Text } from '@sakhlaqi/ui';
import { useTenantStore } from '../stores';
import { DynamicComponentRenderer } from '../components/DynamicComponentRenderer';

export const LandingPage: React.FC = () => {
  const { config } = useTenantStore();

  // Sort sections by order
  const sortedSections = useMemo(() => {
    if (!config?.landingPageSections) return [];
    
    return [...config.landingPageSections].sort((a, b) => a.order - b.order);
  }, [config?.landingPageSections]);

  if (!config) {
    return (
      <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>
        <Text size="md">Loading tenant configuration...</Text>
      </div>
    );
  }

  if (sortedSections.length === 0) {
    return (
      <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>
        <Heading level={2}>Welcome to {config.name}</Heading>
        <Text size="md">No landing page sections configured.</Text>
      </div>
    );
  }

  return (
    <main>
      {sortedSections.map((section) => (
        <DynamicComponentRenderer key={section.id} section={section} />
      ))}
    </main>
  );
};

export default LandingPage;
