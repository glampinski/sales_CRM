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
  TrendingUp,
  Crown,
  Award,
  UserPlus,
  Download,
  Send,
  Calendar,
  MapPin,
  Building2,
  Phone,
  Mail,
  RefreshCw,
  SortAsc,
  SortDesc,
  Settings,
  FileText,
  Activity,
  Star
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
import { DistributorActions } from "@/components/affiliate-actions"
import { DistributorAnalytics } from "@/components/affiliate-analytics"
import { TeamHierarchy } from "@/components/team-hierarchy"
import { PerformanceTracking } from "@/components/performance-tracking"

interface AffiliateSummary {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  rank: "Bronze" | "Silver" | "Gold" | "Platinum" | "Diamond" | "Ambassador"
  status: "active" | "inactive" | "pending" | "suspended"
  joinDate: string
  location: string
  personalVolume: number
  groupVolume: number
  totalCommission: number
  directRecruit: number
  teamSize: number
  lastActivity: string
  sponsor?: string
  notes?: string
  achievementPoints: number
  nextRankRequirement: number
  profileCompleteness: number
}

type SortField = "name" | "rank" | "status" | "personalVolume" | "groupVolume" | "teamSize" | "totalCommission" | "joinDate" | "lastActivity"
type SortDirection = "asc" | "desc"

interface TableColumn {
  key: string
  label: string
  sortable: boolean
  visible: boolean
}

// Mock affiliates data
const mockAffiliates: AffiliateSummary[] = [
  {
    id: "dist-001",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    avatar: "/placeholder-user.jpg",
    rank: "Gold",
    status: "active",
    joinDate: "2023-03-15",
    location: "San Francisco, CA",
    personalVolume: 3250,
    groupVolume: 18750,
    totalCommission: 4687.50,
    directRecruit: 8,
    teamSize: 23,
    lastActivity: "2025-09-12",
    sponsor: "Michael Thompson",
    notes: "High performer, excellent team builder",
    achievementPoints: 1250,
    nextRankRequirement: 2000,
    profileCompleteness: 95
  },
  {
    id: "dist-002", 
    name: "Michael Chen",
    email: "michael.chen@email.com",
    phone: "+1 (555) 234-5678",
    rank: "Silver",
    status: "active",
    joinDate: "2023-06-20",
    location: "New York, NY",
    personalVolume: 2100,
    groupVolume: 8500,
    totalCommission: 1875.00,
    directRecruit: 4,
    teamSize: 12,
    lastActivity: "2025-09-11",
    sponsor: "Jennifer Davis",
    notes: "Consistent performer, needs support with team building",
    achievementPoints: 850,
    nextRankRequirement: 1500,
    profileCompleteness: 88
  },
  {
    id: "dist-003",
    name: "Emma Wilson",
    email: "emma.wilson@email.com",
    phone: "+1 (555) 345-6789",
    rank: "Platinum",
    status: "active",
    joinDate: "2022-11-10",
    location: "Los Angeles, CA",
    personalVolume: 4500,
    groupVolume: 32000,
    totalCommission: 8500.00,
    directRecruit: 12,
    teamSize: 45,
    lastActivity: "2025-09-13",
    sponsor: "Robert Miller",
    notes: "Top performer, mentor to new distributors",
    achievementPoints: 3200,
    nextRankRequirement: 5000,
    profileCompleteness: 98
  },
  {
    id: "dist-004",
    name: "David Rodriguez",
    email: "david.rodriguez@email.com",
    phone: "+1 (555) 456-7890",
    rank: "Bronze",
    status: "pending",
    joinDate: "2025-08-15",
    location: "Miami, FL",
    personalVolume: 850,
    groupVolume: 1200,
    totalCommission: 425.00,
    directRecruit: 1,
    teamSize: 3,
    lastActivity: "2025-09-10",
    sponsor: "Amanda Wilson",
    notes: "New distributor, requires onboarding support",
    achievementPoints: 150,
    nextRankRequirement: 500,
    profileCompleteness: 65
  },
  {
    id: "dist-005",
    name: "Lisa Anderson",
    email: "lisa.anderson@email.com",
    phone: "+1 (555) 567-8901",
    rank: "Diamond",
    status: "active",
    joinDate: "2021-08-05",
    location: "Chicago, IL",
    personalVolume: 6200,
    groupVolume: 85000,
    totalCommission: 18750.00,
    directRecruit: 18,
    teamSize: 89,
    lastActivity: "2025-09-13",
    sponsor: "Corporate",
    notes: "Regional leader, excellent mentor and trainer",
    achievementPoints: 8500,
    nextRankRequirement: 10000,
    profileCompleteness: 100
  }
]

