# Example Tenant Route Configurations

## Example 1: Minimal Tenant (Startup)

**Tenant:** Simple Portfolio Site  
**Use Case:** Basic public website with admin panel

```json
{
  "routes": [
    {
      "path": "/",
      "pagePath": "/",
      "title": "Home",
      "protected": false,
      "layout": "main",
      "order": 0
    },
    {
      "path": "/about",
      "pagePath": "/about",
      "title": "About Us",
      "protected": false,
      "layout": "main",
      "order": 1
    },
    {
      "path": "/contact",
      "pagePath": "/contact",
      "title": "Contact",
      "protected": false,
      "layout": "main",
      "order": 2
    },
    {
      "path": "/login",
      "pagePath": "/login",
      "title": "Login",
      "protected": false,
      "layout": "none",
      "order": 3
    },
    {
      "path": "/admin",
      "pagePath": "/dashboard",
      "title": "Dashboard",
      "protected": true,
      "layout": "admin",
      "order": 4
    },
    {
      "path": "/admin/settings",
      "pagePath": "/settings",
      "title": "Settings",
      "protected": true,
      "layout": "admin",
      "order": 5
    }
  ]
}
```

---

## Example 2: Construction Company

**Tenant:** BuildRight Construction  
**Use Case:** Project management, equipment tracking, employee timesheets

```json
{
  "routes": [
    {
      "path": "/",
      "pagePath": "/",
      "title": "Home",
      "protected": false,
      "layout": "main"
    },
    {
      "path": "/services",
      "pagePath": "/services",
      "title": "Our Services",
      "protected": false,
      "layout": "main"
    },
    {
      "path": "/projects-gallery",
      "pagePath": "/projects-gallery",
      "title": "Projects Gallery",
      "protected": false,
      "layout": "main"
    },
    {
      "path": "/login",
      "pagePath": "/login",
      "title": "Login",
      "protected": false,
      "layout": "none"
    },
    {
      "path": "/admin",
      "pagePath": "/dashboard",
      "title": "Dashboard",
      "protected": true,
      "layout": "admin"
    },
    {
      "path": "/admin/projects",
      "pagePath": "/projects",
      "title": "Projects",
      "protected": true,
      "layout": "admin"
    },
    {
      "path": "/admin/projects/new",
      "pagePath": "/projects/new",
      "title": "New Project",
      "protected": true,
      "layout": "admin",
      "order": 10
    },
    {
      "path": "/admin/projects/:id",
      "pagePath": "/projects/:id",
      "title": "Project Details",
      "protected": true,
      "layout": "admin",
      "order": 20
    },
    {
      "path": "/admin/equipment",
      "pagePath": "/equipment",
      "title": "Equipment",
      "protected": true,
      "layout": "admin"
    },
    {
      "path": "/admin/equipment/:id",
      "pagePath": "/equipment/:id",
      "title": "Equipment Details",
      "protected": true,
      "layout": "admin"
    },
    {
      "path": "/admin/employees",
      "pagePath": "/employees",
      "title": "Employees",
      "protected": true,
      "layout": "admin"
    },
    {
      "path": "/admin/employees/:id",
      "pagePath": "/employees/:id",
      "title": "Employee Profile",
      "protected": true,
      "layout": "admin"
    },
    {
      "path": "/admin/timesheets",
      "pagePath": "/timesheets",
      "title": "Timesheets",
      "protected": true,
      "layout": "admin",
      "featureFlag": "timesheets"
    },
    {
      "path": "/admin/reports",
      "pagePath": "/reports",
      "title": "Reports",
      "protected": true,
      "layout": "admin",
      "meta": {
        "icon": "chart-bar",
        "category": "Analytics"
      }
    },
    {
      "path": "/admin/safety",
      "pagePath": "/safety",
      "title": "Safety Incidents",
      "protected": true,
      "layout": "admin",
      "featureFlag": "safetyTracking"
    }
  ],
  "featureFlags": {
    "timesheets": true,
    "safetyTracking": true
  }
}
```

---

## Example 3: HR Consulting Firm

