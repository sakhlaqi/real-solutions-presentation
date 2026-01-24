# JSON-Driven Routing Implementation

## Overview

The Presentation app now uses **JSON-driven routing**, where all admin pages are rendered from tenant-specific JSON configurations fetched from the API. This eliminates hardcoded JSX pages and enables dynamic, tenant-customizable UIs.

## Architecture

```
API → Tenant UI Config (JSON) → JsonPageRoute → JsonPage → UI Library
```

### Flow

1. **Route Resolution**: React Router matches URL path (e.g., `/admin/projects`)
2. **Page Key Mapping**: `JsonPageRoute` maps route to page key (e.g., `/projects`)
3. **Config Fetch**: `useJsonPages` hook fetches tenant UI config from API
4. **Validation**: Page config validated against UI library schema
5. **Rendering**: `JsonPage` delegates to UI library's `PageRenderer`

## Components

### JsonPageRoute

Route wrapper that fetches and renders JSON pages.

**Location**: `src/components/JsonPageRoute.tsx`

**Usage**:
```tsx
<Route 
  path="/admin/projects" 
  element={<JsonPageRoute pagePath="/projects" pageTitle="Projects" />} 
/>
```

**Features**:
- Fetches page config via `useJsonPages` hook
- Injects behavior context (navigation, notifications)
- Handles loading states with spinner
- Shows error messages for config failures
- Displays "Page Not Found" for missing pages
- Passes `dataSourceResolver` to UI library

### useJsonPages Hook

Fetches and manages tenant UI configurations.

**Location**: `src/hooks/useJsonPages.ts`

**API**:
```typescript
const { 
  pages,           // Record<string, PageConfig>
  isLoading,       // boolean
  error,           // string | null
  version,         // string
  updatedAt,       // string
  refetch,         // () => Promise<void>
  getPage          // (path: string) => PageConfig | null
} = useJsonPages({ skipCache?: boolean });
```

**Features**:
- Fetches all page configs on mount
- Caches configurations (5-minute TTL)
- Re-fetches when tenant changes
- Provides individual page access via `getPage()`
- Alternative: `useJsonPage(pagePath)` for single page

## Routing Configuration

### App.tsx Routes

All admin routes now use `JsonPageRoute`:

```tsx
<Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
  {/* JSON-driven pages */}
  <Route index element={<JsonPageRoute pagePath="/dashboard" />} />
  <Route path="projects" element={<JsonPageRoute pagePath="/projects" />} />
  <Route path="projects/:id" element={<JsonPageRoute pagePath="/projects/:id" />} />
  <Route path="employees" element={<JsonPageRoute pagePath="/employees" />} />
  <Route path="employees/:id" element={<JsonPageRoute pagePath="/employees/:id" />} />
  <Route path="tasks" element={<JsonPageRoute pagePath="/tasks" />} />
  <Route path="settings" element={<JsonPageRoute pagePath="/settings" />} />
  <Route path="branding" element={<JsonPageRoute pagePath="/branding" />} />
</Route>
```

### Route-to-Page Mapping

| React Router Path | Page Key | Description |
|------------------|----------|-------------|
| `/admin` (index) | `/dashboard` | Dashboard home page |
| `/admin/projects` | `/projects` | Projects list |
| `/admin/projects/:id` | `/projects/:id` | Project details |
| `/admin/employees` | `/employees` | Employees list |
| `/admin/employees/:id` | `/employees/:id` | Employee details |
| `/admin/tasks` | `/tasks` | Tasks list |
| `/admin/settings` | `/settings` | Settings page |
| `/admin/branding` | `/branding` | Branding editor |

## API Integration

### Endpoint

```
GET /tenants/{tenantId}/ui-config/
```

### Response

```json
{
  "pages": {
    "/dashboard": { /* PageConfig */ },
    "/projects": { /* PageConfig */ },
    "/employees": { /* PageConfig */ },
    "/settings": { /* PageConfig */ }
  },
  "version": "1.0.0",
  "updatedAt": "2026-01-24T10:30:00Z"
}
```

### Caching

- **Cache Duration**: 5 minutes (configurable in `fetchTenantUiConfig.ts`)
- **Cache Key**: `uiConfig:${tenantId}`
- **Cache Invalidation**: Automatic after TTL, or manual via `refetch()`

## Behavior Context

`JsonPageRoute` injects behavior context for UI library:

```typescript
setBehaviorContext({
  navigate,                    // React Router navigate function
  showNotification,            // Toast/notification system
  showConfirmation,            // Confirmation dialog
});
```

This allows JSON configs to reference behaviors like:

```json
{
  "type": "Button",
  "props": {
    "label": "View Project",
    "onClick": "openProjectDetails"
  }
}
```

The behavior registry maps `"openProjectDetails"` to:

```typescript
openProjectDetails: (row) => navigate(`/admin/projects/${row.id}`)
```

## Data Sources

`JsonPageRoute` passes `dataSourceResolver` to UI library:

```tsx
<JsonPage
  pageConfig={pageConfig}
  data={{ dataSourceResolver }}
  provider="mui"
/>
```

This allows JSON configs to reference data sources:

```json
{
  "type": "DataGrid",
  "props": {
    "dataSource": "projects"
  }
}
```

