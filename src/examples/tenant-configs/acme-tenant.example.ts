/**
 * Acme Corporation - Example Tenant Configuration
 * 
 * This file demonstrates how to configure a tenant to use specific
 * templates for different routes in the dynamic routing system.
 * 
 * FLOW:
 * 1. User visits a route (e.g., "/" or "/login")
 * 2. DynamicRoutes component matches the route to a RouteConfig
 * 3. JsonPageRoute component fetches the page JSON from tenant UI config
 * 4. PageRenderer renders the page using the appropriate template/sections
 * 
 * In production, this configuration would be stored in the database
 * and loaded via API: GET /api/v1/tenants/{slug}/config/
 */

import type { TenantConfig } from '../../types';

/**
 * Acme Tenant Configuration
 * 
 * This shows how to configure routes to use different templates:
 * - "/" - Landing Page Template (public)
 * - "/login" - Sign-in Template (public)
 * - "/about" - Marketing Page Template (public)
 */
export const acmeTenantConfig: TenantConfig = {
  id: 'acme-corp-123',
  slug: 'acme-corp',
  name: 'Acme Corporation',
  
  // Branding
  branding: {
    name: 'Acme Corporation',
    logo: {
      light: '/logos/acme-light.png',
      dark: '/logos/acme-dark.png',
    },
    favicon: '/favicon-acme.ico',
    tagline: 'Building the Future',
    description: 'Enterprise solutions for modern businesses',
  },
  
  // Theme (will be resolved from the API/database)
  theme: {
    metadata: {
      id: 'acme-theme',
      name: 'Acme Theme',
      version: '1.0.0',
      is_preset: true,
      available_modes: ['light', 'dark'],
      selected_modes: ['light'],
    },
    json: {
      palette: {
        primary: { main: '#ff5722' },
        secondary: { main: '#ff9800' },
      },
      typography: {
        fontFamily: 'Inter, sans-serif',
      },
    },
  } as any,
  
  // Feature flags
  featureFlags: {
    enableBlog: true,
    enablePricing: true,
    enableTestimonials: true,
    enableFAQ: true,
  },
  
  // Page configurations (JSON-driven pages)
  page_config: {
    version: '1.0.0',
    pages: {
      '/home': {
        template: 'landing-page',
        slots: {
          hero: {
            type: 'HeroSection',
            props: {
              title: 'Welcome to Acme Corporation',
              subtitle: 'Building the future of enterprise software',
              ctaText: 'Get Started',
              ctaLink: '/signup',
              backgroundImage: '/images/hero-bg.jpg',
            },
          },
          features: {
            type: 'FeaturesSection',
            props: {
              title: 'Our Features',
              features: [
                { icon: 'rocket', title: 'Fast', description: 'Lightning-fast performance' },
                { icon: 'shield', title: 'Secure', description: 'Enterprise-grade security' },
                { icon: 'chart', title: 'Scalable', description: 'Grows with your business' },
              ],
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
              submitText: 'Sign In',
            },
          },
        },
      },
    },
  },
  
  /**
   * DYNAMIC ROUTES CONFIGURATION
   * 
   * This is the key part that connects templates to routes!
   * Each route defines:
   * - path: The URL path
   * - pagePath: The key to look up the page JSON in tenant UI config
   * - protected: Whether authentication is required
   * - layout: Which layout wrapper to use
   */
  routes: [
    // Home page - Landing Page Template
    {
      path: '/',
      pagePath: '/home',
      title: 'Home',
      protected: false,
      layout: 'none', // No wrapper, full-page template
      exact: true,
      order: 0,
      meta: {
        template: 'landing-page',
        description: 'Acme Corporation homepage',
      },
    },
    
    // Login page - Sign-in Template
    {
      path: '/login',
      pagePath: '/login',
      title: 'Sign In',
      protected: false,
      layout: 'none', // No wrapper, full-page auth template
      exact: true,
      order: 1,
      meta: {
        template: 'sign-in',
        variant: 'side-by-side',
      },
    },
    
    // Sign up page - Sign-in Template (with variant)
    {
      path: '/signup',
      pagePath: '/signup',
      title: 'Create Account',
      protected: false,
      layout: 'none',
      exact: true,
      order: 2,
      meta: {
        template: 'sign-in',
        variant: 'centered',
      },
    },
    
    // About page - Marketing Page Template
    {
      path: '/about',
      pagePath: '/about',
      title: 'About Us',
      protected: false,
      layout: 'none',
      exact: true,
      order: 3,
      meta: {
        template: 'marketing-page',
      },
    },
    
    // Dashboard (protected, different template)
    {
      path: '/dashboard',
      pagePath: '/dashboard',
      title: 'Dashboard',
      protected: true,
      layout: 'admin',
      exact: true,
      order: 10,
      meta: {
        template: 'dashboard',
      },
    },
  ],
  
  // Custom settings (optional)
  customSettings: {
    analytics: {
      googleAnalyticsId: 'UA-XXXXX-Y',
    },
    support: {
      email: 'support@acme.com',
      phone: '+1-555-ACME',
    },
  },
};

