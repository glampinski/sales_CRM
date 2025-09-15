"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { usePermissions } from "@/contexts/PermissionContext-simple"
import { useAuth } from "@/contexts/AuthContext"
import { 
  Shield,
  Search,
  CheckCircle,
  X,
  Edit3,
  Save,
  RotateCcw,
  Users,
  ChevronDown,
  ChevronRight,
  Home,
  TrendingUp,
  Building2,
  DollarSign,
  Crown,
  FileText,
  CreditCard,
  PieChart,
  Settings,
  Bell,
  UserCog,
  Wallet,
  MessageSquare,
  BookOpen,
  Megaphone,
  HeadphonesIcon,
  Calendar,
  BarChart3,
  Activity,
  Target,
  Zap
} from "lucide-react"

export function SimpleGroupPermissions() {
  const { user } = useAuth()
  const { permissions } = usePermissions()
  const [searchTerm, setSearchTerm] = useState('')
  const [editMode, setEditMode] = useState(false)
  const [selectedRole, setSelectedRole] = useState(user?.role || 'affiliate')
  const [localPermissions, setLocalPermissions] = useState<any>(null)
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])
  const [expandedLinks, setExpandedLinks] = useState<string[]>([])

  // Reset edit mode when role changes
  const handleRoleChange = (newRole: string) => {
    setSelectedRole(newRole as any)
    setEditMode(false)
    setLocalPermissions(null)
  }

  // Toggle category expansion
  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  // Toggle link expansion
  const toggleLink = (linkId: string) => {
    setExpandedLinks(prev => 
      prev.includes(linkId) 
        ? prev.filter(id => id !== linkId)
        : [...prev, linkId]
    )
  }

  // Reset edit mode when role changes
  const handleRoleChange = (newRole: string) => {
    setSelectedRole(newRole as any)
    setEditMode(false)
    setLocalPermissions(null)
  }

  // Available roles for selection
  const availableRoles = [
    { value: 'super_admin', label: 'Super Admin', description: 'Full system access' },
    { value: 'admin', label: 'Administrator', description: 'Management capabilities' },
    { value: 'manager', label: 'Manager', description: 'Department oversight' },
    { value: 'affiliate', label: 'Affiliate', description: 'Sales and network access' },
    { value: 'customer', label: 'Customer', description: 'Customer portal only' }
  ]

  // Generate permissions for any role
  const getPermissionsForRole = (role: string) => {
    return {
      dashboard: {
        canViewOverview: role === 'super_admin' || role === 'admin' || role === 'manager' || role === 'affiliate' || role === 'customer',
        canViewBusiness: role === 'super_admin' || role === 'admin' || role === 'manager',
        canViewNetwork: role === 'super_admin' || role === 'admin' || role === 'manager' || role === 'affiliate',
        canViewAdminStats: role === 'super_admin' || role === 'admin'
      },
      contacts: {
        canView: role === 'super_admin' || role === 'admin' || role === 'manager' || role === 'affiliate',
        canCreate: role === 'super_admin' || role === 'admin' || role === 'manager' || role === 'affiliate',
        canEdit: role === 'super_admin' || role === 'admin' || role === 'manager',
        canDelete: role === 'super_admin' || role === 'admin'
      },
      tasks: {
        canView: role === 'super_admin' || role === 'admin' || role === 'manager' || role === 'affiliate',
        canCreate: role === 'super_admin' || role === 'admin' || role === 'manager' || role === 'affiliate',
        canEdit: role === 'super_admin' || role === 'admin' || role === 'manager',
        canAssign: role === 'super_admin' || role === 'admin' || role === 'manager'
      },
      pipeline: {
        canView: role === 'super_admin' || role === 'admin' || role === 'manager' || role === 'affiliate',
        canManage: role === 'super_admin' || role === 'admin' || role === 'manager',
        canEdit: role === 'super_admin' || role === 'admin' || role === 'manager'
      },
      network: {
        canView: role === 'super_admin' || role === 'admin' || role === 'manager' || role === 'affiliate',
        canManage: role === 'super_admin' || role === 'admin',
        canViewGenealogy: role === 'super_admin' || role === 'admin' || role === 'manager' || role === 'affiliate'
      },
      commission: {
        canView: role === 'super_admin' || role === 'admin' || role === 'manager' || role === 'affiliate',
        canCalculate: role === 'super_admin' || role === 'admin',
        canPayout: role === 'super_admin' || role === 'admin'
      },
      ranks: {
        canView: role === 'super_admin' || role === 'admin' || role === 'manager' || role === 'affiliate',
        canManage: role === 'super_admin' || role === 'admin',
        canPromote: role === 'super_admin' || role === 'admin'
      },
      affiliates: {
        canView: role === 'super_admin' || role === 'admin' || role === 'manager' || role === 'affiliate',
        canManage: role === 'super_admin' || role === 'admin',
        canViewDetails: role === 'super_admin' || role === 'admin' || role === 'manager',
        canEdit: role === 'super_admin' || role === 'admin'
      },
      customers: {
        canView: role === 'super_admin' || role === 'admin' || role === 'manager' || role === 'affiliate',
        canCreate: role === 'super_admin' || role === 'admin' || role === 'manager' || role === 'affiliate',
        canEdit: role === 'super_admin' || role === 'admin' || role === 'manager',
        canManage: role === 'super_admin' || role === 'admin'
      },
      products: {
        canView: true, // All users can view products
        canPurchase: role === 'customer' || role === 'affiliate',
        canManage: role === 'super_admin' || role === 'admin',
        canCreate: role === 'super_admin' || role === 'admin'
      },
      orders: {
        canView: role === 'super_admin' || role === 'admin' || role === 'manager' || role === 'affiliate' || role === 'customer',
        canCreate: role === 'super_admin' || role === 'admin' || role === 'manager' || role === 'affiliate',
        canProcess: role === 'super_admin' || role === 'admin' || role === 'manager',
        canManage: role === 'super_admin' || role === 'admin'
      },
      payments: {
        canView: role === 'super_admin' || role === 'admin' || role === 'manager' || role === 'affiliate' || role === 'customer',
        canProcess: role === 'super_admin' || role === 'admin' || role === 'manager',
        canRefund: role === 'super_admin' || role === 'admin',
        canManage: role === 'super_admin' || role === 'admin'
      },
      wallet: {
        canView: role === 'super_admin' || role === 'admin' || role === 'manager' || role === 'affiliate' || role === 'customer',
        canTransfer: role === 'super_admin' || role === 'admin' || role === 'affiliate',
        canWithdraw: role === 'super_admin' || role === 'admin' || role === 'affiliate',
        canManage: role === 'super_admin' || role === 'admin'
      },
      marketing: {
        canView: role === 'super_admin' || role === 'admin' || role === 'manager' || role === 'affiliate',
        canCreate: role === 'super_admin' || role === 'admin' || role === 'manager',
        canManage: role === 'super_admin' || role === 'admin',
        canAnalyze: role === 'super_admin' || role === 'admin' || role === 'manager'
      },
      reports: {
        canView: role === 'super_admin' || role === 'admin' || role === 'manager' || role === 'affiliate',
        canGenerate: role === 'super_admin' || role === 'admin' || role === 'manager',
        canExport: role === 'super_admin' || role === 'admin',
        canCustomize: role === 'super_admin' || role === 'admin'
      },
      training: {
        canView: role === 'super_admin' || role === 'admin' || role === 'manager' || role === 'affiliate' || role === 'customer',
        canCreate: role === 'super_admin' || role === 'admin' || role === 'manager',
        canManage: role === 'super_admin' || role === 'admin',
        canAssign: role === 'super_admin' || role === 'admin' || role === 'manager'
      },
      support: {
        canView: role === 'super_admin' || role === 'admin' || role === 'manager' || role === 'affiliate' || role === 'customer',
        canCreate: role === 'super_admin' || role === 'admin' || role === 'manager' || role === 'affiliate' || role === 'customer',
        canRespond: role === 'super_admin' || role === 'admin' || role === 'manager',
        canManage: role === 'super_admin' || role === 'admin'
      },
      communication: {
        canView: role === 'super_admin' || role === 'admin' || role === 'manager' || role === 'affiliate' || role === 'customer',
        canSend: role === 'super_admin' || role === 'admin' || role === 'manager' || role === 'affiliate',
        canBroadcast: role === 'super_admin' || role === 'admin' || role === 'manager',
        canManage: role === 'super_admin' || role === 'admin'
      },
      admin: {
        canManageUsers: role === 'super_admin' || role === 'admin',
        canViewFullAccess: role === 'super_admin',
        canManageSystem: role === 'super_admin',
        canManageInvitations: role === 'super_admin' || role === 'admin'
      },
      settings: {
        canView: role === 'super_admin' || role === 'admin' || role === 'manager' || role === 'affiliate' || role === 'customer',
        canEdit: role === 'super_admin' || role === 'admin' || role === 'manager' || role === 'affiliate',
        canManageSystem: role === 'super_admin' || role === 'admin'
      }
    }
  }

  // Initialize local permissions when entering edit mode
  const enterEditMode = () => {
    const rolePermissions = getPermissionsForRole(selectedRole)
    setLocalPermissions(JSON.parse(JSON.stringify(rolePermissions)))
    setEditMode(true)
  }

  // Save changes (for now just show alert - you'd implement actual save logic)
  const saveChanges = () => {
    alert(`Permission changes saved for ${availableRoles.find(r => r.value === selectedRole)?.label}! (Demo mode - not actually saved)`)
    setEditMode(false)
  }

  // Cancel changes
  const cancelChanges = () => {
    setLocalPermissions(null)
    setEditMode(false)
  }

  // Toggle a specific permission
  const togglePermission = (module: string, permission: string) => {
    if (!localPermissions) return
    
    setLocalPermissions((prev: any) => ({
      ...prev,
      [module]: {
        ...prev[module],
        [permission]: !prev[module][permission]
      }
    }))
  }

  // Get permission value (from local state if editing, otherwise from role permissions)
  const getPermissionValue = (module: string, permission: string) => {
    if (editMode && localPermissions) {
      return localPermissions[module]?.[permission]
    }
    const rolePermissions = getPermissionsForRole(selectedRole)
    return (rolePermissions as any)[module]?.[permission]
  }

  // Permission categories based on our new system
  const permissionCategories = [
    { id: 'all', name: 'All Categories', count: 15 },
    { id: 'dashboard', name: 'Dashboard', count: 4 },
    { id: 'workflow', name: 'Main Workflow', count: 3 },
    { id: 'network', name: 'Network & MLM', count: 4 },
    { id: 'business', name: 'Business', count: 7 },
    { id: 'system', name: 'System', count: 5 }
  ]

  // All permission modules from our new system
  const allPermissions = [
    // Dashboard
    { module: 'dashboard', permission: 'canViewOverview', name: 'Dashboard Overview', category: 'dashboard', perm: getPermissionValue('dashboard', 'canViewOverview') },
    { module: 'dashboard', permission: 'canViewBusiness', name: 'Business Dashboard', category: 'dashboard', perm: getPermissionValue('dashboard', 'canViewBusiness') },
    { module: 'dashboard', permission: 'canViewNetwork', name: 'Network Dashboard', category: 'dashboard', perm: getPermissionValue('dashboard', 'canViewNetwork') },
    { module: 'dashboard', permission: 'canViewAdminStats', name: 'Admin Statistics', category: 'dashboard', perm: getPermissionValue('dashboard', 'canViewAdminStats') },
    
    // Main Workflow
    { module: 'contacts', permission: 'canView', name: 'Contacts Management', category: 'workflow', perm: getPermissionValue('contacts', 'canView') },
    { module: 'tasks', permission: 'canView', name: 'Task Management', category: 'workflow', perm: getPermissionValue('tasks', 'canView') },
    { module: 'pipeline', permission: 'canView', name: 'Sales Pipeline', category: 'workflow', perm: getPermissionValue('pipeline', 'canView') },
    
    // Network & MLM
    { module: 'network', permission: 'canViewGenealogy', name: 'Genealogy View', category: 'network', perm: getPermissionValue('network', 'canViewGenealogy') },
    { module: 'commission', permission: 'canView', name: 'Commission Tracking', category: 'network', perm: getPermissionValue('commission', 'canView') },
    { module: 'ranks', permission: 'canView', name: 'Rank Management', category: 'network', perm: getPermissionValue('ranks', 'canView') },
    { module: 'affiliates', permission: 'canView', name: 'Affiliate Management', category: 'network', perm: getPermissionValue('affiliates', 'canView') },
    
    // Business
    { module: 'customers', permission: 'canView', name: 'Customer Management', category: 'business', perm: getPermissionValue('customers', 'canView') },
    { module: 'products', permission: 'canView', name: 'Product Catalog', category: 'business', perm: getPermissionValue('products', 'canView') },
    { module: 'orders', permission: 'canView', name: 'Order Processing', category: 'business', perm: getPermissionValue('orders', 'canView') },
    { module: 'payments', permission: 'canView', name: 'Payment Processing', category: 'business', perm: getPermissionValue('payments', 'canView') },
    { module: 'wallet', permission: 'canView', name: 'Wallet Management', category: 'business', perm: getPermissionValue('wallet', 'canView') },
    { module: 'marketing', permission: 'canView', name: 'Marketing Tools', category: 'business', perm: getPermissionValue('marketing', 'canView') },
    { module: 'reports', permission: 'canView', name: 'Reporting System', category: 'business', perm: getPermissionValue('reports', 'canView') },
    
    // System
    { module: 'training', permission: 'canView', name: 'Training Center', category: 'system', perm: getPermissionValue('training', 'canView') },
    { module: 'support', permission: 'canView', name: 'Support System', category: 'system', perm: getPermissionValue('support', 'canView') },
    { module: 'communication', permission: 'canView', name: 'Communication Hub', category: 'system', perm: getPermissionValue('communication', 'canView') },
    { module: 'admin', permission: 'canManageUsers', name: 'User Management', category: 'system', perm: getPermissionValue('admin', 'canManageUsers') },
    { module: 'settings', permission: 'canView', name: 'System Settings', category: 'system', perm: getPermissionValue('settings', 'canView') }
  ]

  const filteredPermissions = allPermissions.filter(perm => {
    const matchesSearch = perm.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || perm.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const enabledCount = filteredPermissions.filter(perm => perm.perm).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <Shield className="h-8 w-8 text-blue-500" />
          <h2 className="text-3xl font-bold">Permissions & Features Management</h2>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          View real-time permission status across your CRM system - powered by granular role-based access control
        </p>
        <div className="flex justify-center space-x-2">
          <Button
            variant={editMode ? "default" : "outline"}
            onClick={() => editMode ? saveChanges() : enterEditMode()}
            className="flex items-center space-x-2"
          >
            {editMode ? (
              <>
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </>
            ) : (
              <>
                <Edit3 className="h-4 w-4" />
                <span>Edit Permissions</span>
              </>
            )}
          </Button>
          {editMode && (
            <Button variant="outline" onClick={cancelChanges}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          )}
        </div>
      </div>

      {/* Role Selector */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <h3 className="font-semibold">Select Role to Manage</h3>
                <p className="text-sm text-muted-foreground">Choose which role's permissions to view and edit</p>
              </div>
            </div>
            <div className="w-64">
              <Select value={selectedRole} onValueChange={handleRoleChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {availableRoles.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      <div className="flex flex-col">
                        <span className="font-medium">{role.label}</span>
                        <span className="text-xs text-muted-foreground">{role.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Managing Role</p>
              <p className="text-2xl font-bold">{availableRoles.find(r => r.value === selectedRole)?.label || 'Unknown'}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Total Modules</p>
              <p className="text-2xl font-bold">22</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Enabled</p>
              <p className="text-2xl font-bold text-green-600">{enabledCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Access Level</p>
              <p className="text-2xl font-bold">{Math.round((enabledCount / 22) * 100)}%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search permissions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {permissionCategories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
              <Badge variant="secondary" className="ml-2">
                {category.count}
              </Badge>
            </Button>
          ))}
        </div>
      </div>

      {/* Permission Matrix */}
      <Card>
        <CardHeader>
          <CardTitle>Live Permission Status</CardTitle>
          <CardDescription>
            {editMode 
              ? "Edit mode active - toggle switches to modify permissions" 
              : "Real-time view of your current permissions - this reflects the actual access control in the system"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredPermissions.map((permission, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${permission.perm ? 'bg-green-500' : 'bg-gray-300'}`} />
                  <div>
                    <p className="font-medium">{permission.name}</p>
                    <p className="text-sm text-muted-foreground capitalize">{permission.category} • {permission.module}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {editMode ? (
                    <Switch
                      checked={permission.perm}
                      onCheckedChange={() => togglePermission(permission.module, permission.permission)}
                    />
                  ) : (
                    <>
                      <Badge variant={permission.perm ? "default" : "secondary"}>
                        {permission.perm ? "Enabled" : "Disabled"}
                      </Badge>
                      {permission.perm ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <X className="h-5 w-5 text-gray-400" />
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Role Information */}
      <Card>
        <CardHeader>
          <CardTitle>Role-Based Access Information</CardTitle>
          <CardDescription>
            Understanding how permissions work in this system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-semibold">Permission Hierarchy</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• <strong>Super Admin:</strong> Full system access</li>
                <li>• <strong>Admin:</strong> Management capabilities</li>
                <li>• <strong>Manager:</strong> Department oversight</li>
                <li>• <strong>Affiliate:</strong> Sales and network access</li>
                <li>• <strong>Customer:</strong> Customer portal only</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">System Features</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Granular permission control</li>
                <li>• Real-time access validation</li>
                <li>• Role-based module access</li>
                <li>• Secure permission inheritance</li>
                <li>• Dynamic UI adaptation</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
