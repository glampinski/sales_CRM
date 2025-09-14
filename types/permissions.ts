// =============================================================================
// SIMPLE GROUP PERMISSION TYPES
// =============================================================================

// User groups (simplified from complex roles)
export type UserRole = 'super_admin' | 'admin' | 'manager' | 'affiliate' | 'customer'

// Basic permission structure for backward compatibility
export type Permission = string
export type PermissionModule = string  
export type PermissionAction = string

// Simple group configuration
export interface GroupPermissions {
  [componentId: string]: boolean
}

// Basic role permissions (simplified for compatibility)
export interface RolePermissions {
  role: UserRole
  description: string
  permissions: Permission[]
  modules: Record<string, any>
}

// Simple default permissions for compatibility with existing components
export const DEFAULT_ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  super_admin: {
    role: 'super_admin',
    description: 'Full system access',
    permissions: ['*'],
    modules: {}
  },
  admin: {
    role: 'admin', 
    description: 'Administrative access',
    permissions: ['admin.*'],
    modules: {}
  },
  manager: {
    role: 'manager',
    description: 'Management access', 
    permissions: ['manager.*'],
    modules: {}
  },
  affiliate: {
    role: 'affiliate',
    description: 'Affiliate access',
    permissions: ['affiliate.*'],
    modules: {}
  },
  customer: {
    role: 'customer',
    description: 'Customer access',
    permissions: ['customer.*'],
    modules: {}
  }
}

// Empty dashboard widgets for compatibility
export const DASHBOARD_WIDGETS: any[] = []
