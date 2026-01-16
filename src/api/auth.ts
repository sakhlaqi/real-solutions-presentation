/**
 * Authentication API Service
 * Handles all authentication-related API calls
 */

import { apiClient } from './client';
import type { AuthTokens, LoginCredentials, RegisterData, User } from '../types';

export class AuthService {
  /**
   * Login with email and password
   */
  static async login(credentials: LoginCredentials): Promise<AuthTokens> {
    return apiClient.post('/auth/login/', credentials);
  }

  /**
   * Register new user
   */
  static async register(data: RegisterData): Promise<{ tokens: AuthTokens; user: User }> {
    return apiClient.post('/auth/register/', data);
  }

  /**
   * Logout (invalidate tokens)
   */
  static async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout/');
    } catch (error) {
      // Continue with logout even if API call fails
      console.error('Logout API call failed:', error);
    }
  }

  /**
   * Get current user profile
   */
  static async getCurrentUser(): Promise<User> {
    return apiClient.get('/auth/me/');
  }

  /**
   * Refresh access token
   */
  static async refreshToken(refreshToken: string): Promise<AuthTokens> {
    return apiClient.post('/auth/token/refresh/', { refresh: refreshToken });
  }

  /**
   * Verify token validity
   */
  static async verifyToken(token: string): Promise<{ valid: boolean }> {
    return apiClient.post('/auth/token/verify/', { token });
  }
}

export default AuthService;
