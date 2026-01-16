/**
 * Footer Component
 * Application footer
 */

import React from 'react';
import { Heading, Text } from '@sakhlaqi/ui';
import { useTenantStore } from '../../stores';
import './Footer.css';

export const Footer: React.FC = () => {
  const { config } = useTenantStore();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-brand">
          <Heading level={3}>{config?.branding.name || 'Real Solutions'}</Heading>
          {config?.branding.tagline && <Text size="md">{config.branding.tagline}</Text>}
        </div>
        
        <div className="footer-links">
          <div className="footer-column">
            <Heading level={4}>Product</Heading>
            <a href="/features">Features</a>
            <a href="/pricing">Pricing</a>
            <a href="/docs">Documentation</a>
          </div>
          
          <div className="footer-column">
            <Heading level={4}>Company</Heading>
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
            <a href="/careers">Careers</a>
          </div>
          
          <div className="footer-column">
            <Heading level={4}>Legal</Heading>
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="container">
          <Text size="sm">&copy; {currentYear} {config?.branding.name}. All rights reserved.</Text>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
