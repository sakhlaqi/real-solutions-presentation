/**
 * Authentication Types
 * Defines user, token, and authentication-related interfaces.
 * 
 * JWT Claims Consistency:
 * - 'tenant' is the primary claim name for tenant ID
 * - 'tenant_id' is supported for backward compatibility
 * - 'user_id' is the standard claim for user identification
 */

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role?: string;
  tenantId: string;
  projectIds?: string[];
  /** When the user was created */
  createdAt?: string;
  /** Last login timestamp */
  lastLogin?: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginCredentials {
  /** Username or email */
  username?: string;
  email?: string;
  password: string;
  tenant?: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  tenantSlug: string;
}

/**
 * JWT Token Payload
 * Matches the claims structure from the API's JWT tokens
 */
export interface TokenPayload {
  /** User identifier */
  user_id: string;
  /** User email */
  email?: string;
  /** Tenant identifier (primary claim name) */
  tenant?: string;
  /** Tenant identifier (backward compatibility) */
  tenant_id?: string;
  /** Token expiration timestamp (Unix seconds) */
  exp: number;
  /** Token issued-at timestamp (Unix seconds) */
  iat: number;
  /** JWT ID for uniqueness */
  jti?: string;
  /** Token issuer */
  iss?: string;
  /** Token audience */
  aud?: string;
  /** Subject (usually user ID) */
  sub?: string;
  /** Token type */
  token_type?: string;
  /** Client type for API client tokens */
  client_type?: string;
  /** Client ID for API client tokens */
  client_id?: string;
  /** Token version for revocation support */
  token_version?: number;
}

export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
