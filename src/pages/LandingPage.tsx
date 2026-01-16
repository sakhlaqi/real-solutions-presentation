/**
 * Landing Page Component
 * Dynamically renders landing page from tenant configuration
 */

import React, { useMemo } from 'react';
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
        <p>Loading tenant configuration...</p>
      </div>
    );
  }

  if (sortedSections.length === 0) {
    return (
      <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Welcome to {config.name}</h2>
        <p>No landing page sections configured.</p>
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
