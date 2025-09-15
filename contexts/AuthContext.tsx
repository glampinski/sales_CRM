"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User, UserRole, DEFAULT_ROLE_PERMISSIONS } from '@/types/auth'

interface AuthContextType {
  user: User | null
  originalUser: User | null // For tracking the real user during impersonation
  isImpersonating: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  startImpersonation: (targetUserId: string) => boolean
  stopImpersonation: () => void
  hasPermission: (resource: string, action: string) => boolean
  hasPageAccess: (page: string) => boolean
  hasFeatureAccess: (feature: string) => boolean
  canAccessPage: (page: string) => boolean
  canImpersonate: () => boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users for development
const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Super Admin',
    email: 'superadmin@glampinski.com',
    role: 'super_admin',
    createdAt: '2024-01-01',
    lastLogin: '2024-09-14'
  },
  {
    id: '2',
    name: 'Department Head',
    email: 'admin@glampinski.com',
    role: 'admin',
    createdAt: '2024-01-15',
    lastLogin: '2024-09-14'
  },
  {
    id: '3',
    name: 'Department Employee',
    email: 'manager@glampinski.com',
    role: 'manager',
    createdAt: '2024-02-01',
    lastLogin: '2024-09-14'
  },
  {
    id: '4',
    name: 'John Customer',
    email: 'customer@example.com',
    role: 'customer',
    createdAt: '2024-03-01',
    lastLogin: '2024-09-14'
  },
  {
    id: '5',
    name: 'Jane Affiliate',
    email: 'affiliate@glampinski.com',
    role: 'affiliate',
    createdAt: '2024-02-15',
    lastLogin: '2024-09-14'
  }
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [originalUser, setOriginalUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  const isImpersonating = originalUser !== null

  useEffect(() => {
    // Check for impersonation state first
    const impersonationData = localStorage.getItem('impersonation_data')
    if (impersonationData) {
      const { originalUser, targetUser } = JSON.parse(impersonationData)
      setOriginalUser(originalUser)
      setUser(targetUser)
    } else {
      // Check for stored user session
      const storedUser = localStorage.getItem('auth_user')
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser))
        } catch (error) {
          console.error('Error parsing stored user:', error)
          localStorage.removeItem('auth_user')
        }
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication with specific passwords for each user
    const foundUser = MOCK_USERS.find(u => u.email === email)
    if (!foundUser) return false
    
    // Check specific passwords for each user
    const validPasswords: { [key: string]: string[] } = {
      'superadmin@glampinski.com': ['admin123', 'password'],
      'admin@glampinski.com': ['admin123', 'password'],
      'manager@glampinski.com': ['manager123', 'password'],
      'customer@example.com': ['customer123', 'password'],
      'affiliate@glampinski.com': ['affiliate123', 'password']
    }
    
    const userPasswords = validPasswords[email] || []
    if (userPasswords.includes(password)) {
      setUser(foundUser)
      localStorage.setItem('auth_user', JSON.stringify(foundUser))
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    setOriginalUser(null) // Clear impersonation on logout
    localStorage.removeItem('auth_user')
    localStorage.removeItem('impersonation_data')
    // Redirect to home page after logout
    if (typeof window !== 'undefined') {
      window.location.href = '/'
    }
  }

  const startImpersonation = (targetUserId: string): boolean => {
    if (!user || !canImpersonate()) return false
    
    const targetUser = MOCK_USERS.find(u => u.id === targetUserId)
    if (!targetUser) return false
    
    console.log('Starting impersonation:', {
      original: user,
      target: targetUser,
      targetRole: targetUser.role
    })
    
    setOriginalUser(user)
    setUser(targetUser)
    
    // Store impersonation state
    localStorage.setItem('impersonation_data', JSON.stringify({
      originalUser: user,
      targetUser: targetUser
    }))
    
    console.log('Impersonation data stored:', localStorage.getItem('impersonation_data'))
    
    return true
  }

  const stopImpersonation = () => {
    if (!originalUser) return
    
    setUser(originalUser)
    setOriginalUser(null)
    localStorage.removeItem('impersonation_data')
    localStorage.setItem('auth_user', JSON.stringify(originalUser))
  }

  const canImpersonate = (): boolean => {
    if (!user) return false
    
    // Super admin can always impersonate
    if (user.role === 'super_admin') return true
    
    // Check if admin has impersonation permission (future feature)
    // This would check settings to see which admins are allowed to impersonate
    if (user.role === 'admin') {
      // For now, allow all admins - in real app, check settings
      return true
    }
    
    return false
  }

  const hasPermission = (resource: string, action: string): boolean => {
    if (!user) return false
    if (user.role === 'super_admin') return true
    
    // Check user-specific permissions or role-based permissions
    const roleConfig = DEFAULT_ROLE_PERMISSIONS[user.role]
    
    // For now, we'll use feature-based access control
    // In a real app, you'd check specific permissions
    return roleConfig.features.includes('*') || roleConfig.features.some(f => f.includes(resource))
  }

  const hasPageAccess = (page: string): boolean => {
    if (!user) return false
    if (user.role === 'super_admin') return true
    
    const roleConfig = DEFAULT_ROLE_PERMISSIONS[user.role]
    return roleConfig.pages.includes('*') || roleConfig.pages.includes(page)
  }

  const hasFeatureAccess = (feature: string): boolean => {
    if (!user) return false
    if (user.role === 'super_admin') return true
    
    const roleConfig = DEFAULT_ROLE_PERMISSIONS[user.role]
    return roleConfig.features.includes('*') || roleConfig.features.includes(feature)
  }

  const canAccessPage = (page: string): boolean => {
    return hasPageAccess(page)
  }

  return (
    <AuthContext.Provider value={{
      user,
      originalUser,
      isImpersonating,
      login,
      logout,
      startImpersonation,
      stopImpersonation,
      hasPermission,
      hasPageAccess,
      hasFeatureAccess,
      canAccessPage,
      canImpersonate,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
