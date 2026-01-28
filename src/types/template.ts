/**
 * Template Type Contracts (Phase 0A)
 * 
 * FROZEN: These contracts are immutable and shared across all repos.
 * Any changes require a new schema version.
 * 
 * Templates behave exactly like Themes:
 * - Presets stored in DB as JSON
 * - Tenants can select preset or fork/customize
 * - Runtime resolution merges preset + tenant overrides
 */

/**
 * Template Metadata
 * 
 * Lightweight template information (list view).
 */
export interface TemplateMetadata {
  /** Unique template identifier (UUID) */
  id: string;
  
  /** Human-readable template name */
  name: string;
  
  /** Template description */
  description?: string;
  
  /** Template version (semver) */
  version: string;
  
  /** Whether this is an official preset */
  is_preset: boolean;
  
  /** Whether this template is read-only (presets are always read-only) */
  is_read_only: boolean;
  
  /** Business category (for filtering/search) */
  category?: TemplateCategory;
  
  /** Template tags */
  tags?: string[];
  
  /** Preview/thumbnail image URL */
  preview_image?: string;
  
  /** Created timestamp */
  created_at: string;
  
  /** Updated timestamp */
  updated_at: string;
}

/**
 * Template Categories
 * 
 * Business-oriented categories for template classification.
 */
export type TemplateCategory =
  | 'landing'        // Landing pages
  | 'marketing'      // Marketing pages (about, services, etc.)
  | 'blog'           // Blog/content pages
  | 'dashboard'      // Application dashboards
  | 'auth'           // Authentication pages
  | 'ecommerce'      // E-commerce pages
  | 'portfolio'      // Portfolio/showcase
  | 'docs'           // Documentation
  | 'custom';        // Custom templates

/**
 * Template Tier
 * 
 * Determines template availability based on tenant subscription.
 * This is a classification field only - NOT coupled to billing logic.
 */
export type TemplateTier =
  | 'free'           // Available to all tenants
  | 'premium'        // Requires premium subscription
  | 'enterprise'     // Enterprise-only templates
  | 'custom';        // Custom/private templates

/**
 * Page Definition (Schema)
 * 
 * Defines a single page within a template.
 * Specifies layout template and sections to render.
 */
export interface PageDefinition {
  /** Page identifier (e.g., 'home', 'about', 'contact') */
  id: string;
  
  /** Page title */
  title: string;
  
  /** Page description (meta) */
  description?: string;
  
  /** Layout template type */
  layout: {
    /** Layout component type (e.g., 'landing-basic', 'marketing-layout') */
    type: string;
    /** Layout version */
    version?: string;
    /** Layout-specific props */
    props?: Record<string, unknown>;
  };
  
  /** Page sections (ordered) */
  sections: PageSectionReference[];
  
  /** Page metadata */
  metadata?: {
    /** Meta title (SEO) */
    metaTitle?: string;
    /** Meta description (SEO) */
    metaDescription?: string;
    /** Open Graph image */
    ogImage?: string;
    /** Additional meta tags */
    [key: string]: unknown;
  };
}

/**
 * Page Section Reference
 * 
 * Reference to a section with instance-specific props.
 */
export interface PageSectionReference {
  /** Unique instance ID within the page */
  id: string;
  
  /** Section type (e.g., 'hero-simple', 'features-grid') */
  type: string;
  
  /** Section version */
  version?: string;
  
  /** Section props (merged with section defaults) */
  props?: Record<string, unknown>;
}

/**
 * Template Preset (Complete)
 * 
 * Full template definition including all pages.
 * This is the JSON structure stored in the database.
 */
export interface TemplatePreset {
  /** Template metadata */
  meta: {
    id: string;
    name: string;
    description?: string;
    version: string;
    author?: string;
    category: TemplateCategory;
    tier: TemplateTier;
    tags?: string[];
    previewImage?: string;
  };
  
  /** Page definitions */
  pages: {
    /** Page key -> Page definition */
    [pageKey: string]: PageDefinition;
  };
  
  /** Optional: Associated theme preset ID */
  theme_preset_id?: string;
  
  /** Optional: Template-level metadata */
  metadata?: {
    /** Business industry */
    industry?: string;
    /** Use cases */
    useCases?: string[];
    /** Demo URL */
    demoUrl?: string;
    /** Documentation URL */
    docsUrl?: string;
    [key: string]: unknown;
  };
}

/**
 * Template Override (JSON Diff)
 * 
 * Tenant-specific modifications to a preset template.
 * Only modified fields are stored.
 */
export interface TemplateOverride {
  /** Modified metadata */
  meta?: Partial<TemplatePreset['meta']>;
  
  /** Page modifications (partial page definitions) */
  pages?: {
    [pageKey: string]: Partial<PageDefinition>;
  };
  
  /** Theme override ID (if tenant customized theme) */
  theme_preset_id?: string;
  
  /** Additional metadata overrides */
  metadata?: Record<string, unknown>;
}

/**
 * Resolved Template
 * 
 * Final template after merging preset + tenant overrides.
 * This is what gets rendered at runtime.
 */
export interface ResolvedTemplate extends TemplatePreset {
  /** Applied overrides (for debugging/tracking) */
  appliedOverrides?: TemplateOverride;
  
  /** Base preset info (if this is a customized template) */
  basePreset?: {
    id: string;
    name: string;
    version: string;
  };
}

/**
 * Template Inheritance Info
 * 
 * Information about template inheritance (for API responses).
 */
export interface TemplateInheritanceInfo {
  base_preset: {
    id: string;
    name: string;
    version: string;
  };
  has_overrides: boolean;
  override_count?: number;
}

/**
 * Template Selection
 * 
 * Tenant's template choice (stored in Tenant model).
 */
export interface TemplateSelection {
  /** Selected template ID (preset or custom) */
  template_id: string;
  
  /** Template version */
  version?: string;
}

/**
 * Full Template Data (API Response)
 * 
 * Complete template with metadata and JSON.
 */
export interface TemplateData extends TemplateMetadata {
  /** Full template JSON */
  template_json?: TemplatePreset;
  
  /** Base preset ID (if customized) */
  base_preset?: string | null;
  
  /** Template overrides (if customized) */
  template_overrides?: TemplateOverride;
  
  /** Resolved template (preset + overrides merged) */
  resolved_template_json: TemplatePreset;
  
  /** Inheritance info */
  inheritance_info?: TemplateInheritanceInfo | null;
}

/**
 * Create Template Request
 * 
 * Request body for creating a new template.
 */
export interface CreateTemplateRequest {
  name: string;
  version?: string;
  category: TemplateCategory;
  tier?: TemplateTier;
  base_preset?: string;  // Template ID to extend
  template_overrides?: TemplateOverride;
  template_json?: TemplatePreset;  // For standalone templates
}

/**
 * Clone Template Request
 * 
 * Request body for cloning an existing template.
 */
export interface CloneTemplateRequest {
  name: string;
  version?: string;
  template_overrides?: TemplateOverride;
}

/**
 * Type alias for PageDefinition used in page rendering
 */
export type TemplatePage = PageDefinition;
