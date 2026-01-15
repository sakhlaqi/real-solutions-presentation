/**
 * Tenant API Service
 * Handles all tenant-related API calls
 */

import { apiClient } from './client';
import type { Tenant, TenantConfig } from '../types';

export class TenantService {
  /**
   * Get tenant by slug (public endpoint - no auth required)
   */
  static async getTenantBySlug(slug: string): Promise<Tenant> {
    return apiClient.publicGet(`/tenants/${slug}/`);
  }

  /**
   * Get tenant configuration (public endpoint - no auth required)
   */
  static async getTenantConfig(tenantId: string): Promise<TenantConfig> {
    return apiClient.publicGet(`/tenants/${tenantId}/config/`);
  }

  /**
   * Get tenant configuration by slug (public endpoint - no auth required)
   */
  static async getTenantConfigBySlug(slug: string): Promise<TenantConfig> {
    return apiClient.publicGet(`/tenants/${slug}/config/`);
  }

  /**
   * Update tenant configuration (admin only - auth required)
   */
  static async updateTenantConfig(tenantId: string, config: Partial<TenantConfig>): Promise<TenantConfig> {
    return apiClient.patch(`/tenants/${tenantId}/config/`, config);
  }
}

export default TenantService;
