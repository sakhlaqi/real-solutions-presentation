/**
 * UI Provider Bridge
 * 
 * Bridges tenant configuration to UI library provider.
 * Reads theme, branding, and feature flags from tenant context
 * and configures the UI library accordingly.
 * 
 * **Responsibilities:**
 * - Read tenant configuration from tenant store
 * - Map tenant theme to UI library theme config
 * - Apply feature flags (future enhancement)
 * - Wrap router with configured UIProvider
 * 
 * **Constraints:**
 * - Does NOT import MUI directly
 * - Uses only UI library provider API
 * - Maintains clean separation of concerns
 */

import React, { useMemo } from 'react';
import { UIProvider } from '@sakhlaqi/ui';
import type { ThemeConfig, ThemeMode } from '@sakhlaqi/ui';
import { useTenantStore } from '../stores';
import type { TenantTheme } from '../types';

interface UiProviderBridgeProps {
  /** Children to wrap with configured UIProvider */
  children: React.ReactNode;
  /** Override provider (optional, for testing) */
  provider?: 'internal' | 'mui';
}

/**
 * Map tenant theme to UI library theme config
 * 
 * Converts tenant-specific theme structure to UIProvider theme format
 */
function mapTenantThemeToUITheme(
  tenantTheme: TenantTheme | undefined,
  mode: ThemeMode = 'light'
): ThemeConfig {
  if (!tenantTheme) {
    // Default theme when tenant config not loaded
    return {
      mode,
      primaryColor: mode === 'light' ? '#1976d2' : '#90caf9',
      secondaryColor: mode === 'light' ? '#dc004e' : '#f48fb1',
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      borderRadius: 8,
      spacing: 8,
    };
  }

  // Map tenant theme to UI library theme
  return {
    mode,
    primaryColor: tenantTheme.colors.primary,
    secondaryColor: tenantTheme.colors.secondary,
    fontFamily: tenantTheme.fonts.primary,
    borderRadius: parseSize(tenantTheme.borderRadius.md),
    spacing: parseSize(tenantTheme.spacing.md),
  };
}

/**
 * Parse CSS size value to number (e.g., "8px" -> 8, "1rem" -> 16)
 */
function parseSize(sizeValue: string): number {
  if (!sizeValue) return 8;
  
  // Remove units and parse
  const numericValue = parseFloat(sizeValue);
  
  // Handle rem (assume 16px base)
  if (sizeValue.includes('rem')) {
    return numericValue * 16;
  }
  
  // Handle px
  return numericValue;
}

/**
 * Detect preferred theme mode
 * 
 * Checks localStorage or system preference
 */
function getPreferredThemeMode(): ThemeMode {
  // 1. Check localStorage
  const storedMode = localStorage.getItem('theme-mode');
  if (storedMode === 'light' || storedMode === 'dark') {
    return storedMode;
  }

  // 2. Check system preference
  if (typeof window !== 'undefined' && window.matchMedia) {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) return 'dark';
  }

  // 3. Default to light
  return 'light';
}

/**
 * UI Provider Bridge Component
 * 
 * Wraps children with UIProvider configured from tenant settings.
 * 
 * @example
 * ```tsx
 * // In App.tsx
 * <UiProviderBridge>
 *   <BrowserRouter>
 *     <Routes>...</Routes>
 *   </BrowserRouter>
 * </UiProviderBridge>
 * ```
 */
export const UiProviderBridge: React.FC<UiProviderBridgeProps> = ({
  children,
  provider = 'mui',
}) => {
  const { config } = useTenantStore();

  // Determine theme mode
  const themeMode = useMemo(() => {
    return getPreferredThemeMode();
  }, []);

  // Map tenant theme to UI library theme
  const uiTheme = useMemo(() => {
    return mapTenantThemeToUITheme(config?.theme, themeMode);
  }, [config?.theme, themeMode]);

  // Log theme configuration in development
  if (import.meta.env.MODE === 'development' && config) {
    console.log('[UiProviderBridge] Tenant theme:', config.theme);
    console.log('[UiProviderBridge] UI library theme:', uiTheme);
  }

  // Render with UIProvider
  // The UIProvider handles MUI theme creation internally
  return (
    <UIProvider
      defaultProvider={provider}
      defaultTheme={uiTheme}
    >
      {children}
    </UIProvider>
  );
};

export default UiProviderBridge;
