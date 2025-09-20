"use client"

import React, { createContext, useContext } from 'react'
import { useAuth } from './AuthContext'

// Enhanced permission context with granular permissions for ALL modules
interface Permission {
  dashboard: {
    canViewOverview: boolean
    canViewBusiness: boolean  
    canViewNetwork: boolean
    canViewAdminStats: boolean
  }
  // Main workflow modules
  contacts: {
    canView: boolean
    canCreate: boolean
    canEdit: boolean
    canDelete: boolean
  }
  tasks: {
    canView: boolean
    canCreate: boolean
    canEdit: boolean
    canAssign: boolean
  }
  pipeline: {
    canView: boolean
    canManage: boolean
    canEdit: boolean
  }
  // Network modules
  network: {
    canView: boolean
    canManage: boolean
    canViewGenealogy: boolean
  }
  commission: {
    canView: boolean
    canCalculate: boolean
    canPayout: boolean
  }
  ranks: {
    canView: boolean
    canManage: boolean
    canPromote: boolean
  }
  affiliates: {
    canView: boolean
    canManage: boolean
    canViewDetails: boolean
    canEdit: boolean
  }
  // Business modules
  customers: {
    canView: boolean
    canCreate: boolean
    canEdit: boolean
    canManage: boolean
  }
  products: {
    canView: boolean
    canPurchase: boolean
    canManage: boolean
    canCreate: boolean
  }
  orders: {
    canView: boolean
    canCreate: boolean
    canProcess: boolean
    canManage: boolean
  }
  payments: {
    canView: boolean
    canProcess: boolean
    canRefund: boolean
    canManage: boolean
  }
  wallet: {
    canView: boolean
    canTransfer: boolean
    canWithdraw: boolean
    canManage: boolean
  }
  marketing: {
    canView: boolean
    canCreate: boolean
    canManage: boolean
    canAnalyze: boolean
  }
  reports: {
    canView: boolean
    canGenerate: boolean
    canExport: boolean
    canCustomize: boolean
  }
  // System modules
  training: {
    canView: boolean
    canCreate: boolean
    canManage: boolean
    canAssign: boolean
  }
  support: {
    canView: boolean
    canCreate: boolean
    canRespond: boolean
    canManage: boolean
  }
  communication: {
    canView: boolean
    canSend: boolean
    canBroadcast: boolean
    canManage: boolean
  }
  admin: {
    canManageUsers: boolean
    canViewFullAccess: boolean
    canManageSystem: boolean
    canManageInvitations: boolean
  }
  settings: {
    canView: boolean
    canEdit: boolean
    canManageSystem: boolean
  }
  // Referral system permissions
  referrals: {
    canView: boolean
    canGenerate: boolean
    canManage: boolean
    canAnalyze: boolean
    canSetPermissions: boolean
  }
  // UI permissions
  ui: {
    canSearchAdvanced: boolean
    canImpersonate: boolean
    canManageProperties: boolean
  }
}

interface SimplePermissionContextType {
  hasPermission: (permission: string) => boolean
  hasModuleAccess: (module: string) => boolean
  hasModuleAction: (module: string, action: string) => boolean
  permissions: Permission
  canViewBusinessDashboard: boolean
  canManageUsers: boolean
  canViewAdminFeatures: boolean
  canAccessAffiliateFeatures: boolean
  canPurchaseProducts: boolean
  canManageProducts: boolean
  canSearchAdvanced: boolean
  canImpersonate: boolean
  canManageProperties: boolean
}

const SimplePermissionContext = createContext<SimplePermissionContextType | undefined>(undefined)