/**
 * TENANT UI CONFIG - Page JSON Configurations
 * 
 * This is what gets returned from:
 * GET /api/v1/tenants/acme-corp/ui-config/
 * 
 * Each key corresponds to a `pagePath` in the routes config above.
 * The PageRenderer component uses these JSON configs to render the actual page.
 */
export const acmeTenantUiConfig = {
  pages: {
    // Home page - Landing Page Template
    '/home': {
      template: 'landing-page',
      slots: {
        header: {
          type: 'Navbar',
          props: {
            logo: '/logos/acme-light.png',
            links: [
              { label: 'Features', href: '#features' },
              { label: 'Pricing', href: '#pricing' },
              { label: 'About', href: '/about' },
              { label: 'Login', href: '/login' },
            ],
          },
        },
        main: {
          type: 'LandingPage',
          props: {
            sections: [
              {
                id: 'hero',
                type: 'hero',
                props: {
                  title: 'Welcome to Acme Corporation',
                  subtitle: 'Building the future of enterprise software',
                  primaryAction: {
                    label: 'Get Started',
                    href: '/signup',
                  },
                  secondaryAction: {
                    label: 'Learn More',
                    href: '/about',
                  },
                  backgroundImage: '/images/hero-bg.jpg',
                },
              },
              {
                id: 'features',
                type: 'features',
                props: {
                  title: 'Why Choose Acme?',
                  features: [
                    {
                      icon: 'rocket',
                      title: 'Lightning Fast',
                      description: 'Built for speed and performance',
                    },
                    {
                      icon: 'shield',
                      title: 'Secure by Design',
                      description: 'Enterprise-grade security',
                    },
                    {
                      icon: 'chart',
                      title: 'Scales with You',
                      description: 'From startup to enterprise',
                    },
                  ],
                },
              },
              {
                id: 'pricing',
                type: 'pricing',
                props: {
                  title: 'Simple, Transparent Pricing',
                  plans: [
                    {
                      name: 'Starter',
                      price: '$29',
                      period: 'per month',
                      features: [
                        'Up to 10 users',
                        'Basic features',
                        'Email support',
                      ],
                      cta: { label: 'Start Free Trial', href: '/signup?plan=starter' },
                    },
                    {
                      name: 'Professional',
                      price: '$99',
                      period: 'per month',
                      featured: true,
                      features: [
                        'Up to 100 users',
                        'Advanced features',
                        'Priority support',
                        'Custom integrations',
                      ],
                      cta: { label: 'Start Free Trial', href: '/signup?plan=pro' },
                    },
                    {
                      name: 'Enterprise',
                      price: 'Custom',
                      period: 'contact sales',
                      features: [
                        'Unlimited users',
                        'All features',
                        'Dedicated support',
                        'SLA guarantee',
                      ],
                      cta: { label: 'Contact Sales', href: '/contact' },
                    },
                  ],
                },
              },
            ],
          },
        },
        footer: {
          type: 'Footer',
          props: {
            logo: '/logos/acme-light.png',
            tagline: 'Building the Future',
            sections: [
              {
                title: 'Product',
                links: [
                  { label: 'Features', href: '/features' },
                  { label: 'Pricing', href: '/#pricing' },
                  { label: 'FAQ', href: '/faq' },
                ],
              },
              {
                title: 'Company',
                links: [
                  { label: 'About', href: '/about' },
                  { label: 'Blog', href: '/blog' },
                  { label: 'Careers', href: '/careers' },
                ],
              },
            ],
            copyright: '© 2026 Acme Corporation. All rights reserved.',
          },
        },
      },
    },
    
    // Login page - Sign-in Template
    '/login': {
      template: 'sign-in',
      variant: 'side-by-side',
      slots: {
        main: {
          type: 'SignInForm',
          props: {
            title: 'Sign in to Acme',
            subtitle: 'Welcome back! Please enter your details.',
            providers: ['email', 'google', 'microsoft'],
            forgotPasswordLink: '/forgot-password',
            signUpLink: '/signup',
            termsLink: '/terms',
            privacyLink: '/privacy',
            onSubmit: 'auth:login', // Behavior ID
          },
        },
        side: {
          type: 'Card',
          props: {
            variant: 'image',
            backgroundImage: '/images/login-side.jpg',
            overlay: true,
            content: {
              title: 'Start your journey with Acme',
              description: 'Join thousands of teams already using our platform.',
              testimonial: {
                quote: 'Acme has transformed how we work!',
                author: 'Jane Smith',
                company: 'TechCorp',
              },
            },
          },
        },
      },
    },
    
    // Sign up page
    '/signup': {
      template: 'sign-in',
      variant: 'centered',
      slots: {
        main: {
          type: 'SignUpForm',
          props: {
            title: 'Create your account',
            subtitle: 'Get started with Acme today.',
            providers: ['email', 'google', 'microsoft'],
            signInLink: '/login',
            termsLink: '/terms',
            privacyLink: '/privacy',
            onSubmit: 'auth:register',
          },
        },
      },
    },
    
    // About page - Marketing Page Template
    '/about': {
      template: 'marketing-page',
      slots: {
        header: {
          type: 'Navbar',
          props: {
            logo: '/logos/acme-light.png',
            links: [
              { label: 'Home', href: '/' },
              { label: 'Features', href: '/#features' },
              { label: 'Pricing', href: '/#pricing' },
              { label: 'Login', href: '/login' },
            ],
          },
        },
        main: {
          type: 'Stack',
          props: {
            spacing: 'xl',
            children: [
              {
                type: 'Section',
                props: {
                  variant: 'hero',
                  children: {
                    type: 'Container',
                    props: {
                      children: [
                        {
                          type: 'Heading',
                          props: { level: 1, text: 'About Acme Corporation' },
                        },
                        {
                          type: 'Text',
                          props: {
                            variant: 'large',
                            text: 'We are building the future of enterprise software.',
                          },
                        },
                      ],
                    },
                  },
                },
              },
              {
                type: 'Section',
                props: {
                  children: {
                    type: 'Container',
                    props: {
                      children: [
                        {
                          type: 'Heading',
                          props: { level: 2, text: 'Our Mission' },
                        },
                        {
                          type: 'Text',
                          props: {
                            text: 'To empower businesses with cutting-edge technology...',
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
          type: 'Footer',
          props: {
            logo: '/logos/acme-light.png',
            copyright: '© 2026 Acme Corporation',
          },
        },
      },
    },
  },
  
  version: '1.0.0',
  updatedAt: '2026-01-25T00:00:00Z',
};

export default acmeTenantConfig;
