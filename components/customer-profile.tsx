"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Building2, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  FileText,
  DollarSign,
  Download,
  Upload,
  Eye,
  Edit,
  MoreHorizontal,
  User,
  Shield,
  CreditCard,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Bitcoin,
  Wallet,
  TrendingUp,
  Star,
  Home,
  Users
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"

interface TimeshareProperty {
  id: string
  propertyId: string
  propertyName: string
  propertyImage: string
  shareLevel: "full" | "half" | "quarter" | "eighth"
  purchaseDate: string
  purchasePrice: number
  currentValue: number
  usageDays: number
  usedDays: number
  remainingDays: number
  contractStatus: "active" | "pending" | "expired" | "terminated"
  nextAvailability: string
  lastUsed: string
  paymentMethod: "bank_transfer" | "crypto" | "bitcoin"
  contractId: string
  maintenanceFees: number
  location: string
  description: string
}

interface Contract {
  id: string
  type: "ownership" | "maintenance" | "usage_rights" | "amendment"
  propertyId?: string
  shareLevel?: string
  status: "signed" | "pending" | "expired" | "cancelled"
  signedDate?: string
  expiryDate?: string
  fileUrl: string
  fileName: string
  fileSize: string
  description: string
}

interface PaymentRecord {
  id: string
  type: "purchase" | "maintenance" | "fees" | "refund"
  amount: number
  currency: "EUR" | "BTC" | "ETH" | "USDC"
  method: "bank_transfer" | "crypto" | "bitcoin"
  status: "completed" | "pending" | "failed" | "refunded"
  date: string
  description: string
  transactionId?: string
  propertyId?: string
  shareLevel?: string
}

interface CustomerProfileData {
  id: string
  name: string
  email: string
  phone: string
  avatar?: string
  status: "active" | "inactive" | "pending" | "vip" | "suspended"
  tier: "standard" | "vip" | "premium" | "gold"
  joinDate: string
  location: string
  nationality: string
  dateOfBirth: string
  distributorId?: string
  distributorName?: string
  kycStatus: "verified" | "pending" | "rejected" | "not_started"
  documentsUploaded: number
  totalDocuments: number
  notes: string
  
  // Investment Summary
  totalInvestment: number
  totalShares: number
  propertiesOwned: number
  totalUsageDays: number
  usedDays: number
  nextBooking?: string
  
  // Detailed Holdings
  timeshareProperties: TimeshareProperty[]
  contracts: Contract[]
  paymentHistory: PaymentRecord[]
  
  // Communication
  lastContact: string
  preferredContactMethod: "email" | "phone" | "whatsapp"
  communicationNotes: string[]
}

