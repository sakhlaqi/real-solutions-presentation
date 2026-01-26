/**
 * Mock Tenant Config for Local Development
 * 
 * This file demonstrates how to test the template routing system locally
 * without needing the backend API.
 * 
 * USAGE:
 * 1. Import this in your tenant store (for development only)
 * 2. Override the API call to return this mock data
 * 3. Test different routes and templates locally
 */

import type { TenantConfig } from '../types';
import type { PageConfig } from '@sakhlaqi/ui';

/**
 * Mock Tenant Configuration
 */
export const mockTenantConfig: TenantConfig = {
  id: 'demo-tenant-123',
  slug: 'demo',
  name: 'Demo Corporation',
  
  branding: {
    name: 'Demo Corp',
    logo: {
      light: '/logos/demo-light.svg',
      dark: '/logos/demo-dark.svg',
    },
    favicon: '/favicon.ico',
    tagline: 'Testing Templates & Routing',
  },
  
  theme: {
    metadata: {
      id: 'demo-theme',
      name: 'Demo Theme',
      version: '1.0.0',
      is_preset: true,
      available_modes: ['light', 'dark'],
      selected_modes: ['light'],
    },
    json: {
      palette: {
        primary: { main: '#1976d2' },
        secondary: { main: '#9c27b0' },
      },
      typography: {
        fontFamily: 'Roboto, sans-serif',
      },
    },
  } as any,
  
  featureFlags: {
    enableBlog: false,
    enablePricing: true,
    enableTestimonials: true,
  },
  
  /**
   * PAGE CONFIGURATIONS - JSON-driven page definitions
   */
  page_config: {
    version: '1.0.0',
    pages: {
      '/home': {
        template: 'landing-page',
        slots: {
          hero: {
            type: 'HeroSection',
            props: {
              title: 'Welcome to Demo Corp',
              subtitle: 'Testing templates and routing',
            },
          },
        },
      },
      '/login': {
        template: 'sign-in',
        slots: {
          main: {
            type: 'SignInForm',
            props: {
              title: 'Sign In',
            },
          },
        },
      },
    },
  },
  
  /**
   * ROUTES - This is what connects URLs to page JSON
   */
  routes: [
    // Landing Page - Homepage
    {
      path: '/',
      pagePath: '/home',
      title: 'Home',
      protected: false,
      layout: 'none',
      exact: true,
      order: 0,
    },
    
    // Sign-in Template - Login
    {
      path: '/login',
      pagePath: '/login',
      title: 'Login',
      protected: false,
      layout: 'none',
      exact: true,
      order: 1,
    },
    
    // Sign-in Template - Sign up
    {
      path: '/signup',
      pagePath: '/signup',
      title: 'Sign Up',
      protected: false,
      layout: 'none',
      exact: true,
      order: 2,
    },
    
    // Marketing Page - About
    {
      path: '/about',
      pagePath: '/about',
      title: 'About',
      protected: false,
      layout: 'none',
      exact: true,
      order: 3,
    },
    
    // Dashboard (protected)
    {
      path: '/dashboard',
      pagePath: '/dashboard',
      title: 'Dashboard',
      protected: true,
      layout: 'admin',
      exact: true,
      order: 10,
    },
  ],
};

/**
 * Mock UI Configuration
 * 
 * Maps pagePath (from routes) to actual page JSON
 */
