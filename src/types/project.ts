/**
 * Project Types
 * Defines project-related interfaces for multi-project support
 */

export interface Project {
  id: string;
  name: string;
  description?: string;
  tenantId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}

export interface ProjectState {
  projects: Project[];
  activeProject: Project | null;
  isLoading: boolean;
  error: string | null;
}
