"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { 
  CreditCard, 
  Truck, 
  MapPin, 
  DollarSign, 
  Target, 
  Building2,
  ShieldCheck
} from "lucide-react"

interface Customer {
  id: string | number
  name: string
  email: string
  phone: string
  tier: string
}

interface CheckoutItem {
  id: string
  name: string
  price: number
  quantity: number
  pv: number
  commission?: number
}

interface QuickCheckoutProps {
  customer: Customer
  items: CheckoutItem[]
  onComplete?: (orderData: any) => void
  onCancel?: () => void
}

export function QuickCheckout({ customer, items, onComplete, onCancel }: QuickCheckoutProps) {
  const [shippingAddress, setShippingAddress] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [specialInstructions, setSpecialInstructions] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const totalPV = items.reduce((sum, item) => sum + (item.pv * item.quantity), 0)
  const totalCommission = items.reduce((sum, item) => sum + ((item.commission || 0) * item.quantity), 0)
  const tax = subtotal * 0.08 // 8% tax
  const shipping = subtotal > 100 ? 0 : 9.99
  const total = subtotal + tax + shipping

  const handleCheckout = async () => {
    setIsProcessing(true)
    
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const orderData = {
      customer,
      items,
      shippingAddress,
      paymentMethod,
      specialInstructions,
      subtotal,
      tax,
      shipping,
      total,
      totalPV,
      totalCommission,
      orderDate: new Date().toISOString(),
      status: "pending"
    }

    if (onComplete) {
      onComplete(orderData)
    }
    
    setIsProcessing(false)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Quick Checkout</h1>
          <p className="text-muted-foreground">Complete the order for {customer.name}</p>
        </div>
        {onCancel && (
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
            <CardDescription>{items.length} items</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Customer Info */}
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Avatar>
                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${customer.name}`} />
                <AvatarFallback>{customer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{customer.name}</p>
                <p className="text-sm text-muted-foreground">{customer.email}</p>
                <Badge variant="secondary">{customer.tier}</Badge>
              </div>
            </div>

            <Separator />

            {/* Items */}
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Qty: {item.quantity} • {item.pv} PV each
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

            <Separator />

            {/* Totals */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* MLM Metrics */}
            <div className="grid grid-cols-2 gap-4 p-3 bg-primary/5 rounded-lg">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Target className="h-4 w-4" />
                  <span className="text-sm font-medium">Total PV</span>
                </div>
                <p className="text-xl font-bold text-primary">{totalPV}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <DollarSign className="h-4 w-4" />
                  <span className="text-sm font-medium">Commission</span>
                </div>
                <p className="text-xl font-bold text-primary">${totalCommission.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Checkout Form */}
        <Card>
          <CardHeader>
            <CardTitle>Checkout Details</CardTitle>
            <CardDescription>Complete the order information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Shipping Address */}
            <div className="space-y-2">
              <Label htmlFor="shipping">Shipping Address</Label>
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Where should we deliver this order?</span>
              </div>
              <Textarea
                id="shipping"
                placeholder="Enter complete shipping address..."
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                rows={3}
              />
            </div>

            {/* Payment Method */}
            <div className="space-y-2">
              <Label htmlFor="payment">Payment Method</Label>
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">How will this order be paid?</span>
              </div>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="credit-card">Credit Card</SelectItem>
                  <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                  <SelectItem value="crypto">Cryptocurrency</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="check">Check</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Special Instructions */}
            <div className="space-y-2">
              <Label htmlFor="instructions">Special Instructions</Label>
              <Textarea
                id="instructions"
                placeholder="Any special delivery or handling instructions..."
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                rows={2}
              />
            </div>

            {/* Processing Info */}
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Order Processing</span>
              </div>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Orders are processed within 1-2 business days</li>
                <li>• You'll receive tracking information via email</li>
                <li>• Commission will be credited to your account</li>
              </ul>
            </div>

            {/* Checkout Button */}
            <Button
              onClick={handleCheckout}
              disabled={!shippingAddress || !paymentMethod || isProcessing}
              className="w-full"
              size="lg"
            >
              {isProcessing ? (
                "Processing Order..."
              ) : (
                <>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Complete Order - ${total.toFixed(2)}
                </>
              )}
            </Button>

            {shipping === 0 && (
              <p className="text-center text-sm text-green-600">
                🎉 Free shipping on orders over $100!
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