const getRankColor = (rank: string) => {
  switch (rank) {
    case "Diamond": return "bg-blue-500 text-white"
    case "Platinum": return "bg-gray-400 text-white"
    case "Gold": return "bg-yellow-500 text-white"
    case "Silver": return "bg-gray-300 text-black"
    case "Bronze": return "bg-orange-600 text-white"
    case "Ambassador": return "bg-purple-600 text-white"
    default: return "bg-gray-200 text-black"
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "active": return "bg-green-500 text-white"
    case "inactive": return "bg-gray-500 text-white"
    case "pending": return "bg-yellow-500 text-white"
    case "suspended": return "bg-red-500 text-white"
    default: return "bg-gray-200 text-black"
  }
}

const stats = [
  { label: "Total Affiliates", value: "156", change: "+12", icon: Users },
  { label: "Active This Month", value: "142", change: "+8", icon: TrendingUp },
  { label: "New This Month", value: "24", change: "+15", icon: UserPlus },
  { label: "Diamond Rank", value: "8", change: "+2", icon: Crown },
]

const defaultColumns: TableColumn[] = [
  { key: "affiliate", label: "Affiliate", sortable: true, visible: true },
  { key: "rank", label: "Rank", sortable: true, visible: true },
  { key: "status", label: "Status", sortable: true, visible: true },
  { key: "personalVolume", label: "Personal Volume", sortable: true, visible: true },
  { key: "groupVolume", label: "Group Volume", sortable: true, visible: true },
  { key: "teamSize", label: "Team Size", sortable: true, visible: true },
  { key: "commission", label: "Commission", sortable: true, visible: true },
  { key: "joinDate", label: "Join Date", sortable: true, visible: false },
  { key: "lastActivity", label: "Last Activity", sortable: true, visible: true },
  { key: "location", label: "Location", sortable: true, visible: false },
  { key: "sponsor", label: "Sponsor", sortable: true, visible: false },
  { key: "progress", label: "Progress", sortable: false, visible: false },
]

