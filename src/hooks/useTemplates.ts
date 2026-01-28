/**
 * Template Hooks
 * 
 * React hooks for working with templates.
 * Provides easy access to template presets and CRUD operations.
 */

import { useState, useEffect } from 'react';
import { TemplateService } from '../api/template';
import type { TemplateMetadata, TemplateData } from '../types/template';

/**
 * useTemplatePresets Hook
 * 
 * Fetches all preset templates (lightweight list).
 * Public hook - no authentication required.
 * 
 * @example
 * ```tsx
 * function TemplateSelector() {
 *   const { templates, loading, error, refetch } = useTemplatePresets();
 *   
 *   if (loading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error}</div>;
 *   
 *   return (
 *     <div>
 *       {templates.map(t => (
 *         <div key={t.id}>{t.name} - {t.category}</div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useTemplatePresets() {
  const [templates, setTemplates] = useState<TemplateMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTemplates = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('[useTemplatePresets] Fetching template presets from API...');
      const data = await TemplateService.getPresets();
      
      console.log(`[useTemplatePresets] Loaded ${data.length} template presets:`, 
        data.map(t => t.name).join(', ')
      );
      
      setTemplates(data);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch template presets';
      console.error('[useTemplatePresets] Error fetching templates:', err);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  return {
    templates,
    loading,
    error,
    refetch: fetchTemplates,
  };
}

/**
 * useTemplate Hook
 * 
 * Fetches a single template by ID (including full template_json).
 * Public hook - no authentication required for presets.
 * 
 * @param templateId - Template ID to fetch
 * @param enabled - Whether to fetch (default: true)
 * 
 * @example
 * ```tsx
 * function TemplateDetail({ templateId }: { templateId: string }) {
 *   const { template, loading, error } = useTemplate(templateId);
 *   
 *   if (loading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error}</div>;
 *   if (!template) return null;
 *   
 *   return (
 *     <div>
 *       <h1>{template.name}</h1>
 *       <p>{template.description}</p>
 *     </div>
 *   );
 * }
 * ```
 */
export function useTemplate(templateId: string | null, enabled = true) {
  const [template, setTemplate] = useState<TemplateData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTemplate = async () => {
    if (!templateId || !enabled) {
      setTemplate(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      console.log(`[useTemplate] Fetching template ${templateId}...`);
      const data = await TemplateService.getTemplateById(templateId);
      
      console.log(`[useTemplate] Loaded template: ${data.name} (${data.category})`);
      setTemplate(data);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch template';
      console.error('[useTemplate] Error fetching template:', err);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateId, enabled]);

  return {
    template,
    loading,
    error,
    refetch: fetchTemplate,
  };
}

/**
 * useTemplatesByCategory Hook
 * 
 * Fetches templates filtered by category.
 * Public hook - no authentication required.
 * 
 * @param category - Template category (landing, marketing, blog, etc.)
 * @param enabled - Whether to fetch (default: true)
 * 
 * @example
 * ```tsx
 * function LandingTemplates() {
 *   const { templates, loading, error } = useTemplatesByCategory('landing');
 *   
 *   if (loading) return <div>Loading landing templates...</div>;
 *   if (error) return <div>Error: {error}</div>;
 *   
 *   return (
 *     <div>
 *       {templates.map(t => (
 *         <TemplateCard key={t.id} template={t} />
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useTemplatesByCategory(category: string | null, enabled = true) {
  const [templates, setTemplates] = useState<TemplateMetadata[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTemplates = async () => {
    if (!category || !enabled) {
      setTemplates([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      console.log(`[useTemplatesByCategory] Fetching ${category} templates...`);
      const data = await TemplateService.getByCategory(category);
      
      console.log(`[useTemplatesByCategory] Loaded ${data.length} ${category} templates`);
      setTemplates(data);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch templates by category';
      console.error('[useTemplatesByCategory] Error fetching templates:', err);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, enabled]);

  return {
    templates,
    loading,
    error,
    refetch: fetchTemplates,
  };
}

/**
 * useTemplatesByTier Hook
 * 
 * Fetches templates filtered by tier.
 * Public hook - no authentication required.
 * 
 * Note: Phase 1 - This only filters, it does NOT check entitlements.
 * Entitlement checking happens in Phase 2.
 * 
 * @param tier - Template tier (free, premium, enterprise)
 * @param enabled - Whether to fetch (default: true)
 * 
 * @example
 * ```tsx
 * function FreeTemplates() {
 *   const { templates, loading, error } = useTemplatesByTier('free');
 *   
 *   return (
 *     <div>
 *       <h2>Free Templates</h2>
 *       {loading ? (
 *         <div>Loading...</div>
 *       ) : (
 *         templates.map(t => <TemplateCard key={t.id} template={t} />)
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export function useTemplatesByTier(tier: string | null, enabled = true) {
  const [templates, setTemplates] = useState<TemplateMetadata[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTemplates = async () => {
    if (!tier || !enabled) {
      setTemplates([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      console.log(`[useTemplatesByTier] Fetching ${tier} templates...`);
      const data = await TemplateService.getByTier(tier);
      
      console.log(`[useTemplatesByTier] Loaded ${data.length} ${tier} templates`);
      setTemplates(data);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch templates by tier';
      console.error('[useTemplatesByTier] Error fetching templates:', err);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tier, enabled]);

  return {
    templates,
    loading,
    error,
    refetch: fetchTemplates,
  };
}
