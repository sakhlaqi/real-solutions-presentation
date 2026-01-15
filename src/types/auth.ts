/**
 * Authentication Types
 * Defines user, token, and authentication-related interfaces
 */

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role?: string;
  tenantId: string;
  projectIds?: string[];
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  tenantSlug: string;
}

export interface TokenPayload {
  user_id: string;
  email: string;
  tenant_id: string;
  exp: number;
  iat: number;
}

export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
