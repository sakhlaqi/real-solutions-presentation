/**
 * Login Page Component
 * Authentication form for accessing admin dashboard
 */

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore, useTenantStore } from '../stores';
import { Button, Input, Card, Heading, Text } from '@sakhlaqi/ui';
import './LoginPage.css';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((state) => state.login);
  const config = useTenantStore((state) => state.config);

  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Get the redirect path or default to /admin
  const from = (location.state as any)?.from?.pathname || '/admin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login(credentials);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="login-page">
      <Card className="login-card">
        <div className="login-header">
          <Heading level={2} className="login-title">
            {config?.branding.name || 'Admin'} Login
          </Heading>
          <Text size="md" color="secondary" className="login-subtitle">
            Sign in to access your dashboard
          </Text>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="login-error">
              <Text size="md" color="error">
                {error}
              </Text>
            </div>
          )}

          <Input
            type="email"
            name="email"
            label="Email"
            value={credentials.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
            autoComplete="email"
            disabled={isLoading}
          />

          <Input
            type="password"
            name="password"
            label="Password"
            value={credentials.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
            autoComplete="current-password"
            disabled={isLoading}
          />

          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className="login-footer">
          <a href="/" className="login-back-link">
            ← Back to Home
          </a>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
