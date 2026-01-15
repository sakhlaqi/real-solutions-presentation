/**
 * Centralized API Client
 * Handles all HTTP requests with authentication, token refresh, and error handling
 */

import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { config } from '../config';
import { TokenManager } from '../utils/tokenManager';
import type { AuthTokens } from '../types';

export class ApiClient {
  private client: AxiosInstance;
  private isRefreshing = false;
  private refreshSubscribers: Array<(token: string) => void> = [];

  constructor() {
    this.client = axios.create({
      baseURL: config.apiBaseUrl,
      timeout: config.apiTimeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  /**
   * Setup request and response interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor - add auth token if available and not explicitly skipped
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // Check if this request should skip auth (for public endpoints)
        const skipAuth = (config as any).skipAuth;
        
        if (!skipAuth) {
          const token = TokenManager.getValidAccessToken();
          
          if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - handle errors and token refresh
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error) => {
        const originalRequest = error.config;
        
        // Skip refresh logic for public endpoints
        const skipAuth = originalRequest.skipAuth;

        // Handle 401 Unauthorized (only for authenticated requests)
        if (error.response?.status === 401 && !originalRequest._retry && !skipAuth) {
          if (this.isRefreshing) {
            // Wait for token refresh
            return new Promise((resolve) => {
              this.refreshSubscribers.push((token: string) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                resolve(this.client(originalRequest));
              });
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const tokens = TokenManager.getTokens();
            if (tokens?.refresh) {
              const newTokens = await this.refreshToken(tokens.refresh);
              TokenManager.setTokens(newTokens);
              
              // Notify subscribers
              this.refreshSubscribers.forEach((callback) => callback(newTokens.access));
              this.refreshSubscribers = [];
              
              // Retry original request
              originalRequest.headers.Authorization = `Bearer ${newTokens.access}`;
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed - clear tokens (redirect handled by ProtectedRoute)
            TokenManager.clearTokens();
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  /**
   * Refresh access token
   */
  private async refreshToken(refreshToken: string): Promise<AuthTokens> {
    const response = await axios.post(`${config.apiBaseUrl}/auth/token/refresh/`, {
      refresh: refreshToken,
    });
    return response.data;
  }

  /**
   * Generic GET request
   */
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  /**
   * Generic POST request
   */
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  /**
   * Generic PUT request
   */
  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  /**
   * Generic PATCH request
   */
  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }

  /**
   * Generic DELETE request
   */
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }

  /**
   * Public GET request (no authentication required)
   */
  async publicGet<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, { ...config, skipAuth: true } as any);
    return response.data;
  }

  /**
   * Public POST request (no authentication required)
   */
  async publicPost<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, { ...config, skipAuth: true } as any);
    return response.data;
  }

  /**
   * Get underlying axios instance (for special cases)
   */
  getClient(): AxiosInstance {
    return this.client;
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient;
