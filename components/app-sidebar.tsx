"use client"

import { useTranslations } from 'next-intl'
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
import { useTheme } from "next-themes"
import Image from "next/image"
import Link from "next/link"

// Navigation item type with permission requirement
type NavigationItem = {
  nameKey: string  // Translation key instead of hardcoded name
  href: string
  icon: any
  permission?: string
  module?: string
}

// Universal navigation - all possible links with permission requirements
const navigationItems = {
  main: [
    { nameKey: "dashboard", href: "/dashboard", icon: Home, permission: "dashboard.overview" },
    { nameKey: "contacts", href: "/dashboard/contacts", icon: Users, module: "contacts" },
    { nameKey: "tasks", href: "/dashboard/tasks", icon: CheckSquare, module: "tasks" },
    { nameKey: "pipeline", href: "/dashboard/pipeline", icon: TrendingUp, module: "pipeline" },
  ],
  network: [
    { nameKey: "genealogy", href: "/dashboard/genealogy", icon: Building2, module: "network" },
    { nameKey: "commission", href: "/dashboard/commission", icon: DollarSign, module: "commission" },
    { nameKey: "ranks", href: "/dashboard/ranks", icon: Crown, module: "ranks" },
    { nameKey: "affiliates", href: "/dashboard/affiliates", icon: Shield, module: "affiliates" },
  ],
  business: [
    { nameKey: "customers", href: "/dashboard/customers", icon: Users, module: "customers" },
    { nameKey: "products", href: "/dashboard/products", icon: Building2, module: "products" },
    { nameKey: "orders", href: "/dashboard/orders", icon: FileText, module: "orders" },
    { nameKey: "payments", href: "/dashboard/payments", icon: CreditCard, module: "payments" },
    { nameKey: "wallet", href: "/dashboard/wallet", icon: Wallet, module: "wallet" },
    { nameKey: "marketing", href: "/dashboard/marketing", icon: Megaphone, module: "marketing" },
    { nameKey: "reports", href: "/dashboard/reports", icon: PieChart, module: "reports" },
  ],
  system: [
    { nameKey: "training", href: "/dashboard/training", icon: BookOpen, module: "training" },
    { nameKey: "support", href: "/dashboard/support", icon: HeadphonesIcon, module: "support" },
    { nameKey: "communication", href: "/dashboard/communication", icon: MessageSquare, module: "communication" },
    { nameKey: "userManagement", href: "/dashboard/users", icon: UserCog, module: "admin" },
    { nameKey: "invitations", href: "/dashboard/invitations", icon: Bell, module: "admin" },
    { nameKey: "settings", href: "/dashboard/settings", icon: Settings, module: "settings" },
  ],
}

export function AppSidebar() {
  const { user, logout } = useAuth()
  const { hasModuleAccess, hasPermission } = usePermissions()
  const { theme } = useTheme()
  const tNav = useTranslations('navigation')
  
  if (!user) return null

  // Determine logo source based on theme
  const logoSrc = theme === 'dark' ? '/Glampinski_logo_white.png' : '/images/glampinski-logo.jpg'

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
          <div className="flex items-center justify-center w-40 h-20">
            <Image 
              src={logoSrc}
              alt="Glampinski Logo" 
              width={160} 
              height={160}
              className={`object-contain bg-transparent max-w-full max-h-full ${theme === 'dark' ? '' : 'mix-blend-multiply'}`}
              style={{ filter: 'drop-shadow(0 0 0 transparent)' }}
            />
          </div>
          <div className="mt-2">
            <ThemeToggle />
          </div>
        </div>
        {/* Mobile logo - larger, centered, visible only on mobile */}
        <div className="md:hidden flex items-center justify-between px-2 py-2">
          <div className="flex items-center justify-center w-30 h-16">
            <Image 
              src={logoSrc}
              alt="Glampinski Logo" 
              width={120} 
              height={120}
              className={`object-contain bg-transparent max-w-full max-h-full ${theme === 'dark' ? '' : 'mix-blend-multiply'}`}
              style={{ filter: 'drop-shadow(0 0 0 transparent)' }}
            />
          </div>
          <ThemeToggle />
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Main Navigation */}
        {filteredNavigation.main.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>{tNav('groups.main')}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredNavigation.main.map((item) => (
                  <SidebarMenuItem key={item.nameKey}>
                    <SidebarMenuButton asChild>
                      <Link 
                        href={item.href} 
                        className="flex items-center gap-2 text-sidebar-foreground hover:text-sidebar-accent-foreground transition-colors"
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{tNav(`items.${item.nameKey}`)}</span>
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
            <SidebarGroupLabel>{tNav('groups.network')}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredNavigation.network.map((item) => (
                  <SidebarMenuItem key={item.nameKey}>
                    <SidebarMenuButton asChild>
                      <Link 
                        href={item.href} 
                        className="flex items-center gap-2 text-sidebar-foreground hover:text-sidebar-accent-foreground transition-colors"
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{tNav(`items.${item.nameKey}`)}</span>
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
            <SidebarGroupLabel>{tNav('groups.business')}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredNavigation.business.map((item) => (
                  <SidebarMenuItem key={item.nameKey}>
                    <SidebarMenuButton asChild>
                      <Link 
                        href={item.href} 
                        className="flex items-center gap-2 text-sidebar-foreground hover:text-sidebar-accent-foreground transition-colors"
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{tNav(`items.${item.nameKey}`)}</span>
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
            <SidebarGroupLabel>{tNav('groups.system')}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredNavigation.system.map((item) => (
                  <SidebarMenuItem key={item.nameKey}>
                    <SidebarMenuButton asChild>
                      <Link 
                        href={item.href} 
                        className="flex items-center gap-2 text-sidebar-foreground hover:text-sidebar-accent-foreground transition-colors"
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{tNav(`items.${item.nameKey}`)}</span>
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
            {tNav('items.signOut')}
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
