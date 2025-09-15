"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  Users, 
  Search, 
  Plus, 
  Eye, 
  Edit, 
  MoreHorizontal,
  TrendingUp,
  Crown,
  Award,
  UserPlus,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Star,
  Target,
  DollarSign,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Building2
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface TeamMember {
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
  level: number
  children?: TeamMember[]
  performance: {
    thisMonth: number
    lastMonth: number
    growth: number
  }
}

// Mock team data with hierarchical structure
const mockTeamData: TeamMember[] = [
  {
    id: "tm-001",
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
    directRecruit: 3,
    teamSize: 8,
    lastActivity: "2025-09-12",
    level: 1,
    performance: { thisMonth: 3250, lastMonth: 2800, growth: 16.1 },
    children: [
      {
        id: "tm-002",
        name: "Michael Chen",
        email: "michael.chen@email.com",
        rank: "Silver",
        status: "active",
        joinDate: "2023-06-20",
        location: "Los Angeles, CA",
        personalVolume: 2100,
        groupVolume: 4500,
        totalCommission: 1250.00,
        directRecruit: 2,
        teamSize: 3,
        lastActivity: "2025-09-11",
        level: 2,
        performance: { thisMonth: 2100, lastMonth: 1950, growth: 7.7 },
        children: [
          {
            id: "tm-003",
            name: "Emma Wilson",
            email: "emma.wilson@email.com",
            rank: "Bronze",
            status: "active",
            joinDate: "2023-08-10",
            location: "San Diego, CA",
            personalVolume: 1200,
            groupVolume: 1200,
            totalCommission: 380.00,
            directRecruit: 0,
            teamSize: 1,
            lastActivity: "2025-09-10",
            level: 3,
            performance: { thisMonth: 1200, lastMonth: 1100, growth: 9.1 }
          }
        ]
      },
      {
        id: "tm-004",
        name: "David Rodriguez",
        email: "david.rodriguez@email.com",
        rank: "Silver",
        status: "active",
        joinDate: "2023-07-05",
        location: "Phoenix, AZ",
        personalVolume: 2200,
        groupVolume: 3800,
        totalCommission: 1150.00,
        directRecruit: 1,
        teamSize: 2,
        lastActivity: "2025-09-13",
        level: 2,
        performance: { thisMonth: 2200, lastMonth: 2000, growth: 10.0 },
        children: [
          {
            id: "tm-005",
            name: "Lisa Anderson",
            email: "lisa.anderson@email.com",
            rank: "Bronze",
            status: "pending",
            joinDate: "2025-08-15",
            location: "Las Vegas, NV",
            personalVolume: 850,
            groupVolume: 850,
            totalCommission: 255.00,
            directRecruit: 0,
            teamSize: 1,
            lastActivity: "2025-09-09",
            level: 3,
            performance: { thisMonth: 850, lastMonth: 400, growth: 112.5 }
          }
        ]
      }
    ]
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

interface TeamMemberCardProps {
  member: TeamMember
  onViewProfile: (member: TeamMember) => void
  level: number
}

function TeamMemberCard({ member, onViewProfile, level }: TeamMemberCardProps) {
  const [isExpanded, setIsExpanded] = useState(level < 3)
  const hasChildren = member.children && member.children.length > 0

  return (
    <div className={`ml-${level * 4}`}>
      <Card className="mb-4 hover:shadow-md transition-all duration-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {hasChildren && (
                <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="p-0 h-6 w-6">
                      {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </Button>
                  </CollapsibleTrigger>
                </Collapsible>
              )}
              <Avatar className="h-10 w-10">
                <AvatarImage src={member.avatar} />
                <AvatarFallback>
                  {member.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-semibold">{member.name}</h4>
                <p className="text-sm text-muted-foreground">{member.email}</p>
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>{member.location}</span>
                  <span>•</span>
                  <Calendar className="h-3 w-3" />
                  <span>Joined {new Date(member.joinDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={getRankColor(member.rank)}>{member.rank}</Badge>
              <Badge className={getStatusColor(member.status)}>{member.status}</Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onViewProfile(member)}>
                    <Eye className="mr-2 h-4 w-4" />
                    View Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Details
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Phone className="mr-2 h-4 w-4" />
                    Call: {member.phone}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Mail className="mr-2 h-4 w-4" />
                    Send Email
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Target className="mr-2 h-4 w-4" />
                    Set Goals
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Award className="mr-2 h-4 w-4" />
                    Performance Review
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Personal Volume</p>
              <p className="font-semibold">${member.personalVolume.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Group Volume</p>
              <p className="font-semibold">${member.groupVolume.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Team Size</p>
              <p className="font-semibold">{member.teamSize}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Commission</p>
              <p className="font-semibold text-green-600">${member.totalCommission.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Direct Recruits</p>
              <p className="font-semibold">{member.directRecruit}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Growth</p>
              <p className={`font-semibold ${member.performance.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {member.performance.growth >= 0 ? '+' : ''}{member.performance.growth.toFixed(1)}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {hasChildren && (
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleContent className="space-y-2">
            <div className="ml-4 border-l-2 border-muted pl-4">
              {member.children?.map((child) => (
                <TeamMemberCard
                  key={child.id}
                  member={child}
                  onViewProfile={onViewProfile}
                  level={level + 1}
                />
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  )
}

export function TeamHierarchy() {
  const [searchTerm, setSearchTerm] = useState("")
  const [levelFilter, setLevelFilter] = useState("all")
  const [rankFilter, setRankFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const handleViewProfile = (member: TeamMember) => {
    window.location.href = `/dashboard/distributors/${member.id}`
  }

  // Team summary stats
  const totalTeamSize = mockTeamData.reduce((acc, member) => acc + member.teamSize, 0)
  const totalVolume = mockTeamData.reduce((acc, member) => acc + member.groupVolume, 0)
  const totalCommission = mockTeamData.reduce((acc, member) => acc + member.totalCommission, 0)
  const activeMembers = mockTeamData.filter(member => member.status === "active").length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team Hierarchy</h1>
          <p className="text-muted-foreground">
            View and manage your distributor team structure and performance
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <UserPlus className="h-4 w-4 mr-2" />
            Add Team Member
          </Button>
          <Button>
            <TrendingUp className="h-4 w-4 mr-2" />
            Performance Report
          </Button>
        </div>
      </div>

      {/* Team Summary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Team Size</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTeamSize}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">{activeMembers}</span> active members
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Group Volume</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalVolume.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12.5%</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Commission</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalCommission.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+8.3%</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Levels</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Maximum depth levels
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-muted/50 rounded-lg">
        <div className="relative flex-1 min-w-[250px] max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search team members..."
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

        <Select value={levelFilter} onValueChange={setLevelFilter}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="1">Level 1</SelectItem>
            <SelectItem value="2">Level 2</SelectItem>
            <SelectItem value="3">Level 3</SelectItem>
            <SelectItem value="4">Level 4+</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Team Hierarchy */}
      <Card>
        <CardHeader>
          <CardTitle>Team Structure</CardTitle>
          <CardDescription>
            Hierarchical view of your team with performance metrics and growth indicators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockTeamData.map((member) => (
              <TeamMemberCard
                key={member.id}
                member={member}
                onViewProfile={handleViewProfile}
                level={0}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
