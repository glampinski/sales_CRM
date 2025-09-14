"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { 
  Users, 
  Plus, 
  Trash2, 
  Edit, 
  Save, 
  X,
  Home,
  Building2,
  TrendingUp,
  DollarSign,
  CheckSquare,
  CreditCard,
  PieChart,
  Settings,
  Bell,
  Shield,
  Crown,
  UserCog,
  FileText,
  BarChart3,
  Calendar,
  Phone,
  Mail,
  Eye,
  EyeOff
} from "lucide-react"

// User Groups (simplified from roles)
export type UserGroup = 'admins' | 'managers' | 'affiliates' | 'customers'

// All available pages and components in the system
interface SystemComponent {
  id: string
  name: string
  description: string
  type: 'page' | 'widget' | 'feature'
  category: 'dashboard' | 'crm' | 'mlm' | 'business' | 'system'
  icon: any
  path?: string
}

const SYSTEM_COMPONENTS: SystemComponent[] = [
  // Dashboard Pages
  { id: 'dashboard_home', name: 'Dashboard Home', description: 'Main dashboard page', type: 'page', category: 'dashboard', icon: Home, path: '/dashboard' },
  { id: 'dashboard_contacts', name: 'Contacts Page', description: 'Contact management page', type: 'page', category: 'crm', icon: Users, path: '/dashboard/contacts' },
  { id: 'dashboard_tasks', name: 'Tasks Page', description: 'Task management page', type: 'page', category: 'crm', icon: CheckSquare, path: '/dashboard/tasks' },
  { id: 'dashboard_pipeline', name: 'Pipeline Page', description: 'Sales pipeline page', type: 'page', category: 'crm', icon: TrendingUp, path: '/dashboard/pipeline' },
  { id: 'dashboard_genealogy', name: 'Genealogy Page', description: 'MLM genealogy tree', type: 'page', category: 'mlm', icon: Building2, path: '/dashboard/genealogy' },
  { id: 'dashboard_commission', name: 'Commission Page', description: 'Commission tracking', type: 'page', category: 'mlm', icon: DollarSign, path: '/dashboard/commission' },
  { id: 'dashboard_ranks', name: 'Ranks Page', description: 'MLM rank management', type: 'page', category: 'mlm', icon: Crown, path: '/dashboard/ranks' },
  { id: 'dashboard_affiliates', name: 'Affiliates Page', description: 'Affiliate management', type: 'page', category: 'mlm', icon: Shield, path: '/dashboard/affiliates' },
  { id: 'dashboard_customers', name: 'Customers Page', description: 'Customer management', type: 'page', category: 'business', icon: Users, path: '/dashboard/customers' },
  { id: 'dashboard_products', name: 'Products Page', description: 'Product catalog', type: 'page', category: 'business', icon: Building2, path: '/dashboard/products' },
  { id: 'dashboard_orders', name: 'Orders Page', description: 'Order management', type: 'page', category: 'business', icon: FileText, path: '/dashboard/orders' },
  { id: 'dashboard_payments', name: 'Payments Page', description: 'Payment processing', type: 'page', category: 'business', icon: CreditCard, path: '/dashboard/payments' },
  { id: 'dashboard_reports', name: 'Reports Page', description: 'Analytics and reports', type: 'page', category: 'business', icon: PieChart, path: '/dashboard/reports' },
  { id: 'dashboard_users', name: 'User Management', description: 'User administration', type: 'page', category: 'system', icon: UserCog, path: '/dashboard/users' },
  { id: 'dashboard_settings', name: 'Settings Page', description: 'System settings', type: 'page', category: 'system', icon: Settings, path: '/dashboard/settings' },
  { id: 'dashboard_notifications', name: 'Notifications', description: 'System notifications', type: 'page', category: 'system', icon: Bell, path: '/dashboard/notifications' },

  // Dashboard Widgets
  { id: 'widget_stats_overview', name: 'Statistics Cards', description: 'Key performance metrics', type: 'widget', category: 'dashboard', icon: BarChart3 },
  { id: 'widget_recent_contacts', name: 'Recent Contacts', description: 'Latest contact activity', type: 'widget', category: 'dashboard', icon: Users },
  { id: 'widget_rank_progress', name: 'Rank Progress', description: 'MLM rank advancement', type: 'widget', category: 'dashboard', icon: Crown },
  { id: 'widget_todays_tasks', name: 'Today\'s Tasks', description: 'Daily task list', type: 'widget', category: 'dashboard', icon: CheckSquare },
  { id: 'widget_commission_summary', name: 'Commission Summary', description: 'Earnings overview', type: 'widget', category: 'dashboard', icon: DollarSign },
  { id: 'widget_sales_pipeline', name: 'Sales Pipeline', description: 'Pipeline overview', type: 'widget', category: 'dashboard', icon: TrendingUp },
  { id: 'widget_notifications', name: 'Notifications', description: 'System alerts', type: 'widget', category: 'dashboard', icon: Bell },

  // Features within pages
  { id: 'feature_contact_create', name: 'Create Contacts', description: 'Add new contacts', type: 'feature', category: 'crm', icon: Plus },
  { id: 'feature_contact_edit', name: 'Edit Contacts', description: 'Modify contact info', type: 'feature', category: 'crm', icon: Edit },
  { id: 'feature_contact_delete', name: 'Delete Contacts', description: 'Remove contacts', type: 'feature', category: 'crm', icon: Trash2 },
  { id: 'feature_task_create', name: 'Create Tasks', description: 'Add new tasks', type: 'feature', category: 'crm', icon: Plus },
  { id: 'feature_commission_view', name: 'View Commission Details', description: 'See detailed earnings', type: 'feature', category: 'mlm', icon: Eye },
  { id: 'feature_genealogy_manage', name: 'Manage Genealogy', description: 'Edit team structure', type: 'feature', category: 'mlm', icon: Building2 },
  { id: 'feature_product_manage', name: 'Manage Products', description: 'Add/edit products', type: 'feature', category: 'business', icon: Building2 },
  { id: 'feature_order_process', name: 'Process Orders', description: 'Handle order fulfillment', type: 'feature', category: 'business', icon: FileText },
  { id: 'feature_payment_process', name: 'Process Payments', description: 'Handle payment processing', type: 'feature', category: 'business', icon: CreditCard },
  { id: 'feature_user_impersonate', name: 'User Impersonation', description: 'Login as other users', type: 'feature', category: 'system', icon: Shield },
  { id: 'feature_system_settings', name: 'System Configuration', description: 'Change system settings', type: 'feature', category: 'system', icon: Settings }
]

