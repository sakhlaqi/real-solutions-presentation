/**
 * Project API Service
 * Handles all project-related API calls
 */

import { apiClient } from './client';
import type { Project } from '../types';

export class ProjectService {
  /**
   * Get all projects for current tenant
   */
  static async getProjects(): Promise<Project[]> {
    return apiClient.get('/projects/');
  }

  /**
   * Get project by ID
   */
  static async getProject(projectId: string): Promise<Project> {
    return apiClient.get(`/projects/${projectId}/`);
  }

  /**
   * Create new project
   */
  static async createProject(data: Partial<Project>): Promise<Project> {
    return apiClient.post('/projects/', data);
  }

  /**
   * Update project
   */
  static async updateProject(projectId: string, data: Partial<Project>): Promise<Project> {
    return apiClient.patch(`/projects/${projectId}/`, data);
  }

  /**
   * Delete project
   */
  static async deleteProject(projectId: string): Promise<void> {
    return apiClient.delete(`/projects/${projectId}/`);
  }
}

export default ProjectService;
