"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Package, 
  Search, 
  Filter, 
  Eye, 
  MoreHorizontal,
  CreditCard,
  Truck,
  Calendar,
  DollarSign,
  Download,
  RefreshCw,
  CheckCircle,
  Clock,
  AlertCircle,
  Target,
  Plus,
  Bitcoin,
  Wallet,
  TrendingUp,
  Building2
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { OrderDetailView } from "./order-detail-view"

interface OrderItem {
  name: string
  quantity: number
  price: number
  pv: number
}

interface Order {
  id: string
  customer: {
    id: string
    name: string
    email: string
    avatar: string
  }
  orderDate: string
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  paymentStatus: "pending" | "paid" | "failed" | "refunded"
  paymentMethod: "bank_transfer" | "crypto" | "bitcoin"
  items: OrderItem[]
  subtotal: number
  tax: number
  shipping: number
  total: number
  totalPV: number
  shippingAddress: string
  trackingNumber: string | null
  commission: number
  shareLevel: "full" | "half" | "quarter" | "eighth"
  propertyName: string
  usageDays: number
}

// Mock data for demonstration
const mockOrders: Order[] = [
  {
    id: "ORD-2024-001",
    customer: {
      id: "1",
      name: "Sarah Wilson",
      email: "sarah@email.com",
      avatar: "SW"
    },
    orderDate: "2024-09-15T10:30:00Z",
    status: "delivered",
    paymentStatus: "paid",
    paymentMethod: "bank_transfer",
    items: [
      { name: "Luxury Glamping Resort - Full Share", quantity: 1, price: 75000, pv: 75000 }
    ],
    subtotal: 75000,
    tax: 7500,
    shipping: 0,
    total: 82500,
    totalPV: 75000,
    shippingAddress: "123 Mountain View, Aspen, CO 81611",
    trackingNumber: "GLM123456789",
    commission: 7500,
    shareLevel: "full",
    propertyName: "Alpine Luxury Resort",
    usageDays: 60
  },
  {
    id: "ORD-2024-002",
    customer: {
      id: "2",
      name: "Michael Chen",
      email: "michael@email.com",
      avatar: "MC"
    },
    orderDate: "2024-09-14T14:20:00Z",
    status: "processing",
    paymentStatus: "paid",
    paymentMethod: "crypto",
    items: [
      { name: "Beachfront Glamping - Half Share", quantity: 1, price: 37500, pv: 37500 }
    ],
    subtotal: 37500,
    tax: 3750,
    shipping: 0,
    total: 41250,
    totalPV: 37500,
    shippingAddress: "456 Ocean Drive, Miami, FL 33139",
    trackingNumber: null,
    commission: 3750,
    shareLevel: "half",
    propertyName: "Coastal Paradise Resort",
    usageDays: 30
  },
  {
    id: "ORD-2024-003",
    customer: {
      id: "3",
      name: "Emily Rodriguez",
      email: "emily@email.com",
      avatar: "ER"
    },
    orderDate: "2024-09-13T09:15:00Z",
    status: "shipped",
    paymentStatus: "paid",
    paymentMethod: "bitcoin",
    items: [
      { name: "Forest Retreat - Quarter Share", quantity: 1, price: 18750, pv: 18750 }
    ],
    subtotal: 18750,
    tax: 1875,
    shipping: 0,
    total: 20625,
    totalPV: 18750,
    shippingAddress: "789 Pine Street, Portland, OR 97205",
    trackingNumber: "GLM987654321",
    commission: 1875,
    shareLevel: "quarter",
    propertyName: "Woodland Sanctuary",
    usageDays: 15
  },
  {
    id: "ORD-2024-004",
    customer: {
      id: "4",
      name: "David Thompson",
      email: "david@email.com",
      avatar: "DT"
    },
    orderDate: "2024-09-12T16:45:00Z",
    status: "pending",
    paymentStatus: "pending",
    paymentMethod: "bank_transfer",
    items: [
      { name: "Mountain Vista - Eighth Share", quantity: 1, price: 9375, pv: 9375 }
    ],
    subtotal: 9375,
    tax: 937.5,
    shipping: 0,
    total: 10312.5,
    totalPV: 9375,
    shippingAddress: "321 Valley Road, Denver, CO 80202",
    trackingNumber: null,
    commission: 937.5,
    shareLevel: "eighth",
    propertyName: "Alpine Peaks Lodge",
    usageDays: 7
  }
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "delivered": return "bg-green-100 text-green-800"
    case "shipped": return "bg-blue-100 text-blue-800"
    case "processing": return "bg-yellow-100 text-yellow-800"
    case "pending": return "bg-orange-100 text-orange-800"
    case "cancelled": return "bg-red-100 text-red-800"
    default: return "bg-gray-100 text-gray-800"
  }
}

const getPaymentStatusColor = (status: string) => {
  switch (status) {
    case "paid": return "bg-green-100 text-green-800"
    case "pending": return "bg-yellow-100 text-yellow-800"
    case "failed": return "bg-red-100 text-red-800"
    case "refunded": return "bg-purple-100 text-purple-800"
    default: return "bg-gray-100 text-gray-800"
  }
}

