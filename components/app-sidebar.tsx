"use client"

import { 
  Users, 
  Building2, 
  Calendar, 
  CheckSquare, 
  CreditCard, 
  PieChart, 
  Settings, 
  Home,
  TrendingUp,
  Shield,
  FileText,
  Bell,
  Search,
  DollarSign,
  Crown,
  UserCog,
  LogOut,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/AuthContext"
import { usePermissions } from "@/contexts/PermissionContext"
import { PermissionGate } from "@/components/permission-gate"
import Image from "next/image"

// Navigation item type
type NavigationItem = {
  name: string
  href: string
  icon: any
}

// Role-based navigation configuration
const navigationConfig: Record<string, {
  main?: NavigationItem[]
  mlm?: NavigationItem[]
  business?: NavigationItem[]
  system?: NavigationItem[]
}> = {
  super_admin: {
    main: [
      { name: "Dashboard", href: "/dashboard", icon: Home },
      { name: "Contacts", href: "/dashboard/contacts", icon: Users },
      { name: "Tasks", href: "/dashboard/tasks", icon: CheckSquare },
      { name: "Pipeline", href: "/dashboard/pipeline", icon: TrendingUp },
    ],
    mlm: [
      { name: "Genealogy", href: "/dashboard/genealogy", icon: Building2 },
      { name: "Commission", href: "/dashboard/commission", icon: DollarSign },
      { name: "Ranks", href: "/dashboard/ranks", icon: Crown },
      { name: "Affiliates", href: "/dashboard/affiliates", icon: Shield },
    ],
    business: [
      { name: "Customers", href: "/dashboard/customers", icon: Users },
      { name: "Products", href: "/dashboard/products", icon: Building2 },
      { name: "Orders", href: "/dashboard/orders", icon: FileText },
      { name: "Payments", href: "/dashboard/payments", icon: CreditCard },
      { name: "Reports", href: "/dashboard/reports", icon: PieChart },
    ],
    system: [
      { name: "Super Admin", href: "/dashboard/super-admin", icon: Crown },
      { name: "Customer Management", href: "/dashboard/users", icon: UserCog },
      { name: "Settings", href: "/dashboard/settings", icon: Settings },
      { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
    ],
  },
  admin: {
    main: [
      { name: "Dashboard", href: "/dashboard", icon: Home },
      { name: "Contacts", href: "/dashboard/contacts", icon: Users },
      { name: "Tasks", href: "/dashboard/tasks", icon: CheckSquare },
      { name: "Pipeline", href: "/dashboard/pipeline", icon: TrendingUp },
    ],
    mlm: [
      { name: "Genealogy", href: "/dashboard/genealogy", icon: Building2 },
      { name: "Commission", href: "/dashboard/commission", icon: DollarSign },
      { name: "Ranks", href: "/dashboard/ranks", icon: Crown },
      { name: "Affiliates", href: "/dashboard/affiliates", icon: Shield },
    ],
    business: [
      { name: "Customers", href: "/dashboard/customers", icon: Users },
      { name: "Products", href: "/dashboard/products", icon: Building2 },
      { name: "Orders", href: "/dashboard/orders", icon: FileText },
      { name: "Payments", href: "/dashboard/payments", icon: CreditCard },
      { name: "Reports", href: "/dashboard/reports", icon: PieChart },
    ],
    system: [
      { name: "Settings", href: "/dashboard/settings", icon: Settings },
      { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
    ],
  },
  manager: {
    main: [
      { name: "Dashboard", href: "/dashboard", icon: Home },
      { name: "Contacts", href: "/dashboard/contacts", icon: Users },
      { name: "Tasks", href: "/dashboard/tasks", icon: CheckSquare },
      { name: "Pipeline", href: "/dashboard/pipeline", icon: TrendingUp },
    ],
    business: [
      { name: "Customers", href: "/dashboard/customers", icon: Users },
      { name: "Products", href: "/dashboard/products", icon: Building2 },
      { name: "Orders", href: "/dashboard/orders", icon: FileText },
      { name: "Reports", href: "/dashboard/reports", icon: PieChart },
    ],
    system: [
      { name: "Settings", href: "/dashboard/settings", icon: Settings },
    ],
  },
  affiliate: {
    main: [
      { name: "Dashboard", href: "/dashboard", icon: Home },
      { name: "My Network", href: "/dashboard/genealogy", icon: Building2 },
      { name: "Commission", href: "/dashboard/commission", icon: DollarSign },
    ],
    business: [
      { name: "Customers", href: "/dashboard/customers", icon: Users },
      { name: "Products", href: "/dashboard/products", icon: Building2 },
      { name: "Orders", href: "/dashboard/orders", icon: FileText },
    ],
    system: [
      { name: "Settings", href: "/dashboard/settings", icon: Settings },
    ],
  },
  user: {
    main: [
      { name: "Dashboard", href: "/dashboard", icon: Home },
      { name: "Products", href: "/dashboard/products", icon: Building2 },
      { name: "My Orders", href: "/dashboard/orders", icon: FileText },
    ],
    system: [
      { name: "Settings", href: "/dashboard/settings", icon: Settings },
    ],
  },
  salesperson: {
    main: [
      { name: "Dashboard", href: "/dashboard", icon: Home },
      { name: "Contacts", href: "/dashboard/contacts", icon: Users },
      { name: "Tasks", href: "/dashboard/tasks", icon: CheckSquare },
      { name: "Pipeline", href: "/dashboard/pipeline", icon: TrendingUp },
    ],
    mlm: [
      { name: "My Genealogy", href: "/dashboard/genealogy", icon: Building2 },
      { name: "My Commission", href: "/dashboard/commission", icon: DollarSign },
      { name: "My Rank", href: "/dashboard/ranks", icon: Crown },
    ],
    business: [
      { name: "My Customers", href: "/dashboard/customers", icon: Users },
      { name: "Products", href: "/dashboard/products", icon: Building2 },
      { name: "My Orders", href: "/dashboard/orders", icon: FileText },
    ],
    system: [
      { name: "Settings", href: "/dashboard/settings", icon: Settings },
    ],
  },
  customer: {
    main: [
      { name: "My Dashboard", href: "/dashboard", icon: Home },
      { name: "My Profile", href: "/dashboard/profile", icon: Users },
    ],
    business: [
      { name: "Browse Products", href: "/dashboard/products", icon: Building2 },
      { name: "My Orders", href: "/dashboard/orders", icon: FileText },
      { name: "My Payments", href: "/dashboard/payments", icon: CreditCard },
    ],
    system: [
      { name: "Settings", href: "/dashboard/settings", icon: Settings },
    ],
  },
}

export function AppSidebar() {
  const { user, logout } = useAuth()
  const { hasModuleAccess } = usePermissions()
  
  if (!user) return null
  
  const navigation = navigationConfig[user.role] || navigationConfig.customer

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-border">
        <div className="flex items-center gap-2 px-4 py-2">
          <Image 
            src="/images/glampinski-logo.jpg" 
            alt="Glampinski" 
            width={32} 
            height={32} 
            className="h-8 w-8 rounded"
          />
          <span className="font-semibold text-lg">
            {user.role === 'user' ? 'Glampinski' : 'MLM CRM'}
          </span>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        {/* Main Navigation */}
        {navigation.main && (
          <SidebarGroup>
            <SidebarGroupLabel>Main</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigation.main.map((item) => (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild>
                      <a href={item.href} className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        <span>{item.name}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* MLM Features */}
        {navigation.mlm && (
          <SidebarGroup>
            <SidebarGroupLabel>MLM</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigation.mlm.map((item) => (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild>
                      <a href={item.href} className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        <span>{item.name}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Business Features */}
        {navigation.business && (
          <SidebarGroup>
            <SidebarGroupLabel>Business</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigation.business.map((item) => (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild>
                      <a href={item.href} className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        <span>{item.name}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* System Features */}
        {navigation.system && (
          <SidebarGroup>
            <SidebarGroupLabel>System</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigation.system.map((item) => (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild>
                      <a href={item.href} className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        <span>{item.name}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-2 px-2 py-1">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>
                  {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                className="h-8 w-8"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
