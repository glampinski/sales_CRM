"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { 
  Plus, 
  Edit, 
  Trash2,
  Send,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Crown,
  Users,
  TrendingUp,
  DollarSign,
  Mail,
  Phone,
  MapPin,
  Building2
} from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

interface NewDistributor {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  sponsorId: string
  rank: string
  status: string
  notes: string
}

interface BulkAction {
  type: "email" | "status" | "rank" | "export" | "delete"
  label: string
  icon: React.ComponentType<{ className?: string }>
  variant?: "default" | "destructive" | "outline"
}

const bulkActions: BulkAction[] = [
  { type: "email", label: "Send Email", icon: Mail, variant: "default" },
  { type: "status", label: "Change Status", icon: Clock, variant: "outline" },
  { type: "rank", label: "Update Rank", icon: Crown, variant: "outline" },
  { type: "export", label: "Export Selected", icon: Download, variant: "outline" },
  { type: "delete", label: "Delete Selected", icon: Trash2, variant: "destructive" }
]

const ranks = ["Bronze", "Silver", "Gold", "Platinum", "Diamond", "Ambassador"]
const statuses = ["active", "inactive", "pending", "suspended"]

// Mock sponsor data for dropdown
const mockSponsors = [
  { id: "sponsor-001", name: "Michael Thompson", rank: "Diamond" },
  { id: "sponsor-002", name: "Jennifer Davis", rank: "Platinum" },
  { id: "sponsor-003", name: "Robert Miller", rank: "Gold" },
  { id: "sponsor-004", name: "Amanda Wilson", rank: "Silver" }
]

interface DistributorActionsProps {
  selectedDistributors: string[]
  onClearSelection: () => void
  onRefresh: () => void
}

