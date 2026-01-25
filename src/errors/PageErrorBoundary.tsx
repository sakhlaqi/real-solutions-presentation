/**
 * Page Error Boundary
 * 
 * Catches and handles errors in JSON-rendered pages.
 * Provides tenant-safe fallback UI and error logging.
 * 
 * **Responsibilities:**
 * - Catch schema validation errors
 * - Catch renderer errors (JSON → React conversion)
 * - Display user-friendly fallback UI
 * - Log errors with tenant context
 * - Prevent entire app crash from page errors
 * 
 * **Usage:**
 * Wrap around <JsonPage /> in routing
 */

import React, { Component, type ReactNode } from 'react';
import { Heading, Text, Button, Card } from '@sakhlaqi/ui';
import { useTenantStore } from '../stores';

interface PageErrorBoundaryProps {
  /** Children to protect with error boundary */
  children: ReactNode;
  /** Page path for error context */
  pagePath?: string;
  /** Custom fallback UI */
  fallback?: (error: Error, errorInfo: React.ErrorInfo, reset: () => void) => ReactNode;
  /** Callback when error occurs */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface PageErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  errorId: string | null;
}

/**
 * Page Error Boundary Class Component
 * 
 * Uses class component because React error boundaries require class components
 */
class PageErrorBoundaryClass extends Component<
  PageErrorBoundaryProps & { tenantId?: string; tenantSlug?: string },
  PageErrorBoundaryState
