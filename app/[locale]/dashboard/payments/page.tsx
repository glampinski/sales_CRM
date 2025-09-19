"use client"

import { useState } from "react"
import { CreditCard, Search, Plus, Filter, Download, Eye, Check, X, RefreshCw, DollarSign, TrendingUp, AlertCircle, Calendar } from "lucide-react"
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

// Mock payment data
const payments = [
  {
    id: "PAY-001",
    orderId: "ORD-001",
    customer: {
      name: "Emma Thompson",
      email: "emma.thompson@email.com",
      avatar: "ET"
    },
    amount: 344.76,
    method: "Credit Card",
    cardLast4: "4532",
    cardBrand: "Visa",
    status: "completed" as const,
    date: "2025-09-12T14:30:00Z",
    transactionId: "txn_1234567890",
    processingFee: 10.34,
    netAmount: 334.42,
    commission: 68.95,
  },
  {
    id: "PAY-002",
    orderId: "ORD-002",
    customer: {
      name: "Michael Rodriguez",
      email: "m.rodriguez@email.com",
      avatar: "MR"
    },
    amount: 377.99,
    method: "PayPal",
    cardLast4: null,
    cardBrand: null,
    status: "completed" as const,
    date: "2025-09-11T16:45:00Z",
    transactionId: "pp_9876543210",
    processingFee: 11.34,
    netAmount: 366.65,
    commission: 75.60,
  },
  {
    id: "PAY-003",
    orderId: "ORD-003",
    customer: {
      name: "Sarah Johnson",
      email: "sarah.j@email.com",
      avatar: "SJ"
    },
    amount: 71.77,
    method: "Credit Card",
    cardLast4: "8765",
    cardBrand: "Mastercard",
    status: "pending" as const,
    date: "2025-09-10T10:15:00Z",
    transactionId: "txn_pending_001",
    processingFee: 2.15,
    netAmount: 69.62,
    commission: 14.35,
  },
  {
    id: "PAY-004",
    orderId: "ORD-004",
    customer: {
      name: "David Chen",
      email: "david.chen@email.com",
      avatar: "DC"
    },
    amount: 148.37,
    method: "Bank Transfer",
    cardLast4: null,
    cardBrand: null,
    status: "processing" as const,
    date: "2025-09-09T09:20:00Z",
    transactionId: "bt_5555666677",
    processingFee: 3.50,
    netAmount: 144.87,
    commission: 29.67,
  },
  {
    id: "PAY-005",
    orderId: "ORD-005",
    customer: {
      name: "Lisa Anderson",
      email: "lisa.anderson@email.com",
      avatar: "LA"
    },
    amount: 150.38,
    method: "Credit Card",
    cardLast4: "2109",
    cardBrand: "Visa",
    status: "failed" as const,
    date: "2025-09-08T13:50:00Z",
    transactionId: "txn_failed_001",
    processingFee: 0,
    netAmount: 0,
    commission: 0,
    failureReason: "Insufficient funds",
  },
  {
    id: "PAY-006",
    orderId: "ORD-006",
    customer: {
      name: "Tom Wilson",
      email: "tom.wilson@email.com",
      avatar: "TW"
    },
    amount: 89.99,
    method: "Credit Card",
    cardLast4: "3456",
    cardBrand: "American Express",
    status: "refunded" as const,
    date: "2025-09-07T11:30:00Z",
    transactionId: "txn_refunded_001",
    processingFee: 2.70,
    netAmount: 0,
    commission: 0,
    refundDate: "2025-09-08T15:20:00Z",
    refundReason: "Customer requested cancellation",
  },
]

const stats = [
  { label: "Total Payments", value: "$12,456.78", change: "+18.2%", icon: DollarSign },
  { label: "Successful Rate", value: "94.2%", change: "+2.1%", icon: TrendingUp },
  { label: "Pending Payments", value: "3", change: "-1", icon: AlertCircle },
  { label: "Processing Fees", value: "$234.56", change: "+$12.30", icon: CreditCard },
]

const paymentMethods = [
  { name: "Credit Card", count: 245, percentage: 68.2 },
  { name: "PayPal", count: 89, percentage: 24.8 },
  { name: "Bank Transfer", count: 25, percentage: 7.0 },
]

