/**
 * Tenant Configuration Utilities
 * 
 * Handles fetching tenant config from API and applying UI defaults
 * when backend returns null/empty values.
 */

import {
  applyDefaultTheme,
  applyDefaultRoutes,
  applyDefaultPages,
  type DefaultTheme,
  type DefaultRoute,
  type DefaultPage,
} from '@sakhlaqi/ui';

export interface TenantConfig {
  id: string;
  name: string;
  slug: string;
  is_active: boolean;
  branding: {
    name: string;
    tagline: string;
    logo: { light: string; dark: string };
    favicon: string;
  };
  theme: DefaultTheme | null;
  feature_flags: Record<string, boolean>;
  routes: DefaultRoute[];
  page_config: {
    pages: Record<string, DefaultPage> | null;
    version: string | null;
    template_id: string | null;
    template_name: string | null;
  };
  created_at: string;
  updated_at: string;
}

export interface ResolvedTenantConfig extends Omit<TenantConfig, 'theme' | 'routes' | 'page_config'> {
  theme: DefaultTheme;
  routes: DefaultRoute[];
  page_config: {
    pages: Record<string, DefaultPage>;
    version: string;
    template_id: string | null;
    template_name: string | null;
  };
}

/**
 * Fetch tenant configuration from API
 */
export async function fetchTenantConfig(slug: string): Promise<TenantConfig> {
  const response = await fetch(`/api/v1/tenants/${slug}/config`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch tenant config: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Resolve tenant configuration by applying UI defaults where needed
 * 
 * This is the key function - it takes the raw API response and ensures
 * all fields have sensible defaults from the UI library.
 */
export function resolveTenantConfig(config: TenantConfig): ResolvedTenantConfig {
  return {
    ...config,
    // Apply default theme if API returns null
    theme: applyDefaultTheme(config.theme),
    
    // Apply default routes if API returns empty array
    routes: applyDefaultRoutes(config.routes),
    
    // Apply default pages if API returns null
    page_config: {
      pages: applyDefaultPages(config.page_config.pages, config.name),
      version: config.page_config.version || '1.0.0',
      template_id: config.page_config.template_id,
      template_name: config.page_config.template_name,
    },
  };
}

/**
 * Fetch and resolve tenant configuration in one call
 * 
 * Usage:
 * ```ts
 * const config = await getTenantConfig('acme-corp');
 * // config.theme is guaranteed to exist (either from API or defaults)
 * // config.routes is guaranteed to have at least default routes
 * // config.page_config.pages is guaranteed to exist
 * ```
 */
export async function getTenantConfig(slug: string): Promise<ResolvedTenantConfig> {
  const rawConfig = await fetchTenantConfig(slug);
  return resolveTenantConfig(rawConfig);
}
