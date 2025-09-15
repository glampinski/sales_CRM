"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Users, 
  TrendingUp, 
  Crown, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  Star,
  DollarSign,
  Award,
  Target,
  Activity,
  UserPlus,
  Edit,
  MoreHorizontal,
  Eye,
  Send,
  Download,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock
} from "lucide-react"

interface Distributor {
  id: string
  name: string
  email: string
  phone: string
  avatar?: string
  rank: "Bronze" | "Silver" | "Gold" | "Platinum" | "Diamond" | "Ambassador"
  status: "active" | "inactive" | "pending" | "suspended"
  joinDate: string
  location: string
  sponsor: {
    id: string
    name: string
    rank: string
  }
  performance: {
    personalVolume: number
    groupVolume: number
    totalCommission: number
    monthlyGoal: number
    directRecruit: number
    teamSize: number
  }
  nextRankRequirements: {
    personalVolume: number
    groupVolume: number
    directDistributors: number
    timeInRank: number
  }
  progress: {
    personalVolumeProgress: number
    groupVolumeProgress: number
    directDistributorsProgress: number
    timeInRankProgress: number
  }
  recentActivity: Array<{
    type: "sale" | "recruit" | "training" | "commission" | "rank_advance"
    description: string
    amount?: number
    date: string
  }>
  documents: Array<{
    type: "contract" | "id" | "bank" | "compliance"
    name: string
    status: "pending" | "approved" | "rejected"
    uploadDate: string
  }>
  onboardingProgress: {
    profileComplete: boolean
    documentsUploaded: boolean
    firstSale: boolean
    firstRecruit: boolean
    trainingComplete: boolean
    percentage: number
  }
}

// Mock distributor data
const mockDistributor: Distributor = {
  id: "dist-001",
  name: "Sarah Johnson",
  email: "sarah.johnson@email.com", 
  phone: "+1 (555) 123-4567",
  avatar: "/placeholder-user.jpg",
  rank: "Gold",
  status: "active",
  joinDate: "2023-03-15",
  location: "San Francisco, CA",
  sponsor: {
    id: "dist-sponsor",
    name: "Michele Domizi",
    rank: "Diamond"
  },
  performance: {
    personalVolume: 3250,
    groupVolume: 18750,
    totalCommission: 4687.50,
    monthlyGoal: 5000,
    directRecruit: 8,
    teamSize: 23
  },
  nextRankRequirements: {
    personalVolume: 5000,
    groupVolume: 25000,
    directDistributors: 10,
    timeInRank: 6
  },
  progress: {
    personalVolumeProgress: 65,
    groupVolumeProgress: 75,
    directDistributorsProgress: 80,
    timeInRankProgress: 50
  },
  recentActivity: [
    {
      type: "sale",
      description: "Product sale - Glamping Package",
      amount: 1250,
      date: "2025-09-12"
    },
    {
      type: "recruit",
      description: "New team member recruited",
      date: "2025-09-10"
    },
    {
      type: "commission",
      description: "Monthly commission payout",
      amount: 850,
      date: "2025-09-01"
    },
    {
      type: "training",
      description: "Completed MLM Leadership Training",
      date: "2025-08-28"
    }
  ],
  documents: [
    {
      type: "contract",
      name: "Distributor Agreement",
      status: "approved",
      uploadDate: "2023-03-15"
    },
    {
      type: "id",
      name: "Government ID",
      status: "approved", 
      uploadDate: "2023-03-16"
    },
    {
      type: "bank",
      name: "Bank Account Details",
      status: "approved",
      uploadDate: "2023-03-17"
    },
    {
      type: "compliance",
      name: "Compliance Training Certificate",
      status: "pending",
      uploadDate: "2025-09-01"
    }
  ],
  onboardingProgress: {
    profileComplete: true,
    documentsUploaded: true,
    firstSale: true,
    firstRecruit: true,
    trainingComplete: false,
    percentage: 80
  }
}

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

