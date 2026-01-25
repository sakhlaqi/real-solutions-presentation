/**
 * Behavior Registry
 * 
 * Maps behavior IDs from JSON page configurations to actual functions.
 * This keeps business logic, navigation, and side effects in the Presentation app
 * while the UI library remains behavior-agnostic.
 * 
 * **Architecture:**
 * - JSON configs use string IDs: "navigateToDashboard", "openEmployeeDetails", etc.
 * - UI library calls behaviors: behaviorRegistry["navigateToDashboard"]()
 * - Registry maps to actual functions with router, modals, API calls, etc.
 * - Navigation, state management, and side effects stay in Presentation app
 * 
 * **Usage in JSON:**
 * ```json
 * {
 *   "type": "Button",
 *   "props": {
 *     "label": "View Details",
 *     "onClick": "openEmployeeDetails"
 *   }
 * }
 * ```
 */

/**
 * Behavior Function Type
 * 
 * Behaviors can be synchronous or asynchronous
 * They receive optional parameters (row data, event data, etc.)
 */
export type BehaviorFn = (...args: any[]) => void | Promise<void>;

/**
 * Behavior Context
 * 
 * Provides access to navigation, state, and services.
 * Injected at runtime by the Presentation app.
 */
interface BehaviorContext {
  /** React Router navigate function */
  navigate?: (path: string, options?: { replace?: boolean; state?: unknown }) => void;
  /** Navigate back */
  navigateBack?: () => void;
  /** Show notification/toast */
  showNotification?: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  /** Show confirmation dialog */
  showConfirmation?: (message: string, onConfirm: () => void) => void;
  /** Open modal */
  openModal?: (modalId: string, data?: unknown) => void;
  /** Close modal */
  closeModal?: (modalId?: string) => void;
  /** Access to stores (if needed) */
  stores?: {
    auth?: unknown;
    tenant?: unknown;
    project?: unknown;
  };
}

/**
 * Global behavior context
 * Injected by the app at initialization
 */
let behaviorContext: BehaviorContext = {};

/**
 * Set Behavior Context
 * 
 * Called by the Presentation app to inject dependencies.
 * Must be called before behaviors are used.
 * 
 * @param context - Behavior context with navigation, notifications, etc.
 * 
 * @example
 * ```typescript
 * // In App.tsx or main initialization
 * const navigate = useNavigate();
 * setBehaviorContext({ 
 *   navigate,
 *   showNotification: toast.show
 * });
 * ```
 */
export function setBehaviorContext(context: BehaviorContext): void {
  behaviorContext = { ...behaviorContext, ...context };
  console.log('[behaviorRegistry] Context updated:', Object.keys(behaviorContext));
}

/**
 * Get Behavior Context
 */
export function getBehaviorContext(): BehaviorContext {
  return behaviorContext;
}

/**
 * Navigation Behaviors
 * 
 * Handle routing and navigation between pages
 */
const navigationBehaviors = {
  /**
   * Navigate to dashboard
   */
  navigateToDashboard: () => {
    behaviorContext.navigate?.('/admin');
  },

  /**
   * Navigate to projects list
   */
  navigateToProjects: () => {
    behaviorContext.navigate?.('/admin/projects');
  },

  /**
   * Navigate to settings
   */
  navigateToSettings: () => {
    behaviorContext.navigate?.('/admin/settings');
  },

  /**
   * Navigate back
   */
  navigateBack: () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      behaviorContext.navigate?.('/');
    }
  },

  /**
   * Navigate to specific path
   * 
   * @param path - Route path to navigate to
   */
  navigateToPath: (path: string) => {
    if (!path) {
      console.error('[navigateToPath] Path is required');
      return;
    }
    behaviorContext.navigate?.(path);
  },

  /**
   * Open external link
   * 
   * @param url - External URL to open
   */
  openExternalLink: (url: string) => {
    if (!url) {
      console.error('[openExternalLink] URL is required');
      return;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  },
};

/**
 * Employee-related Behaviors
 */
