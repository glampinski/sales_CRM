"use client"

import { useAuth } from '@/contexts/AuthContext'
import { usePermissions } from '@/contexts/PermissionContext-simple'
import { ReactNode } from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Shield } from 'lucide-react'

interface ProtectedRouteProps {
  children: ReactNode
  /**
   * @deprecated Use permissionKey instead. Will be removed in next version.
   */
  requiredRole?: string[]
  /**
   * Permission key to check (e.g., 'admin.canManageUsers', 'dashboard.canViewBusiness')
   * This replaces the old requiredRole system
   */
  permissionKey?: string
  /**
   * @deprecated Use permissionKey instead
   */
  requiredPermission?: { resource: string; action: string }
  /**
   * @deprecated Use permissionKey instead
   */
  requiredFeature?: string
  fallback?: ReactNode
}

export function ProtectedRoute({ 
  children, 
  requiredRole, 
  permissionKey,
  requiredPermission, 
  requiredFeature,
  fallback 
}: ProtectedRouteProps) {
  const { user, hasPermission, hasFeatureAccess, isLoading } = useAuth()
  const permissions = usePermissions()

  // Show loading state during auth check
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return fallback || (
      <Alert className="m-4">
        <Shield className="h-4 w-4" />
        <AlertDescription>
          You must be logged in to access this content.
        </AlertDescription>
      </Alert>
    )
  }

  // NEW: Check permission-based access using permission key
  if (permissionKey) {
    const hasAccess = checkPermission(permissions, permissionKey)
    if (!hasAccess) {
      return fallback || (
        <Alert className="m-4" variant="destructive">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            You don't have permission to access this content.
          </AlertDescription>
        </Alert>
      )
    }
  }

  // LEGACY: Check role-based access (deprecated)
  if (requiredRole && !requiredRole.includes(user.role)) {
    console.warn('ProtectedRoute: requiredRole is deprecated. Use permissionKey instead.')
    console.log('Access denied:', {
      userRole: user.role,
      requiredRoles: requiredRole,
      user: user
    })
    return fallback || (
      <Alert className="m-4" variant="destructive">
        <Shield className="h-4 w-4" />
        <AlertDescription>
          You don't have the required role to access this content. Your role: {user.role}
        </AlertDescription>
      </Alert>
    )
  }

  // LEGACY: Check permission-based access (deprecated)
  if (requiredPermission && !hasPermission(requiredPermission.resource, requiredPermission.action)) {
    console.warn('ProtectedRoute: requiredPermission is deprecated. Use permissionKey instead.')
    return fallback || (
      <Alert className="m-4" variant="destructive">
        <Shield className="h-4 w-4" />
        <AlertDescription>
          You don't have permission to access this content.
        </AlertDescription>
      </Alert>
    )
  }

  // LEGACY: Check feature-based access (deprecated)
  if (requiredFeature && !hasFeatureAccess(requiredFeature)) {
    console.warn('ProtectedRoute: requiredFeature is deprecated. Use permissionKey instead.')
    return fallback || (
      <Alert className="m-4" variant="destructive">
        <Shield className="h-4 w-4" />
        <AlertDescription>
          You don't have access to this feature.
        </AlertDescription>
      </Alert>
    )
  }

  return <>{children}</>
}

/**
 * Check if a permission exists using dot notation
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

interface ConditionalRenderProps {
  children: ReactNode
  requiredRole?: string[]
  requiredFeature?: string
  fallback?: ReactNode
}

export function ConditionalRender({ 
  children, 
  requiredRole, 
  requiredFeature, 
  fallback 
}: ConditionalRenderProps) {
  const { user, hasFeatureAccess } = useAuth()

  if (!user) return fallback || null

  if (requiredRole && !requiredRole.includes(user.role)) {
    return fallback || null
  }

  if (requiredFeature && !hasFeatureAccess(requiredFeature)) {
    return fallback || null
  }

  return <>{children}</>
}
