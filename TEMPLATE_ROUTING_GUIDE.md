# Template & Dynamic Routing Integration Guide

## Overview

This document explains how **templates** from the UI library integrate with the **dynamic routing system** in the presentation layer to create fully customizable, tenant-specific pages.

> **✅ STATUS**: The ui-config API endpoint is **fully implemented and tested**. See `api/UI_CONFIG_IMPLEMENTATION_COMPLETE.md` for details.

## Architecture Flow

```
User visits URL → Dynamic Route Match → Fetch Page JSON → Render Template → Display Page
```

### Detailed Flow

1. **User visits a route** (e.g., `/`, `/login`, `/about`)
2. **React Router** matches the URL to a route configuration
3. **DynamicRoutes** component finds the matching `RouteConfig`
4. **JsonPageRoute** component extracts the `pagePath` from the route config
5. **App already has config** loaded via `useAppBootstrap()` on startup:
   ```
   GET /api/v1/tenants/{slug}/config/  ← Single call returns everything!
   ```
   ✅ **This includes routes, ui_config.pages, branding, theme, etc.**
6. **JsonPageRoute** looks up the page from `config.ui_config.pages[pagePath]`
7. **PageRenderer** receives the page JSON and renders it using:
   - Template structure (landing-page, sign-in, marketing-page, etc.)
   - Configured sections and components
   - Tenant-specific data and styling
8. **Browser** displays the fully rendered page

**Key benefit:** Only ONE API call on app load, then all routes/pages work from cached config! 🚀

---

## Key Components

### 1. Tenant Configuration (`TenantConfig`)

Stored in database, loaded via API. Contains:

```typescript
interface TenantConfig {
  id: string;
  slug: string;
  name: string;
  branding: { /* logos, colors, etc */ };
  theme: { /* theme preset reference */ };
  routes: RouteConfig[];  // ← Dynamic routes!
  landingPageSections: LandingPageSection[];
  featureFlags: Record<string, boolean>;
}
```

**Location:** Database → API → `src/stores/tenantStore.ts`

### 2. Route Configuration (`RouteConfig`)

Defines URL-to-page mappings:

```typescript
interface RouteConfig {
  path: string;          // React Router path: "/", "/login", "/about"
  pagePath: string;      // Key in UI config: "/home", "/login", "/about"
  title: string;         // Page title
  protected: boolean;    // Requires auth?
  layout: 'main' | 'admin' | 'none';  // Layout wrapper
  exact?: boolean;       // Exact path match
  order?: number;        // Route priority
  meta?: {               // Custom metadata
    template?: string;   // Template hint
    variant?: string;    // Template variant
  };
}
```

**Location:** `src/types/routing.ts`

### 3. Page JSON Configuration (`PageConfig`)

Defines how a page is rendered:

```typescript
interface PageConfig {
  template: string;      // 'landing-page', 'sign-in', 'marketing-page'
  variant?: string;      // Template variant
  slots: {               // Template slots (header, main, footer, etc.)
    [slotName: string]: {
      component: string; // Component name
      props: any;        // Component props
    };
  };
}
```

**Location:** Database → API → `src/hooks/useJsonPages.ts`

### 4. Templates (UI Library)

Pre-built page structures from `@sakhlaqi/ui/core`:

- **Landing Page** (`landing-page`)
- **Marketing Page** (`marketing-page`)
- **Sign-in Template** (`sign-in-template`)
- **Blog Template** (`blog-template`)
- **Dashboard Layouts** (`dashboard-layout`, `tabs-layout`, etc.)

**Location:** `ui/src/core/templates/`

---

## Example: Acme Corporation

### Scenario

Acme wants:
- **Homepage** (`/`) → Landing page with hero, features, pricing
- **Login** (`/login`) → Sign-in form with side image
- **About** (`/about`) → Marketing page with company info

### Step 1: Define Routes (in Tenant Config)

```typescript
routes: [
  {
    path: '/',
    pagePath: '/home',
    title: 'Home',
    protected: false,
    layout: 'none',
    meta: { template: 'landing-page' },
  },
  {
    path: '/login',
    pagePath: '/login',
    title: 'Sign In',
    protected: false,
    layout: 'none',
    meta: { template: 'sign-in', variant: 'side-by-side' },
  },
  {
    path: '/about',
    pagePath: '/about',
    title: 'About Us',
    protected: false,
    layout: 'none',
    meta: { template: 'marketing-page' },
  },
]
```

### Step 2: Define Page JSON (in Tenant UI Config)

#### Homepage (`/home`)