> {
  constructor(props: PageErrorBoundaryProps & { tenantId?: string; tenantSlug?: string }) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<PageErrorBoundaryState> {
    // Update state so next render shows fallback UI
    return {
      hasError: true,
      error,
      errorId: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error with tenant context
    this.logError(error, errorInfo);

    // Update state with error info
    this.setState({ errorInfo });

    // Call onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  /**
   * Log error with tenant context
   */
  private logError(error: Error, errorInfo: React.ErrorInfo) {
    const { tenantId, tenantSlug, pagePath } = this.props;
    const { errorId } = this.state;

    // Categorize error type
    const errorType = this.categorizeError(error);

    // Build error context
    const errorContext = {
      errorId,
      type: errorType,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      pagePath,
      tenant: {
        id: tenantId,
        slug: tenantSlug,
      },
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    // Log to console (in production, send to error tracking service)
    console.error('[PageErrorBoundary] Error caught:', errorContext);

    // In production, send to error tracking service
    if (import.meta.env.MODE === 'production') {
      this.sendToErrorTracking(errorContext);
    }
  }

  /**
   * Categorize error type for better handling
   */
  private categorizeError(error: Error): string {
    const message = error.message.toLowerCase();
    const name = error.name.toLowerCase();

    // Schema validation errors
    if (
      message.includes('validation') ||
      message.includes('schema') ||
      message.includes('invalid') ||
      name.includes('validation')
    ) {
      return 'SCHEMA_VALIDATION_ERROR';
    }

    // Renderer errors
    if (
      message.includes('render') ||
      message.includes('component') ||
      message.includes('undefined is not an object') ||
      message.includes('cannot read property')
    ) {
      return 'RENDERER_ERROR';
    }

    // Network/API errors
    if (
      message.includes('network') ||
      message.includes('fetch') ||
      message.includes('timeout')
    ) {
      return 'NETWORK_ERROR';
    }

    // Data source errors
    if (message.includes('datasource') || message.includes('data source')) {
      return 'DATA_SOURCE_ERROR';
    }

    // Unknown error
    return 'UNKNOWN_ERROR';
  }

  /**
   * Send error to tracking service (placeholder)
   */
  private sendToErrorTracking(errorContext: Record<string, unknown>) {
    // TODO: Integrate with error tracking service
    // Examples: Sentry, LogRocket, Rollbar, etc.
    
    // For now, just log that we would send it
    console.log('[PageErrorBoundary] Would send to error tracking:', {
      errorId: errorContext.errorId,
      type: errorContext.type,
    });

    // Example Sentry integration:
    // Sentry.captureException(errorContext.message, {
    //   contexts: {
    //     tenant: errorContext.tenant,
    //     page: { path: errorContext.pagePath },
    //   },
    //   tags: {
    //     errorType: errorContext.type,
    //   },
    // });
  }

  /**
   * Reset error boundary
   */
  private resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    });
  };

  /**
   * Get user-friendly error message
   */
  private getUserMessage(error: Error): string {
    const errorType = this.categorizeError(error);

    switch (errorType) {
      case 'SCHEMA_VALIDATION_ERROR':
        return 'This page has a configuration error. The page structure does not match the expected format.';
      
      case 'RENDERER_ERROR':
        return 'This page failed to load properly. There may be an issue with the page components.';
      
      case 'NETWORK_ERROR':
        return 'Unable to load page data. Please check your network connection and try again.';
      
      case 'DATA_SOURCE_ERROR':
        return 'Unable to load data for this page. The data source may be unavailable.';
      
      default:
        return 'An unexpected error occurred while loading this page.';
    }
  }

  /**
   * Get developer-friendly error details
   */
  private getDeveloperDetails(): ReactNode {
    const { error, errorInfo, errorId } = this.state;
    
    if (import.meta.env.MODE !== 'development') {
      return null;
    }

    return (
      <details style={{ marginTop: '2rem', textAlign: 'left' }}>
        <summary style={{ cursor: 'pointer', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          Developer Details (click to expand)
        </summary>
        <div style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '1rem', 
          borderRadius: '4px',
          fontSize: '0.875rem',
          fontFamily: 'monospace',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          maxHeight: '400px',
          overflow: 'auto',
        }}>
          <div style={{ marginBottom: '1rem' }}>
            <strong>Error ID:</strong> {errorId}
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <strong>Error Type:</strong> {error && this.categorizeError(error)}
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <strong>Error Message:</strong><br />
            {error?.message}
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <strong>Stack Trace:</strong><br />
            {error?.stack}
          </div>
          {errorInfo && (
            <div>
              <strong>Component Stack:</strong><br />
              {errorInfo.componentStack}
            </div>
          )}
        </div>
      </details>
    );
  }

  render() {
    const { hasError, error } = this.state;
    const { children, fallback, pagePath } = this.props;

    if (hasError && error) {
      // Use custom fallback if provided
      if (fallback && this.state.errorInfo) {
        return fallback(error, this.state.errorInfo, this.resetError);
      }

      // Default fallback UI
      return (
        <div style={{ 
          padding: '2rem',
          maxWidth: '800px',
          margin: '0 auto',
        }}>
          <div style={{ padding: '2rem' }}>
            <Card>
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ 
                fontSize: '3rem', 
                marginBottom: '1rem',
                opacity: 0.3,
              }}>
                ⚠️
              </div>
              <Heading level={2}>Page Error</Heading>
              <div style={{ marginTop: '1rem', color: '#666' }}>
                <Text size="md">{this.getUserMessage(error)}</Text>
              </div>
              {pagePath && (
                <div style={{ marginTop: '0.5rem', color: '#999' }}>
                  <Text size="sm">Page: {pagePath}</Text>
                </div>
              )}
            </div>

            <div style={{ 
              display: 'flex', 
              gap: '1rem', 
              justifyContent: 'center',
              marginBottom: '1rem',
            }}>
              <Button onClick={this.resetError} variant="contained" color="primary">
                Try Again
              </Button>
              <Button onClick={() => window.history.back()} variant="outlined">
                Go Back
              </Button>
              <Button onClick={() => window.location.href = '/admin'} variant="outlined">
                Go to Dashboard
              </Button>
            </div>

            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <Text size="sm" color="muted">
                If this problem persists, please contact support and reference error ID: {this.state.errorId}
              </Text>
            </div>

            {this.getDeveloperDetails()}
            </Card>
          </div>
        </div>
      );
    }

    return children;
  }
}

/**
 * Functional wrapper component to inject tenant context
 * 
 * This allows us to access hooks while still using class component for error boundary
 */
export const PageErrorBoundary: React.FC<PageErrorBoundaryProps> = (props) => {
  const { tenant, tenantSlug } = useTenantStore();

  return (
    <PageErrorBoundaryClass
      {...props}
      tenantId={tenant?.id}
      tenantSlug={tenantSlug}
    />
  );
};

export default PageErrorBoundary;
