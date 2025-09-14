"use client"

import { ReactNode } from 'react'
import { usePermissions } from '@/contexts/PermissionContext'
import { Permission, PermissionModule, PermissionAction } from '@/types/permissions'

interface PermissionGateProps {
  children: ReactNode
  permission?: Permission
  module?: PermissionModule
  action?: PermissionAction
  fallback?: ReactNode
  requireAll?: boolean // If multiple permissions, require all vs any
}

export function PermissionGate({ 
  children, 
  permission, 
  module, 
  action, 
  fallback = null,
  requireAll = true
}: PermissionGateProps) {
  const { hasPermission, hasModuleAction } = usePermissions()

  // Check specific permission
  if (permission) {
    return hasPermission(permission) ? <>{children}</> : <>{fallback}</>
  }

  // Check module + action
  if (module && action) {
    return hasModuleAction(module, action) ? <>{children}</> : <>{fallback}</>
  }

  // If no permission specified, show children (fail-open for development)
  return <>{children}</>
}

interface ConditionalRenderProps {
  children: ReactNode
  condition: boolean
  fallback?: ReactNode
}

export function ConditionalRender({ children, condition, fallback = null }: ConditionalRenderProps) {
  return condition ? <>{children}</> : <>{fallback}</>
}

// Higher-order component for permission-based rendering
export function withPermission<T extends {}>(
  Component: React.ComponentType<T>,
  permission: Permission | { module: PermissionModule; action: PermissionAction },
  fallback?: ReactNode
) {
  return function PermissionWrappedComponent(props: T) {
    const permissionGateProps = typeof permission === 'string' 
      ? { permission } 
      : { module: permission.module, action: permission.action }

    return (
      <PermissionGate {...permissionGateProps} fallback={fallback}>
        <Component {...props} />
      </PermissionGate>
    )
  }
}
