# Dynamic Routing System

## Overview

The presentation app now supports **dynamic, tenant-configurable routing**. Routes are no longer hardcoded in `App.tsx` - instead, they are fetched from the tenant API configuration and generated at runtime.

This enables:
- ✅ **Per-tenant customization** - Each tenant can define their own routes
- ✅ **Custom pages** - Add new pages without code changes
- ✅ **Protected routes** - Configure which pages require authentication
- ✅ **Layout control** - Choose layout wrapper per route
- ✅ **Feature flags** - Show/hide routes based on tenant features
- ✅ **True multi-tenancy** - Different route structures for different tenants

## Architecture

### 1. Route Configuration (Backend)

Tenant configuration now includes a `routes` array:

```json
{
  "id": "tenant-123",
  "slug": "acme-corp",
  "name": "Acme Corporation",
  "routes": [
    {
      "path": "/",
      "pagePath": "/",
      "title": "Home",
      "protected": false,
      "layout": "main",
      "order": 0
    },
    {
      "path": "/login",
      "pagePath": "/login",
      "title": "Login",
      "protected": false,
      "layout": "none",
      "order": 1
    },
    {
      "path": "/admin",
      "pagePath": "/dashboard",
      "title": "Dashboard",
      "protected": true,
      "layout": "admin",
      "order": 2
    },
    {
      "path": "/admin/custom-report",
      "pagePath": "/custom-report",
      "title": "Custom Report",
      "protected": true,
      "layout": "admin",
      "featureFlag": "customReports"
    }
  ]
}
```

### 2. Frontend Components

**Key Files:**

| File | Purpose |
|------|---------|
| `src/types/routing.ts` | Route configuration types and utilities |
| `src/hooks/useAppBootstrap.ts` | Fetches routes from tenant config |
| `src/components/DynamicRoutes.tsx` | Generates React Router routes |
| `src/App.tsx` | Uses `DynamicRoutes` component |

### 3. Route Flow

```
1. App loads → useAppBootstrap() runs
2. Fetches tenant config from API
3. Extracts routes[] from config
4. Returns routes to App component
5. DynamicRoutes generates <Route> elements
6. React Router handles navigation
```

## Route Configuration Schema

### RouteConfig Interface

```typescript
interface RouteConfig {
  // React Router path (supports params: /projects/:id)
  path: string;
  
  // Path to JSON page config in tenant UI config
  pagePath: string;
  
  // Page title for document.title
  title: string;
  
  // Requires authentication?
  protected: boolean;
  
  // Layout wrapper: 'main' | 'admin' | 'none'
  layout: RouteLayout;
  
  // Exact match only? (default: false)
  exact?: boolean;
  
  // Route matching priority (lower = higher priority)
  order?: number;
  
  // Custom metadata
  meta?: Record<string, any>;
  
  // Feature flag to check (hides route if false)
  featureFlag?: string;
}
```

### Layout Types

| Layout | Description | Use Case |
|--------|-------------|----------|
| `main` | Public-facing layout | Home, about, public pages |
| `admin` | Admin dashboard layout | Protected admin pages |
| `none` | No layout wrapper | Login, standalone pages |

## Usage Examples

### Example 1: Basic Routes

```json
{
  "routes": [
    {
      "path": "/",
      "pagePath": "/",
      "title": "Home",
      "protected": false,
      "layout": "main"
    },
    {
      "path": "/login",
      "pagePath": "/login",
      "title": "Login",
      "protected": false,
      "layout": "none"
    },
    {
      "path": "/admin",
      "pagePath": "/dashboard",
      "title": "Dashboard",
      "protected": true,
      "layout": "admin"
    }
  ]
}
```

### Example 2: Dynamic Routes with Parameters

```json
{
  "routes": [
    {
      "path": "/admin/projects",
      "pagePath": "/projects",
      "title": "Projects",
      "protected": true,
      "layout": "admin"
    },
    {
      "path": "/admin/projects/:id",
      "pagePath": "/projects/:id",
      "title": "Project Details",
      "protected": true,
      "layout": "admin"
    }
  ]
}
```

### Example 3: Feature Flag Routes

```json
{
  "routes": [
    {
      "path": "/admin/analytics",
      "pagePath": "/analytics",
      "title": "Analytics",
      "protected": true,
      "layout": "admin",
      "featureFlag": "analytics"
    }
  ],
  "featureFlags": {
    "analytics": true
  }
}
```

**Route only renders if `featureFlags.analytics === true`**

### Example 4: Route Priority

```json
{
  "routes": [
    {
      "path": "/admin/projects/new",
      "pagePath": "/projects/new",
      "title": "New Project",
      "protected": true,
      "layout": "admin",
      "order": 1
    },
    {
      "path": "/admin/projects/:id",
      "pagePath": "/projects/:id",
      "title": "Project Details",
      "protected": true,
      "layout": "admin",
      "order": 2
    }
  ]
}
```

**`/new` matches before `/:id` due to lower order value**

## Backend Implementation

### Django API Endpoint

Add routes to your tenant configuration model:

```python
# api/apps/tenants/models.py
from django.db import models

class TenantConfiguration(models.Model):
    tenant = models.OneToOneField('Tenant', on_delete=models.CASCADE)
    routes = models.JSONField(default=list, blank=True)
    
    # ... other fields
```

