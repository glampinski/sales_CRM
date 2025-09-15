"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  BookOpen,
  Play,
  Clock,
  Star,
  Award,
  Target,
  Search,
  Filter,
  ChevronRight,
  Download,
  Share2,
  Bookmark,
  CheckCircle,
  Lock,
  Users,
  Calendar,
  TrendingUp,
  FileText,
  Video,
  Headphones,
  Trophy,
  BarChart3
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

interface Course {
  id: string
  title: string
  description: string
  instructor: string
  instructorAvatar?: string
  duration: number // in minutes
  lessons: number
  difficulty: "beginner" | "intermediate" | "advanced"
  category: string
  tags: string[]
  thumbnail: string
  rating: number
  reviews: number
  enrolled: number
  price: number
  isCompleted: boolean
  progress: number
  completedLessons: number
  lastAccessed?: string
  certificateAvailable: boolean
  featured: boolean
}

interface Certification {
  id: string
  name: string
  description: string
  requirements: string[]
  badge: string
  issueDate?: string
  expiryDate?: string
  status: "not_started" | "in_progress" | "completed" | "expired"
  progress: number
  credentialId?: string
}

interface LiveEvent {
  id: string
  title: string
  description: string
  instructor: string
  date: string
  duration: number
  attendees: number
  maxAttendees: number
  type: "webinar" | "workshop" | "meeting"
  isRegistered: boolean
  recording?: string
}

// Mock data
const mockCourses: Course[] = [
  {
    id: "course_001",
    title: "Advanced Sales Techniques",
    description: "Master the art of selling with proven techniques and strategies that top performers use to close more deals.",
    instructor: "Michelle Rodriguez",
    instructorAvatar: "/placeholder-user.jpg",
    duration: 240,
    lessons: 12,
    difficulty: "intermediate",
    category: "Sales",
    tags: ["sales", "techniques", "closing"],
    thumbnail: "/placeholder.jpg",
    rating: 4.8,
    reviews: 156,
    enrolled: 2340,
    price: 0,
    isCompleted: false,
    progress: 65,
    completedLessons: 8,
    lastAccessed: "2025-09-14T10:30:00Z",
    certificateAvailable: true,
    featured: true
  },
  {
    id: "course_002",
    title: "Digital Marketing Fundamentals",
    description: "Learn the basics of digital marketing including social media, email marketing, and content creation.",
    instructor: "Sarah Chen",
    duration: 180,
    lessons: 8,
    difficulty: "beginner",
    category: "Marketing",
    tags: ["marketing", "digital", "social media"],
    thumbnail: "/placeholder.jpg",
    rating: 4.6,
    reviews: 89,
    enrolled: 1820,
    price: 0,
    isCompleted: true,
    progress: 100,
    completedLessons: 8,
    lastAccessed: "2025-09-10T15:20:00Z",
    certificateAvailable: true,
    featured: false
  },
  {
    id: "course_003",
    title: "Leadership in Network Marketing",
    description: "Develop leadership skills to build and manage successful teams in network marketing.",
    instructor: "John Davis",
    duration: 300,
    lessons: 15,
    difficulty: "advanced",
    category: "Leadership",
    tags: ["leadership", "team building", "management"],
    thumbnail: "/placeholder.jpg",
    rating: 4.9,
    reviews: 203,
    enrolled: 1560,
    price: 0,
    isCompleted: false,
    progress: 20,
    completedLessons: 3,
    certificateAvailable: true,
    featured: true
  }
]

const mockCertifications: Certification[] = [
  {
    id: "cert_001",
    name: "Sales Professional Certification",
    description: "Demonstrates mastery of advanced sales techniques and strategies",
    requirements: ["Complete Advanced Sales Techniques course", "Pass certification exam", "6 months active selling"],
    badge: "🏆",
    issueDate: "2025-08-15T00:00:00Z",
    status: "completed",
    progress: 100,
    credentialId: "SPC-2025-001234"
  },
  {
    id: "cert_002",
    name: "Digital Marketing Specialist",
    description: "Validates expertise in digital marketing strategies and implementation",
    requirements: ["Complete Digital Marketing Fundamentals", "Complete Advanced Digital Marketing", "Portfolio review"],
    badge: "📊",
    status: "in_progress",
    progress: 60
  },
  {
    id: "cert_003",
    name: "Team Leadership Certification",
    description: "Recognizes leadership skills and team management capabilities",
    requirements: ["Complete Leadership course", "Manage team of 5+ for 3 months", "Peer evaluation"],
    badge: "👑",
    status: "not_started",
    progress: 0
  }
]

const mockLiveEvents: LiveEvent[] = [
  {
    id: "event_001",
    title: "Q4 Sales Strategy Webinar",
    description: "Learn the latest strategies to maximize your Q4 sales performance",
    instructor: "Michelle Rodriguez",
    date: "2025-09-20T14:00:00Z",
    duration: 60,
    attendees: 45,
    maxAttendees: 100,
    type: "webinar",
    isRegistered: true
  },
  {
    id: "event_002",
    title: "Social Media Marketing Workshop",
    description: "Hands-on workshop for creating engaging social media content",
    instructor: "Sarah Chen",
    date: "2025-09-22T16:00:00Z",
    duration: 120,
    attendees: 28,
    maxAttendees: 50,
    type: "workshop",
    isRegistered: false
  }
]

