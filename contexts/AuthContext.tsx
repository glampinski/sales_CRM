"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User, UserRole, DEFAULT_ROLE_PERMISSIONS } from '@/types/auth'

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  hasPermission: (resource: string, action: string) => boolean
  hasPageAccess: (page: string) => boolean
  hasFeatureAccess: (feature: string) => boolean
  canAccessPage: (page: string) => boolean
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
    name: 'Admin User',
    email: 'admin@glampinski.com',
    role: 'admin',
    createdAt: '2024-01-15',
    lastLogin: '2024-09-14'
  },
  {
    id: '3',
    name: 'Sales Person',
    email: 'sales@glampinski.com',
    role: 'salesperson',
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
  }
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('auth_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication - in real app, this would call your API
    const foundUser = MOCK_USERS.find(u => u.email === email)
    if (foundUser && password === 'password') {
      setUser(foundUser)
      localStorage.setItem('auth_user', JSON.stringify(foundUser))
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('auth_user')
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
      login,
      logout,
      hasPermission,
      hasPageAccess,
      hasFeatureAccess,
      canAccessPage,
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
