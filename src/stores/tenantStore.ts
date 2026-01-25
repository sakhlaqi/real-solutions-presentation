/**
 * Tenant Store
 * Manages tenant configuration and state
 */

import { create } from 'zustand';
import type { Tenant, TenantConfig } from '../types';
import { TenantService } from '../api';
import { TenantResolver } from '../services/tenantResolver';

interface TenantState {
  tenant: Tenant | null;
  config: TenantConfig | null;
  tenantSlug: string;
  tenantId?: string;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
}

interface TenantStore extends TenantState {
  // Actions
  initializeTenant: () => Promise<void>;
  loadTenantConfig: () => Promise<void>;
  setTenant: (tenant: Tenant | null) => void;
  setConfig: (config: TenantConfig | null) => void;
  clearError: () => void;
}

export const useTenantStore = create<TenantStore>((set, get) => ({
  // Initial state
  tenant: null,
  config: null,
  tenantSlug: TenantResolver.getTenantSlug(),
  isLoading: false,
  error: null,
  isInitialized: false,

  // Initialize tenant
  initializeTenant: async () => {
    const { tenantSlug } = get();
    set({ isLoading: true, error: null });

    try {
      // Load tenant and config
      const tenant = await TenantService.getTenantBySlug(tenantSlug);
      const config = await TenantService.getTenantConfigBySlug(tenantSlug);

      set({
        tenant,
        config,
        isLoading: false,
        error: null,
        isInitialized: true,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Failed to load tenant';
      set({
        isLoading: false,
        error: errorMessage,
        isInitialized: false,
      });
      throw error;
    }
  },

  // Load tenant configuration
  loadTenantConfig: async () => {
    const { tenantSlug } = get();
    set({ isLoading: true, error: null });

    try {
      const config = await TenantService.getTenantConfigBySlug(tenantSlug);
      set({
        config,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Failed to load configuration';
      set({
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  },

  // Set tenant
  setTenant: (tenant: Tenant | null) => {
    set({ tenant });
  },

  // Set config
  setConfig: (config: TenantConfig | null) => {
    set({ config });
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },
}));

export default useTenantStore;
