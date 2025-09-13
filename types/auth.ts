export type UserRole = 'super_admin' | 'admin' | 'salesperson' | 'customer'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  permissions?: Permission[]
  createdAt: string
  lastLogin?: string
}

export interface Permission {
  id: string
  name: string
  description: string
  resource: string
  action: 'create' | 'read' | 'update' | 'delete' | 'manage'
}

export interface RolePermissions {
  role: UserRole
  permissions: Permission[]
  pages: string[]
  features: string[]
}

// Default role configurations
export const DEFAULT_ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  super_admin: {
    role: 'super_admin',
    permissions: [], // Will have all permissions
    pages: ['*'], // Access to all pages
    features: ['*'] // Access to all features
  },
  admin: {
    role: 'admin',
    permissions: [],
    pages: [
      '/dashboard',
      '/dashboard/customers',
      '/dashboard/products',
      '/dashboard/orders',
      '/dashboard/distributors',
      '/dashboard/reports',
      '/dashboard/settings'
    ],
    features: [
      'customer_management',
      'product_management',
      'order_management',
      'distributor_management',
      'reports',
      'settings'
    ]
  },
  salesperson: {
    role: 'salesperson',
    permissions: [],
    pages: [
      '/dashboard',
      '/dashboard/customers',
      '/dashboard/products',
      '/dashboard/orders',
      '/dashboard/pipeline'
    ],
    features: [
      'customer_view',
      'customer_create',
      'product_view',
      'order_create',
      'order_view',
      'pipeline'
    ]
  },
  customer: {
    role: 'customer',
    permissions: [],
    pages: [
      '/dashboard',
      '/dashboard/orders',
      '/onboarding'
    ],
    features: [
      'order_view_own',
      'timeshare_purchase',
      'profile_view'
    ]
  }
}
