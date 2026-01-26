/**
 * Tenant Configuration Types
 * Defines the shape of tenant-specific configuration and branding
 */

import type { PageConfig } from '@sakhlaqi/ui';

export interface TenantBranding {
  name: string;
  logo: {
    light: string;
    dark: string;
  };
  favicon: string;
  tagline?: string;
  description?: string;
}

export interface TenantFeatureFlags {
  [key: string]: boolean;
}

export interface PageConfigWrapper {
  pages: Record<string, PageConfig>;
  version: string;
}

export interface TenantConfig {
  id: string;
  slug: string;
  name: string;
  branding: TenantBranding;
  theme: import('./theme').TenantThemeConfig;
  featureFlags: TenantFeatureFlags;
  page_config: PageConfigWrapper;
  routes?: import('./routing').RouteConfig[]; // Dynamic routes configuration
  customSettings?: Record<string, any>;
}

export interface Tenant {
  id: string;
  slug: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