export function DistributorActions({ 
  selectedDistributors, 
  onClearSelection, 
  onRefresh 
}: DistributorActionsProps) {
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showBulkEmailDialog, setShowBulkEmailDialog] = useState(false)
  const [showBulkStatusDialog, setShowBulkStatusDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [newDistributor, setNewDistributor] = useState<NewDistributor>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    sponsorId: "",
    rank: "Bronze",
    status: "pending",
    notes: ""
  })
  const [bulkEmail, setBulkEmail] = useState({
    subject: "",
    message: ""
  })
  const [bulkStatus, setBulkStatus] = useState("")

  const handleAddDistributor = () => {
    // In a real app, this would call an API
    console.log("Adding distributor:", newDistributor)
    setShowAddDialog(false)
    setNewDistributor({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "United States",
      sponsorId: "",
      rank: "Bronze",
      status: "pending",
      notes: ""
    })
    onRefresh()
  }

  const handleBulkAction = (actionType: string) => {
    switch (actionType) {
      case "email":
        setShowBulkEmailDialog(true)
        break
      case "status":
        setShowBulkStatusDialog(true)
        break
      case "rank":
        // Handle rank update
        break
      case "export":
        // Handle export
        console.log("Exporting distributors:", selectedDistributors)
        break
      case "delete":
        setShowDeleteDialog(true)
        break
    }
  }

  const handleBulkEmail = () => {
    console.log("Sending bulk email:", bulkEmail, "to:", selectedDistributors)
    setShowBulkEmailDialog(false)
    setBulkEmail({ subject: "", message: "" })
    onClearSelection()
  }

  const handleBulkStatusUpdate = () => {
    console.log("Updating status to:", bulkStatus, "for:", selectedDistributors)
    setShowBulkStatusDialog(false)
    setBulkStatus("")
    onClearSelection()
    onRefresh()
  }

  const handleBulkDelete = () => {
    console.log("Deleting distributors:", selectedDistributors)
    setShowDeleteDialog(false)
    onClearSelection()
    onRefresh()
  }

  return (
    <div className="space-y-4">
      {/* Action Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {selectedDistributors.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                {selectedDistributors.length} selected
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onClearSelection}
              >
                Clear
              </Button>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Distributor
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Distributor</DialogTitle>
                <DialogDescription>
                  Create a new distributor profile with all required information.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={newDistributor.firstName}
                      onChange={(e) => setNewDistributor(prev => ({ ...prev, firstName: e.target.value }))}
                      placeholder="Enter first name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={newDistributor.lastName}
                      onChange={(e) => setNewDistributor(prev => ({ ...prev, lastName: e.target.value }))}
                      placeholder="Enter last name"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newDistributor.email}
                      onChange={(e) => setNewDistributor(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter email address"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={newDistributor.phone}
                      onChange={(e) => setNewDistributor(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={newDistributor.address}
                    onChange={(e) => setNewDistributor(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Enter street address"
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={newDistributor.city}
                      onChange={(e) => setNewDistributor(prev => ({ ...prev, city: e.target.value }))}
                      placeholder="Enter city"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={newDistributor.state}
                      onChange={(e) => setNewDistributor(prev => ({ ...prev, state: e.target.value }))}
                      placeholder="Enter state"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      value={newDistributor.zipCode}
                      onChange={(e) => setNewDistributor(prev => ({ ...prev, zipCode: e.target.value }))}
                      placeholder="Enter ZIP code"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sponsor">Sponsor</Label>
                    <Select value={newDistributor.sponsorId} onValueChange={(value) => setNewDistributor(prev => ({ ...prev, sponsorId: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select sponsor" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockSponsors.map((sponsor) => (
                          <SelectItem key={sponsor.id} value={sponsor.id}>
                            {sponsor.name} ({sponsor.rank})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rank">Initial Rank</Label>
                    <Select value={newDistributor.rank} onValueChange={(value) => setNewDistributor(prev => ({ ...prev, rank: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ranks.map((rank) => (
                          <SelectItem key={rank} value={rank}>
                            {rank}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={newDistributor.notes}
                    onChange={(e) => setNewDistributor(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Enter any additional notes or comments"
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddDistributor}>
                  Add Distributor
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedDistributors.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Bulk Actions</CardTitle>
            <CardDescription>
              Apply actions to {selectedDistributors.length} selected distributor{selectedDistributors.length > 1 ? 's' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {bulkActions.map((action) => (
                <Button
                  key={action.type}
                  variant={action.variant || "outline"}
                  size="sm"
                  onClick={() => handleBulkAction(action.type)}
                >
                  <action.icon className="h-4 w-4 mr-1" />
                  {action.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bulk Email Dialog */}
      <Dialog open={showBulkEmailDialog} onOpenChange={setShowBulkEmailDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Bulk Email</DialogTitle>
            <DialogDescription>
              Send an email to {selectedDistributors.length} selected distributor{selectedDistributors.length > 1 ? 's' : ''}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={bulkEmail.subject}
                onChange={(e) => setBulkEmail(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="Enter email subject"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={bulkEmail.message}
                onChange={(e) => setBulkEmail(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Enter your message"
                rows={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBulkEmailDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleBulkEmail}>
              <Send className="h-4 w-4 mr-2" />
              Send Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Status Update Dialog */}
      <Dialog open={showBulkStatusDialog} onOpenChange={setShowBulkStatusDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Status</DialogTitle>
            <DialogDescription>
              Change the status for {selectedDistributors.length} selected distributor{selectedDistributors.length > 1 ? 's' : ''}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-2">
              <Label htmlFor="status">New Status</Label>
              <Select value={bulkStatus} onValueChange={setBulkStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select new status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      <div className="flex items-center space-x-2">
                        {status === "active" && <CheckCircle className="h-4 w-4 text-green-500" />}
                        {status === "inactive" && <XCircle className="h-4 w-4 text-gray-500" />}
                        {status === "pending" && <Clock className="h-4 w-4 text-yellow-500" />}
                        {status === "suspended" && <AlertTriangle className="h-4 w-4 text-red-500" />}
                        <span className="capitalize">{status}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBulkStatusDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleBulkStatusUpdate}>
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete {selectedDistributors.length} distributor{selectedDistributors.length > 1 ? 's' : ''} and remove their data from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
