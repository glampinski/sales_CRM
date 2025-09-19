"use client"

import { useState } from "react"
import { Plus, Search, Filter, MoreHorizontal, Phone, Mail, Calendar, Edit, Trash2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Mock contact data
const contacts = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah@example.com",
    phone: "+1 (555) 123-4567",
    company: "TechCorp",
    title: "Marketing Director",
    status: "qualified",
    source: "website",
    leadScore: 85,
    lastActivity: "2 hours ago",
    nextFollowUp: "Tomorrow 2:00 PM",
    avatar: "/placeholder-user.jpg",
    tags: ["hot-lead", "enterprise"],
  },
  {
    id: 2,
    name: "Mike Chen",
    email: "mike@example.com",
    phone: "+1 (555) 987-6543",
    company: "StartupXYZ",
    title: "CEO",
    status: "new",
    source: "referral",
    leadScore: 45,
    lastActivity: "1 day ago",
    nextFollowUp: "Next week",
    avatar: "/placeholder-user.jpg",
    tags: ["startup"],
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    email: "emily@example.com",
    phone: "+1 (555) 456-7890",
    company: "Growth Inc",
    title: "VP Sales",
    status: "proposal",
    source: "trade_show",
    leadScore: 92,
    lastActivity: "3 days ago",
    nextFollowUp: "Today 4:00 PM",
    avatar: "/placeholder-user.jpg",
    tags: ["decision-maker"],
  },
  {
    id: 4,
    name: "David Wilson",
    email: "david@example.com",
    phone: "+1 (555) 321-0987",
    company: "Enterprise Solutions",
    title: "IT Manager",
    status: "contacted",
    source: "email_campaign",
    leadScore: 68,
    lastActivity: "1 week ago",
    nextFollowUp: "Friday 10:00 AM",
    avatar: "/placeholder-user.jpg",
    tags: ["technical"],
  },
]

const statusColors = {
  new: "secondary",
  contacted: "outline",
  qualified: "default",
  proposal: "default",
  negotiation: "default",
  won: "default",
  lost: "destructive",
} as const

const stats = [
  { label: "Total Contacts", value: "2,847", change: "+12.5%" },
  { label: "Qualified Leads", value: "342", change: "+8.2%" },
  { label: "This Month Added", value: "89", change: "+22.1%" },
  { label: "Conversion Rate", value: "24.5%", change: "+2.1%" },
]

export default function ContactsPage() {
  const [viewMode, setViewMode] = useState<"table" | "cards">("table")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredContacts = contacts.filter(contact => 
    statusFilter === "all" || contact.status === statusFilter
  )

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
          <p className="text-muted-foreground">
            Manage your leads and customer relationships
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Contact
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
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

      {/* Filters and Search */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search contacts..."
            className="pl-8"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Contacts</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="qualified">Qualified</SelectItem>
            <SelectItem value="proposal">Proposal</SelectItem>
            <SelectItem value="won">Won</SelectItem>
            <SelectItem value="lost">Lost</SelectItem>
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contact</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Lead Score</TableHead>
                  <TableHead>Last Activity</TableHead>
                  <TableHead>Next Follow-up</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContacts.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={contact.avatar} />
                          <AvatarFallback>
                            {contact.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{contact.name}</div>
                          <div className="text-sm text-muted-foreground">{contact.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{contact.company}</div>
                        <div className="text-sm text-muted-foreground">{contact.title}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusColors[contact.status as keyof typeof statusColors]}>
                        {contact.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="w-12 text-sm font-medium">{contact.leadScore}</div>
                        <div className={`w-2 h-2 rounded-full ml-2 ${
                          contact.leadScore >= 80 ? 'bg-green-500' :
                          contact.leadScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`} />
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {contact.lastActivity}
                    </TableCell>
                    <TableCell className="text-sm">
                      {contact.nextFollowUp}
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
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Contact
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
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="cards" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredContacts.map((contact) => (
              <Card key={contact.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={contact.avatar} />
                      <AvatarFallback>
                        {contact.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{contact.name}</CardTitle>
                      <CardDescription>
                        {contact.title} at {contact.company}
                      </CardDescription>
                    </div>
                    <Badge variant={statusColors[contact.status as keyof typeof statusColors]}>
                      {contact.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{contact.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{contact.phone}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">Lead Score:</span>
                      <div className="flex items-center">
                        <span className="text-sm font-medium">{contact.leadScore}</span>
                        <div className={`w-2 h-2 rounded-full ml-2 ${
                          contact.leadScore >= 80 ? 'bg-green-500' :
                          contact.leadScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`} />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {contact.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex space-x-1">
                      <Button size="icon" variant="outline" className="h-8 w-8">
                        <Phone className="h-3 w-3" />
                      </Button>
                      <Button size="icon" variant="outline" className="h-8 w-8">
                        <Mail className="h-3 w-3" />
                      </Button>
                      <Button size="icon" variant="outline" className="h-8 w-8">
                        <Calendar className="h-3 w-3" />
                      </Button>
                    </div>
                    <Button variant="ghost" size="sm">
                      View Details
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
