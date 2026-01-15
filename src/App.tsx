/**
 * Main App Component
 * Sets up routing, theming, and bootstraps application
 */

import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeProvider';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ProtectedRoute } from './components/ProtectedRoute';
import { MainLayout, AdminLayout } from './components/layout';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { useAppBootstrap } from './hooks/useAppBootstrap';
import './styles/global.css';

const App: React.FC = () => {
  const { isInitialized, error } = useAppBootstrap();

  if (!isInitialized) {
    return <LoadingSpinner fullScreen message="Initializing application..." />;
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--color-error)' }}>Initialization Error</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Reload</button>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <BrowserRouter>
          <Suspense fallback={<LoadingSpinner fullScreen />}>
            <Routes>
              {/* Public routes with MainLayout */}
              <Route path="/" element={<MainLayout />}>
                <Route index element={<LandingPage />} />
              </Route>

              {/* Login page (standalone) */}
              <Route path="/login" element={<LoginPage />} />
              
              {/* Protected admin routes with AdminLayout */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<DashboardPage />} />
                <Route path="projects" element={
                  <div style={{ padding: '2rem' }}>
                    <h1>Projects</h1>
                    <p>Projects management page coming soon...</p>
                  </div>
                } />
                <Route path="settings" element={
                  <div style={{ padding: '2rem' }}>
                    <h1>Settings</h1>
                    <p>Settings page coming soon...</p>
                  </div>
                } />
                <Route path="branding" element={
                  <div style={{ padding: '2rem' }}>
                    <h1>Branding</h1>
                    <p>Branding editor coming soon...</p>
                  </div>
                } />
                <Route path="landing-page" element={
                  <div style={{ padding: '2rem' }}>
                    <h1>Landing Page</h1>
                    <p>Landing page editor coming soon...</p>
                  </div>
                } />
              </Route>
                
              {/* Catch all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
