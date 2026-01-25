/**
 * Dynamic Routes Component
 * 
 * Generates React Router routes dynamically from tenant configuration.
 * Supports protected routes, nested layouts, and feature flags.
 */

import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { JsonPageRoute } from './JsonPageRoute';
import { ProtectedRoute } from './ProtectedRoute';
import { useTenantStore } from '../stores';
import type { RouteConfig, RouteLayout } from '../types/routing';
import { sortRoutes } from '../types/routing';

/**
 * Layout Components
 */
const MainLayout = () => <Outlet />;
const AdminLayout = () => <Outlet />;
const NoLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => <>{children}</>;

/**
 * Get Layout Component
 * 
 * Returns the appropriate layout wrapper for a route
 */
function getLayoutComponent(layout: RouteLayout): React.ComponentType<{ children?: React.ReactNode }> {
  switch (layout) {
    case 'main':
      return MainLayout;
    case 'admin':
      return AdminLayout;
    case 'none':
      return NoLayout;
    default:
      return NoLayout;
  }
}

/**
 * Dynamic Routes Props
 */
interface DynamicRoutesProps {
  /** Array of route configurations from tenant */
  routes: RouteConfig[];
  
  /** Default redirect path */
  defaultRoute?: string;
  
  /** 404 Not Found page path */
  notFoundRoute?: string;
}

/**
 * Dynamic Routes Component
 * 
 * Renders React Router routes from configuration.
 * 
 * **Features:**
 * - Protected routes with authentication
 * - Layout wrappers (main, admin, none)
 * - Feature flag filtering
 * - Route sorting by priority
 * - Nested route support
 * 
 * @example
 * ```tsx
 * <DynamicRoutes 
 *   routes={tenantRoutes} 
 *   defaultRoute="/"
 *   notFoundRoute="/404"
 * />
 * ```
 */
export const DynamicRoutes: React.FC<DynamicRoutesProps> = ({ 
  routes, 
  defaultRoute = '/',
  notFoundRoute = '/'
}) => {
  const featureFlags = useTenantStore((state) => state.config?.featureFlags || {});

  // Filter routes by feature flags
  const activeRoutes = routes.filter(route => {
    if (!route.featureFlag) return true;
    return featureFlags[route.featureFlag] === true;
  });

  // Sort routes for proper matching priority
  const sortedRoutes = sortRoutes(activeRoutes);

  console.log('[DynamicRoutes] Rendering routes:', {
    total: routes.length,
    active: activeRoutes.length,
    sorted: sortedRoutes.length
  });

  return (
    <Routes>
      {sortedRoutes.map((route) => {
        const Layout = getLayoutComponent(route.layout);
        
        // Create the page element
        const pageElement = (
          <JsonPageRoute 
            pagePath={route.pagePath} 
            pageTitle={route.title}
          />
        );

        // Wrap in layout
        const layoutElement = route.layout === 'none' 
          ? pageElement 
          : <Layout>{pageElement}</Layout>;

        // Wrap in ProtectedRoute if needed
        const element = route.protected 
          ? <ProtectedRoute>{layoutElement}</ProtectedRoute>
          : layoutElement;

        return (
          <Route
            key={route.path}
            path={route.path}
            element={element}
          />
        );
      })}

      {/* Catch-all: redirect to not found or default route */}
      <Route path="*" element={<Navigate to={notFoundRoute || defaultRoute} replace />} />
    </Routes>
  );
};

/**
 * Dynamic Routes with Layout Grouping
 * 
 * Alternative implementation that groups routes by layout for better nesting.
 * More efficient for large route sets with many nested routes.
 */
export const DynamicRoutesGrouped: React.FC<DynamicRoutesProps> = ({ 
  routes, 
  defaultRoute = '/',
  notFoundRoute = '/'
}) => {
  const featureFlags = useTenantStore((state) => state.config?.featureFlags || {});

  // Filter routes by feature flags
  const activeRoutes = routes.filter(route => {
    if (!route.featureFlag) return true;
    return featureFlags[route.featureFlag] === true;
  });

  // Group routes by layout and protection
  const groupedRoutes = activeRoutes.reduce((acc, route) => {
    const key = `${route.layout}-${route.protected}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(route);
    return acc;
  }, {} as Record<string, RouteConfig[]>);

  console.log('[DynamicRoutesGrouped] Route groups:', Object.keys(groupedRoutes));

  return (
    <Routes>
      {/* Unprotected routes with main layout */}
      {groupedRoutes['main-false'] && (
        <Route path="/" element={<MainLayout />}>
          {groupedRoutes['main-false'].map(route => (
            <Route
              key={route.path}
              path={route.path}
              element={<JsonPageRoute pagePath={route.pagePath} pageTitle={route.title} />}
            />
          ))}
        </Route>
      )}

      {/* Unprotected routes with no layout */}
      {groupedRoutes['none-false'] && 
        groupedRoutes['none-false'].map(route => (
          <Route
            key={route.path}
            path={route.path}
            element={<JsonPageRoute pagePath={route.pagePath} pageTitle={route.title} />}
          />
        ))
      }

      {/* Protected routes with admin layout */}
      {groupedRoutes['admin-true'] && (
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          {groupedRoutes['admin-true'].map(route => (
            <Route
              key={route.path}
              path={route.path.replace('/admin/', '')}
              element={<JsonPageRoute pagePath={route.pagePath} pageTitle={route.title} />}
            />
          ))}
        </Route>
      )}

      {/* Protected routes with main layout */}
      {groupedRoutes['main-true'] && (
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          {groupedRoutes['main-true'].map(route => (
            <Route
              key={route.path}
              path={route.path}
              element={<JsonPageRoute pagePath={route.pagePath} pageTitle={route.title} />}
            />
          ))}
        </Route>
      )}

      {/* Catch-all */}
      <Route path="*" element={<Navigate to={notFoundRoute || defaultRoute} replace />} />
    </Routes>
  );
};

export default DynamicRoutes;