export function AffiliateManagement() {
  const { canImpersonate, startImpersonation } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [rankFilter, setRankFilter] = useState("all")
  const [locationFilter, setLocationFilter] = useState("all")
  const [viewMode, setViewMode] = useState<"table" | "cards" | "analytics" | "team" | "performance">("table")
  const [selectedAffiliates, setSelectedAffiliates] = useState<string[]>([])
  const [showArchived, setShowArchived] = useState(false)
  const [sortField, setSortField] = useState<SortField>("name")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [tableColumns, setTableColumns] = useState<TableColumn[]>(defaultColumns)
  const [isLoading, setIsLoading] = useState(false)
  const [compactView, setCompactView] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(false)
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

  const toggleDropdown = (affiliateId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    // Ensure no focus issues
    (event.target as HTMLElement).blur();
    setOpenDropdown(openDropdown === affiliateId ? null : affiliateId);
  };

  // Get unique locations for filter
  const uniqueLocations = Array.from(new Set(mockAffiliates.map((d: AffiliateSummary) => d.location.split(',')[1]?.trim() || d.location)))

  // Create alias for consistency
  const filteredAffiliates = mockAffiliates.filter((affiliate: AffiliateSummary) => {
    const matchesSearch = affiliate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         affiliate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         affiliate.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (affiliate.sponsor && affiliate.sponsor.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === "all" || affiliate.status === statusFilter
    const matchesRank = rankFilter === "all" || affiliate.rank === rankFilter
    const matchesLocation = locationFilter === "all" || affiliate.location.includes(locationFilter)
    return matchesSearch && matchesStatus && matchesRank && matchesLocation
  }).sort((a, b) => {
    let aValue: any
    let bValue: any
    
    switch (sortField) {
      case "name":
        aValue = a.name
        bValue = b.name
        break
      case "rank":
        const rankOrder = ["Bronze", "Silver", "Gold", "Platinum", "Diamond", "Ambassador"]
        aValue = rankOrder.indexOf(a.rank)
        bValue = rankOrder.indexOf(b.rank)
        break
      case "status":
        aValue = a.status
        bValue = b.status
        break
      case "personalVolume":
        aValue = a.personalVolume
        bValue = b.personalVolume
        break
      case "groupVolume":
        aValue = a.groupVolume
        bValue = b.groupVolume
        break
      case "teamSize":
        aValue = a.teamSize
        bValue = b.teamSize
        break
      case "totalCommission":
        aValue = a.totalCommission
        bValue = b.totalCommission
        break
      case "joinDate":
        aValue = new Date(a.joinDate)
        bValue = new Date(b.joinDate)
        break
      case "lastActivity":
        aValue = new Date(a.lastActivity)
        bValue = new Date(b.lastActivity)
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
      setSelectedAffiliates(filteredAffiliates.map(d => d.id))
    } else {
      setSelectedAffiliates([])
    }
  }

  const handleSelectAffiliate = (affiliateId: string, checked: boolean) => {
    if (checked) {
      setSelectedAffiliates(prev => [...prev, affiliateId])
    } else {
      setSelectedAffiliates(prev => prev.filter(id => id !== affiliateId))
    }
  }

  const handleClearSelection = () => {
    setSelectedAffiliates([])
  }

  const handleRefresh = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  const handleViewProfile = (affiliate: AffiliateSummary) => {
    // Navigate to the detailed profile page
    window.location.href = `/dashboard/affiliates/${affiliate.id}`
  }

  const handleImpersonate = (affiliateId: string) => {
    // Map affiliate to user ID (admin or salesperson)
    // In real app, this would look up the actual user ID for the affiliate
    const affiliateUserId = affiliateId === "1" ? "2" : "3" // Map to admin or salesperson
    const success = startImpersonation(affiliateUserId)
    if (success) {
      // Redirect to show affiliate dashboard view
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

  // Auto-refresh functionality
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(handleRefresh, 30000) // Refresh every 30 seconds
      return () => clearInterval(interval)
    }
  }, [autoRefresh])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Affiliate Management</h1>
          <p className="text-muted-foreground">
            Manage your affiliate network and track performance ({filteredAffiliates.length} of {mockAffiliates.length} affiliates)
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2 text-sm">
            <Switch
              id="auto-refresh"
              checked={autoRefresh}
              onCheckedChange={setAutoRefresh}
            />
            <Label htmlFor="auto-refresh">Auto-refresh</Label>
          </div>
          <Separator orientation="vertical" className="h-6" />
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
        </div>
      </div>

      {/* Actions Component */}
      <DistributorActions 
        selectedDistributors={selectedAffiliates}
        onClearSelection={handleClearSelection}
        onRefresh={handleRefresh}
      />

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
                <span className="text-green-600">+{stat.change}</span> from last month
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
            placeholder="Search distributors, emails, locations..."
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
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>

        <Select value={rankFilter} onValueChange={setRankFilter}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Rank" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Ranks</SelectItem>
            <SelectItem value="Diamond">Diamond</SelectItem>
            <SelectItem value="Platinum">Platinum</SelectItem>
            <SelectItem value="Gold">Gold</SelectItem>
            <SelectItem value="Silver">Silver</SelectItem>
            <SelectItem value="Bronze">Bronze</SelectItem>
            <SelectItem value="Ambassador">Ambassador</SelectItem>
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

        <DropdownMenu>
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

        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "table" | "cards" | "analytics" | "team" | "performance")}>
          <TabsList>
            <TabsTrigger value="table">Table</TabsTrigger>
            <TabsTrigger value="cards">Cards</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="team">Team Hierarchy</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content */}
      <Tabs value={viewMode} className="space-y-4">
        <TabsContent value="table" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Affiliates ({filteredAffiliates.length})</CardTitle>
              <CardDescription>
                Complete list of affiliates in your network with enhanced sorting and filtering
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedAffiliates.length === filteredAffiliates.length && filteredAffiliates.length > 0}
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
                  {filteredAffiliates.map((affiliate) => (
                    <TableRow key={affiliate.id} className={compactView ? "h-12" : ""}>
                      <TableCell>
                        <Checkbox
                          checked={selectedAffiliates.includes(affiliate.id)}
                          onCheckedChange={(checked) => handleSelectAffiliate(affiliate.id, checked as boolean)}
                        />
                      </TableCell>
                      
                      {tableColumns.find(col => col.key === "affiliate")?.visible && (
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className={compactView ? "h-6 w-6" : "h-8 w-8"}>
                              <AvatarImage src={affiliate.avatar} />
                              <AvatarFallback>
                                {affiliate.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className={`font-medium ${compactView ? 'text-sm' : ''}`}>{affiliate.name}</p>
                              {!compactView && (
                                <p className="text-sm text-muted-foreground">{affiliate.email}</p>
                              )}
                            </div>
                          </div>
                        </TableCell>
                      )}
                      
                      {tableColumns.find(col => col.key === "rank")?.visible && (
                        <TableCell>
                          <Badge className={`${getRankColor(affiliate.rank)} ${compactView ? 'text-xs px-1.5 py-0.5' : ''}`}>
                            {affiliate.rank}
                          </Badge>
                        </TableCell>
                      )}
                      
                      {tableColumns.find(col => col.key === "status")?.visible && (
                        <TableCell>
                          <Badge className={`${getStatusColor(affiliate.status)} ${compactView ? 'text-xs px-1.5 py-0.5' : ''}`}>
                            {affiliate.status}
                          </Badge>
                        </TableCell>
                      )}
                      
                      {tableColumns.find(col => col.key === "personalVolume")?.visible && (
                        <TableCell className={compactView ? 'text-sm' : ''}>${affiliate.personalVolume.toLocaleString()}</TableCell>
                      )}
                      
                      {tableColumns.find(col => col.key === "groupVolume")?.visible && (
                        <TableCell className={compactView ? 'text-sm' : ''}>${affiliate.groupVolume.toLocaleString()}</TableCell>
                      )}
                      
                      {tableColumns.find(col => col.key === "teamSize")?.visible && (
                        <TableCell className={compactView ? 'text-sm' : ''}>{affiliate.teamSize}</TableCell>
                      )}
                      
                      {tableColumns.find(col => col.key === "commission")?.visible && (
                        <TableCell className={`text-green-600 font-medium ${compactView ? 'text-sm' : ''}`}>
                          ${affiliate.totalCommission.toLocaleString()}
                        </TableCell>
                      )}
                      
                      {tableColumns.find(col => col.key === "joinDate")?.visible && (
                        <TableCell className={compactView ? 'text-sm' : ''}>
                          {new Date(affiliate.joinDate).toLocaleDateString()}
                        </TableCell>
                      )}
                      
                      {tableColumns.find(col => col.key === "lastActivity")?.visible && (
                        <TableCell className={compactView ? 'text-sm' : ''}>
                          {new Date(affiliate.lastActivity).toLocaleDateString()}
                        </TableCell>
                      )}
                      
                      {tableColumns.find(col => col.key === "location")?.visible && (
                        <TableCell className={compactView ? 'text-sm' : ''}>
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{affiliate.location}</span>
                          </div>
                        </TableCell>
                      )}
                      
                      {tableColumns.find(col => col.key === "sponsor")?.visible && (
                        <TableCell className={compactView ? 'text-sm' : ''}>{affiliate.sponsor || "N/A"}</TableCell>
                      )}
                      
                      {tableColumns.find(col => col.key === "progress")?.visible && (
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>Profile: {affiliate.profileCompleteness}%</span>
                              <span>Rank Progress</span>
                            </div>
                            <div className="space-y-1">
                              <Progress value={affiliate.profileCompleteness} className="h-1" />
                              <Progress 
                                value={(affiliate.achievementPoints / affiliate.nextRankRequirement) * 100} 
                                className="h-1" 
                              />
                            </div>
                          </div>
                        </TableCell>
                      )}
                      
                      <TableCell>
                        <div className="relative" data-dropdown-container>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={(e) => toggleDropdown(affiliate.id, e)}
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
                          {openDropdown === affiliate.id && (
                            <div 
                              className="absolute right-0 top-8 bg-white border rounded-md shadow-lg p-1 min-w-[200px] z-50"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button 
                                className="w-full text-left px-2 py-1.5 text-sm hover:bg-gray-100 rounded flex items-center"
                                onClick={(e) => {
                                  e.stopPropagation(); 
                                  setOpenDropdown(null);
                                  handleViewProfile(affiliate);
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
                                      handleImpersonate(affiliate.id);
                                    }}
                                  >
                                    <Eye className="mr-2 h-4 w-4" />
                                    Impersonate Affiliate
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
                                <Send className="mr-2 h-4 w-4" />
                                Send Message
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredAffiliates.map((affiliate) => (
              <Card key={affiliate.id} className="hover:shadow-lg transition-all duration-200 cursor-pointer" onClick={() => handleViewProfile(affiliate)}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={affiliate.avatar} />
                        <AvatarFallback>
                          {affiliate.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{affiliate.name}</CardTitle>
                        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>{affiliate.location}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <Checkbox
                        checked={selectedAffiliates.includes(affiliate.id)}
                        onCheckedChange={(checked) => {
                          handleSelectAffiliate(affiliate.id, checked as boolean)
                        }}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div className="relative" data-dropdown-container>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                          onClick={(e) => toggleDropdown(`card-${affiliate.id}`, e)}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                        {openDropdown === `card-${affiliate.id}` && (
                          <div 
                            className="absolute right-0 top-8 bg-white border rounded-md shadow-lg p-1 min-w-[180px] z-50"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button 
                              className="w-full text-left px-2 py-1.5 text-sm hover:bg-gray-100 rounded flex items-center"
                              onClick={(e) => {
                                e.stopPropagation(); 
                                setOpenDropdown(null);
                                handleViewProfile(affiliate);
                              }}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Profile
                            </button>
                            {canImpersonate() && (
                              <>
                                <div className="border-t my-1"></div>
                                <button 
                                  className="w-full text-left px-2 py-1.5 text-sm hover:bg-gray-100 rounded flex items-center text-orange-600"
                                  onClick={(e) => {
                                    e.stopPropagation(); 
                                    setOpenDropdown(null);
                                    handleImpersonate(affiliate.id);
                                  }}
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  Impersonate Affiliate
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge className={getRankColor(affiliate.rank)}>
                        {affiliate.rank}
                      </Badge>
                      <Badge className={getStatusColor(affiliate.status)}>
                        {affiliate.status}
                      </Badge>
                    </div>
                    {affiliate.rank === "Diamond" && (
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Personal Volume</p>
                      <p className="font-semibold">${affiliate.personalVolume.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Group Volume</p>
                      <p className="font-semibold">${affiliate.groupVolume.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Team Size</p>
                      <p className="font-semibold">{affiliate.teamSize}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Commission</p>
                      <p className="font-semibold text-green-600">${affiliate.totalCommission.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  {/* Progress Indicators */}
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Profile Complete</span>
                        <span>{affiliate.profileCompleteness}%</span>
                      </div>
                      <Progress value={affiliate.profileCompleteness} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Next Rank Progress</span>
                        <span>{Math.round((affiliate.achievementPoints / affiliate.nextRankRequirement) * 100)}%</span>
                      </div>
                      <Progress 
                        value={(affiliate.achievementPoints / affiliate.nextRankRequirement) * 100} 
                        className="h-2" 
                      />
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div className="flex items-center justify-between">
                      <span>Sponsor:</span>
                      <span className="font-medium">{affiliate.sponsor || "Direct"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Joined:</span>
                      <span>{new Date(affiliate.joinDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Last Active:</span>
                      <span>{new Date(affiliate.lastActivity).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t">
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" onClick={(e) => {e.stopPropagation(); /* Call functionality */}}>
                        <Phone className="h-3 w-3 mr-1" />
                        Call
                      </Button>
                      <Button variant="outline" size="sm" onClick={(e) => {e.stopPropagation(); /* Email functionality */}}>
                        <Mail className="h-3 w-3 mr-1" />
                        Email
                      </Button>
                    </div>
                    <Button variant="default" size="sm" onClick={(e) => {e.stopPropagation(); handleViewProfile(affiliate)}}>
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <DistributorAnalytics />
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <TeamHierarchy />
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <PerformanceTracking />
        </TabsContent>
      </Tabs>
    </div>
  )
}
