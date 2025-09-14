"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
  FileText, 
  Upload, 
  Download, 
  Edit, 
  Trash2, 
  Plus,
  Eye,
  MoreHorizontal,
  Building2,
  Settings,
  AlertCircle,
  CheckCircle,
  Clock
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface ContractTemplate {
  id: string
  name: string
  description: string
  contractType: "ownership" | "maintenance" | "usage_rights" | "amendment" | "general"
  shareLevel?: "full" | "half" | "quarter" | "eighth" | "all"
  propertyType?: "tiny_house" | "cabin" | "retreat" | "all"
  fileName: string
  fileSize: string
  version: string
  status: "active" | "draft" | "archived"
  createdDate: string
  lastModified: string
  uploadedBy: string
  downloadCount: number
  usageCount: number
  tags: string[]
}

// Mock contract templates data
const mockContractTemplates: ContractTemplate[] = [
  {
    id: "template-001",
    name: "Full Share Ownership Contract",
    description: "Complete ownership contract for full (1/1) timeshare purchases including all rights and responsibilities",
    contractType: "ownership",
    shareLevel: "full",
    propertyType: "all",
    fileName: "full-share-ownership-contract-v2.2.pdf",
    fileSize: "2.4 MB",
    version: "2.2",
    status: "active",
    createdDate: "2024-01-15",
    lastModified: "2024-08-10",
    uploadedBy: "Legal Team",
    downloadCount: 45,
    usageCount: 23,
    tags: ["ownership", "full-share", "legal"]
  },
  {
    id: "template-002",
    name: "Half Share Ownership Contract",
    description: "Ownership contract for 1/2 timeshare purchases with shared usage arrangements",
    contractType: "ownership",
    shareLevel: "half",
    propertyType: "all",
    fileName: "half-share-ownership-contract-v2.1.pdf",
    fileSize: "2.2 MB",
    version: "2.1",
    status: "active",
    createdDate: "2024-01-15",
    lastModified: "2024-07-22",
    uploadedBy: "Legal Team",
    downloadCount: 67,
    usageCount: 34,
    tags: ["ownership", "half-share", "legal"]
  },
  {
    id: "template-003",
    name: "Quarter Share Ownership Contract",
    description: "Contract for 1/4 timeshare ownership with seasonal usage rights",
    contractType: "ownership",
    shareLevel: "quarter",
    propertyType: "all",
    fileName: "quarter-share-ownership-contract-v2.0.pdf",
    fileSize: "2.0 MB",
    version: "2.0",
    status: "active",
    createdDate: "2024-01-15",
    lastModified: "2024-06-15",
    uploadedBy: "Legal Team",
    downloadCount: 89,
    usageCount: 52,
    tags: ["ownership", "quarter-share", "legal"]
  },
  {
    id: "template-004",
    name: "Eighth Share Ownership Contract",
    description: "Minimal ownership contract for 1/8 timeshare with limited usage days",
    contractType: "ownership",
    shareLevel: "eighth",
    propertyType: "all",
    fileName: "eighth-share-ownership-contract-v1.8.pdf",
    fileSize: "1.8 MB",
    version: "1.8",
    status: "active",
    createdDate: "2024-01-15",
    lastModified: "2024-05-30",
    uploadedBy: "Legal Team",
    downloadCount: 112,
    usageCount: 78,
    tags: ["ownership", "eighth-share", "legal"]
  },
  {
    id: "template-005",
    name: "Annual Maintenance Agreement",
    description: "Standard annual maintenance and upkeep agreement for all property types",
    contractType: "maintenance",
    shareLevel: "all",
    propertyType: "all",
    fileName: "annual-maintenance-agreement-v3.0.pdf",
    fileSize: "1.2 MB",
    version: "3.0",
    status: "active",
    createdDate: "2024-01-01",
    lastModified: "2024-09-01",
    uploadedBy: "Operations Team",
    downloadCount: 234,
    usageCount: 156,
    tags: ["maintenance", "annual", "operations"]
  },
  {
    id: "template-006",
    name: "Tiny House Specific Addendum",
    description: "Additional terms and conditions specific to tiny house properties",
    contractType: "amendment",
    shareLevel: "all",
    propertyType: "tiny_house",
    fileName: "tiny-house-addendum-v1.5.pdf",
    fileSize: "850 KB",
    version: "1.5",
    status: "active",
    createdDate: "2024-02-01",
    lastModified: "2024-08-15",
    uploadedBy: "Legal Team",
    downloadCount: 78,
    usageCount: 45,
    tags: ["tiny-house", "addendum", "specific"]
  },
  {
    id: "template-007",
    name: "VIP Customer Agreement",
    description: "Special terms and enhanced services for VIP tier customers",
    contractType: "general",
    shareLevel: "all",
    propertyType: "all",
    fileName: "vip-customer-agreement-v1.0.pdf",
    fileSize: "1.5 MB",
    version: "1.0",
    status: "draft",
    createdDate: "2024-08-01",
    lastModified: "2024-09-10",
    uploadedBy: "Customer Success",
    downloadCount: 12,
    usageCount: 3,
    tags: ["vip", "premium", "services"]
  }
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "active": return "bg-green-500 text-white"
    case "draft": return "bg-yellow-500 text-white"
    case "archived": return "bg-gray-500 text-white"
    default: return "bg-gray-200 text-black"
  }
}

