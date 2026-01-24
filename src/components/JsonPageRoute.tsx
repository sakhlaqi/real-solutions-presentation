/**
 * JsonPageRoute Component
 * 
 * A route wrapper that fetches and renders a JSON-driven page.
 * Handles loading states, errors, and missing pages.
 */

import React, { useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spinner, Heading, Text, Button } from '@sakhlaqi/ui';
import { JsonPage } from '../pages/JsonPage';
import { useJsonPages } from '../hooks/useJsonPages';
import { dataSourceResolver } from '../data';
import { setBehaviorContext } from '../behaviors';
import { PageErrorBoundary } from '../errors';

interface JsonPageRouteProps {
  /** Page path to render (e.g., "/dashboard", "/employees") */
  pagePath: string;
  /** Optional page title for fallback */
  pageTitle?: string;
}

/**
 * JsonPageRoute Component
 * 
 * Fetches and renders a JSON-driven page based on the page path.
 * Injects behavior context and data source resolver.
 * 
 * @example
 * ```tsx
 * <Route 
 *   path="/dashboard" 
 *   element={<JsonPageRoute pagePath="/dashboard" />} 
 * />
 * ```
 */
export const JsonPageRoute: React.FC<JsonPageRouteProps> = ({
  pagePath,
  pageTitle,
}) => {
  const navigate = useNavigate();
  const { pages, isLoading, error } = useJsonPages();

  // Set behavior context with navigation
  useEffect(() => {
    setBehaviorContext({
      navigate,
      showNotification: (message, type = 'info') => {
        // TODO: Replace with actual toast/notification system
        console.log(`[${type.toUpperCase()}]`, message);
        
        // Simple fallback alert for now
        if (type === 'error') {
          alert(`Error: ${message}`);
        }
      },
      showConfirmation: (message, onConfirm) => {
        if (window.confirm(message)) {
          onConfirm();
        }
      },
    });
  }, [navigate]);

  // Get page config
  const pageConfig = useMemo(() => pages[pagePath], [pages, pagePath]);

  // Loading state
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '400px',
        gap: '1rem'
      }}>
        <Spinner size="large" />
        <Text size="md" color="muted">Loading page configuration...</Text>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={{ 
        padding: '2rem', 
        textAlign: 'center',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        <Heading level={2}>Configuration Error</Heading>
        <Text size="md" style={{ margin: '1rem 0', color: '#d32f2f' }}>
          {error}
        </Text>
        <Button onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  // Page not found
  if (!pageConfig) {
    return (
      <div style={{ 
        padding: '2rem', 
        textAlign: 'center',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        <Heading level={2}>Page Not Found</Heading>
        <Text size="md" style={{ margin: '1rem 0' }}>
          The page "{pagePath}" is not configured for this tenant.
          {pageTitle && ` (${pageTitle})`}
        </Text>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
          <Button onClick={() => navigate('/admin')} variant="primary">
            Go to Dashboard
          </Button>
          <Button onClick={() => navigate(-1)} variant="outlined">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  // Render JSON page with config wrapped in error boundary
  return (
    <PageErrorBoundary
      pagePath={pagePath}
      onError={(error, errorInfo) => {
        // Additional error handling if needed
        console.error(`[JsonPageRoute] Error in page ${pagePath}:`, error, errorInfo);
      }}
    >
      <JsonPage
        pageConfig={pageConfig}
        data={{
          dataSourceResolver,
        }}
        provider="mui"
      />
    </PageErrorBoundary>
  );
};

export default JsonPageRoute;
