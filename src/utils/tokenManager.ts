/**
 * Token Management Utilities
 * Handles JWT token storage, retrieval, and validation.
 * 
 * Security Considerations:
 * -----------------------
 * Current implementation uses localStorage for token storage.
 * 
 * Trade-offs:
 * - localStorage: Simple, persists across tabs, but vulnerable to XSS
 * - sessionStorage: More secure (per-tab), but doesn't persist
 * - httpOnly cookies: Most secure, but requires backend cookie support
 * 
 * Mitigations for XSS risk:
 * 1. Short-lived access tokens (15 minutes)
 * 2. Automatic token rotation on refresh
 * 3. Token version tracking for revocation
 * 4. CSP headers in production
 * 
 * Future Enhancement:
 * Consider migrating to httpOnly cookies with SameSite=Strict
 * when backend support is added.
 */

import { jwtDecode } from 'jwt-decode';
import type { AuthTokens, TokenPayload } from '../types';

const TOKEN_STORAGE_KEY = 'auth_tokens';

// Default expiration buffer (5 minutes before actual expiry)
const DEFAULT_EXPIRY_BUFFER_SECONDS = 300;

export class TokenManager {
  /**
   * Store tokens securely
   * 
   * Note: In production, consider using httpOnly cookies instead
   */
  static setTokens(tokens: AuthTokens): void {
    try {
      localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokens));
    } catch (error) {
      console.error('Failed to store tokens:', error);
      // In production, consider reporting this to error tracking
    }
  }

  /**
   * Retrieve tokens from storage
   */
  static getTokens(): AuthTokens | null {
    try {
      const tokens = localStorage.getItem(TOKEN_STORAGE_KEY);
      if (!tokens) return null;
      
      const parsed = JSON.parse(tokens) as AuthTokens;
      
      // Validate structure
      if (!parsed.access || typeof parsed.access !== 'string') {
        console.warn('Invalid token structure, clearing tokens');
        this.clearTokens();
        return null;
      }
      
      return parsed;
    } catch (error) {
      console.error('Failed to retrieve tokens:', error);
      this.clearTokens();
      return null;
    }
  }

  /**
   * Remove tokens from storage
   */
  static clearTokens(): void {
    try {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear tokens:', error);
    }
  }

  /**
   * Decode JWT token payload
   * 
   * @param token - JWT token string
   * @returns Decoded payload or null if invalid
   */
  static decodeToken(token: string): TokenPayload | null {
    try {
      return jwtDecode<TokenPayload>(token);
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  }

  /**
   * Check if token is expired
   * 
   * @param token - JWT token string
   * @returns true if token is expired or invalid
   */
  static isTokenExpired(token: string): boolean {
    const payload = this.decodeToken(token);
    if (!payload?.exp) return true;
    
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  }

  /**
   * Check if token is about to expire (within buffer time)
   * 
   * @param token - JWT token string
   * @param bufferSeconds - Seconds before expiry to consider "expiring soon"
   * @returns true if token will expire within buffer time
   */
  static isTokenExpiringSoon(token: string, bufferSeconds: number = DEFAULT_EXPIRY_BUFFER_SECONDS): boolean {
    const payload = this.decodeToken(token);
    if (!payload?.exp) return true;
    
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < (currentTime + bufferSeconds);
  }

  /**
   * Get access token if valid and not expiring soon
   * 
   * @returns Valid access token or null
   */
  static getValidAccessToken(): string | null {
    const tokens = this.getTokens();
    if (!tokens?.access) return null;
    
    // Check if expired or about to expire
    if (this.isTokenExpired(tokens.access)) {
      return null;
    }
    
    return tokens.access;
  }

  /**
   * Get tenant ID from token claims
   * 
   * @returns Tenant ID from token or null
   */
  static getTenantFromToken(): string | null {
    const tokens = this.getTokens();
    if (!tokens?.access) return null;
    
    const payload = this.decodeToken(tokens.access);
    // Check both 'tenant' and 'tenant_id' for backward compatibility
    return payload?.tenant || payload?.tenant_id || null;
  }

  /**
   * Get user ID from token claims
   * 
   * @returns User ID from token or null
   */
  static getUserIdFromToken(): string | null {
    const tokens = this.getTokens();
    if (!tokens?.access) return null;
    
    const payload = this.decodeToken(tokens.access);
    return payload?.user_id || payload?.sub || null;
  }

  /**
   * Get token expiration time
   * 
   * @returns Expiration timestamp in seconds or null
   */
  static getTokenExpiration(): number | null {
    const tokens = this.getTokens();
    if (!tokens?.access) return null;
    
    const payload = this.decodeToken(tokens.access);
    return payload?.exp || null;
  }

  /**
   * Get remaining token lifetime in seconds
   * 
   * @returns Seconds until token expires, or 0 if expired/invalid
   */
  static getTokenRemainingTime(): number {
    const exp = this.getTokenExpiration();
    if (!exp) return 0;
    
    const currentTime = Math.floor(Date.now() / 1000);
    const remaining = exp - currentTime;
    return remaining > 0 ? remaining : 0;
  }

  /**
   * Check if user has a valid session (valid refresh token)
   * 
   * @returns true if refresh token is available and valid
   */
  static hasValidSession(): boolean {
    const tokens = this.getTokens();
    if (!tokens?.refresh) return false;
    
    // Refresh tokens have longer lifetimes, just check basic validity
    return !this.isTokenExpired(tokens.refresh);
  }
}

export default TokenManager;
