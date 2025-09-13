"use client"

import { useState } from "react"
import { Plus, Search, Filter, MoreHorizontal, Crown, TrendingUp, Users, Mail, Phone, Calendar, Edit, Eye, UserPlus, Ban } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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

// Mock distributor data
const distributors = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah@example.com",
    phone: "+1 (555) 123-4567",
    rank: "Gold",
    status: "active",
    joinDate: "2021-03-20",
    sponsor: "John Doe",
    personalPV: 890,
    groupPV: 4250,
    teamSize: 12,
    currentCommission: 1234.50,
    lifetime: 18650.25,
    lastActivity: "2 hours ago",
    avatar: "/placeholder-user.jpg",
    location: "New York, NY",
    nextRank: "Diamond",
    progressToNext: 75,
  },
  {
    id: 2,
    name: "David Wilson",
    email: "david@example.com",
    phone: "+1 (555) 987-6543",
    rank: "Silver",
    status: "active",
    joinDate: "2021-07-12",
    sponsor: "John Doe",
    personalPV: 780,
    groupPV: 2100,
    teamSize: 8,
    currentCommission: 890.25,
    lifetime: 12340.80,
    lastActivity: "1 day ago",
    avatar: "/placeholder-user.jpg",
    location: "Los Angeles, CA",
    nextRank: "Gold",
    progressToNext: 60,
  },
  {
    id: 3,
    name: "Mike Chen",
    email: "mike@example.com",
    phone: "+1 (555) 456-7890",
    rank: "Silver",
    status: "active",
    joinDate: "2022-06-10",
    sponsor: "Sarah Johnson",
    personalPV: 650,
    groupPV: 1200,
    teamSize: 5,
    currentCommission: 567.80,
    lifetime: 8945.60,
    lastActivity: "3 days ago",
    avatar: "/placeholder-user.jpg",
    location: "Chicago, IL",
    nextRank: "Gold",
    progressToNext: 45,
  },
  {
    id: 4,
    name: "Emily Rodriguez",
    email: "emily@example.com",
    phone: "+1 (555) 321-0987",
    rank: "Bronze",
    status: "active",
    joinDate: "2022-08-15",
    sponsor: "Sarah Johnson",
    personalPV: 420,
    groupPV: 420,
    teamSize: 2,
    currentCommission: 234.60,
    lifetime: 3456.90,
    lastActivity: "1 week ago",
    avatar: "/placeholder-user.jpg",
    location: "Miami, FL",
    nextRank: "Silver",
    progressToNext: 30,
  },
  {
    id: 5,
    name: "Lisa Zhang",
    email: "lisa@example.com",
    phone: "+1 (555) 555-1234",
    rank: "Bronze",
    status: "inactive",
    joinDate: "2023-01-05",
    sponsor: "David Wilson",
    personalPV: 180,
    groupPV: 180,
    teamSize: 1,
    currentCommission: 89.40,
    lifetime: 1234.50,
    lastActivity: "2 weeks ago",
    avatar: "/placeholder-user.jpg",
    location: "Seattle, WA",
    nextRank: "Silver",
    progressToNext: 15,
  },
]

const stats = [
  { label: "Total Distributors", value: "47", change: "+3", icon: Users },
  { label: "Active This Month", value: "42", change: "+1", icon: TrendingUp },
  { label: "New This Month", value: "8", change: "+2", icon: UserPlus },
  { label: "Team Volume", value: "15,680", change: "+12.5%", icon: TrendingUp },
]

const rankColors = {
  Diamond: "bg-blue-100 text-blue-800",
  Gold: "bg-yellow-100 text-yellow-800",
  Silver: "bg-gray-100 text-gray-800",
  Bronze: "bg-orange-100 text-orange-800",
  Distributor: "bg-green-100 text-green-800",
}

const statusColors = {
  active: "default" as const,
  inactive: "secondary" as const,
  suspended: "destructive" as const,
}

