"use client"

import { useState } from "react"
import { Plus, Search, Filter, Calendar, Clock, User, CheckSquare, MoreHorizontal, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mock task data
const tasks = [
  {
    id: 1,
    title: "Follow up with Sarah Johnson",
    description: "Discuss pricing and implementation timeline",
    type: "call",
    priority: "high",
    status: "pending",
    assignee: "John Doe",
    contact: "Sarah Johnson",
    dueDate: "2025-09-13",
    dueTime: "14:00",
    completed: false,
    createdAt: "2025-09-12",
  },
  {
    id: 2,
    title: "Send proposal to Mike Chen",
    description: "Customized package for StartupXYZ",
    type: "email",
    priority: "medium",
    status: "in_progress",
    assignee: "John Doe",
    contact: "Mike Chen",
    dueDate: "2025-09-13",
    dueTime: "16:30",
    completed: false,
    createdAt: "2025-09-11",
  },
  {
    id: 3,
    title: "Team meeting preparation",
    description: "Prepare monthly sales review presentation",
    type: "meeting",
    priority: "medium",
    status: "pending",
    assignee: "John Doe",
    contact: null,
    dueDate: "2025-09-14",
    dueTime: "09:00",
    completed: false,
    createdAt: "2025-09-10",
  },
  {
    id: 4,
    title: "Product demo for Emily Rodriguez",
    description: "Show key features and benefits",
    type: "demo",
    priority: "high",
    status: "pending",
    assignee: "John Doe",
    contact: "Emily Rodriguez",
    dueDate: "2025-09-13",
    dueTime: "16:00",
    completed: false,
    createdAt: "2025-09-12",
  },
  {
    id: 5,
    title: "Contract review with legal",
    description: "Review enterprise agreement terms",
    type: "other",
    priority: "low",
    status: "completed",
    assignee: "John Doe",
    contact: null,
    dueDate: "2025-09-12",
    dueTime: "11:00",
    completed: true,
    createdAt: "2025-09-09",
  },
]

const priorityColors = {
  low: "secondary",
  medium: "outline",
  high: "destructive",
  urgent: "destructive",
} as const

const statusColors = {
  pending: "secondary",
  in_progress: "default",
  completed: "outline",
  cancelled: "destructive",
} as const

const typeIcons = {
  call: "📞",
  email: "📧",
  meeting: "🤝",
  demo: "🖥️",
  follow_up: "📋",
  presentation: "📊",
  other: "📌",
}

const stats = [
  { label: "Total Tasks", value: "47", change: "+5" },
  { label: "Due Today", value: "8", change: "+2" },
  { label: "Completed", value: "23", change: "+8" },
  { label: "Overdue", value: "3", change: "-1" },
]

export default function TasksPage() {
  const [viewMode, setViewMode] = useState<"list" | "calendar" | "kanban">("list")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")

  const filteredTasks = tasks.filter(task => {
    const statusMatch = statusFilter === "all" || task.status === statusFilter
    const priorityMatch = priorityFilter === "all" || task.priority === priorityFilter
    return statusMatch && priorityMatch
  })

  const todayTasks = filteredTasks.filter(task => task.dueDate === "2025-09-13")
  const upcomingTasks = filteredTasks.filter(task => task.dueDate > "2025-09-13")
  const overdueTasks = filteredTasks.filter(task => task.dueDate < "2025-09-13" && !task.completed)

  const tasksByStatus = {
    pending: filteredTasks.filter(task => task.status === "pending"),
    in_progress: filteredTasks.filter(task => task.status === "in_progress"),
    completed: filteredTasks.filter(task => task.status === "completed"),
  }

  const toggleTaskComplete = (taskId: number) => {
    // In real app, this would update the task status
    console.log(`Toggle complete for task ${taskId}`)
  }

  const formatTime = (time: string) => {
    return new Date(`2025-09-13T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const TaskCard = ({ task }: { task: typeof tasks[0] }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <Checkbox 
              checked={task.completed}
              onCheckedChange={() => toggleTaskComplete(task.id)}
              className="mt-1"
            />
            <div className="space-y-1">
              <CardTitle className={`text-lg ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                {typeIcons[task.type as keyof typeof typeIcons]} {task.title}
              </CardTitle>
              <CardDescription>{task.description}</CardDescription>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                Edit Task
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Badge variant={priorityColors[task.priority as keyof typeof priorityColors]}>
              {task.priority}
            </Badge>
            <Badge variant={statusColors[task.status as keyof typeof statusColors]}>
              {task.status.replace('_', ' ')}
            </Badge>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{formatTime(task.dueTime)}</span>
          </div>
        </div>
        
        {task.contact && (
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{task.contact}</span>
          </div>
        )}
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Assigned to {task.assignee}</span>
          <span>Due {task.dueDate}</span>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground">
            Manage your daily activities and follow-ups
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Task
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
                <span className="text-green-600">{stat.change}</span> from yesterday
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
            placeholder="Search tasks..."
            className="pl-8"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
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

        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "list" | "calendar" | "kanban")}>
          <TabsList>
            <TabsTrigger value="list">List</TabsTrigger>
            <TabsTrigger value="kanban">Kanban</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content */}
      <Tabs value={viewMode} className="space-y-4">
        <TabsContent value="list" className="space-y-6">
          {/* Today's Tasks */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Today ({todayTasks.length})</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {todayTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>

          {/* Overdue Tasks */}
          {overdueTasks.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4 text-destructive">Overdue ({overdueTasks.length})</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {overdueTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Tasks */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Upcoming ({upcomingTasks.length})</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {upcomingTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="kanban" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-3">
            {/* Pending Column */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Pending</h3>
                <Badge variant="secondary">{tasksByStatus.pending.length}</Badge>
              </div>
              <div className="space-y-4">
                {tasksByStatus.pending.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </div>

            {/* In Progress Column */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">In Progress</h3>
                <Badge variant="default">{tasksByStatus.in_progress.length}</Badge>
              </div>
              <div className="space-y-4">
                {tasksByStatus.in_progress.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </div>

            {/* Completed Column */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Completed</h3>
                <Badge variant="outline">{tasksByStatus.completed.length}</Badge>
              </div>
              <div className="space-y-4">
                {tasksByStatus.completed.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Calendar View</CardTitle>
              <CardDescription>View tasks in calendar format</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4" />
                <p>Calendar integration coming soon...</p>
                <p className="text-sm">Tasks will be displayed in a monthly calendar view</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
