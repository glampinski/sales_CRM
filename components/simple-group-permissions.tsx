"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
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
  Eye,
  Search,
  Mail,
  ShoppingCart,
  Activity,
  Award,
  CheckCircle,
  Share2,
  UserPlus,
  Calculator,
  Upload,
  Download,
  Layout,
  Menu,
  Bug,
  BookOpen,
  Calendar,
  Target
} from "lucide-react"

// User Groups (simplified from roles)
export type UserGroup = 'super_admin' | 'admin' | 'manager' | 'affiliate' | 'customer'

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
  // Dashboard Pages (Main Routes)
  { id: 'dashboard_home', name: 'Dashboard Home', description: 'Main dashboard page', type: 'page', category: 'dashboard', icon: Home, path: '/dashboard' },
  { id: 'dashboard_contacts', name: 'Contacts Page', description: 'Contact management page', type: 'page', category: 'crm', icon: Users, path: '/dashboard/contacts' },
  { id: 'dashboard_tasks', name: 'Tasks Page', description: 'Task management page', type: 'page', category: 'crm', icon: CheckSquare, path: '/dashboard/tasks' },
  { id: 'dashboard_pipeline', name: 'Pipeline Page', description: 'Sales pipeline page', type: 'page', category: 'crm', icon: TrendingUp, path: '/dashboard/pipeline' },
  
  // MLM Pages
  { id: 'dashboard_genealogy', name: 'Genealogy Page', description: 'Team structure page', type: 'page', category: 'mlm', icon: Building2, path: '/dashboard/genealogy' },
  { id: 'dashboard_commission', name: 'Commission Page', description: 'Commission tracking', type: 'page', category: 'mlm', icon: DollarSign, path: '/dashboard/commission' },
  { id: 'dashboard_ranks', name: 'Ranks Page', description: 'MLM rank system', type: 'page', category: 'mlm', icon: Crown, path: '/dashboard/ranks' },
  { id: 'dashboard_affiliates', name: 'Affiliates Page', description: 'Affiliate management', type: 'page', category: 'mlm', icon: Shield, path: '/dashboard/affiliates' },
  
  // Business Pages
  { id: 'dashboard_customers', name: 'Customers Page', description: 'Customer management', type: 'page', category: 'business', icon: Users, path: '/dashboard/customers' },
  { id: 'dashboard_products', name: 'Products Page', description: 'Product catalog', type: 'page', category: 'business', icon: Building2, path: '/dashboard/products' },
  { id: 'dashboard_orders', name: 'Orders Page', description: 'Order management', type: 'page', category: 'business', icon: FileText, path: '/dashboard/orders' },
  { id: 'dashboard_payments', name: 'Payments Page', description: 'Payment processing', type: 'page', category: 'business', icon: CreditCard, path: '/dashboard/payments' },
  { id: 'dashboard_reports', name: 'Reports Page', description: 'Analytics and reports', type: 'page', category: 'business', icon: PieChart, path: '/dashboard/reports' },
  
  // System Pages
  { id: 'dashboard_users', name: 'User Management', description: 'User administration', type: 'page', category: 'system', icon: UserCog, path: '/dashboard/users' },
  { id: 'dashboard_settings', name: 'Settings Page', description: 'System settings', type: 'page', category: 'system', icon: Settings, path: '/dashboard/settings' },
  { id: 'dashboard_notifications', name: 'Notifications', description: 'System notifications', type: 'page', category: 'system', icon: Bell, path: '/dashboard/notifications' },
  
  // Additional Routes
  { id: 'dashboard_invitations', name: 'Invitations Page', description: 'Manage user invitations', type: 'page', category: 'system', icon: Mail, path: '/dashboard/invitations' },
  { id: 'dashboard_purchase', name: 'Purchase Page', description: 'Customer purchase flow', type: 'page', category: 'business', icon: ShoppingCart, path: '/dashboard/purchase' },

  // Dashboard Widgets & Components
  { id: 'widget_stats_overview', name: 'Statistics Cards', description: 'Key performance metrics', type: 'widget', category: 'dashboard', icon: BarChart3 },
  { id: 'widget_recent_contacts', name: 'Recent Contacts', description: 'Latest contact activity', type: 'widget', category: 'dashboard', icon: Users },
  { id: 'widget_recent_activity', name: 'Recent Activity', description: 'Latest system activities', type: 'widget', category: 'dashboard', icon: Activity },
  { id: 'widget_upcoming_tasks', name: 'Upcoming Tasks', description: 'Task reminders', type: 'widget', category: 'dashboard', icon: CheckSquare },
  { id: 'widget_rank_progress', name: 'Rank Progress', description: 'MLM rank advancement', type: 'widget', category: 'dashboard', icon: Crown },
  { id: 'widget_todays_tasks', name: 'Daily Tasks', description: 'Daily task list', type: 'widget', category: 'dashboard', icon: CheckSquare },
  { id: 'widget_commission_summary', name: 'Commission Summary', description: 'Earnings overview', type: 'widget', category: 'dashboard', icon: DollarSign },
  { id: 'widget_sales_pipeline', name: 'Sales Pipeline', description: 'Pipeline overview', type: 'widget', category: 'dashboard', icon: TrendingUp },
  { id: 'widget_notifications', name: 'Notifications', description: 'System alerts', type: 'widget', category: 'dashboard', icon: Bell },
  { id: 'widget_top_distributors', name: 'Top Distributors', description: 'Performance leaderboard', type: 'widget', category: 'dashboard', icon: Award },
  { id: 'widget_revenue_breakdown', name: 'Revenue Analytics', description: 'Revenue analysis charts', type: 'widget', category: 'dashboard', icon: BarChart3 },
  { id: 'widget_user_stats', name: 'User Statistics', description: 'User registration metrics', type: 'widget', category: 'dashboard', icon: Users },
  { id: 'widget_system_health', name: 'System Health', description: 'System status monitoring', type: 'widget', category: 'dashboard', icon: CheckCircle },

  // Management Components
  { id: 'component_customer_management', name: 'Customer Management Component', description: 'Full customer CRUD interface', type: 'feature', category: 'business', icon: Users },
  { id: 'component_order_management', name: 'Order Management Component', description: 'Full order CRUD interface', type: 'feature', category: 'business', icon: FileText },
  { id: 'component_affiliate_management', name: 'Affiliate Management Component', description: 'Full affiliate CRUD interface', type: 'feature', category: 'mlm', icon: Shield },
  { id: 'component_affiliate_management_new', name: 'New Affiliate Management', description: 'Enhanced affiliate interface', type: 'feature', category: 'mlm', icon: Shield },
  { id: 'component_commission_dashboard', name: 'Commission Dashboard', description: 'Detailed commission interface', type: 'feature', category: 'mlm', icon: DollarSign },
  { id: 'component_product_catalog', name: 'Product Catalog', description: 'Product browsing interface', type: 'feature', category: 'business', icon: Building2 },
  { id: 'component_super_admin_dashboard', name: 'Super Admin Dashboard', description: 'Administrative oversight interface', type: 'feature', category: 'system', icon: Crown },
  { id: 'component_referral_dashboard', name: 'Referral Dashboard', description: 'Referral program interface', type: 'feature', category: 'mlm', icon: Share2 },
  { id: 'component_invitation_management', name: 'Invitation Management', description: 'User invitation system', type: 'feature', category: 'system', icon: Mail },
  { id: 'component_contract_template_management', name: 'Contract Templates', description: 'Contract template system', type: 'feature', category: 'business', icon: FileText },
  { id: 'component_document_handling', name: 'Document Handling', description: 'Document management system', type: 'feature', category: 'business', icon: FileText },

  // Purchase & Onboarding
  { id: 'component_customer_purchase_flow', name: 'Customer Purchase Flow', description: 'Complete purchase process', type: 'feature', category: 'business', icon: ShoppingCart },
  { id: 'component_embedded_purchase_flow', name: 'Embedded Purchase Flow', description: 'In-app purchase interface', type: 'feature', category: 'business', icon: ShoppingCart },
  { id: 'component_internal_purchase_flow', name: 'Internal Purchase Flow', description: 'Staff-initiated purchases', type: 'feature', category: 'business', icon: ShoppingCart },
  { id: 'component_onboarding_flow', name: 'Onboarding Flow', description: 'New user onboarding', type: 'feature', category: 'system', icon: UserPlus },
  { id: 'component_quick_checkout', name: 'Quick Checkout', description: 'Simplified checkout process', type: 'feature', category: 'business', icon: CreditCard },

  // CRM Features
  { id: 'feature_contact_create', name: 'Create Contacts', description: 'Add new contacts', type: 'feature', category: 'crm', icon: Plus },
  { id: 'feature_contact_edit', name: 'Edit Contacts', description: 'Modify contact details', type: 'feature', category: 'crm', icon: Edit },
  { id: 'feature_contact_delete', name: 'Delete Contacts', description: 'Remove contacts', type: 'feature', category: 'crm', icon: Trash2 },
  { id: 'feature_contact_import', name: 'Import Contacts', description: 'Bulk contact import', type: 'feature', category: 'crm', icon: Upload },
  { id: 'feature_task_management', name: 'Task Management', description: 'Create and manage tasks', type: 'feature', category: 'crm', icon: CheckSquare },
  { id: 'feature_pipeline_management', name: 'Pipeline Management', description: 'Sales pipeline stages', type: 'feature', category: 'crm', icon: TrendingUp },

  // MLM Features
  { id: 'feature_commission_view', name: 'View Commission Details', description: 'See detailed commission breakdown', type: 'feature', category: 'mlm', icon: Eye },
  { id: 'feature_commission_calculate', name: 'Calculate Commissions', description: 'Process commission calculations', type: 'feature', category: 'mlm', icon: Calculator },
  { id: 'feature_genealogy_manage', name: 'Manage Genealogy', description: 'Modify team structure', type: 'feature', category: 'mlm', icon: Edit },
  { id: 'feature_genealogy_tree', name: 'Genealogy Tree View', description: 'Visual team hierarchy', type: 'feature', category: 'mlm', icon: Building2 },
  { id: 'feature_affiliate_performance', name: 'Affiliate Performance Tracking', description: 'Performance analytics', type: 'feature', category: 'mlm', icon: BarChart3 },
  { id: 'feature_team_hierarchy', name: 'Team Hierarchy Management', description: 'Organize team structure', type: 'feature', category: 'mlm', icon: Building2 },
  { id: 'feature_rank_advancement', name: 'Rank Advancement', description: 'MLM rank progression', type: 'feature', category: 'mlm', icon: Crown },

  // Business Features
  { id: 'feature_product_manage', name: 'Manage Products', description: 'Add/edit products', type: 'feature', category: 'business', icon: Edit },
  { id: 'feature_product_catalog', name: 'Product Catalog Management', description: 'Organize product listings', type: 'feature', category: 'business', icon: Building2 },
  { id: 'feature_order_process', name: 'Process Orders', description: 'Handle order processing', type: 'feature', category: 'business', icon: CheckSquare },
  { id: 'feature_order_tracking', name: 'Order Tracking', description: 'Track order status', type: 'feature', category: 'business', icon: Eye },
  { id: 'feature_payment_process', name: 'Process Payments', description: 'Handle payment processing', type: 'feature', category: 'business', icon: CreditCard },
  { id: 'feature_payment_methods', name: 'Payment Methods', description: 'Configure payment options', type: 'feature', category: 'business', icon: CreditCard },
  { id: 'feature_customer_profiles', name: 'Customer Profiles', description: 'Detailed customer views', type: 'feature', category: 'business', icon: Users },
  { id: 'feature_analytics_reports', name: 'Analytics & Reports', description: 'Business intelligence reports', type: 'feature', category: 'business', icon: PieChart },

  // System Features
  { id: 'feature_user_management', name: 'User Management', description: 'Create and manage users', type: 'feature', category: 'system', icon: UserCog },
  { id: 'feature_user_impersonate', name: 'User Impersonation', description: 'Login as other users', type: 'feature', category: 'system', icon: Eye },
  { id: 'feature_permission_management', name: 'Permission Management', description: 'Role and permission control', type: 'feature', category: 'system', icon: Shield },
  { id: 'feature_system_config', name: 'System Configuration', description: 'Configure system settings', type: 'feature', category: 'system', icon: Settings },
  { id: 'feature_notification_system', name: 'Notification System', description: 'System notifications', type: 'feature', category: 'system', icon: Bell },
  { id: 'feature_audit_logs', name: 'Audit Logs', description: 'System activity tracking', type: 'feature', category: 'system', icon: Eye },
  { id: 'feature_backup_restore', name: 'Backup & Restore', description: 'Data backup functionality', type: 'feature', category: 'system', icon: Download },

  // Additional Components
  { id: 'component_timeshare_catalog', name: 'Timeshare Property Catalog', description: 'Property listing interface', type: 'feature', category: 'business', icon: Building2 },
  { id: 'component_order_detail_view', name: 'Order Detail View', description: 'Detailed order information', type: 'feature', category: 'business', icon: Eye },
  { id: 'component_affiliate_profile', name: 'Affiliate Profile', description: 'Individual affiliate details', type: 'feature', category: 'mlm', icon: Users },
  { id: 'component_customer_profile', name: 'Customer Profile', description: 'Individual customer details', type: 'feature', category: 'business', icon: Users },
  { id: 'component_distributor_profile', name: 'Distributor Profile', description: 'Individual distributor details', type: 'feature', category: 'mlm', icon: Users },
  { id: 'component_compact_referral', name: 'Compact Referral Section', description: 'Condensed referral interface', type: 'feature', category: 'mlm', icon: Share2 },
  { id: 'component_share_selection', name: 'Share Selection', description: 'Investment share picker', type: 'feature', category: 'business', icon: Building2 },
  { id: 'component_payment_step', name: 'Payment Step', description: 'Payment process step', type: 'feature', category: 'business', icon: CreditCard },
  { id: 'component_confirmation_step', name: 'Confirmation Step', description: 'Transaction confirmation', type: 'feature', category: 'business', icon: CheckCircle },

  // Mobile & Navigation
  { id: 'component_app_sidebar', name: 'Application Sidebar', description: 'Main navigation sidebar', type: 'feature', category: 'system', icon: Menu },
  { id: 'component_dashboard_header', name: 'Dashboard Header', description: 'Main dashboard header', type: 'feature', category: 'system', icon: Layout },
  { id: 'component_impersonation_banner', name: 'Impersonation Banner', description: 'User impersonation indicator', type: 'feature', category: 'system', icon: Eye },
  { id: 'component_impersonation_controls', name: 'Impersonation Controls', description: 'Impersonation management', type: 'feature', category: 'system', icon: Settings },
  { id: 'component_debug_user_banner', name: 'Debug User Banner', description: 'Development debugging info', type: 'feature', category: 'system', icon: Bug },

  // Auth & Onboarding Components
  { id: 'component_invite_user_form', name: 'User Invitation Form', description: 'Send user invitations', type: 'feature', category: 'system', icon: Mail },
  { id: 'component_signup_form', name: 'Signup Form', description: 'User registration form', type: 'feature', category: 'system', icon: UserPlus },
  { id: 'component_onboarding_signup_step', name: 'Onboarding Signup Step', description: 'Registration during onboarding', type: 'feature', category: 'system', icon: UserPlus },

  // Performance Tracking
  { id: 'component_affiliate_performance_tracking', name: 'Affiliate Performance Tracking', description: 'Detailed performance metrics', type: 'feature', category: 'mlm', icon: BarChart3 },
  { id: 'component_distributor_performance_tracking', name: 'Distributor Performance Tracking', description: 'Distributor metrics', type: 'feature', category: 'mlm', icon: BarChart3 },
  { id: 'component_affiliate_analytics', name: 'Affiliate Analytics', description: 'Advanced affiliate analytics', type: 'feature', category: 'mlm', icon: PieChart },
  { id: 'component_referral_tracker', name: 'Referral Tracker', description: 'Track referral performance', type: 'feature', category: 'mlm', icon: Eye },

  // Additional Management
  { id: 'component_distributor_management', name: 'Distributor Management', description: 'Full distributor interface', type: 'feature', category: 'mlm', icon: Shield },
  { id: 'component_affiliate_actions', name: 'Affiliate Actions', description: 'Bulk affiliate operations', type: 'feature', category: 'mlm', icon: Settings },
  { id: 'component_affiliate_team_hierarchy', name: 'Affiliate Team Hierarchy', description: 'Team organization view', type: 'feature', category: 'mlm', icon: Building2 },
  { id: 'component_distributor_team_hierarchy', name: 'Distributor Team Hierarchy', description: 'Distributor team structure', type: 'feature', category: 'mlm', icon: Building2 },

  // NEW AFFILIATE COMPONENTS - Added to complete UI
  { id: 'component_wallet_dashboard', name: 'Wallet Dashboard', description: 'Financial management interface', type: 'feature', category: 'mlm', icon: CreditCard },
  { id: 'component_support_ticket_system', name: 'Support Ticket System', description: 'Help desk and support management', type: 'feature', category: 'system', icon: Shield },
  { id: 'component_internal_communication', name: 'Internal Communication', description: 'Team messaging and announcements', type: 'feature', category: 'system', icon: Mail },
  { id: 'component_training_center', name: 'Training & Learning Center', description: 'Course management and certifications', type: 'feature', category: 'system', icon: Award },
  { id: 'component_marketing_tools', name: 'Marketing Tools & Resources', description: 'Content creation and campaign management', type: 'feature', category: 'business', icon: Share2 },

  // New Financial Features
  { id: 'feature_wallet_balance_view', name: 'View Wallet Balance', description: 'Check account balance', type: 'feature', category: 'mlm', icon: Eye },
  { id: 'feature_transaction_history', name: 'Transaction History', description: 'View payment history', type: 'feature', category: 'mlm', icon: FileText },
  { id: 'feature_payout_request', name: 'Request Payouts', description: 'Submit payout requests', type: 'feature', category: 'mlm', icon: DollarSign },
  { id: 'feature_payment_method_management', name: 'Payment Method Management', description: 'Add/edit payment methods', type: 'feature', category: 'mlm', icon: CreditCard },

  // Support & Communication Features
  { id: 'feature_create_support_ticket', name: 'Create Support Tickets', description: 'Submit help requests', type: 'feature', category: 'system', icon: Plus },
  { id: 'feature_view_support_tickets', name: 'View Support Tickets', description: 'Access support history', type: 'feature', category: 'system', icon: Eye },
  { id: 'feature_internal_messaging', name: 'Internal Messaging', description: 'Team chat functionality', type: 'feature', category: 'system', icon: Mail },
  { id: 'feature_announcements', name: 'Company Announcements', description: 'View company updates', type: 'feature', category: 'system', icon: Bell },

  // Training & Learning Features
  { id: 'feature_course_access', name: 'Course Access', description: 'Access training courses', type: 'feature', category: 'system', icon: BookOpen },
  { id: 'feature_certification_tracking', name: 'Certification Tracking', description: 'Track certification progress', type: 'feature', category: 'system', icon: Award },
  { id: 'feature_live_event_registration', name: 'Live Event Registration', description: 'Register for webinars/workshops', type: 'feature', category: 'system', icon: Calendar },
  { id: 'feature_learning_analytics', name: 'Learning Analytics', description: 'View learning progress', type: 'feature', category: 'system', icon: BarChart3 },

  // Marketing & Content Features
  { id: 'feature_marketing_materials_access', name: 'Marketing Materials Access', description: 'Download marketing content', type: 'feature', category: 'business', icon: Download },
  { id: 'feature_social_media_posting', name: 'Social Media Posting', description: 'Create social media content', type: 'feature', category: 'business', icon: Share2 },
  { id: 'feature_campaign_management', name: 'Campaign Management', description: 'Manage marketing campaigns', type: 'feature', category: 'business', icon: Target },
  { id: 'feature_content_templates', name: 'Content Templates', description: 'Access content templates', type: 'feature', category: 'business', icon: FileText },
]

