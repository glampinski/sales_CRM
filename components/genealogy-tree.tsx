"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Users, 
  TrendingUp, 
  Crown, 
  Star, 
  ChevronDown, 
  ChevronRight,
  DollarSign,
  Calendar,
  Award
} from "lucide-react"

export interface DistributorNode {
  id: string
  name: string
  email: string
  avatar?: string
  rank: "Bronze" | "Silver" | "Gold" | "Platinum" | "Diamond" | "Ambassador"
  personalVolume: number
  groupVolume: number
  totalCommission: number
  joinDate: string
  isActive: boolean
  children: DistributorNode[]
  level: number
}

interface GenealogyTreeProps {
  rootDistributor?: DistributorNode
}

// Mock data for demonstration
const mockGenealogyData: DistributorNode = {
  id: "1",
  name: "Michele Domizi",
  email: "michele@glampinski.com",
  avatar: "/placeholder-user.jpg",
  rank: "Diamond",
  personalVolume: 15000,
  groupVolume: 125000,
  totalCommission: 18750,
  joinDate: "2023-01-15",
  isActive: true,
  level: 0,
  children: [
    {
      id: "2",
      name: "Sarah Johnson",
      email: "sarah@example.com",
      rank: "Gold",
      personalVolume: 8500,
      groupVolume: 45000,
      totalCommission: 6750,
      joinDate: "2023-03-20",
      isActive: true,
      level: 1,
      children: [
        {
          id: "4",
          name: "Mike Chen",
          email: "mike@example.com",
          rank: "Silver",
          personalVolume: 3200,
          groupVolume: 12000,
          totalCommission: 1800,
          joinDate: "2023-06-10",
          isActive: true,
          level: 2,
          children: []
        },
        {
          id: "5",
          name: "Emma Wilson",
          email: "emma@example.com",
          rank: "Bronze",
          personalVolume: 1800,
          groupVolume: 5500,
          totalCommission: 825,
          joinDate: "2023-08-15",
          isActive: true,
          level: 2,
          children: []
        }
      ]
    },
    {
      id: "3",
      name: "David Rodriguez",
      email: "david@example.com",
      rank: "Platinum",
      personalVolume: 12000,
      groupVolume: 68000,
      totalCommission: 10200,
      joinDate: "2023-02-08",
      isActive: true,
      level: 1,
      children: [
        {
          id: "6",
          name: "Lisa Anderson",
          email: "lisa@example.com",
          rank: "Gold",
          personalVolume: 7500,
          groupVolume: 28000,
          totalCommission: 4200,
          joinDate: "2023-05-22",
          isActive: true,
          level: 2,
          children: []
        }
      ]
    }
  ]
}

const getRankColor = (rank: string) => {
  switch (rank) {
    case "Diamond": return "bg-blue-500"
    case "Platinum": return "bg-gray-400"
    case "Gold": return "bg-yellow-500"
    case "Silver": return "bg-gray-300"
    case "Bronze": return "bg-orange-600"
    case "Ambassador": return "bg-purple-600"
    default: return "bg-gray-200"
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

function DistributorCard({ distributor, onExpand, isExpanded }: {
  distributor: DistributorNode
  onExpand: (id: string) => void
  isExpanded: boolean
}) {
  const hasChildren = distributor.children.length > 0

  return (
    <Card className="w-80 border-2 hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={distributor.avatar} />
              <AvatarFallback>{distributor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{distributor.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{distributor.email}</p>
            </div>
          </div>
          {hasChildren && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onExpand(distributor.id)}
            >
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <Badge className={`${getRankColor(distributor.rank)} text-white`}>
            {getRankIcon(distributor.rank)}
            <span className="ml-1">{distributor.rank}</span>
          </Badge>
          <Badge variant={distributor.isActive ? "default" : "secondary"}>
            {distributor.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <div className="flex items-center space-x-1">
              <TrendingUp className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">PV:</span>
            </div>
            <p className="font-semibold">${distributor.personalVolume.toLocaleString()}</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center space-x-1">
              <Users className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">GV:</span>
            </div>
            <p className="font-semibold">${distributor.groupVolume.toLocaleString()}</p>
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center space-x-1">
            <DollarSign className="h-3 w-3 text-muted-foreground" />
            <span className="text-muted-foreground">Total Commission:</span>
          </div>
          <p className="font-semibold text-green-600">${distributor.totalCommission.toLocaleString()}</p>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center space-x-1">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            <span className="text-muted-foreground">Joined:</span>
          </div>
          <p className="text-sm">{new Date(distributor.joinDate).toLocaleDateString()}</p>
        </div>
        
        {hasChildren && (
          <div className="pt-2 border-t">
            <p className="text-sm text-muted-foreground">
              {distributor.children.length} direct {distributor.children.length === 1 ? 'distributor' : 'distributors'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function GenealogyTreeNode({ distributor, expandedNodes, onExpand, level = 0 }: {
  distributor: DistributorNode
  expandedNodes: Set<string>
  onExpand: (id: string) => void
  level?: number
}) {
  const isExpanded = expandedNodes.has(distributor.id)
  const hasChildren = distributor.children.length > 0

  return (
    <div className="flex flex-col items-center">
      <div className={`mb-4 ${level > 0 ? 'mt-8' : ''}`}>
        <DistributorCard 
          distributor={distributor} 
          onExpand={onExpand}
          isExpanded={isExpanded}
        />
      </div>
      
      {hasChildren && isExpanded && (
        <div className="relative">
          {/* Connector line */}
          {level < 3 && (
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-px h-8 bg-border"></div>
          )}
          
          <div className="flex space-x-8 mt-8">
            {distributor.children.map((child, index) => (
              <div key={child.id} className="relative">
                {/* Horizontal connector lines */}
                {level < 3 && (
                  <>
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-px h-8 bg-border"></div>
                    {index < distributor.children.length - 1 && (
                      <div className="absolute -top-8 left-1/2 w-full h-px bg-border"></div>
                    )}
                  </>
                )}
                
                <GenealogyTreeNode 
                  distributor={child} 
                  expandedNodes={expandedNodes}
                  onExpand={onExpand}
                  level={level + 1}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export function GenealogyTree({ rootDistributor = mockGenealogyData }: GenealogyTreeProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set([rootDistributor.id]))

  const handleExpand = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes)
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId)
    } else {
      newExpanded.add(nodeId)
    }
    setExpandedNodes(newExpanded)
  }

  const expandAll = () => {
    const getAllNodeIds = (node: DistributorNode): string[] => {
      return [node.id, ...node.children.flatMap(getAllNodeIds)]
    }
    setExpandedNodes(new Set(getAllNodeIds(rootDistributor)))
  }

  const collapseAll = () => {
    setExpandedNodes(new Set([rootDistributor.id]))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Genealogy Tree</h2>
          <p className="text-muted-foreground">View your distributor network and performance</p>
        </div>
        <div className="space-x-2">
          <Button variant="outline" onClick={expandAll}>
            Expand All
          </Button>
          <Button variant="outline" onClick={collapseAll}>
            Collapse All
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-fit p-8">
          <GenealogyTreeNode 
            distributor={rootDistributor}
            expandedNodes={expandedNodes}
            onExpand={handleExpand}
          />
        </div>
      </div>
    </div>
  )
}
