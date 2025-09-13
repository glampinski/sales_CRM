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
  Search
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
import Image from "next/image"

// Navigation items
const navigation = {
  main: [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Contacts", href: "/dashboard/contacts", icon: Users },
    { name: "Tasks", href: "/dashboard/tasks", icon: CheckSquare },
    { name: "Pipeline", href: "/dashboard/pipeline", icon: TrendingUp },
  ],
  mlm: [
    { name: "Genealogy", href: "/dashboard/genealogy", icon: Building2 },
    { name: "Commission", href: "/dashboard/commission", icon: CreditCard },
    { name: "Distributors", href: "/dashboard/distributors", icon: Users },
    { name: "Ranks", href: "/dashboard/ranks", icon: Shield },
  ],
  business: [
    { name: "Customers", href: "/dashboard/customers", icon: Users },
    { name: "Orders", href: "/dashboard/orders", icon: FileText },
    { name: "Products", href: "/dashboard/products", icon: Building2 },
    { name: "Reports", href: "/dashboard/reports", icon: PieChart },
  ],
  system: [
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
    { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
  ],
}

export function AppSidebar() {
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
          <span className="font-semibold text-lg">MLM CRM</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        {/* Main Navigation */}
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

        {/* MLM Features */}
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

        {/* Business */}
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

        {/* System */}
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
      </SidebarContent>

      <SidebarFooter className="border-t border-border">
        <div className="flex items-center gap-2 px-4 py-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder-user.jpg" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">John Doe</p>
            <p className="text-xs text-muted-foreground truncate">Diamond Distributor</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