export function PermissionProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()

  // Generate permissions object based on user role for ALL modules
  const permissions: Permission = {
    dashboard: {
      canViewOverview: user?.role === 'super_admin' || user?.role === 'admin' || user?.role === 'manager' || user?.role === 'affiliate' || user?.role === 'customer',
      canViewBusiness: user?.role === 'super_admin' || user?.role === 'admin' || user?.role === 'manager',
      canViewNetwork: user?.role === 'super_admin' || user?.role === 'admin' || user?.role === 'manager' || user?.role === 'affiliate',
      canViewAdminStats: user?.role === 'super_admin' || user?.role === 'admin'
    },
    // Main workflow modules
    contacts: {
      canView: user?.role === 'super_admin' || user?.role === 'admin' || user?.role === 'manager' || user?.role === 'affiliate',
      canCreate: user?.role === 'super_admin' || user?.role === 'admin' || user?.role === 'manager' || user?.role === 'affiliate',
      canEdit: user?.role === 'super_admin' || user?.role === 'admin' || user?.role === 'manager',
      canDelete: user?.role === 'super_admin' || user?.role === 'admin'
    },
    tasks: {
      canView: user?.role === 'super_admin' || user?.role === 'admin' || user?.role === 'manager' || user?.role === 'affiliate',
      canCreate: user?.role === 'super_admin' || user?.role === 'admin' || user?.role === 'manager' || user?.role === 'affiliate',
      canEdit: user?.role === 'super_admin' || user?.role === 'admin' || user?.role === 'manager',
      canAssign: user?.role === 'super_admin' || user?.role === 'admin' || user?.role === 'manager'
    },
    pipeline: {
      canView: user?.role === 'super_admin' || user?.role === 'admin' || user?.role === 'manager' || user?.role === 'affiliate',
      canManage: user?.role === 'super_admin' || user?.role === 'admin' || user?.role === 'manager',
      canEdit: user?.role === 'super_admin' || user?.role === 'admin' || user?.role === 'manager'
    },
    // Network modules
    network: {
      canView: user?.role === 'super_admin' || user?.role === 'admin' || user?.role === 'manager' || user?.role === 'affiliate',
      canManage: user?.role === 'super_admin' || user?.role === 'admin',
      canViewGenealogy: user?.role === 'super_admin' || user?.role === 'admin' || user?.role === 'manager' || user?.role === 'affiliate'
    },
    commission: {
      canView: user?.role === 'super_admin' || user?.role === 'admin' || user?.role === 'manager' || user?.role === 'affiliate',
      canCalculate: user?.role === 'super_admin' || user?.role === 'admin',
      canPayout: user?.role === 'super_admin' || user?.role === 'admin'
    },
    ranks: {
      canView: user?.role === 'super_admin' || user?.role === 'admin' || user?.role === 'manager' || user?.role === 'affiliate',
      canManage: user?.role === 'super_admin' || user?.role === 'admin',
      canPromote: user?.role === 'super_admin' || user?.role === 'admin'
    },
    affiliates: {
      canView: user?.role === 'super_admin' || user?.role === 'admin' || user?.role === 'manager' || user?.role === 'affiliate',
      canManage: user?.role === 'super_admin' || user?.role === 'admin',
      canViewDetails: user?.role === 'super_admin' || user?.role === 'admin' || user?.role === 'manager',
      canEdit: user?.role === 'super_admin' || user?.role === 'admin'
    },
    // Business modules
    customers: {
      canView: user?.role === 'super_admin' || user?.role === 'admin' || user?.role === 'manager' || user?.role === 'affiliate',
      canCreate: user?.role === 'super_admin' || user?.role === 'admin' || user?.role === 'manager' || user?.role === 'affiliate',
      canEdit: user?.role === 'super_admin' || user?.role === 'admin' || user?.role === 'manager',
      canManage: user?.role === 'super_admin' || user?.role === 'admin'
    },
    products: {
      canView: true, // All users can view products
      canPurchase: user?.role === 'customer' || user?.role === 'affiliate',
      canManage: user?.role === 'super_admin' || user?.role === 'admin',
      canCreate: user?.role === 'super_admin' || user?.role === 'admin'
    },
    orders: {
      canView: user?.role === 'super_admin' || user?.role === 'admin' || user?.role === 'manager' || user?.role === 'affiliate' || user?.role === 'customer',
      canCreate: user?.role === 'super_admin' || user?.role === 'admin' || user?.role === 'manager' || user?.role === 'affiliate',
      canProcess: user?.role === 'super_admin' || user?.role === 'admin' || user?.role === 'manager',
      canManage: user?.role === 'super_admin' || user?.role === 'admin'
    },
    payments: {
      canView: user?.role === 'super_admin' || user?.role === 'admin' || user?.role === 'manager' || user?.role === 'affiliate' || user?.role === 'customer',
      canProcess: user?.role === 'super_admin' || user?.role === 'admin' || user?.role === 'manager',
      canRefund: user?.role === 'super_admin' || user?.role === 'admin',
      canManage: user?.role === 'super_admin' || user?.role === 'admin'
    },
    wallet: {
      canView: user?.role === 'super_admin' || user?.role === 'admin' || user?.role === 'manager' || user?.role === 'affiliate' || user?.role === 'customer',
      canTransfer: user?.role === 'super_admin' || user?.role === 'admin' || user?.role === 'affiliate',
      canWithdraw: user?.role === 'super_admin' || user?.role === 'admin' || user?.role === 'affiliate',
      canManage: user?.role === 'super_admin' || user?.role === 'admin'
    },
    marketing: {
      canView: user?.role === 'super_admin' || user?.role === 'admin' || user?.role === 'manager' || user?.role === 'affiliate',
      canCreate: user?.role === 'super_admin' || user?.role === 'admin' || user?.role === 'manager',
      canManage: user?.role === 'super_admin' || user?.role === 'admin',
      canAnalyze: user?.role === 'super_admin' || user?.role === 'admin' || user?.role === 'manager'
    },
    reports: {
      canView: user?.role === 'super_admin' || user?.role === 'admin' || user?.role === 'manager' || user?.role === 'affiliate',
      canGenerate: user?.role === 'super_admin' || user?.role === 'admin' || user?.role === 'manager',
      canExport: user?.role === 'super_admin' || user?.role === 'admin',
      canCustomize: user?.role === 'super_admin' || user?.role === 'admin'
    },
    // System modules
    training: {
      canView: user?.role === 'super_admin' || user?.role === 'admin' || user?.role === 'manager' || user?.role === 'affiliate' || user?.role === 'customer',
      canCreate: user?.role === 'super_admin' || user?.role === 'admin' || user?.role === 'manager',
      canManage: user?.role === 'super_admin' || user?.role === 'admin',
      canAssign: user?.role === 'super_admin' || user?.role === 'admin' || user?.role === 'manager'
    },
    support: {
      canView: user?.role === 'super_admin' || user?.role === 'admin' || user?.role === 'manager' || user?.role === 'affiliate' || user?.role === 'customer',
      canCreate: user?.role === 'super_admin' || user?.role === 'admin' || user?.role === 'manager' || user?.role === 'affiliate' || user?.role === 'customer',
      canRespond: user?.role === 'super_admin' || user?.role === 'admin' || user?.role === 'manager',
      canManage: user?.role === 'super_admin' || user?.role === 'admin'
    },
    communication: {
      canView: user?.role === 'super_admin' || user?.role === 'admin' || user?.role === 'manager' || user?.role === 'affiliate' || user?.role === 'customer',
      canSend: user?.role === 'super_admin' || user?.role === 'admin' || user?.role === 'manager' || user?.role === 'affiliate',
      canBroadcast: user?.role === 'super_admin' || user?.role === 'admin' || user?.role === 'manager',
      canManage: user?.role === 'super_admin' || user?.role === 'admin'
    },
    admin: {
      canManageUsers: user?.role === 'super_admin' || user?.role === 'admin',
      canViewFullAccess: user?.role === 'super_admin',
      canManageSystem: user?.role === 'super_admin',
      canManageInvitations: user?.role === 'super_admin' || user?.role === 'admin'
    },
    settings: {
      canView: user?.role === 'super_admin' || user?.role === 'admin' || user?.role === 'manager' || user?.role === 'affiliate' || user?.role === 'customer',
      canEdit: user?.role === 'super_admin' || user?.role === 'admin' || user?.role === 'manager' || user?.role === 'affiliate',
      canManageSystem: user?.role === 'super_admin' || user?.role === 'admin'
    },
    // Referral system permissions
    referrals: {
      canView: user?.role === 'super_admin' || user?.role === 'admin' || user?.role === 'manager' || user?.role === 'affiliate',
      canGenerate: user?.role === 'super_admin' || user?.role === 'admin' || user?.role === 'affiliate',
      canManage: user?.role === 'super_admin' || user?.role === 'admin',
      canAnalyze: user?.role === 'super_admin' || user?.role === 'admin' || user?.role === 'manager',
      canSetPermissions: user?.role === 'super_admin' || user?.role === 'admin'
    },
    ui: {
      canSearchAdvanced: user?.role !== 'customer',
      canImpersonate: user?.role === 'super_admin' || user?.role === 'admin',
      canManageProperties: user?.role === 'super_admin' || user?.role === 'admin'
    }
  }

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
    
    // Define module access based on roles
    const roleModules: Record<string, string[]> = {
      'super_admin': [
        'overview', 'contacts', 'tasks', 'pipeline', 'network', 'commission', 
        'ranks', 'affiliates', 'customers', 'products', 'orders', 'payments', 
        'wallet', 'marketing', 'reports', 'training', 'support', 'communication', 
        'admin', 'settings', 'referrals'
      ],
      'admin': [
        'overview', 'contacts', 'tasks', 'pipeline', 'network', 'commission', 
        'ranks', 'affiliates', 'customers', 'products', 'orders', 'payments', 
        'wallet', 'marketing', 'reports', 'training', 'support', 'communication', 
        'admin', 'settings', 'referrals'
      ],
      'manager': [
        'overview', 'contacts', 'tasks', 'pipeline', 'customers', 'products', 
        'orders', 'payments', 'marketing', 'reports', 'training', 'support', 
        'communication', 'settings', 'referrals'
      ],
      'affiliate': [
        'overview', 'network', 'commission', 'customers', 'products', 'orders', 
        'payments', 'wallet', 'marketing', 'training', 'support', 'communication', 'settings', 'referrals'
      ],
      'customer': [
        'overview', 'products', 'orders', 'payments', 'support', 'settings'
      ]
    }
    
    return roleModules[user.role]?.includes(module) || false
  }

  const hasModuleAction = (module: string, action: string): boolean => {
    if (!user) return false
    // Add granular action-based permissions as needed
    return true // Default to allowing actions for now
  }

  // Convenience permission getters
  const canViewBusinessDashboard = permissions.dashboard.canViewBusiness
  const canManageUsers = permissions.admin.canManageUsers
  const canViewAdminFeatures = permissions.admin.canViewFullAccess
  const canAccessAffiliateFeatures = permissions.affiliates.canView
  const canPurchaseProducts = permissions.products.canPurchase
  const canManageProducts = permissions.products.canManage
  const canSearchAdvanced = permissions.ui.canSearchAdvanced
  const canImpersonate = permissions.ui.canImpersonate
  const canManageProperties = permissions.ui.canManageProperties

  const value: SimplePermissionContextType = {
    hasPermission,
    hasModuleAccess,
    hasModuleAction,
    permissions,
    canViewBusinessDashboard,
    canManageUsers,
    canViewAdminFeatures,
    canAccessAffiliateFeatures,
    canPurchaseProducts,
    canManageProducts,
    canSearchAdvanced,
    canImpersonate,
    canManageProperties,
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
