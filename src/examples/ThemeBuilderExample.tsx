/**
 * Theme Builder Component
 * Demonstrates how to create custom themes with inheritance
 * 
 * This is an example implementation showing:
 * - Selecting a base preset
 * - Customizing colors and fonts
 * - Creating custom theme
 * - Live preview
 */

import React, { useState, useEffect } from 'react';
import { ThemeService, type ThemeMetadata } from '../api/theme';

// Type definition for design tokens
type DesignTokens = Record<string, any>;

interface ColorOverride {
  primary?: string;
  secondary?: string;
  background?: string;
}

interface TypographyOverride {
  fontFamily?: string;
  headingFontFamily?: string;
}

export const ThemeBuilderExample: React.FC = () => {
  const [presets, setPresets] = useState<ThemeMetadata[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<string>('');
  const [customName, setCustomName] = useState('');
  const [colorOverrides, setColorOverrides] = useState<ColorOverride>({});
  const [typographyOverrides, setTypographyOverrides] = useState<TypographyOverride>({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Load presets on mount
  useEffect(() => {
    loadPresets();
  }, []);

  const loadPresets = async () => {
    try {
      const data = await ThemeService.getPresets();
      setPresets(data);
    } catch (error) {
      console.error('Failed to load presets:', error);
    }
  };

  const handleCreateTheme = async () => {
    if (!selectedPreset || !customName) {
      setMessage('Please select a preset and enter a theme name');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      // Build token overrides
      const overrides: Partial<DesignTokens> = {};

      if (Object.keys(colorOverrides).length > 0) {
        overrides.colors = colorOverrides as any;
      }

      if (Object.keys(typographyOverrides).length > 0) {
        overrides.typography = typographyOverrides as any;
      }

      // Create custom theme
      const customTheme = await ThemeService.createFromPreset(
        selectedPreset,
        customName,
        overrides
      );

      setMessage(`✅ Created theme: ${customTheme.name}`);

      // Optionally switch tenant to new theme
      // await TenantService.updateConfig({ theme_id: customTheme.id });

      // Reset form
      setCustomName('');
      setColorOverrides({});
      setTypographyOverrides({});
    } catch (error: any) {
      setMessage(`❌ Error: ${error.message || 'Failed to create theme'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>🎨 Theme Builder</h1>
      <p>Create a custom theme by extending a preset</p>

      {/* Preset Selection */}
      <div style={{ marginBottom: '20px' }}>
        <label>
          <strong>1. Select Base Preset:</strong>
          <select
            value={selectedPreset}
            onChange={(e) => setSelectedPreset(e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '8px' }}
          >
            <option value="">-- Choose a preset --</option>
            {presets.map((preset) => (
              <option key={preset.id} value={preset.id}>
                {preset.name} v{preset.version}
                {preset.description && ` - ${preset.description}`}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Theme Name */}
      <div style={{ marginBottom: '20px' }}>
        <label>
          <strong>2. Theme Name:</strong>
          <input
            type="text"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            placeholder="e.g., ACME Branding"
            style={{ width: '100%', padding: '8px', marginTop: '8px' }}
          />
        </label>
      </div>

      {/* Color Customization */}
      <div style={{ marginBottom: '20px' }}>
        <strong>3. Customize Colors:</strong>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '8px' }}>
          <label>
            Primary Color:
            <input
              type="color"
              value={colorOverrides.primary || '#0066cc'}
              onChange={(e) =>
                setColorOverrides({ ...colorOverrides, primary: e.target.value })
              }
              style={{ width: '100%', height: '40px', marginTop: '4px' }}
            />
          </label>
          <label>
            Secondary Color:
            <input
              type="color"
              value={colorOverrides.secondary || '#ff6600'}
              onChange={(e) =>
                setColorOverrides({ ...colorOverrides, secondary: e.target.value })
              }
              style={{ width: '100%', height: '40px', marginTop: '4px' }}
            />
          </label>
          <label>
            Background Color:
            <input
              type="color"
              value={colorOverrides.background || '#ffffff'}
              onChange={(e) =>
                setColorOverrides({ ...colorOverrides, background: e.target.value })
              }
              style={{ width: '100%', height: '40px', marginTop: '4px' }}
            />
          </label>
        </div>
      </div>

      {/* Typography Customization */}
      <div style={{ marginBottom: '20px' }}>
        <strong>4. Customize Typography:</strong>
        <div style={{ marginTop: '8px' }}>
          <label>
            Font Family:
            <select
              value={typographyOverrides.fontFamily || ''}
              onChange={(e) =>
                setTypographyOverrides({ ...typographyOverrides, fontFamily: e.target.value })
              }
              style={{ width: '100%', padding: '8px', marginTop: '4px' }}
            >
              <option value="">-- Keep default --</option>
              <option value="Inter, sans-serif">Inter</option>
              <option value="Poppins, sans-serif">Poppins</option>
              <option value="Roboto, sans-serif">Roboto</option>
              <option value="Open Sans, sans-serif">Open Sans</option>
              <option value="Montserrat, sans-serif">Montserrat</option>
            </select>
          </label>
        </div>
      </div>

      {/* Preview */}
      <div
        style={{
          padding: '20px',
          marginBottom: '20px',
          backgroundColor: colorOverrides.background || '#ffffff',
          color: '#000',
          border: '1px solid #ccc',
          borderRadius: '8px',
          fontFamily: typographyOverrides.fontFamily || 'system-ui',
        }}
      >
        <h3 style={{ color: colorOverrides.primary || '#0066cc' }}>Preview</h3>
        <p>This is how your theme will look.</p>
        <button
          style={{
            backgroundColor: colorOverrides.primary || '#0066cc',
            color: '#fff',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '4px',
            fontFamily: typographyOverrides.fontFamily || 'system-ui',
          }}
        >
          Primary Button
        </button>
        <button
          style={{
            backgroundColor: colorOverrides.secondary || '#ff6600',
            color: '#fff',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '4px',
            marginLeft: '10px',
            fontFamily: typographyOverrides.fontFamily || 'system-ui',
          }}
        >
          Secondary Button
        </button>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={handleCreateTheme}
          disabled={isLoading || !selectedPreset || !customName}
          style={{
            flex: 1,
            padding: '12px',
            backgroundColor: '#0066cc',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading || !selectedPreset || !customName ? 0.5 : 1,
          }}
        >
          {isLoading ? 'Creating...' : '✨ Create Custom Theme'}
        </button>
      </div>

      {/* Message */}
      {message && (
        <div
          style={{
            marginTop: '20px',
            padding: '12px',
            backgroundColor: message.startsWith('✅') ? '#d4edda' : '#f8d7da',
            color: message.startsWith('✅') ? '#155724' : '#721c24',
            borderRadius: '4px',
          }}
        >
          {message}
        </div>
      )}

      {/* Info */}
      <div
        style={{
          marginTop: '30px',
          padding: '15px',
          backgroundColor: '#e7f3ff',
          borderRadius: '8px',
          fontSize: '14px',
        }}
      >
        <strong>💡 How it works:</strong>
        <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
          <li>Select a preset as your starting point</li>
          <li>Override only the tokens you want to change</li>
          <li>The system stores only your changes (~2KB instead of ~150KB)</li>
          <li>When the preset updates, your theme automatically gets improvements</li>
          <li>Only your overridden tokens remain custom</li>
        </ul>
      </div>

      {/* Storage Info */}
      <div style={{ marginTop: '15px', fontSize: '12px', color: '#666' }}>
        <strong>Storage Efficiency:</strong>
        <br />
        Traditional approach: ~150KB per custom theme
        <br />
        With inheritance: ~2KB per custom theme
        <br />
        <strong style={{ color: '#28a745' }}>✨ 98% storage reduction!</strong>
      </div>
    </div>
  );
};

export default ThemeBuilderExample;
