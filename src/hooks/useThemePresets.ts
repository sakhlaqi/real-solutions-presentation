/**
 * Theme Presets Hook
 * Loads available theme presets from the API
 * 
 * NOTE: Only use this in admin/configuration pages where users need to
 * browse or select from available theme presets. Regular users don't need
 * this - they get their tenant's configured theme automatically.
 * 
 * Use cases:
 * - Admin theme configuration page
 * - Theme gallery/preview
 * - Tenant theme selection
 */

import { useState, useEffect } from 'react';
import { ThemeService, type ThemeMetadata } from '../api';

export interface UseThemePresetsResult {
  presets: ThemeMetadata[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to load theme presets from API
 * 
 * ⚠️ WARNING: Only use in admin/configuration interfaces!
 * Regular app pages don't need this - tenant theme loads automatically.
 * 
 * @example
 * ```tsx
 * // In an admin theme configuration page
 * function AdminThemeSettings() {
 *   const { presets, isLoading, error } = useThemePresets();
 *   
 *   if (isLoading) return <Spinner />;
 *   if (error) return <Error message={error} />;
 *   
 *   return <ThemeSelector themes={presets} />;
 * }
 * ```
 */
export const useThemePresets = (): UseThemePresetsResult => {
  const [presets, setPresets] = useState<ThemeMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPresets = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('[useThemePresets] Fetching theme presets from API...');
      const data = await ThemeService.getPresets();
      
      console.log(`[useThemePresets] Loaded ${data.length} theme presets:`, 
        data.map(p => p.name).join(', ')
      );
      
      setPresets(data);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to load theme presets';
      console.error('[useThemePresets] Error loading theme presets:', err);
      setError(errorMessage);
      
      // Set empty array on error to allow app to continue
      setPresets([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPresets();
  }, []);

  return {
    presets,
    isLoading,
    error,
    refetch: fetchPresets,
  };
};

export default useThemePresets;
