"use client"

import { useState } from "react"
import { Plus, Search, Filter, MoreHorizontal, Phone, Mail, Calendar, Edit, Trash2, Eye, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
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

// Pipeline stages configuration
const pipelineStages = [
  { id: "new", name: "New Leads", color: "bg-gray-100" },
  { id: "contacted", name: "Contacted", color: "bg-blue-100" },
  { id: "qualified", name: "Qualified", color: "bg-yellow-100" },
  { id: "proposal", name: "Proposal", color: "bg-orange-100" },
  { id: "negotiation", name: "Negotiation", color: "bg-purple-100" },
  { id: "won", name: "Won", color: "bg-green-100" },
  { id: "lost", name: "Lost", color: "bg-red-100" },
]

// Mock pipeline data
const leads = [
  {
    id: 1,
    name: "Sarah Johnson",
    company: "TechCorp",
    title: "Marketing Director",
    email: "sarah@techcorp.com",
    phone: "+1 (555) 123-4567",
    stage: "qualified",
    value: 15000,
    probability: 75,
    lastActivity: "2 hours ago",
    nextAction: "Send proposal",
    source: "Website",
    avatar: "/placeholder-user.jpg",
    assignedTo: "John Doe",
    tags: ["enterprise", "hot-lead"],
  },
  {
    id: 2,
    name: "Mike Chen",
    company: "StartupXYZ",
    title: "CEO",
    email: "mike@startupxyz.com",
    phone: "+1 (555) 987-6543",
    stage: "new",
    value: 8500,
    probability: 25,
    lastActivity: "1 day ago",
    nextAction: "Initial call",
    source: "Referral",
    avatar: "/placeholder-user.jpg",
    assignedTo: "John Doe",
    tags: ["startup"],
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    company: "Growth Inc",
    title: "VP Sales",
    email: "emily@growth.com",
    phone: "+1 (555) 456-7890",
    stage: "proposal",
    value: 25000,
    probability: 85,
    lastActivity: "3 days ago",
    nextAction: "Follow up on proposal",
    source: "Trade Show",
    avatar: "/placeholder-user.jpg",
    assignedTo: "John Doe",
    tags: ["decision-maker", "large-deal"],
  },
  {
    id: 4,
    name: "David Wilson",
    company: "Enterprise Solutions",
    title: "IT Manager",
    email: "david@enterprise.com",
    phone: "+1 (555) 321-0987",
    stage: "contacted",
    value: 12000,
    probability: 45,
    lastActivity: "1 week ago",
    nextAction: "Schedule demo",
    source: "Email Campaign",
    avatar: "/placeholder-user.jpg",
    assignedTo: "John Doe",
    tags: ["technical"],
  },
  {
    id: 5,
    name: "Lisa Zhang",
    company: "Innovation Labs",
    title: "CTO",
    email: "lisa@innovation.com",
    phone: "+1 (555) 555-1234",
    stage: "negotiation",
    value: 35000,
    probability: 90,
    lastActivity: "1 hour ago",
    nextAction: "Contract review",
    source: "Cold Outreach",
    avatar: "/placeholder-user.jpg",
    assignedTo: "John Doe",
    tags: ["enterprise", "technical", "high-value"],
  },
  {
    id: 6,
    name: "Robert Kim",
    company: "Digital Agency",
    title: "Owner",
    email: "robert@digital.com",
    phone: "+1 (555) 777-8888",
    stage: "won",
    value: 18000,
    probability: 100,
    lastActivity: "Yesterday",
    nextAction: "Onboarding",
    source: "Social Media",
    avatar: "/placeholder-user.jpg",
    assignedTo: "John Doe",
    tags: ["closed-won", "agency"],
  },
]

const stats = [
  { 
    label: "Total Pipeline Value", 
    value: "$113,500", 
    change: "+15.2%",
    icon: TrendingUp 
  },
  { 
    label: "Active Opportunities", 
    value: "23", 
    change: "+3",
    icon: TrendingUp 
  },
  { 
    label: "Average Deal Size", 
    value: "$18,917", 
    change: "+8.7%",
    icon: TrendingUp 
  },
  { 
    label: "Win Rate", 
    value: "28.5%", 
    change: "+2.1%",
    icon: TrendingUp 
  },
]

export default function PipelinePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [stageFilter, setStageFilter] = useState("all")

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.company.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStage = stageFilter === "all" || lead.stage === stageFilter
    return matchesSearch && matchesStage
  })

  const getLeadsByStage = (stageId: string) => {
    return filteredLeads.filter(lead => lead.stage === stageId)
  }

  const getTotalValueByStage = (stageId: string) => {
    return getLeadsByStage(stageId).reduce((sum, lead) => sum + lead.value, 0)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const LeadCard = ({ lead }: { lead: typeof leads[0] }) => (
    <Card className="group hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500 bg-white">
      <CardContent className="p-4">
        {/* Header with avatar and actions */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start space-x-3 min-w-0 flex-1">
            <Avatar className="h-10 w-10 flex-shrink-0 ring-2 ring-blue-100">
              <AvatarImage src={lead.avatar} />
              <AvatarFallback className="text-sm font-medium bg-blue-50">
                {lead.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <h4 className="font-semibold text-sm leading-tight truncate text-gray-900">
                {lead.name}
              </h4>
              <p className="text-xs text-gray-600 truncate font-medium">
                {lead.title}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {lead.company}
              </p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                Edit Lead
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Task
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Value and Probability */}
        <div className="flex items-center justify-between mb-3 p-2 bg-gray-50 rounded-lg">
          <div>
            <p className="text-xs text-gray-500 mb-1">Deal Value</p>
            <span className="text-lg font-bold text-green-600">
              {formatCurrency(lead.value)}
            </span>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 mb-1">Probability</p>
            <Badge variant="outline" className="text-sm font-semibold">
              {lead.probability}%
            </Badge>
          </div>
        </div>

        {/* Next Action */}
        <div className="bg-orange-50 border border-orange-200 rounded-md p-3 mb-3">
          <div className="flex items-center mb-1">
            <Calendar className="h-3 w-3 mr-2 text-orange-600" />
            <p className="text-xs font-semibold text-orange-700">Next Action</p>
          </div>
          <p className="text-sm text-orange-800 font-medium line-clamp-2">{lead.nextAction}</p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {lead.tags.slice(0, 2).map((tag) => (
            <Badge 
              key={tag} 
              variant="secondary" 
              className="text-xs px-2 py-1 bg-blue-50 text-blue-700 border-blue-200"
            >
              {tag}
            </Badge>
          ))}
          {lead.tags.length > 2 && (
            <Badge variant="outline" className="text-xs px-2 py-1">
              +{lead.tags.length - 2} more
            </Badge>
          )}
        </div>

        {/* Contact Actions & Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex space-x-1">
            <Button size="icon" variant="ghost" className="h-7 w-7 hover:bg-blue-50">
              <Phone className="h-3 w-3 text-blue-600" />
            </Button>
            <Button size="icon" variant="ghost" className="h-7 w-7 hover:bg-blue-50">
              <Mail className="h-3 w-3 text-blue-600" />
            </Button>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 font-medium">{lead.assignedTo}</p>
            <p className="text-xs text-gray-400">{lead.lastActivity}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sales Pipeline</h1>
          <p className="text-muted-foreground">
            Track your opportunities through the sales process
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Lead
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

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        
        <Select value={stageFilter} onValueChange={setStageFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by stage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stages</SelectItem>
            {pipelineStages.map((stage) => (
              <SelectItem key={stage.id} value={stage.id}>
                {stage.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Pipeline Kanban Board */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max">
          {pipelineStages.map((stage) => {
            const stageLeads = getLeadsByStage(stage.id)
            const stageValue = getTotalValueByStage(stage.id)
            
            return (
              <div key={stage.id} className="flex flex-col w-80 flex-shrink-0">
                <div className={`p-4 rounded-t-lg ${stage.color} border-b-2 border-gray-200`}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-sm text-gray-800">{stage.name}</h3>
                    <Badge variant="secondary" className="text-xs font-semibold">
                      {stageLeads.length}
                    </Badge>
                  </div>
                  <p className="text-sm font-bold text-gray-700">
                    {formatCurrency(stageValue)}
                  </p>
                </div>
                
                <div className="flex-1 p-4 bg-gray-50/80 rounded-b-lg min-h-[500px] max-h-[700px] overflow-y-auto">
                  <div className="space-y-4">
                    {stageLeads.map((lead) => (
                      <LeadCard key={lead.id} lead={lead} />
                    ))}
                    
                    {stageLeads.length === 0 && (
                      <div className="text-center py-12 text-muted-foreground">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                          <Plus className="h-8 w-8 text-gray-400" />
                        </div>
                        <p className="text-sm">No leads in this stage</p>
                        <p className="text-xs mt-1">Add a lead to get started</p>
                      </div>
                    )}
                    
                    <Button 
                      variant="outline" 
                      className="w-full mt-4 border-dashed border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-colors"
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Lead
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