const employeeBehaviors = {
  /**
   * Open employee details page
   * 
   * @param row - Employee row data
   */
  openEmployeeDetails: (row: { id: string | number }) => {
    if (!row?.id) {
      console.error('[openEmployeeDetails] Employee ID is required');
      return;
    }
    behaviorContext.navigate?.(`/admin/employees/${row.id}`);
  },

  /**
   * Edit employee
   * 
   * @param row - Employee row data
   */
  editEmployee: (row: { id: string | number }) => {
    if (!row?.id) {
      console.error('[editEmployee] Employee ID is required');
      return;
    }
    behaviorContext.navigate?.(`/admin/employees/${row.id}/edit`);
  },

  /**
   * Delete employee (with confirmation)
   * 
   * @param row - Employee row data
   */
  deleteEmployee: async (row: { id: string | number; name?: string }) => {
    if (!row?.id) {
      console.error('[deleteEmployee] Employee ID is required');
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete ${row.name || 'this employee'}?`
    );

    if (!confirmed) return;

    try {
      // TODO: Call API to delete employee
      // await apiClient.delete(`/employees/${row.id}`);
      
      behaviorContext.showNotification?.(
        `Employee ${row.name || row.id} deleted successfully`,
        'success'
      );
      
      // Refresh the page or update data
      window.location.reload();
    } catch (error) {
      console.error('[deleteEmployee] Failed to delete employee:', error);
      behaviorContext.showNotification?.(
        'Failed to delete employee',
        'error'
      );
    }
  },

  /**
   * Add new employee
   */
  addEmployee: () => {
    behaviorContext.navigate?.('/admin/employees/new');
  },

  /**
   * Export employees
   */
  exportEmployees: async () => {
    try {
      // TODO: Call API to export employees
      behaviorContext.showNotification?.('Exporting employees...', 'info');
      
      // Mock export
      console.log('[exportEmployees] Export initiated');
      
      // In production:
      // const blob = await apiClient.get('/employees/export', { responseType: 'blob' });
      // const url = URL.createObjectURL(blob);
      // const a = document.createElement('a');
      // a.href = url;
      // a.download = 'employees.csv';
      // a.click();
      
      behaviorContext.showNotification?.('Employees exported successfully', 'success');
    } catch (error) {
      console.error('[exportEmployees] Failed to export:', error);
      behaviorContext.showNotification?.('Failed to export employees', 'error');
    }
  },
};

/**
 * Project-related Behaviors
 */
const projectBehaviors = {
  /**
   * Open project details
   * 
   * @param row - Project row data
   */
  openProjectDetails: (row: { id: string | number }) => {
    if (!row?.id) {
      console.error('[openProjectDetails] Project ID is required');
      return;
    }
    behaviorContext.navigate?.(`/admin/projects/${row.id}`);
  },

  /**
   * Edit project
   * 
   * @param row - Project row data
   */
  editProject: (row: { id: string | number }) => {
    if (!row?.id) {
      console.error('[editProject] Project ID is required');
      return;
    }
    behaviorContext.navigate?.(`/admin/projects/${row.id}/edit`);
  },

  /**
   * Delete project
   * 
   * @param row - Project row data
   */
  deleteProject: async (row: { id: string | number; name?: string }) => {
    if (!row?.id) {
      console.error('[deleteProject] Project ID is required');
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete project "${row.name || row.id}"?`
    );

    if (!confirmed) return;

    try {
      // TODO: Call API to delete project
      // await apiClient.delete(`/projects/${row.id}`);
      
      behaviorContext.showNotification?.(
        `Project "${row.name || row.id}" deleted successfully`,
        'success'
      );
      
      window.location.reload();
    } catch (error) {
      console.error('[deleteProject] Failed to delete project:', error);
      behaviorContext.showNotification?.('Failed to delete project', 'error');
    }
  },

  /**
   * Create new project
   */
  createProject: () => {
    behaviorContext.navigate?.('/admin/projects/new');
  },

  /**
   * Archive project
   * 
   * @param row - Project row data
   */
  archiveProject: async (row: { id: string | number; name?: string }) => {
    if (!row?.id) {
      console.error('[archiveProject] Project ID is required');
      return;
    }

    try {
      // TODO: Call API to archive project
      // await apiClient.patch(`/projects/${row.id}/`, { status: 'archived' });
      
      behaviorContext.showNotification?.(
        `Project "${row.name || row.id}" archived`,
        'success'
      );
      
      window.location.reload();
    } catch (error) {
      console.error('[archiveProject] Failed to archive project:', error);
      behaviorContext.showNotification?.('Failed to archive project', 'error');
    }
  },
};

