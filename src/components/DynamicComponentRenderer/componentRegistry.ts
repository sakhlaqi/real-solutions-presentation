/**
 * Component Registry
 * Maps component types to React components for dynamic rendering.
 * 
 * Security: This is a whitelist-based approach to prevent arbitrary
 * component rendering. Only components explicitly registered here
 * can be rendered dynamically.
 * 
 * Extensibility: Add new components by:
 * 1. Import the component
 * 2. Add to componentRegistry
 * 3. Add prop schema to componentPropSchemas
 */

import { type ComponentType as ReactComponentType } from 'react';
import { Hero, FeatureGrid, CTASection, ContentSection } from '../composite';

/**
 * Prop schema for validation
 * Defines required and optional props for each component type
 */
export interface PropSchema {
  required: string[];
  optional?: string[];
  /** Props that should be validated as URLs */
  urlProps?: string[];
  /** Props that should NOT contain HTML/scripts */
  textOnlyProps?: string[];
}

/**
 * Component registry - whitelist of allowed components
 */
export const componentRegistry: Record<string, ReactComponentType<any>> = {
  hero: Hero,
  featureGrid: FeatureGrid,
  ctaSection: CTASection,
  contentSection: ContentSection,
};

/**
 * Prop schemas for validation
 * Used to validate component props before rendering
 */
export const componentPropSchemas: Record<string, PropSchema> = {
  hero: {
    required: ['title'],
    optional: ['subtitle', 'ctaText', 'ctaLink', 'backgroundImage'],
    urlProps: ['ctaLink', 'backgroundImage'],
    textOnlyProps: ['title', 'subtitle', 'ctaText'],
  },
  featureGrid: {
    required: ['features'],
    optional: ['title', 'columns'],
    textOnlyProps: ['title'],
  },
  ctaSection: {
    required: ['title', 'ctaText'],
    optional: ['description', 'ctaLink', 'variant'],
    urlProps: ['ctaLink'],
    textOnlyProps: ['title', 'description', 'ctaText'],
  },
  contentSection: {
    required: ['content'],
    optional: ['title', 'alignment', 'backgroundColor'],
    textOnlyProps: ['title'],
  },
};

export type ComponentType = keyof typeof componentRegistry;

/**
 * Check if a component type is registered
 */
export function isValidComponentType(type: string): type is ComponentType {
  return type in componentRegistry;
}

/**
 * Get component from registry
 */
export function getComponent(type: string): ReactComponentType<any> | undefined {
  return componentRegistry[type];
}

/**
 * Get prop schema for component type
 */
export function getPropSchema(type: string): PropSchema | undefined {
  return componentPropSchemas[type];
}

export default componentRegistry;
