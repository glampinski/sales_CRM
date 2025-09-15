"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Wallet, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock, 
  Download,
  Eye,
  CreditCard,
  Banknote,
  Bitcoin,
  RefreshCw
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface WalletData {
  balance: number
  pendingCommissions: number
  availableForWithdraw: number
  totalEarned: number
  currency: string
}

interface Transaction {
  id: string
  type: "commission" | "payout" | "bonus" | "fee" | "refund"
  description: string
  amount: number
  status: "completed" | "pending" | "failed" | "processing"
  date: string
  reference?: string
}

interface PayoutMethod {
  id: string
  type: "bank" | "paypal" | "crypto"
  name: string
  details: string
  status: "active" | "pending" | "disabled"
  isDefault: boolean
}

// Mock data
const mockWalletData: WalletData = {
  balance: 4687.50,
  pendingCommissions: 1250.00,
  availableForWithdraw: 3437.50,
  totalEarned: 28750.00,
  currency: "USD"
}

const mockTransactions: Transaction[] = [
  {
    id: "txn_001",
    type: "commission",
    description: "Monthly Commission - September 2025",
    amount: 1250.00,
    status: "completed",
    date: "2025-09-01",
    reference: "COM-SEP-2025"
  },
  {
    id: "txn_002",
    type: "payout",
    description: "Withdrawal to Bank Account",
    amount: -800.00,
    status: "processing",
    date: "2025-09-10",
    reference: "PAY-20250910-001"
  },
  {
    id: "txn_003",
    type: "bonus",
    description: "Rank Achievement Bonus - Gold",
    amount: 500.00,
    status: "completed",
    date: "2025-08-28",
    reference: "BONUS-GOLD-2025"
  },
  {
    id: "txn_004",
    type: "commission",
    description: "Team Override Commission",
    amount: 350.00,
    status: "completed",
    date: "2025-08-25"
  },
  {
    id: "txn_005",
    type: "fee",
    description: "Processing Fee - Bank Transfer",
    amount: -15.00,
    status: "completed",
    date: "2025-08-20"
  }
]

const mockPayoutMethods: PayoutMethod[] = [
  {
    id: "bank_001",
    type: "bank",
    name: "Primary Bank Account",
    details: "****1234 - Chase Bank",
    status: "active",
    isDefault: true
  },
  {
    id: "paypal_001",
    type: "paypal",
    name: "PayPal Account",
    details: "user@email.com",
    status: "active",
    isDefault: false
  },
  {
    id: "crypto_001",
    type: "crypto",
    name: "Bitcoin Wallet",
    details: "bc1q...xyz123",
    status: "pending",
    isDefault: false
  }
]

export function WalletDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("current")
  const [isPayoutDialogOpen, setIsPayoutDialogOpen] = useState(false)
  const [payoutAmount, setPayoutAmount] = useState("")
  const [selectedPayoutMethod, setSelectedPayoutMethod] = useState("")

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "commission":
      case "bonus":
        return <ArrowDownLeft className="h-4 w-4 text-green-600" />
      case "payout":
        return <ArrowUpRight className="h-4 w-4 text-red-600" />
      case "fee":
        return <ArrowUpRight className="h-4 w-4 text-orange-600" />
      default:
        return <RefreshCw className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPaymentMethodIcon = (type: string) => {
    switch (type) {
      case "bank":
        return <Banknote className="h-4 w-4" />
      case "paypal":
        return <CreditCard className="h-4 w-4" />
      case "crypto":
        return <Bitcoin className="h-4 w-4" />
      default:
        return <Wallet className="h-4 w-4" />
    }
  }

  const handlePayoutRequest = () => {
    // Handle payout request logic
    console.log("Payout request:", {
      amount: payoutAmount,
      method: selectedPayoutMethod
    })
    setIsPayoutDialogOpen(false)
    setPayoutAmount("")
    setSelectedPayoutMethod("")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Wallet</h1>
          <p className="text-muted-foreground">
            Manage your earnings, commissions, and payouts
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Statement
          </Button>
          <Dialog open={isPayoutDialogOpen} onOpenChange={setIsPayoutDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <ArrowUpRight className="h-4 w-4 mr-2" />
                Request Payout
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Request Payout</DialogTitle>
                <DialogDescription>
                  Request a withdrawal from your available balance
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={payoutAmount}
                    onChange={(e) => setPayoutAmount(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Available: ${mockWalletData.availableForWithdraw.toLocaleString()}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="method">Payout Method</Label>
                  <Select value={selectedPayoutMethod} onValueChange={setSelectedPayoutMethod}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payout method" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockPayoutMethods.map((method) => (
                        <SelectItem key={method.id} value={method.id}>
                          <div className="flex items-center space-x-2">
                            {getPaymentMethodIcon(method.type)}
                            <span>{method.name}</span>
                            {method.isDefault && (
                              <Badge variant="secondary" className="text-xs">Default</Badge>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsPayoutDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handlePayoutRequest}>
                  Request Payout
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Wallet Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${mockWalletData.balance.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Available funds
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Commissions</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${mockWalletData.pendingCommissions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Processing for next payout
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available for Withdraw</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${mockWalletData.availableForWithdraw.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Ready for withdrawal
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${mockWalletData.totalEarned.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Lifetime earnings
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Transactions */}
      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
          <TabsTrigger value="payouts">Payout Methods</TabsTrigger>
          <TabsTrigger value="statements">Statements</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Transaction History</CardTitle>
                  <CardDescription>Your recent financial activity</CardDescription>
                </div>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="current">Current Month</SelectItem>
                    <SelectItem value="last30">Last 30 Days</SelectItem>
                    <SelectItem value="last90">Last 90 Days</SelectItem>
                    <SelectItem value="all">All Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      {getTransactionIcon(transaction.type)}
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <span>{new Date(transaction.date).toLocaleDateString()}</span>
                          {transaction.reference && (
                            <>
                              <span>•</span>
                              <span>{transaction.reference}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-medium ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toLocaleString()}
                      </div>
                      <Badge className={getStatusColor(transaction.status)}>
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payouts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payout Methods</CardTitle>
              <CardDescription>Manage your withdrawal methods</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockPayoutMethods.map((method) => (
                  <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      {getPaymentMethodIcon(method.type)}
                      <div>
                        <p className="font-medium">{method.name}</p>
                        <p className="text-sm text-muted-foreground">{method.details}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {method.isDefault && (
                        <Badge variant="secondary">Default</Badge>
                      )}
                      <Badge className={getStatusColor(method.status)}>
                        {method.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <Button variant="outline" className="w-full">
                  Add New Payout Method
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Commission Statements</CardTitle>
              <CardDescription>Download detailed commission reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {["September 2025", "August 2025", "July 2025", "June 2025"].map((period) => (
                  <div key={period} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{period} Statement</p>
                      <p className="text-sm text-muted-foreground">Commission details and breakdown</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
