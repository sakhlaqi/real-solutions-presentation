/**
 * Dynamic Component Renderer
 * Safely renders components dynamically based on configuration.
 * 
 * Security Features:
 * - Whitelist-based component registry
 * - Prop validation before rendering
 * - URL sanitization for link props
 * - Error boundary per component
 * - Feature flag gating
 */

import React, { useMemo, memo, Component, type ErrorInfo, type ReactNode } from 'react';
import { 
  componentRegistry, 
  componentPropSchemas, 
  isValidComponentType,
  type ComponentType,
  type PropSchema 
} from './componentRegistry';
import type { LandingPageSection } from '../../types';
import { useTenantStore } from '../../stores';

export interface DynamicComponentRendererProps {
  section: LandingPageSection;
}

/**
 * Error Boundary for individual dynamic components
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ComponentErrorBoundary extends Component<
  { children: ReactNode; componentType: string },
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error(
      `Error in dynamic component "${this.props.componentType}":`,
      error,
      errorInfo
    );
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Render nothing on error - graceful degradation
      return null;
    }
    return this.props.children;
  }
}

/**
 * Validate URL to prevent javascript: and data: protocol injection
 */
function isValidUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  
  // Allow relative URLs
  if (url.startsWith('/') || url.startsWith('#')) return true;
  
  try {
    const parsed = new URL(url, window.location.origin);
    // Only allow http, https protocols
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    // If URL parsing fails, treat as relative and allow
    return !url.includes(':');
  }
}

/**
 * Sanitize text content to prevent HTML injection
 * For text-only props, strip any HTML tags
 */
function sanitizeText(text: unknown): string {
  if (typeof text !== 'string') return String(text || '');
  // Remove HTML tags for text-only fields
  return text.replace(/<[^>]*>/g, '');
}

/**
 * Validate and sanitize props based on schema
 */
function validateAndSanitizeProps(
  props: Record<string, unknown>,
  schema: PropSchema | undefined,
  componentType: string
): Record<string, unknown> | null {
  if (!props || typeof props !== 'object') {
    console.warn(`Invalid props for component "${componentType}"`);
    return null;
  }

  // If no schema, pass through (backward compatibility)
  if (!schema) {
    return props;
  }

  // Check required props
  for (const required of schema.required) {
    if (!(required in props) || props[required] === undefined || props[required] === null) {
      console.warn(`Missing required prop "${required}" for component "${componentType}"`);
      return null;
    }
  }

  // Sanitize props
  const sanitizedProps: Record<string, unknown> = {};
  
  for (const [key, value] of Object.entries(props)) {
    // Validate URL props
    if (schema.urlProps?.includes(key)) {
      if (typeof value === 'string' && !isValidUrl(value)) {
        console.warn(`Invalid URL in prop "${key}" for component "${componentType}": ${value}`);
        continue; // Skip invalid URL props
      }
    }
    
    // Sanitize text-only props
    if (schema.textOnlyProps?.includes(key)) {
      sanitizedProps[key] = sanitizeText(value);
    } else {
      sanitizedProps[key] = value;
    }
  }

  return sanitizedProps;
}

/**
 * Safely render a component with validation and error boundary
 */
export const DynamicComponentRenderer: React.FC<DynamicComponentRendererProps> = memo(({ section }) => {
  const { config } = useTenantStore();

  // Check visibility
  if (!section.visible) {
    return null;
  }

  // Check feature flag if specified
  if (section.featureFlag && config?.featureFlags) {
    const isEnabled = config.featureFlags[section.featureFlag as keyof typeof config.featureFlags];
    if (!isEnabled) {
      return null;
    }
  }

  // Validate component type against whitelist
  if (!isValidComponentType(section.componentType)) {
    console.warn(`Component type "${section.componentType}" not found in registry`);
    return null;
  }

  // Get component from registry
  const Component = componentRegistry[section.componentType as ComponentType];
  const schema = componentPropSchemas[section.componentType];

  // Validate and sanitize props
  const sanitizedProps = useMemo(
    () => validateAndSanitizeProps(section.props || {}, schema, section.componentType),
    [section.props, schema, section.componentType]
  );

  if (!sanitizedProps) {
    return null;
  }

  return (
    <ComponentErrorBoundary componentType={section.componentType}>
      <Component {...sanitizedProps} />
    </ComponentErrorBoundary>
  );
});

DynamicComponentRenderer.displayName = 'DynamicComponentRenderer';

export default DynamicComponentRenderer;
