/**
 * Footer Component
 * Application footer
 */

import React from 'react';
import { useTenantStore } from '../../stores';
import './Footer.css';

export const Footer: React.FC = () => {
  const { config } = useTenantStore();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-brand">
          <h3>{config?.branding.name || 'Real Solutions'}</h3>
          {config?.branding.tagline && <p>{config.branding.tagline}</p>}
        </div>
        
        <div className="footer-links">
          <div className="footer-column">
            <h4>Product</h4>
            <a href="/features">Features</a>
            <a href="/pricing">Pricing</a>
            <a href="/docs">Documentation</a>
          </div>
          
          <div className="footer-column">
            <h4>Company</h4>
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
            <a href="/careers">Careers</a>
          </div>
          
          <div className="footer-column">
            <h4>Legal</h4>
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="container">
          <p>&copy; {currentYear} {config?.branding.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
