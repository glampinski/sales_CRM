"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Plus,
  Search,
  Filter,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Calendar,
  Paperclip,
  Send,
  Eye
} from "lucide-react"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Ticket {
  id: string
  title: string
  description: string
  status: "open" | "in_progress" | "waiting_response" | "resolved" | "closed"
  priority: "low" | "medium" | "high" | "urgent"
  category: "technical" | "billing" | "commission" | "account" | "general"
  createdAt: string
  updatedAt: string
  assignedTo?: string
  messages: TicketMessage[]
}

interface TicketMessage {
  id: string
  author: string
  authorType: "customer" | "agent"
  message: string
  timestamp: string
  attachments?: string[]
}

// Mock data
const mockTickets: Ticket[] = [
  {
    id: "TKT-001",
    title: "Commission calculation issue for August",
    description: "My commission for August seems incorrect. I sold 3 packages but only received commission for 2.",
    status: "in_progress",
    priority: "high",
    category: "commission",
    createdAt: "2025-09-10T10:30:00Z",
    updatedAt: "2025-09-12T14:20:00Z",
    assignedTo: "Support Agent Sarah",
    messages: [
      {
        id: "msg_001",
        author: "John Doe",
        authorType: "customer",
        message: "My commission for August seems incorrect. I sold 3 packages but only received commission for 2.",
        timestamp: "2025-09-10T10:30:00Z"
      },
      {
        id: "msg_002",
        author: "Support Agent Sarah",
        authorType: "agent",
        message: "Hi John, I'm looking into your commission calculation. Can you please provide the order numbers for the 3 packages you mentioned?",
        timestamp: "2025-09-11T09:15:00Z"
      },
      {
        id: "msg_003",
        author: "John Doe",
        authorType: "customer",
        message: "Sure! The order numbers are: ORD-2401, ORD-2402, and ORD-2403. All were completed in August.",
        timestamp: "2025-09-11T14:30:00Z"
      }
    ]
  },
  {
    id: "TKT-002",
    title: "Unable to access team hierarchy",
    description: "When I click on 'Team Hierarchy' in my dashboard, I get an error message.",
    status: "open",
    priority: "medium",
    category: "technical",
    createdAt: "2025-09-13T16:45:00Z",
    updatedAt: "2025-09-13T16:45:00Z",
    messages: [
      {
        id: "msg_004",
        author: "John Doe",
        authorType: "customer",
        message: "When I click on 'Team Hierarchy' in my dashboard, I get an error message saying 'Access Denied'. This was working fine last week.",
        timestamp: "2025-09-13T16:45:00Z"
      }
    ]
  },
  {
    id: "TKT-003",
    title: "Request for payout method update",
    description: "I need to update my bank account information for payouts.",
    status: "resolved",
    priority: "low",
    category: "account",
    createdAt: "2025-09-08T11:20:00Z",
    updatedAt: "2025-09-09T10:15:00Z",
    assignedTo: "Support Agent Mike",
    messages: [
      {
        id: "msg_005",
        author: "John Doe",
        authorType: "customer",
        message: "I need to update my bank account information for payouts. My old bank closed and I opened a new account.",
        timestamp: "2025-09-08T11:20:00Z"
      },
      {
        id: "msg_006",
        author: "Support Agent Mike",
        authorType: "agent",
        message: "I've updated your bank account information as requested. The changes will take effect with your next payout.",
        timestamp: "2025-09-09T10:15:00Z"
      }
    ]
  }
]

