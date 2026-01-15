/**
 * Tenant Configuration Types
 * Defines the shape of tenant-specific configuration and branding
 */

export interface TenantTheme {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: {
      primary: string;
      secondary: string;
      inverse: string;
    };
    error: string;
    success: string;
    warning: string;
  };
  fonts: {
    primary: string;
    secondary: string;
    sizes: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
    };
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    full: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
  };
}

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
  theme: TenantTheme;
  featureFlags: TenantFeatureFlags;
  layoutPreferences: TenantLayoutPreferences;
  landingPageSections: LandingPageSection[];
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
