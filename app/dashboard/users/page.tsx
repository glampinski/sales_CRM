"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { useAuth } from "@/contexts/AuthContext"
import { usePermissions } from "@/contexts/PermissionContext-simple"
import { InviteUserForm } from "@/components/invite-user-form"
import { InvitationManagement } from "@/components/invitation-management"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserPlus, Search, Shield, UserCog, Trash2, Edit, CheckSquare, X, MoreHorizontal, Eye, Mail } from "lucide-react"
import { useForm } from "react-hook-form"
import { UserRole } from "@/types/auth"

// Mock users data
const mockUsers = [
  {
    id: 1,
    name: "Super Admin",
    email: "superadmin@glampinski.com",
    role: "super_admin" as UserRole,
    status: "Active",
    lastLogin: "2024-01-20 10:30 AM",
    createdAt: "2023-01-15"
  },
  {
    id: 2,
    name: "Admin User",
    email: "admin@glampinski.com",
    role: "admin" as UserRole,
    status: "Active",
    lastLogin: "2024-01-20 09:15 AM",
    createdAt: "2023-03-20"
  },
  {
    id: 3,
    name: "Manager User",
    email: "manager@glampinski.com",
    role: "manager" as UserRole,
    status: "Active",
    lastLogin: "2024-01-19 04:45 PM",
    createdAt: "2023-06-10"
  },
  {
    id: 4,
    name: "Customer User",
    email: "customer@example.com",
    role: "customer" as UserRole,
    status: "Active",
    lastLogin: "2024-01-20 02:20 PM",
    createdAt: "2023-08-15"
  },
  {
    id: 5,
    name: "Jane Affiliate",
    email: "affiliate@glampinski.com",
    role: "affiliate" as UserRole,
    status: "Active",
    lastLogin: "2024-01-15 11:30 AM",
    createdAt: "2023-09-22"
  }
]

const roleColors = {
  super_admin: "destructive",
  admin: "default",
  manager: "secondary",
  affiliate: "outline",
  customer: "outline"
} as const

