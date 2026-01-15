/**
 * Component Registry
 * Maps component types to React components for dynamic rendering
 */

import { Hero, FeatureGrid, CTASection, ContentSection } from '../composite';

export const componentRegistry = {
  hero: Hero,
  featureGrid: FeatureGrid,
  ctaSection: CTASection,
  contentSection: ContentSection,
};

export type ComponentType = keyof typeof componentRegistry;

export default componentRegistry;
