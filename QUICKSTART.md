# Quick Start Guide - Multi-Tenant React App

## 🚀 5-Minute Setup

### Step 1: Install Dependencies
```bash
cd /Users/salmanakhlaqi/Public/projects/real-solutions/presentation
npm install
```

### Step 2: Configure Environment
```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_BASE_URL=http://localhost:8000
```

### Step 3: Start Development Server
```bash
npm run dev
```

Visit: `http://localhost:3000?tenant=demo`

## 🧪 Testing

### Test Different Tenants
```bash
# Tenant 1
http://localhost:3000?tenant=tenant1

# Tenant 2
http://localhost:3000?tenant=tenant2

# Demo tenant
http://localhost:3000?tenant=demo
```

### Test Authentication
1. Make sure backend API is running on `http://localhost:8000/api/v1`
2. Navigate to `http://localhost:3000/login?tenant=demo`
3. Login with test credentials
4. You'll be redirected to dashboard

### Test Landing Page Configuration
The landing page is rendered from tenant configuration loaded from the API endpoint:
`GET /api/tenants/{slug}/config/`

## 📝 Creating a Test Tenant

Use the Django backend to create a tenant with this configuration structure (see `tenant-config-example.json`):

```json
{
  "slug": "mycompany",
  "name": "My Company",
  "branding": { ... },
  "theme": { ... },
  "landingPageSections": [ ... ]
}
```

## 🎨 Customizing Themes

Modify the `theme` object in tenant configuration:

```json
{
  "theme": {
    "colors": {
      "primary": "#ff6600",
      "secondary": "#0066cc"
    }
  }
}
```

The theme will automatically apply via CSS variables.

## 🧩 Adding New Components

1. Create component in `src/components/composite/`
2. Add to `src/components/DynamicComponentRenderer/componentRegistry.ts`
3. Use in tenant configuration

## 📚 Full Documentation

See `DOCS.md` for complete documentation with examples.

## 🛠️ Common Commands

```bash
# Development
npm run dev

# Build
npm run build

# Preview build
npm run preview

# Type check
npm run tsc
```

## 🐛 Troubleshooting

### Tenant not loading
- Check API is running
- Check network tab for API errors
- Verify tenant exists in database

### Styles not applying
- Clear browser cache
- Check CSS variables in DevTools
- Verify theme in tenant config

### Authentication issues
- Check API base URL
- Verify CORS settings on backend
- Check localStorage for tokens

## 📞 Need Help?

Refer to:
- `DOCS.md` - Full documentation
- `IMPLEMENTATION_SUMMARY.md` - Feature overview
- `tenant-config-example.json` - Sample config
