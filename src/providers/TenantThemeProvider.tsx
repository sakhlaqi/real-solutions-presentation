/**
 * Tenant Theme Provider
 * 
 * React Context provider for tenant theme management.
 * Resolves theme once per tenant load and provides it via context.
 */

import React, { useMemo, type ReactNode } from 'react';
import { ThemeResolver } from '../utils/themeResolver';
import type { TenantThemeConfig } from '../types/theme';
import { TenantThemeContext, type TenantThemeContextValue } from './TenantThemeContext';

/**
 * Default context value
 */
const defaultContextValue: TenantThemeContextValue = {
  resolvedTheme: null,
  activeModes: [],
  baseTheme: null,
  isLoading: true,
  error: null,
  isLegacy: false,
};

/**
 * Provider Props
 */
export interface TenantThemeProviderProps {
  /**
   * Tenant theme configuration from API
   */
  theme: TenantThemeConfig | null;

  /**
   * Whether theme is still loading
   */
  isLoading?: boolean;

  /**
   * Loading error
   */
  error?: string | null;

  /**
   * Children components
   */
  children: ReactNode;
}

/**
 * Tenant Theme Provider
 * 
 * Provides resolved theme to the component tree.
 * Theme resolution happens once when theme changes.
 * 
 * @example
 * ```tsx
 * <TenantThemeProvider theme={tenantConfig.theme}>
 *   <App />
 * </TenantThemeProvider>
 * ```
 */
export const TenantThemeProvider: React.FC<TenantThemeProviderProps> = ({
  theme,
  isLoading = false,
  error = null,
  children,
}) => {
  /**
   * Resolve theme with memoization
   * Only re-resolves when theme changes
   */
  const contextValue = useMemo<TenantThemeContextValue>(() => {
    // Loading state
    if (isLoading) {
      return {
        ...defaultContextValue,
        isLoading: true,
      };
    }

    // Error state
    if (error) {
      return {
        ...defaultContextValue,
        isLoading: false,
        error,
      };
    }

    // No theme
    if (!theme) {
      return {
        ...defaultContextValue,
        isLoading: false,
        error: 'No theme provided',
      };
    }

    // Resolve theme with modes
    const { metadata, json: baseTheme } = theme;
    const activeModes = metadata.selected_modes || [];

    // Validate base theme exists
    if (!baseTheme) {
      console.error('[TenantThemeProvider] Base theme is missing from theme configuration');
      return {
        ...defaultContextValue,
        isLoading: false,
        error: 'Base theme not loaded from API',
      };
    }

    // Debug: Log the actual theme structure received
    console.log('[TenantThemeProvider] Theme structure:', {
      metadata,
      baseThemeKeys: Object.keys(baseTheme),
      hasMeta: 'meta' in baseTheme,
      hasTokens: 'tokens' in baseTheme,
      hasModes: 'modes' in baseTheme,
    });

    console.log('[TenantThemeProvider] Resolving theme:', {
      id: metadata.id,
      name: metadata.name,
      version: metadata.version,
      activeModes,
    });

    try {
      const result = ThemeResolver.resolve(baseTheme, activeModes, {
        skipValidation: true, // Skip validation - themes from API are pre-validated
        useCache: true,
      });

      if (!result.success) {
        console.error('[TenantThemeProvider] Theme resolution failed:', result.error);
        
        // Fallback to base theme on resolution failure
        console.warn('[TenantThemeProvider] Falling back to base theme without modes');
        return {
          resolvedTheme: {
            theme: baseTheme,
            mode: undefined,
            tokens: baseTheme.tokens,
          },
          activeModes: [],
          baseTheme,
          isLoading: false,
          error: result.error || 'Theme resolution failed',
          isLegacy: false,
        };
      }

      return {
        resolvedTheme: result.appliedTheme!,
        activeModes,
        baseTheme,
        isLoading: false,
        error: null,
        isLegacy: false,
      };
    } catch (error) {
      console.error('[TenantThemeProvider] Unexpected error during theme resolution:', error);
      
      // Fallback to base theme on exception
      console.warn('[TenantThemeProvider] Falling back to base theme due to error');
      return {
        resolvedTheme: {
          theme: baseTheme,
          mode: undefined,
          tokens: baseTheme.tokens,
        },
        activeModes: [],
        baseTheme,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error during theme resolution',
        isLegacy: false,
      };
    }
  }, [theme, isLoading, error]);

  return (
    <TenantThemeContext.Provider value={contextValue}>
      {children}
    </TenantThemeContext.Provider>
  );
};

export default TenantThemeProvider;