```json
{
  "/home": {
    "template": "landing-page",
    "slots": {
      "header": {
        "component": "Navbar",
        "props": {
          "logo": "/logos/acme.png",
          "links": [
            { "label": "Features", "href": "#features" },
            { "label": "Pricing", "href": "#pricing" }
          ]
        }
      },
      "main": {
        "component": "LandingPage",
        "props": {
          "sections": [
            {
              "id": "hero",
              "type": "hero",
              "props": {
                "title": "Welcome to Acme",
                "subtitle": "Building the future",
                "primaryAction": { "label": "Get Started", "href": "/signup" }
              }
            },
            {
              "id": "features",
              "type": "features",
              "props": {
                "title": "Our Features",
                "features": [
                  { "icon": "rocket", "title": "Fast" },
                  { "icon": "shield", "title": "Secure" }
                ]
              }
            }
          ]
        }
      },
      "footer": {
        "component": "Footer",
        "props": { "copyright": "© 2026 Acme Corp" }
      }
    }
  }
}
```

#### Login Page (`/login`)

```json
{
  "/login": {
    "template": "sign-in",
    "variant": "side-by-side",
    "slots": {
      "main": {
        "component": "SignInForm",
        "props": {
          "title": "Sign in to Acme",
          "providers": ["email", "google"],
          "onSubmit": "auth:login"
        }
      },
      "side": {
        "component": "Card",
        "props": {
          "backgroundImage": "/images/login-bg.jpg",
          "content": {
            "title": "Welcome back!",
            "testimonial": {
              "quote": "Acme transformed our business",
              "author": "John Doe"
            }
          }
        }
      }
    }
  }
}
```

### Step 3: How It Works at Runtime

#### User visits `/`

1. **Router** matches `path: "/"` → finds route config
2. **JsonPageRoute** gets `pagePath: "/home"`
3. **useJsonPages** fetches UI config, extracts `pages["/home"]`
4. **PageRenderer** receives:
   ```json
   { "template": "landing-page", "slots": { ... } }
   ```
5. **Landing Page Template** renders with:
   - Navbar in header slot
   - LandingPage with hero + features in main slot
   - Footer in footer slot

#### User visits `/login`

1. **Router** matches `path: "/login"` → finds route config
2. **JsonPageRoute** gets `pagePath: "/login"`
3. **useJsonPages** fetches UI config, extracts `pages["/login"]`
4. **PageRenderer** receives:
   ```json
   { "template": "sign-in", "variant": "side-by-side", "slots": { ... } }
   ```
5. **Sign-in Template** renders with:
   - SignInForm in main slot
   - Image card in side slot

---

## Code Examples

### Adding a New Page

#### 1. Update Tenant Routes (Database/API)

```typescript
{
  path: '/pricing',
  pagePath: '/pricing',
  title: 'Pricing',
  protected: false,
  layout: 'none',
  meta: { template: 'marketing-page' },
}
```

#### 2. Add Page JSON to UI Config

```json
{
  "/pricing": {
    "template": "marketing-page",
    "slots": {
      "header": { /* Navbar */ },
      "main": {
        "component": "PricingPage",
        "props": {
          "plans": [
            { "name": "Starter", "price": "$29" },
            { "name": "Pro", "price": "$99" }
          ]
        }
      },
      "footer": { /* Footer */ }
    }
  }
}
```

#### 3. It Just Works! ✨

Navigate to `/pricing` and the page renders automatically.

---

## Template Slots

Different templates expose different slots:

### Landing Page Template
- `header` - Navbar/AppBar
- `main` - Main content area
- `footer` - Footer

### Sign-in Template
- `main` - Form area
- `side` - Side content (for side-by-side variant)
- `footer` - Optional footer

### Marketing Page Template
- `header` - Navbar
- `main` - Content sections
- `sidebar` - Optional sidebar
- `footer` - Footer

### Dashboard Layout
- `header` - App bar
- `sidebar` - Navigation sidebar
- `main` - Dashboard content
- `footer` - Optional footer

---

## API Integration

### Backend API Endpoints (Django)

#### Get Tenant by Slug
```
GET /api/v1/tenants/{slug}/
Response: { id, slug, name, isActive, ... }
```

#### Get Tenant Configuration
```
GET /api/v1/tenants/{slug}/config/
Response: {
  id, slug, name, branding, theme, routes, featureFlags, ...
}
```

#### Get Tenant UI Configuration
```
GET /api/v1/tenants/{slug}/ui-config/
Response: {
  pages: {
    "/home": { template, slots },
    "/login": { template, slots },
    ...
  },
  version, updatedAt
}
```

