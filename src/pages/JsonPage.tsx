/**
 * JsonPage Component
 * 
 * Bridge component that delegates all UI rendering to the UI library's PageRenderer.
 * Acts as the single point where JSON page configurations are converted to React components.
 */

import React from 'react';
import { PageRenderer, validatePageConfig, getValidationSummary } from '@sakhlaqi/ui';
import type { PageConfig } from '@sakhlaqi/ui';

/**
 * JsonPage Props
 */
export interface JsonPageProps {
  /** Page configuration (JSON object) */
  pageConfig: PageConfig | null;
  
  /** Loading component */
  loading?: React.ReactNode;
  
  /** Custom error component */
  errorComponent?: React.ComponentType<{ error: Error }>;
  
  /** Optional data context for dynamic values */
  data?: Record<string, unknown>;
  
  /** UI provider to use (mui | internal) */
  provider?: 'mui' | 'internal';
  
  /** Enable debug mode */
  debug?: boolean;
}

/**
 * Default Error Component
 */
function DefaultErrorComponent({ error }: { error: Error }) {
  return (
    <div
      style={{
        padding: '2rem',
        margin: '2rem',
        border: '2px solid #dc3545',
        borderRadius: '8px',
        backgroundColor: '#fff5f5',
        color: '#c92a2a',
      }}
    >
      <h2 style={{ margin: '0 0 1rem 0' }}>❌ Page Configuration Error</h2>
      <p style={{ margin: '0 0 1rem 0' }}>
        <strong>Error:</strong> {error.message}
      </p>
      <details>
        <summary style={{ cursor: 'pointer', marginBottom: '0.5rem' }}>
          <strong>Details</strong>
        </summary>
        <pre
          style={{
            marginTop: '0.5rem',
            padding: '0.5rem',
            backgroundColor: '#f1f3f5',
            borderRadius: '4px',
            overflow: 'auto',
            fontSize: '12px',
          }}
        >
          {error.stack}
        </pre>
      </details>
    </div>
  );
}

/**
 * Default Loading Component
 */
function DefaultLoadingComponent() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        fontSize: '1rem',
        color: '#6c757d',
      }}
    >
      Loading page...
    </div>
  );
}

/**
 * JsonPage Component
 * 
 * Renders a complete page from JSON configuration using the UI library's PageRenderer.
 * 
 * **Usage:**
 * ```tsx
 * <JsonPage
 *   pageConfig={pageConfig}
 *   provider="mui"
 *   debug={false}
 * />
 * ```
 * 
 * **Responsibilities:**
 * - Accept page configuration JSON
 * - Validate configuration (handled by PageRenderer)
 * - Delegate rendering to UI library's PageRenderer
 * - Handle missing or invalid configurations
 * - Provide fallback UI for loading and error states
 * 
 * **Does NOT:**
 * - Import MUI directly
 * - Build UI with JSX
 * - Manually render components
 * - Handle business logic or data fetching
 */
export const JsonPage: React.FC<JsonPageProps> = ({
  pageConfig,
  loading = <DefaultLoadingComponent />,
  errorComponent: ErrorComponent = DefaultErrorComponent,
  data = {},
  provider = 'mui',
  debug = false,
}) => {
  // Handle missing config
  if (!pageConfig) {
    return (
      <ErrorComponent
        error={new Error('No page configuration provided. Please ensure the page configuration is loaded from the API.')}
      />
    );
  }

  // Validate page configuration using UI library schema
  const validationResult = validatePageConfig(pageConfig);
  
  if (!validationResult.success) {
    const errorSummary = getValidationSummary(validationResult.errors || []);
    
    if (debug) {
      console.error('[JsonPage] Page configuration validation failed:', validationResult.errors);
    }
    
    return (
      <ErrorComponent
        error={new Error(
          `Page configuration validation failed:\n\n${errorSummary}\n\nPlease check the API response and ensure it matches the expected schema.`
        )}
      />
    );
  }

  // Use validated and typed config
  const validatedConfig = validationResult.data!;

  if (debug) {
    console.log('[JsonPage] Page configuration validated successfully:', validatedConfig);
  }

  // Delegate to UI library's PageRenderer with validated config
  return (
    <PageRenderer
      config={validatedConfig}
      options={{
        provider,
        data,
        debug,
        maxDepth: 50,
      }}
      loading={loading}
      errorComponent={ErrorComponent}
    />
  );
};

export default JsonPage;
