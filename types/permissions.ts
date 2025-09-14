// =============================================================================
// PERMISSION TYPES - Comprehensive Permission Management System
// =============================================================================

// User roles in the system
export type UserRole = 'super_admin' | 'admin' | 'manager' | 'affiliate' | 'customer'

// Permission modules (main areas of the application)
export type PermissionModule = 
  | 'dashboard'
  | 'users' 
  | 'customers'
  | 'affiliates'
  | 'products'
  | 'orders'
  | 'analytics'
  | 'reports'
  | 'settings'
  | 'finance'
  | 'mlm'
  | 'communications'

// Available permission modules array
export const PERMISSION_MODULES: PermissionModule[] = [
  'dashboard',
  'users',
  'customers',
  'affiliates',
  'products',
  'orders',
  'analytics',
  'reports',
  'settings',
  'finance',
  'mlm',
  'communications'
]

// Specific actions that can be performed within each module
export type PermissionAction = 
  | 'view'
  | 'create' 
  | 'edit'
  | 'delete'
  | 'manage'
  | 'approve'
  | 'export'
  | 'import'

// Available permission actions array
export const PERMISSION_ACTIONS: PermissionAction[] = [
  'view',
  'create',
  'edit',
  'delete',
  'manage',
  'approve',
  'export',
  'import'
]

// Combined permission string format: "module:action"
export type Permission = `${PermissionModule}:${PermissionAction}`

// Module configuration for a role
export interface ModulePermissions {
  enabled: boolean
  actions: PermissionAction[]
  features?: string[] // Optional feature-level permissions
}

// Complete permission configuration for a role
export interface RolePermissions {
  role: UserRole
  description: string
  permissions: Permission[]
  modules: Partial<Record<PermissionModule, ModulePermissions>>
}

// Dashboard widget configuration
export interface DashboardWidget {
  id: string
  name: string
  description: string
  component: string
  requiredPermission: Permission
  enabled: boolean
  order: number
  roleSpecific?: Partial<Record<UserRole, {
    enabled: boolean
    variant?: string
  }>>
}

// =============================================================================
// DEFAULT CONFIGURATIONS
// =============================================================================

// Default role permissions
export const DEFAULT_ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  super_admin: {
    role: 'super_admin',
    description: 'Full system access with all permissions',
    permissions: [],
    modules: Object.fromEntries(
      PERMISSION_MODULES.map(module => [
        module,
        { enabled: true, actions: [...PERMISSION_ACTIONS] }
      ])
    ) as Record<PermissionModule, ModulePermissions>
  },
  
  admin: {
    role: 'admin',
    description: 'Administrative access with most permissions',
    permissions: [
      'dashboard:view',
      'users:view', 'users:create', 'users:edit', 'users:manage',
      'customers:view', 'customers:create', 'customers:edit', 'customers:delete', 'customers:export',
      'affiliates:view', 'affiliates:create', 'affiliates:edit', 'affiliates:manage',
      'products:view', 'products:create', 'products:edit', 'products:delete',
      'orders:view', 'orders:create', 'orders:edit', 'orders:manage',
      'analytics:view', 'analytics:export',
      'reports:view', 'reports:create', 'reports:export',
      'settings:view', 'settings:edit',
      'finance:view', 'finance:manage',
      'mlm:view', 'mlm:manage',
      'communications:view', 'communications:create', 'communications:manage'
    ],
    modules: {
      dashboard: { enabled: true, actions: ['view'] },
      users: { enabled: true, actions: ['view', 'create', 'edit', 'manage'] },
      customers: { enabled: true, actions: ['view', 'create', 'edit', 'delete', 'export'] },
      affiliates: { enabled: true, actions: ['view', 'create', 'edit', 'manage'] },
      products: { enabled: true, actions: ['view', 'create', 'edit', 'delete'] },
      orders: { enabled: true, actions: ['view', 'create', 'edit', 'manage'] },
      analytics: { enabled: true, actions: ['view', 'export'] },
      reports: { enabled: true, actions: ['view', 'create', 'export'] },
      settings: { enabled: true, actions: ['view', 'edit'] },
      finance: { enabled: true, actions: ['view', 'manage'] },
      mlm: { enabled: true, actions: ['view', 'manage'] },
      communications: { enabled: true, actions: ['view', 'create', 'manage'] }
    }
  },
  
  manager: {
    role: 'manager',
    description: 'Management level access',
    permissions: [
      'dashboard:view',
      'users:view',
      'customers:view', 'customers:create', 'customers:edit', 'customers:export',
      'affiliates:view', 'affiliates:edit',
      'products:view',
      'orders:view', 'orders:edit',
      'analytics:view',
      'reports:view', 'reports:export',
      'communications:view', 'communications:create'
    ],
    modules: {
      dashboard: { enabled: true, actions: ['view'] },
      users: { enabled: true, actions: ['view'] },
      customers: { enabled: true, actions: ['view', 'create', 'edit', 'export'] },
      affiliates: { enabled: true, actions: ['view', 'edit'] },
      products: { enabled: true, actions: ['view'] },
      orders: { enabled: true, actions: ['view', 'edit'] },
      analytics: { enabled: true, actions: ['view'] },
      reports: { enabled: true, actions: ['view', 'export'] },
      communications: { enabled: true, actions: ['view', 'create'] }
    }
  },
  
  affiliate: {
    role: 'affiliate',
    description: 'Affiliate access for MLM operations',
    permissions: [
      'dashboard:view',
      'customers:view', 'customers:create',
      'products:view',
      'orders:view', 'orders:create',
      'mlm:view',
      'communications:view'
    ],
    modules: {
      dashboard: { enabled: true, actions: ['view'] },
      customers: { enabled: true, actions: ['view', 'create'] },
      products: { enabled: true, actions: ['view'] },
      orders: { enabled: true, actions: ['view', 'create'] },
      mlm: { enabled: true, actions: ['view'] },
      communications: { enabled: true, actions: ['view'] }
    }
  },
  
  customer: {
    role: 'customer',
    description: 'Basic customer access',
    permissions: [
      'dashboard:view',
      'products:view',
      'orders:view'
    ],
    modules: {
      dashboard: { enabled: true, actions: ['view'] },
      products: { enabled: true, actions: ['view'] },
      orders: { enabled: true, actions: ['view'] }
    }
  }
}

