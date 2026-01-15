/**
 * Token Management Utilities
 * Handles JWT token storage, retrieval, and validation
 */

import { jwtDecode } from 'jwt-decode';
import type { AuthTokens, TokenPayload } from '../types';

const TOKEN_STORAGE_KEY = 'auth_tokens';

export class TokenManager {
  /**
   * Store tokens in localStorage
   */
  static setTokens(tokens: AuthTokens): void {
    try {
      localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokens));
    } catch (error) {
      console.error('Failed to store tokens:', error);
    }
  }

  /**
   * Retrieve tokens from localStorage
   */
  static getTokens(): AuthTokens | null {
    try {
      const tokens = localStorage.getItem(TOKEN_STORAGE_KEY);
      return tokens ? JSON.parse(tokens) : null;
    } catch (error) {
      console.error('Failed to retrieve tokens:', error);
      return null;
    }
  }

  /**
   * Remove tokens from localStorage
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
   */
  static isTokenExpired(token: string): boolean {
    const payload = this.decodeToken(token);
    if (!payload) return true;
    
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  }

  /**
   * Check if token is about to expire (within buffer time)
   */
  static isTokenExpiringSoon(token: string, bufferSeconds: number = 300): boolean {
    const payload = this.decodeToken(token);
    if (!payload) return true;
    
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < (currentTime + bufferSeconds);
  }

  /**
   * Get access token if valid
   */
  static getValidAccessToken(): string | null {
    const tokens = this.getTokens();
    if (!tokens || this.isTokenExpired(tokens.access)) {
      return null;
    }
    return tokens.access;
  }
}

export default TokenManager;
