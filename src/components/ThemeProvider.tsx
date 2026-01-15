/**
 * Theme Provider Component
 * Applies tenant-specific theme using CSS variables
 */

import React, { useEffect } from 'react';
import { useTenantStore } from '../stores';
import type { TenantTheme } from '../types';

interface ThemeProviderProps {
  children: React.ReactNode;
}

/**
 * Apply theme to document root
 */
const applyTheme = (theme: TenantTheme): void => {
  const root = document.documentElement;

  // Apply color variables
  root.style.setProperty('--color-primary', theme.colors.primary);
  root.style.setProperty('--color-secondary', theme.colors.secondary);
  root.style.setProperty('--color-accent', theme.colors.accent);
  root.style.setProperty('--color-background', theme.colors.background);
  root.style.setProperty('--color-surface', theme.colors.surface);
  root.style.setProperty('--color-text-primary', theme.colors.text.primary);
  root.style.setProperty('--color-text-secondary', theme.colors.text.secondary);
  root.style.setProperty('--color-text-inverse', theme.colors.text.inverse);
  root.style.setProperty('--color-error', theme.colors.error);
  root.style.setProperty('--color-success', theme.colors.success);
  root.style.setProperty('--color-warning', theme.colors.warning);

  // Apply font variables
  root.style.setProperty('--font-primary', theme.fonts.primary);
  root.style.setProperty('--font-secondary', theme.fonts.secondary);
  root.style.setProperty('--font-size-xs', theme.fonts.sizes.xs);
  root.style.setProperty('--font-size-sm', theme.fonts.sizes.sm);
  root.style.setProperty('--font-size-base', theme.fonts.sizes.base);
  root.style.setProperty('--font-size-lg', theme.fonts.sizes.lg);
  root.style.setProperty('--font-size-xl', theme.fonts.sizes.xl);
  root.style.setProperty('--font-size-2xl', theme.fonts.sizes['2xl']);
  root.style.setProperty('--font-size-3xl', theme.fonts.sizes['3xl']);

  // Apply spacing variables
  root.style.setProperty('--spacing-xs', theme.spacing.xs);
  root.style.setProperty('--spacing-sm', theme.spacing.sm);
  root.style.setProperty('--spacing-md', theme.spacing.md);
  root.style.setProperty('--spacing-lg', theme.spacing.lg);
  root.style.setProperty('--spacing-xl', theme.spacing.xl);
  root.style.setProperty('--spacing-2xl', theme.spacing['2xl']);

  // Apply border radius variables
  root.style.setProperty('--radius-sm', theme.borderRadius.sm);
  root.style.setProperty('--radius-md', theme.borderRadius.md);
  root.style.setProperty('--radius-lg', theme.borderRadius.lg);
  root.style.setProperty('--radius-full', theme.borderRadius.full);

  // Apply shadow variables
  root.style.setProperty('--shadow-sm', theme.shadows.sm);
  root.style.setProperty('--shadow-md', theme.shadows.md);
  root.style.setProperty('--shadow-lg', theme.shadows.lg);
};

/**
 * Get default theme
 */
const getDefaultTheme = (): TenantTheme => ({
  colors: {
    primary: '#3b82f6',
    secondary: '#8b5cf6',
    accent: '#06b6d4',
    background: '#ffffff',
    surface: '#f9fafb',
    text: {
      primary: '#111827',
      secondary: '#6b7280',
      inverse: '#ffffff',
    },
    error: '#ef4444',
    success: '#10b981',
    warning: '#f59e0b',
  },
  fonts: {
    primary: 'Inter, system-ui, -apple-system, sans-serif',
    secondary: 'Georgia, serif',
    sizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
    },
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '1rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
  },
});

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { config } = useTenantStore();

  useEffect(() => {
    const theme = config?.theme || getDefaultTheme();
    applyTheme(theme);
  }, [config?.theme]);

  return <>{children}</>;
};

export default ThemeProvider;
