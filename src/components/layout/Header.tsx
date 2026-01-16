/**
 * Header Component
 * Application header with navigation
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Text } from '@sakhlaqi/ui';
import { useAuthStore, useTenantStore } from '../../stores';
import './Header.css';

export const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const { config } = useTenantStore();

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  return (
    <header className="header">
      <div className="container header-content">
        <Link to="/" className="header-logo">
          {config?.branding.logo.light ? (
            <img src={config.branding.logo.light} alt={config.branding.name} />
          ) : (
            <span className="header-logo-text">{config?.branding.name || 'Real Solutions'}</span>
          )}
        </Link>

        <nav className="header-nav">
          {isAuthenticated ? (
            <>
              <Link to="/admin" className="header-link">
                Admin Dashboard
              </Link>
              <Text size="sm" className="header-user">{user?.email}</Text>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Admin Login
                </Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
