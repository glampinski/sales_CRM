"use client"

import React, { useState, useMemo } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Search, 
  Filter, 
  Download, 
  Users, 
  TrendingUp, 
  DollarSign, 
  Crown,
  MoreHorizontal,
  Eye,
  Edit,
  Mail,
  MessageSquare,
  UserPlus,
  Star
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface AffiliateSummary {
  id: string
  name: string
  email: string
  phone: string
  joinDate: string
  status: 'active' | 'inactive' | 'pending' | 'suspended'
  rank: string
  location: string
  sponsor?: string
  personalVolume: number
  teamVolume: number
  commission: number
  teamSize: number
  avatar?: string
  notes?: string
}

// Mock affiliates data
const mockAffiliates: AffiliateSummary[] = [
  {
    id: "aff-001",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    phone: "+1 (555) 123-4567",
    joinDate: "2023-01-15",
    status: "active",
    rank: "Diamond",
    location: "New York, NY",
    sponsor: "Michael Chen",
    personalVolume: 15420,
    teamVolume: 125000,
    commission: 8750,
    teamSize: 47,
    avatar: "/placeholder-user.jpg",
    notes: "Top performer, mentor to new affiliates"
  },
  {
    id: "aff-002", 
    name: "Michael Chen",
    email: "michael@example.com",
    phone: "+1 (555) 234-5678",
    joinDate: "2022-08-22",
    status: "active",
    rank: "Platinum",
    location: "Los Angeles, CA", 
    personalVolume: 12500,
    teamVolume: 89000,
    commission: 6230,
    teamSize: 32,
    avatar: "/placeholder-user.jpg"
  },
  {
    id: "aff-003",
    name: "Emma Wilson",
    email: "emma@example.com", 
    phone: "+1 (555) 345-6789",
    joinDate: "2024-01-10",
    status: "pending",
    rank: "Bronze",
    location: "Chicago, IL",
    sponsor: "Sarah Johnson",
    personalVolume: 2340,
    teamVolume: 2340,
    commission: 164,
    teamSize: 3,
    avatar: "/placeholder-user.jpg",
    notes: "New affiliate, requires onboarding support"
  }
]

const summaryStats = [
  { label: "Total Affiliates", value: "156", change: "+12", icon: Users },
  { label: "Active This Month", value: "142", change: "+8", icon: TrendingUp },
  { label: "Total Commission", value: "$125.4K", change: "+15%", icon: DollarSign },
  { label: "Top Performers", value: "23", change: "+3", icon: Crown }
]

const tableColumns = [
  { key: "affiliate", label: "Affiliate", sortable: true, visible: true },
  { key: "status", label: "Status", sortable: true, visible: true },
  { key: "rank", label: "Rank", sortable: true, visible: true },
  { key: "location", label: "Location", sortable: true, visible: true },
  { key: "teamSize", label: "Team Size", sortable: true, visible: true },
  { key: "personalVolume", label: "Personal Volume", sortable: true, visible: true },
  { key: "commission", label: "Commission", sortable: true, visible: true },
  { key: "joinDate", label: "Join Date", sortable: true, visible: false },
  { key: "actions", label: "Actions", sortable: false, visible: true }
]