export default function PaymentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [methodFilter, setMethodFilter] = useState("all")
  const [viewMode, setViewMode] = useState<"list" | "analytics">("list")

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter
    const matchesMethod = methodFilter === "all" || payment.method === methodFilter
    
    return matchesSearch && matchesStatus && matchesMethod
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "default"
      case "pending": return "secondary"
      case "processing": return "outline"
      case "failed": return "destructive"
      case "refunded": return "secondary"
      default: return "secondary"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <Check className="h-4 w-4" />
      case "pending": return <AlertCircle className="h-4 w-4" />
      case "processing": return <RefreshCw className="h-4 w-4" />
      case "failed": return <X className="h-4 w-4" />
      case "refunded": return <RefreshCw className="h-4 w-4" />
      default: return <CreditCard className="h-4 w-4" />
    }
  }

  const getMethodIcon = (method: string) => {
    switch (method) {
      case "Credit Card": return "💳"
      case "PayPal": return "🅿️"
      case "Bank Transfer": return "🏦"
      default: return "💳"
    }
  }

  const PaymentCard = ({ payment }: { payment: typeof payments[0] }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${payment.customer.name}`} />
              <AvatarFallback>{payment.customer.avatar}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{payment.id}</CardTitle>
              <CardDescription>{payment.customer.name}</CardDescription>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-1">
            <Badge variant={getStatusColor(payment.status) as any} className="flex items-center gap-1">
              {getStatusIcon(payment.status)}
              {payment.status}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {getMethodIcon(payment.method)} {payment.method}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Amount</p>
            <p className="text-lg font-bold text-green-600">{formatCurrency(payment.amount)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Net Amount</p>
            <p className="font-medium">{formatCurrency(payment.netAmount)}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Order ID</p>
            <p className="font-mono text-sm">{payment.orderId}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Commission</p>
            <p className="font-medium text-green-600">{formatCurrency(payment.commission)}</p>
          </div>
        </div>

        {payment.cardLast4 && (
          <div>
            <p className="text-sm text-muted-foreground">Card Details</p>
            <p className="text-sm">{payment.cardBrand} •••• {payment.cardLast4}</p>
          </div>
        )}

        <div>
          <p className="text-sm text-muted-foreground">Transaction ID</p>
          <p className="font-mono text-xs">{payment.transactionId}</p>
        </div>

        {payment.failureReason && (
          <div className="p-2 bg-red-50 rounded-lg">
            <p className="text-sm text-red-600">Failure: {payment.failureReason}</p>
          </div>
        )}

        {payment.refundReason && (
          <div className="p-2 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-600">Refund: {payment.refundReason}</p>
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <span className="text-sm text-muted-foreground">
            {formatDateTime(payment.date)}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="h-4 w-4 mr-2" />
                Download Receipt
              </DropdownMenuItem>
              {payment.status === "pending" && (
                <DropdownMenuItem>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry Payment
                </DropdownMenuItem>
              )}
              {payment.status === "completed" && (
                <DropdownMenuItem className="text-red-600">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Issue Refund
                </DropdownMenuItem>
              )}
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
          <h1 className="text-3xl font-bold tracking-tight">Payment Management</h1>
          <p className="text-muted-foreground">
            Track and manage payment processing and transactions
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Payments
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Manual Payment
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
              placeholder="Search payments..."
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
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>

          <Select value={methodFilter} onValueChange={setMethodFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Methods</SelectItem>
              <SelectItem value="Credit Card">Credit Card</SelectItem>
              <SelectItem value="PayPal">PayPal</SelectItem>
              <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "list" | "analytics")}>
          <TabsList>
            <TabsTrigger value="list">Payments</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content */}
      <Tabs value={viewMode} className="space-y-6">
        <TabsContent value="list" className="space-y-6">
          {/* Quick Actions */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="flex items-center p-6">
                <div className="p-2 bg-green-100 rounded-lg mr-4">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Process Pending</p>
                  <p className="text-sm text-muted-foreground">3 payments waiting</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="flex items-center p-6">
                <div className="p-2 bg-red-100 rounded-lg mr-4">
                  <RefreshCw className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="font-medium">Retry Failed</p>
                  <p className="text-sm text-muted-foreground">2 failed payments</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="flex items-center p-6">
                <div className="p-2 bg-blue-100 rounded-lg mr-4">
                  <Download className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Export Report</p>
                  <p className="text-sm text-muted-foreground">Monthly summary</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payments Table */}
          <Card>
            <CardHeader>
              <CardTitle>Payments ({filteredPayments.length})</CardTitle>
              <CardDescription>
                Track payment status and transaction details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payment ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Fee</TableHead>
                    <TableHead>Net</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-mono font-medium">{payment.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${payment.customer.name}`} />
                            <AvatarFallback>{payment.customer.avatar}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{payment.customer.name}</div>
                            <div className="text-sm text-muted-foreground">{payment.customer.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono">{payment.orderId}</TableCell>
                      <TableCell className="font-medium">{formatCurrency(payment.amount)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span>{getMethodIcon(payment.method)}</span>
                          <span>{payment.method}</span>
                          {payment.cardLast4 && (
                            <span className="text-muted-foreground">•••• {payment.cardLast4}</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(payment.status) as any} className="flex items-center gap-1 w-fit">
                          {getStatusIcon(payment.status)}
                          {payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatCurrency(payment.processingFee)}</TableCell>
                      <TableCell className="font-medium">{formatCurrency(payment.netAmount)}</TableCell>
                      <TableCell>{formatDateTime(payment.date)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              Actions
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" />
                              Download Receipt
                            </DropdownMenuItem>
                            {payment.status === "pending" && (
                              <DropdownMenuItem>
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Retry Payment
                              </DropdownMenuItem>
                            )}
                            {payment.status === "completed" && (
                              <DropdownMenuItem className="text-red-600">
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Issue Refund
                              </DropdownMenuItem>
                            )}
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

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Payment Methods */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>Distribution of payment methods used</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {paymentMethods.map((method, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center space-x-2">
                        <span>{getMethodIcon(method.name)}</span>
                        <span>{method.name}</span>
                      </span>
                      <span className="font-medium">{method.count} ({method.percentage}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${method.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Payment Trends Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Trends</CardTitle>
                <CardDescription>Payment volume over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 mx-auto mb-4" />
                    <p>Chart visualization coming soon...</p>
                    <p className="text-sm">Payment trends and analytics will be displayed here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
