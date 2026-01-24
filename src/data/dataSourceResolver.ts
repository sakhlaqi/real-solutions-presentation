/**
 * Data Source Resolver
 * 
 * Maps dataSource IDs from JSON page configurations to actual API calls.
 * This keeps data fetching logic in the Presentation app while allowing
 * the UI library to remain data-agnostic.
 * 
 * **Architecture:**
 * - JSON configs use string IDs: "employees", "projects", etc.
 * - UI library calls resolver: dataSourceResolver("employees", params)
 * - Resolver maps to API calls: ProjectService.getProjects()
 * - Auth headers handled automatically by apiClient
 * - Caching and pagination supported
 */

import { ProjectService } from '../api';
import type { Project } from '../types';

/**
 * Data Source Resolver Function Type
 */
export type DataSourceResolverFn<T = unknown> = (params?: DataSourceParams) => Promise<T[]>;

/**
 * Data Source Parameters
 */
export interface DataSourceParams {
  /** Page number (1-indexed) */
  page?: number;
  /** Items per page */
  pageSize?: number;
  /** Search query */
  search?: string;
  /** Sort field */
  sortBy?: string;
  /** Sort direction */
  sortOrder?: 'asc' | 'desc';
  /** Filter parameters */
  filters?: Record<string, unknown>;
  /** Additional custom parameters */
  [key: string]: unknown;
}

/**
 * Data Source Response (with pagination support)
 */
export interface DataSourceResponse<T = unknown> {
  /** Data items */
  data: T[];
  /** Total count (for pagination) */
  total?: number;
  /** Current page */
  page?: number;
  /** Page size */
  pageSize?: number;
  /** Whether there are more pages */
  hasMore?: boolean;
}

/**
 * Employee data type (example)
 */
export interface Employee {
  id: number | string;
  name: string;
  email: string;
  department: string;
  role: string;
  salary?: number;
  startDate?: string;
  active?: boolean;
  [key: string]: unknown;
}

/**
 * Task data type (example)
 */
export interface Task {
  id: number | string;
  title: string;
  description?: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'blocked';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignee?: string;
  dueDate?: string;
  projectId?: string;
  [key: string]: unknown;
}

/**
 * Data Source Registry
 * 
 * Maps string IDs to async data fetching functions.
 * Each function receives optional parameters and returns data array.
 */
