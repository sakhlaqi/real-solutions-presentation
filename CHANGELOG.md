# Changelog

All notable changes to the Real Solutions Presentation will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-01-15

### Added

#### New Files
- **`src/utils/errorHandler.ts`** - Centralized error handling utilities
  - `getErrorMessage()` - Convert API errors to user-friendly messages
  - `isNetworkError()`, `isAuthError()`, `isServerError()` - Error type checking
  - `isRetryableError()` - Check if error should trigger retry
  - `getErrorSeverity()` - Determine UI treatment (info, warning, error, critical)
  - `formatValidationErrors()` - Format validation errors for forms
  - `logError()` - Centralized error logging with context

#### New API Client Features
- **Retry Logic** - Automatic retry with exponential backoff for transient failures
- **Error Normalization** - Consistent `ApiError` interface for all errors
- **Request Queuing** - Multiple requests wait for single token refresh

#### New Token Manager Methods
- `getTenantFromToken()` - Extract tenant from JWT claims
- `getUserIdFromToken()` - Extract user ID from JWT claims
- `getTokenRemainingTime()` - Get seconds until token expiry
- `hasValidSession()` - Check if refresh token is valid
- Token structure validation on retrieval

#### New Auth Store Methods
- `refreshSession()` - Manual session refresh capability

#### Component Registry Features
- `PropSchema` interface for component prop validation
- `componentPropSchemas` - Validation schemas for all registered components
- `isValidComponentType()` - Type guard for component validation
- `getComponent()`, `getPropSchema()` - Registry accessor functions

### Changed

#### API Client Improvements
- **`src/api/client.ts`**
  - **Added:** Retry logic with exponential backoff (max 2 retries)
  - **Added:** Error normalization into `ApiError` interface
  - **Added:** Request queuing during token refresh
  - **Changed:** All generic types from `any` to `unknown`
  - **Changed:** Improved type safety with `CustomRequestConfig`
  - **Added:** `failedRefreshSubscribers` array for proper error propagation
  - **Added:** Retryable status codes: 408, 429, 500, 502, 503, 504

```typescript
// New normalized error interface
export interface ApiError {
  code: string;
  message: string;
  statusCode: number;
  details?: Record<string, unknown>;
  correlationId?: string;
  isNetworkError: boolean;
  isAuthError: boolean;
  isServerError: boolean;
  originalError: Error;
}
```

#### Token Management Improvements
- **`src/utils/tokenManager.ts`**
  - **Added:** Security documentation about localStorage trade-offs
  - **Added:** Token structure validation on retrieval
  - **Added:** Support for both `tenant` and `tenant_id` claims
  - **Changed:** Fixed jwt-decode import (removed non-existent `JwtPayload` export)
  - **Improved:** Error handling with automatic token cleanup

#### Protected Route Enhancements
- **`src/components/ProtectedRoute.tsx`**
  - **Added:** Session validity checking on mount
  - **Added:** Automatic session restoration attempt
  - **Added:** Session expiry detection with graceful logout
  - **Added:** Loading spinner with descriptive messages
  - **Added:** Prepared for RBAC (role-based access control)
  - **Added:** Session expiry message in redirect state

#### Dynamic Component Security
- **`src/components/DynamicComponentRenderer/componentRegistry.ts`**
  - **Added:** `PropSchema` interface with validation rules
  - **Added:** `urlProps` - List of props to validate as URLs
  - **Added:** `textOnlyProps` - List of props to strip HTML from
  - **Added:** Type-safe registry with proper exports

- **`src/components/DynamicComponentRenderer/DynamicComponentRenderer.tsx`**
  - **Added:** URL validation (blocks `javascript:` and `data:` protocols)
  - **Added:** Text sanitization (strips HTML tags)
  - **Added:** Per-component error boundary
  - **Added:** Prop validation against schema
  - **Changed:** Wrapped in `memo()` for performance
  - **Changed:** Uses `useMemo()` for sanitized props

#### Auth Store Enhancements
- **`src/stores/authStore.ts`**
  - **Added:** Integration with `errorHandler` utilities
  - **Added:** `refreshSession()` action for manual refresh
  - **Changed:** Improved token refresh logic in `loadUser()`
  - **Changed:** Silent error handling for background operations
  - **Added:** Error logging with context

#### Type Updates
- **`src/types/auth.ts`**
  - **Added:** `tenant` claim (primary)
  - **Added:** `tenant_id` claim (backward compatibility)
  - **Added:** JWT standard claims (`jti`, `iss`, `aud`, `sub`)
  - **Added:** API client claims (`client_type`, `client_id`, `token_version`)
  - **Changed:** `LoginCredentials` supports both `username` and `email`
  - **Added:** `createdAt`, `lastLogin` to `User` interface

### Security Features

#### XSS Mitigations (localStorage usage)
1. Short-lived access tokens (15 minutes)
2. Automatic token rotation on refresh
3. Token version tracking for revocation
4. CSP headers recommended in production

#### Dynamic Component Protection
1. Whitelist-based component registry
2. URL validation (http/https only)
3. Text sanitization (strips HTML)
4. Per-component error boundaries
5. Feature flag gating support

### Error Handling

User-friendly error messages are provided for:
- Authentication errors (unauthorized, forbidden, token_revoked)
- Tenant errors (tenant_not_found, tenant_inactive, cross_tenant_access)
- Network errors (network_error, timeout)
- Server errors (server_error, internal_error)
- Validation errors (bad_request, validation_error)
- Resource errors (not_found)
- Rate limiting (rate_limited)

### Migration Notes

#### Breaking Changes
None. All changes are backward compatible.

#### Required Package Updates
None. Uses existing dependencies.

#### Browser Support
No changes to browser support requirements.

---

## [1.0.0] - Initial Release

- Multi-tenant React application with Vite
- Subdomain-based tenant resolution
- Dynamic theming per tenant
- JWT authentication with token refresh
- Zustand state management
- Protected routes with authentication guards
- Component-based landing pages
