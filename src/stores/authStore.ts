/**
 * Authentication Store
 * Manages authentication state using Zustand
 */

import { create } from 'zustand';
import type { AuthState, User, AuthTokens, LoginCredentials } from '../types';
import { AuthService } from '../api';
import { TokenManager } from '../utils/tokenManager';

interface AuthStore extends AuthState {
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  setUser: (user: User | null) => void;
  setTokens: (tokens: AuthTokens | null) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  // Initial state
  user: null,
  tokens: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // Login action
  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true, error: null });
    try {
      // Get tenant slug from tenant store if not provided
      const { useTenantStore } = await import('./tenantStore');
      const tenantSlug = credentials.tenant || useTenantStore.getState().tenantSlug;
      
      const tokens = await AuthService.login({
        ...credentials,
        tenant: tenantSlug,
      });
      TokenManager.setTokens(tokens);
      
      // Fetch user info separately
      const user = await AuthService.getCurrentUser();
      
      set({
        user,
        tokens,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Login failed';
      set({
        isLoading: false,
        error: errorMessage,
        isAuthenticated: false,
      });
      throw error;
    }
  },

  // Logout action
  logout: async () => {
    set({ isLoading: true });
    try {
      await AuthService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      TokenManager.clearTokens();
      set({
        user: null,
        tokens: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  },

  // Load user from stored token
  loadUser: async () => {
    const tokens = TokenManager.getTokens();
    if (!tokens) {
      set({ isLoading: false, isAuthenticated: false });
      return;
    }

    // Check if access token is expired
    if (TokenManager.isTokenExpired(tokens.access)) {
      TokenManager.clearTokens();
      set({ isLoading: false, isAuthenticated: false });
      return;
    }

    set({ isLoading: true });
    try {
      const user = await AuthService.getCurrentUser();
      set({
        user,
        tokens,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      TokenManager.clearTokens();
      set({
        user: null,
        tokens: null,
        isAuthenticated: false,
        isLoading: false,
        error: 'Failed to load user',
      });
    }
  },

  // Set user
  setUser: (user: User | null) => {
    set({ user, isAuthenticated: !!user });
  },

  // Set tokens
  setTokens: (tokens: AuthTokens | null) => {
    if (tokens) {
      TokenManager.setTokens(tokens);
    } else {
      TokenManager.clearTokens();
    }
    set({ tokens });
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },
}));

export default useAuthStore;
