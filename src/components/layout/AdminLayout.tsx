/**
 * Admin Layout Component
 * Layout for authenticated admin dashboard pages
 */

import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAuthStore, useTenantStore } from '../../stores';
import { Button } from '@sakhlaqi/ui';
import './AdminLayout.css';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { config } = useTenantStore();

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  return (
    <div className="admin-layout">
      {/* Admin Header */}
      <header className="admin-header">
        <div className="admin-header-content">
          <div className="admin-logo">
            <Link to="/admin">
              {config?.branding.name} Admin
            </Link>
          </div>

          <nav className="admin-nav">
            <Link to="/admin" className="admin-nav-link">
              Dashboard
            </Link>
            <Link to="/admin/projects" className="admin-nav-link">
              Projects
            </Link>
            <Link to="/admin/settings" className="admin-nav-link">
              Settings
            </Link>
          </nav>

          <div className="admin-user-menu">
            <span className="admin-user-email">{user?.email}</span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Admin Sidebar */}
      <aside className="admin-sidebar">
        <nav className="admin-sidebar-nav">
          <Link to="/admin" className="admin-sidebar-link">
            📊 Dashboard
          </Link>
          <Link to="/admin/projects" className="admin-sidebar-link">
            📁 Projects
          </Link>
          <Link to="/admin/branding" className="admin-sidebar-link">
            🎨 Branding
          </Link>
          <Link to="/admin/landing-page" className="admin-sidebar-link">
            📄 Landing Page
          </Link>
          <Link to="/admin/settings" className="admin-sidebar-link">
            ⚙️ Settings
          </Link>
          <div className="admin-sidebar-divider" />
          <Link to="/" className="admin-sidebar-link">
            🌐 View Public Site
          </Link>
        </nav>
      </aside>

      {/* Admin Main Content */}
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
