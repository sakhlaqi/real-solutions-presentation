/**
 * App Bootstrap Hook
 * Initializes tenant and auth state on app load
 * Public pages load tenant config without requiring authentication
 */

import { useEffect, useState } from 'react';
import { useAuthStore, useTenantStore } from '../stores';
import { DEFAULT_ROUTES, type RouteConfig } from '../types/routing';

export const useAppBootstrap = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [routes, setRoutes] = useState<RouteConfig[]>(DEFAULT_ROUTES);
  const { initializeTenant } = useTenantStore();
  const { loadUser } = useAuthStore();
  const config = useTenantStore((state) => state.config);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        // Always initialize tenant first (required for both public and admin)
        await initializeTenant();

        // Attempt to load user if tokens exist (non-blocking for public pages)
        try {
          await loadUser();
        } catch (authError) {
          // Auth errors are acceptable for public pages
          console.log('No authenticated user - public access mode');
        }

        setIsInitialized(true);
      } catch (err: any) {
        console.error('Bootstrap error:', err);
        setError(err.message || 'Failed to initialize application');
        setIsInitialized(true); // Still set to true to show error state
      }
    };

    bootstrap();
  }, []);

  // Update routes when tenant config changes
  useEffect(() => {
    if (config?.routes && config.routes.length > 0) {
      console.log('[useAppBootstrap] Loading dynamic routes from tenant config:', config.routes.length);
      setRoutes(config.routes);
    } else {
      console.log('[useAppBootstrap] Using default routes');
      setRoutes(DEFAULT_ROUTES);
    }
  }, [config]);

  return { isInitialized, error, routes };
};

export default useAppBootstrap;