const getPaymentMethodIcon = (method: string) => {
  switch (method) {
    case "crypto":
    case "bitcoin":
      return <Bitcoin className="h-4 w-4" />
    case "bank_transfer":
      return <Wallet className="h-4 w-4" />
    default:
      return <CreditCard className="h-4 w-4" />
  }
}

const getShareLevelDisplay = (level: string) => {
  switch (level) {
    case "full": return "Full Share"
    case "half": return "Half Share"
    case "quarter": return "Quarter Share"
    case "eighth": return "Eighth Share"
    default: return level
  }
}

const stats = [
  { label: "Total Orders", value: "156", change: "+12%", icon: Package },
  { label: "Pending", value: "8", change: "-2%", icon: Clock },
  { label: "Completed", value: "142", change: "+8%", icon: CheckCircle },
  { label: "Revenue", value: "€2.4M", change: "+15%", icon: DollarSign },
]

export function OrderManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [paymentFilter, setPaymentFilter] = useState("all")
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<"table" | "cards">("table")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showOrderDetail, setShowOrderDetail] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.propertyName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    const matchesPayment = paymentFilter === "all" || order.paymentStatus === paymentFilter
    return matchesSearch && matchesStatus && matchesPayment
  }).sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrders(filteredOrders.map(order => order.id))
    } else {
      setSelectedOrders([])
    }
  }

  const handleSelectOrder = (orderId: string, checked: boolean) => {
    if (checked) {
      setSelectedOrders(prev => [...prev, orderId])
    } else {
      setSelectedOrders(prev => prev.filter(id => id !== orderId))
    }
  }

  const handleRefresh = async () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => setIsLoading(false), 1000)
  }

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order)
    setShowOrderDetail(true)
  }

  const handleExportOrders = () => {
    console.log("Exporting orders...")
  }

  const handleCreateOrder = () => {
    // Redirect to customer selection or onboarding flow
    window.open('/onboarding', '_blank')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Order Management</h2>
          <p className="text-muted-foreground">
            Track and manage all customer orders and timeshare purchases
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportOrders}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm" onClick={handleCreateOrder}>
            <Plus className="h-4 w-4 mr-2" />
            New Order
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
                <span className={`${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change}
                </span>{" "}
                from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-[300px]"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Select value={paymentFilter} onValueChange={setPaymentFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Payment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Payments</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          {selectedOrders.length > 0 && (
            <Badge variant="secondary">
              {selectedOrders.length} selected
            </Badge>
          )}
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "table" | "cards")}>
            <TabsList>
              <TabsTrigger value="table">Table</TabsTrigger>
              <TabsTrigger value="cards">Cards</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Content */}
      <Tabs value={viewMode} className="space-y-4">
        <TabsContent value="table" className="space-y-4">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={selectedOrders.length === filteredOrders.length}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Property</TableHead>
                  <TableHead>Share Level</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedOrders.includes(order.id)}
                        onCheckedChange={(checked) => handleSelectOrder(order.id, !!checked)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${order.customer.name}`} />
                          <AvatarFallback>{order.customer.avatar}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{order.customer.name}</p>
                          <p className="text-sm text-muted-foreground">{order.customer.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.propertyName}</p>
                        <p className="text-sm text-muted-foreground">{order.usageDays} days/year</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {getShareLevelDisplay(order.shareLevel)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">€{order.total.toLocaleString()}</p>
                        <div className="flex items-center text-sm text-muted-foreground">
                          {getPaymentMethodIcon(order.paymentMethod)}
                          <span className="ml-1">{order.paymentMethod.replace('_', ' ')}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                        {order.paymentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(order.orderDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewOrder(order)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Truck className="mr-2 h-4 w-4" />
                            Track Order
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            Export Order
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="cards" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">{order.id}</CardTitle>
                    <div className="flex space-x-1">
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                      <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                        {order.paymentStatus}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${order.customer.name}`} />
                      <AvatarFallback>{order.customer.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{order.customer.name}</p>
                      <p className="text-xs text-muted-foreground">{order.customer.email}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="font-medium text-sm">{order.propertyName}</p>
                    <p className="text-xs text-muted-foreground">
                      {getShareLevelDisplay(order.shareLevel)} • {order.usageDays} days/year
                    </p>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="font-semibold text-green-600">€{order.total.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      {getPaymentMethodIcon(order.paymentMethod)}
                      <span className="text-xs text-muted-foreground">{order.paymentMethod.replace('_', ' ')}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t">
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </p>
                    <Button variant="outline" size="sm" onClick={() => handleViewOrder(order)}>
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Order Detail Modal */}
      {showOrderDetail && selectedOrder && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <div className="w-full max-w-4xl">
                <OrderDetailView
                  order={selectedOrder}
                  onClose={() => {
                    setShowOrderDetail(false)
                    setSelectedOrder(null)
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
