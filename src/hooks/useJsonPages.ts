/**
 * useJsonPages Hook
 * 
 * Fetches and manages tenant-specific page configurations from the API.
 * Now uses the cached config from tenant store to avoid redundant API calls.
 * Provides page configs for routing and handles loading/error states.
 */

import React, { useState, useEffect } from 'react';
import { useTenantStore } from '../stores';
import type { PageConfig } from '@sakhlaqi/ui';

interface UseJsonPagesResult {
  /** Map of page paths to page configurations */
  pages: Record<string, PageConfig>;
  /** Loading state */
  isLoading: boolean;
  /** Error message if fetch failed */
  error: string | null;
  /** UI config version */
  version?: string;
  /** Last updated timestamp */
  updatedAt?: string;
  /** Refetch UI config */
  refetch: () => Promise<void>;
  /** Get specific page config */
  getPage: (path: string) => PageConfig | null;
}

/**
 * Hook to fetch and manage JSON page configurations
 * 
 * @returns Page configurations and utilities
 * 
 * @example
 * ```tsx
 * const { pages, isLoading, error } = useJsonPages();
 * 
 * if (isLoading) return <Spinner />;
 * if (error) return <ErrorMessage message={error} />;
 * 
 * return <JsonPage pageConfig={pages['/dashboard']} />;
 * ```
 */
export function useJsonPages(): UseJsonPagesResult {
  const config = useTenantStore((state) => state.config);
  const { loadTenantConfig } = useTenantStore();
  const [pages, setPages] = useState<Record<string, PageConfig>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState<string>();

  // Extract pages from config when it changes
  useEffect(() => {
    if (config?.page_config) {
      setPages(config.page_config.pages || {});
      setVersion(config.page_config.version);
      setError(null);
      setIsLoading(false);
    } else if (config !== null) {
      // Config loaded but no page_config
      setPages({});
      setError('No page configuration available');
      setIsLoading(false);
    }
  }, [config]);

  const refetch = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await loadTenantConfig();
      // Config update will trigger the useEffect above
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch UI configuration';
      console.error('[useJsonPages] Error fetching pages:', err);
      setError(errorMessage);
      setPages({});
      setIsLoading(false);
    }
  }, [loadTenantConfig]);

  // Get specific page
  const getPage = (path: string): PageConfig | null => {
    return pages[path] || null;
  };

  return {
    pages,
    isLoading,
    error,
    version,
    updatedAt: undefined, // Not available in TenantConfig
    refetch,
    getPage,
  };
}

/**
 * Hook to fetch a single page configuration
 * 
 * @param pagePath - Page path (e.g., "/dashboard", "/employees")
 * @returns Page config and utilities
 * 
 * @example
 * ```tsx
 * const { pageConfig, isLoading, error } = useJsonPage('/dashboard');
 * 
 * if (isLoading) return <Spinner />;
 * if (error) return <ErrorMessage message={error} />;
 * 
 * return <JsonPage pageConfig={pageConfig} />;
 * ```
 */
export function useJsonPage(pagePath: string) {
  const config = useTenantStore((state) => state.config);
  const [pageConfig, setPageConfig] = useState<PageConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (config?.page_config) {
      const page = config.page_config.pages[pagePath];
      if (page) {
        setPageConfig(page);
        setError(null);
      } else {
        setPageConfig(null);
        setError(`Page not found: ${pagePath}`);
      }
      setIsLoading(false);
    } else if (config !== null) {
      // Config loaded but no page_config
      setPageConfig(null);
      setError('No page configuration available');
      setIsLoading(false);
    }
  }, [config, pagePath]);

  return {
    pageConfig,
    isLoading,
    error,
  };
}

export default useJsonPages;
