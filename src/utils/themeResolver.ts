/**
 * Theme Resolver
 * 
 * Resolves and validates tenant themes at runtime.
 * Merges base theme with active modes and validates against schema.
 * 
 * **Resilience:**
 * - Handles missing modes gracefully
 * - Validates schema with detailed error logging
 * - Never crashes - always returns a result
 */

import type { Theme, AppliedTheme, DesignTokens } from '@sakhlaqi/ui/theme';
import { applyThemeMode, mergeTokens, validateThemeSafe } from '@sakhlaqi/ui';

/**
 * Logger utility for theme resolution
 */
const logger = {
  warn: (message: string, data?: any) => {
    console.warn(`[ThemeResolver] ${message}`, data || '');
  },
  error: (message: string, data?: any) => {
    console.error(`[ThemeResolver] ${message}`, data || '');
  },
  info: (message: string, data?: any) => {
    console.info(`[ThemeResolver] ${message}`, data || '');
  },
};

/**
 * Resolved theme cache
 * Stores resolved themes in memory to avoid redundant processing
 */
class ThemeResolverCache {
  private cache = new Map<string, AppliedTheme>();

  get(key: string): AppliedTheme | undefined {
    return this.cache.get(key);
  }

  set(key: string, theme: AppliedTheme): void {
    this.cache.set(key, theme);
  }

  clear(): void {
    this.cache.clear();
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }

  getCacheKey(themeId: string, modes: string[]): string {
    return `${themeId}:${modes.sort().join(',')}`;
  }
}

const cache = new ThemeResolverCache();

/**
 * Theme Resolution Result
 */
export interface ThemeResolutionResult {
  success: boolean;
  appliedTheme?: AppliedTheme;
  error?: string;
  validationErrors?: string[];
}

/**
 * Theme Resolver Options
 */
export interface ThemeResolverOptions {
  /**
   * Skip validation (use for performance in production)
   * Default: false
   */
  skipValidation?: boolean;

  /**
   * Use cache (prevents redundant processing)
   * Default: true
   */
  useCache?: boolean;

  /**
   * Clear cache before resolving
   * Default: false
   */
  clearCache?: boolean;
}

/**
 * Theme Resolver
 * 
 * Central utility for resolving themes with modes.
 */
