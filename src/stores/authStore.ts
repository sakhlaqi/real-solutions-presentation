/**
 * Authentication Store
 * Manages authentication state using Zustand with improved error handling.
 * 
 * Architecture:
 * - Centralized auth state management
 * - Token lifecycle management via TokenManager
 * - Integration with tenant context
 * - Normalized error handling
 */

import { create } from 'zustand';
import type { AuthState, User, AuthTokens, LoginCredentials } from '../types';
import { AuthService } from '../api';
import { TokenManager } from '../utils/tokenManager';
import { getErrorMessage, logError, isAuthError } from '../utils/errorHandler';
import type { ApiError } from '../api/client';

interface AuthStore extends AuthState {
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  setUser: (user: User | null) => void;
  setTokens: (tokens: AuthTokens | null) => void;
  clearError: () => void;
  /** Check and refresh session if needed */
  refreshSession: () => Promise<boolean>;
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
    } catch (error) {
      const apiError = error as ApiError;
      const errorMessage = getErrorMessage(apiError);
      
      logError(apiError, { action: 'login', username: credentials.username });
      
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
      // Attempt server-side logout
      await AuthService.logout();
    } catch (error) {
      // Log but don't block logout on server errors
      console.warn('Server logout failed:', error);
    } finally {
      // Always clear local state
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
      // Try to refresh if refresh token is valid
      if (tokens.refresh && !TokenManager.isTokenExpired(tokens.refresh)) {
        const refreshed = await get().refreshSession();
        if (!refreshed) {
          return;
        }
      } else {
        TokenManager.clearTokens();
        set({ isLoading: false, isAuthenticated: false });
        return;
      }
    }

    set({ isLoading: true });
    try {
      const user = await AuthService.getCurrentUser();
      set({
        user,
        tokens: TokenManager.getTokens(),
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const apiError = error as ApiError;
      
      // Only clear tokens on auth errors
      if (isAuthError(apiError)) {
        TokenManager.clearTokens();
      }
      
      logError(apiError, { action: 'loadUser' });
      
      set({
        user: null,
        tokens: null,
        isAuthenticated: false,
        isLoading: false,
        error: null, // Don't show error for background loads
      });
    }
  },

  // Refresh session
  refreshSession: async () => {
    const tokens = TokenManager.getTokens();
    if (!tokens?.refresh) {
      return false;
    }

    try {
      const newTokens = await AuthService.refreshToken(tokens.refresh);
      TokenManager.setTokens(newTokens);
      set({ tokens: newTokens });
      return true;
    } catch (error) {
      logError(error as ApiError, { action: 'refreshSession' });
      TokenManager.clearTokens();
      set({
        user: null,
        tokens: null,
        isAuthenticated: false,
        error: null,
      });
      return false;
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
