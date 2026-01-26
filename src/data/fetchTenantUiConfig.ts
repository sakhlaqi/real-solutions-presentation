/**
 * Tenant UI Configuration Fetcher
 * 
 * Fetches tenant-specific page JSON configurations from the backend API.
 * Provides caching mechanism to avoid redundant API calls.
 */

import { apiClient } from '../api/client';
import { validatePageConfig, getValidationSummary } from '@sakhlaqi/ui';
import type { PageConfig } from '@sakhlaqi/ui';

/**
 * Tenant UI Configuration Response
 * 
 * API returns page configurations indexed by route path
 */
export interface TenantUiConfig {
  /** Page configurations mapped by route path */
  pages: Record<string, PageConfig>;
  
  /** Configuration version/timestamp (optional) */
  version?: string;
  
  /** Last updated timestamp (optional) */
  updatedAt?: string;
}

/**
 * Cache entry structure
 */
interface CacheEntry {
  config: TenantUiConfig;
  timestamp: number;
  tenantId: string;
}

/**
 * Cache store (in-memory)
 */
const configCache = new Map<string, CacheEntry>();

/**
 * Cache TTL (time-to-live) in milliseconds
 * Default: 5 minutes
 */
const CACHE_TTL = 5 * 60 * 1000;

/**
 * Fetch Tenant UI Configuration
 * 
 * Fetches page JSON configurations for a specific tenant from the API.
 * Implements per-tenant caching to minimize API calls.
 * 
 * **API Endpoint:**
 * ```
 * GET /api/v1/tenants/{tenantId}/config/
 * ```
 * 
 * **Response (page_config extracted):**
 * ```json
 * {
 *   "page_config": {
 *     "pages": {
 *       "/dashboard": { ... },
 *       "/employees": { ... },
 *       "/settings": { ... }
 *     },
 *     "version": "1.0.0"
 *   },
 *   "branding": { ... },
 *   "theme": { ... },
 *   "routes": [ ... ]
 * }
 * ```
 * 
 * **Caching Strategy:**
 * - Caches per tenant slug
 * - TTL: 5 minutes
 * - Manual cache invalidation supported
 * 
 * @param tenantSlug - The tenant slug to fetch configuration for
 * @param options - Optional configuration
 * @returns Promise resolving to tenant UI configuration
 * 
 * @example
 * ```typescript
 * const uiConfig = await fetchTenantUiConfig('acme-corp');
 * const dashboardConfig = uiConfig.pages['/dashboard'];
 * ```
 */
export async function fetchTenantUiConfig(
  tenantSlug: string,
  options: {
    /** Force bypass cache and fetch fresh data */
    skipCache?: boolean;
    /** Use public endpoint (no auth) */
    publicEndpoint?: boolean;
    /** Skip validation (not recommended) */
    skipValidation?: boolean;
  } = {}
): Promise<TenantUiConfig> {
  const { skipCache = false, publicEndpoint = false, skipValidation = false } = options;

  // Check cache first (unless skipCache is true)
  if (!skipCache) {
    const cached = getCachedConfig(tenantSlug);
    if (cached) {
      console.log(`[fetchTenantUiConfig] Cache hit for tenant: ${tenantSlug}`);
      return cached;
    }
  }

  // Fetch from API
  console.log(`[fetchTenantUiConfig] Fetching UI config for tenant: ${tenantSlug}`);
  
  try {
    // Fetch complete tenant config
    const fullConfig = publicEndpoint
      ? await apiClient.publicGet<{ page_config?: { pages: Record<string, PageConfig>; version?: string }; updated_at?: string }>(`/tenants/${tenantSlug}/config/`)
      : await apiClient.get<{ page_config?: { pages: Record<string, PageConfig>; version?: string }; updated_at?: string }>(`/tenants/${tenantSlug}/config/`);

    // Extract page_config from full config
    const config: TenantUiConfig = {
      pages: fullConfig.page_config?.pages || {},
      version: fullConfig.page_config?.version,
      updatedAt: fullConfig.updated_at,
    };

    // Validate page configurations if not skipped
    if (!skipValidation && config.pages) {
      validatePagesConfig(config.pages, tenantSlug);
    }

    // Cache the result
    setCachedConfig(tenantSlug, config);

    return config;
  } catch (error) {
    console.error(`[fetchTenantUiConfig] Failed to fetch UI config for tenant: ${tenantSlug}`, error);
    throw error;
  }
}

/**
 * Fetch Tenant UI Configuration by Slug
 * 
 * Convenience method that fetches by tenant slug instead of ID.
 * 
 * @param slug - The tenant slug
 * @param options - Optional configuration
 * @returns Promise resolving to tenant UI configuration
 * 
 * @example
 * ```typescript
 * const uiConfig = await fetchTenantUiConfigBySlug('acme');
 * ```
 */
