# Dual-Mode Multi-Tenant Application

## Overview

This React application supports both **public-facing pages** (no authentication required) and a **secure Admin Dashboard** (authentication required) in a multi-tenant architecture.

## Key Features

### Public Features
- ✅ **No Authentication Required**: Public pages load without login
- ✅ **Tenant Resolution**: Automatically detects tenant from subdomain or query parameter
- ✅ **Dynamic Theming**: Each tenant has customizable branding and colors
- ✅ **Component-Based Landing Pages**: Build pages from reusable section components
- ✅ **SEO-Friendly**: Public pages designed for search engine optimization

### Admin Features
- ✅ **Secure Authentication**: JWT-based authentication with token refresh
- ✅ **Admin Dashboard**: Overview of projects and tenant information
- ✅ **Project Management**: Create, update, and manage projects
- ✅ **Tenant Configuration**: Edit branding, theme, and landing page sections
- ✅ **Protected Routes**: All admin pages require authentication
- ✅ **Separate Layout**: Admin has distinct navigation and sidebar

## Architecture

### Dual-Mode API Client

The API client intelligently handles both public and authenticated requests:

```typescript
// Public API calls (no auth headers)
apiClient.publicGet('/tenants/acme/config');

// Authenticated API calls (includes JWT token)
apiClient.get('/projects');
```

### Route Structure

```
/                     → Public landing page (MainLayout)
/login                → Login page (standalone)
/admin                → Admin dashboard (AdminLayout, protected)
/admin/projects       → Project management (AdminLayout, protected)
/admin/settings       → Settings (AdminLayout, protected)
/admin/branding       → Branding editor (AdminLayout, protected)
/admin/landing-page   → Landing page editor (AdminLayout, protected)
```

### Layout System

**MainLayout** (Public):
- Header with tenant branding
- Public navigation
- "Admin Login" button
- Footer
- Used for: Landing page, marketing pages

**AdminLayout** (Admin):
- Admin header with navigation
- Sidebar with admin menu
- User profile with logout
- "View Public Site" link
- Used for: Dashboard, project management, settings

## Getting Started

### Prerequisites

- Node.js 20+ (currently using 16.18.0, upgrade recommended)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Configuration

Create a `.env` file:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_APP_NAME=Real Solutions
```

### Test Credentials

For development, use these test credentials:
- Email: `admin@example.com`
- Password: `password123`

## Usage

### Accessing Public Pages

1. Visit `http://acme.localhost:3000/` (tenant: acme)
2. Or visit `http://localhost:3000/?tenant=acme`
3. Public landing page loads without authentication

### Accessing Admin Dashboard

1. Click "Admin Login" in header
2. Enter credentials
3. Redirects to `/admin` dashboard
4. Navigate to different admin sections via sidebar

### Creating Tenant Configuration

Each tenant has a configuration defining:
- **Branding**: Name, tagline, logo, favicon
- **Theme**: Colors, fonts, spacing
- **Landing Page Sections**: Hero, features, CTA, content sections

Example configuration:

```json
{
  "tenantId": "acme",
  "branding": {
    "name": "ACME Corporation",
    "tagline": "Innovation at its finest",
    "logo": {
      "light": "/assets/acme-logo-light.png",
      "dark": "/assets/acme-logo-dark.png"
    }
  },
  "theme": {
    "mode": "light",
    "colors": {
      "primary": "#2563eb",
      "secondary": "#7c3aed"
    }
  },
  "landingPage": {
    "sections": [
      {
        "type": "Hero",
        "props": {
          "title": "Welcome to ACME",
          "subtitle": "Your trusted partner",
          "ctaText": "Get Started",
          "ctaLink": "/login"
        }
      }
    ]
  }
}
```

## Development Guide

### Adding New Public Pages

1. Create page component in `src/pages/`
2. Add route to public routes in `App.tsx`:
   ```typescript
   <Route path="/" element={<MainLayout />}>
     <Route path="about" element={<AboutPage />} />
   </Route>
   ```

### Adding New Admin Pages

1. Create page component in `src/pages/`
2. Add route to admin routes in `App.tsx`:
   ```typescript
   <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
     <Route path="new-page" element={<NewPage />} />
   </Route>
   ```

### Adding New Components

1. Create component in `src/components/composite/`
2. Register in `componentRegistry`:
   ```typescript
   export const componentRegistry: ComponentRegistry = {
     // ...existing
     NewSection: NewSectionComponent,
   };
   ```

### Adding New API Endpoints

For **public endpoints**:
```typescript
// In service file
export const TenantService = {
  getPublicData: (slug: string) => {
    return apiClient.publicGet(`/api/tenants/${slug}/public-data`);
  },
};
```

