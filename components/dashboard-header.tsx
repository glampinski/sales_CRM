"use client"

import { Bell, Search, Settings, User, LogOut, Users, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useAuth } from "@/contexts/AuthContext"
import { usePermissions } from "@/contexts/PermissionContext-simple"
import Image from "next/image"

// Mock users for role switching (development only)
const TEST_USERS = [
  { id: '1', name: 'Super Admin', email: 'superadmin@glampinski.com', role: 'super_admin' },
  { id: '2', name: 'Department Head', email: 'admin@glampinski.com', role: 'admin' },
  { id: '3', name: 'Department Employee', email: 'manager@glampinski.com', role: 'manager' },
  { id: '4', name: 'John Customer', email: 'customer@example.com', role: 'customer' },
  { id: '5', name: 'Jane Affiliate', email: 'affiliate@glampinski.com', role: 'affiliate' }
]

export function DashboardHeader() {
  const { user, logout } = useAuth()
  const { canSearchAdvanced, canImpersonate } = usePermissions()

  const switchUser = (testUser: typeof TEST_USERS[0]) => {
    localStorage.setItem('auth_user', JSON.stringify({
      ...testUser,
      createdAt: '2024-01-01',
      lastLogin: new Date().toISOString()
    }))
    window.location.reload()
  }

  if (!user) return null

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4 sm:px-6">
        {/* Mobile hamburger menu and logo */}
        <div className="md:hidden flex items-center space-x-3 mr-auto">
          <SidebarTrigger className="p-3 hover:bg-gray-100 rounded-md transition-colors flex flex-col space-y-1.5">
            <div className="w-6 h-0.5 bg-gray-800 rounded"></div>
            <div className="w-6 h-0.5 bg-gray-800 rounded"></div>
            <div className="w-6 h-0.5 bg-gray-800 rounded"></div>
          </SidebarTrigger>
          <Image 
            src="/images/glampinski-logo.jpg" 
            alt="Glampinski Logo" 
            width={100} 
            height={100}
            className="object-contain mix-blend-multiply bg-transparent"
            style={{ filter: 'drop-shadow(0 0 0 transparent)' }}
          />
        </div>
        
        {/* Desktop Search */}
        <div className="hidden md:flex items-center space-x-2 sm:space-x-4 lg:space-x-6">
          <div className="relative w-48 md:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={canSearchAdvanced ? "Search contacts, tasks..." : "Search products..."}
              className="pl-8 text-sm"
            />
          </div>
        </div>
        
        {/* Right side */}
        <div className="ml-auto flex items-center space-x-2 sm:space-x-4">
          {/* Mobile Search */}
          <div className="md:hidden relative w-32">
            <Search className="absolute left-2 top-2.5 h-3 w-3 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-7 text-xs h-8"
            />
          </div>
          
          {/* Notifications - Only for non-customers */}
          {canSearchAdvanced && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-4 w-4" />
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 text-xs flex items-center justify-center p-0"
                  >
                    3
                  </Badge>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="space-y-2 p-2">
                  <div className="text-sm space-y-1">
                    <p className="font-medium">New lead assigned</p>
                    <p className="text-muted-foreground">Sarah Johnson has been assigned to you</p>
                    <p className="text-xs text-muted-foreground">2 minutes ago</p>
                  </div>
                  <DropdownMenuSeparator />
                  <div className="text-sm space-y-1">
                    <p className="font-medium">Commission calculated</p>
                    <p className="text-muted-foreground">Your September commission is ready</p>
                    <p className="text-xs text-muted-foreground">1 hour ago</p>
                  </div>
                  <DropdownMenuSeparator />
                  <div className="text-sm space-y-1">
                    <p className="font-medium">Rank advancement</p>
                    <p className="text-muted-foreground">You're 25% away from Gold rank</p>
                    <p className="text-xs text-muted-foreground">3 hours ago</p>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder-user.jpg" alt={user.name} />
                  <AvatarFallback>
                    {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground capitalize">
                    {user.role.replace('_', ' ')}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              
              {/* Development: User Role Switcher */}
              {canImpersonate && (
                <>
                  <DropdownMenuLabel className="text-xs text-muted-foreground">
                    Switch User Role (Dev)
                  </DropdownMenuLabel>
                  {TEST_USERS.map((testUser) => (
                    <DropdownMenuItem 
                      key={testUser.id}
                      onClick={() => switchUser(testUser)}
                      className={user.role === testUser.role ? "bg-accent" : ""}
                    >
                      <Users className="mr-2 h-4 w-4" />
                      <span>{testUser.name} ({testUser.role})</span>
                      {user.role === testUser.role && (
                        <Badge variant="secondary" className="ml-auto text-xs">Current</Badge>
                      )}
                    </DropdownMenuItem>
                  ))}
                </>
              )}
              <DropdownMenuSeparator />
              
              <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
