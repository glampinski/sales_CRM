export type UserRole = 'super_admin' | 'admin' | 'manager' | 'affiliate' | 'customer'

export interface Invitation {
  id: string
  email: string
  role: UserRole
  invitedBy: string
  invitedByName: string
  status: 'pending' | 'accepted' | 'expired' | 'cancelled'
  createdAt: string
  expiresAt: string
  acceptedAt?: string
  token: string
  message?: string
}

export interface InvitationFormData {
  email: string
  role: UserRole
  message?: string
}

export interface InvitationStats {
  total: number
  pending: number
  accepted: number
  expired: number
}