// Default permissions for each group
const DEFAULT_GROUP_PERMISSIONS: Record<UserGroup, Record<string, boolean>> = {
  admins: Object.fromEntries(SYSTEM_COMPONENTS.map(comp => [comp.id, true])), // Admins see everything
  managers: Object.fromEntries(SYSTEM_COMPONENTS.map(comp => [
    comp.id, 
    !comp.id.includes('user') && !comp.id.includes('system') && !comp.id.includes('impersonate')
  ])), // Managers see most things except user management
  affiliates: Object.fromEntries(SYSTEM_COMPONENTS.map(comp => [
    comp.id,
    comp.category === 'dashboard' || 
    comp.category === 'mlm' || 
    comp.id.includes('products') || 
    comp.id.includes('orders') ||
    comp.id.includes('customers') ||
    comp.id.includes('settings')
  ])), // Affiliates see MLM, basic business, and dashboard
  customers: Object.fromEntries(SYSTEM_COMPONENTS.map(comp => [
    comp.id,
    comp.id.includes('products') || 
    comp.id.includes('orders') || 
    comp.id.includes('payments') ||
    comp.id.includes('settings') ||
    comp.id === 'dashboard_home' ||
    comp.id.includes('widget_notifications')
  ])) // Customers see only their relevant items
}

interface UserGroupConfig {
  id: UserGroup | string
  name: string
  description: string
  color: string
  userCount: number
  isDefault: boolean
}

const DEFAULT_GROUPS: UserGroupConfig[] = [
  { id: 'admins', name: 'Administrators', description: 'Full system access', color: 'bg-red-100 text-red-800', userCount: 3, isDefault: true },
  { id: 'managers', name: 'Managers', description: 'Business management access', color: 'bg-blue-100 text-blue-800', userCount: 12, isDefault: true },
  { id: 'affiliates', name: 'Affiliates', description: 'MLM network members', color: 'bg-green-100 text-green-800', userCount: 847, isDefault: true },
  { id: 'customers', name: 'Customers', description: 'Product purchasers', color: 'bg-gray-100 text-gray-800', userCount: 2156, isDefault: true }
]

