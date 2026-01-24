# Presentation App Cleanup - Architecture Summary

## Overview

The Presentation app has been refactored to maintain strict separation of concerns, ensuring it only owns:

1. ✅ **Authentication** (login, session management)
2. ✅ **Tenant Resolution** (slug → tenant config)
3. ✅ **Routing** (React Router configuration)
4. ✅ **Data + Behavior Resolution** (dataSourceResolver, behaviorRegistry)

**ALL PAGES ARE JSON-DRIVEN (no exceptions)** - The tenant is resolved from the subdomain BEFORE any page loads, allowing all pages (public and admin) to fetch tenant-specific JSON configurations.

## What Was Removed

### Legacy JSX Page Components

❌ **Removed:**
- `DashboardPage.tsx` - Replaced by JSON-driven `/dashboard` page
- `DashboardPage.css` - No longer needed
- `Dashboard.css` - Unused legacy styles
- `AuthPages.css` - Unused legacy styles
- `LandingPage.tsx` - Replaced by JSON-driven `/` page
- `LoginPage.tsx` - Replaced by JSON-driven `/login` page
- `LoginPage.css` - No longer needed

✅ **Kept (Single Bridge Component):**
- `JsonPage.tsx` - Bridge component that validates JSON and delegates to UI library's PageRenderer

### MUI Imports

✅ **Verified:** Zero MUI imports in Presentation app code
- All UI components imported from `@sakhlaqi/ui`
- MUI only exists within UI library
- Clean separation maintained

## Current Architecture

### Page Rendering Flow

```
Route → JsonPageRoute → PageErrorBoundary → JsonPage → UIProvider → PageRenderer
         (fetches config)   (catches errors)   (validates)  (theme)     (renders)
```

### All Pages (JSON-Driven)

All routes use `JsonPageRoute` - no JSX page components exist:

```tsx
// Public pages rendered from initial /config call
<Route index element={<JsonPageRoute pagePath="/" pageTitle="Home" />} />
<Route path="/login" element={<JsonPageRoute pagePath="/login" pageTitle="Login" />} />

// Admin pages rendered from tenant-specific UI configs
<Route index element={<JsonPageRoute pagePath="/dashboard" />} />
<Route path="projects" element={<JsonPageRoute pagePath="/projects" />} />
```
<Route path="employees" element={<JsonPageRoute pagePath="/employees" />} />
<Route path="tasks" element={<JsonPageRoute pagePath="/tasks" />} />
<Route path="settings" element={<JsonPageRoute pagePath="/settings" />} />
// etc.
```

**No JSX page layouts exist for admin pages.**

### Public Pages (JSX Components)

Two exceptions remain as JSX components (not JSON-driven):

1. **LandingPage** (`/`)
   - Public-facing tenant landing page
   - Uses `DynamicComponentRenderer` for configurable sections
   - Renders from `config.landingPageSections`
   - Pre-authentication, marketing/informational

2. **LoginPage** (`/login`)
   - Authentication form
   - Pre-authentication, must work without tenant admin config
   - Static structure (email/password form)

**Rationale:** These pages are public and don't require the full JSON-driven admin UI architecture. They serve different purposes (marketing, authentication) vs tenant admin UI.

## Presentation App Responsibilities

### ✅ Owns

1. **Authentication**
   - `useAuthStore` - Login, logout, session management
   - `ProtectedRoute` - Route protection
   - `LoginPage` - Authentication UI

2. **Tenant Resolution**
   - `useTenantStore` - Tenant config fetching
   - `TenantResolver` - Slug extraction
   - `UiProviderBridge` - Theme mapping

3. **Routing**
   - `App.tsx` - Route configuration
   - `JsonPageRoute` - Page rendering wrapper
   - React Router setup

4. **Data Resolution**
   - `dataSourceResolver.ts` - Maps dataSource IDs to API calls
   - Manages data caching (2-minute TTL)
   - Handles pagination, sorting, filtering

5. **Behavior Resolution**
   - `behaviorRegistry.ts` - Maps behavior IDs to functions
   - Navigation behaviors (useNavigate)
   - UI side effects (notifications, confirmations)

### ❌ Does NOT Own

1. **UI Rendering**
   - No MUI imports
   - No component implementations
   - Delegates to `@sakhlaqi/ui`

2. **Page Layouts**
   - No JSX page components
   - No hardcoded page structures
   - All pages from JSON (public and admin)

3. **Theme Implementation**
   - No MUI theme creation
   - Maps tenant theme → UI library format
   - UI library handles actual theming

4. **Component Logic**
   - No form logic (DataGrid, etc.)
   - No validation schemas
   - No component state management

## File Structure

### Kept Files

```
src/
├── app/
│   └── UiProviderBridge.tsx        # Tenant theme → UI library bridge
├── behaviors/
│   └── behaviorRegistry.ts         # Behavior ID → function mapping
├── data/
│   ├── dataSourceResolver.ts       # Data source ID → API mapping
│   └── fetchTenantUiConfig.ts      # Fetch page JSON configs
├── errors/
│   └── PageErrorBoundary.tsx       # Page-level error handling
├── hooks/
│   ├── useAppBootstrap.ts          # App initialization
│   └── useJsonPages.ts             # Fetch + manage JSON pages
├── pages/
│   └── JsonPage.tsx                # Bridge: validates + delegates to UI library
├── components/
│   ├── JsonPageRoute.tsx           # Route wrapper for JSON pages
│   ├── ProtectedRoute.tsx          # Auth protection
│   ├── layout/                     # AdminLayout, MainLayout, Header
│   └── DynamicComponentRenderer/   # Landing page section renderer
├── stores/
│   ├── authStore.ts                # Authentication state
│   ├── tenantStore.ts              # Tenant config state
│   └── projectStore.ts             # Project data (example)
└── App.tsx                          # Main app + routing

