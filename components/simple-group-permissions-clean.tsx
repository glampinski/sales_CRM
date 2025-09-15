"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { usePermissions } from "@/contexts/PermissionContext-simple"
import { useAuth } from "@/contexts/AuthContext"
import { 
  Shield,
  Search,
  CheckCircle,
  X
} from "lucide-react"

export function SimpleGroupPermissions() {
  const { user } = useAuth()
  const { permissions } = usePermissions()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

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
    { module: 'dashboard', name: 'Dashboard Overview', category: 'dashboard', perm: permissions.dashboard.canViewOverview },
    { module: 'dashboard', name: 'Business Dashboard', category: 'dashboard', perm: permissions.dashboard.canViewBusiness },
    { module: 'dashboard', name: 'Network Dashboard', category: 'dashboard', perm: permissions.dashboard.canViewNetwork },
    { module: 'dashboard', name: 'Admin Statistics', category: 'dashboard', perm: permissions.dashboard.canViewAdminStats },
    
    // Main Workflow
    { module: 'contacts', name: 'Contacts Management', category: 'workflow', perm: permissions.contacts.canView },
    { module: 'tasks', name: 'Task Management', category: 'workflow', perm: permissions.tasks.canView },
    { module: 'pipeline', name: 'Sales Pipeline', category: 'workflow', perm: permissions.pipeline.canView },
    
    // Network & MLM
    { module: 'network', name: 'Genealogy View', category: 'network', perm: permissions.network.canViewGenealogy },
    { module: 'commission', name: 'Commission Tracking', category: 'network', perm: permissions.commission.canView },
    { module: 'ranks', name: 'Rank Management', category: 'network', perm: permissions.ranks.canView },
    { module: 'affiliates', name: 'Affiliate Management', category: 'network', perm: permissions.affiliates.canView },
    
    // Business
    { module: 'customers', name: 'Customer Management', category: 'business', perm: permissions.customers.canView },
    { module: 'products', name: 'Product Catalog', category: 'business', perm: permissions.products.canView },
    { module: 'orders', name: 'Order Processing', category: 'business', perm: permissions.orders.canView },
    { module: 'payments', name: 'Payment Processing', category: 'business', perm: permissions.payments.canView },
    { module: 'wallet', name: 'Wallet Management', category: 'business', perm: permissions.wallet.canView },
    { module: 'marketing', name: 'Marketing Tools', category: 'business', perm: permissions.marketing.canView },
    { module: 'reports', name: 'Reporting System', category: 'business', perm: permissions.reports.canView },
    
    // System
    { module: 'training', name: 'Training Center', category: 'system', perm: permissions.training.canView },
    { module: 'support', name: 'Support System', category: 'system', perm: permissions.support.canView },
    { module: 'communication', name: 'Communication Hub', category: 'system', perm: permissions.communication.canView },
    { module: 'admin', name: 'User Management', category: 'system', perm: permissions.admin.canManageUsers },
    { module: 'settings', name: 'System Settings', category: 'system', perm: permissions.settings.canView }
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
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Current Role</p>
              <p className="text-2xl font-bold">{user?.role?.replace('_', ' ') || 'Unknown'}</p>
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
            Real-time view of your current permissions - this reflects the actual access control in the system
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
                  <Badge variant={permission.perm ? "default" : "secondary"}>
                    {permission.perm ? "Enabled" : "Disabled"}
                  </Badge>
                  {permission.perm ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <X className="h-5 w-5 text-gray-400" />
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