export function SupportTicketSystem() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [isNewTicketDialogOpen, setIsNewTicketDialogOpen] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [newTicket, setNewTicket] = useState({
    title: "",
    description: "",
    category: "",
    priority: "medium"
  })
  const [newMessage, setNewMessage] = useState("")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-100 text-blue-800"
      case "in_progress":
        return "bg-yellow-100 text-yellow-800"
      case "waiting_response":
        return "bg-orange-100 text-orange-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      case "closed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <MessageSquare className="h-4 w-4" />
      case "in_progress":
        return <Clock className="h-4 w-4" />
      case "waiting_response":
        return <AlertCircle className="h-4 w-4" />
      case "resolved":
      case "closed":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <MessageSquare className="h-4 w-4" />
    }
  }

  const filteredTickets = mockTickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter
    const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  })

  const handleCreateTicket = () => {
    const ticket: Ticket = {
      id: `TKT-${Date.now()}`,
      title: newTicket.title,
      description: newTicket.description,
      status: "open",
      priority: newTicket.priority as any,
      category: newTicket.category as any,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [
        {
          id: `msg_${Date.now()}`,
          author: "John Doe",
          authorType: "customer",
          message: newTicket.description,
          timestamp: new Date().toISOString()
        }
      ]
    }
    
    console.log("Creating ticket:", ticket)
    setIsNewTicketDialogOpen(false)
    setNewTicket({ title: "", description: "", category: "", priority: "medium" })
  }

  const handleSendMessage = () => {
    if (!selectedTicket || !newMessage.trim()) return
    
    const message: TicketMessage = {
      id: `msg_${Date.now()}`,
      author: "John Doe",
      authorType: "customer",
      message: newMessage,
      timestamp: new Date().toISOString()
    }
    
    console.log("Sending message:", message)
    setNewMessage("")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Support Tickets</h1>
          <p className="text-muted-foreground">
            Get help and track your support requests
          </p>
        </div>
        <Dialog open={isNewTicketDialogOpen} onOpenChange={setIsNewTicketDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Ticket
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Support Ticket</DialogTitle>
              <DialogDescription>
                Describe your issue and we'll help you resolve it
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Brief description of your issue"
                  value={newTicket.title}
                  onChange={(e) => setNewTicket(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={newTicket.category} onValueChange={(value) => setNewTicket(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technical">Technical Issue</SelectItem>
                      <SelectItem value="billing">Billing & Payments</SelectItem>
                      <SelectItem value="commission">Commission Questions</SelectItem>
                      <SelectItem value="account">Account Management</SelectItem>
                      <SelectItem value="general">General Inquiry</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={newTicket.priority} onValueChange={(value) => setNewTicket(prev => ({ ...prev, priority: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Please provide detailed information about your issue..."
                  rows={4}
                  value={newTicket.description}
                  onChange={(e) => setNewTicket(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsNewTicketDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateTicket}>
                Create Ticket
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockTickets.filter(t => t.status === "open").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockTickets.filter(t => t.status === "in_progress").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Waiting Response</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockTickets.filter(t => t.status === "waiting_response").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockTickets.filter(t => t.status === "resolved").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="waiting_response">Waiting Response</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tickets List */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Tickets List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Tickets ({filteredTickets.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => setSelectedTicket(ticket)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(ticket.status)}
                      <span className="font-medium">{ticket.id}</span>
                    </div>
                    <div className="flex space-x-2">
                      <Badge className={getPriorityColor(ticket.priority)}>
                        {ticket.priority}
                      </Badge>
                      <Badge className={getStatusColor(ticket.status)}>
                        {ticket.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                  <h4 className="font-medium mb-2">{ticket.title}</h4>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                    {ticket.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                    <span>{ticket.messages.length} messages</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Ticket Detail */}
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedTicket ? `Ticket ${selectedTicket.id}` : "Select a Ticket"}
            </CardTitle>
            {selectedTicket && (
              <div className="flex space-x-2">
                <Badge className={getPriorityColor(selectedTicket.priority)}>
                  {selectedTicket.priority}
                </Badge>
                <Badge className={getStatusColor(selectedTicket.status)}>
                  {selectedTicket.status.replace('_', ' ')}
                </Badge>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {selectedTicket ? (
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">{selectedTicket.title}</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Created: {new Date(selectedTicket.createdAt).toLocaleString()}
                  </p>
                </div>

                {/* Messages */}
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {selectedTicket.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.authorType === "customer" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.authorType === "customer"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <div className="flex items-center space-x-2 mb-1">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback>
                              {message.author.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">{message.author}</span>
                          <span className="text-xs opacity-70">
                            {new Date(message.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm">{message.message}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Reply Box */}
                {selectedTicket.status !== "closed" && selectedTicket.status !== "resolved" && (
                  <div className="border-t pt-4">
                    <div className="flex space-x-2">
                      <Textarea
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        rows={3}
                        className="flex-1"
                      />
                      <div className="flex flex-col space-y-2">
                        <Button size="sm" onClick={handleSendMessage}>
                          <Send className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Paperclip className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a ticket to view details and messages</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
