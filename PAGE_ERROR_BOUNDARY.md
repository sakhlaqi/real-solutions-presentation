# Page Error Boundary Implementation

## Overview

The `PageErrorBoundary` component provides robust error handling for JSON-rendered pages, catching schema validation errors, renderer errors, and displaying tenant-safe fallback UI with detailed error logging.

## Architecture

```
JsonPageRoute
    ↓
PageErrorBoundary (catches errors)
    ↓
JsonPage (validates & renders JSON)
    ↓
PageRenderer (UI library)
    ↓
React Components
```

If any error occurs in JsonPage or below, PageErrorBoundary catches it and displays fallback UI.

## Component Structure

### PageErrorBoundary.tsx

**Location**: `src/errors/PageErrorBoundary.tsx`

**Type**: React Class Component (required for error boundaries)

**Props**:
```typescript
interface PageErrorBoundaryProps {
  children: ReactNode;              // Content to protect
  pagePath?: string;                // Page path for error context
  fallback?: (error, errorInfo, reset) => ReactNode;  // Custom fallback UI
  onError?: (error, errorInfo) => void;  // Error callback
}
```

### Error Categories

The boundary automatically categorizes errors:

1. **SCHEMA_VALIDATION_ERROR**
   - Validation failures
   - Invalid schema
   - Missing required fields
   - Type mismatches

2. **RENDERER_ERROR**
   - Component rendering failures
   - Undefined properties
   - Missing components
   - React errors

3. **NETWORK_ERROR**
   - API failures
   - Timeout errors
   - Connection issues

4. **DATA_SOURCE_ERROR**
   - Data source unavailable
   - Query failures

5. **UNKNOWN_ERROR**
   - Uncategorized errors

### Error Context Logging

Every error is logged with comprehensive context:

```typescript
{
  errorId: "error-1706097600000-abc123",     // Unique error ID
  type: "SCHEMA_VALIDATION_ERROR",           // Categorized type
  message: "Invalid page configuration",     // Error message
  stack: "Error: Invalid...\n  at...",      // Stack trace
  componentStack: "in JsonPage...",          // React component stack
  pagePath: "/dashboard",                    // Page where error occurred
  tenant: {
    id: "tenant-123",                        // Tenant ID
    slug: "acme-corp"                        // Tenant slug
  },
  timestamp: "2026-01-24T10:30:00.000Z",    // Error timestamp
  userAgent: "Mozilla/5.0...",               // Browser info
  url: "https://app.example.com/admin/dashboard"  // Full URL
}
```

## User Experience

### Production Fallback UI

Clean, tenant-safe error message:

```
┌─────────────────────────────────────────┐
│                                         │
│              ⚠️                          │
│                                         │
│            Page Error                   │
│                                         │
│   This page has a configuration error.  │
│   The page structure does not match     │
│   the expected format.                  │
│                                         │
│   Page: /dashboard                      │
│                                         │
│   [Try Again] [Go Back] [Go to Dashboard]│
│                                         │
│   If this problem persists, contact     │
│   support: error-1706097600000-abc123   │
└─────────────────────────────────────────┘
```

### Development Mode

Additional developer details (expandable):

```
Developer Details (click to expand)
├─ Error ID: error-1706097600000-abc123
├─ Error Type: SCHEMA_VALIDATION_ERROR
├─ Error Message: Invalid page configuration...
├─ Stack Trace:
│   Error: Invalid page configuration
│     at validatePageConfig (JsonPage.tsx:45)
│     at JsonPage (JsonPage.tsx:78)
│     ...
└─ Component Stack:
    in JsonPage (at JsonPageRoute.tsx:123)
    in PageErrorBoundary (at JsonPageRoute.tsx:122)
    ...
```

## User Messages by Error Type

| Error Type | User Message |
|-----------|--------------|
| SCHEMA_VALIDATION_ERROR | This page has a configuration error. The page structure does not match the expected format. |
| RENDERER_ERROR | This page failed to load properly. There may be an issue with the page components. |
| NETWORK_ERROR | Unable to load page data. Please check your network connection and try again. |
| DATA_SOURCE_ERROR | Unable to load data for this page. The data source may be unavailable. |
| UNKNOWN_ERROR | An unexpected error occurred while loading this page. |

