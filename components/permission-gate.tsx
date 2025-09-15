'use client'

import { usePermissions } from '@/contexts/PermissionContext-simple'
import { ReactNode } from 'react'

interface PermissionGateProps {
  /**
   * The permission key to check (e.g., 'admin.canManageUsers', 'dashboard.canViewBusiness')
   */
  permission: string
  /**
   * Content to render when permission is granted
   */
  children: ReactNode
  /**
   * Optional fallback content when permission is denied
   */
  fallback?: ReactNode
  /**
   * Whether to render nothing (null) when permission is denied (default: true)
   */
  hideWhenDenied?: boolean
}

/**
 * PermissionGate - Declarative permission-based rendering component
 * 
 * Usage examples:
 * <PermissionGate permission="admin.canManageUsers">
 *   <AdminPanel />
 * </PermissionGate>
 * 
 * <PermissionGate permission="dashboard.canViewBusiness" fallback={<div>Access denied</div>}>
 *   <BusinessDashboard />
 * </PermissionGate>
 */
export function PermissionGate({ 
  permission, 
  children, 
  fallback = null, 
  hideWhenDenied = true 
}: PermissionGateProps) {
  const permissions = usePermissions()
  
  // Check if user has the required permission
  const hasPermission = checkPermission(permissions, permission)
  
  if (hasPermission) {
    return <>{children}</>
  }
  
  // Return fallback or null based on hideWhenDenied setting
  return hideWhenDenied ? null : <>{fallback}</>
}

/**
 * Check if a permission exists using dot notation
 * e.g., 'dashboard.canViewBusiness' checks permissions.permissions.dashboard.canViewBusiness
 */
function checkPermission(permissions: any, permissionPath: string): boolean {
  if (!permissions || !permissionPath) return false
  
  // The permission context has the actual permissions under 'permissions' property
  const permissionsData = permissions.permissions || permissions
  
  const keys = permissionPath.split('.')
  let current = permissionsData
  
  for (const key of keys) {
    if (current?.[key] === undefined) {
      return false
    }
    current = current[key]
  }
  
  return Boolean(current)
}

/**
 * Hook for checking permissions in components
 */
export function usePermissionCheck(permission: string): boolean {
  const permissions = usePermissions()
  return checkPermission(permissions, permission)
}

/**
 * Higher-order component for permission-based rendering
 */
export function withPermission<T extends object>(
  Component: React.ComponentType<T>,
  requiredPermission: string,
  fallback?: ReactNode
) {
  return function PermissionWrappedComponent(props: T) {
    return (
      <PermissionGate permission={requiredPermission} fallback={fallback}>
        <Component {...props} />
      </PermissionGate>
    )
  }
}

export default PermissionGate
