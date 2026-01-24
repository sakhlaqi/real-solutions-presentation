# UI Provider Bridge Implementation

## Overview

The `UiProviderBridge` component bridges tenant configuration to the UI library provider, creating a clean separation between tenant-specific settings and UI rendering concerns.

## Architecture

```
Tenant Store → UiProviderBridge → UIProvider → Router → Pages
     ↓                  ↓              ↓
  Theme Config    Theme Mapping   MUI Theme
  Branding        Feature Flags   Provider Config
  Settings
```

## Component Structure

### UiProviderBridge.tsx

**Location**: `src/app/UiProviderBridge.tsx`

**Responsibilities**:
1. Reads tenant configuration from `useTenantStore()`
2. Maps tenant theme to UI library theme format
3. Detects preferred theme mode (light/dark)
4. Wraps children with configured `UIProvider`

**Constraints**:
- ✅ Does NOT import MUI directly
- ✅ Uses only UI library provider API (`@sakhlaqi/ui`)
- ✅ Maintains separation of concerns
- ✅ No business logic - pure bridge/adapter

### Theme Mapping

The bridge maps tenant-specific theme structure to UI library format:

#### Tenant Theme Structure
```typescript
interface TenantTheme {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    // ... more colors
  };
  fonts: {
    primary: string;
    secondary: string;
    sizes: { ... };
  };
  spacing: { xs, sm, md, lg, ... };
  borderRadius: { sm, md, lg, full };
  shadows: { sm, md, lg };
}
```

#### UI Library Theme Structure
```typescript
interface ThemeConfig {
  mode: 'light' | 'dark';
  primaryColor?: string;
  secondaryColor?: string;
  fontFamily?: string;
  borderRadius?: number;
  spacing?: number;
}
```

#### Mapping Logic

```typescript
function mapTenantThemeToUITheme(
  tenantTheme: TenantTheme,
  mode: ThemeMode
): ThemeConfig {
  return {
    mode,
    primaryColor: tenantTheme.colors.primary,
    secondaryColor: tenantTheme.colors.secondary,
    fontFamily: tenantTheme.fonts.primary,
    borderRadius: parseSize(tenantTheme.borderRadius.md),
    spacing: parseSize(tenantTheme.spacing.md),
  };
}
```

## Theme Mode Detection

Priority order for theme mode:

1. **localStorage**: `theme-mode` key
2. **System Preference**: `prefers-color-scheme`
3. **Default**: `light`

```typescript
function getPreferredThemeMode(): ThemeMode {
  // 1. Check localStorage
  const storedMode = localStorage.getItem('theme-mode');
  if (storedMode === 'light' || storedMode === 'dark') {
    return storedMode;
  }

  // 2. Check system preference
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  // 3. Default to light
  return 'light';
}
```

## Usage

### In App.tsx

```tsx
import { UiProviderBridge } from './app';

function App() {
  return (
    <ErrorBoundary>
      <UiProviderBridge provider="mui">
        <BrowserRouter>
          <Routes>
            {/* Your routes */}
          </Routes>
        </BrowserRouter>
      </UiProviderBridge>
    </ErrorBoundary>
  );
}
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | required | Content to wrap |
| `provider` | `'internal' \| 'mui'` | `'mui'` | UI provider to use |

## Theme Persistence

Users can manually toggle theme mode, and it will persist to localStorage:

```typescript
// In a settings component
const toggleTheme = () => {
  const current = localStorage.getItem('theme-mode') || 'light';
  const next = current === 'light' ? 'dark' : 'light';
  localStorage.setItem('theme-mode', next);
  window.location.reload(); // Force reload to apply
};
```

## Integration Flow

### 1. App Initialization

```
App.tsx
  └─ useAppBootstrap()
      └─ useTenantStore.initializeTenant()
          └─ Fetch tenant config from API
              └─ Store in tenant store
```

### 2. Theme Application

```
UiProviderBridge
  └─ Read tenant config from store
      └─ Map to UIProvider theme
          └─ UIProvider creates MUI theme
              └─ Apply to all components
```

### 3. Runtime Updates

```
Tenant config changes
  └─ useTenantStore updates
      └─ UiProviderBridge re-renders (useMemo)
          └─ UIProvider updates theme
              └─ Components re-render with new theme
