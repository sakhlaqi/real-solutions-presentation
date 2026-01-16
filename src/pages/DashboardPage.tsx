/**
 * Admin Dashboard Page
 * Overview dashboard for admin users
 */

import React, { useEffect } from 'react';
import { useAuthStore, useTenantStore, useProjectStore } from '../stores';
import { Card, Text } from '../components/base';
import './DashboardPage.css';

export const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const { config } = useTenantStore();
  const { projects, fetchProjects, isLoading } = useProjectStore();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Ensure projects is always an array
  const projectsList = Array.isArray(projects) ? projects : [];

  const stats = [
    {
      label: 'Total Projects',
      value: projectsList.length,
      icon: '📁',
    },
    {
      label: 'Active Projects',
      value: projectsList.filter((p) => p.status === 'active').length,
      icon: '✅',
    },
    {
      label: 'Completed Projects',
      value: projectsList.filter((p) => p.status === 'completed').length,
      icon: '🎉',
    },
    {
      label: 'Archived Projects',
      value: projectsList.filter((p) => p.status === 'archived').length,
      icon: '📦',
    },
  ];

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <Text variant="h1">Dashboard</Text>
        <Text variant="body" color="secondary">
          Welcome back, {user?.email}!
        </Text>
      </div>

      {/* Stats Grid */}
      <div className="dashboard-stats">
        {stats.map((stat) => (
          <Card key={stat.label} className="stat-card">
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-content">
              <Text variant="h2" className="stat-value">
                {stat.value}
              </Text>
              <Text variant="body" color="secondary" className="stat-label">
                {stat.label}
              </Text>
            </div>
          </Card>
        ))}
      </div>

      {/* Tenant Info */}
      <Card className="tenant-info-card">
        <Text variant="h3" className="section-title">
          Tenant Information
        </Text>
        <div className="tenant-info-grid">
          <div className="info-item">
            <Text variant="body" color="secondary">
              Tenant Name
            </Text>
            <Text variant="body" weight={600}>
              {config?.branding.name || 'N/A'}
            </Text>
          </div>
          <div className="info-item">
            <Text variant="body" color="secondary">
              Tagline
            </Text>
            <Text variant="body" weight={600}>
              {config?.branding.tagline || 'N/A'}
            </Text>
          </div>
          <div className="info-item">
            <Text variant="body" color="secondary">
              Theme Mode
            </Text>
            <Text variant="body" weight={600}>
              {config?.theme.mode || 'light'}
            </Text>
          </div>
        </div>
      </Card>

      {/* Recent Projects */}
      <Card className="recent-projects-card">
        <Text variant="h3" className="section-title">
          Recent Projects
        </Text>
        {isLoading ? (
          <Text variant="body" color="secondary">
            Loading projects...
          </Text>
        ) : projectsList.length === 0 ? (
          <Text variant="body" color="secondary">
            No projects yet. Create your first project!
          </Text>
        ) : (
          <div className="projects-list">
            {projectsList.slice(0, 5).map((project) => (
              <div key={project.id} className="project-item">
                <div className="project-info">
                  <Text variant="body" weight={600}>
                    {project.name}
                  </Text>
                  <Text variant="small" color="secondary">
                    {project.description || 'No description'}
                  </Text>
                </div>
                <div className={`project-status status-${project.status}`}>
                  {project.status}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default DashboardPage;
