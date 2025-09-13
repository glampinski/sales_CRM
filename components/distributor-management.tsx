"use client"

import { useState } from "react"
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
  Send
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DistributorSummary {
  id: string
  name: string
  email: string
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
}

// Mock distributors data
const mockDistributors: DistributorSummary[] = [
  {
    id: "dist-001",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
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
    lastActivity: "2025-09-12"
  },
  {
    id: "dist-002", 
    name: "Michael Chen",
    email: "michael.chen@email.com",
    rank: "Silver",
    status: "active",
    joinDate: "2023-06-20",
    location: "New York, NY",
    personalVolume: 2100,
    groupVolume: 8500,
    totalCommission: 1875.00,
    directRecruit: 4,
    teamSize: 12,
    lastActivity: "2025-09-11"
  },
  {
    id: "dist-003",
    name: "Emma Wilson",
    email: "emma.wilson@email.com",
    rank: "Platinum",
    status: "active",
    joinDate: "2022-11-10",
    location: "Los Angeles, CA",
    personalVolume: 4500,
    groupVolume: 32000,
    totalCommission: 8500.00,
    directRecruit: 12,
    teamSize: 45,
    lastActivity: "2025-09-13"
  },
  {
    id: "dist-004",
    name: "David Rodriguez",
    email: "david.rodriguez@email.com",
    rank: "Bronze",
    status: "pending",
    joinDate: "2025-08-15",
    location: "Miami, FL",
    personalVolume: 850,
    groupVolume: 1200,
    totalCommission: 425.00,
    directRecruit: 1,
    teamSize: 3,
    lastActivity: "2025-09-10"
  },
  {
    id: "dist-005",
    name: "Lisa Anderson",
    email: "lisa.anderson@email.com",
    rank: "Diamond",
    status: "active",
    joinDate: "2021-08-05",
    location: "Chicago, IL",
    personalVolume: 6200,
    groupVolume: 85000,
    totalCommission: 18750.00,
    directRecruit: 18,
    teamSize: 89,
    lastActivity: "2025-09-13"
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
  { label: "Total Distributors", value: "156", change: "+12", icon: Users },
  { label: "Active This Month", value: "142", change: "+8", icon: TrendingUp },
  { label: "New This Month", value: "24", change: "+15", icon: UserPlus },
  { label: "Diamond Rank", value: "8", change: "+2", icon: Crown },
]

export function DistributorManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [rankFilter, setRankFilter] = useState("all")
  const [viewMode, setViewMode] = useState<"table" | "cards">("table")

  const filteredDistributors = mockDistributors.filter(distributor => {
    const matchesSearch = distributor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         distributor.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || distributor.status === statusFilter
    const matchesRank = rankFilter === "all" || distributor.rank === rankFilter
    return matchesSearch && matchesStatus && matchesRank
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Distributor Management</h1>
          <p className="text-muted-foreground">
            Manage your distributor network and track performance
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Distributor
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
                <span className="text-green-600">+{stat.change}</span> from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search distributors..."
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
          </SelectContent>
        </Select>

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
              <CardTitle>Distributors ({filteredDistributors.length})</CardTitle>
              <CardDescription>
                Complete list of distributors in your network
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Distributor</TableHead>
                    <TableHead>Rank</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Personal Volume</TableHead>
                    <TableHead>Group Volume</TableHead>
                    <TableHead>Team Size</TableHead>
                    <TableHead>Commission</TableHead>
                    <TableHead>Last Activity</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDistributors.map((distributor) => (
                    <TableRow key={distributor.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={distributor.avatar} />
                            <AvatarFallback>
                              {distributor.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{distributor.name}</p>
                            <p className="text-sm text-muted-foreground">{distributor.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getRankColor(distributor.rank)}>
                          {distributor.rank}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(distributor.status)}>
                          {distributor.status}
                        </Badge>
                      </TableCell>
                      <TableCell>${distributor.personalVolume.toLocaleString()}</TableCell>
                      <TableCell>${distributor.groupVolume.toLocaleString()}</TableCell>
                      <TableCell>{distributor.teamSize}</TableCell>
                      <TableCell>${distributor.totalCommission.toLocaleString()}</TableCell>
                      <TableCell>
                        {new Date(distributor.lastActivity).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Send className="mr-2 h-4 w-4" />
                              Send Message
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

        <TabsContent value="cards" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredDistributors.map((distributor) => (
              <Card key={distributor.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={distributor.avatar} />
                        <AvatarFallback>
                          {distributor.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{distributor.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{distributor.location}</p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Send className="mr-2 h-4 w-4" />
                          Send Message
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getRankColor(distributor.rank)}>
                      {distributor.rank}
                    </Badge>
                    <Badge className={getStatusColor(distributor.status)}>
                      {distributor.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Personal Volume</p>
                      <p className="font-semibold">${distributor.personalVolume.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Group Volume</p>
                      <p className="font-semibold">${distributor.groupVolume.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Team Size</p>
                      <p className="font-semibold">{distributor.teamSize}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Commission</p>
                      <p className="font-semibold text-green-600">${distributor.totalCommission.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-xs text-muted-foreground">
                      Last active: {new Date(distributor.lastActivity).toLocaleDateString()}
                    </span>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
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
