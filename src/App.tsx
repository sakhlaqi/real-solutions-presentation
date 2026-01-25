/**
 * Main App Component
 * Sets up routing, theming, and bootstraps application
 * 
 * **Dynamic Routing:**
 * Routes are now generated dynamically from tenant configuration.
 * Each tenant can define their own routes, protected pages, and layouts.
 * 
 * **Theme Integration:**
 * Tenant theme is resolved in TenantThemeProvider, then passed to UIProvider
 * for consumption by UI components.
 */

import React, { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Spinner, UIProvider } from '@sakhlaqi/ui';
import { TenantThemeProvider, useTenantTheme } from './providers';
import { DynamicRoutes } from './components/DynamicRoutes';
import { useAppBootstrap } from './hooks/useAppBootstrap';
import './styles/global.css';

/**
 * App Content with Token Integration
 * 
 * Wraps content with UIProvider that receives resolved tokens
 */
const AppContent: React.FC<{ routes: import('./types/routing').RouteConfig[] }> = ({ routes }) => {
  const { resolvedTheme } = useTenantTheme();

  return (
    <UIProvider defaultProvider="mui" tokens={resolvedTheme?.tokens}>
      <BrowserRouter>
        <Suspense fallback={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            <Spinner size="large" />
          </div>
        }>
          {/* Dynamic routes from tenant configuration */}
          <DynamicRoutes 
            routes={routes} 
            defaultRoute="/"
            notFoundRoute="/"
          />
        </Suspense>
      </BrowserRouter>
    </UIProvider>
  );
};

const App: React.FC = () => {
  const { isInitialized, error, routes, tenantTheme, themeLoading } = useAppBootstrap();

  if (!isInitialized) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: '1rem' }}>
        <div className="spinner" style={{ width: '48px', height: '48px', border: '4px solid #f3f3f3', borderTop: '4px solid #3498db', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        <p style={{ fontSize: '1rem', color: '#666' }}>Initializing application...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Initialization Error</h2>
        <p style={{ color: '#d32f2f' }}>{error}</p>
        <button onClick={() => window.location.reload()}>Reload</button>
      </div>
    );
  }

  return (
    <TenantThemeProvider theme={tenantTheme} isLoading={themeLoading}>
      <AppContent routes={routes} />
    </TenantThemeProvider>
  );
};

export default App;
