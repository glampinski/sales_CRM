"use client"

import { useState } from 'react'
import { useTranslations } from 'next-intl'
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
  CheckSquare,
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
  Zap,
  Eye,
  Plus,
  Edit,
  Trash2,
  Upload,
  Download,
  Share2
} from "lucide-react"

export function SimpleGroupPermissions() {
  const { user } = useAuth()
  const { permissions } = usePermissions()
  const t = useTranslations('permissions.navigationCenter')
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
        canView: role === 'super_admin' || role === 'admin' || role === 'manager' || role === 'affiliate' || role === 'customer',
        canViewStats: role === 'super_admin' || role === 'admin' || role === 'manager',
        canViewCharts: role === 'super_admin' || role === 'admin' || role === 'manager' || role === 'affiliate',
        canExportData: role === 'super_admin' || role === 'admin'
      },
      contacts: {
        canView: role === 'super_admin' || role === 'admin' || role === 'manager' || role === 'affiliate',
        canCreate: role === 'super_admin' || role === 'admin' || role === 'manager' || role === 'affiliate',
        canEdit: role === 'super_admin' || role === 'admin' || role === 'manager',
        canDelete: role === 'super_admin' || role === 'admin',
        canImport: role === 'super_admin' || role === 'admin' || role === 'manager',
        canExport: role === 'super_admin' || role === 'admin'
      },
      tasks: {
        canView: role === 'super_admin' || role === 'admin' || role === 'manager' || role === 'affiliate',
        canCreate: role === 'super_admin' || role === 'admin' || role === 'manager' || role === 'affiliate',
        canEdit: role === 'super_admin' || role === 'admin' || role === 'manager',
        canDelete: role === 'super_admin' || role === 'admin',
        canAssign: role === 'super_admin' || role === 'admin' || role === 'manager',
        canSetPriority: role === 'super_admin' || role === 'admin' || role === 'manager'
      },
      pipeline: {
        canView: role === 'super_admin' || role === 'admin' || role === 'manager' || role === 'affiliate',
        canManage: role === 'super_admin' || role === 'admin' || role === 'manager',
        canEdit: role === 'super_admin' || role === 'admin' || role === 'manager',
        canMoveDeals: role === 'super_admin' || role === 'admin' || role === 'manager' || role === 'affiliate',
        canViewReports: role === 'super_admin' || role === 'admin' || role === 'manager'
      },
      genealogy: {
        canView: role === 'super_admin' || role === 'admin' || role === 'manager' || role === 'affiliate',
        canManage: role === 'super_admin' || role === 'admin',
        canViewTree: role === 'super_admin' || role === 'admin' || role === 'manager' || role === 'affiliate',
        canEditStructure: role === 'super_admin' || role === 'admin'
      },
      commission: {
        canView: role === 'super_admin' || role === 'admin' || role === 'manager' || role === 'affiliate',
        canCalculate: role === 'super_admin' || role === 'admin',
        canPayout: role === 'super_admin' || role === 'admin',
        canViewReports: role === 'super_admin' || role === 'admin' || role === 'manager',
        canManageRates: role === 'super_admin' || role === 'admin'
      },
      ranks: {
        canView: role === 'super_admin' || role === 'admin' || role === 'manager' || role === 'affiliate',
        canManage: role === 'super_admin' || role === 'admin',
        canPromote: role === 'super_admin' || role === 'admin',
        canViewRequirements: role === 'super_admin' || role === 'admin' || role === 'manager' || role === 'affiliate'
      },
      affiliates: {
        canView: role === 'super_admin' || role === 'admin' || role === 'manager' || role === 'affiliate',
        canManage: role === 'super_admin' || role === 'admin',
        canViewDetails: role === 'super_admin' || role === 'admin' || role === 'manager',
        canEdit: role === 'super_admin' || role === 'admin',
        canViewPerformance: role === 'super_admin' || role === 'admin' || role === 'manager'
      },
      customers: {
        canView: role === 'super_admin' || role === 'admin' || role === 'manager' || role === 'affiliate',
        canCreate: role === 'super_admin' || role === 'admin' || role === 'manager' || role === 'affiliate',
        canEdit: role === 'super_admin' || role === 'admin' || role === 'manager',
        canDelete: role === 'super_admin' || role === 'admin',
        canViewHistory: role === 'super_admin' || role === 'admin' || role === 'manager' || role === 'affiliate'
      },
      products: {
        canView: true, // All users can view products
        canManage: role === 'super_admin' || role === 'admin',
        canCreate: role === 'super_admin' || role === 'admin',
        canEdit: role === 'super_admin' || role === 'admin',
        canDelete: role === 'super_admin' || role === 'admin',
        canViewCatalog: true
      },
      orders: {
        canView: role === 'super_admin' || role === 'admin' || role === 'manager' || role === 'affiliate' || role === 'customer',
        canCreate: role === 'super_admin' || role === 'admin' || role === 'manager' || role === 'affiliate',
        canProcess: role === 'super_admin' || role === 'admin' || role === 'manager',
        canCancel: role === 'super_admin' || role === 'admin',
        canViewDetails: role === 'super_admin' || role === 'admin' || role === 'manager' || role === 'affiliate'
      },
      payments: {
        canView: role === 'super_admin' || role === 'admin' || role === 'manager' || role === 'affiliate' || role === 'customer',
        canProcess: role === 'super_admin' || role === 'admin' || role === 'manager',
        canRefund: role === 'super_admin' || role === 'admin',
        canViewHistory: role === 'super_admin' || role === 'admin' || role === 'manager' || role === 'affiliate'
      },
      wallet: {
        canView: role === 'super_admin' || role === 'admin' || role === 'manager' || role === 'affiliate' || role === 'customer',
        canTransfer: role === 'super_admin' || role === 'admin' || role === 'affiliate',
        canWithdraw: role === 'super_admin' || role === 'admin' || role === 'affiliate',
        canViewTransactions: role === 'super_admin' || role === 'admin' || role === 'manager' || role === 'affiliate' || role === 'customer'
      },
      marketing: {
        canView: role === 'super_admin' || role === 'admin' || role === 'manager' || role === 'affiliate',
        canCreate: role === 'super_admin' || role === 'admin' || role === 'manager',
        canManage: role === 'super_admin' || role === 'admin',
        canViewCampaigns: role === 'super_admin' || role === 'admin' || role === 'manager' || role === 'affiliate',
        canCreateContent: role === 'super_admin' || role === 'admin' || role === 'manager'
      },
      reports: {
        canView: role === 'super_admin' || role === 'admin' || role === 'manager' || role === 'affiliate',
        canGenerate: role === 'super_admin' || role === 'admin' || role === 'manager',
        canExport: role === 'super_admin' || role === 'admin',
        canCustomize: role === 'super_admin' || role === 'admin',
        canSchedule: role === 'super_admin' || role === 'admin'
      },
      training: {
        canView: role === 'super_admin' || role === 'admin' || role === 'manager' || role === 'affiliate' || role === 'customer',
        canCreate: role === 'super_admin' || role === 'admin' || role === 'manager',
        canManage: role === 'super_admin' || role === 'admin',
        canAssign: role === 'super_admin' || role === 'admin' || role === 'manager',
        canViewProgress: role === 'super_admin' || role === 'admin' || role === 'manager'
      },
      support: {
        canView: role === 'super_admin' || role === 'admin' || role === 'manager' || role === 'affiliate' || role === 'customer',
        canCreate: role === 'super_admin' || role === 'admin' || role === 'manager' || role === 'affiliate' || role === 'customer',
        canRespond: role === 'super_admin' || role === 'admin' || role === 'manager',
        canManage: role === 'super_admin' || role === 'admin',
        canViewTickets: role === 'super_admin' || role === 'admin' || role === 'manager'
      },
      communication: {
        canView: role === 'super_admin' || role === 'admin' || role === 'manager' || role === 'affiliate' || role === 'customer',
        canSend: role === 'super_admin' || role === 'admin' || role === 'manager' || role === 'affiliate',
        canBroadcast: role === 'super_admin' || role === 'admin' || role === 'manager',
        canManage: role === 'super_admin' || role === 'admin'
      },
      users: {
        canView: role === 'super_admin' || role === 'admin',
        canCreate: role === 'super_admin' || role === 'admin',
        canEdit: role === 'super_admin' || role === 'admin',
        canDelete: role === 'super_admin',
        canManageRoles: role === 'super_admin'
      },
      invitations: {
        canView: role === 'super_admin' || role === 'admin',
        canSend: role === 'super_admin' || role === 'admin',
        canManage: role === 'super_admin' || role === 'admin'
      },
      settings: {
        canView: role === 'super_admin' || role === 'admin' || role === 'manager' || role === 'affiliate' || role === 'customer',
        canEdit: role === 'super_admin' || role === 'admin' || role === 'manager' || role === 'affiliate',
        canManageSystem: role === 'super_admin' || role === 'admin'
      },
      referrals: {
        canView: role === 'super_admin' || role === 'admin' || role === 'manager' || role === 'affiliate',
        canGenerate: role === 'super_admin' || role === 'admin' || role === 'affiliate',
        canManage: role === 'super_admin' || role === 'admin',
        canAnalyze: role === 'super_admin' || role === 'admin' || role === 'manager',
        canSetPermissions: role === 'super_admin' || role === 'admin'
      }
    }
  }

  // Navigation structure matching your sidebar exactly
  const navigationStructure = {
    main: {
      name: "Main Workflow",
      icon: Home,
      count: 5,
      links: [
        {
          id: 'dashboard',
          name: "Dashboard",
          icon: Home,
          modules: [
            { id: 'canView', name: 'View Dashboard', description: 'Access main dashboard page' },
            { id: 'canViewStats', name: 'View Statistics', description: 'View dashboard statistics widgets' },
            { id: 'canViewCharts', name: 'View Charts', description: 'Access analytics charts and graphs' },
            { id: 'canExportData', name: 'Export Data', description: 'Export dashboard data to files' }
          ]
        },
        {
          id: 'referrals',
          name: "Referral System",
          icon: Share2,
          modules: [
            { id: 'canView', name: 'View Referrals', description: 'Access referral dashboard and statistics' },
            { id: 'canGenerate', name: 'Generate Links', description: 'Create new referral links and codes' },
            { id: 'canManage', name: 'Manage System', description: 'Configure referral system settings' },
            { id: 'canAnalyze', name: 'View Analytics', description: 'Access detailed referral performance data' },
            { id: 'canSetPermissions', name: 'Set Permissions', description: 'Control who can access referral features' }
          ]
        },
        {
          id: 'contacts',
          name: "Contacts",
          icon: Users,
          modules: [
            { id: 'canView', name: 'View Contacts', description: 'Browse contact list and details' },
            { id: 'canCreate', name: 'Create Contacts', description: 'Add new contacts to system' },
            { id: 'canEdit', name: 'Edit Contacts', description: 'Modify existing contact information' },
            { id: 'canDelete', name: 'Delete Contacts', description: 'Remove contacts from system' },
            { id: 'canImport', name: 'Import Contacts', description: 'Bulk import contacts from files' },
            { id: 'canExport', name: 'Export Contacts', description: 'Export contact data to files' }
          ]
        },
        {
          id: 'tasks',
          name: "Tasks",
          icon: CheckSquare,
          modules: [
            { id: 'canView', name: 'View Tasks', description: 'Browse task list and details' },
            { id: 'canCreate', name: 'Create Tasks', description: 'Add new tasks and reminders' },
            { id: 'canEdit', name: 'Edit Tasks', description: 'Modify existing task information' },
            { id: 'canDelete', name: 'Delete Tasks', description: 'Remove tasks from system' },
            { id: 'canAssign', name: 'Assign Tasks', description: 'Assign tasks to team members' },
            { id: 'canSetPriority', name: 'Set Priority', description: 'Change task priority levels' }
          ]
        },
        {
          id: 'pipeline',
          name: "Pipeline",
          icon: TrendingUp,
          modules: [
            { id: 'canView', name: 'View Pipeline', description: 'Access sales pipeline overview' },
            { id: 'canManage', name: 'Manage Pipeline', description: 'Configure pipeline stages and settings' },
            { id: 'canEdit', name: 'Edit Deals', description: 'Modify deal information and details' },
            { id: 'canMoveDeals', name: 'Move Deals', description: 'Move deals between pipeline stages' },
            { id: 'canViewReports', name: 'View Reports', description: 'Access pipeline performance reports' }
          ]
        }
      ]
    },
    network: {
      name: "Network & MLM",
      icon: Building2,
      count: 4,
      links: [
        {
          id: 'genealogy',
          name: "Genealogy",
          icon: Building2,
          modules: [
            { id: 'canView', name: 'View Genealogy', description: 'Access team structure overview' },
            { id: 'canManage', name: 'Manage Structure', description: 'Modify team hierarchy and organization' },
            { id: 'canViewTree', name: 'View Tree', description: 'Browse visual team tree representation' },
            { id: 'canEditStructure', name: 'Edit Structure', description: 'Reorganize team member positions' }
          ]
        },
        {
          id: 'commission',
          name: "Commission",
          icon: DollarSign,
          modules: [
            { id: 'canView', name: 'View Commission', description: 'Access commission dashboard and history' },
            { id: 'canCalculate', name: 'Calculate Commission', description: 'Process commission calculations' },
            { id: 'canPayout', name: 'Process Payouts', description: 'Execute commission payments' },
            { id: 'canViewReports', name: 'View Reports', description: 'Access commission analytics and reports' },
            { id: 'canManageRates', name: 'Manage Rates', description: 'Configure commission rates and structures' }
          ]
        },
        {
          id: 'ranks',
          name: "Ranks",
          icon: Crown,
          modules: [
            { id: 'canView', name: 'View Ranks', description: 'Browse rank system and levels' },
            { id: 'canManage', name: 'Manage Ranks', description: 'Configure rank requirements and benefits' },
            { id: 'canPromote', name: 'Promote Members', description: 'Process rank promotions and advancements' },
            { id: 'canViewRequirements', name: 'View Requirements', description: 'Access rank qualification criteria' }
          ]
        },
        {
          id: 'affiliates',
          name: "Affiliates",
          icon: Shield,
          modules: [
            { id: 'canView', name: 'View Affiliates', description: 'Browse affiliate member list' },
            { id: 'canManage', name: 'Manage Affiliates', description: 'Administer affiliate accounts and settings' },
            { id: 'canViewDetails', name: 'View Details', description: 'Access detailed affiliate profiles' },
            { id: 'canEdit', name: 'Edit Profiles', description: 'Modify affiliate account information' },
            { id: 'canViewPerformance', name: 'View Performance', description: 'Access affiliate performance metrics' }
          ]
        }
      ]
    },
    business: {
      name: "Business Operations",
      icon: FileText,
      count: 7,
      links: [
        {
          id: 'customers',
          name: "Customers",
          icon: Users,
          modules: [
            { id: 'canView', name: 'View Customers', description: 'Browse customer database' },
            { id: 'canCreate', name: 'Create Customers', description: 'Add new customer records' },
            { id: 'canEdit', name: 'Edit Customers', description: 'Modify customer information' },
            { id: 'canDelete', name: 'Delete Customers', description: 'Remove customer records' },
            { id: 'canViewHistory', name: 'View History', description: 'Access customer interaction history' }
          ]
        },
        {
          id: 'products',
          name: "Products",
          icon: Building2,
          modules: [
            { id: 'canView', name: 'View Products', description: 'Browse product catalog' },
            { id: 'canManage', name: 'Manage Products', description: 'Administer product inventory' },
            { id: 'canCreate', name: 'Create Products', description: 'Add new products to catalog' },
            { id: 'canEdit', name: 'Edit Products', description: 'Modify product information and pricing' },
            { id: 'canDelete', name: 'Delete Products', description: 'Remove products from catalog' },
            { id: 'canViewCatalog', name: 'View Catalog', description: 'Access public product catalog' }
          ]
        },
        {
          id: 'orders',
          name: "Orders",
          icon: FileText,
          modules: [
            { id: 'canView', name: 'View Orders', description: 'Browse order history and status' },
            { id: 'canCreate', name: 'Create Orders', description: 'Process new customer orders' },
            { id: 'canProcess', name: 'Process Orders', description: 'Fulfill and ship orders' },
            { id: 'canCancel', name: 'Cancel Orders', description: 'Cancel pending or processing orders' },
            { id: 'canViewDetails', name: 'View Details', description: 'Access detailed order information' }
          ]
        },
        {
          id: 'payments',
          name: "Payments",
          icon: CreditCard,
          modules: [
            { id: 'canView', name: 'View Payments', description: 'Access payment dashboard' },
            { id: 'canProcess', name: 'Process Payments', description: 'Handle payment transactions' },
            { id: 'canRefund', name: 'Process Refunds', description: 'Issue customer refunds' },
            { id: 'canViewHistory', name: 'View History', description: 'Browse payment transaction history' }
          ]
        },
        {
          id: 'wallet',
          name: "Wallet",
          icon: Wallet,
          modules: [
            { id: 'canView', name: 'View Wallet', description: 'Access wallet balance and overview' },
            { id: 'canTransfer', name: 'Transfer Funds', description: 'Send money between accounts' },
            { id: 'canWithdraw', name: 'Withdraw Funds', description: 'Request fund withdrawals' },
            { id: 'canViewTransactions', name: 'View Transactions', description: 'Browse wallet transaction history' }
          ]
        },
        {
          id: 'marketing',
          name: "Marketing",
          icon: Megaphone,
          modules: [
            { id: 'canView', name: 'View Marketing', description: 'Access marketing dashboard' },
            { id: 'canCreate', name: 'Create Campaigns', description: 'Design and launch marketing campaigns' },
            { id: 'canManage', name: 'Manage Tools', description: 'Administer marketing tools and resources' },
            { id: 'canViewCampaigns', name: 'View Campaigns', description: 'Browse active and past campaigns' },
            { id: 'canCreateContent', name: 'Create Content', description: 'Develop marketing materials and content' }
          ]
        },
        {
          id: 'reports',
          name: "Reports",
          icon: PieChart,
          modules: [
            { id: 'canView', name: 'View Reports', description: 'Access business analytics dashboard' },
            { id: 'canGenerate', name: 'Generate Reports', description: 'Create custom business reports' },
            { id: 'canExport', name: 'Export Data', description: 'Export report data to files' },
            { id: 'canCustomize', name: 'Customize Reports', description: 'Configure report layouts and metrics' },
            { id: 'canSchedule', name: 'Schedule Reports', description: 'Set up automated report generation' }
          ]
        }
      ]
    },
    system: {
      name: "System Administration",
      icon: Settings,
      count: 6,
      links: [
        {
          id: 'training',
          name: "Training",
          icon: BookOpen,
          modules: [
            { id: 'canView', name: 'View Training', description: 'Access training center and courses' },
            { id: 'canCreate', name: 'Create Courses', description: 'Develop training content and materials' },
            { id: 'canManage', name: 'Manage Training', description: 'Administer training programs' },
            { id: 'canAssign', name: 'Assign Training', description: 'Assign courses to team members' },
            { id: 'canViewProgress', name: 'View Progress', description: 'Monitor training completion and results' }
          ]
        },
        {
          id: 'support',
          name: "Support",
          icon: HeadphonesIcon,
          modules: [
            { id: 'canView', name: 'View Support', description: 'Access support ticket system' },
            { id: 'canCreate', name: 'Create Tickets', description: 'Submit new support requests' },
            { id: 'canRespond', name: 'Respond to Tickets', description: 'Provide support responses and solutions' },
            { id: 'canManage', name: 'Manage Support', description: 'Administer support system and agents' },
            { id: 'canViewTickets', name: 'View All Tickets', description: 'Browse all support tickets and history' }
          ]
        },
        {
          id: 'communication',
          name: "Communication",
          icon: MessageSquare,
          modules: [
            { id: 'canView', name: 'View Messages', description: 'Access communication hub and messages' },
            { id: 'canSend', name: 'Send Messages', description: 'Send direct messages to team members' },
            { id: 'canBroadcast', name: 'Broadcast Messages', description: 'Send announcements to groups' },
            { id: 'canManage', name: 'Manage Communications', description: 'Administer messaging system and settings' }
          ]
        },
        {
          id: 'users',
          name: "User Management",
          icon: UserCog,
          modules: [
            { id: 'canView', name: 'View Users', description: 'Browse user accounts and profiles' },
            { id: 'canCreate', name: 'Create Users', description: 'Add new user accounts to system' },
            { id: 'canEdit', name: 'Edit Users', description: 'Modify user account information' },
            { id: 'canDelete', name: 'Delete Users', description: 'Remove user accounts from system' },
            { id: 'canManageRoles', name: 'Manage Roles', description: 'Assign and modify user roles and permissions' }
          ]
        },
        {
          id: 'invitations',
          name: "Invitations",
          icon: Bell,
          modules: [
            { id: 'canView', name: 'View Invitations', description: 'Browse sent and pending invitations' },
            { id: 'canSend', name: 'Send Invitations', description: 'Invite new users to join system' },
            { id: 'canManage', name: 'Manage Invitations', description: 'Administer invitation system and templates' }
          ]
        },
        {
          id: 'settings',
          name: "Settings",
          icon: Settings,
          modules: [
            { id: 'canView', name: 'View Settings', description: 'Access system configuration panel' },
            { id: 'canEdit', name: 'Edit Settings', description: 'Modify system and user preferences' },
            { id: 'canManageSystem', name: 'Manage System', description: 'Configure system-wide settings and parameters' }
          ]
        }
      ]
    }
  }

  // Initialize local permissions when entering edit mode
  const enterEditMode = () => {
    const rolePermissions = getPermissionsForRole(selectedRole)
    setLocalPermissions(JSON.parse(JSON.stringify(rolePermissions)))
    setEditMode(true)
  }

  // Save changes
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

  // Get permission value
  const getPermissionValue = (module: string, permission: string) => {
    if (editMode && localPermissions) {
      return localPermissions[module]?.[permission]
    }
    const rolePermissions = getPermissionsForRole(selectedRole)
    return (rolePermissions as any)[module]?.[permission]
  }

  // Translate category names
  const getCategoryName = (categoryKey: string) => {
    const categoryNames: Record<string, string> = {
      'Main Workflow': t('categories.mainWorkflow'),
      'Network & MLM': t('categories.networkMLM'),
      'Business Operations': t('categories.businessOperations'),
      'System Administration': t('categories.systemAdministration')
    }
    return categoryNames[categoryKey] || categoryKey
  }

  // Translate feature names and descriptions
  const getFeatureTranslation = (featureName: string, description: string) => {
    const featureTranslations: Record<string, { name: string; description: string }> = {
      'View Dashboard': { 
        name: t('features.dashboard.viewDashboard'), 
        description: t('features.dashboard.descriptions.viewDashboard') 
      },
      'View Statistics': { 
        name: t('features.dashboard.viewStatistics'), 
        description: t('features.dashboard.descriptions.viewStatistics') 
      },
      'View Charts': { 
        name: t('features.dashboard.viewCharts'), 
        description: t('features.dashboard.descriptions.viewCharts') 
      },
      'Export Data': { 
        name: t('features.dashboard.exportData'), 
        description: t('features.dashboard.descriptions.exportData') 
      },
      'View Referrals': { 
        name: t('features.referralSystem.viewReferrals'), 
        description: t('features.referralSystem.descriptions.viewReferrals') 
      },
      'Generate Links': { 
        name: t('features.referralSystem.generateLinks'), 
        description: t('features.referralSystem.descriptions.generateLinks') 
      },
      'Manage System': { 
        name: t('features.referralSystem.manageSystem'), 
        description: t('features.referralSystem.descriptions.manageSystem') 
      },
      'View Analytics': { 
        name: t('features.referralSystem.viewAnalytics'), 
        description: t('features.referralSystem.descriptions.viewAnalytics') 
      },
      'Set Permissions': { 
        name: t('features.referralSystem.setPermissions'), 
        description: t('features.referralSystem.descriptions.setPermissions') 
      },
      'View Contacts': { 
        name: t('features.contacts.viewContacts'), 
        description: t('features.contacts.descriptions.viewContacts') 
      },
      'Add Contacts': { 
        name: t('features.contacts.addContacts'), 
        description: t('features.contacts.descriptions.addContacts') 
      },
      'Edit Contacts': { 
        name: t('features.contacts.editContacts'), 
        description: t('features.contacts.descriptions.editContacts') 
      },
      'Delete Contacts': { 
        name: t('features.contacts.deleteContacts'), 
        description: t('features.contacts.descriptions.deleteContacts') 
      },
      'Export Contacts': { 
        name: t('features.contacts.exportContacts'), 
        description: t('features.contacts.descriptions.exportContacts') 
      },
      'Import Contacts': { 
        name: t('features.contacts.importContacts'), 
        description: t('features.contacts.descriptions.importContacts') 
      },
      'View Tasks': { 
        name: t('features.tasks.viewTasks'), 
        description: t('features.tasks.descriptions.viewTasks') 
      },
      'Create Tasks': { 
        name: t('features.tasks.createTasks'), 
        description: t('features.tasks.descriptions.createTasks') 
      },
      'Edit Tasks': { 
        name: t('features.tasks.editTasks'), 
        description: t('features.tasks.descriptions.editTasks') 
      },
      'Delete Tasks': { 
        name: t('features.tasks.deleteTasks'), 
        description: t('features.tasks.descriptions.deleteTasks') 
      },
      'Assign Tasks': { 
        name: t('features.tasks.assignTasks'), 
        description: t('features.tasks.descriptions.assignTasks') 
      },
      'Track Progress': { 
        name: t('features.tasks.trackProgress'), 
        description: t('features.tasks.descriptions.trackProgress') 
      },
      'View Pipeline': { 
        name: t('features.pipeline.viewPipeline'), 
        description: t('features.pipeline.descriptions.viewPipeline') 
      },
      'Manage Pipeline': { 
        name: t('features.pipeline.managePipeline'), 
        description: t('features.pipeline.descriptions.managePipeline') 
      },
      'Create Deals': { 
        name: t('features.pipeline.createDeals'), 
        description: t('features.pipeline.descriptions.createDeals') 
      },
      'Edit Deals': { 
        name: t('features.pipeline.editDeals'), 
        description: t('features.pipeline.descriptions.editDeals') 
      },
      'Generate Reports': { 
        name: t('features.pipeline.generateReports'), 
        description: t('features.pipeline.descriptions.generateReports') 
      },
      'View Genealogy': { 
        name: t('features.genealogy.viewGenealogy'), 
        description: t('features.genealogy.descriptions.viewGenealogy') 
      },
      'Manage Structure': { 
        name: t('features.genealogy.manageStructure'), 
        description: t('features.genealogy.descriptions.manageStructure') 
      },
      'View Tree': { 
        name: t('features.genealogy.viewTree'), 
        description: t('features.genealogy.descriptions.viewTree') 
      },
      'Edit Structure': { 
        name: t('features.genealogy.editStructure'), 
        description: t('features.genealogy.descriptions.editStructure') 
      },
      'Manage Downlines': { 
        name: t('features.genealogy.manageDownlines'), 
        description: t('features.genealogy.descriptions.manageDownlines') 
      },
      'View Uplines': { 
        name: t('features.genealogy.viewUplines'), 
        description: t('features.genealogy.descriptions.viewUplines') 
      },
      'Export Tree': { 
        name: t('features.genealogy.exportTree'), 
        description: t('features.genealogy.descriptions.exportTree') 
      },
      'Track Performance': { 
        name: t('features.genealogy.trackPerformance'), 
        description: t('features.genealogy.descriptions.trackPerformance') 
      },
      'View Commission': { 
        name: t('features.commission.viewCommission'), 
        description: t('features.commission.descriptions.viewCommission') 
      },
      'Calculate Commission': { 
        name: t('features.commission.calculateCommission'), 
        description: t('features.commission.descriptions.calculateCommission') 
      },
      'View Commissions': { 
        name: t('features.commission.viewCommissions'), 
        description: t('features.commission.descriptions.viewCommissions') 
      },
      'Calculate Commissions': { 
        name: t('features.commission.calculateCommissions'), 
        description: t('features.commission.descriptions.calculateCommissions') 
      },
      'Process Payouts': { 
        name: t('features.commission.processPayouts'), 
        description: t('features.commission.descriptions.processPayouts') 
      },
      'View Reports': { 
        name: t('features.commission.viewReports'), 
        description: t('features.commission.descriptions.viewReports') 
      },
      'Adjust Commissions': { 
        name: t('features.commission.adjustCommissions'), 
        description: t('features.commission.descriptions.adjustCommissions') 
      },
      'Manage Rates': { 
        name: t('features.commission.manageRates'), 
        description: t('features.commission.descriptions.manageRates') 
      },
      'View Ranks': { 
        name: t('features.ranks.viewRanks'), 
        description: t('features.ranks.descriptions.viewRanks') 
      },
      'Manage Rankings': { 
        name: t('features.ranks.manageRankings'), 
        description: t('features.ranks.descriptions.manageRankings') 
      },
      'Set Requirements': { 
        name: t('features.ranks.setRequirements'), 
        description: t('features.ranks.descriptions.setRequirements') 
      },
      'Assign Ranks': { 
        name: t('features.ranks.assignRanks'), 
        description: t('features.ranks.descriptions.assignRanks') 
      },
      'View Affiliates': { 
        name: t('features.affiliates.viewAffiliates'), 
        description: t('features.affiliates.descriptions.viewAffiliates') 
      },
      'Manage Affiliates': { 
        name: t('features.affiliates.manageAffiliates'), 
        description: t('features.affiliates.descriptions.manageAffiliates') 
      },
      'Approve Applications': { 
        name: t('features.affiliates.approveApplications'), 
        description: t('features.affiliates.descriptions.approveApplications') 
      },
      'Set Commissions': { 
        name: t('features.affiliates.setCommissions'), 
        description: t('features.affiliates.descriptions.setCommissions') 
      },
      'View Users': { 
        name: t('features.userManagement.viewUsers'), 
        description: t('features.userManagement.descriptions.viewUsers') 
      },
      'Create Users': { 
        name: t('features.userManagement.createUsers'), 
        description: t('features.userManagement.descriptions.createUsers') 
      },
      'Edit Users': { 
        name: t('features.userManagement.editUsers'), 
        description: t('features.userManagement.descriptions.editUsers') 
      },
      'Delete Users': { 
        name: t('features.userManagement.deleteUsers'), 
        description: t('features.userManagement.descriptions.deleteUsers') 
      },
      'Manage Roles': { 
        name: t('features.userManagement.manageRoles'), 
        description: t('features.userManagement.descriptions.manageRoles') 
      },
      'Reset Passwords': { 
        name: t('features.userManagement.resetPasswords'), 
        description: t('features.userManagement.descriptions.resetPasswords') 
      },
      'View Invitations': { 
        name: t('features.invitations.viewInvitations'), 
        description: t('features.invitations.descriptions.viewInvitations') 
      },
      'Send Invitations': { 
        name: t('features.invitations.sendInvitations'), 
        description: t('features.invitations.descriptions.sendInvitations') 
      },
      'Manage Invitations': { 
        name: t('features.invitations.manageInvitations'), 
        description: t('features.invitations.descriptions.manageInvitations') 
      },
      'Track Status': { 
        name: t('features.invitations.trackStatus'), 
        description: t('features.invitations.descriptions.trackStatus') 
      },
      'Resend Invitations': { 
        name: t('features.invitations.resendInvitations'), 
        description: t('features.invitations.descriptions.resendInvitations') 
      },
      'View Settings': { 
        name: t('features.settings.viewSettings'), 
        description: t('features.settings.descriptions.viewSettings') 
      },
      'Edit Settings': { 
        name: t('features.settings.editSettings'), 
        description: t('features.settings.descriptions.editSettings') 
      },
      'Manage Integrations': { 
        name: t('features.settings.manageIntegrations'), 
        description: t('features.settings.descriptions.manageIntegrations') 
      },
      'Configure System': { 
        name: t('features.settings.configureSystem'), 
        description: t('features.settings.descriptions.configureSystem') 
      },
      'Backup & Restore': { 
        name: t('features.settings.backupRestore'), 
        description: t('features.settings.descriptions.backupRestore') 
      },
      'View Customers': { 
        name: t('features.customers.viewCustomers'), 
        description: t('features.customers.descriptions.viewCustomers') 
      },
      'Add Customers': { 
        name: t('features.customers.addCustomers'), 
        description: t('features.customers.descriptions.addCustomers') 
      },
      'Edit Customers': { 
        name: t('features.customers.editCustomers'), 
        description: t('features.customers.descriptions.editCustomers') 
      },
      'Delete Customers': { 
        name: t('features.customers.deleteCustomers'), 
        description: t('features.customers.descriptions.deleteCustomers') 
      },
      'Manage Orders': { 
        name: t('features.customers.manageOrders'), 
        description: t('features.customers.descriptions.manageOrders') 
      },
      'View History': { 
        name: t('features.customers.viewHistory'), 
        description: t('features.customers.descriptions.viewHistory') 
      },
      'View Products': { 
        name: t('features.products.viewProducts'), 
        description: t('features.products.descriptions.viewProducts') 
      },
      'Add Products': { 
        name: t('features.products.addProducts'), 
        description: t('features.products.descriptions.addProducts') 
      },
      'Edit Products': { 
        name: t('features.products.editProducts'), 
        description: t('features.products.descriptions.editProducts') 
      },
      'Delete Products': { 
        name: t('features.products.deleteProducts'), 
        description: t('features.products.descriptions.deleteProducts') 
      },
      'Manage Inventory': { 
        name: t('features.products.manageInventory'), 
        description: t('features.products.descriptions.manageInventory') 
      },
      'Set Pricing': { 
        name: t('features.products.setPricing'), 
        description: t('features.products.descriptions.setPricing') 
      },
      'View Orders': { 
        name: t('features.orders.viewOrders'), 
        description: t('features.orders.descriptions.viewOrders') 
      },
      'Process Orders': { 
        name: t('features.orders.processOrders'), 
        description: t('features.orders.descriptions.processOrders') 
      },
      'Edit Orders': { 
        name: t('features.orders.editOrders'), 
        description: t('features.orders.descriptions.editOrders') 
      },
      'Cancel Orders': { 
        name: t('features.orders.cancelOrders'), 
        description: t('features.orders.descriptions.cancelOrders') 
      },
      'Track Shipping': { 
        name: t('features.orders.trackShipping'), 
        description: t('features.orders.descriptions.trackShipping') 
      },
      'Generate Invoices': { 
        name: t('features.orders.generateInvoices'), 
        description: t('features.orders.descriptions.generateInvoices') 
      },
      'View Payments': { 
        name: t('features.payments.viewPayments'), 
        description: t('features.payments.descriptions.viewPayments') 
      },
      'Process Payments': { 
        name: t('features.payments.processPayments'), 
        description: t('features.payments.descriptions.processPayments') 
      },
      'Refund Payments': { 
        name: t('features.payments.refundPayments'), 
        description: t('features.payments.descriptions.refundPayments') 
      },
      'Manage Gateways': { 
        name: t('features.payments.manageGateways'), 
        description: t('features.payments.descriptions.manageGateways') 
      },
      'View Transactions': { 
        name: t('features.payments.viewTransactions'), 
        description: t('features.payments.descriptions.viewTransactions') 
      },
      'View Wallet': { 
        name: t('features.wallet.viewWallet'), 
        description: t('features.wallet.descriptions.viewWallet') 
      },
      'Manage Balance': { 
        name: t('features.wallet.manageBalance'), 
        description: t('features.wallet.descriptions.manageBalance') 
      },
      'Transfer Funds': { 
        name: t('features.wallet.transferFunds'), 
        description: t('features.wallet.descriptions.transferFunds') 
      },
      'Withdraw Funds': { 
        name: t('features.wallet.withdrawFunds'), 
        description: t('features.wallet.descriptions.withdrawFunds') 
      },
      'Add Funds': { 
        name: t('features.wallet.addFunds'), 
        description: t('features.wallet.descriptions.addFunds') 
      },
      'View Campaigns': { 
        name: t('features.marketing.viewCampaigns'), 
        description: t('features.marketing.descriptions.viewCampaigns') 
      },
      'Create Campaigns': { 
        name: t('features.marketing.createCampaigns'), 
        description: t('features.marketing.descriptions.createCampaigns') 
      },
      'Manage Campaigns': { 
        name: t('features.marketing.manageCampaigns'), 
        description: t('features.marketing.descriptions.manageCampaigns') 
      },
      'Manage Content': { 
        name: t('features.marketing.manageContent'), 
        description: t('features.marketing.descriptions.manageContent') 
      },
      'Schedule Reports': { 
        name: t('features.reports.scheduleReports'), 
        description: t('features.reports.descriptions.scheduleReports') 
      },
      'Export Reports': { 
        name: t('features.reports.exportReports'), 
        description: t('features.reports.descriptions.exportReports') 
      },
      'Custom Reports': { 
        name: t('features.reports.customReports'), 
        description: t('features.reports.descriptions.customReports') 
      },
      'Share Reports': { 
        name: t('features.reports.shareReports'), 
        description: t('features.reports.descriptions.shareReports') 
      },
      'View Training': { 
        name: t('features.training.viewTraining'), 
        description: t('features.training.descriptions.viewTraining') 
      },
      'Create Content': { 
        name: t('features.training.createContent'), 
        description: t('features.training.descriptions.createContent') 
      },
      'Assign Training': { 
        name: t('features.training.assignTraining'), 
        description: t('features.training.descriptions.assignTraining') 
      },
      'View Certificates': { 
        name: t('features.training.viewCertificates'), 
        description: t('features.training.descriptions.viewCertificates') 
      },
      'View Tickets': { 
        name: t('features.support.viewTickets'), 
        description: t('features.support.descriptions.viewTickets') 
      },
      'Create Tickets': { 
        name: t('features.support.createTickets'), 
        description: t('features.support.descriptions.createTickets') 
      },
      'Manage Tickets': { 
        name: t('features.support.manageTickets'), 
        description: t('features.support.descriptions.manageTickets') 
      },
      'Respond Tickets': { 
        name: t('features.support.respondTickets'), 
        description: t('features.support.descriptions.respondTickets') 
      },
      'Escalate Tickets': { 
        name: t('features.support.escalateTickets'), 
        description: t('features.support.descriptions.escalateTickets') 
      },
      'View Knowledge Base': { 
        name: t('features.support.viewKnowledgeBase'), 
        description: t('features.support.descriptions.viewKnowledgeBase') 
      },
      'View Messages': { 
        name: t('features.communication.viewMessages'), 
        description: t('features.communication.descriptions.viewMessages') 
      },
      'Send Messages': { 
        name: t('features.communication.sendMessages'), 
        description: t('features.communication.descriptions.sendMessages') 
      },
      'Manage Notifications': { 
        name: t('features.communication.manageNotifications'), 
        description: t('features.communication.descriptions.manageNotifications') 
      },
      'View Announcements': { 
        name: t('features.communication.viewAnnouncements'), 
        description: t('features.communication.descriptions.viewAnnouncements') 
      },
      'Create Announcements': { 
        name: t('features.communication.createAnnouncements'), 
        description: t('features.communication.descriptions.createAnnouncements') 
      },
      'Manage Channels': { 
        name: t('features.communication.manageChannels'), 
        description: t('features.communication.descriptions.manageChannels') 
      }
    }
    return featureTranslations[featureName] || { name: featureName, description }
  }

  // Translate link names (section titles)
  const getLinkName = (linkName: string) => {
    const linkTranslations: Record<string, string> = {
      'Dashboard': t('features.dashboard.title'),
      'Referral System': t('features.referralSystem.title'),
      'Contacts': t('features.contacts.title'),
      'Tasks': t('features.tasks.title'),
      'Pipeline': t('features.pipeline.title'),
      'Genealogy': t('features.genealogy.title'),
      'Commission': t('features.commission.title'),
      'Ranks': t('features.ranks.title'),
      'Affiliates': t('features.affiliates.title'),
      'Customers': t('features.customers.title'),
      'Products': t('features.products.title'),
      'Orders': t('features.orders.title'),
      'Payments': t('features.payments.title'),
      'Wallet': t('features.wallet.title'),
      'Marketing': t('features.marketing.title'),
      'Reports': t('features.reports.title'),
      'Training': t('features.training.title'),
      'Support': t('features.support.title'),
      'Communication': t('features.communication.title'),
      'User Management': t('features.userManagement.title'),
      'Invitations': t('features.invitations.title'),
      'Settings': t('features.settings.title')
    }
    return linkTranslations[linkName] || linkName
  }

  // Calculate totals
  const totalLinks = Object.values(navigationStructure).reduce((sum, category) => sum + category.links.length, 0)
  const totalModules = Object.values(navigationStructure).reduce(
    (sum, category) => sum + category.links.reduce((linkSum, link) => linkSum + link.modules.length, 0), 
    0
  )

  const enabledModules = Object.values(navigationStructure).reduce(
    (sum, category) => sum + category.links.reduce(
      (linkSum, link) => linkSum + link.modules.filter(module => 
        getPermissionValue(link.id, module.id)
      ).length, 
      0
    ), 
    0
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <Shield className="h-8 w-8 text-blue-500" />
          <h2 className="text-3xl font-bold">{t('title')}</h2>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {t('description')}
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
                <span>{t('buttons.saveChanges')}</span>
              </>
            ) : (
              <>
                <Edit3 className="h-4 w-4" />
                <span>{t('buttons.editPermissions')}</span>
              </>
            )}
          </Button>
          {editMode && (
            <Button variant="outline" onClick={cancelChanges}>
              <RotateCcw className="h-4 w-4 mr-2" />
              {t('buttons.cancel')}
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
                <h3 className="font-semibold">{t('roleSelector.title')}</h3>
                <p className="text-sm text-muted-foreground">{t('roleSelector.description')}</p>
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
              <p className="text-sm font-medium text-muted-foreground">{t('managingRole.title')}</p>
              <p className="text-2xl font-bold">{availableRoles.find(r => r.value === selectedRole)?.label || 'Unknown'}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">{t('managingRole.navigationLinks')}</p>
              <p className="text-2xl font-bold">{totalLinks}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">{t('managingRole.enabledFeatures')}</p>
              <p className="text-2xl font-bold text-green-600">{enabledModules}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">{t('managingRole.accessLevel')}</p>
              <p className="text-2xl font-bold">{Math.round((enabledModules / totalModules) * 100)}%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('search.placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
      </div>

      {/* Navigation Permission Structure */}
      <div className="space-y-4">
        {Object.entries(navigationStructure).map(([categoryKey, category]) => (
          <Card key={categoryKey}>
            <CardHeader 
              className="cursor-pointer"
              onClick={() => toggleCategory(categoryKey)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <category.icon className="h-5 w-5 text-blue-500" />
                  <div>
                    <CardTitle className="text-lg">{getCategoryName(category.name)}</CardTitle>
                    <CardDescription>{category.count} {t('categories.navigationLinks')}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">
                    {category.links.filter(link => 
                      link.modules.some(module => getPermissionValue(link.id, module.id))
                    ).length} / {category.links.length} enabled
                  </Badge>
                  {expandedCategories.includes(categoryKey) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </div>
              </div>
            </CardHeader>
            
            {expandedCategories.includes(categoryKey) && (
              <CardContent>
                <div className="space-y-3">
                  {category.links.map((link) => (
                    <div key={link.id} className="border rounded-lg">
                      <div 
                        className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50"
                        onClick={() => toggleLink(link.id)}
                      >
                        <div className="flex items-center space-x-3">
                          <link.icon className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <h4 className="font-medium text-foreground">{getLinkName(link.name)}</h4>
                            <p className="text-sm text-muted-foreground">
                              {link.modules.length} {t('features.common.featuresAndModules')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={
                            link.modules.some(module => getPermissionValue(link.id, module.id)) 
                              ? "default" 
                              : "secondary"
                          }>
                            {link.modules.filter(module => getPermissionValue(link.id, module.id)).length} / {link.modules.length} enabled
                          </Badge>
                          {expandedLinks.includes(link.id) ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </div>
                      </div>
                      
                      {expandedLinks.includes(link.id) && (
                        <div className="border-t bg-muted/20 p-4">
                          <div className="space-y-3">
                            {link.modules
                              .filter(module => {
                                if (searchTerm === '') return true
                                const translated = getFeatureTranslation(module.name, module.description)
                                return module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                       module.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                       translated.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                       translated.description.toLowerCase().includes(searchTerm.toLowerCase())
                              })
                              .map((module) => (
                              <div key={module.id} className="flex items-center justify-between p-3 bg-card rounded border">
                                <div className="flex items-center space-x-3">
                                  <div className={`w-2 h-2 rounded-full ${
                                    getPermissionValue(link.id, module.id) ? 'bg-green-500' : 'bg-muted-foreground'
                                  }`} />
                                  <div>
                                    <p className="font-medium text-sm text-foreground">{getFeatureTranslation(module.name, module.description).name}</p>
                                    <p className="text-xs text-muted-foreground">{getFeatureTranslation(module.name, module.description).description}</p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  {editMode ? (
                                    <Switch
                                      checked={getPermissionValue(link.id, module.id)}
                                      onCheckedChange={() => togglePermission(link.id, module.id)}
                                    />
                                  ) : (
                                    <>
                                      <Badge variant={getPermissionValue(link.id, module.id) ? "default" : "secondary"}>
                                        {getPermissionValue(link.id, module.id) ? t('features.common.enabled') : t('features.common.disabled')}
                                      </Badge>
                                      {getPermissionValue(link.id, module.id) ? (
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                      ) : (
                                        <X className="h-4 w-4 text-muted-foreground" />
                                      )}
                                    </>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* Summary Information */}
      <Card>
        <CardHeader>
          <CardTitle>{t('permissionSummary.title')}</CardTitle>
          <CardDescription>
            {t('permissionSummary.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-semibold">{t('permissionSummary.navigationStructure.title')}</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• <strong>{t('permissionSummary.navigationStructure.categoriesDescription')}</strong></li>
                <li>• <strong>{totalLinks} {t('permissionSummary.navigationStructure.navigationLinks')}:</strong> {t('permissionSummary.navigationStructure.linksDescription')}</li>
                <li>• <strong>{totalModules} {t('permissionSummary.navigationStructure.totalFeatures')}:</strong> {t('permissionSummary.navigationStructure.featuresDescription')}</li>
                <li>• <strong>{t('permissionSummary.navigationStructure.hierarchy')}:</strong> {t('permissionSummary.navigationStructure.hierarchyDescription')}</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">{t('permissionSummary.currentRoleAccess.title')}</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• <strong>{t('permissionSummary.currentRoleAccess.role')}:</strong> {availableRoles.find(r => r.value === selectedRole)?.label}</li>
                <li>• <strong>{t('permissionSummary.currentRoleAccess.enabledFeatures')}:</strong> {enabledModules} {t('permissionSummary.currentRoleAccess.of')} {totalModules}</li>
                <li>• <strong>{t('permissionSummary.currentRoleAccess.accessLevel')}:</strong> {Math.round((enabledModules / totalModules) * 100)}%</li>
                <li>• <strong>{t('permissionSummary.currentRoleAccess.status')}:</strong> {editMode ? 'Editing Mode Active' : t('permissionSummary.currentRoleAccess.viewOnlyMode')}</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
