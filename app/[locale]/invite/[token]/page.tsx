"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { SignupForm } from '@/components/signup-form'
import { invitationService } from '@/lib/invitation-service'
import { Invitation } from '@/types/invitations'
import { 
  Mail, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Shield, 
  Users, 
  UserCog, 
  Crown,
  Loader2
} from 'lucide-react'

export default function InviteAcceptPage() {
  const params = useParams()
  const router = useRouter()
  const [invitation, setInvitation] = useState<Invitation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const token = params.token as string

  useEffect(() => {
    const loadInvitation = async () => {
      if (!token) {
        setError('Invalid invitation link')
        setLoading(false)
        return
      }

      try {
        const inv = await invitationService.getInvitationByToken(token)
        if (!inv) {
          setError('Invitation not found')
        } else if (inv.status === 'expired') {
          setError('This invitation has expired')
        } else if (inv.status === 'cancelled') {
          setError('This invitation has been cancelled')
        } else if (inv.status === 'accepted') {
          setError('This invitation has already been accepted')
        } else {
          setInvitation(inv)
        }
      } catch (error) {
        setError('Failed to load invitation')
      } finally {
        setLoading(false)
      }
    }

    loadInvitation()
  }, [token])

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'super_admin': return <Crown className="h-5 w-5" />
      case 'admin': return <Shield className="h-5 w-5" />
      case 'manager': return <UserCog className="h-5 w-5" />
      case 'affiliate': return <Users className="h-5 w-5" />
      case 'customer': return <Users className="h-5 w-5" />
      default: return <Users className="h-5 w-5" />
    }
  }

  const handleSignupComplete = async () => {
    if (!invitation) return

    try {
      await invitationService.acceptInvitation(token)
      router.push('/dashboard')
    } catch (error) {
      console.error('Failed to accept invitation:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading invitation...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-red-700">Invitation Error</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <div className="mt-6 text-center">
              <Button onClick={() => router.push('/')} variant="outline">
                Return to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!invitation) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto space-y-6 p-4">
        
        {/* Invitation Info */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Mail className="h-6 w-6 text-blue-600" />
              You're Invited!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-blue-900">
                    Invited by: {invitation.invitedByName}
                  </p>
                  <p className="text-sm text-blue-700">
                    Role: {invitationService.getRoleDisplayName(invitation.role)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {getRoleIcon(invitation.role)}
                  <Badge variant={invitationService.getRoleBadgeVariant(invitation.role)}>
                    {invitationService.getRoleDisplayName(invitation.role)}
                  </Badge>
                </div>
              </div>

              {invitation.message && (
                <Alert>
                  <AlertDescription className="italic">
                    "{invitation.message}"
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex items-center gap-2 text-sm text-blue-700">
                <Clock className="h-4 w-4" />
                <span>
                  Expires: {new Date(invitation.expiresAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Signup Form */}
        <Card>
          <CardHeader>
            <CardTitle>Complete Your Registration</CardTitle>
            <p className="text-muted-foreground">
              Create your account to accept the invitation and join the team.
            </p>
          </CardHeader>
          <CardContent>
            <SignupForm 
              onSignupComplete={handleSignupComplete}
              prefilledEmail={invitation.email}
              assignedRole={invitation.role}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
