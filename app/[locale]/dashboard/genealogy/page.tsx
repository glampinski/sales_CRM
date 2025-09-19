"use client"

import { useState } from "react"
import { Search, Filter, Users, TrendingUp, Crown, Plus, MoreHorizontal, Eye, Edit, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { GenealogyTree } from "@/components/genealogy-tree"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

// Mock genealogy data - keeping original for list view
const genealogyData = {
  id: "user-1",
  name: "John Doe",
  rank: "Diamond",
  personalPV: 1245,
  groupPV: 15680,
  status: "active",
  joinDate: "2020-01-15",
  avatar: "/placeholder-user.jpg",
  children: [
    {
      id: "user-2",
      name: "Sarah Johnson", 
      rank: "Gold",
      personalPV: 890,
      groupPV: 4250,
      status: "active",
      joinDate: "2021-03-20",
      avatar: "/placeholder-user.jpg",
      children: []
    },
    {
      id: "user-3",
      name: "Mike Chen",
      rank: "Silver", 
      personalPV: 567,
      groupPV: 2100,
      status: "active",
      joinDate: "2021-07-15",
      avatar: "/placeholder-user.jpg",
      children: []
    }
  ]
}

interface DistributorNode {
  id: string
  name: string
  rank: string
  personalPV: number
  groupPV: number
  status: string
  joinDate: string
  avatar: string
  children: DistributorNode[]
}

const stats = [
  { label: "Total Distributors", value: "156", change: "+12%", icon: Users },
  { label: "Active This Month", value: "142", change: "+8%", icon: TrendingUp },
  { label: "New Recruits", value: "24", change: "+15%", icon: Plus },
  { label: "Team Volume", value: "$45,280", change: "+18%", icon: Crown },
]

const rankColors = {
  Diamond: "bg-blue-500 text-white",
  Gold: "bg-yellow-500 text-white", 
  Silver: "bg-gray-400 text-white",
  Bronze: "bg-orange-600 text-white",
  Distributor: "bg-green-500 text-white"
}

export default function GenealogyPage() {
  const [viewMode, setViewMode] = useState<"tree" | "list">("tree")
  const [searchTerm, setSearchTerm] = useState("")
  const [rankFilter, setRankFilter] = useState("all")

  const DistributorCard = ({ distributor, level = 0 }: { distributor: DistributorNode, level?: number }) => {
    const [isExpanded, setIsExpanded] = useState(level < 2)

    return (
      <div className="space-y-4">
        <Card className={`transition-all hover:shadow-md ${level === 0 ? 'ring-2 ring-primary' : ''}`}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={distributor.avatar} />
                  <AvatarFallback>
                    {distributor.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    {distributor.name}
                    {level === 0 && <Crown className="h-4 w-4 text-yellow-500" />}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Badge className={rankColors[distributor.rank as keyof typeof rankColors]}>
                      {distributor.rank}
                    </Badge>
                    <span>Joined {new Date(distributor.joinDate).toLocaleDateString()}</span>
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {distributor.children.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsExpanded(!isExpanded)}
                  >
                    {isExpanded ? 'Collapse' : 'Expand'} ({distributor.children.length})
                  </Button>
                )}
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
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Add Team Member
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>

        {isExpanded && distributor.children.length > 0 && (
          <div className="ml-8 space-y-4">
            {distributor.children.map((child) => (
              <DistributorCard key={child.id} distributor={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    )
  }

  // Flatten the tree for list view
  const flattenDistributors = (node: DistributorNode, level = 0): (DistributorNode & { level: number })[] => {
    const result = [{ ...node, level }]
    node.children.forEach(child => {
      result.push(...flattenDistributors(child, level + 1))
    })
    return result
  }

  const allDistributors = flattenDistributors(genealogyData)
  const filteredDistributors = allDistributors.filter(dist => {
    const matchesSearch = dist.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRank = rankFilter === "all" || dist.rank === rankFilter
    return matchesSearch && matchesRank
  })

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Genealogy Tree</h1>
          <p className="text-muted-foreground">
            View and manage your team structure
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Team Member
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
            placeholder="Search team members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        
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

        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "tree" | "list")}>
          <TabsList>
            <TabsTrigger value="tree">Tree View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content */}
      <Tabs value={viewMode} className="space-y-4">
        <TabsContent value="tree" className="space-y-4">
          <GenealogyTree />
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          <div className="grid gap-4">
            {filteredDistributors.map((distributor) => (
              <Card key={distributor.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={distributor.avatar} />
                      <AvatarFallback>
                        {distributor.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="font-medium" style={{ marginLeft: `${distributor.level * 20}px` }}>
                          {distributor.name}
                        </p>
                        <Badge className={rankColors[distributor.rank as keyof typeof rankColors]}>
                          {distributor.rank}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Level {distributor.level + 1} • Joined {new Date(distributor.joinDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6 text-sm">
                    <div>
                      <p className="text-muted-foreground">Personal PV</p>
                      <p className="font-semibold">{distributor.personalPV.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Group PV</p>
                      <p className="font-semibold">{distributor.groupPV.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={distributor.status === "active" ? "default" : "secondary"}>
                        {distributor.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