const dataSourceRegistry: Record<string, DataSourceResolverFn> = {
  /**
   * Projects Data Source
   * Fetches all projects for the current tenant
   */
  projects: async (params?: DataSourceParams): Promise<Project[]> => {
    try {
      const projects = await ProjectService.getProjects();
      
      // Apply client-side filtering if needed
      let filteredProjects = projects;
      
      if (params?.search) {
        const searchLower = params.search.toLowerCase();
        filteredProjects = projects.filter((p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description?.toLowerCase().includes(searchLower)
        );
      }
      
      if (params?.filters?.status) {
        filteredProjects = filteredProjects.filter((p) => p.status === params.filters?.status);
      }
      
      // Apply sorting
      if (params?.sortBy) {
        filteredProjects = [...filteredProjects].sort((a, b) => {
          const aVal = a[params.sortBy as keyof Project];
          const bVal = b[params.sortBy as keyof Project];
          
          if (aVal === undefined || bVal === undefined) return 0;
          
          const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
          return params.sortOrder === 'desc' ? -comparison : comparison;
        });
      }
      
      return filteredProjects;
    } catch (error) {
      console.error('[dataSourceResolver:projects] Failed to fetch projects:', error);
      throw error;
    }
  },

  /**
   * Employees Data Source (Mock)
   * 
   * TODO: Replace with actual API endpoint when available
   * Example: return apiClient.get('/employees/', { params });
   */
  employees: async (params?: DataSourceParams): Promise<Employee[]> => {
    try {
      // Mock data for demonstration
      // In production, replace with: return apiClient.get('/employees/', { params });
      const mockEmployees: Employee[] = [
        { id: 1, name: 'John Doe', email: 'john@example.com', department: 'Engineering', role: 'Senior Engineer', salary: 120000, startDate: '2020-01-15', active: true },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', department: 'Design', role: 'Lead Designer', salary: 110000, startDate: '2019-03-20', active: true },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', department: 'Engineering', role: 'Engineer', salary: 90000, startDate: '2021-06-10', active: true },
        { id: 4, name: 'Alice Williams', email: 'alice@example.com', department: 'Marketing', role: 'Marketing Manager', salary: 95000, startDate: '2020-09-01', active: true },
        { id: 5, name: 'Charlie Brown', email: 'charlie@example.com', department: 'Sales', role: 'Sales Rep', salary: 75000, startDate: '2022-02-15', active: false },
        { id: 6, name: 'Diana Prince', email: 'diana@example.com', department: 'Engineering', role: 'Tech Lead', salary: 140000, startDate: '2018-11-30', active: true },
        { id: 7, name: 'Eve Adams', email: 'eve@example.com', department: 'HR', role: 'HR Manager', salary: 85000, startDate: '2021-01-05', active: true },
        { id: 8, name: 'Frank Miller', email: 'frank@example.com', department: 'Design', role: 'Designer', salary: 80000, startDate: '2022-07-20', active: true },
        { id: 9, name: 'Grace Lee', email: 'grace@example.com', department: 'Engineering', role: 'Engineer', salary: 95000, startDate: '2021-04-12', active: true },
        { id: 10, name: 'Henry Davis', email: 'henry@example.com', department: 'Sales', role: 'Sales Manager', salary: 105000, startDate: '2019-08-25', active: true },
      ];
      
      let filtered = mockEmployees;
      
      // Apply search
      if (params?.search) {
        const searchLower = params.search.toLowerCase();
        filtered = filtered.filter((e) =>
          e.name.toLowerCase().includes(searchLower) ||
          e.email.toLowerCase().includes(searchLower) ||
          e.department.toLowerCase().includes(searchLower)
        );
      }
      
      // Apply filters
      if (params?.filters?.department) {
        filtered = filtered.filter((e) => e.department === params.filters?.department);
      }
      
      if (params?.filters?.active !== undefined) {
        filtered = filtered.filter((e) => e.active === params.filters?.active);
      }
      
      return filtered;
    } catch (error) {
      console.error('[dataSourceResolver:employees] Failed to fetch employees:', error);
      throw error;
    }
  },

  /**
   * Tasks Data Source (Mock)
   * 
   * TODO: Replace with actual API endpoint when available
   */
  tasks: async (params?: DataSourceParams): Promise<Task[]> => {
    try {
      // Mock data for demonstration
      const mockTasks: Task[] = [
        { id: 1, title: 'Implement login', description: 'Add user authentication', status: 'in-progress', priority: 'high', assignee: 'John Doe', dueDate: '2024-02-15', projectId: '1' },
        { id: 2, title: 'Design dashboard', description: 'Create dashboard mockups', status: 'in-progress', priority: 'high', assignee: 'Jane Smith', dueDate: '2024-02-16', projectId: '1' },
        { id: 3, title: 'Write documentation', description: 'Document API endpoints', status: 'not-started', priority: 'medium', assignee: 'Bob Johnson', dueDate: '2024-02-20', projectId: '1' },
        { id: 4, title: 'Setup CI/CD', description: 'Configure deployment pipeline', status: 'not-started', priority: 'low', assignee: 'Alice Williams', dueDate: '2024-02-22', projectId: '2' },
        { id: 5, title: 'Code review', description: 'Review pull requests', status: 'completed', priority: 'medium', assignee: 'Charlie Brown', dueDate: '2024-02-10', projectId: '2' },
      ];
      
      let filtered = mockTasks;
      
      // Apply search
      if (params?.search) {
        const searchLower = params.search.toLowerCase();
        filtered = filtered.filter((t) =>
          t.title.toLowerCase().includes(searchLower) ||
          t.description?.toLowerCase().includes(searchLower)
        );
      }
      
      // Apply filters
      if (params?.filters?.status) {
        filtered = filtered.filter((t) => t.status === params.filters?.status);
      }
      
      if (params?.filters?.priority) {
        filtered = filtered.filter((t) => t.priority === params.filters?.priority);
      }
      
      if (params?.filters?.projectId) {
        filtered = filtered.filter((t) => t.projectId === params.filters?.projectId);
      }
      
      return filtered;
    } catch (error) {
      console.error('[dataSourceResolver:tasks] Failed to fetch tasks:', error);
      throw error;
    }
  },

  /**
   * Users Data Source (Mock)
   */
  users: async (): Promise<unknown[]> => {
    try {
      // TODO: Implement actual API call
      // return apiClient.get('/users/');
      return [];
    } catch (error) {
      console.error('[dataSourceResolver:users] Failed to fetch users:', error);
      throw error;
    }
  },

  /**
   * Departments Data Source (Mock)
   */
  departments: async (): Promise<unknown[]> => {
    try {
      // Mock data
      return [
        { id: '1', name: 'Engineering', employeeCount: 25 },
        { id: '2', name: 'Design', employeeCount: 8 },
        { id: '3', name: 'Marketing', employeeCount: 12 },
        { id: '4', name: 'Sales', employeeCount: 15 },
        { id: '5', name: 'HR', employeeCount: 5 },
      ];
    } catch (error) {
      console.error('[dataSourceResolver:departments] Failed to fetch departments:', error);
      throw error;
    }
  },
};

