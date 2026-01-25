/**
 * Theme API Service
 * Handles all theme-related API calls
 */

import { apiClient } from './client';

// Type definition for design tokens (matches @real-solutions/ui)
type DesignTokens = Record<string, any>;

/**
 * Inheritance information for custom themes
 */
export interface ThemeInheritanceInfo {
  base_preset: {
    id: string;
    name: string;
    version: string;
  };
  has_overrides: boolean;
  override_count?: number;
}

/**
 * Theme metadata (lightweight)
 */
export interface ThemeMetadata {
  id: string;
  name: string;
  description?: string;
  version: string;
  is_preset: boolean;
  is_read_only: boolean;
  category?: string;
  supported_modes?: string[];
  created_at: string;
  updated_at: string;
  based_on?: {
    id: string;
    name: string;
    version: string;
  };
  has_overrides?: boolean;
}

/**
 * Full theme with JSON data
 */
export interface ThemeData extends ThemeMetadata {
  theme_json?: {
    meta: any;
    tokens: any;
    modes?: any;
  };
  base_preset?: string | null;
  token_overrides?: Partial<DesignTokens>;
  resolved_theme_json: {
    meta: any;
    tokens: DesignTokens;
    modes?: any;
  };
  inheritance_info?: ThemeInheritanceInfo | null;
}

/**
 * Request body for creating custom theme
 */
export interface CreateThemeRequest {
  name: string;
  version?: string;
  base_preset?: string;  // Theme ID to extend
  token_overrides?: Partial<DesignTokens>;
  theme_json?: any;  // For standalone themes
}

/**
 * Request body for cloning theme
 */
export interface CloneThemeRequest {
  name: string;
  version?: string;
  token_overrides?: Partial<DesignTokens>;
}

/**
 * Request body for updating theme
 */
export interface UpdateThemeRequest {
  name?: string;
  version?: string;
  token_overrides?: Partial<DesignTokens>;
  theme_json?: any;
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

  /**
   * Create a new custom theme
   * Requires authentication
   * 
   * @param data - Theme creation data
   * @returns Created theme
   */
  static async createTheme(data: CreateThemeRequest): Promise<ThemeData> {
    return apiClient.post('/themes/', data);
  }

  /**
   * Clone an existing theme (preset or custom)
   * Creates a new custom theme based on the source theme
   * Requires authentication
   * 
   * @param sourceThemeId - ID of theme to clone
   * @param data - Clone configuration
   * @returns Cloned theme
   */
  static async cloneTheme(
    sourceThemeId: string,
    data: CloneThemeRequest
  ): Promise<ThemeData> {
    return apiClient.post(`/themes/${sourceThemeId}/clone/`, data);
  }

  /**
   * Update an existing custom theme
   * Requires authentication
   * 
   * @param themeId - ID of theme to update
   * @param data - Update data
   * @returns Updated theme
   */
  static async updateTheme(
    themeId: string,
    data: UpdateThemeRequest
  ): Promise<ThemeData> {
    return apiClient.patch(`/themes/${themeId}/`, data);
  }

  /**
   * Delete a custom theme
   * Requires authentication
   * 
   * @param themeId - ID of theme to delete
   */
  static async deleteTheme(themeId: string): Promise<void> {
    return apiClient.delete(`/themes/${themeId}/`);
  }

  /**
   * Helper: Create custom theme from preset with overrides
   * 
   * @param presetId - ID of preset to extend
   * @param name - Name for custom theme
   * @param overrides - Token overrides
   * @returns Created theme
   */
  static async createFromPreset(
    presetId: string,
    name: string,
    overrides: Partial<DesignTokens>
  ): Promise<ThemeData> {
    return this.cloneTheme(presetId, {
      name,
      version: '1.0.0',
      token_overrides: overrides,
    });
  }
}

export default ThemeService;