```

### Removed Files

```
❌ src/pages/DashboardPage.tsx       # Replaced by JSON /dashboard
❌ src/pages/DashboardPage.css       # No longer needed
❌ src/pages/Dashboard.css           # Unused legacy
❌ src/pages/AuthPages.css           # Unused legacy
❌ src/pages/LandingPage.tsx         # Replaced by JSON /
❌ src/pages/LoginPage.tsx           # Replaced by JSON /login
❌ src/pages/LoginPage.css           # No longer needed
```

## Verification Checklist

- [x] No JSX page layouts remain (zero exceptions)
- [x] No MUI imports outside UI library
- [x] All pages use JsonPageRoute
- [x] Presentation only owns auth, routing, data, behaviors
- [x] All pages JSON-driven (public and admin)
- [x] Legacy components removed
- [x] All TypeScript errors resolved

## Benefits of This Architecture

### 1. Clean Separation

```
Presentation App:        UI Library:
├─ Auth                  ├─ Components
├─ Routing               ├─ Theme
├─ Data fetching         ├─ Validation
└─ Behavior mapping      └─ Rendering
```

### 2. Flexibility

- **Swap UI Library**: Change from MUI to another without touching Presentation
- **Update Pages**: Modify page JSON without code changes
- **A/B Testing**: Serve different JSON configs to different users

### 3. Maintainability

- **Single Responsibility**: Each module has one clear purpose
- **Type Safety**: Full TypeScript throughout
- **Testability**: Pure functions for data/behavior resolution

### 4. Scalability

- **Add Pages**: Just add JSON config, no code changes
- **Add Data Sources**: Register in dataSourceResolver
- **Add Behaviors**: Register in behaviorRegistry

## Migration Guide

If you have legacy JSX pages to migrate:

### Before (JSX Page)

```tsx
// pages/ProjectsPage.tsx
export const ProjectsPage = () => {
  const { projects } = useProjectStore();
  
  return (
    <div>
      <h1>Projects</h1>
      <DataGrid data={projects} />
    </div>
  );
};

// App.tsx
<Route path="projects" element={<ProjectsPage />} />
```

### After (JSON-Driven)

```tsx
// App.tsx - Just routing
<Route path="projects" element={<JsonPageRoute pagePath="/projects" />} />
```

```json
// API: GET /tenants/{id}/ui-config/
{
  "pages": {
    "/projects": {
      "type": "DashboardLayout",
      "props": {
        "title": "Projects",
        "children": [{
          "type": "DataGrid",
          "props": {
            "dataSource": "projects"
          }
        }]
      }
    }
  }
}
```

**Data Source:**
```typescript
// dataSourceResolver.ts
const dataSourceRegistry = {
  projects: () => ProjectService.getProjects()
};
```

## All Pages Are JSON-Driven

### Rationale

Since the tenant is resolved from the subdomain BEFORE any page loads, all pages (including public-facing landing and login pages) can fetch tenant-specific JSON configurations from the initial `/config` call.

**Benefits:**
1. **Tenant Customization**: Each tenant can have custom landing pages, login flows, and admin interfaces
2. **Consistent Architecture**: No special cases, all pages follow the same pattern
3. **Flexible Branding**: Landing and login pages can match tenant branding without code changes
4. **A/B Testing**: Easy to test different layouts without deployments
5. **Self-Service**: Marketing teams can modify pages through API/admin panel

**Data Flow:**
```
User visits tenant1.app.com
  ↓
Tenant resolved from subdomain
  ↓
Fetch /config (includes page JSONs for /, /login, etc.)
  ↓
Render all pages from JSON
```

### Public vs Admin Pages

While all pages are JSON-driven, they may come from different sources:

- **Public pages (`/`, `/login`)**: Included in initial `/config` response
- **Admin pages (`/admin/*`)**: Fetched on-demand from `/tenants/{id}/ui-config/{pagePath}`

This allows efficient loading while maintaining flexibility.

## Testing

### Verify No Legacy Code

```bash
# Check for MUI imports
grep -r "@mui/" src/ --exclude-dir=node_modules

# Check for page components
ls src/pages/

# Should only show:
# - JsonPage.tsx (bridge component)
# - index.ts (exports)
```

### Verify JSON Routing Works

```typescript
// Test all admin routes use JsonPageRoute
const adminRoutes = [
  '/admin',
  '/admin/projects',
  '/admin/employees',
  '/admin/tasks',
  '/admin/settings',
];

adminRoutes.forEach(route => {
  // Should render JsonPageRoute with pagePath prop
  expect(routeElement).toMatch(/JsonPageRoute/);
});
```

## Summary

The Presentation app now has a **clean, single-responsibility architecture**:

| Concern | Owner |
|---------|-------|
| UI Components | @sakhlaqi/ui |
| Page Rendering | @sakhlaqi/ui (PageRenderer) |
| Theme Implementation | @sakhlaqi/ui (UIProvider + MUI) |
| Admin Page Structure | JSON configs from API |
| Routing | Presentation (App.tsx) |
| Authentication | Presentation (authStore) |
| Tenant Resolution | Presentation (tenantStore) |
| Data Fetching | Presentation (dataSourceResolver) |
| Interactions | Presentation (behaviorRegistry) |

**Result:** Maintainable, scalable, testable architecture with proper separation of concerns.
