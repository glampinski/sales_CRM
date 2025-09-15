"use client"

import { useAuth } from '@/contexts/AuthContext'
import { ReactNode } from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Shield } from 'lucide-react'

interface ProtectedRouteProps {
  children: ReactNode
  requiredRole?: string[]
  requiredPermission?: { resource: string; action: string }
  requiredFeature?: string
  fallback?: ReactNode
}

export function ProtectedRoute({ 
  children, 
  requiredRole, 
  requiredPermission, 
  requiredFeature,
  fallback 
}: ProtectedRouteProps) {
  const { user, hasPermission, hasFeatureAccess, isLoading } = useAuth()

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

  // Check role-based access
  if (requiredRole && !requiredRole.includes(user.role)) {
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

  // Check permission-based access
  if (requiredPermission && !hasPermission(requiredPermission.resource, requiredPermission.action)) {
    return fallback || (
      <Alert className="m-4" variant="destructive">
        <Shield className="h-4 w-4" />
        <AlertDescription>
          You don't have permission to access this content.
        </AlertDescription>
      </Alert>
    )
  }

  // Check feature-based access
  if (requiredFeature && !hasFeatureAccess(requiredFeature)) {
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
