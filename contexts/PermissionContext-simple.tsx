"use client"

import React, { createContext, useContext } from 'react'
import { useAuth } from './AuthContext'

// Simple permission context for compatibility
interface SimplePermissionContextType {
  hasPermission: (permission: string) => boolean
  hasModuleAccess: (module: string) => boolean
  hasModuleAction: (module: string, action: string) => boolean
}

const SimplePermissionContext = createContext<SimplePermissionContextType | undefined>(undefined)

export function PermissionProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()

  // Simple permission checks based on role
  const hasPermission = (permission: string): boolean => {
    if (!user) return false
    // Super admin has all permissions
    if (user.role === 'super_admin') return true
    // Add other simple role-based logic as needed
    return false
  }

  const hasModuleAccess = (module: string): boolean => {
    if (!user) return false
    // Super admin has access to all modules
    if (user.role === 'super_admin') return true
    // Add other simple role-based logic as needed
    return true // Default to allowing access for now
  }

  const hasModuleAction = (module: string, action: string): boolean => {
    if (!user) return false
    // Super admin can perform all actions
    if (user.role === 'super_admin') return true
    // Add other simple role-based logic as needed
    return true // Default to allowing actions for now
  }

  const value: SimplePermissionContextType = {
    hasPermission,
    hasModuleAccess,
    hasModuleAction,
  }

  return (
    <SimplePermissionContext.Provider value={value}>
      {children}
    </SimplePermissionContext.Provider>
  )
}

export function usePermissions() {
  const context = useContext(SimplePermissionContext)
  if (context === undefined) {
    throw new Error('usePermissions must be used within a PermissionProvider')
  }
  return context
}
