/**
 * Template Service
 * 
 * API service for template CRUD operations.
 * Templates behave exactly like themes - presets, inheritance, runtime resolution.
 */

import { apiClient } from './client';
import type {
  TemplateMetadata,
  TemplateData,
  CreateTemplateRequest,
  CloneTemplateRequest,
} from '../types/template';

/**
 * Template Service
 */
export class TemplateService {
  /**
   * Get all preset templates (lightweight list)
   * Public endpoint - no auth required
   */
  static async getPresets(): Promise<TemplateMetadata[]> {
    return apiClient.publicGet('/templates/presets/');
  }

  /**
   * Get all templates (presets + tenant custom)
   * Public endpoint for presets, authenticated for tenant templates
   */
  static async getTemplates(): Promise<TemplateMetadata[]> {
    return apiClient.publicGet('/templates/');
  }

  /**
   * Get full template by ID (including template_json)
   * Public endpoint - no auth required for presets
   */
  static async getTemplateById(templateId: string): Promise<TemplateData> {
    return apiClient.publicGet(`/templates/${templateId}/`);
  }

  /**
   * Get templates by category
   * Public endpoint
   * 
   * @param category - Template category (landing, marketing, blog, etc.)
   * @returns Templates in that category
   */
  static async getByCategory(category: string): Promise<TemplateMetadata[]> {
    return apiClient.publicGet(`/templates/by_category/?category=${category}`);
  }

  /**
   * Get templates by tier
   * Public endpoint
   * 
   * Note: Phase 1 - This only filters, it does NOT check entitlements.
   * Entitlement checking happens in Phase 2.
   * 
   * @param tier - Template tier (free, premium, enterprise)
   * @returns Templates in that tier
   */
  static async getByTier(tier: string): Promise<TemplateMetadata[]> {
    return apiClient.publicGet(`/templates/by_tier/?tier=${tier}`);
  }

  /**
   * Create a new custom template
   * Requires authentication
   * 
   * @param data - Template creation data
   * @returns Created template
   */
  static async createTemplate(data: CreateTemplateRequest): Promise<TemplateData> {
    return apiClient.post('/templates/', data);
  }

  /**
   * Clone an existing template (preset or custom)
   * Creates a new custom template based on the source template
   * Requires authentication
   * 
   * @param templateId - Source template ID
   * @param data - Clone request data
   * @returns Cloned template
   */
  static async cloneTemplate(
    templateId: string,
    data: CloneTemplateRequest
  ): Promise<TemplateData> {
    return apiClient.post(`/templates/${templateId}/clone/`, data);
  }

  /**
   * Update an existing custom template
   * Requires authentication
   * Cannot update presets
   * 
   * @param templateId - Template ID to update
   * @param data - Partial template data
   * @returns Updated template
   */
  static async updateTemplate(
    templateId: string,
    data: Partial<CreateTemplateRequest>
  ): Promise<TemplateData> {
    return apiClient.patch(`/templates/${templateId}/`, data);
  }

  /**
   * Delete a custom template
   * Requires authentication
   * Cannot delete presets
   * 
   * @param templateId - Template ID to delete
   */
  static async deleteTemplate(templateId: string): Promise<void> {
    return apiClient.delete(`/templates/${templateId}/`);
  }
}
