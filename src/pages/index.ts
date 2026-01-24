/**
 * Pages Module
 * 
 * This module contains the single bridge component (JsonPage) that connects
 * JSON-driven page configurations to the UI library's PageRenderer.
 * 
 * ALL PAGES ARE JSON-DRIVEN (no exceptions):
 * - Public pages (/, /login): JSON from initial /config call
 * - Admin pages (/admin/*): JSON from tenant-specific UI configs
 * 
 * The tenant is resolved from the subdomain BEFORE any page loads,
 * allowing all pages to fetch tenant-specific JSON configurations.
 */

export { JsonPage } from './JsonPage';