// Mock customer data
const mockCustomerData: CustomerProfileData = {
  id: "cust-001",
  name: "Alessandro Rossi",
  email: "alessandro.rossi@email.com",
  phone: "+39 340 123 4567",
  avatar: "/placeholder-user.jpg",
  status: "active",
  tier: "vip",
  joinDate: "2024-03-15",
  location: "Milan, Italy",
  nationality: "Italian",
  dateOfBirth: "1985-06-20",
  distributorId: "dist-001",
  distributorName: "Sarah Johnson",
  kycStatus: "verified",
  documentsUploaded: 8,
  totalDocuments: 8,
  notes: "VIP customer, excellent relationship. Interested in additional properties.",
  totalInvestment: 192500,
  totalShares: 1.25,
  propertiesOwned: 2,
  totalUsageDays: 455,
  usedDays: 120,
  nextBooking: "2025-10-15",
  lastContact: "2025-09-10",
  preferredContactMethod: "email",
  communicationNotes: [
    "Expressed interest in purchasing additional quarter share",
    "Happy with property management services",
    "Recommending service to colleagues"
  ],
  
  timeshareProperties: [
    {
      id: "ts-001",
      propertyId: "prop-001",
      propertyName: "Alpine Retreat Tiny House #1",
      propertyImage: "/images/alpine-retreat-1.jpg",
      shareLevel: "full",
      purchaseDate: "2024-03-15",
      purchasePrice: 150000,
      currentValue: 155000,
      usageDays: 365,
      usedDays: 95,
      remainingDays: 270,
      contractStatus: "active",
      nextAvailability: "2025-10-01",
      lastUsed: "2025-08-15",
      paymentMethod: "bank_transfer",
      contractId: "CONTRACT-001-2024",
      maintenanceFees: 2400,
      location: "Swiss Alps, Switzerland",
      description: "Luxury tiny house with panoramic mountain views, featuring modern amenities and sustainable design."
    },
    {
      id: "ts-002",
      propertyId: "prop-003",
      propertyName: "Lakeside Cabin #3",
      propertyImage: "/images/lakeside-cabin-3.jpg",
      shareLevel: "quarter",
      purchaseDate: "2024-06-20",
      purchasePrice: 42500,
      currentValue: 44000,
      usageDays: 90,
      usedDays: 25,
      remainingDays: 65,
      contractStatus: "active",
      nextAvailability: "2025-09-20",
      lastUsed: "2025-07-10",
      paymentMethod: "bank_transfer",
      contractId: "CONTRACT-003-2024",
      maintenanceFees: 600,
      location: "Lake Como, Italy",
      description: "Charming lakeside retreat with private dock access and stunning water views."
    }
  ],
  
  contracts: [
    {
      id: "contract-001",
      type: "ownership",
      propertyId: "prop-001",
      shareLevel: "full",
      status: "signed",
      signedDate: "2024-03-15",
      expiryDate: "2034-03-15",
      fileUrl: "/contracts/alpine-retreat-full-share.pdf",
      fileName: "Alpine Retreat Full Share Contract.pdf",
      fileSize: "2.4 MB",
      description: "Full ownership contract for Alpine Retreat Tiny House #1"
    },
    {
      id: "contract-002",
      type: "ownership",
      propertyId: "prop-003",
      shareLevel: "quarter",
      status: "signed",
      signedDate: "2024-06-20",
      expiryDate: "2034-06-20",
      fileUrl: "/contracts/lakeside-cabin-quarter-share.pdf",
      fileName: "Lakeside Cabin Quarter Share Contract.pdf",
      fileSize: "1.8 MB",
      description: "Quarter share ownership contract for Lakeside Cabin #3"
    },
    {
      id: "contract-003",
      type: "maintenance",
      status: "signed",
      signedDate: "2024-03-15",
      expiryDate: "2025-03-15",
      fileUrl: "/contracts/maintenance-agreement-2024.pdf",
      fileName: "Annual Maintenance Agreement 2024.pdf",
      fileSize: "850 KB",
      description: "Annual maintenance and upkeep agreement for all properties"
    }
  ],
  
  paymentHistory: [
    {
      id: "pay-001",
      type: "purchase",
      amount: 150000,
      currency: "EUR",
      method: "bank_transfer",
      status: "completed",
      date: "2024-03-15",
      description: "Full share purchase - Alpine Retreat Tiny House #1",
      transactionId: "BANK-TXN-2024-001",
      propertyId: "prop-001",
      shareLevel: "full"
    },
    {
      id: "pay-002",
      type: "purchase",
      amount: 42500,
      currency: "EUR",
      method: "bank_transfer",
      status: "completed",
      date: "2024-06-20",
      description: "Quarter share purchase - Lakeside Cabin #3",
      transactionId: "BANK-TXN-2024-002",
      propertyId: "prop-003",
      shareLevel: "quarter"
    },
    {
      id: "pay-003",
      type: "maintenance",
      amount: 3000,
      currency: "EUR",
      method: "bank_transfer",
      status: "completed",
      date: "2024-12-01",
      description: "Annual maintenance fees for all properties",
      transactionId: "BANK-TXN-2024-003"
    }
  ]
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "active": return "bg-green-500 text-white"
    case "inactive": return "bg-gray-500 text-white"
    case "pending": return "bg-yellow-500 text-white"
    case "vip": return "bg-purple-600 text-white"
    case "suspended": return "bg-red-500 text-white"
    default: return "bg-gray-200 text-black"
  }
}

