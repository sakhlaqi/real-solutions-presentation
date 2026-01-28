/**
 * Tenant Configuration Types
 * Defines the shape of tenant-specific configuration and branding
 */

import type { TemplatePage } from './template';

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
  pages: Record<string, TemplatePage>;
  version: string;
  template_id?: string | null;
  template_name?: string | null;
  template_category?: string;
}

export interface TenantConfig {
  id: string;
  slug: string;
  name: string;
  branding: TenantBranding;
  theme: import('./theme').TenantThemeConfig;
  template?: {
    template_id: string;
    version?: string;
  };
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