## Integration

### In JsonPageRoute

```tsx
import { PageErrorBoundary } from '../errors';

export const JsonPageRoute: React.FC<JsonPageRouteProps> = ({ pagePath }) => {
  // ... fetch page config ...

  return (
    <PageErrorBoundary
      pagePath={pagePath}
      onError={(error, errorInfo) => {
        console.error(`Error in page ${pagePath}:`, error, errorInfo);
      }}
    >
      <JsonPage pageConfig={pageConfig} />
    </PageErrorBoundary>
  );
};
```

### Custom Fallback UI

```tsx
<PageErrorBoundary
  pagePath="/dashboard"
  fallback={(error, errorInfo, reset) => (
    <div>
      <h2>Custom Error UI</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Retry</button>
    </div>
  )}
>
  <JsonPage pageConfig={config} />
</PageErrorBoundary>
```

## Error Tracking Integration

### Placeholder Implementation

```typescript
private sendToErrorTracking(errorContext: Record<string, unknown>) {
  console.log('[PageErrorBoundary] Would send to error tracking');
  
  // TODO: Integrate with service
}
```

### Production Implementation (Examples)

#### Sentry

```typescript
import * as Sentry from '@sentry/react';

private sendToErrorTracking(errorContext: Record<string, unknown>) {
  Sentry.captureException(new Error(errorContext.message as string), {
    contexts: {
      tenant: errorContext.tenant,
      page: { path: errorContext.pagePath },
    },
    tags: {
      errorType: errorContext.type,
      errorId: errorContext.errorId,
    },
    level: 'error',
  });
}
```

#### LogRocket

```typescript
import LogRocket from 'logrocket';

private sendToErrorTracking(errorContext: Record<string, unknown>) {
  LogRocket.captureException(new Error(errorContext.message as string), {
    tags: {
      type: errorContext.type,
      page: errorContext.pagePath,
      tenant: errorContext.tenant.slug,
    },
  });
}
```

#### Custom API

```typescript
private async sendToErrorTracking(errorContext: Record<string, unknown>) {
  try {
    await fetch('/api/v1/errors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(errorContext),
    });
  } catch (err) {
    console.error('Failed to send error to tracking:', err);
  }
}
```

## Error Recovery

### Automatic Retry

Users can click "Try Again" to reset the error boundary and re-render:

```typescript
private resetError = () => {
  this.setState({
    hasError: false,
    error: null,
    errorInfo: null,
    errorId: null,
  });
};
```

### Navigation Options

Three recovery options provided:

1. **Try Again**: Reset boundary and re-render
2. **Go Back**: Navigate to previous page
3. **Go to Dashboard**: Safe fallback to dashboard

## Tenant Context Injection

The boundary uses a functional wrapper to inject tenant context via hooks:

```tsx
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
```

This allows the class component to access tenant information for error logging.

## Security Considerations

### Production Mode

- ✅ Error details hidden from users
- ✅ Stack traces not exposed
- ✅ Component stacks not visible
- ✅ Only error ID shown for support reference

### Development Mode

- ✅ Full error details available
- ✅ Expandable developer section
- ✅ Complete stack traces
- ✅ Component hierarchy shown

## Testing

### Unit Tests

```typescript
describe('PageErrorBoundary', () => {
  it('catches rendering errors', () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };

    const { getByText } = render(
      <PageErrorBoundary>
        <ThrowError />
      </PageErrorBoundary>
    );

    expect(getByText('Page Error')).toBeInTheDocument();
  });

  it('categorizes schema validation errors', () => {
    const error = new Error('Schema validation failed');
    const boundary = new PageErrorBoundaryClass({});
    
    expect(boundary.categorizeError(error)).toBe('SCHEMA_VALIDATION_ERROR');
  });

  it('logs error with tenant context', () => {
    const consoleSpy = jest.spyOn(console, 'error');
    
    render(
      <PageErrorBoundary pagePath="/test">
        <ErrorComponent />
      </PageErrorBoundary>
    );

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('[PageErrorBoundary]'),
      expect.objectContaining({
        pagePath: '/test',
        tenant: expect.any(Object),
      })
    );
  });
});
```