For **authenticated endpoints**:
```typescript
export const ProjectService = {
  getProjects: () => {
    return apiClient.get<Project[]>('/projects/');
  },
};
```

## Project Structure

```
src/
├── api/                    # API services
│   ├── client.ts          # HTTP client with auth support
│   ├── auth.ts            # Authentication service
│   ├── tenant.ts          # Tenant service (public methods)
│   └── project.ts         # Project service (authenticated)
├── components/
│   ├── base/              # Base UI components
│   ├── composite/         # Section components
│   ├── layout/
│   │   ├── MainLayout.tsx # Public layout
│   │   └── AdminLayout.tsx # Admin layout
│   ├── DynamicComponentRenderer/ # Component registry
│   ├── ErrorBoundary.tsx
│   ├── LoadingSpinner.tsx
│   ├── ProtectedRoute.tsx # Auth guard
│   └── ThemeProvider.tsx
├── hooks/
│   └── useAppBootstrap.ts # App initialization
├── pages/
│   ├── LandingPage.tsx    # Public landing page
│   ├── LoginPage.tsx      # Login form
│   └── DashboardPage.tsx  # Admin dashboard
├── stores/
│   ├── authStore.ts       # Auth state
│   ├── tenantStore.ts     # Tenant config
│   └── projectStore.ts    # Project state
├── types/                 # TypeScript definitions
├── utils/
│   ├── tenantResolver.ts  # Tenant detection
│   └── tokenManager.ts    # JWT management
├── styles/
│   └── global.css         # CSS variables
├── App.tsx                # Main app with routing
└── main.tsx              # Entry point
```

## API Integration

### Backend Requirements

The backend API must provide:

**Public Endpoints** (no auth):
- `GET /api/tenants/:slug/` - Get tenant basic info
- `GET /api/tenants/:slug/config/` - Get tenant configuration

**Authenticated Endpoints** (JWT required):
- `POST /api/auth/token/` - Login (get JWT tokens)
- `POST /api/auth/token/refresh/` - Refresh access token
- `GET /api/auth/me/` - Get current user
- `GET /api/projects/` - List projects
- `POST /api/projects/` - Create project
- `PATCH /api/projects/:id/` - Update project
- `DELETE /api/projects/:id/` - Delete project
- `PATCH /api/tenants/:slug/config/` - Update tenant config

### CORS Configuration

Backend must allow requests from:
- `http://localhost:3000` (dev)
- `http://*.localhost:3000` (subdomains)
- Production domains

## Security Considerations

### Authentication
- JWT tokens stored in localStorage
- Access token expires in 5 minutes
- Refresh token expires in 24 hours
- Automatic token refresh on 401 responses
- Logout clears all tokens

### Authorization
- ProtectedRoute component guards admin routes
- API client adds auth headers only for authenticated endpoints
- Public endpoints explicitly use `skipAuth: true` flag
- 401 responses redirect to login (with return URL)

### Best Practices
- Never expose sensitive data in public endpoints
- Validate tenant access on backend
- Use HTTPS in production
- Set secure, httpOnly cookies for tokens (recommended)
- Implement rate limiting on backend

## Deployment

### Build for Production

```bash
npm run build
```

Generates optimized static files in `dist/`.

### Environment Variables

Production `.env`:
```env
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_APP_NAME=Your App Name
```

### Hosting Options

1. **Vercel/Netlify**: Automatic deployments from Git
2. **Static Hosting**: Upload `dist/` to any static host
3. **Docker**: Use provided Dockerfile
4. **CDN**: Serve static assets from CDN

### Subdomain Configuration

Configure DNS to point subdomains to your app:
```
*.yourdomain.com → Your hosting IP/CNAME
```

## Troubleshooting

### Public Pages Not Loading

Check:
- API endpoint returns tenant config without auth
- `publicGet()` is used in tenant service
- Bootstrap hook allows public access (try-catch on auth)

### Admin Dashboard Not Loading

Check:
- Login credentials are correct
- JWT tokens are stored in localStorage
- API returns valid tokens on login
- ProtectedRoute is wrapping admin routes

### Token Refresh Failing

Check:
- Refresh token is valid (not expired)
- Backend `/api/auth/token/refresh/` endpoint works
- Token refresh logic in `client.ts` is correct

### Subdomain Not Detected

Check:
- URL format: `tenant.localhost:3000`
- `tenantResolver.ts` extracts subdomain correctly
- Backend allows subdomain CORS

## Additional Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture diagrams
- [DOCS.md](./DOCS.md) - Comprehensive developer guide
- [QUICKSTART.md](./QUICKSTART.md) - Quick start guide
- [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - Implementation details

## Contributing

1. Create feature branch
2. Make changes
3. Test locally
4. Submit pull request

## License

MIT License - see LICENSE file for details
