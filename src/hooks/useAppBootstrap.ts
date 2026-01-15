/**
 * App Bootstrap Hook
 * Initializes tenant and auth state on app load
 * Public pages load tenant config without requiring authentication
 */

import { useEffect, useState } from 'react';
import { useAuthStore, useTenantStore } from '../stores';

export const useAppBootstrap = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { initializeTenant } = useTenantStore();
  const { loadUser } = useAuthStore();

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

  return { isInitialized, error };
};

export default useAppBootstrap;
