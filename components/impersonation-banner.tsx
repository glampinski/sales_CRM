"use client"

import { useAuth } from '@/contexts/AuthContext'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { UserX, AlertTriangle } from 'lucide-react'

export function ImpersonationBanner() {
  const { isImpersonating, originalUser, user, stopImpersonation } = useAuth()

  if (!isImpersonating || !originalUser || !user) {
    return null
  }

  return (
    <Alert className="border-orange-500 bg-orange-50 border-2 rounded-none">
      <AlertTriangle className="h-4 w-4 text-orange-600" />
      <AlertDescription className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-orange-800">
            🚨 IMPERSONATION MODE
          </span>
          <span className="text-orange-700">
            You ({originalUser.name}) are viewing as: <strong>{user.name} ({user.role})</strong>
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={stopImpersonation}
          className="border-orange-600 text-orange-700 hover:bg-orange-100"
        >
          <UserX className="h-4 w-4 mr-2" />
          Exit Impersonation
        </Button>
      </AlertDescription>
    </Alert>
  )
}