export default function UsersPage() {
  const { canImpersonate, startImpersonation } = useAuth()
  const { canManageUsers } = usePermissions()
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [users, setUsers] = useState(mockUsers)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleInvitationSent = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-dropdown-container]')) {
        setOpenDropdown(null);
      }
    };

    const handleCloseDropdowns = () => {
      setOpenDropdown(null);
    };

    document.addEventListener('click', handleClickOutside);
    document.addEventListener('closeDropdowns', handleCloseDropdowns);
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('closeDropdowns', handleCloseDropdowns);
    };
  }, []);

  const toggleDropdown = (userId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    // Ensure no focus issues
    (event.target as HTMLElement).blur();
    setOpenDropdown(openDropdown === userId ? null : userId);
  };

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      role: "customer" as UserRole,
      password: ""
    }
  })

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    return matchesSearch && matchesRole
  })

  const handleCreateUser = (data: any) => {
    const newUser = {
      id: users.length + 1,
      name: data.name,
      email: data.email,
      role: data.role,
      status: "Active",
      lastLogin: "Never",
      createdAt: new Date().toISOString().split('T')[0]
    }
    setUsers([...users, newUser])
    setIsCreateDialogOpen(false)
    form.reset()
  }

  const handleToggleStatus = (userId: number) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === "Active" ? "Inactive" : "Active" }
        : user
    ))
  }

  const handleDeleteUser = (userId: number) => {
    setUsers(users.filter(user => user.id !== userId))
  }

  const handleImpersonate = (userId: number) => {
    const success = startImpersonation(userId.toString())
    if (success) {
      // Redirect to dashboard to show impersonated view
      window.location.href = '/dashboard'
    }
  }

  return (
    <ProtectedRoute 
      
      fallback={
        <div className="p-6">
          <div className="text-center">
            <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4">Super Admin Access Required</h1>
            <p className="text-muted-foreground">Only super administrators can manage users.</p>
          </div>
        </div>
      }
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">User Management</h1>
            <p className="text-muted-foreground">Manage user accounts, permissions, and send invitations</p>
          </div>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <UserCog className="h-4 w-4" />
              Manage Users
            </TabsTrigger>
            <TabsTrigger value="invite" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Send Invitations
            </TabsTrigger>
            <TabsTrigger value="invitations" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Manage Invitations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Active Users</h2>
                <p className="text-muted-foreground">Manage existing user accounts</p>
              </div>
              
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add User Directly
                  </Button>
                </DialogTrigger>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New User</DialogTitle>
                <DialogDescription>
                  Add a new user to the system with appropriate role and permissions.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleCreateUser)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="john@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="customer">Customer</SelectItem>
                            <SelectItem value="affiliate">Affiliate</SelectItem>
                            <SelectItem value="manager">Manager</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="super_admin">Super Admin</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end space-x-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsCreateDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Create User</Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <UserCog className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
              <p className="text-xs text-muted-foreground">
                Active system users
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Admins</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {users.filter(u => u.role === 'super_admin' || u.role === 'admin').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Administrative users
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Managers & Affiliates</CardTitle>
              <UserCog className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {users.filter(u => u.role === 'manager' || u.role === 'affiliate').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Sales team members
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Customers</CardTitle>
              <UserCog className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {users.filter(u => u.role === 'customer').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Customer accounts
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="super_admin">Super Admin</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="affiliate">Affiliate</SelectItem>
              <SelectItem value="customer">Customer</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/placeholder-user.jpg" />
                          <AvatarFallback>
                            {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={roleColors[user.role] as any}
                        className="capitalize"
                      >
                        {user.role.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={user.status === 'Active' ? 'default' : 'secondary'}
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{user.lastLogin}</TableCell>
                    <TableCell className="text-sm">{user.createdAt}</TableCell>
                    <TableCell>
                      <div className="relative" data-dropdown-container>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => toggleDropdown(user.id.toString(), e)}
                          className="focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                          onBlur={() => {
                            // Small delay to allow click to register before closing
                            setTimeout(() => {
                              if (document.activeElement?.tagName !== 'BUTTON') {
                                setOpenDropdown(null);
                              }
                            }, 150);
                          }}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                        {openDropdown === user.id.toString() && (
                          <div 
                            className="absolute right-0 top-8 bg-white border rounded-md shadow-lg p-1 min-w-[200px] z-50"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="px-2 py-1.5 text-sm font-medium text-gray-700 border-b">Actions</div>
                            <button 
                              className="w-full text-left px-2 py-1.5 text-sm hover:bg-gray-100 rounded flex items-center"
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenDropdown(null);
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit User
                            </button>
                            <button 
                              className="w-full text-left px-2 py-1.5 text-sm hover:bg-gray-100 rounded flex items-center"
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenDropdown(null);
                                handleToggleStatus(user.id);
                              }}
                            >
                              {user.status === 'Active' ? (
                                <>
                                  <X className="mr-2 h-4 w-4" />
                                  Deactivate
                                </>
                              ) : (
                                <>
                                  <CheckSquare className="mr-2 h-4 w-4" />
                                  Activate
                                </>
                              )}
                            </button>
                            {canImpersonate() && user.role !== 'super_admin' && (
                              <>
                                <div className="border-t my-1"></div>
                                <button 
                                  className="w-full text-left px-2 py-1.5 text-sm hover:bg-gray-100 rounded flex items-center text-orange-600"
                                  onClick={(e) => {
                                    e.stopPropagation(); 
                                    setOpenDropdown(null);
                                    handleImpersonate(user.id);
                                  }}
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  Impersonate User
                                </button>
                              </>
                            )}
                            <div className="border-t my-1"></div>
                            <button 
                              className="w-full text-left px-2 py-1.5 text-sm hover:bg-gray-100 rounded flex items-center text-red-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenDropdown(null);
                                if (user.role !== 'super_admin') {
                                  handleDeleteUser(user.id);
                                }
                              }}
                              disabled={user.role === 'super_admin' || !canManageUsers}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete User
                            </button>
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
          </TabsContent>

          <TabsContent value="invite" className="space-y-6">
            <div className="max-w-2xl">
              <InviteUserForm onInvitationSent={handleInvitationSent} />
            </div>
          </TabsContent>

          <TabsContent value="invitations" className="space-y-6">
            <InvitationManagement refreshTrigger={refreshTrigger} />
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  )
}
