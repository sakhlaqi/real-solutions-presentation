# Boring Presentation - Architecture Principles

## Overview

The Presentation app is now intentionally **boring** - it contains no visual decisions, no layout logic, no styling rules. It's a pure runtime shell that connects data to the UI library.

## Final Responsibilities (ONLY)

### 1. Authentication
- Login/logout flows
- Session management
- Protected route logic

### 2. Tenant Resolution  
- Subdomain → tenant mapping
- Tenant config loading

### 3. Routing
- React Router setup
- Route definitions
- Navigation behavior

### 4. Data Fetching
- API calls
- Data source resolution
- Caching strategies

### 5. Behavior Resolution
- Behavior ID → function mapping
- Side effects (notifications, navigation)

## What Was Removed

### ❌ Composite Components (Pushed to UI Library)
- `Hero` - Marketing section with CTAs
- `FeatureGrid` - Grid layout with cards
- `CTASection` - Call-to-action banner
- `ContentSection` - Content with alignment

**Why removed:** These contain layout decisions (CSS grid), responsive rules (@media queries), and visual styling. These are UI library responsibilities.

### ❌ DynamicComponentRenderer
- `componentRegistry.ts` - Component whitelist
- `DynamicComponentRenderer.tsx` - Dynamic rendering
- `componentPropSchemas` - Validation schemas

**Why removed:** This was only needed for the LandingPage JSX component that no longer exists. All pages are now JSON-driven through the UI library's PageRenderer.

### ❌ Layout CSS Files
- `AdminLayout.css` - Visual styling for admin header/sidebar
- `Header.css` - Visual styling for public header
- `Footer.css` - Visual styling for footer

**Why removed:** Layout components now pass **data only** (config objects) to UI library components. The UI library owns all visual rendering.

### ❌ Direct Component Imports
- No more `<Box />`, `<Grid />`, `<Stack />` imports
- No more `<Button />`, `<Text />` for layout purposes
- Layout components pass config objects instead of JSX

## Architectural Pattern: Data → UI Library

### Before (BAD - Visual Responsibilities)

```tsx
// Presentation owned visual rendering
export const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="container header-content">
        <Link to="/" className="header-logo">
          <span className="header-logo-text">{brandName}</span>
        </Link>
        <nav className="header-nav">
          <Link to="/admin" className="header-link">
            Admin Dashboard
          </Link>
          <Button variant="text" onClick={handleLogout}>
            Logout
          </Button>
        </nav>
      </div>
    </header>
  );
};

/* CSS: Presentation owned layout decisions */
.header {
  display: flex;
  align-items: center;
  padding: var(--spacing-lg);
}

@media (max-width: 768px) {
  .header-nav {
    display: none; /* Responsive logic */
  }
}
```

### After (GOOD - Data Only)

```tsx
// Presentation provides data only
export const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const { config } = useTenantStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  // Configuration object - NO visual decisions
  const headerConfig = {
    brand: {
      name: config?.branding.name || 'Real Solutions',
      logo: config?.branding.logo?.light,
      link: '/',
    },
    navigation: isAuthenticated ? [
      { label: 'Admin Dashboard', path: '/admin' },
    ] : [],
    userMenu: isAuthenticated ? {
      email: user?.email || '',
      onLogout: handleLogout,
    } : {
      loginLink: '/login',
      loginLabel: 'Admin Login',
    },
  };

  // Delegate ALL rendering to UI library
  return <UIHeader config={headerConfig} onNavigate={handleNavigation} />;
};
```

## Smell Detection

### 🚨 RED FLAGS (Should NOT exist in Presentation)

```tsx
// ❌ Direct layout component imports
import { Box, Grid, Stack, Container } from '@mui/material';

// ❌ Visual JSX with className styling
<div className="header-content">
  <nav className="header-nav">
    ...
  </nav>
</div>

// ❌ CSS with layout rules
.feature-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

// ❌ Responsive media queries
@media (max-width: 768px) {
  .sidebar {
    display: none;
  }
}

// ❌ Component-specific styling
.admin-header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
```

### ✅ GREEN FLAGS (What SHOULD exist)

```tsx
// ✅ Data/config objects
const headerConfig = {
  brand: { name: 'App', logo: '/logo.png' },
  navigation: [{ label: 'Home', path: '/' }],
};

// ✅ Behavior handlers
const handleLogout = async () => {
  await logout();
  navigate('/');
};

// ✅ Store/hook usage
const { user, isAuthenticated } = useAuthStore();
const { config } = useTenantStore();

// ✅ Delegating to UI library
return <UIHeader config={headerConfig} onNavigate={handleNavigation} />;

// ✅ Minimal utility imports
import { Spinner, ErrorBoundary } from '@sakhlaqi/ui'; // For app shell only
```