export function SimpleGroupPermissions() {
  const [groups, setGroups] = useState<UserGroupConfig[]>(DEFAULT_GROUPS)
  const [permissions, setPermissions] = useState<Record<string, Record<string, boolean>>>(
    Object.fromEntries(DEFAULT_GROUPS.map(g => [g.id, DEFAULT_GROUP_PERMISSIONS[g.id as UserGroup] || {}]))
  )
  const [selectedGroup, setSelectedGroup] = useState<string>('admins')
  const [isCreatingGroup, setIsCreatingGroup] = useState(false)
  const [newGroupName, setNewGroupName] = useState('')
  const [newGroupDescription, setNewGroupDescription] = useState('')

  const togglePermission = (groupId: string, componentId: string) => {
    setPermissions(prev => ({
      ...prev,
      [groupId]: {
        ...prev[groupId],
        [componentId]: !prev[groupId]?.[componentId]
      }
    }))
  }

  const toggleAllInCategory = (groupId: string, category: string, enabled: boolean) => {
    const categoryComponents = SYSTEM_COMPONENTS.filter(comp => comp.category === category)
    setPermissions(prev => ({
      ...prev,
      [groupId]: {
        ...prev[groupId],
        ...Object.fromEntries(categoryComponents.map(comp => [comp.id, enabled]))
      }
    }))
  }

  const createNewGroup = () => {
    if (!newGroupName.trim()) return
    
    const newGroup: UserGroupConfig = {
      id: newGroupName.toLowerCase().replace(/\s+/g, '_'),
      name: newGroupName,
      description: newGroupDescription || 'Custom user group',
      color: 'bg-purple-100 text-purple-800',
      userCount: 0,
      isDefault: false
    }
    
    setGroups(prev => [...prev, newGroup])
    setPermissions(prev => ({
      ...prev,
      [newGroup.id]: Object.fromEntries(SYSTEM_COMPONENTS.map(comp => [comp.id, false]))
    }))
    
    setNewGroupName('')
    setNewGroupDescription('')
    setIsCreatingGroup(false)
    setSelectedGroup(newGroup.id)
  }

  const deleteGroup = (groupId: string) => {
    if (DEFAULT_GROUPS.find(g => g.id === groupId)) return // Can't delete default groups
    
    setGroups(prev => prev.filter(g => g.id !== groupId))
    setPermissions(prev => {
      const newPerms = { ...prev }
      delete newPerms[groupId]
      return newPerms
    })
    
    if (selectedGroup === groupId) {
      setSelectedGroup('admins')
    }
  }

  const copyPermissionsFrom = (fromGroupId: string, toGroupId: string) => {
    setPermissions(prev => ({
      ...prev,
      [toGroupId]: { ...prev[fromGroupId] }
    }))
  }

  const selectedGroupData = groups.find(g => g.id === selectedGroup)
  const selectedGroupPermissions = permissions[selectedGroup] || {}

  const getComponentsByCategory = (category: string) => 
    SYSTEM_COMPONENTS.filter(comp => comp.category === category)

  const getCategoryStats = (groupId: string, category: string) => {
    const components = getComponentsByCategory(category)
    const enabled = components.filter(comp => permissions[groupId]?.[comp.id]).length
    return { enabled, total: components.length }
  }

  const categories = [
    { id: 'dashboard', name: 'Dashboard', icon: Home },
    { id: 'crm', name: 'CRM', icon: Users },
    { id: 'mlm', name: 'MLM System', icon: Crown },
    { id: 'business', name: 'Business', icon: Building2 },
    { id: 'system', name: 'System', icon: Settings }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Simple Group Permissions</h2>
          <p className="text-muted-foreground">
            Manage what each user group can see and do with simple checkboxes
          </p>
        </div>
        <Button onClick={() => setIsCreatingGroup(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Group
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Groups Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">User Groups</CardTitle>
              <CardDescription>Select a group to manage permissions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {groups.map((group) => (
                <div
                  key={group.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedGroup === group.id 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedGroup(group.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">{group.name}</div>
                      <div className="text-xs text-muted-foreground">{group.userCount} users</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={`text-xs ${group.color}`}>
                        {group.isDefault ? 'Default' : 'Custom'}
                      </Badge>
                      {!group.isDefault && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Group</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{group.name}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteGroup(group.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Permissions Panel */}
        <div className="lg:col-span-3">
          {selectedGroupData && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <Users className="h-5 w-5" />
                      <span>{selectedGroupData.name} Permissions</span>
                    </CardTitle>
                    <CardDescription>{selectedGroupData.description}</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <select 
                      className="px-3 py-1 border rounded text-sm"
                      onChange={(e) => {
                        if (e.target.value) {
                          copyPermissionsFrom(e.target.value, selectedGroup)
                        }
                      }}
                      value=""
                    >
                      <option value="">Copy from group...</option>
                      {groups.filter(g => g.id !== selectedGroup).map(g => (
                        <option key={g.id} value={g.id}>{g.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="dashboard" className="space-y-6">
                  <TabsList className="grid w-full grid-cols-5">
                    {categories.map((category) => {
                      const stats = getCategoryStats(selectedGroup, category.id)
                      return (
                        <TabsTrigger key={category.id} value={category.id} className="flex flex-col space-y-1">
                          <div className="flex items-center space-x-1">
                            <category.icon className="h-3 w-3" />
                            <span>{category.name}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {stats.enabled}/{stats.total}
                          </Badge>
                        </TabsTrigger>
                      )
                    })}
                  </TabsList>

                  {categories.map((category) => {
                    const components = getComponentsByCategory(category.id)
                    const stats = getCategoryStats(selectedGroup, category.id)
                    const allEnabled = stats.enabled === stats.total
                    
                    return (
                      <TabsContent key={category.id} value={category.id} className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold flex items-center space-x-2">
                            <category.icon className="h-5 w-5" />
                            <span>{category.name}</span>
                            <Badge variant="outline">
                              {stats.enabled}/{stats.total} enabled
                            </Badge>
                          </h3>
                          <div className="flex items-center space-x-2">
                            <Label className="text-sm">Enable All</Label>
                            <Switch
                              checked={allEnabled}
                              onCheckedChange={(checked) => 
                                toggleAllInCategory(selectedGroup, category.id, checked)
                              }
                            />
                          </div>
                        </div>
                        
                        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                          {components.map((component) => {
                            const isEnabled = selectedGroupPermissions[component.id]
                            const IconComponent = component.icon
                            
                            return (
                              <div
                                key={component.id}
                                className={`p-4 rounded-lg border transition-all cursor-pointer ${
                                  isEnabled 
                                    ? 'border-green-200 bg-green-50' 
                                    : 'border-gray-200 bg-gray-50'
                                }`}
                                onClick={() => togglePermission(selectedGroup, component.id)}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3">
                                    <IconComponent className="h-4 w-4" />
                                    <div>
                                      <div className="font-medium text-sm">{component.name}</div>
                                      <div className="text-xs text-muted-foreground">
                                        {component.description}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Badge 
                                      variant="outline" 
                                      className={`text-xs ${
                                        component.type === 'page' ? 'bg-blue-100' :
                                        component.type === 'widget' ? 'bg-green-100' :
                                        'bg-yellow-100'
                                      }`}
                                    >
                                      {component.type}
                                    </Badge>
                                    {isEnabled ? (
                                      <Eye className="h-4 w-4 text-green-600" />
                                    ) : (
                                      <EyeOff className="h-4 w-4 text-gray-400" />
                                    )}
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </TabsContent>
                    )
                  })}
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Create Group Modal */}
      {isCreatingGroup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Create New Group</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setIsCreatingGroup(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Group Name</Label>
                <Input
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="e.g., Sales Team"
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  value={newGroupDescription}
                  onChange={(e) => setNewGroupDescription(e.target.value)}
                  placeholder="e.g., Sales representatives and coordinators"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsCreatingGroup(false)}>
                  Cancel
                </Button>
                <Button onClick={createNewGroup} disabled={!newGroupName.trim()}>
                  <Save className="h-4 w-4 mr-2" />
                  Create Group
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
