/**
 * Footer Component
 * Connects tenant state to UI library footer
 * 
 * Responsibilities:
 * - Provide footer data (links, brand info)
 * 
 * Does NOT own:
 * - Visual rendering (delegated to @sakhlaqi/ui)
 * - Layout styling (delegated to @sakhlaqi/ui)
 * - Responsive behavior (delegated to @sakhlaqi/ui)
 */

import React from 'react';
import { Footer as UIFooter } from '@sakhlaqi/ui';
import { useTenantStore } from '../../stores';

export const Footer: React.FC = () => {
  const { config } = useTenantStore();
  const currentYear = new Date().getFullYear();

  // Footer configuration - data only
  const footerConfig = {
    brand: {
      name: config?.branding.name || 'Real Solutions',
      tagline: config?.branding.tagline,
    },
    linkColumns: [
      {
        title: 'Product',
        links: [
          { label: 'Features', href: '/features' },
          { label: 'Pricing', href: '/pricing' },
          { label: 'Documentation', href: '/docs' },
        ],
      },
      {
        title: 'Company',
        links: [
          { label: 'About', href: '/about' },
          { label: 'Contact', href: '/contact' },
          { label: 'Careers', href: '/careers' },
        ],
      },
      {
        title: 'Legal',
        links: [
          { label: 'Privacy', href: '/privacy' },
          { label: 'Terms', href: '/terms' },
        ],
      },
    ],
    copyright: `© ${currentYear} ${config?.branding.name}. All rights reserved.`,
  };

  return <UIFooter config={footerConfig} />;
};

export default Footer;
