/**
 * Header Component
 * Connects auth/tenant state to UI library header
 * 
 * Responsibilities:
 * - Provide navigation data
 * - Handle auth actions (logout)
 * - Manage navigation behavior
 * 
 * Does NOT own:
 * - Visual rendering (delegated to @sakhlaqi/ui)
 * - Layout styling (delegated to @sakhlaqi/ui)
 * - Responsive behavior (delegated to @sakhlaqi/ui)
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header as UIHeader } from '@sakhlaqi/ui';
import { useAuthStore, useTenantStore } from '../../stores';

export const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const { config } = useTenantStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  // Header configuration - data only
  const headerConfig = {
    brand: {
      name: config?.branding.name || 'Real Solutions',
      logo: config?.branding.logo?.light,
      link: '/',
    },
    navigation: isAuthenticated ? [
      { label: 'Admin Dashboard', path: '/admin' },
    ] : [],
    userMenu: isAuthenticated ? {
      email: user?.email || '',
      onLogout: handleLogout,
    } : {
      loginLink: '/login',
      loginLabel: 'Admin Login',
    },
  };

  return <UIHeader config={headerConfig} onNavigate={handleNavigation} />;
};

export default Header;
