"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  MessageSquare,
  Send,
  Search,
  Plus,
  Bell,
  BellOff,
  Pin,
  Archive,
  Trash2,
  Users,
  Settings,
  Phone,
  Video,
  Paperclip,
  Smile,
  MoreHorizontal
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Message {
  id: string
  content: string
  timestamp: string
  senderId: string
  senderName: string
  senderAvatar?: string
  type: "text" | "image" | "file" | "system"
  attachments?: string[]
  edited?: boolean
  reactions?: { emoji: string; users: string[] }[]
}

interface Conversation {
  id: string
  name: string
  type: "direct" | "group" | "announcement"
  participants: string[]
  lastMessage?: Message
  unreadCount: number
  pinned: boolean
  archived: boolean
  avatar?: string
  description?: string
  createdAt: string
}

interface Announcement {
  id: string
  title: string
  content: string
  author: string
  authorAvatar?: string
  timestamp: string
  priority: "low" | "medium" | "high" | "urgent"
  category: "general" | "company" | "training" | "system" | "promotion"
  pinned: boolean
  readBy: string[]
}

// Mock data
const mockConversations: Conversation[] = [
  {
    id: "conv_001",
    name: "Sarah Johnson",
    type: "direct",
    participants: ["user_001", "user_002"],
    lastMessage: {
      id: "msg_001",
      content: "Thanks for the help with the commission calculation!",
      timestamp: "2025-09-15T14:30:00Z",
      senderId: "user_002",
      senderName: "Sarah Johnson",
      type: "text"
    },
    unreadCount: 2,
    pinned: true,
    archived: false,
    avatar: "/placeholder-user.jpg",
    createdAt: "2025-09-10T10:00:00Z"
  },
  {
    id: "conv_002",
    name: "Team Leaders",
    type: "group",
    participants: ["user_001", "user_003", "user_004", "user_005"],
    lastMessage: {
      id: "msg_002",
      content: "Meeting scheduled for tomorrow at 2 PM",
      timestamp: "2025-09-15T12:15:00Z",
      senderId: "user_003",
      senderName: "Mike Chen",
      type: "text"
    },
    unreadCount: 5,
    pinned: false,
    archived: false,
    description: "Leadership team coordination",
    createdAt: "2025-09-01T09:00:00Z"
  },
  {
    id: "conv_003",
    name: "Company Announcements",
    type: "announcement",
    participants: ["user_001"],
    lastMessage: {
      id: "msg_003",
      content: "New product launch next week!",
      timestamp: "2025-09-14T16:00:00Z",
      senderId: "admin",
      senderName: "Admin",
      type: "text"
    },
    unreadCount: 1,
    pinned: true,
    archived: false,
    createdAt: "2025-08-01T00:00:00Z"
  }
]

const mockAnnouncements: Announcement[] = [
  {
    id: "ann_001",
    title: "Q4 Promotion Campaign Launch",
    content: "We're excited to announce our biggest promotion campaign of the year! Starting October 1st, all new distributors will receive a 25% bonus on their first month's commission. This is a great opportunity to recruit new team members and boost your earnings.",
    author: "Michelle Rodriguez",
    authorAvatar: "/placeholder-user.jpg",
    timestamp: "2025-09-15T10:00:00Z",
    priority: "high",
    category: "promotion",
    pinned: true,
    readBy: ["user_001"]
  },
  {
    id: "ann_002",
    title: "System Maintenance Scheduled",
    content: "Our platform will undergo scheduled maintenance on September 20th from 2:00 AM to 4:00 AM EST. During this time, some features may be temporarily unavailable. We apologize for any inconvenience.",
    author: "IT Support",
    timestamp: "2025-09-14T14:30:00Z",
    priority: "medium",
    category: "system",
    pinned: false,
    readBy: []
  },
  {
    id: "ann_003",
    title: "New Training Module Available",
    content: "A new training module on 'Advanced Sales Techniques' is now available in your training center. Complete it by the end of the month to earn bonus points toward your next rank advancement.",
    author: "Training Department",
    timestamp: "2025-09-12T09:00:00Z",
    priority: "medium",
    category: "training",
    pinned: false,
    readBy: ["user_001"]
  }
]

const mockMessages: Message[] = [
  {
    id: "msg_004",
    content: "Hi! I had a question about the commission structure for the new product line.",
    timestamp: "2025-09-15T13:00:00Z",
    senderId: "user_002",
    senderName: "Sarah Johnson",
    type: "text"
  },
  {
    id: "msg_005",
    content: "Sure! I'd be happy to help. Which specific aspect are you curious about?",
    timestamp: "2025-09-15T13:05:00Z",
    senderId: "user_001",
    senderName: "John Doe",
    type: "text"
  },
  {
    id: "msg_006",
    content: "The tier structure - I want to make sure I understand how the bonuses work at each level.",
    timestamp: "2025-09-15T13:10:00Z",
    senderId: "user_002",
    senderName: "Sarah Johnson",
    type: "text"
  },
  {
    id: "msg_007",
    content: "Great question! Let me break it down for you...",
    timestamp: "2025-09-15T13:15:00Z",
    senderId: "user_001",
    senderName: "John Doe",
    type: "text"
  }
]

