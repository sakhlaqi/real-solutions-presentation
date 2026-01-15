/**
 * Project Store
 * Manages project selection and state
 */

import { create } from 'zustand';
import type { Project, ProjectState } from '../types';
import { ProjectService } from '../api';

interface ProjectStore extends ProjectState {
  // Actions
  loadProjects: () => Promise<void>;
  fetchProjects: () => Promise<void>; // Alias for loadProjects
  setActiveProject: (project: Project | null) => void;
  createProject: (data: Partial<Project>) => Promise<Project>;
  updateProject: (projectId: string, data: Partial<Project>) => Promise<Project>;
  deleteProject: (projectId: string) => Promise<void>;
  clearError: () => void;
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  // Initial state
  projects: [],
  activeProject: null,
  isLoading: false,
  error: null,

  // Load all projects
  loadProjects: async () => {
    set({ isLoading: true, error: null });
    try {
      const projects = await ProjectService.getProjects();
      
      // Set first project as active if none selected
      const { activeProject } = get();
      const newActiveProject = activeProject || (projects.length > 0 ? projects[0] : null);

      set({
        projects,
        activeProject: newActiveProject,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Failed to load projects';
      set({
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  },

  // Set active project
  setActiveProject: (project: Project | null) => {
    set({ activeProject: project });
    
    // Store in localStorage for persistence
    if (project) {
      localStorage.setItem('activeProjectId', project.id);
    } else {
      localStorage.removeItem('activeProjectId');
    }
  },

  // Create project
  createProject: async (data: Partial<Project>) => {
    set({ isLoading: true, error: null });
    try {
      const project = await ProjectService.createProject(data);
      const { projects } = get();
      
      set({
        projects: [...projects, project],
        isLoading: false,
        error: null,
      });
      
      return project;
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Failed to create project';
      set({
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  },

  // Update project
  updateProject: async (projectId: string, data: Partial<Project>) => {
    set({ isLoading: true, error: null });
    try {
      const updatedProject = await ProjectService.updateProject(projectId, data);
      const { projects, activeProject } = get();
      
      const newProjects = projects.map((p) => (p.id === projectId ? updatedProject : p));
      const newActiveProject = activeProject?.id === projectId ? updatedProject : activeProject;

      set({
        projects: newProjects,
        activeProject: newActiveProject,
        isLoading: false,
        error: null,
      });
      
      return updatedProject;
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Failed to update project';
      set({
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  },

  // Delete project
  deleteProject: async (projectId: string) => {
    set({ isLoading: true, error: null });
    try {
      await ProjectService.deleteProject(projectId);
      const { projects, activeProject } = get();
      
      const newProjects = projects.filter((p) => p.id !== projectId);
      const newActiveProject = activeProject?.id === projectId ? null : activeProject;

      set({
        projects: newProjects,
        activeProject: newActiveProject,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Failed to delete project';
      set({
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },

  // Alias for consistency with other stores
  get fetchProjects() {
    return this.loadProjects;
  },
}));

export default useProjectStore;
