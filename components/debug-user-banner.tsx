"use client"

import { useAuth } from '@/contexts/AuthContext'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { User, Shield } from 'lucide-react'

export function DebugUserBanner() {
  const { user, originalUser, isImpersonating } = useAuth()

  // Only show in development
  if (process.env.NODE_ENV !== 'development') return null

  return (
    <Alert className="m-4 border-blue-500 bg-blue-50">
      <Shield className="h-4 w-4" />
      <AlertDescription className="space-y-2">
        <div className="font-semibold">🔧 Debug Info (Development Only)</div>
        
        {isImpersonating && (
          <div className="space-y-1">
            <div className="text-sm">
              <strong>Original User:</strong> {originalUser?.name} ({originalUser?.role})
            </div>
            <div className="text-sm">
              <strong>Impersonating:</strong> {user?.name} ({user?.role})
              <Badge variant="secondary" className="ml-2">Impersonating</Badge>
            </div>
          </div>
        )}
        
        {!isImpersonating && user && (
          <div className="text-sm">
            <strong>Current User:</strong> {user.name} ({user.role})
            <Badge variant="outline" className="ml-2">Direct Login</Badge>
          </div>
        )}
        
        {!user && (
          <div className="text-sm text-red-600">
            <strong>No User Logged In</strong>
          </div>
        )}
        
        <div className="text-xs text-gray-600">
          User ID: {user?.id || 'None'} | Email: {user?.email || 'None'}
        </div>
      </AlertDescription>
    </Alert>
  )
}
