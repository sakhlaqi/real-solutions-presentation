/**
 * Protected Route Component
 * Handles route protection with authentication checks and session expiry detection.
 * 
 * Features:
 * - Redirects unauthenticated users to login
 * - Preserves intended destination for post-login redirect
 * - Shows loading state during auth verification
 * - Handles session expiry gracefully
 */

import React, { useEffect, useState, useCallback } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores';
import { TokenManager } from '../utils/tokenManager';
import { LoadingSpinner } from './LoadingSpinner';

export interface ProtectedRouteProps {
  children: React.ReactNode;
  /** Optional: Required roles for access (future RBAC support) */
  requiredRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
}) => {
  const { isAuthenticated, isLoading, loadUser, logout } = useAuthStore();
  const location = useLocation();
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  /**
   * Check for session validity on mount and periodically
   */
  const checkSession = useCallback(async () => {
    // If we have tokens but no authenticated state, try to restore session
    if (!isAuthenticated && TokenManager.hasValidSession()) {
      try {
        await loadUser();
      } catch (error) {
        console.error('Session restoration failed:', error);
        // Clear invalid tokens
        TokenManager.clearTokens();
      }
    }
    
    // If authenticated but tokens are invalid, log out
    if (isAuthenticated && !TokenManager.hasValidSession()) {
      console.warn('Session expired, logging out');
      await logout();
    }
    
    setIsCheckingSession(false);
  }, [isAuthenticated, loadUser, logout]);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  // Show loading while checking authentication state
  if (isLoading || isCheckingSession) {
    return (
      <LoadingSpinner 
        fullScreen 
        message="Verifying session..." 
      />
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    // Preserve the intended destination
    return (
      <Navigate 
        to="/login" 
        state={{ 
          from: location,
          message: TokenManager.getTokens() ? 'Your session has expired. Please log in again.' : undefined
        }} 
        replace 
      />
    );
  }

  // Future: Role-based access control
  // if (requiredRoles.length > 0) {
  //   const userRoles = useAuthStore.getState().user?.roles || [];
  //   const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));
  //   if (!hasRequiredRole) {
  //     return <Navigate to="/unauthorized" replace />;
  //   }
  // }

  return <>{children}</>;
};

export default ProtectedRoute;
