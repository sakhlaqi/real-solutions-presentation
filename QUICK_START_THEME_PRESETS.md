# Theme Preset Integration Quick Start

## Overview

Theme presets are available via API for **admin/configuration interfaces only**. Regular users don't load presets - they automatically get their tenant's configured theme.

## ⚠️ Important: When to Use This

**DO use theme presets:**
- ✅ Admin theme configuration pages
- ✅ Theme gallery/preview interfaces
- ✅ Tenant setup wizards
- ✅ Theme management dashboards

**DON'T use theme presets:**
- ❌ Regular app initialization
- ❌ Public pages
- ❌ User dashboards
- ❌ Anywhere users don't configure themes

## Implementation Summary

### ✅ What Was Added

1. **ThemeService** (`src/api/theme.ts`)
   - API client for fetching theme presets
   - Methods: `getPresets()`, `getThemes()`, `getThemeById()`

2. **useThemePresets Hook** (`src/hooks/useThemePresets.ts`)
   - Automatically loads presets on mount
   - Returns: `{ presets, isLoading, error, refetch }`

3. **Updated useAppBootstrap** (`src/hooks/useAppBootstrap.ts`)
   - Now returns theme preset data
   - Non-blocking preset loading during app init

## How It Works

### Regular App (No Preset Loading)

```typescript
// App.tsx - Regular users just get tenant theme
const { 
  tenantTheme,        // Tenant's configured theme
  themeLoading,       // Theme loading state
} = useAppBootstrap();

// Tenant theme is applied automatically - no preset selection needed!
```

### Admin Pages (Opt-in Preset Loading)

```typescript
// AdminThemeSettings.tsx - Only admins load presets
import { useThemePresets } from '@/hooks/useThemePresets';

function AdminThemeSettings() {
  const { presets, isLoading, error } = useThemePresets();
  
  // Now admin can browse and select from available presets
  return <ThemeSelector themes={presets} />;
}
```

## Current State
dmin Theme Configuration (Correct Usage)presetsLoading } = useAppBootstrap();
  
  if (presetsLoading) return <Spinner />;
  
  return (
    <div>
      <h2>Available Themes ({themePresets.length})</h2>
      {themePresets.map(preset => (
        <div key={preset.id}>{preset.name}</div>
      ))}
    </div>
  );
}
```

### 2. Direct Hook Usage

```tsx
import { useThemePresets } from '@/hooks/useThemePresets';

function ThemeManager() {
  const { presets, isLoading, error, refetch } = useThemePresets();
  
  return (
    <div>
      {presets.map(p => <ThemeCard theme={p} />)}
      <button onClick={refetch}>Refresh</button>
    </div>
  );
}
```

### 3. Load Full Theme Data

```tsx
import { ThemeService } from '@/api';

async function loadFullTheme(presetId: string) {
  const fullTheme = await ThemeService.getThemeById(presetId);
  const tokens = fullTheme.theme_json.tokens;
  
  // Use tokens to apply theme
  applyTheme(tokens);
}
```

## Verification Steps

### 1. Check Database Has Presets
```bash
cd api
python manage.py shell -c "from apps.tenants.models import Theme; print(f'Presets: {Theme.objects.filter(is_preset=True).count()}')"
```
2
### 2. Seed Presets (if needed)
```bash
cd api
python manage.py seed_theme_presets
```

### 3. Test API Endpoint
```bash
curl http://localhost:8000/api/v1/themes/presets/
```

### 4. Check Browser Console
When app loads, you should see:
```
[useThemePresets] Fetching theme presets from API...
[useThemePresets] Loaded 4 theme presets: Default, Dark, Brand Light, Brand Dark
[useAppBootstrap] Loaded 4 theme presets: Default (v1.0.0), ...
```

## Next Steps

Now that presets load automatically, you can:

1. **Create Theme Selector UI**
   - See `src/examples/ThemeSelectorExample.tsx` for reference
   - Let users preview and select themes

2. **Build Theme Gallery**
   - Display all available presets with previews
   - Show theme metadata and descriptions

3. **Implement Theme Switching**
   - Allow runtime theme cha (Admin Pages Only)
When an admin page with `useThemePresets()` loads:
```
[useThemePresets] Fetching theme presets from API...
[useThemePresets] Loaded 4 theme presets: Default, Dark, Brand Light, Brand Dark
```

Regular app pages won't show this - they only load tenant theme!
## Error Handling

The implementation is non-blocking:
- ✅ App continues loading even if preset fetch fails
- ✅ Empty array returned on error
- ✅ All errors logged to console
- ✅ Provides `refetch()` for manual retry

## Performance Notes
✅ **Opt-in Loading**: Only loads when admin pages explicitly call `useThemePresets()`
- ✅ **No Impact on Regular Users**: User pages don't fetch presets
- ✅ **Lightweight Data**: List view returns metadata only (not full theme JSON)
- ✅ **Cached in State**: No re-fetching unless `refetch()` called
- ✅ **Lazy Loading**: Full themes loaded only when selected (`getThemeById`)efetch()` called
- **No UI Blocking**: Independent loading state

## Files Modified/Created

### New Files
- ✅ `src/api/theme.ts` - Theme API service
- ✅ `src/hooks/useThemePresets.ts` - Preset loading hook
- ✅ `src/examples/ThemeSelectorExample.tsx` - Usage examples
- ✅ `THEME_PRESET_LOADING.md` - Full documentation

### Modified Files
- ✅ `src/api/indexThemePresets.ts` - Updated docs to clarify admin-only usage
- ✅ `src/hooks/useAppBootstrap.ts` - Integrate preset loading

### No Breaking Changes
- ✅ Existing tenant theme system unchanged
- ✅ All existing code continues to work
- ✅ Additive feature only
