/**
 * Main App Component
 * Sets up routing, theming, and bootstraps application
 */

import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, UIProvider, ErrorBoundary, Spinner, Heading, Text, Button } from '@sakhlaqi/ui';
import { ProtectedRoute } from './components/ProtectedRoute';
import { MainLayout, AdminLayout } from './components/layout';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ComponentShowcase } from './pages/ComponentShowcase';
import { useAppBootstrap } from './hooks/useAppBootstrap';
import './styles/global.css';

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
    <ErrorBoundary>
      <UIProvider defaultProvider="mui" defaultTheme={{ mode: 'light' }}>
        <ThemeProvider>
          <BrowserRouter>
          <Suspense fallback={
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
              <Spinner size="large" />
            </div>
          }>
            <Routes>
              {/* Public routes with MainLayout */}
              <Route path="/" element={<MainLayout />}>
                <Route index element={<LandingPage />} />
                <Route path="components" element={<ComponentShowcase />} />
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
                    <Heading level={1}>Projects</Heading>
                    <Text size="md">Projects management page coming soon...</Text>
                  </div>
                } />
                <Route path="settings" element={
                  <div style={{ padding: '2rem' }}>
                    <Heading level={1}>Settings</Heading>
                    <Text size="md">Settings page coming soon...</Text>
                  </div>
                } />
                <Route path="branding" element={
                  <div style={{ padding: '2rem' }}>
                    <Heading level={1}>Branding</Heading>
                    <Text size="md">Branding editor coming soon...</Text>
                  </div>
                } />
                <Route path="landing-page" element={
                  <div style={{ padding: '2rem' }}>
                    <Heading level={1}>Landing Page</Heading>
                    <Text size="md">Landing page editor coming soon...</Text>
                  </div>
                } />
              </Route>
                
              {/* Catch all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ThemeProvider>
      </UIProvider>
    </ErrorBoundary>
  );
};

export default App;
