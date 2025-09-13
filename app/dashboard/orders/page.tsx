"use client"

import { useState } from "react"
import { ShoppingCart, Search, Plus, Filter, Download, Eye, Edit, Truck, Package, CreditCard, Calendar, DollarSign, TrendingUp, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"
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
import { OrderDetailView } from "@/components/order-detail-view"

// Mock order data
const orders = [
  {
    id: "ORD-001",
    customer: {
      name: "Emma Thompson",
      email: "emma.thompson@email.com",
      avatar: "ET"
    },
    orderDate: "2025-09-12",
    status: "delivered" as const,
    paymentStatus: "paid" as const,
    items: [
      { name: "Wellness Pack Premium", quantity: 2, price: 89.99, pv: 65 },
      { name: "Beauty Essentials Set", quantity: 1, price: 129.99, pv: 95 }
    ],
    subtotal: 309.97,
    tax: 24.80,
    shipping: 9.99,
    total: 344.76,
    totalPV: 225,
    shippingAddress: "123 Main St, New York, NY 10001",
    trackingNumber: "1Z999AA1234567890",
    commission: 68.95,
  },
  {
    id: "ORD-002",
    customer: {
      name: "Michael Rodriguez",
      email: "m.rodriguez@email.com",
      avatar: "MR"
    },
    orderDate: "2025-09-11",
    status: "shipped" as const,
    paymentStatus: "paid" as const,
    items: [
      { name: "Fitness Boost Formula", quantity: 3, price: 45.99, pv: 35 },
      { name: "Complete Nutrition Bundle", quantity: 1, price: 199.99, pv: 150 }
    ],
    subtotal: 337.96,
    tax: 27.04,
    shipping: 12.99,
    total: 377.99,
    totalPV: 255,
    shippingAddress: "456 Oak Ave, Los Angeles, CA 90210",
    trackingNumber: "1Z999AA1234567891",
    commission: 75.60,
  },
  {
    id: "ORD-003",
    customer: {
      name: "Sarah Johnson",
      email: "sarah.j@email.com",
      avatar: "SJ"
    },
    orderDate: "2025-09-10",
    status: "processing" as const,
    paymentStatus: "paid" as const,
    items: [
      { name: "Organic Green Tea Extract", quantity: 2, price: 29.99, pv: 22 },
    ],
    subtotal: 59.98,
    tax: 4.80,
    shipping: 6.99,
    total: 71.77,
    totalPV: 44,
    shippingAddress: "789 Pine St, Chicago, IL 60601",
    trackingNumber: null,
    commission: 14.35,
  },
  {
    id: "ORD-004",
    customer: {
      name: "David Chen",
      email: "david.chen@email.com",
      avatar: "DC"
    },
    orderDate: "2025-09-09",
    status: "pending" as const,
    paymentStatus: "pending" as const,
    items: [
      { name: "Sleep Support Formula", quantity: 1, price: 39.99, pv: 30 },
      { name: "Wellness Pack Premium", quantity: 1, price: 89.99, pv: 65 }
    ],
    subtotal: 129.98,
    tax: 10.40,
    shipping: 7.99,
    total: 148.37,
    totalPV: 95,
    shippingAddress: "321 Elm Dr, Austin, TX 78701",
    trackingNumber: null,
    commission: 29.67,
  },
  {
    id: "ORD-005",
    customer: {
      name: "Lisa Anderson",
      email: "lisa.anderson@email.com",
      avatar: "LA"
    },
    orderDate: "2025-09-08",
    status: "cancelled" as const,
    paymentStatus: "refunded" as const,
    items: [
      { name: "Beauty Essentials Set", quantity: 1, price: 129.99, pv: 95 },
    ],
    subtotal: 129.99,
    tax: 10.40,
    shipping: 9.99,
    total: 150.38,
    totalPV: 95,
    shippingAddress: "654 Beach Blvd, Miami, FL 33101",
    trackingNumber: null,
    commission: 0,
  },
]

const stats = [
  { label: "Total Orders", value: "1,247", change: "+23", icon: ShoppingCart },
  { label: "Orders This Month", value: "89", change: "+12", icon: Calendar },
  { label: "Average Order Value", value: "$234.50", change: "+$18.20", icon: DollarSign },
  { label: "Pending Orders", value: "15", change: "-3", icon: Clock },
]

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [paymentFilter, setPaymentFilter] = useState("all")
  const [viewMode, setViewMode] = useState<"list" | "details">("list")
  const [selectedOrder, setSelectedOrder] = useState<typeof orders[0] | null>(null)

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    const matchesPayment = paymentFilter === "all" || order.paymentStatus === paymentFilter
    
    return matchesSearch && matchesStatus && matchesPayment
  })

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
      case "delivered": return "default"
      case "shipped": return "default"
      case "processing": return "secondary"
      case "pending": return "outline"
      case "cancelled": return "destructive"
      default: return "secondary"
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "default"
      case "pending": return "secondary"
      case "refunded": return "destructive"
      case "failed": return "destructive"
      default: return "secondary"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered": return <Package className="h-4 w-4" />
      case "shipped": return <Truck className="h-4 w-4" />
      case "processing": return <Clock className="h-4 w-4" />
      case "pending": return <Clock className="h-4 w-4" />
      case "cancelled": return <Package className="h-4 w-4" />
      default: return <Package className="h-4 w-4" />
    }
  }

  const OrderCard = ({ order }: { order: typeof orders[0] }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${order.customer.name}`} />
              <AvatarFallback>{order.customer.avatar}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{order.id}</CardTitle>
              <CardDescription>{order.customer.name}</CardDescription>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-1">
            <Badge variant={getStatusColor(order.status) as any} className="flex items-center gap-1">
              {getStatusIcon(order.status)}
              {order.status}
            </Badge>
            <Badge variant={getPaymentStatusColor(order.paymentStatus) as any}>
              {order.paymentStatus}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Order Date</p>
            <p className="font-medium">{formatDate(order.orderDate)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Amount</p>
            <p className="text-lg font-bold text-green-600">{formatCurrency(order.total)}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Items</p>
            <p className="font-medium">{order.items.length} products</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total PV</p>
            <p className="font-medium">{order.totalPV}</p>
          </div>
        </div>

        <div>
          <p className="text-sm text-muted-foreground mb-2">Products</p>
          <div className="space-y-1">
            {order.items.map((item, index) => (
              <div key={index} className="text-xs flex justify-between">
                <span>{item.quantity}x {item.name}</span>
                <span>{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
        </div>

        {order.trackingNumber && (
          <div>
            <p className="text-sm text-muted-foreground">Tracking</p>
            <p className="text-xs font-mono">{order.trackingNumber}</p>
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <span className="text-sm text-green-600 font-medium">
            Commission: {formatCurrency(order.commission)}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSelectedOrder(order)}>
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="h-4 w-4 mr-2" />
                Edit Order
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Truck className="h-4 w-4 mr-2" />
                Track Shipment
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="h-4 w-4 mr-2" />
                Download Invoice
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
          <h1 className="text-3xl font-bold tracking-tight">Order Management</h1>
          <p className="text-muted-foreground">
            Track and manage customer orders and fulfillment
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Orders
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Order
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
              placeholder="Search orders..."
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
              <SelectItem value="refunded">Refunded</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "list" | "details")}>
          <TabsList>
            <TabsTrigger value="list">List</TabsTrigger>
            <TabsTrigger value="details">Cards</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Orders List */}
      <Tabs value={viewMode} className="space-y-6">
        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Orders ({filteredOrders.length})</CardTitle>
              <CardDescription>
                Manage customer orders and track fulfillment status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>PV</TableHead>
                    <TableHead>Commission</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono font-medium">{order.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${order.customer.name}`} />
                            <AvatarFallback>{order.customer.avatar}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{order.customer.name}</div>
                            <div className="text-sm text-muted-foreground">{order.customer.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(order.orderDate)}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(order.status) as any} className="flex items-center gap-1 w-fit">
                          {getStatusIcon(order.status)}
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getPaymentStatusColor(order.paymentStatus) as any}>
                          {order.paymentStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>{order.items.length}</TableCell>
                      <TableCell className="font-medium">{formatCurrency(order.total)}</TableCell>
                      <TableCell className="font-medium">{order.totalPV}</TableCell>
                      <TableCell className="font-medium text-green-600">{formatCurrency(order.commission)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              Actions
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setSelectedOrder(order)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Order
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Truck className="h-4 w-4 mr-2" />
                              Track Shipment
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" />
                              Download Invoice
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

        <TabsContent value="details">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Order Detail Dialog */}
      {selectedOrder && (
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-auto p-0">
            <OrderDetailView
              order={selectedOrder}
              onClose={() => setSelectedOrder(null)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