// Default dashboard widgets
export const DASHBOARD_WIDGETS: DashboardWidget[] = [
  {
    id: 'revenue_summary',
    name: 'Revenue Summary',
    description: 'Overview of total revenue and trends',
    component: 'RevenueSummaryWidget',
    requiredPermission: 'finance:view',
    enabled: true,
    order: 1,
    roleSpecific: {
      super_admin: { enabled: true, variant: 'full' },
      admin: { enabled: true, variant: 'detailed' },
      manager: { enabled: true, variant: 'summary' },
      affiliate: { enabled: true, variant: 'personal' },
      customer: { enabled: false }
    }
  },
  {
    id: 'user_statistics',
    name: 'User Statistics',
    description: 'User registration and activity metrics',
    component: 'UserStatsWidget',
    requiredPermission: 'users:view',
    enabled: true,
    order: 2,
    roleSpecific: {
      super_admin: { enabled: true },
      admin: { enabled: true },
      manager: { enabled: true, variant: 'basic' },
      affiliate: { enabled: false },
      customer: { enabled: false }
    }
  },
  {
    id: 'sales_pipeline',
    name: 'Sales Pipeline',
    description: 'Current sales opportunities and pipeline',
    component: 'SalesPipelineWidget',
    requiredPermission: 'orders:view',
    enabled: true,
    order: 3,
    roleSpecific: {
      super_admin: { enabled: true },
      admin: { enabled: true },
      manager: { enabled: true },
      affiliate: { enabled: true, variant: 'personal' },
      customer: { enabled: true, variant: 'personal' }
    }
  },
  {
    id: 'recent_orders',
    name: 'Recent Orders',
    description: 'Latest order activity and status',
    component: 'RecentOrdersWidget',
    requiredPermission: 'orders:view',
    enabled: true,
    order: 4
  },
  {
    id: 'commission_summary',
    name: 'Commission Summary',
    description: 'MLM commission tracking and payouts',
    component: 'CommissionWidget',
    requiredPermission: 'mlm:view',
    enabled: true,
    order: 5,
    roleSpecific: {
      super_admin: { enabled: true },
      admin: { enabled: true },
      manager: { enabled: false },
      affiliate: { enabled: true, variant: 'personal' },
      customer: { enabled: false }
    }
  },
  {
    id: 'analytics_overview',
    name: 'Analytics Overview',
    description: 'Key performance indicators and metrics',
    component: 'AnalyticsWidget',
    requiredPermission: 'analytics:view',
    enabled: true,
    order: 6,
    roleSpecific: {
      super_admin: { enabled: true },
      admin: { enabled: true },
      manager: { enabled: true },
      affiliate: { enabled: false },
      customer: { enabled: false }
    }
  }
]
