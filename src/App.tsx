/**
 * Main App Component
 * Sets up routing, theming, and bootstraps application
 */

import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Spinner } from '@sakhlaqi/ui';
import { UiProviderBridge } from './app/UiProviderBridge';
import { ProtectedRoute } from './components/ProtectedRoute';
import { JsonPageRoute } from './components/JsonPageRoute';
import { useAppBootstrap } from './hooks/useAppBootstrap';
import './styles/global.css';

// Simple layout wrappers
const MainLayout = () => <Outlet />;
const AdminLayout = () => <Outlet />;

const App: React.FC = () => {
  const { isInitialized, error } = useAppBootstrap();

  if (!isInitialized) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: '1rem' }}>
        <div className="spinner" style={{ width: '48px', height: '48px', border: '4px solid #f3f3f3', borderTop: '4px solid #3498db', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        <p style={{ fontSize: '1rem', color: '#666' }}>Initializing application...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Initialization Error</h2>
        <p style={{ color: '#d32f2f' }}>{error}</p>
        <button onClick={() => window.location.reload()}>Reload</button>
      </div>
    );
  }

  return (
    <UiProviderBridge provider="mui">
      <BrowserRouter>
          <Suspense fallback={
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
              <Spinner size="large" />
            </div>
          }>
            <Routes>
              {/* Public routes with MainLayout */}
              <Route path="/" element={<MainLayout />}>
                <Route index element={<JsonPageRoute pagePath="/" pageTitle="Home" />} />
              </Route>

              {/* Login page (JSON-driven) */}
              <Route path="/login" element={<JsonPageRoute pagePath="/login" pageTitle="Login" />} />
              
              {/* Protected admin routes with AdminLayout */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                {/* JSON-driven pages - rendered from tenant UI config */}
                <Route index element={<JsonPageRoute pagePath="/dashboard" pageTitle="Dashboard" />} />
                <Route path="projects" element={<JsonPageRoute pagePath="/projects" pageTitle="Projects" />} />
                <Route path="projects/:id" element={<JsonPageRoute pagePath="/projects/:id" pageTitle="Project Details" />} />
                <Route path="employees" element={<JsonPageRoute pagePath="/employees" pageTitle="Employees" />} />
                <Route path="employees/:id" element={<JsonPageRoute pagePath="/employees/:id" pageTitle="Employee Details" />} />
                <Route path="tasks" element={<JsonPageRoute pagePath="/tasks" pageTitle="Tasks" />} />
                <Route path="settings" element={<JsonPageRoute pagePath="/settings" pageTitle="Settings" />} />
                <Route path="branding" element={<JsonPageRoute pagePath="/branding" pageTitle="Branding" />} />
                <Route path="landing-page" element={<JsonPageRoute pagePath="/landing-page" pageTitle="Landing Page Editor" />} />
              </Route>
                
              {/* Catch all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </UiProviderBridge>
  );
};

export default App;
