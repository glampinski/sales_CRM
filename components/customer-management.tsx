"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/AuthContext"
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
  Users, 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit, 
  MoreHorizontal,
  Building2,
  FileText,
  Calendar,
  DollarSign,
  Crown,
  Award,
  MapPin,
  Phone,
  Mail,
  RefreshCw,
  SortAsc,
  SortDesc,
  Settings,
  Download,
  UserPlus,
  TrendingUp,
  Bitcoin,
  Wallet
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"

interface TimeshareOwnership {
  id: string
  propertyId: string
  propertyName: string
  shareLevel: "full" | "half" | "quarter" | "eighth"
  purchaseDate: string
  usageDays: number
  usedDays: number
  contractStatus: "active" | "pending" | "expired" | "terminated"
  nextAvailability: string
  value: number
  paymentMethod: "bank_transfer" | "crypto" | "bitcoin"
}

interface Customer {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  status: "active" | "inactive" | "pending" | "vip" | "suspended"
  tier: "standard" | "vip" | "premium" | "gold"
  joinDate: string
  location: string
  totalInvestment: number
  totalShares: number
  totalUsageDays: number
  usedDays: number
  lastActivity: string
  distributorId?: string
  distributorName?: string
  timeshareOwnerships: TimeshareOwnership[]
  contractsCount: number
  documentsStatus: "complete" | "incomplete" | "pending"
  paymentHistory: {
    totalPaid: number
    pendingPayments: number
    lastPaymentDate: string
    preferredMethod: "bank_transfer" | "crypto" | "bitcoin"
  }
  kycStatus: "verified" | "pending" | "rejected" | "not_started"
  notes?: string
}

type SortField = "name" | "status" | "totalInvestment" | "totalShares" | "joinDate" | "lastActivity" | "usageDays"
type SortDirection = "asc" | "desc"

interface TableColumn {
  key: string
  label: string
  sortable: boolean
  visible: boolean
}

// Mock customers data for timeshare business
const mockCustomers: Customer[] = [
  {
    id: "cust-001",
    name: "Alessandro Rossi",
    email: "alessandro.rossi@email.com",
    phone: "+39 340 123 4567",
    avatar: "/placeholder-user.jpg",
    status: "active",
    tier: "vip",
    joinDate: "2024-03-15",
    location: "Milan, Italy",
    totalInvestment: 175000,
    totalShares: 1.25, // Full + 1/4 share
    totalUsageDays: 455,
    usedDays: 120,
    lastActivity: "2025-09-12",
    distributorId: "dist-001",
    distributorName: "Sarah Johnson",
    contractsCount: 2,
    documentsStatus: "complete",
    paymentHistory: {
      totalPaid: 175000,
      pendingPayments: 0,
      lastPaymentDate: "2024-08-15",
      preferredMethod: "bank_transfer"
    },
    kycStatus: "verified",
    notes: "VIP customer, excellent relationship",
    timeshareOwnerships: [
      {
        id: "ts-001",
        propertyId: "prop-001",
        propertyName: "Alpine Retreat Tiny House #1",
        shareLevel: "full",
        purchaseDate: "2024-03-15",
        usageDays: 365,
        usedDays: 95,
        contractStatus: "active",
        nextAvailability: "2025-10-01",
        value: 150000,
        paymentMethod: "bank_transfer"
      },
      {
        id: "ts-002",
        propertyId: "prop-003",
        propertyName: "Lakeside Cabin #3",
        shareLevel: "quarter",
        purchaseDate: "2024-06-20",
        usageDays: 90,
        usedDays: 25,
        contractStatus: "active",
        nextAvailability: "2025-09-20",
        value: 42500,
        paymentMethod: "bank_transfer"
      }
    ]
  },
  {
    id: "cust-002",
    name: "Emma Thompson",
    email: "emma.thompson@email.com",
    phone: "+44 7700 123456",
    avatar: "/placeholder-user.jpg",
    status: "active",
    tier: "premium",
    joinDate: "2024-05-10",
    location: "London, UK",
    totalInvestment: 80000,
    totalShares: 0.5,
    totalUsageDays: 180,
    usedDays: 45,
    lastActivity: "2025-09-11",
    distributorId: "dist-002",
    distributorName: "Michael Chen",
    contractsCount: 1,
    documentsStatus: "complete",
    paymentHistory: {
      totalPaid: 80000,
      pendingPayments: 0,
      lastPaymentDate: "2024-05-10",
      preferredMethod: "crypto"
    },
    kycStatus: "verified",
    notes: "Crypto enthusiast, quick decision maker",
    timeshareOwnerships: [
      {
        id: "ts-003",
        propertyId: "prop-002",
        propertyName: "Mountain View Cabin #2",
        shareLevel: "half",
        purchaseDate: "2024-05-10",
        usageDays: 180,
        usedDays: 45,
        contractStatus: "active",
        nextAvailability: "2025-10-15",
        value: 80000,
        paymentMethod: "crypto"
      }
    ]
  },
  {
    id: "cust-003",
    name: "Klaus Mueller",
    email: "klaus.mueller@email.com",
    phone: "+49 170 123 4567",
    status: "pending",
    tier: "standard",
    joinDate: "2025-08-15",
    location: "Munich, Germany",
    totalInvestment: 21250,
    totalShares: 0.125,
    totalUsageDays: 40,
    usedDays: 0,
    lastActivity: "2025-09-10",
    distributorId: "dist-003",
    distributorName: "Emma Wilson",
    contractsCount: 1,
    documentsStatus: "pending",
    paymentHistory: {
      totalPaid: 0,
      pendingPayments: 21250,
      lastPaymentDate: "",
      preferredMethod: "bitcoin"
    },
    kycStatus: "pending",
    notes: "New customer, documents under review",
    timeshareOwnerships: [
      {
        id: "ts-004",
        propertyId: "prop-004",
        propertyName: "Forest Hideaway #4",
        shareLevel: "eighth",
        purchaseDate: "2025-08-15",
        usageDays: 40,
        usedDays: 0,
        contractStatus: "pending",
        nextAvailability: "2025-11-01",
        value: 21250,
        paymentMethod: "bitcoin"
      }
    ]
  }
]

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

