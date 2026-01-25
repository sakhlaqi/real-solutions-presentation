/**
 * Theme API Service
 * Handles all theme-related API calls
 */

import { apiClient } from './client';

/**
 * Theme metadata (lightweight)
 */
export interface ThemeMetadata {
  id: string;
  name: string;
  description: string;
  version: string;
  is_preset: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Full theme with JSON data
 */
export interface ThemeData extends ThemeMetadata {
  theme_json: {
    tokens: any;
    modes?: any[];
    metadata?: any;
  };
}

export class ThemeService {
  /**
   * Get all preset themes (lightweight list)
   * Public endpoint - no auth required
   */
  static async getPresets(): Promise<ThemeMetadata[]> {
    return apiClient.publicGet('/themes/presets/');
  }

  /**
   * Get all themes (presets + tenant custom)
   * Public endpoint for presets, authenticated for tenant themes
   */
  static async getThemes(): Promise<ThemeMetadata[]> {
    return apiClient.publicGet('/themes/');
  }

  /**
   * Get full theme by ID (including theme_json)
   * Public endpoint - no auth required for presets
   */
  static async getThemeById(themeId: string): Promise<ThemeData> {
    return apiClient.publicGet(`/themes/${themeId}/`);
  }
}

export default ThemeService;