export async function fetchTenantUiConfigBySlug(
  slug: string,
  options: {
    skipCache?: boolean;
    publicEndpoint?: boolean;
    skipValidation?: boolean;
  } = {}
): Promise<TenantUiConfig> {
  const { skipCache = false, publicEndpoint = false, skipValidation = false } = options;

  // Use slug as cache key for slug-based fetches
  const cacheKey = `slug:${slug}`;
  
  // Check cache
  if (!skipCache) {
    const cached = getCachedConfig(cacheKey);
    if (cached) {
      console.log(`[fetchTenantUiConfigBySlug] Cache hit for slug: ${slug}`);
      return cached;
    }
  }

  // Fetch from API
  console.log(`[fetchTenantUiConfigBySlug] Fetching UI config for slug: ${slug}`);
  
  try {
    // Fetch complete tenant config
    const fullConfig = publicEndpoint
      ? await apiClient.publicGet<{ page_config?: { pages: Record<string, PageConfig>; version?: string }; updated_at?: string }>(`/tenants/${slug}/config/`)
      : await apiClient.get<{ page_config?: { pages: Record<string, PageConfig>; version?: string }; updated_at?: string }>(`/tenants/${slug}/config/`);

    // Extract page_config from full config
    const config: TenantUiConfig = {
      pages: fullConfig.page_config?.pages || {},
      version: fullConfig.page_config?.version,
      updatedAt: fullConfig.updated_at,
    };

    // Validate page configurations if not skipped
    if (!skipValidation && config.pages) {
      validatePagesConfig(config.pages, `slug:${slug}`);
    }

    // Cache the result
    setCachedConfig(cacheKey, config);

    return config;
  } catch (error) {
    console.error(`[fetchTenantUiConfigBySlug] Failed to fetch UI config for slug: ${slug}`, error);
    throw error;
  }
}

/**
 * Get specific page configuration
 * 
 * @param tenantSlug - The tenant slug
 * @param pagePath - The page route path (e.g., "/dashboard")
 * @param options - Optional configuration
 * @returns Promise resolving to page configuration or null if not found
 * 
 * @example
 * ```typescript
 * const dashboardConfig = await getPageConfig('acme-corp', '/dashboard');
 * ```
 */
export async function getPageConfig(
  tenantSlug: string,
  pagePath: string,
  options?: {
    skipCache?: boolean;
    publicEndpoint?: boolean;
    skipValidation?: boolean;
  }
): Promise<PageConfig | null> {
  const uiConfig = await fetchTenantUiConfig(tenantSlug, options);
  return uiConfig.pages[pagePath] || null;
}

/**
 * Validate all page configurations
 * 
 * Validates each page configuration in the tenant UI config.
 * Throws an error if any page configuration is invalid.
 * 
 * @param pages - Pages object from tenant UI config
 * @param tenantId - Tenant ID for error messages
 * @throws {Error} If any page configuration is invalid
 */
function validatePagesConfig(pages: Record<string, PageConfig>, tenantId: string): void {
  const errors: Array<{ page: string; errors: string }> = [];

  for (const [pagePath, pageConfig] of Object.entries(pages)) {
    const validationResult = validatePageConfig(pageConfig);
    
    if (!validationResult.success) {
      const errorSummary = getValidationSummary(validationResult.errors || []);
      errors.push({
        page: pagePath,
        errors: errorSummary,
      });
    }
  }

  if (errors.length > 0) {
    const errorMessage = errors
      .map(({ page, errors }) => `  - ${page}:\n    ${errors.replace(/\n/g, '\n    ')}`)
      .join('\n\n');
    
    throw new Error(
      `Page configuration validation failed for tenant "${tenantId}":\n\n${errorMessage}\n\nPlease check the API response and ensure all page configurations match the expected schema.`
    );
  }

  console.log(`[validatePagesConfig] All page configurations valid for tenant: ${tenantId}`);
}

/**
 * Get cached configuration (if valid)
 */
function getCachedConfig(tenantId: string): TenantUiConfig | null {
  const cached = configCache.get(tenantId);
  
  if (!cached) {
    return null;
  }

  // Check if cache is expired
  const now = Date.now();
  const age = now - cached.timestamp;
  
  if (age > CACHE_TTL) {
    console.log(`[getCachedConfig] Cache expired for tenant: ${tenantId}`);
    configCache.delete(tenantId);
    return null;
  }

  return cached.config;
}

/**
 * Set cached configuration
 */
function setCachedConfig(tenantId: string, config: TenantUiConfig): void {
  configCache.set(tenantId, {
    config,
    timestamp: Date.now(),
    tenantId,
  });
  console.log(`[setCachedConfig] Cached config for tenant: ${tenantId}`);
}

/**
 * Clear cache for specific tenant
 * 
 * @param tenantId - The tenant ID to clear cache for
 * 
 * @example
 * ```typescript
 * clearTenantCache('tenant-123');
 * ```
 */
export function clearTenantCache(tenantId: string): void {
  configCache.delete(tenantId);
  console.log(`[clearTenantCache] Cleared cache for tenant: ${tenantId}`);
}

/**
 * Clear all cached configurations
 * 
 * @example
 * ```typescript
 * clearAllCache();
 * ```
 */
export function clearAllCache(): void {
  configCache.clear();
  console.log('[clearAllCache] Cleared all UI config cache');
}

/**
 * Get cache statistics
 * 
 * @returns Cache statistics
 */
export function getCacheStats(): {
  size: number;
  tenants: string[];
} {
  return {
    size: configCache.size,
    tenants: Array.from(configCache.keys()),
  };
}

/**
 * Export for testing/debugging
 */
export const __internal = {
  configCache,
  CACHE_TTL,
  getCachedConfig,
  setCachedConfig,
};
