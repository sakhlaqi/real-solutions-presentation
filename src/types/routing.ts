/**
 * Dynamic Routing Configuration Types
 * 
 * Enables per-tenant dynamic route generation from backend configuration.
 * Routes are fetched from the tenant API and dynamically generated at runtime.
 */

/**
 * Route Layout Type
 * 
 * Defines which layout wrapper to use for a route
 */
export type RouteLayout = 'main' | 'admin' | 'none';

/**
 * Route Configuration
 * 
 * Defines a single route in the application.
 * Each route corresponds to a JSON page configuration.
 * 
 * @example
 * ```json
 * {
 *   "path": "/admin/dashboard",
 *   "pagePath": "/dashboard",
 *   "title": "Dashboard",
 *   "protected": true,
 *   "layout": "admin",
 *   "exact": true
 * }
 * ```
 */
export interface RouteConfig {
  /** React Router path (can include params like :id) */
  path: string;
  
  /** 
   * Path to the JSON page configuration in tenant UI config
   * This is the key used to look up the page JSON
   */
  pagePath: string;
  
  /** Page title (for document.title and breadcrumbs) */
  title: string;
  
  /** Whether route requires authentication */
  protected: boolean;
  
  /** Layout wrapper to use */
  layout: RouteLayout;
  
  /** Whether route must match exactly (default: false for index routes) */
  exact?: boolean;
  
  /** Order/priority for route matching (lower = higher priority) */
  order?: number;
  
  /** Custom metadata for route */
  meta?: Record<string, unknown>;
  
  /** Feature flag to check (route hidden if flag is false) */
  featureFlag?: string;
}

/**
 * Routes Configuration
 * 
 * Collection of all routes for a tenant.
 * Returned from the tenant API.
 */
export interface RoutesConfig {
  /** Array of route configurations */
  routes: RouteConfig[];
  
  /** Default route (redirect target for /) */
  defaultRoute?: string;
  
  /** 404 Not Found route */
  notFoundRoute?: string;
  
  /** Unauthorized access redirect */
  unauthorizedRoute?: string;
  
  /** Configuration version */
  version?: string;
}

/**
 * Default Routes Configuration
 * 
 * Fallback routes used when tenant config is unavailable or during initialization.
 */
export const DEFAULT_ROUTES: RouteConfig[] = [
  {
    path: '/',
    pagePath: '/',
    title: 'Home',
    protected: false,
    layout: 'main',
    exact: true,
    order: 0,
  },
  {
    path: '/login',
    pagePath: '/login',
    title: 'Login',
    protected: false,
    layout: 'none',
    exact: true,
    order: 1,
  },
  {
    path: '/admin',
    pagePath: '/dashboard',
    title: 'Dashboard',
    protected: true,
    layout: 'admin',
    exact: true,
    order: 2,
  },
];

/**
 * Route Matcher
 * 
 * Helper to check if a path matches a route pattern
 */
export function matchesRoute(pathname: string, routePath: string): boolean {
  // Convert route pattern to regex
  const pattern = routePath
    .replace(/\//g, '\\/')
    .replace(/:([^/]+)/g, '([^/]+)');
  
  const regex = new RegExp(`^${pattern}$`);
  return regex.test(pathname);
}

/**
 * Route Sorter
 * 
 * Sorts routes by order and specificity
 */
export function sortRoutes(routes: RouteConfig[]): RouteConfig[] {
  return [...routes].sort((a, b) => {
    // First by explicit order
    if (a.order !== undefined && b.order !== undefined) {
      return a.order - b.order;
    }
    if (a.order !== undefined) return -1;
    if (b.order !== undefined) return 1;
    
    // Then by specificity (more specific = higher priority)
    const aSpecificity = getRouteSpecificity(a.path);
    const bSpecificity = getRouteSpecificity(b.path);
    return bSpecificity - aSpecificity;
  });
}

/**
 * Get Route Specificity
 * 
 * Calculate specificity score for route matching priority
 */
function getRouteSpecificity(path: string): number {
  let score = 0;
  
  // More path segments = more specific
  score += path.split('/').length * 10;
  
  // Static segments are more specific than params
  const paramCount = (path.match(/:/g) || []).length;
  score -= paramCount * 5;
  
  // Exact paths are more specific
  if (!path.includes(':')) {
    score += 20;
  }
  
  return score;
}
