# Theme Preset Loading Implementation

## Overview

Theme presets are available on-demand via API for admin and configuration interfaces. Regular users don't need presets - they automatically receive their tenant's configured theme.

## ⚠️ Important Design Decision

**Presets are NOT loaded at app initialization.**

Why?
- Regular users only need their tenant's theme (already in tenant config)
- Loading all presets on every page load wastes bandwidth and time
- Only admins configuring themes need to see available presets
- Opt-in loading keeps the app fast for 99% of users

## Architecture

### API Layer (Django)
- **Endpoint**: `GET /themes/presets/` - Returns all preset themes
- **Endpoint**: `GET /themes/` - Returns presets + tenant custom themes
- **Endpoint**: `GET /themes/{id}/` - Returns full theme with JSON data
- **Database**: Theme presets are seeded using `python manage.py seed_theme_presets`
- **Access**: Public endpoints - no authentication required for presets

### Presentation Layer (React)

#### New Files Created:

1. **`src/api/theme.ts`**
   - `ThemeService` - API client for theme operations
   - `ThemeService.getPresets()` - Fetch all preset themes
   - `ThemeService.getThemes()` - Fetch all themes (presets + custom)
   - `ThemeService.getThemeById(id)` - Fetch full theme data

2. **`src/hooks/useThemePresets.ts`**
   - `useThemePresets()` - Hook for loading theme presets
   - Automatically fetches presets on mount
   - Provides `presets`, `isLoading`, `error`, and `refetch()`
   - Non-blocking - won't prevent app from loading if fetch fails

#### Updated Files:

3. **`src/api/index.ts`**
   - Exports `ThemeService` and related types

4. **`src/hooks/useThemePresets.ts`**
   - Updated documentation to clarify admin-only usage
   - Added warnings about when to use this hook

## Usage

### In App Bootstrap
✅ Correct: Admin Theme Configuration

Use `useThemePresets()` only in admin/configuration page
```tsx
import { useThemePresets } from '@/hooks/useThemePresets';

function ThemeSelector() {
  const { presets, isLoading, error, refetch } = useThemePresets();

  if (isLoading) return <Spinner />;
  if (error) return <Error message={error} />;

  return (
    <select>
      {presets.map(preset => (
        <option key={preset.id} value={preset.id}>
          {preset.name} (v{preset.version})
        </option>
      ))}
    </select>
  );
// ✅ Admin theme configuration page
function AdminThemeSettings() {
  const { presets, isLoading, error, refetch } = useThemePresets();

  if (isLoading) return <Spinner />;
  if (error) return <Error message={error} />;

  return (
    <div>
      <h2>Select Tenant Theme</h2>
      <select>
        {presets.map(preset => (
          <option key={preset.id} value={preset.id}>
            {preset.name} (v{preset.version})
          </option>
        ))}
      </select>
    </div>
  );
}
### Regular Users (No Preset Loading)
1. **App Initialization** → `useAppBootstrap()`
2. **Tenant Config Loaded** → Includes tenant's theme
3. **Theme Applied** → Tenant theme automatically used
4. ✅ **No preset fetching** - Users just get their theme

### Admin Pages (Opt-in Preset Loading)
1. **Admin Page Loads** → Calls `useThemePresets()`
2. **Theme Hook** → `ThemeService.getPresets()`
3. **API Request** → `GET /themes/presets/`
4. **API Response** → Returns array of theme metadata
5. **Hook State** → Updates `presets` state
6. **Admin UI** → Shows theme selection interface
// ❌ BAD - Don't do this!
function Dashboard() {
  const { presets } = useThemePresets(); // Unnecessary API call!
  // Users don't need to see all presets
  // They just use their tenant's theme
}

// ✅ GOOD - Regular pages use tenant theme
function Dashboard() {
  const { tenantTheme } = useAppBootstrap();
  // Tenant theme is already loaded and appliedt fullTheme = await ThemeService.getThemeById(presetId);
const tokens = fullTheme.theme_json.tokens;
```

## Data Flow

1. **App Initialization** → `useAppBootstrap()`
2. **Bootstrap Hook** → calls `useThemePresets()`
3. **Theme Hook** → `ThemeService.getPresets()`
4. **API Request** → `GET /themes/presets/`
5. **API Response** → Returns array of theme metadata
6. **Hook State** → Updates `presets` state
7. **Component** → Can access via `themePresets` from bootstrap

## Theme Preset Data Structure

### Lightweight (List View)
```typescript
interface ThemeMetadata {
  id: string;
  name: string;Load in Admin Pages

Navigate to an admin page using `useThemePresets()` and check console:
```
[useThemePresets] Fetching theme presets from API...
[useThemePresets] Loaded 4 theme presets: Default, Dark, Brand Light, Brand Dark
```

**Note:** Regular app pages won't show this - they only load tenant theme.

### Full (Detail View)
```typescript
interface ThemeData extends ThemeMetadata {
  theme_json: {
    tokens: DesignTokens;
    modes?: ThemeMode[];
    metadata?: any;
  };
}
```

## Error Handling

- **Non-blocking**: Preset loading failures won't prevent app initialization
- **Graceful degradation**: Returns empty array on error
- **Logging**: All errors logged to console for debugging
- **Retry**: Provides `refetch()` function for manual retry

## Testing

### Verify Presets are Loaded

Check browser console on app load:
```
[useThemePresets] Fetching theme presets from API...
[useThemePresets] Loaded 8 theme presets: Modern Light, Modern Dark, Ocean, ...
[useAppBootstrap] Loaded 8 theme presets: Modern Light (v1.0.0), ...
```

### Verify API Endpoint

Test the endpoint directly:
```bash
curl http://localhost:8000/api/v1/themes/presets/
```

### Seed Theme Presets

If presets aren't in the database:
```bash
cd api
python manage.py seed_theme_presets
```

## Next Steps

With presets now loading at initialization, you can:

1. **Build a Theme Selector** - Let users choose from available presets
2. **Theme Preview** - Load full theme data for preview
3. **Admin Theme Management** - Use presets as base for custom themes
4. **Dynamic Theme Switching** - Switch between presets at runtime
5. **Theme Gallery** - Display all available themes with previews

## Migration Notes

- ✅ **Opt-in Loading** - Only loaded when admin explicitly calls the hook
- ✅ **Zero Impact** - Regular users never fetch presets
- ✅ **Single Request** - All presets fetched in one API call when needed
- ✅ **Cached in Memory** - Stored in React state after initial load
- ✅ **Lightweight Data** - List view returns metadata only (no full JSON)
- ✅ **Lazy Detail Loading** - Full theme JSON only loaded when selected
## Performance

- **Single Request** - All presets fetched in one API call
- **Cached in Memory** - Stored in React state after initial load
- **Lightweight Data** - List view returns metadata only (no full JSON)
- **Parallel Loading** - Loads in parallel with tenant initialization
- **No UI Blocking** - Loading state managed independently
