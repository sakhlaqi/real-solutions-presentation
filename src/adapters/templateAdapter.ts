/**
 * Template to PageConfig Adapter
 * 
 * Converts template-based page structure (sections) to PageConfig format (slots)
 * that the UI library's PageRenderer expects.
 */

import type { PageConfig } from '@sakhlaqi/ui';
import type { TemplatePage } from '../types/template';

/**
 * Convert a template page to PageConfig format
 * 
 * Template format uses:
 * - layout: { type, version, props }
 * - sections: [ { id, type, version, props } ]
 * 
 * PageConfig format uses:
 * - template: layout type string
 * - slots: { [slotName]: component definition }
 */
export function templatePageToPageConfig(templatePage: TemplatePage): PageConfig {
  // Extract layout type
  const layoutType = templatePage.layout?.type || 'default-layout';
  
  // Convert sections array to slots object
  // Each section becomes a slot with its ID as the key
  const slots: Record<string, any> = {};
  
  if (templatePage.sections) {
    templatePage.sections.forEach((section) => {
      // Use section ID as slot name, or generate from type
      const slotName = section.id || section.type;
      
      // Convert section to slot component definition
      slots[slotName] = {
        type: section.type,
        props: section.props || {},
        version: section.version,
      };
    });
  }
  
  // Build PageConfig
  const pageConfig: PageConfig = {
    template: layoutType,
    slots,
    // Pass through metadata if exists
    ...(templatePage.metadata && { metadata: templatePage.metadata }),
  };
  
  return pageConfig;
}

/**
 * Convert multiple template pages to PageConfig format
 * 
 * @param templatePages - Record of template pages keyed by page ID
 * @returns Record of PageConfig keyed by page ID
 */
export function templatePagesToPageConfigs(
  templatePages: Record<string, TemplatePage>
): Record<string, PageConfig> {
  const pageConfigs: Record<string, PageConfig> = {};
  
  for (const [pageId, templatePage] of Object.entries(templatePages)) {
    pageConfigs[pageId] = templatePageToPageConfig(templatePage);
  }
  
  return pageConfigs;
}

/**
 * Check if a page uses template format (has sections)
 * vs old PageConfig format (has slots)
 */
export function isTemplatePage(page: any): page is TemplatePage {
  return 'sections' in page && Array.isArray(page.sections);
}

/**
 * Adapter function that handles both formats
 * 
 * If page is already in PageConfig format, return as-is.
 * If page is in template format, convert it.
 */
export function adaptPageConfig(page: TemplatePage | PageConfig): PageConfig {
  if (isTemplatePage(page)) {
    return templatePageToPageConfig(page);
  }
  
  // Already PageConfig format
  return page as PageConfig;
}