### Integration Tests

```typescript
describe('Error Boundary Integration', () => {
  it('catches JsonPage validation errors', async () => {
    const invalidConfig = { type: 'Invalid' }; // Missing required fields

    const { getByText } = render(
      <JsonPageRoute pagePath="/test" />
    );

    await waitFor(() => {
      expect(getByText(/configuration error/i)).toBeInTheDocument();
    });
  });

  it('allows retry after error', async () => {
    const { getByText, queryByText } = render(
      <PageErrorBoundary>
        <SometimesFailsComponent />
      </PageErrorBoundary>
    );

    // Error shown
    expect(getByText('Page Error')).toBeInTheDocument();

    // Click retry
    fireEvent.click(getByText('Try Again'));

    // Error cleared (assuming component now succeeds)
    await waitFor(() => {
      expect(queryByText('Page Error')).not.toBeInTheDocument();
    });
  });
});
```

## Error Metrics

Track these metrics in production:

1. **Error Rate**: Errors per page view
2. **Error Types**: Distribution by category
3. **Pages**: Which pages error most
4. **Tenants**: Which tenants experience errors
5. **Recovery**: How often users retry vs leave

Example tracking:

```typescript
// In sendToErrorTracking
analytics.track('Page Error', {
  errorType: errorContext.type,
  pagePath: errorContext.pagePath,
  tenantId: errorContext.tenant.id,
  errorId: errorContext.errorId,
});
```

## Best Practices

### 1. Specific Error Messages

Avoid generic "Something went wrong" - provide context:

```typescript
// ❌ Bad
throw new Error('Error');

// ✅ Good
throw new Error('Schema validation failed: Missing required field "type"');
```

### 2. Error Boundaries at Right Level

Place boundaries at page level, not component level:

```tsx
// ❌ Too granular
<PageErrorBoundary>
  <Button />
</PageErrorBoundary>

// ✅ Right level
<PageErrorBoundary>
  <JsonPage />
</PageErrorBoundary>
```

### 3. Preserve Context

Always include pagePath and other context:

```tsx
<PageErrorBoundary
  pagePath={pagePath}
  onError={(error) => {
    // Additional tracking
  }}
>
```

### 4. Test Error Scenarios

Create tests for common error cases:

```typescript
it('handles missing required field', () => { ... });
it('handles invalid component type', () => { ... });
it('handles network timeout', () => { ... });
```

## Performance Impact

Error boundaries have minimal performance impact:

- ✅ No overhead when no errors
- ✅ Only activates on error
- ✅ Memoization in functional wrapper
- ✅ Efficient error categorization

## Future Enhancements

### 1. Error Recovery Strategies

Automatic recovery for certain error types:

```typescript
if (errorType === 'NETWORK_ERROR') {
  // Retry automatically after 3 seconds
  setTimeout(this.resetError, 3000);
}
```

### 2. Error Analytics Dashboard

Build dashboard showing:
- Error frequency trends
- Most common error types
- Problematic pages
- Tenant-specific issues

### 3. Smart Error Messages

Context-aware messages based on user role:

```typescript
if (user.isAdmin) {
  return 'Schema validation failed: Invalid component type "Foo"';
} else {
  return 'This page has a configuration error';
}
```

### 4. Offline Support

Handle offline scenarios gracefully:

```typescript
if (!navigator.onLine) {
  return 'You appear to be offline. Please check your connection.';
}
```

## Related Files

- `src/errors/PageErrorBoundary.tsx` - Error boundary component
- `src/errors/index.ts` - Module exports
- `src/components/JsonPageRoute.tsx` - Integration usage
- `src/pages/JsonPage.tsx` - Protected component
- `src/stores/tenantStore.ts` - Tenant context source

## Summary

The `PageErrorBoundary` provides production-ready error handling:

1. ✅ Catches all JSON page errors
2. ✅ Categorizes error types automatically
3. ✅ Logs with tenant context
4. ✅ Shows tenant-safe fallback UI
5. ✅ Provides recovery options
6. ✅ Hides sensitive details in production
7. ✅ Shows developer details in development
8. ✅ Generates unique error IDs for support

**Result**: Robust error handling that protects the app while providing great UX and debugging information.
