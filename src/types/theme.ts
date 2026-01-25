/**
 * Theme Types (Extended)
 * 
 * Extended types for theme handling in Presentation app.
 * Includes API response types for tenant theme configuration.
 */

import type { Theme } from '@sakhlaqi/ui/theme';

/**
 * Theme metadata from API
 * Lightweight info about the theme (no full JSON)
 */
export interface ThemeMetadata {
  id: string;
  name: string;
  version: string;
  is_preset: boolean;
  category?: string;
  available_modes: string[];
  selected_modes: string[];
}

/**
 * Tenant theme configuration from API
 * Includes both metadata and full theme JSON
 */
export interface TenantThemeConfig {
  metadata: ThemeMetadata;
  json: Theme;
}