**Tenant:** TalentPro HR Solutions  
**Use Case:** Employee management, payroll, benefits, recruiting

```json
{
  "routes": [
    {
      "path": "/",
      "pagePath": "/",
      "title": "Home",
      "protected": false,
      "layout": "main"
    },
    {
      "path": "/services",
      "pagePath": "/services",
      "title": "Our Services",
      "protected": false,
      "layout": "main"
    },
    {
      "path": "/careers",
      "pagePath": "/careers",
      "title": "Careers",
      "protected": false,
      "layout": "main"
    },
    {
      "path": "/login",
      "pagePath": "/login",
      "title": "Login",
      "protected": false,
      "layout": "none"
    },
    {
      "path": "/admin",
      "pagePath": "/dashboard",
      "title": "Dashboard",
      "protected": true,
      "layout": "admin"
    },
    {
      "path": "/admin/employees",
      "pagePath": "/employees",
      "title": "Employees",
      "protected": true,
      "layout": "admin"
    },
    {
      "path": "/admin/employees/new",
      "pagePath": "/employees/new",
      "title": "New Employee",
      "protected": true,
      "layout": "admin",
      "order": 10
    },
    {
      "path": "/admin/employees/:id",
      "pagePath": "/employees/:id",
      "title": "Employee Profile",
      "protected": true,
      "layout": "admin",
      "order": 20
    },
    {
      "path": "/admin/payroll",
      "pagePath": "/payroll",
      "title": "Payroll",
      "protected": true,
      "layout": "admin"
    },
    {
      "path": "/admin/payroll/run",
      "pagePath": "/payroll/run",
      "title": "Run Payroll",
      "protected": true,
      "layout": "admin",
      "order": 10
    },
    {
      "path": "/admin/benefits",
      "pagePath": "/benefits",
      "title": "Benefits",
      "protected": true,
      "layout": "admin"
    },
    {
      "path": "/admin/recruiting",
      "pagePath": "/recruiting",
      "title": "Recruiting",
      "protected": true,
      "layout": "admin",
      "featureFlag": "recruiting"
    },
    {
      "path": "/admin/recruiting/jobs",
      "pagePath": "/recruiting/jobs",
      "title": "Job Postings",
      "protected": true,
      "layout": "admin",
      "featureFlag": "recruiting"
    },
    {
      "path": "/admin/recruiting/candidates",
      "pagePath": "/recruiting/candidates",
      "title": "Candidates",
      "protected": true,
      "layout": "admin",
      "featureFlag": "recruiting"
    },
    {
      "path": "/admin/onboarding",
      "pagePath": "/onboarding",
      "title": "Onboarding",
      "protected": true,
      "layout": "admin"
    },
    {
      "path": "/admin/performance",
      "pagePath": "/performance",
      "title": "Performance Reviews",
      "protected": true,
      "layout": "admin",
      "featureFlag": "performanceManagement"
    },
    {
      "path": "/admin/compliance",
      "pagePath": "/compliance",
      "title": "Compliance",
      "protected": true,
      "layout": "admin"
    }
  ],
  "featureFlags": {
    "recruiting": true,
    "performanceManagement": false
  }
}
```

---

## Example 4: SaaS Product Company

**Tenant:** CloudMetrics Analytics  
**Use Case:** Product analytics, customer management, billing