const getShareLevelDisplay = (level: string) => {
  switch (level) {
    case "full": return "1/1 Share"
    case "half": return "1/2 Share"
    case "quarter": return "1/4 Share"
    case "eighth": return "1/8 Share"
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

const stats = [
  { label: "Total Customers", value: "156", change: "+12", icon: Users },
  { label: "Active Ownerships", value: "234", change: "+18", icon: Building2 },
  { label: "Total Investment", value: "€8.2M", change: "+€650K", icon: DollarSign },
  { label: "VIP Customers", value: "24", change: "+3", icon: Crown },
]

const defaultColumns: TableColumn[] = [
  { key: "customer", label: "Customer", sortable: true, visible: true },
  { key: "status", label: "Status", sortable: true, visible: true },
  { key: "tier", label: "Tier", sortable: true, visible: true },
  { key: "totalInvestment", label: "Total Investment", sortable: true, visible: true },
  { key: "totalShares", label: "Shares Owned", sortable: true, visible: true },
  { key: "usageDays", label: "Usage Days", sortable: true, visible: true },
  { key: "distributor", label: "Distributor", sortable: true, visible: false },
  { key: "joinDate", label: "Join Date", sortable: true, visible: false },
  { key: "lastActivity", label: "Last Activity", sortable: true, visible: true },
  { key: "paymentMethod", label: "Payment Method", sortable: true, visible: false },
  { key: "kycStatus", label: "KYC Status", sortable: true, visible: false },
]

export function CustomerManagement() {
  const { canImpersonate, startImpersonation } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [tierFilter, setTierFilter] = useState("all")
  const [locationFilter, setLocationFilter] = useState("all")
  const [viewMode, setViewMode] = useState<"table" | "cards">("table")
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([])
  const [sortField, setSortField] = useState<SortField>("name")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [tableColumns, setTableColumns] = useState<TableColumn[]>(defaultColumns)
  const [isLoading, setIsLoading] = useState(false)
  const [compactView, setCompactView] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

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

  const toggleDropdown = (customerId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    // Ensure no focus issues
    (event.target as HTMLElement).blur();
    setOpenDropdown(openDropdown === customerId ? null : customerId);
  };

  // Get unique locations for filter
  const uniqueLocations = Array.from(new Set(mockCustomers.map(c => c.location.split(',')[1]?.trim() || c.location)))

  const filteredCustomers = mockCustomers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (customer.distributorName && customer.distributorName.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === "all" || customer.status === statusFilter
    const matchesTier = tierFilter === "all" || customer.tier === tierFilter
    const matchesLocation = locationFilter === "all" || customer.location.includes(locationFilter)
    return matchesSearch && matchesStatus && matchesTier && matchesLocation
  }).sort((a, b) => {
    let aValue: any
    let bValue: any
    
    switch (sortField) {
      case "name":
        aValue = a.name
        bValue = b.name
        break
      case "status":
        aValue = a.status
        bValue = b.status
        break
      case "totalInvestment":
        aValue = a.totalInvestment
        bValue = b.totalInvestment
        break
      case "totalShares":
        aValue = a.totalShares
        bValue = b.totalShares
        break
      case "joinDate":
        aValue = new Date(a.joinDate)
        bValue = new Date(b.joinDate)
        break
      case "lastActivity":
        aValue = new Date(a.lastActivity)
        bValue = new Date(b.lastActivity)
        break
      case "usageDays":
        aValue = a.totalUsageDays
        bValue = b.totalUsageDays
        break
      default:
        aValue = a.name
        bValue = b.name
    }

    if (sortDirection === "asc") {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
    }
  })

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCustomers(filteredCustomers.map(c => c.id))
    } else {
      setSelectedCustomers([])
    }
  }

  const handleSelectCustomer = (customerId: string, checked: boolean) => {
    if (checked) {
      setSelectedCustomers(prev => [...prev, customerId])
    } else {
      setSelectedCustomers(prev => prev.filter(id => id !== customerId))
    }
  }

  const handleClearSelection = () => {
    setSelectedCustomers([])
  }

  const handleRefresh = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  const handleViewProfile = (customer: Customer) => {
    window.location.href = `/dashboard/customers/${customer.id}`
  }

  const handleImpersonate = (customerId: string) => {
    // Map customer ID to user ID (in real app, this would be properly linked)
    const customerUserId = "4" // Assuming customer user ID is 4 for demo
    const success = startImpersonation(customerUserId)
    if (success) {
      // Redirect to show customer dashboard view
      window.location.href = '/dashboard'
    }
  }

  const handleColumnToggle = (columnKey: string, visible: boolean) => {
    setTableColumns(prev => 
      prev.map(col => 
        col.key === columnKey ? { ...col, visible } : col
      )
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customer Management</h1>
          <p className="text-muted-foreground">
            Manage timeshare customers and their ownership portfolios ({filteredCustomers.length} of {mockCustomers.length} customers)
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2 text-sm">
            <Switch
              id="compact-view"
              checked={compactView}
              onCheckedChange={setCompactView}
            />
            <Label htmlFor="compact-view">Compact</Label>
          </div>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button size="sm">
            <UserPlus className="h-4 w-4 mr-2" />
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
                <span className="text-green-600">{stat.change}</span> from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Enhanced Filters */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-muted/50 rounded-lg">
        <div className="relative flex-1 min-w-[250px] max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customers, emails, locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="vip">VIP</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>

        <Select value={tierFilter} onValueChange={setTierFilter}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Tier" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tiers</SelectItem>
            <SelectItem value="vip">VIP</SelectItem>
            <SelectItem value="premium">Premium</SelectItem>
            <SelectItem value="gold">Gold</SelectItem>
            <SelectItem value="standard">Standard</SelectItem>
          </SelectContent>
        </Select>

        <Select value={locationFilter} onValueChange={setLocationFilter}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            {uniqueLocations.map(location => (
              <SelectItem key={location} value={location}>{location}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuLabel>Show Columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {tableColumns.map(column => (
              <DropdownMenuCheckboxItem
                key={column.key}
                checked={column.visible}
                onCheckedChange={(checked) => handleColumnToggle(column.key, checked)}
              >
                {column.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "table" | "cards")}>
          <TabsList>
            <TabsTrigger value="table">Table</TabsTrigger>
            <TabsTrigger value="cards">Cards</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content */}
      <Tabs value={viewMode} className="space-y-4">
        <TabsContent value="table" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customers ({filteredCustomers.length})</CardTitle>
              <CardDescription>
                Complete list of timeshare customers with ownership details and investment tracking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedCustomers.length === filteredCustomers.length && filteredCustomers.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    {tableColumns.filter(col => col.visible).map(column => (
                      <TableHead 
                        key={column.key}
                        className={column.sortable ? "cursor-pointer hover:bg-muted/50" : ""}
                        onClick={() => column.sortable && handleSort(column.key as SortField)}
                      >
                        <div className="flex items-center space-x-1">
                          <span>{column.label}</span>
                          {column.sortable && sortField === column.key && (
                            sortDirection === "asc" ? 
                              <SortAsc className="h-4 w-4" /> : 
                              <SortDesc className="h-4 w-4" />
                          )}
                        </div>
                      </TableHead>
                    ))}
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((customer) => (
                    <TableRow key={customer.id} className={compactView ? "h-12" : ""}>
                      <TableCell>
                        <Checkbox
                          checked={selectedCustomers.includes(customer.id)}
                          onCheckedChange={(checked) => handleSelectCustomer(customer.id, checked as boolean)}
                        />
                      </TableCell>
                      
                      {tableColumns.find(col => col.key === "customer")?.visible && (
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className={compactView ? "h-6 w-6" : "h-8 w-8"}>
                              <AvatarImage src={customer.avatar} />
                              <AvatarFallback>
                                {customer.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className={`font-medium ${compactView ? 'text-sm' : ''}`}>{customer.name}</p>
                              {!compactView && (
                                <p className="text-sm text-muted-foreground">{customer.email}</p>
                              )}
                            </div>
                          </div>
                        </TableCell>
                      )}
                      
                      {tableColumns.find(col => col.key === "status")?.visible && (
                        <TableCell>
                          <Badge className={`${getStatusColor(customer.status)} ${compactView ? 'text-xs px-1.5 py-0.5' : ''}`}>
                            {customer.status}
                          </Badge>
                        </TableCell>
                      )}
                      
                      {tableColumns.find(col => col.key === "tier")?.visible && (
                        <TableCell>
                          <Badge className={`${getTierColor(customer.tier)} ${compactView ? 'text-xs px-1.5 py-0.5' : ''}`}>
                            {customer.tier}
                          </Badge>
                        </TableCell>
                      )}
                      
                      {tableColumns.find(col => col.key === "totalInvestment")?.visible && (
                        <TableCell className={`text-green-600 font-medium ${compactView ? 'text-sm' : ''}`}>
                          €{customer.totalInvestment.toLocaleString()}
                        </TableCell>
                      )}
                      
                      {tableColumns.find(col => col.key === "totalShares")?.visible && (
                        <TableCell className={compactView ? 'text-sm' : ''}>
                          <div className="flex items-center space-x-1">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            <span>{customer.totalShares} shares</span>
                          </div>
                        </TableCell>
                      )}
                      
                      {tableColumns.find(col => col.key === "usageDays")?.visible && (
                        <TableCell className={compactView ? 'text-sm' : ''}>
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span>{customer.usedDays}/{customer.totalUsageDays}</span>
                              <span>{Math.round((customer.usedDays / customer.totalUsageDays) * 100)}%</span>
                            </div>
                            <Progress value={(customer.usedDays / customer.totalUsageDays) * 100} className="h-2" />
                          </div>
                        </TableCell>
                      )}
                      
                      {tableColumns.find(col => col.key === "distributor")?.visible && (
                        <TableCell className={compactView ? 'text-sm' : ''}>{customer.distributorName || "Direct"}</TableCell>
                      )}
                      
                      {tableColumns.find(col => col.key === "joinDate")?.visible && (
                        <TableCell className={compactView ? 'text-sm' : ''}>
                          {new Date(customer.joinDate).toLocaleDateString()}
                        </TableCell>
                      )}
                      
                      {tableColumns.find(col => col.key === "lastActivity")?.visible && (
                        <TableCell className={compactView ? 'text-sm' : ''}>
                          {new Date(customer.lastActivity).toLocaleDateString()}
                        </TableCell>
                      )}
                      
                      {tableColumns.find(col => col.key === "paymentMethod")?.visible && (
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            {getPaymentMethodIcon(customer.paymentHistory.preferredMethod)}
                            <span className={compactView ? 'text-sm' : ''}>{customer.paymentHistory.preferredMethod}</span>
                          </div>
                        </TableCell>
                      )}
                      
                      {tableColumns.find(col => col.key === "kycStatus")?.visible && (
                        <TableCell>
                          <Badge variant={customer.kycStatus === "verified" ? "default" : "secondary"}>
                            {customer.kycStatus}
                          </Badge>
                        </TableCell>
                      )}
                      
                      <TableCell>
                        <div className="relative" data-dropdown-container>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={(e) => toggleDropdown(customer.id, e)}
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
                          </Button>
                          {openDropdown === customer.id && (
                            <div 
                              className="absolute right-0 top-8 bg-white border rounded-md shadow-lg p-1 min-w-[200px] z-50"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button 
                                className="w-full text-left px-2 py-1.5 text-sm hover:bg-gray-100 rounded flex items-center"
                                onClick={(e) => {
                                  e.stopPropagation(); 
                                  setOpenDropdown(null);
                                  handleViewProfile(customer);
                                }}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View Profile
                              </button>
                              <button 
                                className="w-full text-left px-2 py-1.5 text-sm hover:bg-gray-100 rounded flex items-center"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenDropdown(null);
                                }}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Details
                              </button>
                              {canImpersonate() && (
                                <>
                                  <div className="border-t my-1"></div>
                                  <button 
                                    className="w-full text-left px-2 py-1.5 text-sm hover:bg-gray-100 rounded flex items-center text-orange-600"
                                    onClick={(e) => {
                                      e.stopPropagation(); 
                                      setOpenDropdown(null);
                                      handleImpersonate(customer.id);
                                    }}
                                  >
                                    <Eye className="mr-2 h-4 w-4" />
                                    Impersonate Customer
                                  </button>
                                </>
                              )}
                              <button 
                                className="w-full text-left px-2 py-1.5 text-sm hover:bg-gray-100 rounded flex items-center"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenDropdown(null);
                                }}
                              >
                                <FileText className="mr-2 h-4 w-4" />
                                View Contracts
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

        <TabsContent value="cards" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredCustomers.map((customer) => (
              <Card key={customer.id} className="hover:shadow-lg transition-all duration-200 cursor-pointer" onClick={() => handleViewProfile(customer)}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={customer.avatar} />
                        <AvatarFallback>
                          {customer.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{customer.name}</CardTitle>
                        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>{customer.location}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <Checkbox
                        checked={selectedCustomers.includes(customer.id)}
                        onCheckedChange={(checked) => {
                          handleSelectCustomer(customer.id, checked as boolean)
                        }}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div className="relative" data-dropdown-container>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                          onClick={(e) => toggleDropdown(`card-${customer.id}`, e)}
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
                        </Button>
                        {openDropdown === `card-${customer.id}` && (
                          <div 
                            className="absolute right-0 top-8 bg-white border rounded-md shadow-lg p-1 min-w-[180px] z-50"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button 
                              className="w-full text-left px-2 py-1.5 text-sm hover:bg-gray-100 rounded flex items-center"
                              onClick={(e) => {
                                e.stopPropagation(); 
                                setOpenDropdown(null);
                                handleViewProfile(customer);
                              }}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Profile
                            </button>
                            <button 
                              className="w-full text-left px-2 py-1.5 text-sm hover:bg-gray-100 rounded flex items-center"
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenDropdown(null);
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Details
                            </button>
                            {canImpersonate() && (
                              <>
                                <div className="border-t my-1"></div>
                                <button 
                                  className="w-full text-left px-2 py-1.5 text-sm hover:bg-gray-100 rounded flex items-center text-orange-600"
                                  onClick={(e) => {
                                    e.stopPropagation(); 
                                    setOpenDropdown(null);
                                    handleImpersonate(customer.id);
                                  }}
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  Impersonate Customer
                                </button>
                              </>
                            )}
                            <button 
                              className="w-full text-left px-2 py-1.5 text-sm hover:bg-gray-100 rounded flex items-center"
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenDropdown(null);
                              }}
                            >
                              <FileText className="mr-2 h-4 w-4" />
                              View Contracts
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(customer.status)}>
                        {customer.status}
                      </Badge>
                      <Badge className={getTierColor(customer.tier)}>
                        {customer.tier}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-1">
                      {getPaymentMethodIcon(customer.paymentHistory.preferredMethod)}
                      <span className="text-xs text-muted-foreground">{customer.paymentHistory.preferredMethod}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Total Investment</p>
                      <p className="font-semibold text-green-600">€{customer.totalInvestment.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Shares Owned</p>
                      <p className="font-semibold">{customer.totalShares}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Usage Days</p>
                      <p className="font-semibold">{customer.totalUsageDays}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Used Days</p>
                      <p className="font-semibold">{customer.usedDays}</p>
                    </div>
                  </div>
                  
                  {/* Usage Progress */}
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Usage Progress</span>
                        <span>{Math.round((customer.usedDays / customer.totalUsageDays) * 100)}%</span>
                      </div>
                      <Progress value={(customer.usedDays / customer.totalUsageDays) * 100} className="h-2" />
                    </div>
                  </div>

                  {/* Ownership Summary */}
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div className="flex items-center justify-between">
                      <span>Properties:</span>
                      <span className="font-medium">{customer.timeshareOwnerships.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Distributor:</span>
                      <span className="font-medium">{customer.distributorName || "Direct"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Joined:</span>
                      <span>{new Date(customer.joinDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Last Active:</span>
                      <span>{new Date(customer.lastActivity).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t">
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" onClick={(e) => {e.stopPropagation()}}>
                        <Phone className="h-3 w-3 mr-1" />
                        Call
                      </Button>
                      <Button variant="outline" size="sm" onClick={(e) => {e.stopPropagation()}}>
                        <Mail className="h-3 w-3 mr-1" />
                        Email
                      </Button>
                    </div>
                    <Button variant="default" size="sm" onClick={(e) => {e.stopPropagation(); handleViewProfile(customer)}}>
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
    </div>
  )
}