export default function DistributorsPage() {
  const [viewMode, setViewMode] = useState<"table" | "cards">("cards")
  const [statusFilter, setStatusFilter] = useState("all")
  const [rankFilter, setRankFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredDistributors = distributors.filter(distributor => {
    const matchesSearch = distributor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         distributor.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || distributor.status === statusFilter
    const matchesRank = rankFilter === "all" || distributor.rank === rankFilter
    return matchesSearch && matchesStatus && matchesRank
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const DistributorCard = ({ distributor }: { distributor: typeof distributors[0] }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={distributor.avatar} />
              <AvatarFallback>
                {distributor.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <CardTitle className="text-lg flex items-center gap-2">
                {distributor.name}
                {distributor.rank === "Diamond" && <Crown className="h-4 w-4 text-yellow-500" />}
              </CardTitle>
              <CardDescription className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge className={rankColors[distributor.rank as keyof typeof rankColors]}>
                    {distributor.rank}
                  </Badge>
                  <Badge variant={statusColors[distributor.status as keyof typeof statusColors]}>
                    {distributor.status}
                  </Badge>
                </div>
                <p className="text-sm">{distributor.location}</p>
              </CardDescription>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost">
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
                <Mail className="mr-2 h-4 w-4" />
                Send Message
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Call
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <Ban className="mr-2 h-4 w-4" />
                Suspend
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Personal PV</p>
            <p className="text-lg font-semibold">{distributor.personalPV.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Group PV</p>
            <p className="text-lg font-semibold">{distributor.groupPV.toLocaleString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Team Size</p>
            <p className="text-lg font-semibold">{distributor.teamSize}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">This Month</p>
            <p className="text-lg font-semibold text-green-600">
              {formatCurrency(distributor.currentCommission)}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Progress to {distributor.nextRank}</span>
            <span>{distributor.progressToNext}%</span>
          </div>
          <Progress value={distributor.progressToNext} className="h-2" />
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Joined {new Date(distributor.joinDate).toLocaleDateString()}</span>
          <span>Active {distributor.lastActivity}</span>
        </div>

        <div className="flex items-center space-x-2">
          <Button size="sm" variant="outline" className="flex-1">
            <Phone className="h-3 w-3 mr-1" />
            Call
          </Button>
          <Button size="sm" variant="outline" className="flex-1">
            <Mail className="h-3 w-3 mr-1" />
            Email
          </Button>
          <Button size="sm" className="flex-1">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Distributors</h1>
          <p className="text-muted-foreground">
            Manage your team of distributors and track their performance
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
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
                <span className="text-green-600">{stat.change}</span> from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters and View Toggle */}
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
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>

        <Select value={rankFilter} onValueChange={setRankFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Filter by rank" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Ranks</SelectItem>
            <SelectItem value="Diamond">Diamond</SelectItem>
            <SelectItem value="Gold">Gold</SelectItem>
            <SelectItem value="Silver">Silver</SelectItem>
            <SelectItem value="Bronze">Bronze</SelectItem>
            <SelectItem value="Distributor">Distributor</SelectItem>
          </SelectContent>
        </Select>

        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "table" | "cards")}>
          <TabsList>
            <TabsTrigger value="cards">Cards</TabsTrigger>
            <TabsTrigger value="table">Table</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content */}
      <Tabs value={viewMode} className="space-y-4">
        <TabsContent value="cards" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredDistributors.map((distributor) => (
              <DistributorCard key={distributor.id} distributor={distributor} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="table" className="space-y-4">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Distributor</TableHead>
                  <TableHead>Rank</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Personal PV</TableHead>
                  <TableHead>Group PV</TableHead>
                  <TableHead>Team Size</TableHead>
                  <TableHead>This Month</TableHead>
                  <TableHead>Last Activity</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDistributors.map((distributor) => (
                  <TableRow key={distributor.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={distributor.avatar} />
                          <AvatarFallback>
                            {distributor.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{distributor.name}</div>
                          <div className="text-sm text-muted-foreground">{distributor.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={rankColors[distributor.rank as keyof typeof rankColors]}>
                        {distributor.rank}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusColors[distributor.status as keyof typeof statusColors]}>
                        {distributor.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{distributor.personalPV.toLocaleString()}</TableCell>
                    <TableCell>{distributor.groupPV.toLocaleString()}</TableCell>
                    <TableCell>{distributor.teamSize}</TableCell>
                    <TableCell className="text-green-600 font-medium">
                      {formatCurrency(distributor.currentCommission)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {distributor.lastActivity}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <Button size="icon" variant="ghost" className="h-8 w-8">
                          <Phone className="h-3 w-3" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8">
                          <Mail className="h-3 w-3" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost" className="h-8 w-8">
                              <MoreHorizontal className="h-3 w-3" />
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
                              <Calendar className="mr-2 h-4 w-4" />
                              Schedule Call
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Ban className="mr-2 h-4 w-4" />
                              Suspend
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