```json
{
  "routes": [
    {
      "path": "/",
      "pagePath": "/",
      "title": "Home",
      "protected": false,
      "layout": "main"
    },
    {
      "path": "/pricing",
      "pagePath": "/pricing",
      "title": "Pricing",
      "protected": false,
      "layout": "main"
    },
    {
      "path": "/docs",
      "pagePath": "/docs",
      "title": "Documentation",
      "protected": false,
      "layout": "main"
    },
    {
      "path": "/login",
      "pagePath": "/login",
      "title": "Login",
      "protected": false,
      "layout": "none"
    },
    {
      "path": "/signup",
      "pagePath": "/signup",
      "title": "Sign Up",
      "protected": false,
      "layout": "none"
    },
    {
      "path": "/admin",
      "pagePath": "/dashboard",
      "title": "Dashboard",
      "protected": true,
      "layout": "admin"
    },
    {
      "path": "/admin/analytics",
      "pagePath": "/analytics",
      "title": "Analytics",
      "protected": true,
      "layout": "admin"
    },
    {
      "path": "/admin/customers",
      "pagePath": "/customers",
      "title": "Customers",
      "protected": true,
      "layout": "admin"
    },
    {
      "path": "/admin/customers/:id",
      "pagePath": "/customers/:id",
      "title": "Customer Details",
      "protected": true,
      "layout": "admin"
    },
    {
      "path": "/admin/billing",
      "pagePath": "/billing",
      "title": "Billing",
      "protected": true,
      "layout": "admin"
    },
    {
      "path": "/admin/subscriptions",
      "pagePath": "/subscriptions",
      "title": "Subscriptions",
      "protected": true,
      "layout": "admin"
    },
    {
      "path": "/admin/api-keys",
      "pagePath": "/api-keys",
      "title": "API Keys",
      "protected": true,
      "layout": "admin"
    },
    {
      "path": "/admin/webhooks",
      "pagePath": "/webhooks",
      "title": "Webhooks",
      "protected": true,
      "layout": "admin",
      "featureFlag": "webhooks"
    },
    {
      "path": "/admin/integrations",
      "pagePath": "/integrations",
      "title": "Integrations",
      "protected": true,
      "layout": "admin"
    },
    {
      "path": "/admin/team",
      "pagePath": "/team",
      "title": "Team Members",
      "protected": true,
      "layout": "admin"
    },
    {
      "path": "/admin/usage",
      "pagePath": "/usage",
      "title": "Usage & Limits",
      "protected": true,
      "layout": "admin"
    }
  ],
  "featureFlags": {
    "webhooks": true
  }
}
```

---

## Example 5: E-commerce Store

**Tenant:** ShopNow Online  
**Use Case:** Product catalog, orders, inventory, customers

```json
{
  "routes": [
    {
      "path": "/",
      "pagePath": "/",
      "title": "Home",
      "protected": false,
      "layout": "main"
    },
    {
      "path": "/shop",
      "pagePath": "/shop",
      "title": "Shop",
      "protected": false,
      "layout": "main"
    },
    {
      "path": "/cart",
      "pagePath": "/cart",
      "title": "Shopping Cart",
      "protected": false,
      "layout": "main"
    },
    {
      "path": "/checkout",
      "pagePath": "/checkout",
      "title": "Checkout",
      "protected": false,
      "layout": "none"
    },
    {
      "path": "/login",
      "pagePath": "/login",
      "title": "Login",
      "protected": false,
      "layout": "none"
    },
    {
      "path": "/admin",
      "pagePath": "/dashboard",
      "title": "Dashboard",
      "protected": true,
      "layout": "admin"
    },
    {
      "path": "/admin/products",
      "pagePath": "/products",
      "title": "Products",
      "protected": true,
      "layout": "admin"
    },
    {
      "path": "/admin/products/new",
      "pagePath": "/products/new",
      "title": "Add Product",
      "protected": true,
      "layout": "admin",
      "order": 10
    },
    {
      "path": "/admin/products/:id",
      "pagePath": "/products/:id",
      "title": "Edit Product",
      "protected": true,
      "layout": "admin",
      "order": 20
    },
    {
      "path": "/admin/categories",
      "pagePath": "/categories",
      "title": "Categories",
      "protected": true,
      "layout": "admin"
    },
    {
      "path": "/admin/orders",
      "pagePath": "/orders",
      "title": "Orders",
      "protected": true,
      "layout": "admin"
    },
    {
      "path": "/admin/orders/:id",
      "pagePath": "/orders/:id",
      "title": "Order Details",
      "protected": true,
      "layout": "admin"
    },
    {
      "path": "/admin/customers",
      "pagePath": "/customers",
      "title": "Customers",
      "protected": true,
      "layout": "admin"
    },
    {
      "path": "/admin/inventory",
      "pagePath": "/inventory",
      "title": "Inventory",
      "protected": true,
      "layout": "admin"
    },
    {
      "path": "/admin/discounts",
      "pagePath": "/discounts",
      "title": "Discounts",
      "protected": true,
      "layout": "admin",
      "featureFlag": "discounts"
    },
    {
      "path": "/admin/shipping",
      "pagePath": "/shipping",
      "title": "Shipping",
      "protected": true,
      "layout": "admin"
    },
    {
      "path": "/admin/reports",
      "pagePath": "/reports",
      "title": "Sales Reports",
      "protected": true,
      "layout": "admin"
    }
  ],
  "featureFlags": {
    "discounts": true
  }
}
```