export function AffiliateManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [rankFilter, setRankFilter] = useState("all")
  const [locationFilter, setLocationFilter] = useState("all")
  const [selectedAffiliates, setSelectedAffiliates] = useState<string[]>([])
  const [compactView, setCompactView] = useState(false)
  const [sortConfig, setSortConfig] = useState<{key: string, direction: 'asc' | 'desc'} | null>(null)

  const uniqueLocations = Array.from(new Set(mockAffiliates.map((d: AffiliateSummary) => d.location.split(',')[1]?.trim() || d.location)))

  const filteredAffiliates = mockAffiliates.filter((affiliate: AffiliateSummary) => {
    const matchesSearch = affiliate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         affiliate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         affiliate.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (affiliate.sponsor && affiliate.sponsor.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === "all" || affiliate.status === statusFilter
    const matchesRank = rankFilter === "all" || affiliate.rank === rankFilter
    const matchesLocation = locationFilter === "all" || affiliate.location.includes(locationFilter)
    
    return matchesSearch && matchesStatus && matchesRank && matchesLocation
  }).sort((a: AffiliateSummary, b: AffiliateSummary) => {
    if (!sortConfig) return 0
    
    const aValue = a[sortConfig.key as keyof AffiliateSummary] as any
    const bValue = b[sortConfig.key as keyof AffiliateSummary] as any
    
    if (!aValue || !bValue) return 0
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
    return 0
  })

  const handleSelectAll = () => {
    if (selectedAffiliates.length === filteredAffiliates.length) {
      setSelectedAffiliates([])
    } else {
      setSelectedAffiliates(filteredAffiliates.map((d: AffiliateSummary) => d.id))
    }
  }

  const handleSelectAffiliate = (affiliateId: string) => {
    setSelectedAffiliates(prev => 
      prev.includes(affiliateId) 
        ? prev.filter(id => id !== affiliateId)
        : [...prev, affiliateId]
    )
  }

  const handleViewProfile = (affiliate: AffiliateSummary) => {
    console.log("View profile for:", affiliate.name)
  }

  const statusColors = {
    active: "bg-green-100 text-green-800",
    inactive: "bg-gray-100 text-gray-800", 
    pending: "bg-yellow-100 text-yellow-800",
    suspended: "bg-red-100 text-red-800"
  }

  const rankColors = {
    Diamond: "bg-blue-100 text-blue-800",
    Platinum: "bg-purple-100 text-purple-800",
    Gold: "bg-yellow-100 text-yellow-800",
    Silver: "bg-gray-100 text-gray-800",
    Bronze: "bg-orange-100 text-orange-800"
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Affiliate Management</h1>
          <p className="text-muted-foreground">
            Manage your affiliate network and track performance ({filteredAffiliates.length} of {mockAffiliates.length} affiliates)
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <UserPlus className="h-4 w-4 mr-2" />
            Add Affiliate
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {summaryStats.map((stat, index) => (
          <Card key={index}>
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

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filter Affiliates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by name, email, location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger id="status" className="w-[180px]">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="rank">Rank</Label>
              <Select value={rankFilter} onValueChange={setRankFilter}>
                <SelectTrigger id="rank" className="w-[180px]">
                  <SelectValue placeholder="All ranks" />
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
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger id="location" className="w-[180px]">
                  <SelectValue placeholder="All locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {uniqueLocations.map((location) => (
                    <SelectItem key={location} value={location}>{location}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Affiliates Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Affiliates ({filteredAffiliates.length})</CardTitle>
              <CardDescription>Manage and monitor your affiliate network</CardDescription>
            </div>
            <div className="flex gap-2">
              {selectedAffiliates.length > 0 && (
                <Button variant="outline" size="sm">
                  Actions ({selectedAffiliates.length})
                </Button>
              )}
            </div>
          </div>
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
                <TableHead>Affiliate</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Rank</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Team Size</TableHead>
                <TableHead>Personal Volume</TableHead>
                <TableHead>Commission</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAffiliates.map((affiliate) => (
                <TableRow key={affiliate.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedAffiliates.includes(affiliate.id)}
                      onCheckedChange={() => handleSelectAffiliate(affiliate.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={affiliate.avatar} />
                        <AvatarFallback>
                          {affiliate.name.split(' ').map((n: string) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{affiliate.name}</div>
                        <div className="text-sm text-muted-foreground">{affiliate.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${statusColors[affiliate.status]} border-0`}>
                      {affiliate.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${rankColors[affiliate.rank as keyof typeof rankColors]} border-0`}>
                      {affiliate.rank}
                    </Badge>
                  </TableCell>
                  <TableCell>{affiliate.location}</TableCell>
                  <TableCell>{affiliate.teamSize}</TableCell>
                  <TableCell>${affiliate.personalVolume.toLocaleString()}</TableCell>
                  <TableCell>${affiliate.commission.toLocaleString()}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleViewProfile(affiliate)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="mr-2 h-4 w-4" />
                          Send Email
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Contact
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
    </div>
  )
}
