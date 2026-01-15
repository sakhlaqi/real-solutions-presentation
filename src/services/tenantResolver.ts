/**
 * Tenant Resolution Service
 * Extracts tenant slug from subdomain and provides tenant context
 */

import { config } from '../config';

export class TenantResolver {
  /**
   * Extract tenant slug from hostname
   * Example: tenant1.example.com -> tenant1
   * localhost -> defaultTenantSlug
   */
  static getTenantSlug(): string {
    const hostname = window.location.hostname;
    
    // Extract subdomain as tenant slug
    const parts = hostname.split('.');
    
    // Check for subdomain on localhost (e.g., acme.localhost)
    if (parts.length >= 2 && (parts[parts.length - 1] === 'localhost' || hostname.includes('.localhost'))) {
      // Has subdomain on localhost (e.g., acme.localhost)
      if (parts[0] !== 'localhost') {
        return parts[0];
      }
    }
    
    // Handle localhost development without subdomain
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      // Check for tenant in query params for local development
      const params = new URLSearchParams(window.location.search);
      const tenantParam = params.get('tenant');
      return tenantParam || config.defaultTenantSlug;
    }
    
    // If hostname has at least 3 parts (subdomain.domain.tld)
    if (parts.length >= 3) {
      return parts[0];
    }
    
    // If no subdomain, use default
    return config.defaultTenantSlug;
  }

  /**
   * Validate tenant slug format
   */
  static isValidSlug(slug: string): boolean {
    // Slug should be lowercase, alphanumeric with hyphens
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    return slugRegex.test(slug) && slug.length >= 2 && slug.length <= 63;
  }

  /**
   * Get tenant-specific URL
   */
  static getTenantUrl(tenantSlug: string, path: string = ''): string {
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    const port = window.location.port ? `:${window.location.port}` : '';
    
    // For localhost, support both subdomain and query param approaches
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.endsWith('.localhost')) {
      // Use subdomain approach on localhost (e.g., acme.localhost:3000)
      return `${protocol}//${tenantSlug}.localhost${port}${path}`;
    }
    
    // For production, use subdomain
    const baseDomain = hostname.split('.').slice(1).join('.');
    return `${protocol}//${tenantSlug}.${baseDomain}${path}`;
  }
}

export default TenantResolver;