const getContractTypeColor = (type: string) => {
  switch (type) {
    case "ownership": return "bg-blue-600 text-white"
    case "maintenance": return "bg-green-600 text-white"
    case "usage_rights": return "bg-purple-600 text-white"
    case "amendment": return "bg-orange-600 text-white"
    case "general": return "bg-gray-600 text-white"
    default: return "bg-gray-200 text-black"
  }
}

const getShareLevelDisplay = (level?: string) => {
  if (!level || level === "all") return "All Levels"
  switch (level) {
    case "full": return "1/1 Share"
    case "half": return "1/2 Share"
    case "quarter": return "1/4 Share"
    case "eighth": return "1/8 Share"
    default: return level
  }
}

const getPropertyTypeDisplay = (type?: string) => {
  if (!type || type === "all") return "All Properties"
  switch (type) {
    case "tiny_house": return "Tiny House"
    case "cabin": return "Cabin"
    case "retreat": return "Retreat"
    default: return type
  }
}

export function ContractTemplateManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [shareLevelFilter, setShareLevelFilter] = useState("all")
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<ContractTemplate | null>(null)

  // New contract form state
  const [newContract, setNewContract] = useState({
    name: "",
    description: "",
    contractType: "ownership",
    shareLevel: "all",
    propertyType: "all",
    tags: ""
  })

  const filteredTemplates = mockContractTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.fileName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || template.status === statusFilter
    const matchesType = typeFilter === "all" || template.contractType === typeFilter
    const matchesShareLevel = shareLevelFilter === "all" || template.shareLevel === shareLevelFilter || template.shareLevel === "all"
    return matchesSearch && matchesStatus && matchesType && matchesShareLevel
  })

  const handleUploadNew = () => {
    console.log("Uploading new contract template:", newContract)
    setIsUploadDialogOpen(false)
    setNewContract({
      name: "",
      description: "",
      contractType: "ownership",
      shareLevel: "all",
      propertyType: "all",
      tags: ""
    })
  }

  const handleDownload = (template: ContractTemplate) => {
    console.log("Downloading template:", template.fileName)
    // In real app, trigger file download
  }

  const handlePreview = (template: ContractTemplate) => {
    console.log("Previewing template:", template.fileName)
    // In real app, open PDF preview
  }

  const handleEdit = (template: ContractTemplate) => {
    setSelectedTemplate(template)
    console.log("Editing template:", template.name)
  }

  const handleDelete = (template: ContractTemplate) => {
    console.log("Deleting template:", template.name)
    // In real app, show confirmation and delete
  }

  const stats = [
    { label: "Total Templates", value: mockContractTemplates.length.toString(), icon: FileText },
    { label: "Active Contracts", value: mockContractTemplates.filter(t => t.status === "active").length.toString(), icon: CheckCircle },
    { label: "Draft Contracts", value: mockContractTemplates.filter(t => t.status === "draft").length.toString(), icon: Clock },
    { label: "Total Downloads", value: mockContractTemplates.reduce((sum, t) => sum + t.downloadCount, 0).toString(), icon: Download }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contract Template Management</h1>
          <p className="text-muted-foreground">
            Manage contract templates for different timeshare levels and property types
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Upload Template
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Upload New Contract Template</DialogTitle>
                <DialogDescription>
                  Add a new contract template for specific timeshare levels and property types
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Template Name</Label>
                    <Input
                      id="name"
                      value={newContract.name}
                      onChange={(e) => setNewContract(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Full Share Ownership Contract"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contractType">Contract Type</Label>
                    <Select 
                      value={newContract.contractType} 
                      onValueChange={(value) => setNewContract(prev => ({ ...prev, contractType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ownership">Ownership</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="usage_rights">Usage Rights</SelectItem>
                        <SelectItem value="amendment">Amendment</SelectItem>
                        <SelectItem value="general">General</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="shareLevel">Share Level</Label>
                    <Select 
                      value={newContract.shareLevel} 
                      onValueChange={(value) => setNewContract(prev => ({ ...prev, shareLevel: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Levels</SelectItem>
                        <SelectItem value="full">Full Share (1/1)</SelectItem>
                        <SelectItem value="half">Half Share (1/2)</SelectItem>
                        <SelectItem value="quarter">Quarter Share (1/4)</SelectItem>
                        <SelectItem value="eighth">Eighth Share (1/8)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="propertyType">Property Type</Label>
                    <Select 
                      value={newContract.propertyType} 
                      onValueChange={(value) => setNewContract(prev => ({ ...prev, propertyType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Properties</SelectItem>
                        <SelectItem value="tiny_house">Tiny House</SelectItem>
                        <SelectItem value="cabin">Cabin</SelectItem>
                        <SelectItem value="retreat">Retreat</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newContract.description}
                    onChange={(e) => setNewContract(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the purpose and scope of this contract template..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    value={newContract.tags}
                    onChange={(e) => setNewContract(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="legal, ownership, tiny-house"
                  />
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <Button variant="outline">
                      Choose PDF File
                    </Button>
                    <p className="mt-2 text-sm text-gray-500">
                      Upload a PDF contract template (max 10MB)
                    </p>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUploadNew}>
                  Upload Template
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-muted/50 rounded-lg">
        <div className="relative flex-1 min-w-[250px] max-w-sm">
          <Input
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="ownership">Ownership</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
            <SelectItem value="usage_rights">Usage Rights</SelectItem>
            <SelectItem value="amendment">Amendment</SelectItem>
            <SelectItem value="general">General</SelectItem>
          </SelectContent>
        </Select>

        <Select value={shareLevelFilter} onValueChange={setShareLevelFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Share Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="full">Full Share</SelectItem>
            <SelectItem value="half">Half Share</SelectItem>
            <SelectItem value="quarter">Quarter Share</SelectItem>
            <SelectItem value="eighth">Eighth Share</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Contract Templates Table */}
      <Card>
        <CardHeader>
          <CardTitle>Contract Templates ({filteredTemplates.length})</CardTitle>
          <CardDescription>
            Manage and organize contract templates for different timeshare configurations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Template Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Share Level</TableHead>
                <TableHead>Property Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Usage Count</TableHead>
                <TableHead>Last Modified</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTemplates.map((template) => (
                <TableRow key={template.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{template.name}</p>
                      <p className="text-sm text-muted-foreground">{template.fileName}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getContractTypeColor(template.contractType)}>
                      {template.contractType}
                    </Badge>
                  </TableCell>
                  <TableCell>{getShareLevelDisplay(template.shareLevel)}</TableCell>
                  <TableCell>{getPropertyTypeDisplay(template.propertyType)}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(template.status)}>
                      {template.status}
                    </Badge>
                  </TableCell>
                  <TableCell>v{template.version}</TableCell>
                  <TableCell>{template.usageCount}</TableCell>
                  <TableCell>{new Date(template.lastModified).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handlePreview(template)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDownload(template)}>
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(template)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(template)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