/**
 * UI Side Effect Behaviors
 */
const uiEffectBehaviors = {
  /**
   * Show notification
   * 
   * @param message - Notification message
   * @param type - Notification type
   */
  showNotification: (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    behaviorContext.showNotification?.(message, type);
  },

  /**
   * Refresh page
   */
  refreshPage: () => {
    window.location.reload();
  },

  /**
   * Scroll to top
   */
  scrollToTop: () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  /**
   * Print page
   */
  printPage: () => {
    window.print();
  },

  /**
   * Copy to clipboard
   * 
   * @param text - Text to copy
   */
  copyToClipboard: async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      behaviorContext.showNotification?.('Copied to clipboard', 'success');
    } catch (error) {
      console.error('[copyToClipboard] Failed to copy:', error);
      behaviorContext.showNotification?.('Failed to copy to clipboard', 'error');
    }
  },

  /**
   * Log data (for debugging)
   * 
   * @param data - Data to log
   */
  logData: (...data: unknown[]) => {
    console.log('[behaviorRegistry:logData]', ...data);
  },
};

/**
 * Form Behaviors
 */
const formBehaviors = {
  /**
   * Submit form
   * 
   * @param formData - Form data
   */
  submitForm: async (formData: Record<string, unknown>) => {
    console.log('[submitForm] Form data:', formData);
    
    try {
      // TODO: Submit to API
      behaviorContext.showNotification?.('Form submitted successfully', 'success');
    } catch (error) {
      console.error('[submitForm] Failed to submit form:', error);
      behaviorContext.showNotification?.('Failed to submit form', 'error');
    }
  },

  /**
   * Cancel form
   */
  cancelForm: () => {
    behaviorContext.navigateBack?.();
  },

  /**
   * Reset form
   * 
   * @param formId - Form ID to reset
   */
  resetForm: (formId?: string) => {
    console.log('[resetForm] Resetting form:', formId);
    // Form reset logic handled by form component
  },
};

/**
 * Behavior Registry
 * 
 * Main export: Plain object mapping behavior IDs to functions.
 * This is what the UI library will receive and use.
 */
export const behaviorRegistry: Record<string, BehaviorFn> = {
  // Navigation
  ...navigationBehaviors,
  
  // Employee actions
  ...employeeBehaviors,
  
  // Project actions
  ...projectBehaviors,
  
  // UI effects
  ...uiEffectBehaviors,
  
  // Forms
  ...formBehaviors,
};

/**
 * Register custom behavior
 * 
 * Allows runtime registration of new behaviors
 * 
 * @param id - Behavior identifier
 * @param fn - Behavior function
 * 
 * @example
 * ```typescript
 * registerBehavior('customAction', (data) => {
 *   console.log('Custom action:', data);
 * });
 * ```
 */
export function registerBehavior(id: string, fn: BehaviorFn): void {
  if (behaviorRegistry[id]) {
    console.warn(`[registerBehavior] Overwriting existing behavior: ${id}`);
  }
  behaviorRegistry[id] = fn;
  console.log(`[registerBehavior] Registered behavior: ${id}`);
}

/**
 * Get available behaviors
 */
export function getAvailableBehaviors(): string[] {
  return Object.keys(behaviorRegistry);
}

/**
 * Check if behavior exists
 */
export function hasBehavior(id: string): boolean {
  return id in behaviorRegistry;
}

/**
 * Execute behavior by ID
 * 
 * @param id - Behavior ID
 * @param args - Arguments to pass to behavior
 */
export async function executeBehavior(id: string, ...args: unknown[]): Promise<void> {
  if (!hasBehavior(id)) {
    console.error(`[executeBehavior] Behavior "${id}" not found. Available:`, getAvailableBehaviors());
    return;
  }

  try {
    await behaviorRegistry[id](...args);
  } catch (error) {
    console.error(`[executeBehavior] Error executing behavior "${id}":`, error);
    throw error;
  }
}

/**
 * Default export
 */
export default behaviorRegistry;