## Error Handling

### Missing Page Config

If API returns a config without the requested page:

```
┌─────────────────────────────┐
│     Page Not Found          │
│                             │
│ The page "/projects" is     │
│ not configured for this     │
│ tenant.                     │
│                             │
│ [Go to Dashboard] [Go Back] │
└─────────────────────────────┘
```

### API Failure

If API request fails:

```
┌─────────────────────────────┐
│   Configuration Error       │
│                             │
│ Failed to fetch UI          │
│ configuration: Network      │
│ error                       │
│                             │
│         [Retry]             │
└─────────────────────────────┘
```

### Validation Error

If page config fails schema validation:

```
┌─────────────────────────────┐
│   Invalid Configuration     │
│                             │
│ Page validation failed:     │
│ • Missing required field    │
│   "type"                    │
│ • Invalid value for         │
│   "props.variant"           │
│                             │
│      [View Details]         │
└─────────────────────────────┘
```

## Loading States

While fetching configurations:

```
┌─────────────────────────────┐
│                             │
│          ⟳                  │
│                             │
│ Loading page                │
│ configuration...            │
│                             │
└─────────────────────────────┘
```

## Benefits

### 1. Dynamic UI
- Tenant-specific page configurations
- No app redeployment for UI changes
- A/B testing and feature flags via JSON

### 2. Separation of Concerns
- **Presentation**: Data fetching, routing, behaviors
- **UI Library**: Pure rendering, no business logic
- **API**: Single source of truth for UI config

### 3. Maintainability
- Centralized routing logic
- Consistent error handling
- Reusable `JsonPageRoute` component

### 4. Flexibility
- Add new pages by updating API config
- Customize per tenant without code changes
- Easy to extend with new page types

## Migration Path

### Before (Hardcoded JSX)

```tsx
<Route path="projects" element={
  <div style={{ padding: '2rem' }}>
    <Heading level={1}>Projects</Heading>
    <DataGrid dataSource="projects" />
  </div>
} />
```

### After (JSON-Driven)

```tsx
<Route path="projects" element={
  <JsonPageRoute pagePath="/projects" />
} />
```

API Config:
```json
{
  "pages": {
    "/projects": {
      "type": "DashboardLayout",
      "props": {
        "title": "Projects",
        "children": [{
          "type": "DataGrid",
          "props": { "dataSource": "projects" }
        }]
      }
    }
  }
}
```

## Future Enhancements

1. **Route Parameters**: Support dynamic route params in page configs
   ```json
   { "pagePath": "/projects/:id", "params": { "id": "projectId" } }
   ```

2. **Permissions**: Check user permissions before rendering pages
   ```json
   { "pagePath": "/admin", "requiredPermissions": ["admin.view"] }
   ```

3. **Lazy Loading**: Load page configs on-demand instead of all upfront
   ```typescript
   const { pageConfig } = useJsonPage('/projects', { lazy: true });
   ```

4. **Hot Reload**: WebSocket updates when configs change
   ```typescript
   useJsonPages({ hotReload: true });
   ```

5. **Versioning**: Support multiple config versions for gradual rollout
   ```typescript
   fetchTenantUiConfig(tenantId, { version: '2.0.0' });
   ```

## Testing

### Unit Tests

```typescript
describe('JsonPageRoute', () => {
  it('renders page from config', async () => {
    const { getByText } = render(
      <JsonPageRoute pagePath="/dashboard" />
    );
    await waitFor(() => {
      expect(getByText('Dashboard')).toBeInTheDocument();
    });
  });

  it('shows error for missing page', async () => {
    const { getByText } = render(
      <JsonPageRoute pagePath="/nonexistent" />
    );
    await waitFor(() => {
      expect(getByText('Page Not Found')).toBeInTheDocument();
    });
  });
});
```

### Integration Tests

```typescript
describe('JSON Routing Flow', () => {
  it('fetches config and renders page', async () => {
    // Mock API response
    mockApiClient.get.mockResolvedValue({
      data: {
        pages: {
          '/projects': { type: 'DashboardLayout', props: { title: 'Projects' } }
        }
      }
    });

    // Navigate to route
    render(<App />, { route: '/admin/projects' });

    // Verify page rendered
    await waitFor(() => {
      expect(screen.getByText('Projects')).toBeInTheDocument();
    });
  });
});
```

## Related Files

- `src/components/JsonPageRoute.tsx` - Route component
- `src/hooks/useJsonPages.ts` - Page config hook
- `src/pages/JsonPage.tsx` - Page renderer bridge
- `src/data/fetchTenantUiConfig.ts` - API client
- `src/data/dataSourceResolver.ts` - Data source registry
- `src/behaviors/behaviorRegistry.ts` - Behavior registry
- `src/App.tsx` - Main routing configuration

## Summary

The JSON-driven routing architecture transforms the Presentation app into a thin runtime shell that:

1. ✅ Fetches page configs from API
2. ✅ Maps routes to page keys
3. ✅ Renders via `JsonPage` → `PageRenderer`
4. ✅ Injects behaviors and data sources
5. ✅ Handles errors and missing pages
6. ✅ No hardcoded JSX pages

**Result**: Fully dynamic, tenant-customizable UI with clean separation of concerns.