```

## Default Theme Fallback

When tenant config is not yet loaded, default theme is used:

```typescript
{
  mode: 'light',
  primaryColor: '#1976d2',
  secondaryColor: '#dc004e',
  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  borderRadius: 8,
  spacing: 8,
}
```

## Utility Functions

### parseSize()

Converts CSS size values to numbers:

```typescript
parseSize('8px')    // → 8
parseSize('1rem')   // → 16 (assumes 16px base)
parseSize('1.5rem') // → 24
```

## Development Logging

In development mode, theme mapping is logged:

```typescript
if (process.env.NODE_ENV === 'development') {
  console.log('[UiProviderBridge] Tenant theme:', config.theme);
  console.log('[UiProviderBridge] UI library theme:', uiTheme);
}
```

## Benefits

### 1. Separation of Concerns

- **Tenant Store**: Owns tenant data
- **UiProviderBridge**: Adapts tenant data to UI format
- **UIProvider**: Owns UI rendering
- **MUI**: Never imported in app code

### 2. Flexibility

- Easy to change UI library without touching app code
- Tenant theme changes don't require code updates
- Can A/B test themes by changing API config

### 3. Type Safety

- Full TypeScript support
- Theme mapping is type-checked
- No `any` types

### 4. Performance

- `useMemo` prevents unnecessary re-renders
- Theme computed only when tenant config changes
- Efficient localStorage reads

## Future Enhancements

### 1. Feature Flags

Apply tenant feature flags to UI library:

```typescript
const uiFeatures = useMemo(() => ({
  enableDarkMode: config?.featureFlags.darkMode,
  enableAnimations: config?.featureFlags.animations,
  enableAdvancedFeatures: config?.featureFlags.advanced,
}), [config?.featureFlags]);

<UIProvider
  defaultProvider={provider}
  defaultTheme={uiTheme}
  features={uiFeatures}  // Pass to UI library
>
```

### 2. Custom CSS Variables

Inject tenant-specific CSS variables:

```typescript
useEffect(() => {
  if (config?.theme) {
    document.documentElement.style.setProperty(
      '--tenant-primary', 
      config.theme.colors.primary
    );
    document.documentElement.style.setProperty(
      '--tenant-secondary', 
      config.theme.colors.secondary
    );
  }
}, [config?.theme]);
```

### 3. Dynamic Provider Switching

Allow runtime provider switching:

```typescript
const [provider, setProvider] = useState<'internal' | 'mui'>('mui');

<select value={provider} onChange={(e) => setProvider(e.target.value)}>
  <option value="internal">Internal</option>
  <option value="mui">Material-UI</option>
</select>

<UiProviderBridge provider={provider}>
  {/* ... */}
</UiProviderBridge>
```

### 4. Theme Presets

Support multiple theme presets per tenant:

```typescript
const themes = {
  default: config.theme,
  highContrast: config.themes?.highContrast,
  colorBlind: config.themes?.colorBlind,
};

const [activeTheme, setActiveTheme] = useState('default');

<UiProviderBridge theme={themes[activeTheme]}>
```

## Testing

### Unit Tests

```typescript
describe('UiProviderBridge', () => {
  it('maps tenant theme to UI theme', () => {
    const tenantTheme = {
      colors: { primary: '#ff0000', secondary: '#00ff00' },
      fonts: { primary: 'Arial' },
      spacing: { md: '16px' },
      borderRadius: { md: '8px' },
    };

    const uiTheme = mapTenantThemeToUITheme(tenantTheme, 'light');

    expect(uiTheme.primaryColor).toBe('#ff0000');
    expect(uiTheme.secondaryColor).toBe('#00ff00');
    expect(uiTheme.fontFamily).toBe('Arial');
    expect(uiTheme.spacing).toBe(16);
    expect(uiTheme.borderRadius).toBe(8);
  });

  it('uses default theme when tenant config not loaded', () => {
    const { container } = render(
      <UiProviderBridge>
        <div>Test</div>
      </UiProviderBridge>
    );

    // Should render with default theme
    expect(container).toBeInTheDocument();
  });
});
```

### Integration Tests

```typescript
describe('Theme Integration', () => {
  it('applies tenant theme to UI components', async () => {
    // Mock tenant store with custom theme
    mockTenantStore({ theme: { colors: { primary: '#123456' } } });

    render(
      <UiProviderBridge>
        <Button>Test Button</Button>
      </UiProviderBridge>
    );

    // Verify button uses tenant primary color
    const button = screen.getByRole('button');
    expect(button).toHaveStyle({ backgroundColor: '#123456' });
  });
});
```

## Related Files

- `src/app/UiProviderBridge.tsx` - Bridge component
- `src/app/index.ts` - Exports
- `src/App.tsx` - Usage example
- `src/stores/tenantStore.ts` - Tenant configuration source
- `src/types/tenant.ts` - Tenant theme types
- `@sakhlaqi/ui` - UI library package

## Summary

The `UiProviderBridge` creates a clean architectural boundary:

1. ✅ Tenant Store → owns tenant data
2. ✅ UiProviderBridge → adapts data to UI format
3. ✅ UIProvider → configures UI library
4. ✅ MUI → never imported directly in app

**Result**: Flexible, type-safe, tenant-aware UI theming with clean separation of concerns.