export function TrainingCenter() {
  const [activeTab, setActiveTab] = useState("courses")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800"
      case "intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "advanced":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in_progress":
        return "bg-blue-100 text-blue-800"
      case "not_started":
        return "bg-gray-100 text-gray-800"
      case "expired":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredCourses = mockCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || course.category.toLowerCase() === selectedCategory
    const matchesDifficulty = selectedDifficulty === "all" || course.difficulty === selectedDifficulty
    
    return matchesSearch && matchesCategory && matchesDifficulty
  })

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Training Center</h1>
          <p className="text-muted-foreground">
            Enhance your skills with courses, certifications, and live training
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="text-sm">
            <Trophy className="h-4 w-4 mr-1" />
            2 Certificates Earned
          </Badge>
          <Button>
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Learning
          </Button>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-muted-foreground">Courses Enrolled</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Award className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">2</p>
                <p className="text-sm text-muted-foreground">Certificates</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">48h</p>
                <p className="text-sm text-muted-foreground">Learning Time</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">85%</p>
                <p className="text-sm text-muted-foreground">Avg Completion</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
          <TabsTrigger value="live-events">Live Events</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 w-64"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="leadership">Leadership</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  More Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Course Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="overflow-hidden">
                <div className="relative">
                  <img 
                    src={course.thumbnail} 
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                  {course.featured && (
                    <Badge className="absolute top-2 left-2">Featured</Badge>
                  )}
                  <div className="absolute top-2 right-2 flex space-x-1">
                    <Button variant="secondary" size="sm">
                      <Bookmark className="h-4 w-4" />
                    </Button>
                    <Button variant="secondary" size="sm">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                  {course.isCompleted && (
                    <div className="absolute bottom-2 right-2">
                      <Badge className="bg-green-600">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Completed
                      </Badge>
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg leading-tight">{course.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {course.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={course.instructorAvatar} />
                        <AvatarFallback className="text-xs">
                          {course.instructor.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-muted-foreground">{course.instructor}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{formatDuration(course.duration)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FileText className="h-4 w-4" />
                          <span>{course.lessons} lessons</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{course.rating}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <Badge className={getDifficultyColor(course.difficulty)}>
                        {course.difficulty}
                      </Badge>
                      <Badge variant="outline">{course.category}</Badge>
                    </div>

                    {course.progress > 0 && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-2" />
                        <p className="text-xs text-muted-foreground">
                          {course.completedLessons} of {course.lessons} lessons completed
                        </p>
                      </div>
                    )}

                    <Button className="w-full">
                      {course.progress > 0 ? (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Continue Learning
                        </>
                      ) : (
                        <>
                          <BookOpen className="h-4 w-4 mr-2" />
                          Start Course
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="certifications" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            {mockCertifications.map((cert) => (
              <Card key={cert.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{cert.badge}</div>
                      <div>
                        <CardTitle className="text-lg">{cert.name}</CardTitle>
                        <CardDescription>{cert.description}</CardDescription>
                      </div>
                    </div>
                    <Badge className={getStatusColor(cert.status)}>
                      {cert.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Requirements:</h4>
                      <ul className="space-y-1">
                        {cert.requirements.map((req, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-center">
                            <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {cert.progress > 0 && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{cert.progress}%</span>
                        </div>
                        <Progress value={cert.progress} className="h-2" />
                      </div>
                    )}

                    {cert.credentialId && (
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-sm font-medium">Credential ID: {cert.credentialId}</p>
                        <p className="text-xs text-muted-foreground">
                          Issued: {new Date(cert.issueDate!).toLocaleDateString()}
                        </p>
                      </div>
                    )}

                    <div className="flex space-x-2">
                      {cert.status === "completed" ? (
                        <>
                          <Button variant="outline" className="flex-1">
                            <Download className="h-4 w-4 mr-2" />
                            Download Certificate
                          </Button>
                          <Button variant="outline" className="flex-1">
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                          </Button>
                        </>
                      ) : (
                        <Button className="w-full">
                          {cert.status === "not_started" ? "Start Certification" : "Continue"}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="live-events" className="space-y-4">
          <div className="space-y-4">
            {mockLiveEvents.map((event) => (
              <Card key={event.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant={event.type === "webinar" ? "default" : "secondary"}>
                          {event.type === "webinar" ? <Video className="h-3 w-3 mr-1" /> : <Users className="h-3 w-3 mr-1" />}
                          {event.type}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {new Date(event.date).toLocaleDateString()} at {new Date(event.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
                      <p className="text-muted-foreground mb-4">{event.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>Instructor: {event.instructor}</span>
                        <span>Duration: {formatDuration(event.duration)}</span>
                        <span>Attendees: {event.attendees}/{event.maxAttendees}</span>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      {event.isRegistered ? (
                        <Badge className="bg-green-100 text-green-800">Registered</Badge>
                      ) : (
                        <Button>Register</Button>
                      )}
                      {event.recording && (
                        <Button variant="outline" size="sm">
                          <Play className="h-4 w-4 mr-2" />
                          Watch Recording
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Learning Analytics</CardTitle>
                <CardDescription>Your learning progress overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center py-8 text-muted-foreground">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Analytics dashboard coming soon...</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest learning activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Activity feed coming soon...</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
