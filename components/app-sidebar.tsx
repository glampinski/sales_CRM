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
  Wallet,
  MessageSquare,
  BookOpen,
  Megaphone,
  HeadphonesIcon,
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
import { usePermissions } from "@/contexts/PermissionContext-simple"
import { ThemeToggle } from "@/components/theme-toggle"
import Image from "next/image"
import Link from "next/link"

// Navigation item type with permission requirement
type NavigationItem = {
  name: string
  href: string
  icon: any
  permission?: string
  module?: string
}

// Universal navigation - all possible links with permission requirements
const navigationItems = {
  main: [
    { name: "Dashboard", href: "/dashboard", icon: Home, permission: "dashboard.overview" },
    { name: "Contacts", href: "/dashboard/contacts", icon: Users, module: "contacts" },
    { name: "Tasks", href: "/dashboard/tasks", icon: CheckSquare, module: "tasks" },
    { name: "Pipeline", href: "/dashboard/pipeline", icon: TrendingUp, module: "pipeline" },
  ],
  network: [
    { name: "Genealogy", href: "/dashboard/genealogy", icon: Building2, module: "network" },
    { name: "Commission", href: "/dashboard/commission", icon: DollarSign, module: "commission" },
    { name: "Ranks", href: "/dashboard/ranks", icon: Crown, module: "ranks" },
    { name: "Affiliates", href: "/dashboard/affiliates", icon: Shield, module: "affiliates" },
  ],
  business: [
    { name: "Customers", href: "/dashboard/customers", icon: Users, module: "customers" },
    { name: "Products", href: "/dashboard/products", icon: Building2, module: "products" },
    { name: "Orders", href: "/dashboard/orders", icon: FileText, module: "orders" },
    { name: "Payments", href: "/dashboard/payments", icon: CreditCard, module: "payments" },
    { name: "Wallet", href: "/dashboard/wallet", icon: Wallet, module: "wallet" },
    { name: "Marketing", href: "/dashboard/marketing", icon: Megaphone, module: "marketing" },
    { name: "Reports", href: "/dashboard/reports", icon: PieChart, module: "reports" },
  ],
  system: [
    { name: "Training", href: "/dashboard/training", icon: BookOpen, module: "training" },
    { name: "Support", href: "/dashboard/support", icon: HeadphonesIcon, module: "support" },
    { name: "Communication", href: "/dashboard/communication", icon: MessageSquare, module: "communication" },
    { name: "User Management", href: "/dashboard/users", icon: UserCog, module: "admin" },
    { name: "Invitations", href: "/dashboard/invitations", icon: Bell, module: "admin" },
    { name: "Settings", href: "/dashboard/settings", icon: Settings, module: "settings" },
  ],
}

export function AppSidebar() {
  const { user, logout } = useAuth()
  const { hasModuleAccess, hasPermission } = usePermissions()
  
  if (!user) return null

  // Filter navigation items based on permissions
  const getFilteredItems = (items: NavigationItem[]) => {
    return items.filter(item => {
      if (item.permission) {
        return hasPermission(item.permission)
      }
      if (item.module) {
        return hasModuleAccess(item.module)
      }
      return true // Show items without specific permission requirements
    })
  }

  const filteredNavigation = {
    main: getFilteredItems(navigationItems.main),
    network: getFilteredItems(navigationItems.network),
    business: getFilteredItems(navigationItems.business),
    system: getFilteredItems(navigationItems.system),
  }

  return (
    <Sidebar>
      <SidebarHeader>
        {/* Desktop logo - hidden on mobile */}
        <div className="hidden md:flex items-start justify-between p-0">
          <Image 
            src="/images/glampinski-logo.jpg" 
            alt="Glampinski Logo" 
            width={160} 
            height={160}
            className="object-contain mix-blend-multiply bg-transparent"
            style={{ filter: 'drop-shadow(0 0 0 transparent)' }}
          />
          <div className="mt-2">
            <ThemeToggle />
          </div>
        </div>
        {/* Mobile logo - larger, centered, visible only on mobile */}
        <div className="md:hidden flex items-center justify-between px-2 py-2">
          <Image 
            src="/images/glampinski-logo.jpg" 
            alt="Glampinski Logo" 
            width={120} 
            height={120}
            className="object-contain mix-blend-multiply bg-transparent"
            style={{ filter: 'drop-shadow(0 0 0 transparent)' }}
          />
          <ThemeToggle />
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Main Navigation */}
        {filteredNavigation.main.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Main</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredNavigation.main.map((item) => (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild>
                      <Link href={item.href} className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Network Features */}
        {filteredNavigation.network.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Network</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredNavigation.network.map((item) => (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild>
                      <Link href={item.href} className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Business Features */}
        {filteredNavigation.business.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Business</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredNavigation.business.map((item) => (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild>
                      <Link href={item.href} className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* System Features */}
        {filteredNavigation.system.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>System</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredNavigation.system.map((item) => (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild>
                      <Link href={item.href} className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter>
        <div className="px-4 py-2">
          <div className="flex items-center gap-3 mb-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar} />
              <AvatarFallback>
                {user.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={logout}
            className="w-full justify-start gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