## Current File Structure

```
presentation/src/
├── app/
│   └── UiProviderBridge.tsx        ✅ Theme config mapping
├── behaviors/
│   └── behaviorRegistry.ts         ✅ Behavior ID → function
├── components/
│   ├── layout/
│   │   ├── AdminLayout.tsx         ✅ Navigation config only
│   │   ├── Header.tsx              ✅ Data provider only
│   │   ├── Footer.tsx              ✅ Data provider only
│   │   └── MainLayout.tsx          ✅ Composition only
│   ├── JsonPageRoute.tsx           ✅ Page config fetcher
│   └── ProtectedRoute.tsx          ✅ Auth guard
├── data/
│   ├── dataSourceResolver.ts       ✅ Data source mapping
│   └── fetchTenantUiConfig.ts      ✅ API fetching
├── errors/
│   └── PageErrorBoundary.tsx       ✅ Error handling
├── hooks/
│   ├── useAppBootstrap.ts          ✅ Initialization
│   └── useJsonPages.ts             ✅ Page config management
├── pages/
│   └── JsonPage.tsx                ✅ JSON → PageRenderer bridge
├── stores/
│   ├── authStore.ts                ✅ Auth state
│   ├── tenantStore.ts              ✅ Tenant state
│   └── projectStore.ts             ✅ Domain state
└── App.tsx                          ✅ Routing setup
```

## Responsibilities Matrix

| Concern | Presentation | UI Library |
|---------|--------------|------------|
| **Authentication** | ✅ State, logic | ❌ |
| **Routing** | ✅ React Router | ❌ |
| **Data fetching** | ✅ API calls | ❌ |
| **Behavior resolution** | ✅ ID → function | ❌ |
| **Tenant resolution** | ✅ Subdomain → config | ❌ |
| **Layout decisions** | ❌ | ✅ Grid, flex, spacing |
| **Responsive rules** | ❌ | ✅ Breakpoints, media queries |
| **Visual styling** | ❌ | ✅ Colors, fonts, shadows |
| **Component rendering** | ❌ | ✅ Buttons, inputs, cards |
| **Theme implementation** | ❌ | ✅ MUI theme config |
| **Page rendering** | ❌ | ✅ PageRenderer |
| **Form logic** | ❌ | ✅ DataGrid, inputs |

## Benefits

### 1. True Separation of Concerns
- Presentation = runtime behavior
- UI Library = visual rendering
- No overlap, no confusion

### 2. Easier Maintenance
- Visual changes → update UI library only
- Business logic → update Presentation only
- Clear boundaries

### 3. Better Testing
- Presentation tests: auth, routing, data fetching
- UI library tests: rendering, interactions, accessibility
- No mixed concerns

### 4. Team Scalability
- Frontend designers work in UI library
- Backend/integration devs work in Presentation
- Minimal coordination needed

### 5. Tenant Customization
- Tenants customize via JSON configs
- No code changes required
- Safe, sandboxed changes

## Migration Guide

If you find yourself adding visual code to Presentation:

### Step 1: Identify the Smell
- Are you importing layout components? (`Box`, `Grid`, etc.)
- Writing CSS with layout rules?
- Using `className` for visual styling?
- Adding responsive logic?

### Step 2: Extract to Config
```tsx
// Instead of JSX:
<div className="hero">
  <h1 className="hero-title">{title}</h1>
  <p className="hero-subtitle">{subtitle}</p>
  <Button>{ctaText}</Button>
</div>

// Create config object:
const heroConfig = {
  title,
  subtitle,
  cta: { text: ctaText, onClick: handleClick },
};
```

### Step 3: Delegate to UI Library
```tsx
// Pass config to UI component
return <Hero config={heroConfig} />;
```

### Step 4: Move CSS to UI Library
- Remove CSS file from Presentation
- Implement styling in UI library component
- Use MUI theme tokens for consistency

## Conclusion

The Presentation app should be **boring to read**:
- Config objects
- Function calls
- State management
- No visual decisions

If it's exciting or pretty, it's wrong. Push visual code to the UI library.

**Goal:** Any developer should be able to understand Presentation's behavior without needing design knowledge.
