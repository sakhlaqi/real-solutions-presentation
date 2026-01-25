/**
 * Tenant Configuration Types
 * Defines the shape of tenant-specific configuration and branding
 */

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

export interface TenantLayoutPreferences {
  headerStyle?: 'default' | 'minimal' | 'full';
  footerStyle?: 'default' | 'minimal' | 'full';
  landingPageLayout?: 'single' | 'multi-section';
}

export interface LandingPageSection {
  id: string;
  componentType: string;
  order: number;
  visible: boolean;
  props: Record<string, any>;
  featureFlag?: string;
}

export interface TenantConfig {
  id: string;
  slug: string;
  name: string;
  branding: TenantBranding;
  theme: import('./theme').TenantThemeConfig;
  featureFlags: TenantFeatureFlags;
  layoutPreferences: TenantLayoutPreferences;
  landingPageSections: LandingPageSection[];
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
