"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { useToast } from '@/hooks/use-toast'
import { invitationService } from '@/lib/invitation-service'
import { Invitation, InvitationStats } from '@/types/invitations'
import { 
  MoreHorizontal, 
  Send, 
  X, 
  Clock, 
  CheckCircle, 
  XCircle,
  RefreshCw,
  Users,
  Mail,
  CalendarDays
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface InvitationManagementProps {
  refreshTrigger?: number
}

export function InvitationManagement({ refreshTrigger }: InvitationManagementProps) {
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [stats, setStats] = useState<InvitationStats>({
    total: 0,
    pending: 0,
    accepted: 0,
    expired: 0
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const loadInvitations = async () => {
    setIsLoading(true)
    try {
      await invitationService.updateExpiredInvitations()
      const [invitationsList, invitationStats] = await Promise.all([
        invitationService.getInvitations(),
        invitationService.getInvitationStats()
      ])
      setInvitations(invitationsList)
      setStats(invitationStats)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load invitations",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadInvitations()
  }, [refreshTrigger])

  const handleCancelInvitation = async (invitationId: string) => {
    try {
      const success = await invitationService.cancelInvitation(invitationId)
      if (success) {
        toast({
          title: "Invitation Cancelled",
          description: "The invitation has been cancelled successfully."
        })
        loadInvitations()
      } else {
        toast({
          title: "Error",
          description: "Failed to cancel invitation",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel invitation",
        variant: "destructive"
      })
    }
  }

  const handleResendInvitation = async (invitationId: string) => {
    try {
      const success = await invitationService.resendInvitation(invitationId)
      if (success) {
        toast({
          title: "Invitation Resent",
          description: "The invitation has been resent successfully."
        })
        loadInvitations()
      } else {
        toast({
          title: "Error",
          description: "Failed to resend invitation",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resend invitation",
        variant: "destructive"
      })
    }
  }

  const getStatusIcon = (status: Invitation['status']) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />
      case 'accepted': return <CheckCircle className="h-4 w-4" />
      case 'expired': return <XCircle className="h-4 w-4" />
      case 'cancelled': return <X className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const getStatusVariant = (status: Invitation['status']) => {
    switch (status) {
      case 'pending': return 'default'
      case 'accepted': return 'default'
      case 'expired': return 'secondary'
      case 'cancelled': return 'outline'
      default: return 'outline'
    }
  }

  const getStatusColor = (status: Invitation['status']) => {
    switch (status) {
      case 'pending': return 'text-blue-600'
      case 'accepted': return 'text-green-600'
      case 'expired': return 'text-red-600'
      case 'cancelled': return 'text-gray-500'
      default: return 'text-gray-500'
    }
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invitations</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              All time invitations sent
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting response
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accepted</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.accepted}</div>
            <p className="text-xs text-muted-foreground">
              Successfully joined
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expired</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.expired}</div>
            <p className="text-xs text-muted-foreground">
              Not responded in time
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Invitations Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Recent Invitations
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={loadInvitations}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {invitations.length === 0 ? (
            <div className="text-center py-8">
              <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No invitations yet</h3>
              <p className="text-muted-foreground">Start by sending your first invitation above.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Invited By</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead className="w-[70px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invitations.map((invitation) => (
                  <TableRow key={invitation.id}>
                    <TableCell className="font-medium">
                      {invitation.email}
                    </TableCell>
                    <TableCell>
                      <Badge variant={invitationService.getRoleBadgeVariant(invitation.role)}>
                        {invitationService.getRoleDisplayName(invitation.role)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className={`flex items-center gap-2 ${getStatusColor(invitation.status)}`}>
                        {getStatusIcon(invitation.status)}
                        <span className="capitalize">{invitation.status}</span>
                      </div>
                    </TableCell>
                    <TableCell>{invitation.invitedByName}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <CalendarDays className="h-3 w-3" />
                        {formatDistanceToNow(new Date(invitation.createdAt), { addSuffix: true })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {new Date(invitation.expiresAt) > new Date() 
                          ? formatDistanceToNow(new Date(invitation.expiresAt))
                          : 'Expired'
                        }
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {invitation.status === 'pending' && (
                            <>
                              <DropdownMenuItem onClick={() => handleResendInvitation(invitation.id)}>
                                <Send className="mr-2 h-4 w-4" />
                                Resend
                              </DropdownMenuItem>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                    <X className="mr-2 h-4 w-4" />
                                    Cancel
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Cancel Invitation</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to cancel the invitation to {invitation.email}? 
                                      This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={() => handleCancelInvitation(invitation.id)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Cancel Invitation
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
