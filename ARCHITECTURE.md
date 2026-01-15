# Architecture Diagram - Multi-Tenant React Application

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Browser / Client                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │            Subdomain Resolution                             │ │
│  │  tenant1.example.com → slug: "tenant1"                     │ │
│  │  localhost?tenant=demo → slug: "demo"                      │ │
│  └────────────────────────────────────────────────────────────┘ │
│                              ↓                                    │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                   React Application                         │ │
│  │  ┌──────────────────────────────────────────────────────┐  │ │
│  │  │              App Bootstrap                            │  │ │
│  │  │  • Initialize tenant (load config)                   │  │ │
│  │  │  • Load user (if authenticated)                      │  │ │
│  │  │  • Apply theme                                        │  │ │
│  │  └──────────────────────────────────────────────────────┘  │ │
│  │                              ↓                              │ │
│  │  ┌──────────────────────────────────────────────────────┐  │ │
│  │  │             State Management (Zustand)                │  │ │
│  │  │  ┌──────────┐  ┌──────────┐  ┌──────────┐           │  │ │
│  │  │  │authStore │  │ tenant   │  │ project  │           │  │ │
│  │  │  │          │  │  Store   │  │  Store   │           │  │ │
│  │  │  └──────────┘  └──────────┘  └──────────┘           │  │ │
│  │  └──────────────────────────────────────────────────────┘  │ │
│  │                              ↓                              │ │
│  │  ┌──────────────────────────────────────────────────────┐  │ │
│  │  │                Theme Provider                         │  │ │
│  │  │  Applies CSS Variables from tenant config            │  │ │
│  │  │  --color-primary, --font-primary, etc.               │  │ │
│  │  └──────────────────────────────────────────────────────┘  │ │
│  │                              ↓                              │ │
│  │  ┌──────────────────────────────────────────────────────┐  │ │
│  │  │                  Router                               │  │ │
│  │  │  ┌─────────────┐  ┌────────────┐  ┌──────────────┐  │  │ │
│  │  │  │   Public    │  │ Protected  │  │   Auth       │  │  │ │
│  │  │  │   Routes    │  │  Routes    │  │   Guards     │  │  │ │
│  │  │  │  /          │  │ /dashboard │  │              │  │  │ │
│  │  │  │  /login     │  │ /projects  │  │              │  │  │ │
│  │  │  └─────────────┘  └────────────┘  └──────────────┘  │  │ │
│  │  └──────────────────────────────────────────────────────┘  │ │
│  │                              ↓                              │ │
│  │  ┌──────────────────────────────────────────────────────┐  │ │
│  │  │            Dynamic Component Renderer                 │  │ │
│  │  │  Renders landing page from configuration             │  │ │
│  │  │  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐    │  │ │
│  │  │  │ Hero   │  │Feature │  │  CTA   │  │Content │    │  │ │
│  │  │  │Section │  │  Grid  │  │Section │  │Section │    │  │ │
│  │  │  └────────┘  └────────┘  └────────┘  └────────┘    │  │ │
│  │  └──────────────────────────────────────────────────────┘  │ │
│  │                              ↓                              │ │
│  │  ┌──────────────────────────────────────────────────────┐  │ │
│  │  │              Component Library                        │  │ │
│  │  │  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐    │  │ │
│  │  │  │ Button │  │  Card  │  │ Input  │  │  Text  │    │  │ │
│  │  │  └────────┘  └────────┘  └────────┘  └────────┘    │  │ │
│  │  └──────────────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────────┘ │
│                              ↓                                    │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                   API Client (Axios)                        │ │
│  │  • JWT token management                                     │ │
│  │  • Automatic refresh                                        │ │
│  │  • Request/response interceptors                            │ │
│  │  • Authorization header injection                           │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              ↓ HTTP
┌─────────────────────────────────────────────────────────────────┐
│                      Backend API (Django)                        │
├─────────────────────────────────────────────────────────────────┤
│  • GET  /api/tenants/:slug/                                │
│  • GET  /api/tenants/:slug/config/                         │
│  • POST /api/auth/login/                                        │
│  • POST /api/auth/token/refresh/                                │
│  • GET  /api/auth/me/                                           │
│  • GET  /api/projects/                                          │
└─────────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
App
├── ErrorBoundary
│   └── ThemeProvider
│       └── BrowserRouter
│           ├── MainLayout
│           │   ├── Header
│           │   ├── Outlet (route content)
│           │   │   ├── LandingPage
│           │   │   │   └── DynamicComponentRenderer (multiple)
│           │   │   │       ├── Hero
│           │   │   │       ├── FeatureGrid
│           │   │   │       ├── CTASection
│           │   │   │       └── ContentSection
│           │   │   ├── LoginPage
│           │   │   └── ProtectedRoute
│           │   │       └── DashboardPage
│           │   └── Footer
│           └── LoadingSpinner (Suspense fallback)
```

## Data Flow

### 1. Application Bootstrap

```
User visits → TenantResolver extracts slug
           ↓
