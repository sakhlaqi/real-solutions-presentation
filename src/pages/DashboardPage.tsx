/**
 * Admin Dashboard Page
 * Overview dashboard for admin users
 */

import React, { useEffect } from 'react';
import { useAuthStore, useTenantStore, useProjectStore } from '../stores';
import { Card, Heading, Text } from '@sakhlaqi/ui';
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
        <Heading level={1}>Dashboard</Heading>
        <Text size="md" color="secondary">
          Welcome back, {user?.email}!
        </Text>
      </div>

      {/* Stats Grid */}
      <div className="dashboard-stats">
        {stats.map((stat) => (
          <Card key={stat.label} className="stat-card">
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-content">
              <Heading level={2} className="stat-value">
                {stat.value}
              </Heading>
              <Text size="md" color="secondary" className="stat-label">
                {stat.label}
              </Text>
            </div>
          </Card>
        ))}
      </div>

      {/* Tenant Info */}
      <Card className="tenant-info-card">
        <Heading level={3} className="section-title">
          Tenant Information
        </Heading>
        <div className="tenant-info-grid">
          <div className="info-item">
            <Text size="md" color="secondary">
              Tenant Name
            </Text>
            <Text size="md" weight="semibold">
              {config?.branding.name || 'N/A'}
            </Text>
          </div>
          <div className="info-item">
            <Text size="md" color="secondary">
              Tagline
            </Text>
            <Text size="md" weight="semibold">
              {config?.branding.tagline || 'N/A'}
            </Text>
          </div>
          <div className="info-item">
            <Text size="md" color="secondary">
              Theme Mode
            </Text>
            <Text size="md" weight="semibold">
              light
            </Text>
          </div>
        </div>
      </Card>

      {/* Recent Projects */}
      <Card className="recent-projects-card">
        <Heading level={3} className="section-title">
          Recent Projects
        </Heading>
        {isLoading ? (
          <Text size="md" color="secondary">
            Loading projects...
          </Text>
        ) : projectsList.length === 0 ? (
          <Text size="md" color="secondary">
            No projects yet. Create your first project!
          </Text>
        ) : (
          <div className="projects-list">
            {projectsList.slice(0, 5).map((project) => (
              <div key={project.id} className="project-item">
                <div className="project-info">
                  <Text size="md" weight="semibold">
                    {project.name}
                  </Text>
                  <Text size="sm" color="secondary">
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
