/**
 * useJsonPages Hook
 * 
 * Fetches and manages tenant-specific page configurations from the API.
 * Provides page configs for routing and handles loading/error states.
 */

import React, { useState, useEffect } from 'react';
import { useTenantStore } from '../stores';
import { fetchTenantUiConfig } from '../data';
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
 * @param options - Configuration options
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
export function useJsonPages(options?: {
  /** Skip cache and force fresh fetch */
  skipCache?: boolean;
}): UseJsonPagesResult {
  const { tenantId } = useTenantStore();
  const [pages, setPages] = useState<Record<string, PageConfig>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState<string>();
  const [updatedAt, setUpdatedAt] = useState<string>();

  const fetchPages = React.useCallback(async () => {
    if (!tenantId) {
      setError('No tenant ID available');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const config = await fetchTenantUiConfig(tenantId, {
        skipCache: options?.skipCache,
      });

      setPages(config.pages);
      setVersion(config.version);
      setUpdatedAt(config.updatedAt);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch UI configuration';
      console.error('[useJsonPages] Error fetching pages:', err);
      setError(errorMessage);
      setPages({});
    } finally {
      setIsLoading(false);
    }
  }, [tenantId, options?.skipCache]);

  // Fetch on mount and when tenant changes
  useEffect(() => {
    fetchPages();
  }, [fetchPages]);

  // Get specific page
  const getPage = (path: string): PageConfig | null => {
    return pages[path] || null;
  };

  return {
    pages,
    isLoading,
    error,
    version,
    updatedAt,
    refetch: fetchPages,
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
  const { tenantId } = useTenantStore();
  const [pageConfig, setPageConfig] = useState<PageConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPage = async () => {
      if (!tenantId) {
        setError('No tenant ID available');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const uiConfig = await fetchTenantUiConfig(tenantId);
        const config = uiConfig.pages[pagePath];
        if (!config) {
          throw new Error(`Page not found: ${pagePath}`);
        }
        setPageConfig(config);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : `Failed to fetch page: ${pagePath}`;
        console.error(`[useJsonPage] Error fetching page ${pagePath}:`, err);
        setError(errorMessage);
        setPageConfig(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPage();
  }, [tenantId, pagePath]);

  return {
    pageConfig,
    isLoading,
    error,
  };
}

export default useJsonPages;
