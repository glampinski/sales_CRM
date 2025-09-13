"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  Package, 
  CreditCard, 
  Truck, 
  MapPin, 
  Calendar, 
  DollarSign, 
  FileText, 
  CheckCircle,
  Clock,
  AlertCircle,
  Target
} from "lucide-react"

interface OrderItem {
  name: string
  quantity: number
  price: number
  pv: number
}

interface Order {
  id: string
  customer: {
    name: string
    email: string
    avatar: string
  }
  orderDate: string
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  paymentStatus: "pending" | "paid" | "failed" | "refunded"
  items: OrderItem[]
  subtotal: number
  tax: number
  shipping: number
  total: number
  totalPV: number
  shippingAddress: string
  trackingNumber: string | null
  commission: number
}

interface OrderDetailViewProps {
  order: Order
  onClose?: () => void
}

export function OrderDetailView({ order, onClose }: OrderDetailViewProps) {
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered": return <CheckCircle className="h-4 w-4" />
      case "shipped": return <Truck className="h-4 w-4" />
      case "processing": return <Package className="h-4 w-4" />
      case "pending": return <Clock className="h-4 w-4" />
      case "cancelled": return <AlertCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const getOrderProgress = () => {
    switch (order.status) {
      case "pending": return 20
      case "processing": return 40
      case "shipped": return 70
      case "delivered": return 100
      case "cancelled": return 0
      default: return 0
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Order Details</h1>
          <p className="text-muted-foreground">Order {order.id}</p>
        </div>
        {onClose && (
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        )}
      </div>

      {/* Order Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getStatusIcon(order.status)}
            Order Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Badge className={getStatusColor(order.status)}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Badge>
            <span className="text-sm text-muted-foreground">
              Ordered on {new Date(order.orderDate).toLocaleDateString()}
            </span>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{getOrderProgress()}%</span>
            </div>
            <Progress value={getOrderProgress()} className="h-2" />
          </div>

          {order.trackingNumber && (
            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
              <Truck className="h-4 w-4" />
              <div>
                <p className="text-sm font-medium">Tracking Number</p>
                <p className="text-sm text-muted-foreground">{order.trackingNumber}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${order.customer.name}`} />
                <AvatarFallback>{order.customer.avatar}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{order.customer.name}</p>
                <p className="text-sm text-muted-foreground">{order.customer.email}</p>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Shipping Address</span>
              </div>
              <p className="text-sm text-muted-foreground pl-6">
                {order.shippingAddress}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Payment Information */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Payment Status</span>
              <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
              </Badge>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Subtotal</span>
                <span className="text-sm">${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Tax</span>
                <span className="text-sm">${order.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Shipping</span>
                <span className="text-sm">${order.shipping.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
              <Target className="h-4 w-4" />
              <div>
                <p className="text-sm font-medium">Commission Earned</p>
                <p className="text-sm text-muted-foreground">${order.commission.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
          <CardDescription>
            {order.items.length} item{order.items.length !== 1 ? 's' : ''} • {order.totalPV} PV Total
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{item.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    Quantity: {item.quantity} • PV: {item.pv} each
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.pv * item.quantity} PV
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* MLM Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>MLM Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{order.totalPV}</p>
              <p className="text-sm text-muted-foreground">Personal Volume</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">${order.commission.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">Commission</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">
                {((order.commission / order.total) * 100).toFixed(1)}%
              </p>
              <p className="text-sm text-muted-foreground">Commission Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
