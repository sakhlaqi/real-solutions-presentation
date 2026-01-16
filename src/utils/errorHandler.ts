/**
 * Error Handling Utilities
 * Centralized error handling for consistent user experience.
 * 
 * Features:
 * - Normalized error format matching API error structure
 * - User-friendly error messages
 * - Error categorization for appropriate handling
 * - Toast/notification integration support
 */

import type { ApiError } from '../api/client';

/**
 * User-friendly error message mapping
 */
const USER_FRIENDLY_MESSAGES: Record<string, string> = {
  // Authentication errors
  unauthorized: 'Please log in to continue.',
  forbidden: 'You do not have permission to perform this action.',
  token_revoked: 'Your session has expired. Please log in again.',
  
  // Tenant errors
  tenant_not_found: 'Unable to find your organization. Please check your URL.',
  tenant_inactive: 'Your organization account is currently inactive.',
  cross_tenant_access: 'You cannot access resources from another organization.',
  
  // Network errors
  network_error: 'Unable to connect to the server. Please check your internet connection.',
  timeout: 'The request timed out. Please try again.',
  
  // Server errors
  server_error: 'Something went wrong on our end. Please try again later.',
  internal_error: 'An unexpected error occurred. Please try again.',
  
  // Validation errors
  bad_request: 'Invalid request. Please check your input.',
  validation_error: 'Please check your input and try again.',
  
  // Resource errors
  not_found: 'The requested resource was not found.',
  
  // Rate limiting
  rate_limited: 'Too many requests. Please wait a moment and try again.',
  
  // Default
  unknown_error: 'An unexpected error occurred. Please try again.',
};

/**
 * Get user-friendly message for an error code
 */
export function getErrorMessage(error: ApiError | Error | string): string {
  if (typeof error === 'string') {
    return USER_FRIENDLY_MESSAGES[error] || error;
  }
  
  if ('code' in error) {
    const apiError = error as ApiError;
    
    // Use message from API if available and not generic
    if (apiError.message && !apiError.message.includes('An error occurred')) {
      return apiError.message;
    }
    
    return USER_FRIENDLY_MESSAGES[apiError.code] || apiError.message || USER_FRIENDLY_MESSAGES.unknown_error;
  }
  
  return error.message || USER_FRIENDLY_MESSAGES.unknown_error;
}

/**
 * Check if error is a network error
 */
export function isNetworkError(error: ApiError | Error): boolean {
  if ('isNetworkError' in error) {
    return (error as ApiError).isNetworkError;
  }
  return error.message?.includes('Network Error') || error.message?.includes('timeout');
}

/**
 * Check if error is an authentication error
 */
export function isAuthError(error: ApiError | Error): boolean {
  if ('isAuthError' in error && typeof (error as ApiError).isAuthError === 'boolean') {
    return (error as ApiError).isAuthError;
  }
  if ('code' in error && typeof (error as ApiError).code === 'string') {
    return ['unauthorized', 'forbidden', 'token_revoked'].includes((error as ApiError).code);
  }
  return false;
}

/**
 * Check if error is a server error
 */
export function isServerError(error: ApiError | Error): boolean {
  if ('isServerError' in error && typeof (error as ApiError).isServerError === 'boolean') {
    return (error as ApiError).isServerError;
  }
  if ('statusCode' in error && typeof (error as ApiError).statusCode === 'number') {
    return (error as ApiError).statusCode >= 500;
  }
  return false;
}

/**
 * Check if error is retryable
 */
export function isRetryableError(error: ApiError | Error): boolean {
  if (isNetworkError(error)) return true;
  if ('statusCode' in error) {
    const status = (error as ApiError).statusCode;
    return [408, 429, 500, 502, 503, 504].includes(status);
  }
  return false;
}

/**
 * Error severity levels for UI treatment
 */
export type ErrorSeverity = 'info' | 'warning' | 'error' | 'critical';

/**
 * Get error severity for UI treatment
 */
export function getErrorSeverity(error: ApiError | Error): ErrorSeverity {
  if (isNetworkError(error)) return 'warning';
  if (isAuthError(error)) return 'warning';
  if (isServerError(error)) return 'error';
  
  if ('statusCode' in error) {
    const status = (error as ApiError).statusCode;
    if (status >= 500) return 'error';
    if (status === 429) return 'warning';
    if (status === 404) return 'info';
    if (status >= 400) return 'warning';
  }
  
  return 'error';
}

/**
 * Format validation errors from API response
 */
export function formatValidationErrors(
  details: Record<string, unknown> | undefined
): Record<string, string> {
  if (!details) return {};
  
  const formatted: Record<string, string> = {};
  
  for (const [field, errors] of Object.entries(details)) {
    if (Array.isArray(errors)) {
      formatted[field] = errors.join(', ');
    } else if (typeof errors === 'string') {
      formatted[field] = errors;
    } else if (typeof errors === 'object' && errors !== null) {
      // Nested errors (e.g., from nested serializers)
      formatted[field] = JSON.stringify(errors);
    }
  }
  
  return formatted;
}

/**
 * Log error with context for debugging
 */
export function logError(
  error: ApiError | Error,
  context?: Record<string, unknown>
): void {
  const errorInfo = {
    message: error.message,
    ...(('code' in error) && { code: (error as ApiError).code }),
    ...(('statusCode' in error) && { statusCode: (error as ApiError).statusCode }),
    ...(('correlationId' in error) && { correlationId: (error as ApiError).correlationId }),
    ...context,
  };
  
  console.error('Application error:', errorInfo, error);
  
  // Future: Send to error tracking service (Sentry, etc.)
  // if (config.errorTrackingEnabled) {
  //   errorTracker.captureException(error, { extra: errorInfo });
  // }
}

export default {
  getErrorMessage,
  isNetworkError,
  isAuthError,
  isServerError,
  isRetryableError,
  getErrorSeverity,
  formatValidationErrors,
  logError,
};
