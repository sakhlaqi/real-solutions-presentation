/**
 * Tenant Theme Hook
 * 
 * Custom hook for accessing resolved tenant theme from context.
 */

import { useContext } from 'react';
import { TenantThemeContext } from './TenantThemeContext';
import type { TenantThemeContextValue } from './TenantThemeContext';

/**
 * Hook to access tenant theme
 * 
 * @throws Error if used outside TenantThemeProvider
 * 
 * @example
 * ```tsx
 * const { resolvedTheme, activeModes, isLoading } = useTenantTheme();
 * 
 * if (isLoading) return <Spinner />;
 * if (!resolvedTheme) return <Error />;
 * 
 * // Use resolvedTheme.tokens
 * ```
 */
export const useTenantTheme = (): TenantThemeContextValue => {
  const context = useContext(TenantThemeContext);
  if (!context) {
    throw new Error('useTenantTheme must be used within TenantThemeProvider');
  }
  return context;
};
