/**
 * Tenant Theme Context
 * 
 * React Context for tenant theme management.
 */

import { createContext } from 'react';
import type { AppliedTheme, Theme } from '@sakhlaqi/ui/theme';

/**
 * Theme Context Value
 */
export interface TenantThemeContextValue {
  /**
   * Resolved theme with merged tokens
   */
  resolvedTheme: AppliedTheme | null;

  /**
   * Active theme modes
   */
  activeModes: string[];

  /**
   * Base theme (before mode application)
   */
  baseTheme: Theme | null;

  /**
   * Whether theme is loading
   */
  isLoading: boolean;

  /**
   * Theme resolution error
   */
  error: string | null;

  /**
   * Whether using legacy theme format
   */
  isLegacy: boolean;
}

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
 * Theme Context
 */
export const TenantThemeContext = createContext<TenantThemeContextValue>(defaultContextValue);