export function InternalCommunication() {
  const [activeTab, setActiveTab] = useState("messages")
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(mockConversations[0])
  const [messageText, setMessageText] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [isNewChatDialogOpen, setIsNewChatDialogOpen] = useState(false)

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

  const getConversationIcon = (type: string) => {
    switch (type) {
      case "group":
        return <Users className="h-4 w-4" />
      case "announcement":
        return <Bell className="h-4 w-4" />
      default:
        return <MessageSquare className="h-4 w-4" />
    }
  }

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedConversation) return
    
    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      content: messageText,
      timestamp: new Date().toISOString(),
      senderId: "user_001",
      senderName: "John Doe",
      type: "text"
    }
    
    console.log("Sending message:", newMessage)
    setMessageText("")
  }

  const filteredConversations = mockConversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredAnnouncements = mockAnnouncements.filter(ann =>
    ann.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ann.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Communications</h1>
          <p className="text-muted-foreground">
            Connect with your team and stay updated with announcements
          </p>
        </div>
        <Dialog open={isNewChatDialogOpen} onOpenChange={setIsNewChatDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Chat
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Start New Conversation</DialogTitle>
              <DialogDescription>
                Send a message to a team member or create a group chat
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">To:</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select contact" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sarah">Sarah Johnson</SelectItem>
                    <SelectItem value="mike">Mike Chen</SelectItem>
                    <SelectItem value="emma">Emma Wilson</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Message:</label>
                <Textarea placeholder="Type your message..." rows={3} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsNewChatDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsNewChatDialogOpen(false)}>
                Send Message
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="messages" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-3">
            {/* Conversations List */}
            <Card className="md:col-span-1">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Conversations</CardTitle>
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search conversations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {filteredConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      className={`p-3 cursor-pointer hover:bg-muted/50 transition-colors border-b ${
                        selectedConversation?.id === conversation.id ? "bg-muted" : ""
                      }`}
                      onClick={() => setSelectedConversation(conversation)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="relative">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={conversation.avatar} />
                            <AvatarFallback>
                              {getConversationIcon(conversation.type)}
                            </AvatarFallback>
                          </Avatar>
                          {conversation.unreadCount > 0 && (
                            <Badge className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center">
                              {conversation.unreadCount}
                            </Badge>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium truncate">{conversation.name}</p>
                            <div className="flex items-center space-x-1">
                              {conversation.pinned && <Pin className="h-3 w-3 text-muted-foreground" />}
                              <span className="text-xs text-muted-foreground">
                                {conversation.lastMessage && 
                                  new Date(conversation.lastMessage.timestamp).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })
                                }
                              </span>
                            </div>
                          </div>
                          {conversation.lastMessage && (
                            <p className="text-sm text-muted-foreground truncate">
                              {conversation.lastMessage.content}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Chat Window */}
            <Card className="md:col-span-2">
              {selectedConversation ? (
                <>
                  <CardHeader className="border-b">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={selectedConversation.avatar} />
                          <AvatarFallback>
                            {getConversationIcon(selectedConversation.type)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{selectedConversation.name}</h3>
                          {selectedConversation.description && (
                            <p className="text-sm text-muted-foreground">
                              {selectedConversation.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Video className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Pin className="mr-2 h-4 w-4" />
                              Pin Conversation
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <BellOff className="mr-2 h-4 w-4" />
                              Mute Notifications
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Archive className="mr-2 h-4 w-4" />
                              Archive
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    {/* Messages */}
                    <div className="h-96 overflow-y-auto p-4 space-y-4">
                      {mockMessages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.senderId === "user_001" ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[70%] p-3 rounded-lg ${
                              message.senderId === "user_001"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            }`}
                          >
                            {message.senderId !== "user_001" && (
                              <p className="text-xs font-medium mb-1">{message.senderName}</p>
                            )}
                            <p className="text-sm">{message.content}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {new Date(message.timestamp).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Message Input */}
                    <div className="border-t p-4">
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Paperclip className="h-4 w-4" />
                        </Button>
                        <Input
                          placeholder="Type a message..."
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault()
                              handleSendMessage()
                            }
                          }}
                          className="flex-1"
                        />
                        <Button variant="ghost" size="sm">
                          <Smile className="h-4 w-4" />
                        </Button>
                        <Button onClick={handleSendMessage}>
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </>
              ) : (
                <CardContent className="flex items-center justify-center h-96">
                  <div className="text-center text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Select a conversation to start chatting</p>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="announcements" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Company Announcements</CardTitle>
                  <CardDescription>Stay updated with the latest news and updates</CardDescription>
                </div>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search announcements..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 w-64"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {filteredAnnouncements.map((announcement) => (
                  <div key={announcement.id} className="border rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={announcement.authorAvatar} />
                          <AvatarFallback>
                            {announcement.author.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{announcement.title}</h3>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <span>by {announcement.author}</span>
                            <span>•</span>
                            <span>{new Date(announcement.timestamp).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {announcement.pinned && <Pin className="h-4 w-4 text-muted-foreground" />}
                        <Badge className={getPriorityColor(announcement.priority)}>
                          {announcement.priority}
                        </Badge>
                        <Badge variant="outline">
                          {announcement.category}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed">{announcement.content}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Manage how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center py-8 text-muted-foreground">
                  <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Notification settings coming soon...</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
