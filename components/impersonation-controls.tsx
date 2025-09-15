"use client"

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { UserCheck, Shield, Eye, AlertTriangle } from 'lucide-react'

// Mock users for impersonation
const IMPERSONATION_TARGETS = [
  { id: '2', name: 'Department Head', email: 'admin@glampinski.com', role: 'admin' },
  { id: '3', name: 'Department Employee', email: 'manager@glampinski.com', role: 'manager' },
  { id: '4', name: 'John Customer', email: 'customer@example.com', role: 'customer' },
  { id: '5', name: 'Jane Affiliate', email: 'affiliate@glampinski.com', role: 'affiliate' }
]

export function ImpersonationControls() {
  const { user, canImpersonate, startImpersonation, isImpersonating } = useAuth()
  const [selectedUserId, setSelectedUserId] = useState<string>('')
  const [error, setError] = useState('')

  if (!canImpersonate()) {
    return null
  }

  const handleImpersonate = () => {
    if (!selectedUserId) {
      setError('Please select a user to impersonate')
      return
    }

    const success = startImpersonation(selectedUserId)
    if (!success) {
      setError('Failed to start impersonation')
    } else {
      setError('')
      // Redirect to dashboard to see the impersonated view
      window.location.href = '/dashboard'
    }
  }

  return (
    <Card className="border-orange-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-orange-600" />
          User Impersonation
        </CardTitle>
        <CardDescription>
          View the application from another user's perspective. Use this feature responsibly for support and debugging.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Alert className="border-orange-200 bg-orange-50">
          <Shield className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>Security Notice:</strong> Impersonation allows you to access another user's data and perform actions on their behalf. 
            All impersonation activities should be logged and monitored.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Select User to Impersonate</label>
            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a user..." />
              </SelectTrigger>
              <SelectContent>
                {IMPERSONATION_TARGETS.map((target) => (
                  <SelectItem key={target.id} value={target.id}>
                    <div className="flex items-center gap-2">
                      <UserCheck className="h-4 w-4" />
                      <span>{target.name} ({target.role})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={handleImpersonate}
            disabled={isImpersonating || !selectedUserId}
            className="w-full"
            variant="outline"
          >
            <Eye className="h-4 w-4 mr-2" />
            {isImpersonating ? 'Already Impersonating' : 'Start Impersonation'}
          </Button>
        </div>

        {isImpersonating && (
          <Alert className="border-green-200 bg-green-50">
            <UserCheck className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              You are currently impersonating another user. Use the banner at the top to exit impersonation mode.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
