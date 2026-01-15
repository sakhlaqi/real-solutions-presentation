/**
 * Application Configuration
 * Central configuration for API endpoints and app settings
 */

interface AppConfig {
  apiBaseUrl: string;
  apiTimeout: number;
  tokenRefreshBuffer: number; // seconds before expiry to refresh
  defaultTenantSlug: string;
  supportEmail: string;
}

// Get API URL from environment variable or default to localhost
const getApiBaseUrl = (): string => {
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
};

export const config: AppConfig = {
  apiBaseUrl: getApiBaseUrl(),
  apiTimeout: 30000, // 30 seconds
  tokenRefreshBuffer: 300, // 5 minutes
  defaultTenantSlug: 'demo',
  supportEmail: 'support@realsolutions.com',
};

export default config;
