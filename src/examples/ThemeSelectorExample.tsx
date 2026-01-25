/**
 * Theme Selector Component Example
 * Demonstrates how to use theme presets in ADMIN pages only
 * 
 * ⚠️ Only use in admin/configuration interfaces!
 * Regular users don't need to see all presets - they get their tenant's theme.
 */

import React from 'react';
import { useThemePresets } from '../hooks/useThemePresets';
import { ThemeService } from '../api';

/**
 * Example: Admin theme configuration page
 * ✅ CORRECT: This is where you use useThemePresets()
 */
export const AdminThemeSelector: React.FC = () => {
  const { presets, isLoading, error, refetch } = useThemePresets();
  const [selectedThemeId, setSelectedThemeId] = React.useState<string>('');

  const handleThemeChange = async (themeId: string) => {
    setSelectedThemeId(themeId);
    
    // Load full theme data
    try {
      const fullTheme = await ThemeService.getThemeById(themeId);
      console.log('Full theme loaded:', fullTheme);
      
      // Admin can:
      // 1. Preview the theme
      // 2. Save to tenant config
      // 3. Customize and create new theme
    } catch (error) {
      console.error('Failed to load full theme:', error);
    }
  };

  if (isLoading) {
    return <div>Loading themes...</div>;
  }

  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
        <button onClick={refetch}>Retry</button>
      </div>
    );
  }

  return (
    <div>
      <h3>Configure Tenant Theme</h3>
      <p>Select a base theme for your tenant:</p>
      
      <select 
        value={selectedThemeId} 
        onChange={(e) => handleThemeChange(e.target.value)}
      >
        <option value="">Select a theme...</option>
        {presets.map(preset => (
          <option key={preset.id} value={preset.id}>
            {preset.name} (v{preset.version}) - {preset.description}
          </option>
        ))}
      </select>
      
      <div style={{ marginTop: '1rem' }}>
        <p>Total presets available: {presets.length}</p>
        <button onClick={refetch}>Refresh Presets</button>
      </div>
    </div>
  );
};

/**
 * ❌ WRONG: Don't use in regular user pages!
 * 
 * This would fetch all presets on every page load, which is wasteful.
 * Regular users just get their tenant's theme automatically.
 */
// export const WrongUsageExample: React.FC = () => {
//   const { presets } = useThemePresets(); // ❌ Don't do this in user pages!
//   return <div>User sees: {presets.length} themes</div>;
// };

// Re-export the hook for convenience
export { useThemePresets } from '../hooks/useThemePresets';