// Default permissions for each group
const DEFAULT_GROUP_PERMISSIONS: Record<UserGroup, Record<string, boolean>> = {
  super_admin: Object.fromEntries(SYSTEM_COMPONENTS.map(comp => [comp.id, true])), // Super Admins see everything
  
  admin: Object.fromEntries(SYSTEM_COMPONENTS.map(comp => [
    comp.id, 
    // Admins see everything except specific impersonation features
    comp.id !== 'feature_user_impersonate' && 
    comp.id !== 'component_impersonation_controls' &&
    comp.id !== 'component_impersonation_banner'
  ])), 
  
  manager: Object.fromEntries(SYSTEM_COMPONENTS.map(comp => [
    comp.id, 
    // Managers see business operations but not system administration
    comp.category !== 'system' || 
    comp.id === 'dashboard_settings' || // Allow basic settings access
    comp.id === 'feature_system_config' // Allow system configuration
  ])), 
  
  affiliate: Object.fromEntries(SYSTEM_COMPONENTS.map(comp => [
    comp.id,
    // Affiliates see dashboard, MLM features, and customer-facing business features
    comp.category === 'dashboard' || 
    comp.category === 'mlm' || 
    comp.category === 'crm' ||
    (comp.category === 'business' && (
      comp.id.startsWith('dashboard_products') || 
      comp.id.startsWith('dashboard_orders') ||
      comp.id.startsWith('dashboard_customers') ||
      comp.id.startsWith('widget_') ||
      comp.id.startsWith('component_product') ||
      comp.id.startsWith('component_customer') ||
      comp.id.startsWith('component_order') ||
      comp.id.startsWith('component_marketing') ||
      comp.id.startsWith('feature_customer') ||
      comp.id.startsWith('feature_product') ||
      comp.id.startsWith('feature_order') ||
      comp.id.startsWith('feature_marketing') ||
      comp.id.startsWith('feature_campaign') ||
      comp.id.startsWith('feature_social_media') ||
      comp.id.startsWith('feature_content')
    )) ||
    (comp.category === 'system' && (
      comp.id === 'dashboard_settings' ||
      comp.id.startsWith('component_support_ticket') ||
      comp.id.startsWith('component_internal_communication') ||
      comp.id.startsWith('component_training_center') ||
      comp.id.startsWith('feature_create_support') ||
      comp.id.startsWith('feature_view_support') ||
      comp.id.startsWith('feature_internal_messaging') ||
      comp.id.startsWith('feature_announcements') ||
      comp.id.startsWith('feature_course') ||
      comp.id.startsWith('feature_certification') ||
      comp.id.startsWith('feature_live_event') ||
      comp.id.startsWith('feature_learning')
    )) ||
    // All financial/wallet features for affiliates
    comp.id.startsWith('feature_wallet') ||
    comp.id.startsWith('feature_transaction') ||
    comp.id.startsWith('feature_payout') ||
    comp.id.startsWith('feature_payment_method')
  ])), 
  
  customer: Object.fromEntries(SYSTEM_COMPONENTS.map(comp => [
    comp.id,
    // Customers see only their own relevant features
    comp.id === 'dashboard_home' ||
    comp.id === 'dashboard_products' ||
    comp.id === 'dashboard_orders' ||
    comp.id === 'dashboard_payments' ||
    comp.id === 'dashboard_settings' ||
    comp.id.startsWith('widget_stats') ||
    comp.id.startsWith('widget_notifications') ||
    comp.id.startsWith('widget_recent_activity') ||
    comp.id.startsWith('component_product_catalog') ||
    comp.id.startsWith('component_customer_purchase') ||
    comp.id.startsWith('component_order_detail') ||
    comp.id.startsWith('feature_product') ||
    comp.id.startsWith('feature_order') && comp.id !== 'feature_order_process' // Can view but not process
  ])) 
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
  { id: 'super_admin', name: 'Super Administrators', description: 'Ultimate system access', color: 'bg-purple-100 text-purple-800', userCount: 1, isDefault: true },
  { id: 'admin', name: 'Administrators', description: 'Full system access', color: 'bg-red-100 text-red-800', userCount: 3, isDefault: true },
  { id: 'manager', name: 'Managers', description: 'Business management access', color: 'bg-blue-100 text-blue-800', userCount: 12, isDefault: true },
  { id: 'affiliate', name: 'Affiliates', description: 'MLM network members', color: 'bg-green-100 text-green-800', userCount: 847, isDefault: true },
  { id: 'customer', name: 'Customers', description: 'Product purchasers', color: 'bg-gray-100 text-gray-800', userCount: 2156, isDefault: true }
]

