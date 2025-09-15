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
  Share2,
  Download,
  Copy,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Heart,
  MessageSquare,
  BarChart3,
  Calendar,
  Link2,
  Image as ImageIcon,
  Video,
  FileText,
  Megaphone,
  Target,
  TrendingUp,
  Users,
  Globe,
  Mail,
  Smartphone,
  Zap,
  Star,
  Clock
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

interface MarketingMaterial {
  id: string
  title: string
  description: string
  type: "image" | "video" | "document" | "social_post" | "email_template" | "webpage"
  category: string
  tags: string[]
  thumbnail: string
  url?: string
  downloads: number
  likes: number
  shares: number
  createdAt: string
  updatedAt: string
  author: string
  authorAvatar?: string
  size?: string
  duration?: number
  featured: boolean
  approved: boolean
}

interface SocialPost {
  id: string
  platform: "facebook" | "instagram" | "twitter" | "linkedin" | "tiktok"
  content: string
  image?: string
  video?: string
  hashtags: string[]
  scheduledFor?: string
  status: "draft" | "scheduled" | "published"
  engagement: {
    likes: number
    comments: number
    shares: number
    views: number
  }
  createdAt: string
}

interface Campaign {
  id: string
  name: string
  description: string
  type: "product_launch" | "promotion" | "awareness" | "recruitment"
  status: "draft" | "active" | "paused" | "completed"
  startDate: string
  endDate: string
  budget: number
  spent: number
  reach: number
  conversions: number
  materials: string[]
  targetAudience: string[]
}

// Mock data
const mockMaterials: MarketingMaterial[] = [
  {
    id: "mat_001",
    title: "Q4 Product Launch Banner",
    description: "High-resolution banner for the new product line launch campaign",
    type: "image",
    category: "Product Launch",
    tags: ["banner", "product", "launch", "Q4"],
    thumbnail: "/placeholder.jpg",
    downloads: 156,
    likes: 23,
    shares: 12,
    createdAt: "2025-09-10T10:00:00Z",
    updatedAt: "2025-09-12T14:30:00Z",
    author: "Marketing Team",
    size: "1920x1080",
    featured: true,
    approved: true
  },
  {
    id: "mat_002",
    title: "Success Story Video",
    description: "Customer testimonial video showcasing transformation results",
    type: "video",
    category: "Testimonials",
    tags: ["testimonial", "success", "video", "results"],
    thumbnail: "/placeholder.jpg",
    downloads: 89,
    likes: 45,
    shares: 28,
    createdAt: "2025-09-08T16:20:00Z",
    updatedAt: "2025-09-08T16:20:00Z",
    author: "Content Team",
    duration: 180,
    featured: true,
    approved: true
  },
  {
    id: "mat_003",
    title: "Opportunity Presentation",
    description: "Complete business opportunity presentation for prospects",
    type: "document",
    category: "Business Opportunity",
    tags: ["presentation", "opportunity", "business", "prospects"],
    thumbnail: "/placeholder.jpg",
    downloads: 234,
    likes: 67,
    shares: 34,
    createdAt: "2025-09-05T09:15:00Z",
    updatedAt: "2025-09-14T11:45:00Z",
    author: "Sales Team",
    size: "15.2 MB",
    featured: false,
    approved: true
  }
]

const mockSocialPosts: SocialPost[] = [
  {
    id: "post_001",
    platform: "instagram",
    content: "Transform your lifestyle with our amazing products! 🌟 #TransformationTuesday #Wellness #Success",
    image: "/placeholder.jpg",
    hashtags: ["TransformationTuesday", "Wellness", "Success", "LifestyleChange"],
    status: "published",
    engagement: {
      likes: 156,
      comments: 23,
      shares: 12,
      views: 1240
    },
    createdAt: "2025-09-15T10:00:00Z"
  },
  {
    id: "post_002",
    platform: "facebook",
    content: "Join our amazing community of entrepreneurs! Limited time opportunity - DM for details 📩",
    hashtags: ["Entrepreneur", "Opportunity", "Business", "Success"],
    scheduledFor: "2025-09-16T14:00:00Z",
    status: "scheduled",
    engagement: {
      likes: 0,
      comments: 0,
      shares: 0,
      views: 0
    },
    createdAt: "2025-09-15T12:30:00Z"
  }
]

