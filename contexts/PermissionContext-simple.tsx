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

  // Enhanced permission checks based on role
  const hasPermission = (permission: string): boolean => {
    if (!user) return false
    // Super admin has all permissions
    if (user.role === 'super_admin') return true
    
    // Define permission mappings for other roles
    const rolePermissions: Record<string, string[]> = {
      'admin': ['dashboard.overview', 'dashboard.business', 'dashboard.network', 'admin.overview'],
      'manager': ['dashboard.overview', 'dashboard.business', 'dashboard.network'],
      'affiliate': ['dashboard.overview', 'referrals.view', 'referrals.generate'],
      'customer': ['dashboard.overview']
    }
    
    return rolePermissions[user.role]?.includes(permission) || false
  }

  const hasModuleAccess = (module: string): boolean => {
    if (!user) return false
    // Super admin has access to all modules
    if (user.role === 'super_admin') return true
    
    // Define module access based on roles
    const roleModules: Record<string, string[]> = {
      'admin': [
        'overview', 'contacts', 'tasks', 'pipeline', 'network', 'commission', 
        'ranks', 'affiliates', 'customers', 'products', 'orders', 'payments', 
        'wallet', 'marketing', 'reports', 'training', 'support', 'communication', 
        'admin', 'settings'
      ],
      'manager': [
        'overview', 'contacts', 'tasks', 'pipeline', 'customers', 'products', 
        'orders', 'payments', 'marketing', 'reports', 'training', 'support', 
        'communication', 'settings'
      ],
      'affiliate': [
        'overview', 'network', 'commission', 'customers', 'products', 'orders', 
        'payments', 'wallet', 'marketing', 'training', 'support', 'communication', 'settings'
      ],
      'customer': [
        'overview', 'products', 'orders', 'payments', 'support', 'settings'
      ]
    }
    
    return roleModules[user.role]?.includes(module) || false
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