---

## Common Patterns

### Pattern 1: List + Detail Routes

```json
{
  "routes": [
    {
      "path": "/admin/items",
      "pagePath": "/items",
      "title": "Items List",
      "protected": true,
      "layout": "admin"
    },
    {
      "path": "/admin/items/:id",
      "pagePath": "/items/:id",
      "title": "Item Details",
      "protected": true,
      "layout": "admin"
    }
  ]
}
```

### Pattern 2: New/Edit with Priority

```json
{
  "routes": [
    {
      "path": "/admin/items/new",
      "pagePath": "/items/new",
      "title": "New Item",
      "protected": true,
      "layout": "admin",
      "order": 10
    },
    {
      "path": "/admin/items/:id/edit",
      "pagePath": "/items/:id/edit",
      "title": "Edit Item",
      "protected": true,
      "layout": "admin",
      "order": 15
    },
    {
      "path": "/admin/items/:id",
      "pagePath": "/items/:id",
      "title": "View Item",
      "protected": true,
      "layout": "admin",
      "order": 20
    }
  ]
}
```

### Pattern 3: Feature-Flagged Routes

```json
{
  "routes": [
    {
      "path": "/admin/beta-feature",
      "pagePath": "/beta-feature",
      "title": "Beta Feature",
      "protected": true,
      "layout": "admin",
      "featureFlag": "betaAccess"
    }
  ],
  "featureFlags": {
    "betaAccess": false
  }
}
```

### Pattern 4: Public vs Protected Variants

```json
{
  "routes": [
    {
      "path": "/products",
      "pagePath": "/products-public",
      "title": "Products",
      "protected": false,
      "layout": "main"
    },
    {
      "path": "/admin/products",
      "pagePath": "/products-admin",
      "title": "Manage Products",
      "protected": true,
      "layout": "admin"
    }
  ]
}
```

## Quick Setup Script

```python
# Python script to generate routes configuration
def generate_routes_config(tenant_type):
    """Generate routes configuration based on tenant type"""
    
    # Base routes (all tenants)
    base_routes = [
        {
            "path": "/",
            "pagePath": "/",
            "title": "Home",
            "protected": False,
            "layout": "main"
        },
        {
            "path": "/login",
            "pagePath": "/login",
            "title": "Login",
            "protected": False,
            "layout": "none"
        },
        {
            "path": "/admin",
            "pagePath": "/dashboard",
            "title": "Dashboard",
            "protected": True,
            "layout": "admin"
        }
    ]
    
    # Type-specific routes
    type_routes = {
        "construction": [
            {
                "path": "/admin/projects",
                "pagePath": "/projects",
                "title": "Projects",
                "protected": True,
                "layout": "admin"
            },
            {
                "path": "/admin/equipment",
                "pagePath": "/equipment",
                "title": "Equipment",
                "protected": True,
                "layout": "admin"
            }
        ],
        "hr": [
            {
                "path": "/admin/employees",
                "pagePath": "/employees",
                "title": "Employees",
                "protected": True,
                "layout": "admin"
            },
            {
                "path": "/admin/payroll",
                "pagePath": "/payroll",
                "title": "Payroll",
                "protected": True,
                "layout": "admin"
            }
        ]
    }
    
    return base_routes + type_routes.get(tenant_type, [])

# Usage
construction_routes = generate_routes_config("construction")
hr_routes = generate_routes_config("hr")
```
