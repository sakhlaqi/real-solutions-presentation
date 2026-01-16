/**
 * Component Library - Main Export
 * 
 * Local presentation-specific components
 * For UI components, use @sakhlaqi/ui package
 */

// ============================================================================
// LAYOUT COMPONENTS (App-specific with routing/store logic)
// ============================================================================
export * from './layout';

// ============================================================================
// COMPOSITE COMPONENTS (Presentation-specific)
// ============================================================================
export * from './composite';

// ============================================================================
// DYNAMIC COMPONENT RENDERER
// ============================================================================
export { DynamicComponentRenderer } from './DynamicComponentRenderer';

// ============================================================================
// UTILITY COMPONENTS (App-specific)
// ============================================================================
export { LoadingSpinner } from './LoadingSpinner';
export { ProtectedRoute } from './ProtectedRoute';
