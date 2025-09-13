"use client"

import { useState } from "react"
import { Users, Search, Plus, Filter, Download, Eye, Edit, Trash2, Phone, Mail, MapPin, Calendar, ShoppingCart, DollarSign, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CustomerPurchaseFlow } from "@/components/customer-purchase-flow"
import type { OnboardingData } from "@/components/onboarding-flow"

// Mock customer data
const customers = [
  {
    id: 1,
    name: "Emma Thompson",
    email: "emma.thompson@email.com",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    joinDate: "2024-01-15",
    status: "active" as const,
    tier: "VIP" as const,
    totalOrders: 12,
    totalSpent: 2890.50,
    lastOrderDate: "2025-09-10",
    preferredProducts: ["Wellness Pack", "Beauty Series"],
    notes: "Prefers organic products. Always orders monthly.",
  },
  {
    id: 2,
    name: "Michael Rodriguez",
    email: "m.rodriguez@email.com",
    phone: "+1 (555) 234-5678",
    location: "Los Angeles, CA",
    joinDate: "2024-03-22",
    status: "active" as const,
    tier: "Gold" as const,
    totalOrders: 8,
    totalSpent: 1560.25,
    lastOrderDate: "2025-09-08",
    preferredProducts: ["Fitness Line", "Supplements"],
    notes: "Bulk buyer, usually orders quarterly.",
  },
  {
    id: 3,
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    phone: "+1 (555) 345-6789",
    location: "Chicago, IL",
    joinDate: "2024-02-10",
    status: "inactive" as const,
    tier: "Standard" as const,
    totalOrders: 4,
    totalSpent: 680.75,
    lastOrderDate: "2025-07-15",
    preferredProducts: ["Skincare", "Wellness Pack"],
    notes: "Interested in new product launches. Send updates.",
  },
  {
    id: 4,
    name: "David Chen",
    email: "david.chen@email.com",
    phone: "+1 (555) 456-7890",
    location: "Austin, TX",
    joinDate: "2024-05-05",
    status: "active" as const,
    tier: "VIP" as const,
    totalOrders: 15,
    totalSpent: 3420.80,
    lastOrderDate: "2025-09-12",
    preferredProducts: ["Complete Bundle", "Premium Series"],
    notes: "High-value customer. Excellent referral source.",
  },
  {
    id: 5,
    name: "Lisa Anderson",
    email: "lisa.anderson@email.com",
    phone: "+1 (555) 567-8901",
    location: "Miami, FL",
    joinDate: "2024-04-18",
    status: "prospect" as const,
    tier: "Standard" as const,
    totalOrders: 1,
    totalSpent: 120.00,
    lastOrderDate: "2025-08-20",
    preferredProducts: ["Trial Pack"],
    notes: "New customer, follow up for feedback.",
  },
]