const getTierColor = (tier: string) => {
  switch (tier) {
    case "vip": return "bg-purple-600 text-white"
    case "premium": return "bg-blue-600 text-white"
    case "gold": return "bg-yellow-500 text-white"
    case "standard": return "bg-gray-400 text-white"
    default: return "bg-gray-200 text-black"
  }
}

const getContractStatusColor = (status: string) => {
  switch (status) {
    case "signed": return "bg-green-500 text-white"
    case "pending": return "bg-yellow-500 text-white"
    case "expired": return "bg-red-500 text-white"
    case "cancelled": return "bg-gray-500 text-white"
    default: return "bg-gray-200 text-black"
  }
}

const getPaymentStatusColor = (status: string) => {
  switch (status) {
    case "completed": return "bg-green-500 text-white"
    case "pending": return "bg-yellow-500 text-white"
    case "failed": return "bg-red-500 text-white"
    case "refunded": return "bg-blue-500 text-white"
    default: return "bg-gray-200 text-black"
  }
}

const getShareLevelDisplay = (level: string) => {
  switch (level) {
    case "full": return "1/1 Share (100%)"
    case "half": return "1/2 Share (50%)"
    case "quarter": return "1/4 Share (25%)"
    case "eighth": return "1/8 Share (12.5%)"
    default: return level
  }
}

const getPaymentMethodIcon = (method: string) => {
  switch (method) {
    case "crypto": return <Wallet className="h-4 w-4" />
    case "bitcoin": return <Bitcoin className="h-4 w-4" />
    case "bank_transfer": return <Building2 className="h-4 w-4" />
    default: return <DollarSign className="h-4 w-4" />
  }
}

interface CustomerProfileProps {
  customerId?: string
}