### Serializer

```python
# api/apps/tenants/serializers.py
class TenantConfigurationSerializer(serializers.ModelSerializer):
    class Meta:
        model = TenantConfiguration
        fields = ['id', 'slug', 'name', 'routes', 'branding', 'theme', ...]
```

### Default Routes

If tenant doesn't define routes, the app uses defaults:

```typescript
const DEFAULT_ROUTES = [
  { path: '/', pagePath: '/', title: 'Home', protected: false, layout: 'main' },
  { path: '/login', pagePath: '/login', title: 'Login', protected: false, layout: 'none' },
  { path: '/admin', pagePath: '/dashboard', title: 'Dashboard', protected: true, layout: 'admin' }
];
```

## Migration from Hardcoded Routes

### Before (Hardcoded)

```tsx
<Routes>
  <Route path="/" element={<MainLayout />}>
    <Route index element={<JsonPageRoute pagePath="/" pageTitle="Home" />} />
  </Route>
  <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
    <Route path="projects" element={<JsonPageRoute pagePath="/projects" pageTitle="Projects" />} />
    <Route path="employees" element={<JsonPageRoute pagePath="/employees" pageTitle="Employees" />} />
  </Route>
</Routes>
```

### After (Dynamic)

```tsx
const { routes } = useAppBootstrap();

<DynamicRoutes 
  routes={routes} 
  defaultRoute="/"
  notFoundRoute="/"
/>
```

## Benefits

### 1. True Multi-Tenancy
- **Tenant A**: Construction company with `/admin/projects`, `/admin/equipment`
- **Tenant B**: HR firm with `/admin/employees`, `/admin/payroll`
- **No code changes** - just different JSON configs

### 2. No-Code Page Creation
1. Create JSON page config in backend
2. Add route to tenant configuration
3. Page appears automatically
4. No deployment needed

### 3. Granular Access Control
```json
{
  "path": "/admin/sensitive-data",
  "protected": true,
  "featureFlag": "accessSensitiveData"
}
```

### 4. Easy Testing
- Test different route configurations
- A/B test new pages
- Feature rollout to specific tenants

## Advanced Features

### Custom Route Metadata

```json
{
  "path": "/admin/reports",
  "pagePath": "/reports",
  "title": "Reports",
  "protected": true,
  "layout": "admin",
  "meta": {
    "icon": "chart-bar",
    "category": "Analytics",
    "requiredPermissions": ["view_reports"]
  }
}
```

### Route Sorting Algorithm

Routes are automatically sorted by:
1. Explicit `order` property (lower = higher priority)
2. Path specificity (more segments = higher priority)
3. Static paths over dynamic params

### Grouped Routes (Performance)

For large route sets, use `DynamicRoutesGrouped`:

```tsx
import { DynamicRoutesGrouped } from './components/DynamicRoutes';

<DynamicRoutesGrouped routes={routes} />
```

Groups routes by layout/protection for better nesting.

## Testing

### Check Routes in Console

```typescript
const { routes } = useAppBootstrap();
console.log('Active routes:', routes);
```

### Verify Feature Flags

```typescript
// Route only appears if flag is true
{
  "path": "/admin/beta-feature",
  "featureFlag": "betaFeature"
}
```

## Troubleshooting

### Routes Not Appearing

1. **Check tenant config response:**
   ```bash
   GET /api/v1/tenants/{slug}/config/
   ```
   
2. **Verify routes array exists:**
   ```json
   { "routes": [...] }
   ```

3. **Check console logs:**
   ```
   [useAppBootstrap] Loading dynamic routes from tenant config: 12
   [DynamicRoutes] Rendering routes: { total: 12, active: 10, sorted: 10 }
   ```

### Feature Flag Routes Not Showing

Ensure feature flag is enabled:
```json
{
  "featureFlags": {
    "customReports": true
  }
}
```

### Route Order Issues

Use explicit `order` property:
```json
{
  "path": "/admin/projects/new",
  "order": 1
},
{
  "path": "/admin/projects/:id",
  "order": 2
}
```

## Next Steps

1. **Add routes to backend API** - Update tenant config endpoint
2. **Configure tenant routes** - Define routes for each tenant
3. **Test dynamic routing** - Verify routes load correctly
4. **Add custom pages** - Create new routes without code changes
5. **Enable feature flags** - Control route visibility

## API Example

### Get Tenant Config with Routes

```http
GET /api/v1/tenants/acme-corp/config/
Authorization: Bearer <token>

Response:
{
  "id": "tenant-123",
  "slug": "acme-corp",
  "name": "Acme Corporation",
  "routes": [
    {
      "path": "/",
      "pagePath": "/",
      "title": "Home",
      "protected": false,
      "layout": "main"
    },
    {
      "path": "/admin/custom-page",
      "pagePath": "/custom-page",
      "title": "Custom Page",
      "protected": true,
      "layout": "admin"
    }
  ],
  "branding": { ... },
  "theme": { ... }
}
```

## Summary

Dynamic routing transforms the presentation app from a static, hardcoded application into a **truly configurable, multi-tenant platform**. Each tenant can now define their own routes, create custom pages, and control access - all through simple JSON configuration, with zero code changes required.