export const mockUiConfig = {
  pages: {
    /**
     * Homepage - Landing Page Template
     */
    '/home': {
      template: 'landing-page',
      slots: {
        header: {
          type: 'Box',
          props: {
            style: {
              padding: '1rem 2rem',
              background: '#1976d2',
              color: 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            },
            children: [
              {
                type: 'Text',
                props: {
                  text: 'Demo Corporation',
                  style: { fontSize: '1.5rem', fontWeight: 'bold' },
                },
              },
              {
                type: 'Stack',
                props: {
                  direction: 'row',
                  spacing: 'md',
                  children: [
                    {
                      type: 'Button',
                      props: {
                        variant: 'text',
                        children: 'Features',
                        onClick: () => alert('Navigate to #features'),
                      },
                    },
                    {
                      type: 'Button',
                      props: {
                        variant: 'text',
                        children: 'Login',
                        onClick: () => (window.location.href = '/login'),
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        main: {
          type: 'Stack',
          props: {
            spacing: 'xl',
            children: [
              // Hero Section
              {
                type: 'Section',
                props: {
                  style: {
                    padding: '4rem 2rem',
                    textAlign: 'center',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                  },
                  children: {
                    type: 'Container',
                    props: {
                      children: [
                        {
                          type: 'Heading',
                          props: {
                            level: 1,
                            text: 'Welcome to Demo Corporation',
                            style: { marginBottom: '1rem' },
                          },
                        },
                        {
                          type: 'Text',
                          props: {
                            text: 'Experience the power of dynamic templates and routing',
                            variant: 'large',
                            style: { marginBottom: '2rem' },
                          },
                        },
                        {
                          type: 'Button',
                          props: {
                            variant: 'contained',
                            size: 'large',
                            children: 'Get Started',
                            onClick: () => (window.location.href = '/signup'),
                          },
                        },
                      ],
                    },
                  },
                },
              },
              
              // Features Section
              {
                type: 'Section',
                props: {
                  style: { padding: '4rem 2rem' },
                  children: {
                    type: 'Container',
                    props: {
                      children: [
                        {
                          type: 'Heading',
                          props: {
                            level: 2,
                            text: 'Key Features',
                            style: { textAlign: 'center', marginBottom: '3rem' },
                          },
                        },
                        {
                          type: 'Grid',
                          props: {
                            columns: { xs: 1, sm: 2, md: 3 },
                            spacing: 'lg',
                            children: [
                              {
                                type: 'Card',
                                props: {
                                  children: [
                                    {
                                      type: 'Heading',
                                      props: { level: 3, text: '🚀 Lightning Fast' },
                                    },
                                    {
                                      type: 'Text',
                                      props: { text: 'Built for speed and performance' },
                                    },
                                  ],
                                },
                              },
                              {
                                type: 'Card',
                                props: {
                                  children: [
                                    {
                                      type: 'Heading',
                                      props: { level: 3, text: '🛡️ Secure' },
                                    },
                                    {
                                      type: 'Text',
                                      props: { text: 'Enterprise-grade security' },
                                    },
                                  ],
                                },
                              },
                              {
                                type: 'Card',
                                props: {
                                  children: [
                                    {
                                      type: 'Heading',
                                      props: { level: 3, text: '📈 Scalable' },
                                    },
                                    {
                                      type: 'Text',
                                      props: { text: 'Grows with your business' },
                                    },
                                  ],
                                },
                              },
                            ],
                          },
                        },
                      ],
                    },
                  },
                },
              },
            ],
          },
        },
        footer: {
          type: 'Box',
          props: {
            style: {
              padding: '2rem',
              textAlign: 'center',
              background: '#f5f5f5',
              borderTop: '1px solid #e0e0e0',
            },
            children: {
              type: 'Text',
              props: {
                text: '© 2026 Demo Corporation. All rights reserved.',
                variant: 'small',
              },
            },
          },
        },
      },
    } as PageConfig,
    
    /**
     * Login Page - Sign-in Template
     */
    '/login': {
      template: 'sign-in',
      variant: 'centered',
      slots: {
        main: {
          type: 'Card',
          props: {
            style: { maxWidth: '400px', margin: '4rem auto', padding: '2rem' },
            children: [
              {
                type: 'Heading',
                props: {
                  level: 2,
                  text: 'Sign in to Demo',
                  style: { marginBottom: '0.5rem' },
                },
              },
              {
                type: 'Text',
                props: {
                  text: 'Enter your credentials to continue',
                  variant: 'small',
                  style: { marginBottom: '2rem', color: '#666' },
                },
              },
              {
                type: 'Form',
                props: {
                  children: [
                    {
                      type: 'Input',
                      props: {
                        label: 'Email',
                        type: 'email',
                        placeholder: 'you@example.com',
                        required: true,
                      },
                    },
                    {
                      type: 'Input',
                      props: {
                        label: 'Password',
                        type: 'password',
                        placeholder: '••••••••',
                        required: true,
                      },
                    },
                    {
                      type: 'Button',
                      props: {
                        variant: 'contained',
                        fullWidth: true,
                        children: 'Sign In',
                        onClick: () => alert('Sign in clicked (demo mode)'),
                      },
                    },
                  ],
                },
              },
              {
                type: 'Text',
                props: {
                  text: "Don't have an account? Sign up",
                  variant: 'small',
                  style: { marginTop: '1rem', textAlign: 'center' },
                  onClick: () => (window.location.href = '/signup'),
                },
              },
            ],
          },
        },
      },
    } as PageConfig,
    
    /**
     * Sign Up Page - Sign-in Template
     */
    '/signup': {
      template: 'sign-in',
      variant: 'centered',
      slots: {
        main: {
          type: 'Card',
          props: {
            style: { maxWidth: '400px', margin: '4rem auto', padding: '2rem' },
            children: [
              {
                type: 'Heading',
                props: {
                  level: 2,
                  text: 'Create your account',
                  style: { marginBottom: '2rem' },
                },
              },
              {
                type: 'Form',
                props: {
                  children: [
                    {
                      type: 'Input',
                      props: {
                        label: 'Full Name',
                        placeholder: 'John Doe',
                        required: true,
                      },
                    },
                    {
                      type: 'Input',
                      props: {
                        label: 'Email',
                        type: 'email',
                        placeholder: 'you@example.com',
                        required: true,
                      },
                    },
                    {
                      type: 'Input',
                      props: {
                        label: 'Password',
                        type: 'password',
                        placeholder: '••••••••',
                        required: true,
                      },
                    },
                    {
                      type: 'Button',
                      props: {
                        variant: 'contained',
                        fullWidth: true,
                        children: 'Sign Up',
                        onClick: () => alert('Sign up clicked (demo mode)'),
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      },
    } as PageConfig,
    
    /**
     * About Page - Marketing Page Template
     */
    '/about': {
      template: 'marketing-page',
      slots: {
        header: {
          type: 'Box',
          props: {
            style: {
              padding: '1rem 2rem',
              background: '#fff',
              borderBottom: '1px solid #e0e0e0',
            },
            children: {
              type: 'Text',
              props: {
                text: 'Demo Corporation',
                style: { fontSize: '1.5rem', fontWeight: 'bold' },
              },
            },
          },
        },
        main: {
          type: 'Container',
          props: {
            style: { padding: '4rem 2rem' },
            children: [
              {
                type: 'Heading',
                props: {
                  level: 1,
                  text: 'About Demo Corporation',
                  style: { marginBottom: '2rem' },
                },
              },
              {
                type: 'Text',
                props: {
                  text: 'We are building the future of web applications with dynamic templates and routing.',
                  style: { marginBottom: '2rem', fontSize: '1.25rem', lineHeight: 1.6 },
                },
              },
              {
                type: 'Heading',
                props: {
                  level: 2,
                  text: 'Our Mission',
                  style: { marginBottom: '1rem', marginTop: '3rem' },
                },
              },
              {
                type: 'Text',
                props: {
                  text: 'To empower businesses with flexible, scalable, and beautiful web applications.',
                  style: { lineHeight: 1.6 },
                },
              },
            ],
          },
        },
      },
    } as PageConfig,
  },
  
  version: '1.0.0',
  updatedAt: new Date().toISOString(),
};

/**
 * How to use in development:
 * 
 * In src/stores/tenantStore.ts:
 * 
 * import { mockTenantConfig, mockUiConfig } from '../examples/mock-tenant-config';
 * 
 * // In initializeTenant:
 * if (import.meta.env.DEV) {
 *   set({
 *     tenant: { id: mockTenantConfig.id, slug: mockTenantConfig.slug, ... },
 *     config: mockTenantConfig,
 *     isLoading: false,
 *     isInitialized: true,
 *   });
 *   return;
 * }
 * 
 * In src/hooks/useJsonPages.ts:
 * 
 * if (import.meta.env.DEV) {
 *   setPages(mockUiConfig.pages);
 *   setIsLoading(false);
 *   return;
 * }
 */