export function CustomerProfile({ customerId }: CustomerProfileProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const customer = mockCustomerData // In real app, fetch based on customerId

  const totalUsagePercentage = (customer.usedDays / customer.totalUsageDays) * 100
  const totalValue = customer.timeshareProperties.reduce((sum, prop) => sum + prop.currentValue, 0)
  const totalAppreciation = totalValue - customer.totalInvestment

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customer Profile</h1>
          <p className="text-muted-foreground">
            Detailed view of customer ownership and activity
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
          <Button>
            <Phone className="h-4 w-4 mr-2" />
            Contact Customer
          </Button>
        </div>
      </div>

      {/* Customer Summary Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={customer.avatar} />
              <AvatarFallback className="text-lg">
                {customer.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h2 className="text-2xl font-bold">{customer.name}</h2>
                <Badge className={getStatusColor(customer.status)}>{customer.status}</Badge>
                <Badge className={getTierColor(customer.tier)}>{customer.tier}</Badge>
                {customer.kycStatus === "verified" && (
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    <Shield className="h-3 w-3 mr-1" />
                    KYC Verified
                  </Badge>
                )}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center space-x-1">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{customer.email}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{customer.phone}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{customer.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Joined {new Date(customer.joinDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">€{customer.totalInvestment.toLocaleString()}</div>
              <p className="text-sm text-muted-foreground">Total Investment</p>
              {totalAppreciation > 0 && (
                <p className="text-xs text-green-600">+€{totalAppreciation.toLocaleString()} appreciation</p>
              )}
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{customer.totalShares}</div>
              <p className="text-sm text-muted-foreground">Total Shares</p>
              <p className="text-xs text-muted-foreground">{customer.propertiesOwned} properties</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{customer.totalUsageDays}</div>
              <p className="text-sm text-muted-foreground">Total Usage Days</p>
              <p className="text-xs text-muted-foreground">{customer.usedDays} used this year</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{totalUsagePercentage.toFixed(1)}%</div>
              <p className="text-sm text-muted-foreground">Usage Rate</p>
              <Progress value={totalUsagePercentage} className="h-2 mt-1" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="contracts">Contracts</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Full Name</p>
                    <p className="text-muted-foreground">{customer.name}</p>
                  </div>
                  <div>
                    <p className="font-medium">Date of Birth</p>
                    <p className="text-muted-foreground">{new Date(customer.dateOfBirth).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="font-medium">Nationality</p>
                    <p className="text-muted-foreground">{customer.nationality}</p>
                  </div>
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-muted-foreground">{customer.location}</p>
                  </div>
                  <div>
                    <p className="font-medium">Distributor</p>
                    <p className="text-muted-foreground">{customer.distributorName || "Direct Customer"}</p>
                  </div>
                  <div>
                    <p className="font-medium">KYC Status</p>
                    <Badge variant={customer.kycStatus === "verified" ? "default" : "secondary"}>
                      {customer.kycStatus}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Investment Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Current Portfolio Value</span>
                    <span className="font-bold text-green-600">€{totalValue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Total Investment</span>
                    <span className="font-bold">€{customer.totalInvestment.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Appreciation</span>
                    <span className={`font-bold ${totalAppreciation >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {totalAppreciation >= 0 ? '+' : ''}€{totalAppreciation.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Return on Investment</span>
                    <span className={`font-bold ${totalAppreciation >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {((totalAppreciation / customer.totalInvestment) * 100).toFixed(2)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Notes & Communication</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-medium mb-2">Customer Notes</p>
                <p className="text-muted-foreground">{customer.notes}</p>
              </div>
              <div>
                <p className="font-medium mb-2">Recent Communication Notes</p>
                <ul className="space-y-2">
                  {customer.communicationNotes.map((note, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      {note}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="properties" className="space-y-4">
          <div className="grid gap-6">
            {customer.timeshareProperties.map((property) => (
              <Card key={property.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center">
                        <Home className="h-5 w-5 mr-2" />
                        {property.propertyName}
                      </CardTitle>
                      <CardDescription>{property.location}</CardDescription>
                    </div>
                    <div className="text-right">
                      <Badge className={getContractStatusColor(property.contractStatus)}>
                        {property.contractStatus}
                      </Badge>
                      <p className="text-sm text-muted-foreground mt-1">
                        {getShareLevelDisplay(property.shareLevel)}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium">Purchase Price</p>
                      <p className="text-lg font-bold">€{property.purchasePrice.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Current Value</p>
                      <p className="text-lg font-bold text-green-600">€{property.currentValue.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Usage Days</p>
                      <p className="text-lg font-bold">{property.usageDays}/year</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Days Used</p>
                      <p className="text-lg font-bold">{property.usedDays}/{property.usageDays}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>Usage Progress</span>
                      <span>{Math.round((property.usedDays / property.usageDays) * 100)}%</span>
                    </div>
                    <Progress value={(property.usedDays / property.usageDays) * 100} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="font-medium">Purchase Date</p>
                      <p className="text-muted-foreground">{new Date(property.purchaseDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="font-medium">Last Used</p>
                      <p className="text-muted-foreground">{new Date(property.lastUsed).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="font-medium">Next Available</p>
                      <p className="text-muted-foreground">{new Date(property.nextAvailability).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="font-medium">Contract ID</p>
                      <p className="text-muted-foreground">{property.contractId}</p>
                    </div>
                    <div>
                      <p className="font-medium">Annual Maintenance</p>
                      <p className="text-muted-foreground">€{property.maintenanceFees}</p>
                    </div>
                    <div>
                      <p className="font-medium">Payment Method</p>
                      <div className="flex items-center space-x-1">
                        {getPaymentMethodIcon(property.paymentMethod)}
                        <span className="text-muted-foreground">{property.paymentMethod}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <Button variant="outline" size="sm">
                        <Calendar className="h-4 w-4 mr-2" />
                        Book Stay
                      </Button>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4 mr-2" />
                          View Contract
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="contracts" className="space-y-4">
          <div className="grid gap-4">
            {customer.contracts.map((contract) => (
              <Card key={contract.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center">
                        <FileText className="h-5 w-5 mr-2" />
                        {contract.fileName}
                      </CardTitle>
                      <CardDescription>{contract.description}</CardDescription>
                    </div>
                    <div className="text-right">
                      <Badge className={getContractStatusColor(contract.status)}>
                        {contract.status}
                      </Badge>
                      <p className="text-sm text-muted-foreground mt-1">
                        {contract.type}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm font-medium">Contract ID</p>
                      <p className="text-muted-foreground">{contract.id}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">File Size</p>
                      <p className="text-muted-foreground">{contract.fileSize}</p>
                    </div>
                    {contract.signedDate && (
                      <div>
                        <p className="text-sm font-medium">Signed Date</p>
                        <p className="text-muted-foreground">{new Date(contract.signedDate).toLocaleDateString()}</p>
                      </div>
                    )}
                    {contract.expiryDate && (
                      <div>
                        <p className="text-sm font-medium">Expiry Date</p>
                        <p className="text-muted-foreground">{new Date(contract.expiryDate).toLocaleDateString()}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </Button>
                      </div>
                      {contract.shareLevel && (
                        <Badge variant="outline">
                          {getShareLevelDisplay(contract.shareLevel)}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <div className="grid gap-4">
            {customer.paymentHistory.map((payment) => (
              <Card key={payment.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center">
                        <CreditCard className="h-5 w-5 mr-2" />
                        {payment.description}
                      </CardTitle>
                      <CardDescription>
                        {new Date(payment.date).toLocaleDateString()} • {payment.transactionId}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">
                        {payment.currency} {payment.amount.toLocaleString()}
                      </div>
                      <Badge className={getPaymentStatusColor(payment.status)}>
                        {payment.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm font-medium">Payment Type</p>
                      <p className="text-muted-foreground">{payment.type}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Method</p>
                      <div className="flex items-center space-x-1">
                        {getPaymentMethodIcon(payment.method)}
                        <span className="text-muted-foreground">{payment.method}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Currency</p>
                      <p className="text-muted-foreground">{payment.currency}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Transaction ID</p>
                      <p className="text-muted-foreground text-xs">{payment.transactionId}</p>
                    </div>
                  </div>
                  {payment.shareLevel && (
                    <div className="mt-4 pt-4 border-t">
                      <Badge variant="outline">
                        {getShareLevelDisplay(payment.shareLevel)}
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity & Communication</CardTitle>
              <CardDescription>
                Timeline of customer interactions and property usage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-2 border-blue-500 pl-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="font-medium">Property Usage</span>
                    <span className="text-sm text-muted-foreground">2025-08-15</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Completed 7-day stay at Alpine Retreat Tiny House #1
                  </p>
                </div>
                
                <div className="border-l-2 border-green-500 pl-4">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">Email Communication</span>
                    <span className="text-sm text-muted-foreground">2025-09-10</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Sent booking confirmation for October stay
                  </p>
                </div>
                
                <div className="border-l-2 border-yellow-500 pl-4">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium">Document Update</span>
                    <span className="text-sm text-muted-foreground">2025-08-01</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Maintenance agreement renewal signed
                  </p>
                </div>
                
                <div className="border-l-2 border-purple-500 pl-4">
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-purple-500" />
                    <span className="font-medium">Customer Feedback</span>
                    <span className="text-sm text-muted-foreground">2025-07-20</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Left 5-star review for Lakeside Cabin experience
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
