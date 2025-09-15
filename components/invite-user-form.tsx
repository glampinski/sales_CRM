"use client"

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/contexts/AuthContext'
import { invitationService } from '@/lib/invitation-service'
import { InvitationFormData, UserRole } from '@/types/invitations'
import { Mail, Send, Users, Shield, UserCog, Crown } from 'lucide-react'

const invitationSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  role: z.enum(['super_admin', 'admin', 'manager', 'affiliate', 'customer']),
  message: z.string().optional(),
})

interface InviteUserFormProps {
  onInvitationSent?: () => void
}

export function InviteUserForm({ onInvitationSent }: InviteUserFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { user } = useAuth()

  const form = useForm<InvitationFormData>({
    resolver: zodResolver(invitationSchema),
    defaultValues: {
      email: '',
      role: 'customer',
      message: '',
    },
  })

  const onSubmit = async (data: InvitationFormData) => {
    if (!user) return

    setIsLoading(true)
    try {
      await invitationService.sendInvitation(data, user.id, user.name)
      
      toast({
        title: "Invitation Sent!",
        description: `Successfully sent ${invitationService.getRoleDisplayName(data.role)} invitation to ${data.email}`,
      })

      form.reset()
      onInvitationSent?.()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send invitation. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'super_admin': return <Crown className="h-4 w-4" />
      case 'admin': return <Shield className="h-4 w-4" />
      case 'manager': return <UserCog className="h-4 w-4" />
      case 'affiliate': return <Users className="h-4 w-4" />
      case 'customer': return <Users className="h-4 w-4" />
      default: return <Users className="h-4 w-4" />
    }
  }

  const getRoleDescription = (role: UserRole) => {
    switch (role) {
      case 'super_admin': return 'Full system access and user management'
      case 'admin': return 'Department head with team management privileges'
      case 'manager': return 'Department employee with limited admin access'
      case 'affiliate': return 'Sales affiliate with referral capabilities'
      case 'customer': return 'End customer with basic access'
      default: return ''
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Invite New User
        </CardTitle>
        <CardDescription>
          Send an email invitation to add a new user to the system
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="user@example.com"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="customer">
                        <div className="flex items-center gap-2">
                          {getRoleIcon('customer')}
                          <span>Customer</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="affiliate">
                        <div className="flex items-center gap-2">
                          {getRoleIcon('affiliate')}
                          <span>Affiliate</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="manager">
                        <div className="flex items-center gap-2">
                          {getRoleIcon('manager')}
                          <span>Manager (Department Employee)</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="admin">
                        <div className="flex items-center gap-2">
                          {getRoleIcon('admin')}
                          <span>Admin (Department Head)</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="super_admin">
                        <div className="flex items-center gap-2">
                          {getRoleIcon('super_admin')}
                          <span>Super Admin</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                  
                  {/* Role Description */}
                  {field.value && (
                    <Alert className="mt-2">
                      <AlertDescription className="flex items-center gap-2">
                        {getRoleIcon(field.value)}
                        <span className="text-sm">{getRoleDescription(field.value)}</span>
                      </AlertDescription>
                    </Alert>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Personal Message (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Welcome to our team! We're excited to have you on board..."
                      rows={3}
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button type="submit" disabled={isLoading}>
                <Send className="mr-2 h-4 w-4" />
                {isLoading ? "Sending..." : "Send Invitation"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
