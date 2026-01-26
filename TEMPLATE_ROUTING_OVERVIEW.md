# Template & Routing System - Complete Overview

## 🎯 What You Asked For

**Question:** _"Explain how the templates work with the dynamic routing we have in place in the presentation. Let's say I visited the login page or the main home page. Adjust the Acme tenant to properly set the routing config to load the landing-page and/or the sign-in-template."_

---

## ✅ What We Delivered

### 1. **Comprehensive Documentation**
   - [TEMPLATE_ROUTING_GUIDE.md](./TEMPLATE_ROUTING_GUIDE.md) - Full integration guide
   - [acme-tenant.example.ts](./src/examples/tenant-configs/acme-tenant.example.ts) - Complete Acme configuration
   - [mock-tenant-config.ts](./src/examples/mock-tenant-config.ts) - Development testing setup

### 2. **Working Examples**
   - ✅ Homepage (`/`) → Landing Page Template
   - ✅ Login (`/login`) → Sign-in Template (side-by-side variant)
   - ✅ Sign up (`/signup`) → Sign-in Template (centered variant)
   - ✅ About (`/about`) → Marketing Page Template

---

## 📋 Quick Summary

### How It Works (5-Second Version)

```
URL → Route Config → Page JSON → Template → Rendered Page
```

### How It Works (Detailed Version)

1. **User visits `/login`**
2. **React Router** matches the URL
3. **DynamicRoutes** finds the route config:
   ```typescript
   { path: '/login', pagePath: '/login', layout: 'none' }
   ```
4. **JsonPageRoute** fetches page JSON from API:
   ```
   GET /api/v1/tenants/acme-corp/ui-config/
   ```
5. **API returns:**
   ```json
   {
     "/login": {
       "template": "sign-in",
       "variant": "side-by-side",
       "slots": { "main": { ... }, "side": { ... } }
     }
   }
   ```
6. **PageRenderer** renders the sign-in template with the configured slots
7. **Browser** displays the login page

---

## 🏗️ Architecture Layers

### Layer 1: Database (Tenant Config)
```typescript
routes: [
  { path: '/', pagePath: '/home', title: 'Home', ... },
  { path: '/login', pagePath: '/login', title: 'Login', ... },
]
```

### Layer 2: API (Page JSON)
```json
{
  "/home": { template: "landing-page", slots: { ... } },
  "/login": { template: "sign-in", slots: { ... } }
}
```

### Layer 3: UI Library (Templates)
```typescript
// @sakhlaqi/ui/core/templates
export { landingPageTemplate } from './landing-page';
export { signInTemplate } from './sign-in-template';
export { marketingPageTemplate } from './marketing-page';
```

### Layer 4: Presentation App (Runtime)
```typescript
// Router matches URL → Fetches JSON → Renders template
<Route path="/" element={<JsonPageRoute pagePath="/home" />} />
```

---

## 🔧 Key Files & Their Roles

### Presentation Layer
| File | Purpose |
|------|---------|
| `src/App.tsx` | Bootstrap app, load tenant config |
| `src/hooks/useAppBootstrap.ts` | Initialize tenant, load routes |
| `src/stores/tenantStore.ts` | Manage tenant state |
| `src/components/DynamicRoutes.tsx` | Generate routes from config |
| `src/components/JsonPageRoute.tsx` | Fetch & render page JSON |
| `src/hooks/useJsonPages.ts` | Load page JSON from API |
| `src/pages/JsonPage.tsx` | Render page with PageRenderer |

### UI Library
| File | Purpose |
|------|---------|
| `ui/src/core/templates/landing-page/` | Landing page template |
| `ui/src/core/templates/sign-in-template/` | Sign-in template |
| `ui/src/core/templates/marketing-page/` | Marketing page template |
| `ui/src/core/rendering/PageRenderer.tsx` | Render JSON to React components |

### API Layer (Django)
| Endpoint | Purpose |
|----------|---------|
| `GET /api/v1/tenants/{slug}/` | Get tenant basic info |
| `GET /api/v1/tenants/{slug}/config/` | Get tenant config (routes, theme, etc.) |
| `GET /api/v1/tenants/{slug}/ui-config/` | Get page JSON configurations |

---

## 🎨 Template Catalog

### Available Templates

1. **Landing Page** (`landing-page`)
   - Use for: Homepage, product pages
   - Slots: header, main, footer
   - Sections: hero, features, testimonials, pricing, FAQ

2. **Sign-in Template** (`sign-in-template`)
   - Use for: Login, signup, forgot password
   - Variants: centered, side-by-side
   - Slots: main, side (for side-by-side)

3. **Marketing Page** (`marketing-page`)
   - Use for: About, contact, blog posts
   - Slots: header, main, sidebar, footer
   - Flexible content sections

