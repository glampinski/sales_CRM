// Mock invitation service - In production, this would integrate with your email service
import { Invitation, InvitationFormData, InvitationStats, UserRole } from '@/types/invitations'

class InvitationService {
  private invitations: Invitation[] = [
    {
      id: 'inv_1',
      email: 'newadmin@glampinski.com',
      role: 'admin',
      invitedBy: '1',
      invitedByName: 'Super Admin',
      status: 'pending',
      createdAt: '2024-09-14T10:00:00Z',
      expiresAt: '2024-09-21T10:00:00Z',
      token: 'token_abc123',
      message: 'Welcome to the admin team!'
    },
    {
      id: 'inv_2',
      email: 'manager2@glampinski.com',
      role: 'manager',
      invitedBy: '1',
      invitedByName: 'Super Admin',
      status: 'accepted',
      createdAt: '2024-09-10T14:30:00Z',
      expiresAt: '2024-09-17T14:30:00Z',
      acceptedAt: '2024-09-12T09:15:00Z',
      token: 'token_def456'
    },
    {
      id: 'inv_3',
      email: 'affiliate2@glampinski.com',
      role: 'affiliate',
      invitedBy: '1',
      invitedByName: 'Super Admin',
      status: 'expired',
      createdAt: '2024-09-01T12:00:00Z',
      expiresAt: '2024-09-08T12:00:00Z',
      token: 'token_ghi789'
    }
  ]

  async sendInvitation(formData: InvitationFormData, invitedBy: string, invitedByName: string): Promise<Invitation> {
    // Generate invitation
    const invitation: Invitation = {
      id: `inv_${Date.now()}`,
      email: formData.email,
      role: formData.role,
      invitedBy,
      invitedByName,
      status: 'pending',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      token: `token_${Math.random().toString(36).substring(2)}`,
      message: formData.message
    }

    // In production, this would:
    // 1. Store invitation in database
    // 2. Send email using your email service (SendGrid, AWS SES, etc.)
    // 3. Return the invitation object

    // Mock email sending
    console.log(`📧 Sending invitation email to ${invitation.email}`)
    console.log(`Role: ${invitation.role}`)
    console.log(`Invitation link: ${process.env.NEXT_PUBLIC_APP_URL}/invite/${invitation.token}`)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Store in mock storage
    this.invitations.unshift(invitation)
    this.saveToStorage()
    
    return invitation
  }

  async getInvitations(): Promise<Invitation[]> {
    this.loadFromStorage()
    return this.invitations.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  async getInvitationStats(): Promise<InvitationStats> {
    this.loadFromStorage()
    return {
      total: this.invitations.length,
      pending: this.invitations.filter(i => i.status === 'pending').length,
      accepted: this.invitations.filter(i => i.status === 'accepted').length,
      expired: this.invitations.filter(i => i.status === 'expired').length
    }
  }

  async cancelInvitation(invitationId: string): Promise<boolean> {
    this.loadFromStorage()
    const invitation = this.invitations.find(i => i.id === invitationId)
    if (invitation && invitation.status === 'pending') {
      invitation.status = 'cancelled'
      this.saveToStorage()
      return true
    }
    return false
  }

  async resendInvitation(invitationId: string): Promise<boolean> {
    this.loadFromStorage()
    const invitation = this.invitations.find(i => i.id === invitationId)
    if (invitation && invitation.status === 'pending') {
      // Extend expiry and regenerate token
      invitation.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      invitation.token = `token_${Math.random().toString(36).substring(2)}`
      
      console.log(`📧 Resending invitation to ${invitation.email}`)
      console.log(`New invitation link: ${process.env.NEXT_PUBLIC_APP_URL}/invite/${invitation.token}`)
      
      this.saveToStorage()
      return true
    }
    return false
  }

  async getInvitationByToken(token: string): Promise<Invitation | null> {
    this.loadFromStorage()
    const invitation = this.invitations.find(i => i.token === token)
    return invitation || null
  }

  async acceptInvitation(token: string): Promise<boolean> {
    this.loadFromStorage()
    const invitation = this.invitations.find(i => i.token === token)
    if (invitation && invitation.status === 'pending' && new Date(invitation.expiresAt) > new Date()) {
      invitation.status = 'accepted'
      invitation.acceptedAt = new Date().toISOString()
      this.saveToStorage()
      return true
    }
    return false
  }

  // Check and update expired invitations
  async updateExpiredInvitations(): Promise<void> {
    this.loadFromStorage()
    const now = new Date()
    let updated = false
    
    for (const invitation of this.invitations) {
      if (invitation.status === 'pending' && new Date(invitation.expiresAt) < now) {
        invitation.status = 'expired'
        updated = true
      }
    }
    
    if (updated) {
      this.saveToStorage()
    }
  }

  private saveToStorage(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('invitations', JSON.stringify(this.invitations))
    }
  }

  private loadFromStorage(): void {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('invitations')
      if (stored) {
        try {
          this.invitations = JSON.parse(stored)
        } catch (error) {
          console.error('Error loading invitations from storage:', error)
        }
      }
    }
  }

  // Helper to get role display name
  getRoleDisplayName(role: UserRole): string {
    const roleNames = {
      super_admin: 'Super Admin',
      admin: 'Admin (Department Head)',
      manager: 'Manager (Department Employee)',
      affiliate: 'Affiliate',
      customer: 'Customer'
    }
    return roleNames[role] || role
  }

  // Helper to get role badge color
  getRoleBadgeVariant(role: UserRole): 'default' | 'secondary' | 'destructive' | 'outline' {
    const variants = {
      super_admin: 'destructive' as const,
      admin: 'default' as const,
      manager: 'secondary' as const,
      affiliate: 'outline' as const,
      customer: 'outline' as const
    }
    return variants[role] || 'outline'
  }
}

export const invitationService = new InvitationService()
