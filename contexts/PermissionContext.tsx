"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { 
  Permission, 
  UserRole, 
  RolePermissions, 
  DashboardWidget,
  DEFAULT_ROLE_PERMISSIONS,
  DASHBOARD_WIDGETS,
  PermissionModule,
  PermissionAction
} from '@/types/permissions'
import { useAuth } from './AuthContext'

interface PermissionContextType {
  // Permission checking
  hasPermission: (permission: Permission) => boolean
  hasModuleAccess: (module: PermissionModule) => boolean
  hasModuleAction: (module: PermissionModule, action: PermissionAction) => boolean
  
  // Role management (super admin only)
  rolePermissions: Record<UserRole, RolePermissions>
  updateRolePermissions: (role: UserRole, permissions: RolePermissions) => void
  
  // Dashboard widget management
  dashboardWidgets: DashboardWidget[]
  updateDashboardWidget: (widget: DashboardWidget) => void
  getWidgetsForRole: (role: UserRole) => DashboardWidget[]
  
  // Bulk operations
  enableModuleForRole: (role: UserRole, module: PermissionModule, actions: PermissionAction[]) => void
  disableModuleForRole: (role: UserRole, module: PermissionModule) => void
  copyPermissionsFromRole: (fromRole: UserRole, toRole: UserRole) => void
  
  // Export/Import
  exportPermissions: () => string
  importPermissions: (data: string) => void
  resetToDefaults: () => void
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined)

