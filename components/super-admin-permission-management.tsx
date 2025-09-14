"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { 
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert'
import {
  Crown,
  Users,
  Settings,
  Copy,
  Download,
  Upload,
  RotateCcw,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Info,
  Shield,
  AlertTriangle
} from 'lucide-react'
import { usePermissions } from '@/contexts/PermissionContext'
import { 
  UserRole, 
  PermissionModule, 
  PermissionAction,
  PERMISSION_MODULES,
  PERMISSION_ACTIONS,
  RolePermissions
} from '@/types/permissions'

interface PermissionMatrixProps {
  role: UserRole
  permissions: RolePermissions
  onPermissionChange: (role: UserRole, permissions: RolePermissions) => void
}

function PermissionMatrix({ role, permissions, onPermissionChange }: PermissionMatrixProps) {
  // Ensure permissions has a modules property
  const safePermissions = {
    ...permissions,
    modules: permissions.modules || {}
  }

  const handleModuleToggle = (module: PermissionModule, enabled: boolean) => {
    const updatedPermissions = { ...safePermissions }
    
    if (enabled) {
      // Enable module with view permission by default
      updatedPermissions.modules[module] = {
        enabled: true,
        actions: ['view']
      }
      // Add view permission to permissions array
      const viewPermission = `${module}:view` as const
      if (!updatedPermissions.permissions.includes(viewPermission)) {
        updatedPermissions.permissions.push(viewPermission)
      }
    } else {
      // Disable module
      updatedPermissions.modules[module] = {
        enabled: false,
        actions: []
      }
      // Remove all permissions for this module
      updatedPermissions.permissions = updatedPermissions.permissions.filter(
        p => !p.startsWith(`${module}:`)
      )
    }
    
    onPermissionChange(role, updatedPermissions)
  }

  const handleActionToggle = (module: PermissionModule, action: PermissionAction, enabled: boolean) => {
    const updatedPermissions = { ...safePermissions }
    const moduleConfig = updatedPermissions.modules[module]
    
    if (!moduleConfig?.enabled) return
    
    const permission = `${module}:${action}` as const
    
    if (enabled) {
      // Add action to module
      if (!moduleConfig.actions.includes(action)) {
        moduleConfig.actions.push(action)
      }
      // Add permission to array
      if (!updatedPermissions.permissions.includes(permission)) {
        updatedPermissions.permissions.push(permission)
      }
    } else {
      // Remove action from module
      moduleConfig.actions = moduleConfig.actions.filter(a => a !== action)
      // Remove permission from array
      updatedPermissions.permissions = updatedPermissions.permissions.filter(p => p !== permission)
    }
    
    onPermissionChange(role, updatedPermissions)
  }

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'super_admin': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'admin': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'manager': return 'bg-green-100 text-green-800 border-green-200'
      case 'affiliate': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'customer': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getModuleIcon = (module: PermissionModule) => {
    switch (module) {
      case 'dashboard': return '📊'
      case 'users': return '👥'
      case 'customers': return '🛒'
      case 'affiliates': return '🏢'
      case 'products': return '📦'
      case 'orders': return '📋'
      case 'analytics': return '📈'
      case 'reports': return '📄'
      case 'settings': return '⚙️'
      case 'finance': return '💰'
      case 'mlm': return '🌐'
      case 'communications': return '📧'
      default: return '📁'
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Crown className="h-5 w-5" />
            <CardTitle className="capitalize">{role.replace('_', ' ')}</CardTitle>
            <Badge className={getRoleColor(role)}>
              {permissions.permissions.length} permissions
            </Badge>
          </div>
          {role === 'super_admin' && (
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
              <Shield className="h-3 w-3 mr-1" />
              All Access
            </Badge>
          )}
        </div>
        <CardDescription>
          Configure module access and specific actions for {role.replace('_', ' ')} role
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {PERMISSION_MODULES.map((module) => {
            const moduleConfig = safePermissions.modules[module]
            const isModuleEnabled = moduleConfig?.enabled || false

            return (
              <div key={module} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getModuleIcon(module)}</span>
                    <Label className="font-medium capitalize">
                      {module.replace('_', ' ')}
                    </Label>
                  </div>
                  <Switch
                    checked={isModuleEnabled}
                    onCheckedChange={(enabled) => handleModuleToggle(module, enabled)}
                    disabled={role === 'super_admin'}
                  />
                </div>
                
                {isModuleEnabled && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3">
                    {PERMISSION_ACTIONS.map((action) => {
                      const hasAction = moduleConfig?.actions.includes(action) || false
                      const isDisabled = role === 'super_admin'

                      return (
                        <div key={action} className="flex items-center space-x-2">
                          <Switch
                            id={`${module}-${action}`}
                            checked={hasAction}
                            onCheckedChange={(enabled) => handleActionToggle(module, action, enabled)}
                            disabled={isDisabled}
                          />
                          <Label 
                            htmlFor={`${module}-${action}`}
                            className="text-sm capitalize cursor-pointer"
                          >
                            {action}
                          </Label>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

export function SuperAdminPermissionManagement() {
  const { 
    rolePermissions, 
    updateRolePermissions, 
    copyPermissionsFromRole,
    exportPermissions,
    importPermissions,
    resetToDefaults
  } = usePermissions()
  
  const [selectedRole, setSelectedRole] = useState<UserRole>('admin')
  const [copyFromRole, setCopyFromRole] = useState<UserRole>('admin')
  const [copyToRole, setCopyToRole] = useState<UserRole>('affiliate')
  const [importData, setImportData] = useState('')
  const [showExport, setShowExport] = useState(false)
  const [showImport, setShowImport] = useState(false)

  const roles: UserRole[] = ['super_admin', 'admin', 'manager', 'affiliate', 'customer']

  const handleExport = () => {
    const data = exportPermissions()
    navigator.clipboard.writeText(data)
    setShowExport(true)
    setTimeout(() => setShowExport(false), 3000)
  }

  const handleImport = () => {
    try {
      importPermissions(importData)
      setImportData('')
      setShowImport(false)
      alert('Permissions imported successfully!')
    } catch (error) {
      alert('Failed to import permissions. Please check the data format.')
    }
  }

  const handleCopyPermissions = () => {
    copyPermissionsFromRole(copyFromRole, copyToRole)
    alert(`Permissions copied from ${copyFromRole} to ${copyToRole}`)
  }

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all permissions to defaults? This action cannot be undone.')) {
      resetToDefaults()
      alert('Permissions reset to defaults')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Permission Management</h2>
          <p className="text-muted-foreground">
            Configure role-based permissions and access control
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Copy Permissions */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Copy Permissions</DialogTitle>
                <DialogDescription>
                  Copy all permissions from one role to another
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>From Role</Label>
                  <Select value={copyFromRole} onValueChange={(value) => setCopyFromRole(value as UserRole)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role.replace('_', ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>To Role</Label>
                  <Select value={copyToRole} onValueChange={(value) => setCopyToRole(value as UserRole)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role.replace('_', ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCopyPermissions}>Copy Permissions</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Export */}
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>

          {/* Import */}
          <Dialog open={showImport} onOpenChange={setShowImport}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Import Permissions</DialogTitle>
                <DialogDescription>
                  Paste the exported permission data to import
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Textarea
                  placeholder="Paste exported permission JSON here..."
                  value={importData}
                  onChange={(e) => setImportData(e.target.value)}
                  rows={10}
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowImport(false)}>
                  Cancel
                </Button>
                <Button onClick={handleImport} disabled={!importData.trim()}>
                  Import
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Reset */}
          <Button variant="destructive" size="sm" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      {/* Export Success Alert */}
      {showExport && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Export Successful</AlertTitle>
          <AlertDescription className="text-green-700">
            Permission data has been copied to your clipboard
          </AlertDescription>
        </Alert>
      )}

      {/* Role Tabs */}
      <Tabs value={selectedRole} onValueChange={(value) => setSelectedRole(value as UserRole)}>
        <TabsList className="grid w-full grid-cols-5">
          {roles.map((role) => (
            <TabsTrigger key={role} value={role} className="capitalize">
              {role === 'super_admin' && <Crown className="h-4 w-4 mr-1" />}
              {role.replace('_', ' ')}
            </TabsTrigger>
          ))}
        </TabsList>

        {roles.map((role) => (
          <TabsContent key={role} value={role}>
            <PermissionMatrix
              role={role}
              permissions={rolePermissions[role]}
              onPermissionChange={updateRolePermissions}
            />
          </TabsContent>
        ))}
      </Tabs>

      {/* Permission Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Info className="h-5 w-5 mr-2" />
            Permission Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {roles.map((role) => {
              const permissions = rolePermissions[role]
              const enabledModules = Object.values(permissions.modules).filter(m => m.enabled).length
              
              return (
                <div key={role} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium capitalize">{role.replace('_', ' ')}</h4>
                    {role === 'super_admin' && <Crown className="h-4 w-4 text-yellow-500" />}
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>{enabledModules} modules enabled</p>
                    <p>{permissions.permissions.length} total permissions</p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