const stats = [
  { label: "Total Customers", value: "247", change: "+12", icon: Users },
  { label: "Active Customers", value: "189", change: "+8", icon: Users },
  { label: "Avg. Order Value", value: "$156.80", change: "+$12.30", icon: DollarSign },
  { label: "Customer Lifetime Value", value: "$1,890", change: "+$145", icon: ShoppingCart },
]

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [tierFilter, setTierFilter] = useState("all")
  const [viewMode, setViewMode] = useState<"table" | "cards">("table")
  const [purchaseFlowCustomer, setPurchaseFlowCustomer] = useState<typeof customers[0] | null>(null)

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || customer.status === statusFilter
    const matchesTier = tierFilter === "all" || customer.tier === tierFilter
    
    return matchesSearch && matchesStatus && matchesTier
  })

  const handlePurchaseComplete = (orderData: OnboardingData & { customerId: string }) => {
    console.log("Order completed:", orderData)
    // Here you would typically save the order to your backend
    setPurchaseFlowCustomer(null)
    // Show success message or redirect
  }

  const handlePurchaseCancel = () => {
    setPurchaseFlowCustomer(null)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "default"
      case "inactive": return "secondary"
      case "prospect": return "outline"
      default: return "secondary"
    }
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "VIP": return "bg-purple-100 text-purple-800"
      case "Gold": return "bg-yellow-100 text-yellow-800"
      case "Standard": return "bg-gray-100 text-gray-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const CustomerCard = ({ customer }: { customer: typeof customers[0] }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${customer.name}`} />
              <AvatarFallback>{customer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{customer.name}</CardTitle>
              <CardDescription>{customer.email}</CardDescription>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-1">
            <Badge variant={getStatusColor(customer.status) as any}>
              {customer.status}
            </Badge>
            <Badge className={getTierColor(customer.tier)}>
              {customer.tier}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{customer.phone}</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{customer.location}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Total Orders</p>
            <p className="text-lg font-semibold">{customer.totalOrders}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Spent</p>
            <p className="text-lg font-semibold">{formatCurrency(customer.totalSpent)}</p>
          </div>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Preferred Products</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {customer.preferredProducts.map((product, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {product}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-sm text-muted-foreground">
            Last order: {formatDate(customer.lastOrderDate)}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button 
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0"
              >
                <span className="sr-only">Open menu</span>
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z" fill="currentColor"/>
                </svg>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 z-50">
              <DropdownMenuItem 
                className="cursor-pointer"
                onSelect={() => {
                  setPurchaseFlowCustomer(customer)
                }}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                New Order
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Edit className="h-4 w-4 mr-2" />
                Edit Customer
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600 cursor-pointer">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customer Management</h1>
          <p className="text-muted-foreground">
            Manage your customer relationships and track their journey
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Customer
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{stat.change}</span> this month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative w-72">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="prospect">Prospect</SelectItem>
            </SelectContent>
          </Select>

          <Select value={tierFilter} onValueChange={setTierFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Tier" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tiers</SelectItem>
              <SelectItem value="VIP">VIP</SelectItem>
              <SelectItem value="Gold">Gold</SelectItem>
              <SelectItem value="Standard">Standard</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "table" | "cards")}>
          <TabsList>
            <TabsTrigger value="table">Table</TabsTrigger>
            <TabsTrigger value="cards">Cards</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Customer List */}
      <Tabs value={viewMode} className="space-y-6">
        <TabsContent value="table">
          <Card>
            <CardHeader>
              <CardTitle>Customers ({filteredCustomers.length})</CardTitle>
              <CardDescription>
                Manage and track your customer relationships
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tier</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Total Spent</TableHead>
                    <TableHead>Last Order</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${customer.name}`} />
                            <AvatarFallback>{customer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{customer.name}</div>
                            <div className="text-sm text-muted-foreground">{customer.location}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm">{customer.email}</div>
                          <div className="text-sm text-muted-foreground">{customer.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(customer.status) as any}>
                          {customer.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getTierColor(customer.tier)}>
                          {customer.tier}
                        </Badge>
                      </TableCell>
                      <TableCell>{customer.totalOrders}</TableCell>
                      <TableCell>{formatCurrency(customer.totalSpent)}</TableCell>
                      <TableCell>{formatDate(customer.lastOrderDate)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button 
                              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0"
                            >
                              <span className="sr-only">Open menu</span>
                              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z" fill="currentColor"/>
                              </svg>
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 z-50">
                            <DropdownMenuItem 
                              className="cursor-pointer"
                              onSelect={() => {
                                setPurchaseFlowCustomer(customer)
                              }}
                            >
                              <CreditCard className="h-4 w-4 mr-2" />
                              New Order
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Customer
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                              <Mail className="h-4 w-4 mr-2" />
                              Send Email
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600 cursor-pointer">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cards">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCustomers.map((customer) => (
              <CustomerCard key={customer.id} customer={customer} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Purchase Flow Dialog */}
      {purchaseFlowCustomer && (
        <Dialog open={!!purchaseFlowCustomer} onOpenChange={() => setPurchaseFlowCustomer(null)}>
          <DialogContent className="max-w-7xl max-h-[90vh] overflow-auto">
            <CustomerPurchaseFlow
              customer={purchaseFlowCustomer}
              onComplete={handlePurchaseComplete}
              onCancel={handlePurchaseCancel}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
