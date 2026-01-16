# Multi-Tenant React Application

A production-grade, multi-tenant front-end application built with React, TypeScript, and Vite. Each tenant is hosted on its own subdomain and features dynamic branding, theming, and configurable landing pages.

> **Latest Version:** 1.1.0 | [View Changelog](./CHANGELOG.md)

## Features

✅ **Multi-tenant architecture** - Single codebase, multiple tenants  
✅ **Subdomain-based tenant resolution** - Automatic tenant detection  
✅ **Dynamic theming** - Per-tenant colors, fonts, and styles using CSS variables  
✅ **Configurable landing pages** - Component-based, data-driven pages  
✅ **UI Component Library** - [@sakhlaqi/ui](../ui) - Production-ready React components  
✅ **JWT authentication** - Secure API communication with token refresh  
✅ **Token management** - Automatic refresh, session validation  
✅ **Error handling** - Centralized error utilities with user-friendly messages  
✅ **State management** - Zustand for global state  
✅ **Protected routes** - Authentication guards with session restoration  
✅ **Error boundaries** - Per-component graceful degradation  
✅ **TypeScript** - Full type safety (no `any` types)  
✅ **Responsive design** - Mobile-first approach  

## Getting Started

### Prerequisites

- Node.js 18+ (or use nvm with `.nvmrc`)
- npm or yarn
- Access to the API server
- GitHub token for `@sakhlaqi/ui` package (see [UI Library Setup](../ui/GITHUB_PACKAGES_SETUP.md))

### Installation

```bash
# Navigate to presentation directory
cd presentation

# Use correct Node version
nvm use

# Set GitHub token for @sakhlaqi/ui package
export GITHUB_TOKEN=your_github_token_here

# Install dependencies (includes @sakhlaqi/ui from GitHub Packages)
npm install

# Copy environment file
cp .env.example .env
```

### Configuration

Edit `.env` with your settings:

```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:8000

# Default tenant for development
VITE_DEFAULT_TENANT=acme

# Environment
VITE_ENV=development
```

### Development

```bash
# Start development server
npm run dev
```

The app will be available at: `http://localhost:5173`

For tenant-specific testing, add hosts entries:
```
127.0.0.1 acme.localhost
127.0.0.1 beta.localhost
```

Then access: `http://acme.localhost:5173`

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Architecture

### Project Structure

```
src/
├── api/                    # API client and service modules
│   ├── client.ts          # Centralized API client with retry logic
│   ├── auth.ts            # Authentication service
│   ├── tenant.ts          # Tenant service
│   └── project.ts         # Project service
├── components/
│   ├── base/              # Base UI components
│   ├── composite/         # Composite components (Hero, FeatureGrid, etc.)
│   ├── layout/            # Layout components
│   ├── DynamicComponentRenderer/  # Dynamic component system
│   │   ├── componentRegistry.ts   # Whitelist-based component registry
│   │   └── DynamicComponentRenderer.tsx  # Safe dynamic rendering
│   ├── ErrorBoundary.tsx  # Global error boundary
│   ├── LoadingSpinner.tsx # Loading indicator
│   ├── ProtectedRoute.tsx # Authentication guard
│   └── ThemeProvider.tsx  # Dynamic theming
├── config/                 # Application configuration
├── hooks/                  # Custom React hooks
├── pages/                  # Page components
├── services/               # Business logic services
├── stores/                 # Zustand state stores
│   ├── authStore.ts       # Authentication state
│   └── tenantStore.ts     # Tenant state
├── styles/                 # Global styles
├── types/                  # TypeScript type definitions
│   └── auth.ts            # Authentication types
└── utils/                  # Utility functions
    ├── tokenManager.ts    # JWT token utilities
    └── errorHandler.ts    # Error handling utilities
```

### State Management

The application uses Zustand for state management:

- **authStore** - Authentication state, login/logout, session management
- **tenantStore** - Tenant configuration, theming, feature flags

### Authentication Flow

```
1. User visits tenant subdomain (acme.example.com)
   ↓
2. TenantResolver extracts tenant from subdomain
   ↓
3. User logs in with credentials
   ↓
4. API returns JWT tokens (access + refresh)
   ↓
5. TokenManager stores tokens in localStorage
   ↓
6. API client auto-attaches token to requests
   ↓
7. On 401, automatic token refresh with request queuing
   ↓
8. On refresh failure, redirect to login
```

### API Client Features

The centralized API client (`src/api/client.ts`) provides:

- **Automatic authentication** - Token injection for all requests
- **Token refresh** - Automatic refresh on 401 with request queuing
- **Retry logic** - Exponential backoff for transient failures
- **Error normalization** - Consistent `ApiError` interface

```typescript
// Error interface
interface ApiError {
  code: string;
  message: string;
  statusCode: number;
  details?: Record<string, unknown>;
  correlationId?: string;
  isNetworkError: boolean;
  isAuthError: boolean;
  isServerError: boolean;
}
```

### Dynamic Components

The landing page system uses a whitelist-based component registry:

```typescript
// Only registered components can be rendered
const componentRegistry = {
  hero: Hero,
  featureGrid: FeatureGrid,
  ctaSection: CTASection,
  contentSection: ContentSection,
};

// Props are validated against schemas
const componentPropSchemas = {
  hero: {
    required: ['title'],
    urlProps: ['ctaLink'],      // Validated URLs
    textOnlyProps: ['title'],   // HTML stripped
  },
};
```

Security features:
- Whitelist-based component loading
- URL validation (blocks javascript: and data: protocols)
- Text sanitization (strips HTML tags)
- Per-component error boundaries

## Security Considerations

### Token Storage

Tokens are stored in localStorage with these mitigations:

| Risk | Mitigation |
|------|------------|
| XSS access to tokens | Short-lived access tokens (15 min) |
| Session hijacking | Automatic token rotation on refresh |
| Token replay | Token version tracking for revocation |

**Future Enhancement:** Migration to httpOnly cookies when backend support is added.

### Protected Routes

The `ProtectedRoute` component provides:

- Session validity checking on mount
- Automatic session restoration attempt
- Session expiry detection with graceful logout
- Intended destination preservation for post-login redirect

### Error Handling

Centralized error handling via `src/utils/errorHandler.ts`:

```typescript
import { getErrorMessage, isRetryableError } from '../utils/errorHandler';

// Get user-friendly message
const message = getErrorMessage(error);

// Check if retry should be attempted
if (isRetryableError(error)) {
  // Retry logic
}
```

## Testing

```bash
# Run tests
npm run test

# Run tests with coverage
npm run test:coverage

# Type checking
npm run typecheck

# Linting
npm run lint
```

## Deployment

### Environment Variables

```bash
# Production
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_ENV=production
```

### Docker

```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name ~^(?<tenant>.+)\.yourdomain\.com$;
    
    root /usr/share/nginx/html;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # API proxy
    location /api/ {
        proxy_pass https://api.yourdomain.com;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Documentation

- [Architecture Overview](./ARCHITECTURE.md)
- [Dual Mode Implementation](./DUAL_MODE_README.md)
- [Quick Start Guide](./QUICKSTART.md)
- [Changelog](./CHANGELOG.md)

## License

[Your License Here]

## Contributing

[Your Contributing Guidelines]