const mockCampaigns: Campaign[] = [
  {
    id: "camp_001",
    name: "Q4 Product Launch",
    description: "Major product launch campaign for the holiday season",
    type: "product_launch",
    status: "active",
    startDate: "2025-10-01T00:00:00Z",
    endDate: "2025-12-31T23:59:59Z",
    budget: 10000,
    spent: 3500,
    reach: 25000,
    conversions: 450,
    materials: ["mat_001", "mat_002"],
    targetAudience: ["existing_customers", "prospects", "affiliates"]
  },
  {
    id: "camp_002",
    name: "Recruitment Drive",
    description: "Attract new distributors to join our network",
    type: "recruitment",
    status: "active",
    startDate: "2025-09-01T00:00:00Z",
    endDate: "2025-11-30T23:59:59Z",
    budget: 5000,
    spent: 1200,
    reach: 12000,
    conversions: 89,
    materials: ["mat_003"],
    targetAudience: ["entrepreneurs", "job_seekers"]
  }
]

export function MarketingTools() {
  const [activeTab, setActiveTab] = useState("materials")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedType, setSelectedType] = useState("all")
  const [isCreatePostDialogOpen, setIsCreatePostDialogOpen] = useState(false)
  const [newPostContent, setNewPostContent] = useState("")
  const [selectedPlatform, setSelectedPlatform] = useState("instagram")

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "image":
        return <ImageIcon className="h-4 w-4" />
      case "video":
        return <Video className="h-4 w-4" />
      case "document":
        return <FileText className="h-4 w-4" />
      case "social_post":
        return <Share2 className="h-4 w-4" />
      case "email_template":
        return <Mail className="h-4 w-4" />
      case "webpage":
        return <Globe className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "facebook":
        return "📘"
      case "instagram":
        return "📷"
      case "twitter":
        return "🐦"
      case "linkedin":
        return "💼"
      case "tiktok":
        return "🎵"
      default:
        return "📱"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800"
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      case "draft":
        return "bg-gray-100 text-gray-800"
      case "active":
        return "bg-green-100 text-green-800"
      case "paused":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredMaterials = mockMaterials.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || material.category.toLowerCase().includes(selectedCategory.toLowerCase())
    const matchesType = selectedType === "all" || material.type === selectedType
    
    return matchesSearch && matchesCategory && matchesType
  })

  const handleCreatePost = () => {
    console.log("Creating post:", { platform: selectedPlatform, content: newPostContent })
    setNewPostContent("")
    setIsCreatePostDialogOpen(false)
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Marketing Tools</h1>
          <p className="text-muted-foreground">
            Access marketing materials, create content, and manage campaigns
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Dialog open={isCreatePostDialogOpen} onOpenChange={setIsCreatePostDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Content
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Social Media Post</DialogTitle>
                <DialogDescription>
                  Create and schedule content for your social media platforms
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Platform:</label>
                  <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="instagram">📷 Instagram</SelectItem>
                      <SelectItem value="facebook">📘 Facebook</SelectItem>
                      <SelectItem value="twitter">🐦 Twitter</SelectItem>
                      <SelectItem value="linkedin">💼 LinkedIn</SelectItem>
                      <SelectItem value="tiktok">🎵 TikTok</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Content:</label>
                  <Textarea
                    placeholder="Write your post content..."
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Hashtags:</label>
                  <Input placeholder="#hashtag1 #hashtag2 #hashtag3" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Schedule for later (optional):</label>
                  <Input type="datetime-local" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreatePostDialogOpen(false)}>
                  Save as Draft
                </Button>
                <Button onClick={handleCreatePost}>
                  {selectedPlatform ? "Post Now" : "Schedule"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Download className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">2.4k</p>
                <p className="text-sm text-muted-foreground">Total Downloads</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Share2 className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">456</p>
                <p className="text-sm text-muted-foreground">Shares</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">89%</p>
                <p className="text-sm text-muted-foreground">Engagement Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Target className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-muted-foreground">Active Campaigns</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="materials">Materials</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="materials" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search materials..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 w-64"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="product">Product Launch</SelectItem>
                    <SelectItem value="testimonials">Testimonials</SelectItem>
                    <SelectItem value="business">Business Opportunity</SelectItem>
                    <SelectItem value="training">Training</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="image">Images</SelectItem>
                    <SelectItem value="video">Videos</SelectItem>
                    <SelectItem value="document">Documents</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  More Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Materials Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredMaterials.map((material) => (
              <Card key={material.id} className="overflow-hidden">
                <div className="relative">
                  <img 
                    src={material.thumbnail} 
                    alt={material.title}
                    className="w-full h-48 object-cover"
                  />
                  {material.featured && (
                    <Badge className="absolute top-2 left-2">Featured</Badge>
                  )}
                  <div className="absolute top-2 right-2 flex space-x-1">
                    <Button variant="secondary" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="secondary" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                  {material.type === "video" && material.duration && (
                    <Badge className="absolute bottom-2 right-2 bg-black/70 text-white">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatDuration(material.duration)}
                    </Badge>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-lg leading-tight">{material.title}</h3>
                        <div className="flex items-center space-x-1">
                          {getTypeIcon(material.type)}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {material.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={material.authorAvatar} />
                        <AvatarFallback className="text-xs">
                          {material.author.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-muted-foreground">{material.author}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Download className="h-4 w-4" />
                          <span>{material.downloads}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Heart className="h-4 w-4" />
                          <span>{material.likes}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Share2 className="h-4 w-4" />
                          <span>{material.shares}</span>
                        </div>
                      </div>
                      {material.size && (
                        <span>{material.size}</span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{material.category}</Badge>
                      <div className="flex space-x-1">
                        {material.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button className="flex-1">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Copy className="mr-2 h-4 w-4" />
                            Copy Link
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="mr-2 h-4 w-4" />
                            Share via Email
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Customize
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="social" className="space-y-4">
          <div className="space-y-4">
            {mockSocialPosts.map((post) => (
              <Card key={post.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="text-2xl">{getPlatformIcon(post.platform)}</span>
                        <Badge className={getStatusColor(post.status)}>
                          {post.status}
                        </Badge>
                        {post.scheduledFor && (
                          <span className="text-sm text-muted-foreground">
                            Scheduled for {new Date(post.scheduledFor).toLocaleString()}
                          </span>
                        )}
                      </div>
                      <p className="mb-4">{post.content}</p>
                      {post.image && (
                        <img src={post.image} alt="Post" className="w-32 h-32 object-cover rounded mb-4" />
                      )}
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Heart className="h-4 w-4" />
                          <span>{post.engagement.likes}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageSquare className="h-4 w-4" />
                          <span>{post.engagement.comments}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Share2 className="h-4 w-4" />
                          <span>{post.engagement.shares}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye className="h-4 w-4" />
                          <span>{post.engagement.views}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-4">
          <div className="space-y-4">
            {mockCampaigns.map((campaign) => (
              <Card key={campaign.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-2">{campaign.name}</h3>
                      <p className="text-muted-foreground mb-3">{campaign.description}</p>
                      <div className="flex items-center space-x-4">
                        <Badge className={getStatusColor(campaign.status)}>
                          {campaign.status}
                        </Badge>
                        <Badge variant="outline">
                          {campaign.type.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-4 mb-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold">${campaign.spent.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">Spent / ${campaign.budget.toLocaleString()}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{campaign.reach.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">Reach</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{campaign.conversions}</p>
                      <p className="text-sm text-muted-foreground">Conversions</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{campaign.materials.length}</p>
                      <p className="text-sm text-muted-foreground">Materials</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                      {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Analytics
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Content Templates</CardTitle>
              <CardDescription>Pre-designed templates for quick content creation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Template library coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
