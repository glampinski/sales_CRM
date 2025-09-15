"use client"

import { useState } from 'react'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { InviteUserForm } from '@/components/invite-user-form'
import { InvitationManagement } from '@/components/invitation-management'
import { usePermissions } from '@/contexts/PermissionContext-simple'
import { Shield, UserPlus, Users } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function InvitationsPage() {
  const { hasModuleAccess } = usePermissions()
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleInvitationSent = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  // Permission-based access control
  if (!hasModuleAccess('admin')) {
    return (
      <div className="p-6">
        <div className="text-center">
          <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Admin Access Required</h1>
          <p className="text-muted-foreground">
            You need admin permissions to manage user invitations.
          </p>
        </div>
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">User Invitations</h1>
          <p className="text-muted-foreground">
            Send email invitations to add new users to the system
          </p>
        </div>

        <Tabs defaultValue="invite" className="space-y-6">
          <TabsList>
            <TabsTrigger value="invite" className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Send Invitation
            </TabsTrigger>
            <TabsTrigger value="manage" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Manage Invitations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="invite" className="space-y-6">
            <div className="max-w-2xl">
              <InviteUserForm onInvitationSent={handleInvitationSent} />
            </div>
          </TabsContent>

          <TabsContent value="manage" className="space-y-6">
            <InvitationManagement refreshTrigger={refreshTrigger} />
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  )
}
