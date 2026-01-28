/**
 * Section Type Contracts (Phase 0A)
 * 
 * FROZEN: These contracts are immutable and shared across all repos.
 * Any changes require a new schema version.
 * 
 * Sections are the building blocks of pages.
 * Each section is a JSON blueprint with schema validation.
 */

/**
 * Section Categories
 * 
 * Organized by functional purpose.
 */
export type SectionCategory =
  | 'hero'           // Hero sections (primary page headers)
  | 'features'       // Feature showcases
  | 'pricing'        // Pricing tables/cards
  | 'testimonials'   // Customer testimonials
  | 'cta'            // Call-to-action sections
  | 'footer'         // Page footers
  | 'header'         // Page headers/navigation
  | 'content'        // General content sections
  | 'gallery'        // Image/media galleries
  | 'team'           // Team member showcases
  | 'blog'           // Blog/article sections
  | 'contact'        // Contact forms/info
  | 'faq'            // FAQ sections
  | 'stats'          // Statistics/metrics
  | 'logos'          // Logo collections
  | 'auth'           // Authentication sections
  | 'dashboard'      // Dashboard sections
  | 'checkout'       // E-commerce checkout
  | 'profile'        // User profile sections
  | 'settings'       // Settings sections
  | 'notifications'  // Notification sections
  | 'custom';        // Custom sections

/**
 * Section Metadata
 * 
 * Lightweight section information.
 */
export interface SectionMetadata {
  /** Unique section identifier */
  id: string;
  
  /** Human-readable name */
  name: string;
  
  /** Section category */
  category: SectionCategory;
  
  /** Section version (semver) */
  version: string;
  
  /** Description */
  description?: string;
  
  /** Tags for search/filtering */
  tags?: string[];
  
  /** Preview/thumbnail URL */
  preview_image?: string;
}

/**
 * Section Slot Definition
 * 
 * Defines an editable slot within a section.
 */
export interface SectionSlot {
  /** Slot type */
  type: 'text' | 'richtext' | 'media' | 'button' | 'array' | 'object';
  
  /** Whether this slot is editable */
  editable: boolean;
  
  /** Whether this slot is optional */
  optional?: boolean;
  
  /** Maximum length (for text/richtext) */
  maxLength?: number;
  
  /** Allowed file types (for media) */
  allowedTypes?: string[];
  
  /** Array item type (for arrays) */
  itemType?: SectionSlot;
  
  /** Object properties (for objects) */
  properties?: Record<string, SectionSlot>;
}

/**
 * Section Layout Configuration
 * 
 * Defines responsive layout behavior.
 */
export interface SectionLayout {
  /** Container type */
  container?: 'centered' | 'full' | 'narrow' | 'wide';
  
  /** Maximum width */
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | number;
  
  /** Spacing configuration */
  spacing?: {
    /** Padding (top/bottom) */
    py?: {
      xs?: number;
      sm?: number;
      md?: number;
      lg?: number;
      xl?: number;
    };
    /** Padding (left/right) */
    px?: {
      xs?: number;
      sm?: number;
      md?: number;
      lg?: number;
      xl?: number;
    };
  };
  
  /** Grid configuration (if applicable) */
  grid?: {
    columns?: {
      xs?: number;
      sm?: number;
      md?: number;
      lg?: number;
      xl?: number;
    };
    gap?: number;
  };
}

/**
 * Section JSON Schema
 * 
 * JSON Schema for validating section props.
 */
export interface SectionJsonSchema {
  type: 'object';
  properties: Record<string, {
    type: string;
    description?: string;
    enum?: string[];
    properties?: Record<string, unknown>;
    items?: unknown;
    [key: string]: unknown;
  }>;
  required?: string[];
  additionalProperties?: boolean;
}

/**
 * Section Definition (Blueprint)
 * 
 * Complete section definition as stored in JSON files.
 * This is the source of truth for sections.
 */
export interface SectionDefinition {
  /** Unique section ID */
  id: string;
  
  /** Section name */
  name: string;
  
  /** Section category */
  category: SectionCategory;
  
  /** Section version */
  version: string;
  
  /** Description */
  description?: string;
  
  /** Tags */
  tags?: string[];
  
  /** Preview image URL */
  previewImage?: string;
  
  /** JSON Schema for props validation */
  schema: SectionJsonSchema;
  
  /** Default props */
  defaultProps: Record<string, unknown>;
  
  /** Editable slots */
  slots?: Record<string, SectionSlot>;
  
  /** Layout configuration */
  layout?: SectionLayout;
  
  /** Required theme tokens */
  requiredTokens?: string[];
  
  /** Component dependencies */
  dependencies?: string[];
  
  /** Example configurations */
  examples?: Array<{
    name: string;
    description?: string;
    props: Record<string, unknown>;
  }>;
}

/**
 * Section Instance
 * 
 * An instance of a section with specific props.
 * Used in page definitions.
 */
export interface SectionInstance {
  /** Unique instance ID within the page */
  id: string;
  
  /** Section type (references SectionDefinition.id) */
  type: string;
  
  /** Section version */
  version?: string;
  
  /** Instance props (merged with defaultProps) */
  props?: Record<string, unknown>;
  
  /** Visibility conditions */
  visible?: boolean | {
    featureFlag?: string;
    userRole?: string[];
    subscription?: string[];
  };
}

/**
 * Section Override
 * 
 * Tenant-specific modifications to a section instance.
 */
export interface SectionOverride {
  /** Modified props */
  props?: Record<string, unknown>;
  
  /** Visibility override */
  visible?: boolean | {
    featureFlag?: string;
    userRole?: string[];
    subscription?: string[];
  };
}

/**
 * Resolved Section
 * 
 * Final section after merging definition + instance props + overrides.
 */
export interface ResolvedSection extends SectionInstance {
  /** Section definition (for reference) */
  definition: SectionDefinition;
  
  /** Final merged props */
  resolvedProps: Record<string, unknown>;
  
  /** Applied overrides (for debugging) */
  appliedOverrides?: SectionOverride;
}
