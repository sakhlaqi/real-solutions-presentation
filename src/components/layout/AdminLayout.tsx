/**
 * Admin Layout Component
 * Connects routing and auth state to UI library layout
 * 
 * Responsibilities:
 * - Provide navigation data to UI library
 * - Handle logout behavior
 * - Manage routing via React Router Outlet
 * 
 * Does NOT own:
 * - Visual rendering (delegated to @sakhlaqi/ui)
 * - Layout styling (delegated to @sakhlaqi/ui)
 * - Responsive breakpoints (delegated to @sakhlaqi/ui)
 */

import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { AdminLayout as UIAdminLayout } from '@sakhlaqi/ui';
import { useAuthStore, useTenantStore } from '../../stores';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { config } = useTenantStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  // Navigation configuration - data only, no visual rendering
  const headerConfig = {
    brandName: `${config?.branding.name || 'Real Solutions'} Admin`,
    brandLink: '/admin',
    mainNav: [
      { label: 'Dashboard', path: '/admin' },
      { label: 'Projects', path: '/admin/projects' },
      { label: 'Settings', path: '/admin/settings' },
    ],
    userMenu: {
      email: user?.email || '',
      onLogout: handleLogout,
    },
  };

  const sidebarConfig = {
    menuItems: [
      { icon: '📊', label: 'Dashboard', path: '/admin' },
      { icon: '📁', label: 'Projects', path: '/admin/projects' },
      { icon: '🎨', label: 'Branding', path: '/admin/branding' },
      { icon: '📄', label: 'Landing Page', path: '/admin/landing-page' },
      { icon: '⚙️', label: 'Settings', path: '/admin/settings' },
      { divider: true },
      { icon: '🌐', label: 'View Public Site', path: '/' },
    ],
  };

  return (
    <UIAdminLayout 
      headerConfig={headerConfig}
      sidebarConfig={sidebarConfig}
      onNavigate={handleNavigation}
    >
      <Outlet />
    </UIAdminLayout>
  );
};

export default AdminLayout;