const getRankIcon = (rank: string) => {
  switch (rank) {
    case "Diamond": return <Crown className="h-4 w-4" />
    case "Platinum": return <Award className="h-4 w-4" />
    case "Gold": return <Star className="h-4 w-4" />
    default: return <Users className="h-4 w-4" />
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

const getDocumentStatusColor = (status: string) => {
  switch (status) {
    case "approved": return "text-green-600"
    case "pending": return "text-yellow-600"
    case "rejected": return "text-red-600"
    default: return "text-gray-600"
  }
}

const getDocumentStatusIcon = (status: string) => {
  switch (status) {
    case "approved": return <CheckCircle className="h-4 w-4" />
    case "pending": return <Clock className="h-4 w-4" />
    case "rejected": return <AlertCircle className="h-4 w-4" />
    default: return <FileText className="h-4 w-4" />
  }
}

export function UserProfile({ userId }: { userId?: string }) {
  const [distributor] = useState<Distributor>(mockDistributor)
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={distributor.avatar} />
            <AvatarFallback className="text-lg">
              {distributor.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{distributor.name}</h1>
            <div className="flex items-center space-x-2 mt-1">
              <Badge className={getRankColor(distributor.rank)}>
                {getRankIcon(distributor.rank)}
                <span className="ml-1">{distributor.rank}</span>
              </Badge>
              <Badge className={getStatusColor(distributor.status)}>
                {distributor.status}
              </Badge>
              <span className="text-sm text-muted-foreground">
                ID: {distributor.id}
              </span>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Send className="h-4 w-4 mr-2" />
            Message
          </Button>
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Personal Volume</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${distributor.performance.personalVolume.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Goal: ${distributor.performance.monthlyGoal.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Group Volume</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${distributor.performance.groupVolume.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Team of {distributor.performance.teamSize} members
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Commission</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${distributor.performance.totalCommission.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Direct Recruits</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{distributor.performance.directRecruit}</div>
            <p className="text-xs text-muted-foreground">
              Active team members
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="rank-progress">Rank Progress</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{distributor.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{distributor.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{distributor.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Joined {new Date(distributor.joinDate).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>

            {/* Sponsor Information */}
            <Card>
              <CardHeader>
                <CardTitle>Sponsor Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {distributor.sponsor.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{distributor.sponsor.name}</p>
                    <Badge className={getRankColor(distributor.sponsor.rank)}>
                      {distributor.sponsor.rank}
                    </Badge>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  <Eye className="h-4 w-4 mr-2" />
                  View Sponsor Profile
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest actions and achievements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {distributor.recentActivity.slice(0, 5).map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Activity className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{activity.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(activity.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {activity.amount && (
                      <Badge variant="secondary">
                        ${activity.amount.toLocaleString()}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Performance</CardTitle>
                <CardDescription>Current month progress</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Personal Volume</span>
                    <span>${distributor.performance.personalVolume} / ${distributor.performance.monthlyGoal}</span>
                  </div>
                  <Progress value={(distributor.performance.personalVolume / distributor.performance.monthlyGoal) * 100} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Commission Earnings</span>
                    <span>${distributor.performance.totalCommission}</span>
                  </div>
                  <Progress value={75} />
                </div>
              </CardContent>
            </Card>

            {/* Team Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Team Performance</CardTitle>
                <CardDescription>Leadership metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Team Size</p>
                    <p className="text-2xl font-bold">{distributor.performance.teamSize}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Direct Recruits</p>
                    <p className="text-2xl font-bold">{distributor.performance.directRecruit}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Group Volume</p>
                  <p className="text-2xl font-bold">${distributor.performance.groupVolume.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="rank-progress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rank Advancement Progress</CardTitle>
              <CardDescription>
                Progress towards {distributor.rank === "Gold" ? "Platinum" : "next rank"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Personal Volume Required</span>
                    <span>{distributor.performance.personalVolume} / {distributor.nextRankRequirements.personalVolume}</span>
                  </div>
                  <Progress value={distributor.progress.personalVolumeProgress} />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Group Volume Required</span>
                    <span>{distributor.performance.groupVolume} / {distributor.nextRankRequirements.groupVolume}</span>
                  </div>
                  <Progress value={distributor.progress.groupVolumeProgress} />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Direct Distributors</span>
                    <span>{distributor.performance.directRecruit} / {distributor.nextRankRequirements.directDistributors}</span>
                  </div>
                  <Progress value={distributor.progress.directDistributorsProgress} />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Time in Current Rank</span>
                    <span>3 / {distributor.nextRankRequirements.timeInRank} months</span>
                  </div>
                  <Progress value={distributor.progress.timeInRankProgress} />
                </div>
              </div>
              
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">Next Steps to Platinum</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Increase personal volume by $1,750</li>
                  <li>• Recruit 2 more direct distributors</li>
                  <li>• Maintain current rank for 3 more months</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Activity Timeline</CardTitle>
              <CardDescription>Complete history of distributor activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {distributor.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="flex-shrink-0">
                      <Activity className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{activity.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(activity.date).toLocaleDateString()} • {activity.type}
                      </p>
                    </div>
                    {activity.amount && (
                      <Badge variant="secondary">
                        ${activity.amount.toLocaleString()}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Documents & Compliance</CardTitle>
              <CardDescription>Required documents and compliance status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {distributor.documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Uploaded {new Date(doc.uploadDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`flex items-center space-x-1 ${getDocumentStatusColor(doc.status)}`}>
                        {getDocumentStatusIcon(doc.status)}
                        <span className="text-sm font-medium capitalize">{doc.status}</span>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="onboarding" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Onboarding Progress</CardTitle>
              <CardDescription>
                {distributor.onboardingProgress.percentage}% complete
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Progress value={distributor.onboardingProgress.percentage} className="h-3" />
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Profile Complete</span>
                  {distributor.onboardingProgress.profileComplete ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <Clock className="h-5 w-5 text-gray-400" />
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Documents Uploaded</span>
                  {distributor.onboardingProgress.documentsUploaded ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <Clock className="h-5 w-5 text-gray-400" />
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">First Sale Completed</span>
                  {distributor.onboardingProgress.firstSale ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <Clock className="h-5 w-5 text-gray-400" />
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">First Recruit</span>
                  {distributor.onboardingProgress.firstRecruit ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <Clock className="h-5 w-5 text-gray-400" />
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Training Complete</span>
                  {distributor.onboardingProgress.trainingComplete ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                  )}
                </div>
              </div>
              
              {!distributor.onboardingProgress.trainingComplete && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm font-medium text-yellow-800">Action Required</p>
                  <p className="text-sm text-yellow-700">
                    Complete the MLM Compliance Training to finish onboarding.
                  </p>
                  <Button size="sm" className="mt-2">
                    Start Training
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
