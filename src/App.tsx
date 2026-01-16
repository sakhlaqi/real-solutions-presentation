/**
 * Main App Component
 * Sets up routing, theming, and bootstraps application
 */

import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, ErrorBoundary, Spinner, Heading, Text, Button } from '@sakhlaqi/ui';
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
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: '1rem' }}>
        <Spinner size="lg" />
        <Text size="md">Initializing application...</Text>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <Heading level={2}>Initialization Error</Heading>
        <Text size="md" color="error">{error}</Text>
        <Button onClick={() => window.location.reload()}>Reload</Button>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <BrowserRouter>
          <Suspense fallback={
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
              <Spinner size="lg" />
            </div>
          }>
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
    </ErrorBoundary>
  );
};

export default App;
