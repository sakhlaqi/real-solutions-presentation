/**
 * Dynamic Component Renderer
 * Renders components dynamically based on configuration
 */

import React, { Suspense, lazy } from 'react';
import { componentRegistry } from './componentRegistry';
import type { ComponentType } from './componentRegistry';
import type { LandingPageSection } from '../../types';
import { useTenantStore } from '../../stores';

export interface DynamicComponentRendererProps {
  section: LandingPageSection;
}

/**
 * Safely render a component with error boundary
 */
export const DynamicComponentRenderer: React.FC<DynamicComponentRendererProps> = ({ section }) => {
  const { config } = useTenantStore();

  // Check visibility
  if (!section.visible) {
    return null;
  }

  // Check feature flag if specified
  if (section.featureFlag && config?.featureFlags) {
    const isEnabled = config.featureFlags[section.featureFlag];
    if (!isEnabled) {
      return null;
    }
  }

  // Get component from registry
  const Component = componentRegistry[section.componentType as ComponentType];

  if (!Component) {
    console.warn(`Component type "${section.componentType}" not found in registry`);
    return null;
  }

  try {
    // Validate props before rendering
    if (!section.props || typeof section.props !== 'object') {
      console.warn(`Invalid props for component "${section.componentType}"`);
      return null;
    }

    return <Component {...section.props} />;
  } catch (error) {
    console.error(`Error rendering component "${section.componentType}":`, error);
    return null;
  }
};

export default DynamicComponentRenderer;