4. **Blog Template** (`blog-template`)
   - Use for: Blog listing, article pages
   - Slots: header, main, sidebar, footer

5. **Dashboard Layouts**
   - `dashboard-layout`: Standard dashboard
   - `tabs-layout`: Tabbed interface
   - `two-column-layout`: Split view

---

## 📝 Acme Corporation Example

### Routing Configuration
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

### Page JSON (Simplified)
```json
{
  "/home": {
    "template": "landing-page",
    "slots": {
      "header": { "component": "Navbar", "props": { ... } },
      "main": { 
        "component": "LandingPage",
        "props": {
          "sections": [
            { "type": "hero", "props": { "title": "Welcome to Acme" } },
            { "type": "features", "props": { ... } },
            { "type": "pricing", "props": { ... } }
          ]
        }
      },
      "footer": { "component": "Footer", "props": { ... } }
    }
  },
  "/login": {
    "template": "sign-in",
    "variant": "side-by-side",
    "slots": {
      "main": { "component": "SignInForm", "props": { ... } },
      "side": { "component": "Card", "props": { ... } }
    }
  }
}
```

---

## 🚀 How to Add a New Page

### Step 1: Add Route to Tenant Config
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

### Step 2: Add Page JSON to UI Config
```json
{
  "/pricing": {
    "template": "marketing-page",
    "slots": {
      "main": {
        "component": "PricingPage",
        "props": { "plans": [...] }
      }
    }
  }
}
```

### Step 3: Done! ✨
Navigate to `/pricing` and see your page.

---

## 🔍 How to Test Locally

### Option 1: Use Mock Data
```typescript
// In src/stores/tenantStore.ts
import { mockTenantConfig } from '../examples/mock-tenant-config';

if (import.meta.env.DEV) {
  set({ config: mockTenantConfig, ... });
  return;
}
```

### Option 2: Point to Local API
```typescript
// In .env.development
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

### Option 3: Use Example Files
See [acme-tenant.example.ts](./src/examples/tenant-configs/acme-tenant.example.ts)

---

## 🛠️ Development Workflow

### 1. Design the Page
Sketch the layout, decide which template to use

### 2. Configure the Route
Add to tenant routes in database (or mock)

### 3. Create Page JSON
Define slots and components

### 4. Test Locally
```bash
cd presentation
npm run dev
# Visit http://localhost:3001/your-page
```

### 5. Deploy
Update database, restart app (or hot-reload)

---

## ⚡ Key Concepts

### Separation of Concerns
- **Routes** define what URLs exist
- **Page JSON** defines what each URL shows
- **Templates** define how it looks
- **Components** are the building blocks

### Zero Code Deployment
Update JSON in database → Pages change instantly

### Multi-Tenancy
Each tenant has its own:
- Routes
- Page configurations
- Theme
- Branding

### Type Safety
Full TypeScript support throughout:
```typescript
interface RouteConfig { ... }
interface PageConfig { ... }
interface TenantConfig { ... }
```

---

## 📚 Further Reading

1. **[TEMPLATE_ROUTING_GUIDE.md](./TEMPLATE_ROUTING_GUIDE.md)** - Complete integration guide
2. **[acme-tenant.example.ts](./src/examples/tenant-configs/acme-tenant.example.ts)** - Full Acme config example
3. **[mock-tenant-config.ts](./src/examples/mock-tenant-config.ts)** - Local development setup
4. **[src/types/routing.ts](./src/types/routing.ts)** - Route type definitions
5. **[src/types/tenant.ts](./src/types/tenant.ts)** - Tenant config types
6. **[ui/src/core/templates/](../ui/src/core/templates/)** - Template source code

---

## ❓ FAQ

### Q: Where is the tenant config stored?
**A:** In the database. Loaded via API: `GET /api/v1/tenants/{slug}/config/`

### Q: Where is the page JSON stored?
**A:** In the database. Loaded via API: `GET /api/v1/tenants/{slug}/ui-config/`

### Q: How do I add a new template?
**A:** Create it in `ui/src/core/templates/`, export from `index.ts`, rebuild UI library

### Q: Can I use the same template for multiple pages?
**A:** Yes! Use different page JSON with the same template

### Q: How do I customize a template for a specific tenant?
**A:** Use the `slots` configuration in page JSON to customize content and styling

### Q: What if I need a completely custom page?
**A:** Create a new template, or compose from existing components using JSON

---

## 🎉 Summary

**You now have:**
✅ Complete understanding of the template routing system  
✅ Working examples for Acme Corporation  
✅ Documentation for future reference  
✅ Mock data for local testing  
✅ Clear path to add new pages  

**No code changes needed** - just update JSON configurations! 🚀
