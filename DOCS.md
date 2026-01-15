# Multi-Tenant React Application - Complete Documentation

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Configuration System](#configuration-system)
3. [Component Library](#component-library)
4. [State Management](#state-management)
5. [API Integration](#api-integration)
6. [Routing & Authentication](#routing--authentication)
7. [Theming System](#theming-system)
8. [Development Guide](#development-guide)
9. [Production Deployment](#production-deployment)
10. [Examples](#examples)

## Architecture Overview

### Core Principles

1. **Single codebase, multiple tenants** - All tenants share the same code
2. **Component-driven UI** - Reusable, isolated, configurable components
3. **Configuration over hard-coding** - Data-driven approach
4. **Strict separation** - Presentation layer separate from business logic
5. **API-driven state** - All data from backend API

### Tenant Resolution Flow

```
1. User visits: tenant1.example.com
2. TenantResolver extracts slug: "tenant1"
3. API call: GET /api/tenants/tenant1/config/
4. Configuration loaded into tenantStore
5. ThemeProvider applies tenant theme
6. Landing page renders from configuration
```

## Configuration System

### Tenant Configuration Schema

```typescript
interface TenantConfig {
  id: string;
  slug: string;
  name: string;
  branding: TenantBranding;
  theme: TenantTheme;
  featureFlags: Record<string, boolean>;
  layoutPreferences: TenantLayoutPreferences;
  landingPageSections: LandingPageSection[];
}
```

### Example Configuration

```json
{
  "id": "tenant-123",
  "slug": "acme",
  "name": "Acme Corporation",
  "branding": {
    "name": "Acme",
    "logo": {
      "light": "/logos/acme-light.svg",
      "dark": "/logos/acme-dark.svg"
    },
    "favicon": "/favicon-acme.ico",
    "tagline": "Innovation at its finest"
  },
  "theme": {
    "colors": {
      "primary": "#0066cc",
      "secondary": "#ff6600",
      "accent": "#00cc99",
      "background": "#ffffff",
      "surface": "#f8f9fa",
      "text": {
        "primary": "#212529",
        "secondary": "#6c757d",
        "inverse": "#ffffff"
      },
      "error": "#dc3545",
      "success": "#28a745",
      "warning": "#ffc107"
    },
    "fonts": {
      "primary": "Inter, sans-serif",
      "secondary": "Georgia, serif",
      "sizes": {
        "xs": "0.75rem",
        "sm": "0.875rem",
        "base": "1rem",
        "lg": "1.125rem",
        "xl": "1.25rem",
        "2xl": "1.5rem",
        "3xl": "1.875rem"
      }
    },
    "spacing": {
      "xs": "0.25rem",
      "sm": "0.5rem",
      "md": "1rem",
      "lg": "1.5rem",
      "xl": "2rem",
      "2xl": "3rem"
    },
    "borderRadius": {
      "sm": "0.25rem",
      "md": "0.5rem",
      "lg": "1rem",
      "full": "9999px"
    },
    "shadows": {
      "sm": "0 1px 2px rgba(0,0,0,0.05)",
      "md": "0 4px 6px rgba(0,0,0,0.1)",
      "lg": "0 10px 15px rgba(0,0,0,0.1)"
    }
  },
  "featureFlags": {
    "enableNewDashboard": true,
    "showBetaFeatures": false
  },
  "layoutPreferences": {
    "headerStyle": "default",
    "footerStyle": "default"
  },
  "landingPageSections": [
    {
      "id": "hero-1",
      "componentType": "hero",
      "order": 1,
      "visible": true,
      "props": {
        "title": "Welcome to Acme Corporation",
        "subtitle": "Your trusted partner in innovation and excellence",
        "ctaText": "Get Started Today",
        "ctaLink": "/register",
        "align": "center"
      }
    },
    {
      "id": "features-1",
      "componentType": "featureGrid",
      "order": 2,
      "visible": true,
      "props": {
        "title": "Why Choose Acme",
        "subtitle": "We deliver excellence in everything we do",
        "columns": 3,
        "features": [
          {
            "id": "f1",
            "icon": "🚀",
            "title": "Fast Performance",
            "description": "Lightning-fast load times and optimal user experience"
          },
          {
            "id": "f2",
            "icon": "🔒",
            "title": "Secure & Reliable",
            "description": "Enterprise-grade security and 99.9% uptime"
          },
          {
            "id": "f3",
            "icon": "💡",
            "title": "Innovative Solutions",
            "description": "Cutting-edge technology to solve your challenges"
          }
        ]
      }
    },
    {
      "id": "cta-1",
      "componentType": "ctaSection",
      "order": 3,
      "visible": true,
      "props": {
        "title": "Ready to Get Started?",
        "description": "Join thousands of satisfied customers today",
        "buttonText": "Start Free Trial",
        "buttonLink": "/register"
      }
    }
  ]
}
```

## Component Library

### Base Components

#### Button
```typescript
<Button variant="primary" size="md" loading={false}>
  Click Me
</Button>

// Variants: primary, secondary, outline, ghost
// Sizes: sm, md, lg
```

#### Card
```typescript
<Card padding="md" shadow="md" hover={true}>
  <h3>Card Title</h3>
  <p>Card content</p>
</Card>
```

#### Input
```typescript
<Input
  label="Email"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={errorMessage}
  helperText="We'll never share your email"
  fullWidth
/>
```

#### Text
```typescript
<Text variant="body" color="secondary" weight="medium">
  Text content
</Text>
```

### Composite Components

#### Hero Section
```typescript
<Hero
  title="Welcome"
  subtitle="Your tagline here"
  ctaText="Get Started"
  ctaLink="/register"
  align="center"
  backgroundImage="/hero-bg.jpg"
/>
```

#### Feature Grid
```typescript
<FeatureGrid
  title="Features"
  subtitle="What we offer"
  columns={3}
  features={[
    { id: '1', icon: '🎯', title: 'Feature 1', description: 'Description' }
  ]}
/>
```

#### CTA Section
```typescript
<CTASection
  title="Get Started Today"
  description="Join us now"
  buttonText="Sign Up"
  buttonLink="/register"
/>
```

### Adding Custom Components

1. Create component in `src/components/composite/`:

```typescript
// YourComponent.tsx
import React from 'react';

export interface YourComponentProps {
  title: string;
  items: Array<{ id: string; name: string }>;
}

export const YourComponent: React.FC<YourComponentProps> = ({ title, items }) => {
  return (
    <section>
      <h2>{title}</h2>
      {items.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </section>
  );
};
```

2. Register in `componentRegistry.ts`:

```typescript
import { YourComponent } from '../composite/YourComponent';

export const componentRegistry = {
  hero: Hero,
  featureGrid: FeatureGrid,
  yourComponent: YourComponent, // Add here
};
```

3. Use in tenant configuration:

```json
{
  "id": "your-section",
  "componentType": "yourComponent",
  "order": 4,
  "visible": true,
  "props": {
    "title": "My Section",
    "items": [{ "id": "1", "name": "Item 1" }]
  }
}
```

## State Management

### Stores

#### Auth Store
```typescript
const { user, isAuthenticated, login, logout } = useAuthStore();

// Login
await login({ email, password });

// Logout
await logout();

// Access user data
console.log(user?.email);
```

#### Tenant Store
```typescript
const { config, tenant, initializeTenant } = useTenantStore();

// Initialize
await initializeTenant();

// Access config
console.log(config?.branding.name);
console.log(config?.theme.colors.primary);
```

#### Project Store
```typescript
const { projects, activeProject, setActiveProject } = useProjectStore();

// Load projects
await loadProjects();

// Select project
setActiveProject(projects[0]);
```

## API Integration

### API Client Usage

```typescript
import { apiClient } from './api';

// GET
const data = await apiClient.get('/endpoint');

// POST
const result = await apiClient.post('/endpoint', { data });

// PUT
const updated = await apiClient.put('/endpoint/id', { data });

// DELETE
await apiClient.delete('/endpoint/id');
```

### Service Layer

```typescript
import { AuthService, TenantService, ProjectService } from './api';

// Auth
const { tokens, user } = await AuthService.login({ email, password });
await AuthService.logout();

// Tenant
const tenant = await TenantService.getTenantBySlug('acme');
const config = await TenantService.getTenantConfig(tenantId);

// Projects
const projects = await ProjectService.getProjects();
const project = await ProjectService.getProject(projectId);
```

## Theming System

### Using CSS Variables

```css
.my-component {
  /* Colors */
  color: var(--color-text-primary);
  background-color: var(--color-primary);
  
  /* Typography */
  font-family: var(--font-primary);
  font-size: var(--font-size-base);
  
  /* Spacing */
  padding: var(--spacing-md);
  margin: var(--spacing-lg);
  
  /* Border */
  border-radius: var(--radius-md);
  
  /* Shadow */
  box-shadow: var(--shadow-md);
}
```

### Available Variables

- **Colors**: `--color-primary`, `--color-secondary`, `--color-accent`, `--color-background`, `--color-surface`, `--color-text-primary`, `--color-text-secondary`, `--color-text-inverse`, `--color-error`, `--color-success`, `--color-warning`
- **Fonts**: `--font-primary`, `--font-secondary`, `--font-size-xs/sm/base/lg/xl/2xl/3xl`
- **Spacing**: `--spacing-xs/sm/md/lg/xl/2xl`
- **Border Radius**: `--radius-sm/md/lg/full`
- **Shadows**: `--shadow-sm/md/lg`

## Development Guide

### Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Test with different tenants
http://localhost:3000?tenant=tenant1
http://localhost:3000?tenant=tenant2
```

### Environment Setup

Create `.env` file:

```env
VITE_API_BASE_URL=http://localhost:8000
```

### Directory Structure Best Practices

- Keep components in appropriate folders (base/composite/layout)
- Use TypeScript interfaces for all props
- Export types alongside components
- Create CSS modules or separate CSS files
- Document complex components

## Production Deployment

### Build for Production

```bash
npm run build
```

### Environment Variables

```env
VITE_API_BASE_URL=https://api.yourdomain.com
```

### Web Server Configuration

#### Nginx

```nginx
server {
  server_name *.example.com;
  root /var/www/app;
  
  location / {
    try_files $uri $uri/ /index.html;
  }
  
  location /api {
    proxy_pass http://backend:8000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }
}
```

#### Apache

```apache
<VirtualHost *:80>
  ServerAlias *.example.com
  DocumentRoot /var/www/app
  
  <Directory /var/www/app>
    RewriteEngine On
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
  </Directory>
</VirtualHost>
```

## Best Practices

1. **Never hardcode tenant-specific values**
2. **Use TypeScript strictly - avoid `any`**
3. **Keep components stateless where possible**
4. **Validate configurations before rendering**
5. **Implement proper error boundaries**
6. **Use loading states for async operations**
7. **Memoize expensive components with React.memo**
8. **Lazy load routes and heavy components**

## Troubleshooting

### Issue: Tenant not loading

**Solution:**
- Verify subdomain or query parameter
- Check API endpoint returns tenant data
- Check network tab for errors
- Verify CORS settings on backend

### Issue: Theme not applying

**Solution:**
- Verify tenant config includes theme
- Check CSS variables in browser DevTools
- Ensure ThemeProvider wraps application
- Clear browser cache

### Issue: Authentication failing

**Solution:**
- Verify API base URL in environment
- Check backend CORS configuration
- Verify token format and expiry
- Check localStorage for tokens

## Support

For questions and support: support@realsolutions.com
