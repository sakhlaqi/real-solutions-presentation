/**
 * Centralized API Client
 * Handles all HTTP requests with authentication, token refresh, error handling, and retries.
 * 
 * Architecture:
 * - Single axios instance with interceptors
 * - Automatic token injection for authenticated requests
 * - Token refresh on 401 with request queuing
 * - Retry logic for transient failures
 * - Standardized error normalization
 */

import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig, AxiosError } from 'axios';
import { config } from '../config';
import { TokenManager } from '../utils/tokenManager';
import type { AuthTokens } from '../types';

/**
 * Normalized API error structure for consistent error handling
 */
export interface ApiError {
  code: string;
  message: string;
  statusCode: number;
  details?: Record<string, unknown>;
  correlationId?: string;
  isNetworkError: boolean;
  isAuthError: boolean;
  isServerError: boolean;
  originalError: Error;
}

/**
 * Request config with custom options
 */
interface CustomRequestConfig extends AxiosRequestConfig {
  skipAuth?: boolean;
  retry?: boolean;
  retryCount?: number;
}

// Constants
const MAX_RETRIES = 2;
const RETRY_DELAY = 1000; // ms
const RETRYABLE_STATUS_CODES = [408, 429, 500, 502, 503, 504];

export class ApiClient {
  private client: AxiosInstance;
  private isRefreshing = false;
  private refreshSubscribers: Array<(token: string) => void> = [];
  private failedRefreshSubscribers: Array<(error: Error) => void> = [];

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
    // Request interceptor - add auth token if available
    this.client.interceptors.request.use(
      (axiosConfig: InternalAxiosRequestConfig) => {
        const customConfig = axiosConfig as InternalAxiosRequestConfig & CustomRequestConfig;
        
        // Skip auth for public endpoints
        if (!customConfig.skipAuth) {
          const token = TokenManager.getValidAccessToken();
          
          if (token && axiosConfig.headers) {
            axiosConfig.headers.Authorization = `Bearer ${token}`;
          }
        }
        
        return axiosConfig;
      },
      (error) => Promise.reject(this.normalizeError(error))
    );

    // Response interceptor - handle errors and token refresh
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & CustomRequestConfig & { _retry?: boolean };
        
        if (!originalRequest) {
          return Promise.reject(this.normalizeError(error));
        }

        // Handle 401 Unauthorized (only for authenticated requests)
        if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.skipAuth) {
          return this.handleUnauthorized(error, originalRequest);
        }

        // Handle retryable errors
        if (this.isRetryableError(error) && originalRequest.retry !== false) {
          return this.handleRetry(error, originalRequest);
        }

        return Promise.reject(this.normalizeError(error));
      }
    );
  }

  /**
   * Handle 401 unauthorized errors with token refresh
   */
  private async handleUnauthorized(
    _error: AxiosError,
    originalRequest: InternalAxiosRequestConfig & CustomRequestConfig & { _retry?: boolean }
  ): Promise<AxiosResponse> {
    if (this.isRefreshing) {
      // Wait for token refresh
      return new Promise((resolve, reject) => {
        this.refreshSubscribers.push((token: string) => {
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(this.client(originalRequest));
        });
        this.failedRefreshSubscribers.push(reject);
      });
    }

    originalRequest._retry = true;
    this.isRefreshing = true;

    try {
      const tokens = TokenManager.getTokens();
      if (tokens?.refresh) {
        const newTokens = await this.refreshToken(tokens.refresh);
        TokenManager.setTokens(newTokens);
        
        // Notify all waiting requests
        this.refreshSubscribers.forEach((callback) => callback(newTokens.access));
        this.refreshSubscribers = [];
        this.failedRefreshSubscribers = [];
        
        // Retry original request
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newTokens.access}`;
        return this.client(originalRequest);
      }
      throw new Error('No refresh token available');
    } catch (refreshError) {
      // Notify failed subscribers
      const normalizedError = this.normalizeError(refreshError);
      this.failedRefreshSubscribers.forEach((callback) => callback(normalizedError.originalError));
      this.refreshSubscribers = [];
      this.failedRefreshSubscribers = [];
      
      // Clear tokens on refresh failure
      TokenManager.clearTokens();
      return Promise.reject(normalizedError);
    } finally {
      this.isRefreshing = false;
    }
  }

  /**
   * Handle retryable errors with exponential backoff
   */
  private async handleRetry(
    error: AxiosError,
    originalRequest: InternalAxiosRequestConfig & CustomRequestConfig
  ): Promise<AxiosResponse> {
    const retryCount = originalRequest.retryCount || 0;
    
    if (retryCount >= MAX_RETRIES) {
      return Promise.reject(this.normalizeError(error));
    }

    const delay = RETRY_DELAY * Math.pow(2, retryCount);
    await new Promise(resolve => setTimeout(resolve, delay));

    return this.client({
      ...originalRequest,
      retryCount: retryCount + 1,
    } as CustomRequestConfig);
  }

  /**
   * Check if error is retryable
   */
  private isRetryableError(error: AxiosError): boolean {
    if (!error.response) {
      // Network error - retryable
      return true;
    }
    return RETRYABLE_STATUS_CODES.includes(error.response.status);
  }

  /**
   * Normalize errors into consistent format
   */
  private normalizeError(error: unknown): ApiError {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ error?: { code?: string; message?: string; details?: Record<string, unknown> }; correlation_id?: string }>;
      const response = axiosError.response;
      const data = response?.data;
      
      return {
        code: data?.error?.code || this.getErrorCode(response?.status),
        message: data?.error?.message || axiosError.message || 'An error occurred',
        statusCode: response?.status || 0,
        details: data?.error?.details,
        correlationId: data?.correlation_id,
        isNetworkError: !response,
        isAuthError: response?.status === 401 || response?.status === 403,
        isServerError: (response?.status || 0) >= 500,
        originalError: axiosError,
      };
    }

    // Non-axios error
    const err = error instanceof Error ? error : new Error(String(error));
    return {
      code: 'unknown_error',
      message: err.message,
      statusCode: 0,
      isNetworkError: false,
      isAuthError: false,
      isServerError: false,
      originalError: err,
    };
  }

  /**
   * Get error code from status
   */
  private getErrorCode(status?: number): string {
    switch (status) {
      case 400: return 'bad_request';
      case 401: return 'unauthorized';
      case 403: return 'forbidden';
      case 404: return 'not_found';
      case 429: return 'rate_limited';
      case 500: return 'server_error';
      default: return 'unknown_error';
    }
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

  // ==========================================================================
  // PUBLIC API METHODS
  // ==========================================================================

  /**
   * Generic GET request (authenticated)
   */
  async get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  /**
   * Generic POST request (authenticated)
   */
  async post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  /**
   * Generic PUT request (authenticated)
   */
  async put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  /**
   * Generic PATCH request (authenticated)
   */
  async patch<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }

  /**
   * Generic DELETE request (authenticated)
   */
  async delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }

  // ==========================================================================
  // PUBLIC (UNAUTHENTICATED) API METHODS
  // ==========================================================================

  /**
   * Public GET request (no authentication required)
   */
  async publicGet<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, { ...config, skipAuth: true } as CustomRequestConfig);
    return response.data;
  }

  /**
   * Public POST request (no authentication required)
   */
  async publicPost<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, { ...config, skipAuth: true } as CustomRequestConfig);
    return response.data;
  }

  /**
   * Get underlying axios instance (for special cases only)
   */
  getClient(): AxiosInstance {
    return this.client;
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient;