export class ThemeResolver {
  /**
   * Resolve theme with active modes
   * 
   * Merges base theme tokens with mode overrides and validates the result.
   * 
   * **Fallback Behavior:**
   * - Invalid modes: Logged and skipped, continues with valid modes
   * - Validation failures: Returns base theme with warning
   * - Missing theme: Returns error, caller should use default
   * - Empty modes: Returns base theme (valid scenario)
   * 
   * @param theme - Base theme from API
   * @param activeModes - Array of mode names to apply (e.g., ['dark', 'compact'])
   * @param options - Resolution options
   * @returns Resolved theme result
   * 
   * @example
   * ```typescript
   * const result = ThemeResolver.resolve(theme, ['dark']);
   * if (result.success) {
   *   // Use result.appliedTheme
   * } else {
   *   // Fallback to default theme
   * }
   * ```
   */
  static resolve(
    theme: Theme,
    activeModes: string[] = [],
    options: ThemeResolverOptions = {}
  ): ThemeResolutionResult {
    const {
      skipValidation = false,
      useCache = true,
      clearCache = false,
    } = options;

    // Clear cache if requested
    if (clearCache) {
      cache.clear();
      logger.info('Cache cleared');
    }

    // Validate input theme exists
    if (!theme) {
      logger.error('Theme resolution failed: Theme is null or undefined');
      return {
        success: false,
        error: 'Theme is required for resolution',
      };
    }

    // Validate theme has required structure
    if (!theme.meta || !theme.tokens) {
      logger.error('Theme resolution failed: Invalid theme structure', {
        hasMeta: !!theme.meta,
        hasTokens: !!theme.tokens,
      });
      return {
        success: false,
        error: 'Theme must have meta and tokens properties',
      };
    }

    // Check cache
    const cacheKey = cache.getCacheKey(theme.meta.id, activeModes);
    if (useCache && cache.has(cacheKey)) {
      logger.info('Cache hit', { themeId: theme.meta.id, modes: activeModes });
      return {
        success: true,
        appliedTheme: cache.get(cacheKey)!,
      };
    }

    try {
      // Validate base theme (unless skipped)
      if (!skipValidation) {
        const validation = validateThemeSafe(theme);
        if (!validation.success) {
          logger.error('Base theme validation failed', {
            themeId: theme.meta.id,
            errors: validation.error?.issues.map((e: any) => e.message) || [],
          });
          return {
            success: false,
            error: 'Invalid base theme',
            validationErrors: validation.error?.issues.map((e: any) => e.message) || [],
          };
        }
      }

      // No modes - return base theme (valid scenario)
      if (activeModes.length === 0) {
        const appliedTheme: AppliedTheme = {
          theme,
          mode: undefined,
          tokens: theme.tokens,
        };

        if (useCache) {
          cache.set(cacheKey, appliedTheme);
        }

        logger.info('Theme resolved (no modes)', { themeId: theme.meta.id });
        return {
          success: true,
          appliedTheme,
        };
      }

      // Single mode - use applyThemeMode utility
      if (activeModes.length === 1) {
        const modeName = activeModes[0];
        
        // Check if mode exists
        if (!theme.modes || !theme.modes[modeName]) {
          logger.warn(`Mode "${modeName}" not found in theme, using base theme`, {
            themeId: theme.meta.id,
            availableModes: Object.keys(theme.modes || {}),
          });
          
          // Fallback to base theme
          const appliedTheme: AppliedTheme = {
            theme,
            mode: undefined,
            tokens: theme.tokens,
          };
          
          if (useCache) {
            cache.set(cacheKey, appliedTheme);
          }
          
          return {
            success: true,
            appliedTheme,
          };
        }
        
        const appliedTheme = applyThemeMode(theme, modeName);

        if (useCache) {
          cache.set(cacheKey, appliedTheme);
        }

        logger.info('Theme resolved (single mode)', {
          themeId: theme.meta.id,
          mode: modeName,
        });
        return {
          success: true,
          appliedTheme,
        };
      }

      // Multiple modes - merge sequentially
      let mergedTokens: DesignTokens = theme.tokens;
      const appliedModes: string[] = [];
      const skippedModes: string[] = [];

      for (const modeName of activeModes) {
        const mode = theme.modes?.[modeName];
        if (!mode) {
          logger.warn(`Mode "${modeName}" not found in theme, skipping`, {
            themeId: theme.meta.id,
            availableModes: Object.keys(theme.modes || {}),
          });
          skippedModes.push(modeName);
          continue;
        }

        mergedTokens = mergeTokens(mergedTokens, mode.tokens);
        appliedModes.push(modeName);
      }

      // If no valid modes were applied, return base theme
      if (appliedModes.length === 0) {
        logger.warn('No valid modes found, using base theme', {
          themeId: theme.meta.id,
          requestedModes: activeModes,
          skippedModes,
        });
        
        const appliedTheme: AppliedTheme = {
          theme,
          mode: undefined,
          tokens: theme.tokens,
        };
        
        if (useCache) {
          cache.set(cacheKey, appliedTheme);
        }
        
        return {
          success: true,
          appliedTheme,
        };
      }

      const appliedTheme: AppliedTheme = {
        theme,
        mode: appliedModes.join('+'), // e.g., "dark+compact"
        tokens: mergedTokens,
      };

      // Validate merged result (unless skipped)
      if (!skipValidation) {
        // Create a temporary theme for validation
        const validationTheme: Theme = {
          ...theme,
          tokens: mergedTokens,
        };

        const validation = validateThemeSafe(validationTheme);
        if (!validation.success) {
          logger.error('Merged theme validation failed, using base theme', {
            themeId: theme.meta.id,
            appliedModes,
            errors: validation.error?.issues.map((e: any) => e.message) || [],
          });
          
          // Fallback to base theme on validation failure
          const fallbackTheme: AppliedTheme = {
            theme,
            mode: undefined,
            tokens: theme.tokens,
          };
          
          if (useCache) {
            cache.set(cacheKey, fallbackTheme);
          }
          
          return {
            success: true, // Still successful, but with fallback
            appliedTheme: fallbackTheme,
          };
        }
      }

      if (useCache) {
        cache.set(cacheKey, appliedTheme);
      }

      logger.info('Theme resolved (multiple modes)', {
        themeId: theme.meta.id,
        appliedModes,
        skippedModes: skippedModes.length > 0 ? skippedModes : undefined,
      });

      return {
        success: true,
        appliedTheme,
      };
    } catch (error) {
      logger.error('Unexpected error during theme resolution', {
        themeId: theme.meta?.id,
        error: error instanceof Error ? error.message : String(error),
      });
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error during theme resolution',
      };
    }
  }

  /**
   * Clear the resolution cache
   */
  static clearCache(): void {
    cache.clear();
  }

  /**
   * Get cache statistics (for debugging)
   */
  static getCacheStats(): { size: number; keys: string[] } {
    return {
      size: cache['cache'].size,
      keys: Array.from(cache['cache'].keys()),
    };
  }
}

export default ThemeResolver;