Fetch tenant config from API
           ↓
Load into tenantStore
           ↓
ThemeProvider applies CSS variables
           ↓
Check for stored auth tokens
           ↓
If valid, load user into authStore
           ↓
Render application
```

### 2. Authentication Flow

```
User enters credentials
           ↓
authStore.login(credentials)
           ↓
API: POST /api/auth/login/
           ↓
Receive { tokens, user }
           ↓
TokenManager stores in localStorage
           ↓
Update authStore state
           ↓
Redirect to dashboard
```

### 3. Token Refresh Flow

```
API request made
           ↓
Interceptor checks token expiry
           ↓
If expiring soon: refresh token
           ↓
API: POST /api/auth/token/refresh/
           ↓
Receive new tokens
           ↓
Update localStorage
           ↓
Retry original request
```

### 4. Landing Page Rendering

```
LandingPage component loads
           ↓
Get landingPageSections from tenantStore
           ↓
Sort sections by order
           ↓
Map over sections
           ↓
DynamicComponentRenderer for each
           ↓
Check visibility & feature flags
           ↓
Look up component in registry
           ↓
Render component with props
```

## State Management

### Store Structure

```
authStore {
  user: User | null
  tokens: AuthTokens | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  actions: {
    login(), logout(), loadUser()
  }
}

tenantStore {
  tenant: Tenant | null
  config: TenantConfig | null
  tenantSlug: string
  isLoading: boolean
  error: string | null
  isInitialized: boolean
  actions: {
    initializeTenant(), loadTenantConfig()
  }
}

projectStore {
  projects: Project[]
  activeProject: Project | null
  isLoading: boolean
  error: string | null
  actions: {
    loadProjects(), setActiveProject(),
    createProject(), updateProject(), deleteProject()
  }
}
```

## API Integration

### Service Layer

```
API Client
    ↓
┌─────────────────────────────────┐
│     Service Layer               │
├─────────────────────────────────┤
│  AuthService                    │
│  • login(credentials)           │
│  • logout()                     │
│  • getCurrentUser()             │
│                                 │
│  TenantService                  │
│  • getTenantBySlug(slug)        │
│  • getTenantConfig(id)          │
│                                 │
│  ProjectService                 │
│  • getProjects()                │
│  • getProject(id)               │
│  • createProject(data)          │
└─────────────────────────────────┘
```

## Security Model

```
┌──────────────────────────────────────────┐
│         Security Layers                  │
├──────────────────────────────────────────┤
│  1. Authentication                       │
│     • JWT tokens                         │
│     • Token refresh                      │
│     • Secure storage                     │
│                                          │
│  2. Authorization                        │
│     • Protected routes                   │
│     • Auth guards                        │
│     • Redirect to login                  │
│                                          │
│  3. API Security                         │
│     • Authorization headers              │
│     • Token validation                   │
│     • Backend CORS                       │
│                                          │
│  4. Frontend Security                    │
│     • No secrets in code                 │
│     • Config validation                  │
│     • Error boundaries                   │
│     • XSS prevention                     │
└──────────────────────────────────────────┘
```

## Deployment Architecture

```
┌──────────────────────────────────────────────────────┐
│              Production Deployment                    │
├──────────────────────────────────────────────────────┤
│                                                       │
│  DNS: *.example.com                                  │
│         ↓                                             │
│  Load Balancer / CDN                                 │
│         ↓                                             │
│  Web Server (Nginx/Apache)                           │
│  • Route subdomains                                  │
│  • Serve static files                                │
│  • Proxy /api to backend                             │
│         ↓                                             │
│  React SPA (dist/)                                   │
│  • Single codebase                                   │
│  • Client-side routing                               │
│         ↓                                             │
│  Backend API                                         │
│  • Django REST                                       │
│  • Multi-tenant DB                                   │
│  • JWT auth                                          │
└──────────────────────────────────────────────────────┘
```

## Key Design Patterns

1. **Singleton Pattern** - API client instance
2. **Strategy Pattern** - Component registry for dynamic rendering
3. **Observer Pattern** - Zustand stores with subscribers
4. **Factory Pattern** - DynamicComponentRenderer creates components
5. **Provider Pattern** - ThemeProvider wraps app
6. **Higher-Order Component** - ProtectedRoute wrapper
7. **Composition** - Layout components compose pages