export function PermissionProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [rolePermissions, setRolePermissions] = useState<Record<UserRole, RolePermissions>>(DEFAULT_ROLE_PERMISSIONS)
  const [dashboardWidgets, setDashboardWidgets] = useState<DashboardWidget[]>(DASHBOARD_WIDGETS)

  // Load saved permissions from localStorage on mount
  useEffect(() => {
    const savedPermissions = localStorage.getItem('rolePermissions')
    const savedWidgets = localStorage.getItem('dashboardWidgets')
    
    if (savedPermissions) {
      try {
        const parsed = JSON.parse(savedPermissions)
        
        // Check if this is old data with distributor/user roles
        const hasOldRoles = 'distributor' in parsed || 'user' in parsed
        const hasNewRoles = 'affiliate' in parsed && 'customer' in parsed
        
        if (hasOldRoles && !hasNewRoles) {
          // Clear old data and use defaults
          console.log('Migrating from old role structure, using defaults')
          localStorage.removeItem('rolePermissions')
          setRolePermissions(DEFAULT_ROLE_PERMISSIONS)
        } else {
          // Migrate old role names to new ones
          const migrated: Record<UserRole, RolePermissions> = { ...DEFAULT_ROLE_PERMISSIONS }
          
          // Copy existing roles that still exist
          Object.keys(parsed).forEach(oldRole => {
            if (oldRole === 'distributor' && parsed[oldRole]) {
              // Migrate distributor to affiliate
              migrated.affiliate = {
                ...parsed[oldRole],
                role: 'affiliate' as UserRole
              }
            } else if (oldRole === 'user' && parsed[oldRole]) {
              // Migrate user to customer
              migrated.customer = {
                ...parsed[oldRole],
                role: 'customer' as UserRole
              }
            } else if (oldRole in migrated && parsed[oldRole]) {
              // Keep existing valid roles
              migrated[oldRole as UserRole] = parsed[oldRole]
            }
          })
          
          // Ensure all roles have proper modules structure
          Object.keys(migrated).forEach(role => {
            const roleKey = role as UserRole
            if (!migrated[roleKey].modules) {
              migrated[roleKey].modules = DEFAULT_ROLE_PERMISSIONS[roleKey].modules
            }
          })
          
          setRolePermissions(migrated)
        }
      } catch (error) {
        console.error('Failed to load saved permissions:', error)
        // Fallback to defaults if loading fails
        setRolePermissions(DEFAULT_ROLE_PERMISSIONS)
      }
    }
    
    if (savedWidgets) {
      try {
        setDashboardWidgets(JSON.parse(savedWidgets))
      } catch (error) {
        console.error('Failed to load saved widgets:', error)
      }
    }
  }, [])

  // Save to localStorage whenever permissions change
  useEffect(() => {
    localStorage.setItem('rolePermissions', JSON.stringify(rolePermissions))
  }, [rolePermissions])

  useEffect(() => {
    localStorage.setItem('dashboardWidgets', JSON.stringify(dashboardWidgets))
  }, [dashboardWidgets])

  const getCurrentUserPermissions = (): Permission[] => {
    if (!user) return []
    return rolePermissions[user.role]?.permissions || []
  }

  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false
    if (user.role === 'super_admin') return true // Super admin has all permissions
    
    const userPermissions = getCurrentUserPermissions()
    return userPermissions.includes(permission)
  }

  const hasModuleAccess = (module: PermissionModule): boolean => {
    if (!user) return false
    if (user.role === 'super_admin') return true
    
    const roleConfig = rolePermissions[user.role]
    return roleConfig?.modules[module]?.enabled || false
  }

  const hasModuleAction = (module: PermissionModule, action: PermissionAction): boolean => {
    if (!user) return false
    if (user.role === 'super_admin') return true
    
    const roleConfig = rolePermissions[user.role]
    const moduleConfig = roleConfig?.modules[module]
    
    return moduleConfig?.enabled && moduleConfig.actions.includes(action) || false
  }

  const updateRolePermissions = (role: UserRole, permissions: RolePermissions) => {
    if (user?.role !== 'super_admin') {
      console.warn('Only super admins can update role permissions')
      return
    }
    
    setRolePermissions(prev => ({
      ...prev,
      [role]: permissions
    }))
  }

  const updateDashboardWidget = (widget: DashboardWidget) => {
    if (user?.role !== 'super_admin') {
      console.warn('Only super admins can update dashboard widgets')
      return
    }
    
    setDashboardWidgets(prev => 
      prev.map(w => w.id === widget.id ? widget : w)
    )
  }

  const getWidgetsForRole = (role: UserRole): DashboardWidget[] => {
    return dashboardWidgets.filter(widget => {
      // Check if widget is enabled globally
      if (!widget.enabled) return false
      
      // Check role-specific configuration
      const roleConfig = widget.roleSpecific?.[role]
      if (roleConfig !== undefined) {
        return roleConfig.enabled
      }
      
      // Check if user has required permission
      const hasRequiredPermission = role === 'super_admin' || 
        rolePermissions[role]?.permissions.includes(widget.requiredPermission)
      
      return hasRequiredPermission
    }).sort((a, b) => a.order - b.order)
  }

  const enableModuleForRole = (role: UserRole, module: PermissionModule, actions: PermissionAction[]) => {
    if (user?.role !== 'super_admin') return
    
    setRolePermissions(prev => {
      const roleConfig = { ...prev[role] }
      
      // Update module configuration
      roleConfig.modules[module] = {
        enabled: true,
        actions
      }
      
      // Update permissions array
      const modulePermissions = actions.map(action => `${module}:${action}` as Permission)
      roleConfig.permissions = [
        ...roleConfig.permissions.filter(p => !p.startsWith(`${module}:`)),
        ...modulePermissions
      ]
      
      return {
        ...prev,
        [role]: roleConfig
      }
    })
  }

  const disableModuleForRole = (role: UserRole, module: PermissionModule) => {
    if (user?.role !== 'super_admin') return
    
    setRolePermissions(prev => {
      const roleConfig = { ...prev[role] }
      
      // Disable module
      roleConfig.modules[module] = {
        enabled: false,
        actions: []
      }
      
      // Remove all permissions for this module
      roleConfig.permissions = roleConfig.permissions.filter(p => !p.startsWith(`${module}:`))
      
      return {
        ...prev,
        [role]: roleConfig
      }
    })
  }

  const copyPermissionsFromRole = (fromRole: UserRole, toRole: UserRole) => {
    if (user?.role !== 'super_admin') return
    
    const sourcePermissions = rolePermissions[fromRole]
    if (!sourcePermissions) return
    
    setRolePermissions(prev => ({
      ...prev,
      [toRole]: {
        ...sourcePermissions,
        role: toRole
      }
    }))
  }

  const exportPermissions = (): string => {
    if (user?.role !== 'super_admin') return ''
    
    return JSON.stringify({
      rolePermissions,
      dashboardWidgets,
      exportedAt: new Date().toISOString(),
      exportedBy: user.id
    }, null, 2)
  }

  const importPermissions = (data: string) => {
    if (user?.role !== 'super_admin') return
    
    try {
      const imported = JSON.parse(data)
      
      if (imported.rolePermissions) {
        setRolePermissions(imported.rolePermissions)
      }
      
      if (imported.dashboardWidgets) {
        setDashboardWidgets(imported.dashboardWidgets)
      }
      
      console.log('Permissions imported successfully')
    } catch (error) {
      console.error('Failed to import permissions:', error)
      throw new Error('Invalid permission data format')
    }
  }

  const resetToDefaults = () => {
    if (user?.role !== 'super_admin') return
    
    setRolePermissions(DEFAULT_ROLE_PERMISSIONS)
    setDashboardWidgets(DASHBOARD_WIDGETS)
    
    // Clear localStorage
    localStorage.removeItem('rolePermissions')
    localStorage.removeItem('dashboardWidgets')
  }

  const value: PermissionContextType = {
    hasPermission,
    hasModuleAccess,
    hasModuleAction,
    rolePermissions,
    updateRolePermissions,
    dashboardWidgets,
    updateDashboardWidget,
    getWidgetsForRole,
    enableModuleForRole,
    disableModuleForRole,
    copyPermissionsFromRole,
    exportPermissions,
    importPermissions,
    resetToDefaults
  }

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  )
}

export function usePermissions() {
  const context = useContext(PermissionContext)
  if (context === undefined) {
    throw new Error('usePermissions must be used within a PermissionProvider')
  }
  return context
}