### Frontend Service Layer

```typescript
// src/api/tenant.ts
class TenantService {
  static async getTenantBySlug(slug: string): Promise<Tenant>
  static async getTenantConfigBySlug(slug: string): Promise<TenantConfig>
}

// src/data/fetchTenantUiConfig.ts
async function fetchTenantUiConfig(
  tenantId: string,
  options?: { skipCache?, publicEndpoint? }
): Promise<TenantUiConfig>
```

---

## Customization Patterns

### Pattern 1: Different Templates for Different Routes

```typescript
routes: [
  { path: '/', pagePath: '/home', meta: { template: 'landing-page' } },
  { path: '/login', pagePath: '/login', meta: { template: 'sign-in' } },
  { path: '/blog', pagePath: '/blog', meta: { template: 'blog' } },
  { path: '/dashboard', pagePath: '/dashboard', meta: { template: 'dashboard' } },
]
```

### Pattern 2: Same Template, Different Content

```typescript
routes: [
  { path: '/product-a', pagePath: '/product-a', meta: { template: 'marketing-page' } },
  { path: '/product-b', pagePath: '/product-b', meta: { template: 'marketing-page' } },
]

// UI Config
{
  "/product-a": { template: "marketing-page", slots: { /* Product A content */ } },
  "/product-b": { template: "marketing-page", slots: { /* Product B content */ } },
}
```

### Pattern 3: Template Variants

```typescript
// Centered sign-in
{ path: '/login', meta: { template: 'sign-in', variant: 'centered' } }

// Side-by-side sign-in
{ path: '/signup', meta: { template: 'sign-in', variant: 'side-by-side' } }
```

---

## Best Practices

### 1. Keep Routes Simple
- One route = one page
- Use `pagePath` as the UI config key
- Consistent naming (e.g., `/about` → `pagePath: "/about"`)

### 2. Use Feature Flags
```typescript
{
  path: '/beta-feature',
  featureFlag: 'enableBetaFeature',
  // Only visible when tenant has this flag enabled
}
```

### 3. Leverage Layouts
```typescript
// Public pages
{ layout: 'none' }  // Full-page templates

// Admin pages
{ layout: 'admin' }  // Sidebar + header wrapper

// Authenticated pages
{ layout: 'main', protected: true }
```

### 4. Template Reuse
Don't create custom templates for every page. Compose from existing templates:

```json
{
  "template": "marketing-page",
  "slots": {
    "main": {
      "component": "Stack",
      "props": {
        "children": [
          { "component": "HeroSection", "props": { ... } },
          { "component": "FeaturesSection", "props": { ... } },
          { "component": "CTASection", "props": { ... } }
        ]
      }
    }
  }
}
```

---

## Troubleshooting

### Page Not Rendering

**Check:**
1. Route exists in tenant config
2. `pagePath` matches key in UI config
3. Page JSON is valid
4. Template exists in UI library
5. All required slots are filled

### 404 Not Found

**Causes:**
- Route not in tenant routes array
- Typo in `path` or `pagePath`
- Route order conflicts

**Fix:** Check route order, use `exact: true` for specific paths

### Template Not Loading

**Causes:**
- UI library not built (`npm run build` in `/ui`)
- Template not exported from `@sakhlaqi/ui/core`
- Typo in template name

**Fix:** Rebuild UI library, verify template name

---

## Development Workflow

### 1. Define Route
Update tenant config (or mock in presentation):
```typescript
routes: [
  { path: '/new-page', pagePath: '/new-page', ... }
]
```

### 2. Create Page JSON
Add to tenant UI config:
```json
{
  "/new-page": {
    "template": "marketing-page",
    "slots": { ... }
  }
}
```

### 3. Test Locally
```bash
# Start presentation app
cd presentation
npm run dev

# Visit http://localhost:3001/new-page
```

### 4. Deploy
- Update database with new route config
- Upload page JSON to tenant UI config
- Restart/reload app

---

## Summary

**The Magic:**
1. Tenant config defines **what routes exist**
2. UI config defines **what each route renders**
3. Templates provide **how it looks**
4. Dynamic routing **connects it all**

**No code changes needed!** Just update JSON configuration in the database. 🎉

---

## See Also

- [Example Tenant Config](./tenant-configs/acme-tenant.example.ts)
- [Route Types](../types/routing.ts)
- [Tenant Types](../types/tenant.ts)
- [UI Templates](../../../../ui/src/core/templates/)