/**
 * Simple in-memory cache
 */
const dataSourceCache = new Map<string, { data: unknown[]; timestamp: number }>();
const CACHE_TTL = 2 * 60 * 1000; // 2 minutes

/**
 * Resolve Data Source
 * 
 * Main resolver function called by the UI library.
 * Maps dataSource ID to API call with caching support.
 * 
 * @param dataSourceId - Data source identifier (e.g., "employees", "projects")
 * @param params - Optional parameters (pagination, search, filters)
 * @param options - Resolver options
 * @returns Promise resolving to data array
 * 
 * @example
 * ```typescript
 * const employees = await dataSourceResolver('employees', {
 *   search: 'john',
 *   filters: { department: 'Engineering' }
 * });
 * ```
 */
export async function dataSourceResolver<T = unknown>(
  dataSourceId: string,
  params?: DataSourceParams,
  options: {
    /** Skip cache and fetch fresh data */
    skipCache?: boolean;
    /** Enable debug logging */
    debug?: boolean;
  } = {}
): Promise<T[]> {
  const { skipCache = false, debug = false } = options;

  // Check if data source exists
  if (!dataSourceRegistry[dataSourceId]) {
    const availableDataSources = Object.keys(dataSourceRegistry).join(', ');
    throw new Error(
      `Data source "${dataSourceId}" not found. Available data sources: ${availableDataSources}`
    );
  }

  // Generate cache key
  const cacheKey = `${dataSourceId}:${JSON.stringify(params || {})}`;

  // Check cache (unless skipCache is true)
  if (!skipCache) {
    const cached = dataSourceCache.get(cacheKey);
    if (cached) {
      const age = Date.now() - cached.timestamp;
      if (age < CACHE_TTL) {
        if (debug) {
          console.log(`[dataSourceResolver] Cache hit for: ${dataSourceId}`, params);
        }
        return cached.data as T[];
      } else {
        if (debug) {
          console.log(`[dataSourceResolver] Cache expired for: ${dataSourceId}`, params);
        }
        dataSourceCache.delete(cacheKey);
      }
    }
  }

  // Fetch from data source
  if (debug) {
    console.log(`[dataSourceResolver] Fetching data for: ${dataSourceId}`, params);
  }

  try {
    const data = await dataSourceRegistry[dataSourceId](params);

    // Cache the result
    dataSourceCache.set(cacheKey, {
      data,
      timestamp: Date.now(),
    });

    if (debug) {
      console.log(`[dataSourceResolver] Fetched ${data.length} items for: ${dataSourceId}`);
    }

    return data as T[];
  } catch (error) {
    console.error(`[dataSourceResolver] Failed to resolve data source: ${dataSourceId}`, error);
    throw error;
  }
}

/**
 * Register a new data source
 * 
 * @param id - Data source identifier
 * @param resolver - Resolver function
 * 
 * @example
 * ```typescript
 * registerDataSource('custom', async (params) => {
 *   return apiClient.get('/custom/', { params });
 * });
 * ```
 */
export function registerDataSource<T = unknown>(
  id: string,
  resolver: DataSourceResolverFn<T>
): void {
  if (dataSourceRegistry[id]) {
    console.warn(`[registerDataSource] Overwriting existing data source: ${id}`);
  }
  dataSourceRegistry[id] = resolver;
  console.log(`[registerDataSource] Registered data source: ${id}`);
}

/**
 * Clear data source cache
 * 
 * @param dataSourceId - Optional specific data source to clear
 */
export function clearDataSourceCache(dataSourceId?: string): void {
  if (dataSourceId) {
    // Clear specific data source
    const keysToDelete: string[] = [];
    for (const key of dataSourceCache.keys()) {
      if (key.startsWith(`${dataSourceId}:`)) {
        keysToDelete.push(key);
      }
    }
    keysToDelete.forEach((key) => dataSourceCache.delete(key));
    console.log(`[clearDataSourceCache] Cleared cache for: ${dataSourceId}`);
  } else {
    // Clear all cache
    dataSourceCache.clear();
    console.log('[clearDataSourceCache] Cleared all data source cache');
  }
}

/**
 * Get available data sources
 */
export function getAvailableDataSources(): string[] {
  return Object.keys(dataSourceRegistry);
}

/**
 * Get cache statistics
 */
export function getDataSourceCacheStats() {
  return {
    size: dataSourceCache.size,
    entries: Array.from(dataSourceCache.keys()),
  };
}

/**
 * Export for testing/debugging
 */
export const __internal = {
  dataSourceRegistry,
  dataSourceCache,
  CACHE_TTL,
};

/**
 * Default export as a function
 */
export default dataSourceResolver;