export function SimpleGroupPermissions() {
  const [groups, setGroups] = useState<UserGroupConfig[]>(DEFAULT_GROUPS)
  const [permissions, setPermissions] = useState<Record<string, Record<string, boolean>>>(
    Object.fromEntries(DEFAULT_GROUPS.map(g => [g.id, DEFAULT_GROUP_PERMISSIONS[g.id as UserGroup] || {}]))
  )
  const [isCreatingGroup, setIsCreatingGroup] = useState(false)
  const [newGroupName, setNewGroupName] = useState('')
  const [newGroupDescription, setNewGroupDescription] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const togglePermission = (groupId: string, componentId: string) => {
    setPermissions(prev => ({
      ...prev,
      [groupId]: {
        ...prev[groupId],
        [componentId]: !prev[groupId]?.[componentId]
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
  }

  const deleteGroup = (groupId: string) => {
    if (DEFAULT_GROUPS.find(g => g.id === groupId)) return // Can't delete default groups
    
    setGroups(prev => prev.filter(g => g.id !== groupId))
    setPermissions(prev => {
      const newPerms = { ...prev }
      delete newPerms[groupId]
      return newPerms
    })
  }

  const copyPermissionsFrom = (fromGroupId: string, toGroupId: string) => {
    setPermissions(prev => ({
      ...prev,
      [toGroupId]: { ...prev[fromGroupId] }
    }))
  }

  const toggleAllPermissionsForGroup = (groupId: string, enabled: boolean) => {
    const filteredComponents = SYSTEM_COMPONENTS.filter(comp => 
      (selectedCategory === 'all' || comp.category === selectedCategory) &&
      (searchTerm === '' || comp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
       comp.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    
    setPermissions(prev => ({
      ...prev,
      [groupId]: {
        ...prev[groupId],
        ...Object.fromEntries(filteredComponents.map(comp => [comp.id, enabled]))
      }
    }))
  }

  const getEnabledCount = (groupId: string) => {
    const filteredComponents = SYSTEM_COMPONENTS.filter(comp => 
      (selectedCategory === 'all' || comp.category === selectedCategory) &&
      (searchTerm === '' || comp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
       comp.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    return filteredComponents.filter(comp => permissions[groupId]?.[comp.id]).length
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Permissions & Features Management</h2>
          <p className="text-muted-foreground">
            Control role-based access to features and permissions across your CRM
          </p>
        </div>
        <Button onClick={() => setIsCreatingGroup(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Group
        </Button>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search features..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Categories</option>
          <option value="dashboard">Dashboard</option>
          <option value="crm">CRM</option>
          <option value="mlm">MLM System</option>
          <option value="business">Business</option>
          <option value="system">System</option>
        </select>
      </div>

      {/* Feature Matrix Table */}
      <Card>
        <CardHeader>
          <CardTitle>Feature Access Matrix</CardTitle>
          <CardDescription>
            Quickly enable or disable features for each role. Super Admin access cannot be modified.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">
                    <div className="flex items-center gap-2">
                      Feature
                      <Badge variant="outline" className="text-xs">
                        {SYSTEM_COMPONENTS.filter(comp => 
                          (selectedCategory === 'all' || comp.category === selectedCategory) &&
                          (searchTerm === '' || comp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           comp.description.toLowerCase().includes(searchTerm.toLowerCase()))
                        ).length} items
                      </Badge>
                    </div>
                  </th>
                  {groups.map(group => (
                    <th key={group.id} className="text-center py-3 px-4 font-medium min-w-24">
                      <div className="flex flex-col items-center gap-2">
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-sm">{group.name}</span>
                          <Badge className={`text-xs ${group.color}`}>
                            {group.userCount} users
                          </Badge>
                        </div>
                        {group.id !== 'super_admin' && (
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleAllPermissionsForGroup(group.id, true)}
                              className="h-6 px-2 text-xs"
                            >
                              All
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleAllPermissionsForGroup(group.id, false)}
                              className="h-6 px-2 text-xs"
                            >
                              None
                            </Button>
                          </div>
                        )}
                        <Badge variant="secondary" className="text-xs">
                          {getEnabledCount(group.id)} enabled
                        </Badge>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SYSTEM_COMPONENTS
                  .filter(comp => 
                    (selectedCategory === 'all' || comp.category === selectedCategory) &&
                    (searchTerm === '' || comp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                     comp.description.toLowerCase().includes(searchTerm.toLowerCase()))
                  )
                  .map(component => (
                    <tr key={component.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <component.icon className="w-4 h-4 text-gray-500" />
                          <div>
                            <div className="font-medium text-sm">{component.name}</div>
                            <div className="text-xs text-gray-500">{component.description}</div>
                            <div className="flex gap-1 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {component.type}
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                {component.category}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </td>
                      {groups.map(group => {
                        const isEnabled = permissions[group.id]?.[component.id] || false
                        const isDisabled = group.id === 'super_admin'
                        return (
                          <td key={group.id} className="py-3 px-4 text-center">
                            <div className="flex flex-col items-center gap-2">
                              <Switch
                                checked={isEnabled}
                                onCheckedChange={(checked) => {
                                  if (!isDisabled) {
                                    togglePermission(group.id, component.id)
                                  }
                                }}
                                disabled={isDisabled}
                              />
                              {isEnabled && (
                                <Badge variant={isDisabled ? "default" : "secondary"} className="text-xs">
                                  {isDisabled ? "Always On" : "Enabled"}
                                </Badge>
                              )}
                            </div>
                          </td>
                        )
                      })}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

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
