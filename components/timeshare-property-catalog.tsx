"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  MapPin, 
  Bed, 
  Bath, 
  Square,
  Users,
  Wifi,
  Car,
  TreePine,
  Mountain,
  DollarSign,
  Calendar,
  Star,
  Share,
  Heart,
  Eye,
  Filter,
  SortAsc,
  Search,
  Plus,
  ShoppingCart,
  UserPlus,
  Phone,
  Mail,
  Edit,
  Settings,
  BarChart3
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/AuthContext"

interface TimeshareProperty {
  id: string
  name: string
  description: string
  location: {
    address: string
    city: string
    state: string
    country: string
    coordinates: { lat: number; lng: number }
  }
  propertyType: "tiny_house" | "cabin" | "retreat"
  images: string[]
  specifications: {
    bedrooms: number
    bathrooms: number
    squareFeet: number
    maxOccupancy: number
    yearBuilt: number
  }
  amenities: string[]
  shareOptions: {
    level: "full" | "half" | "quarter" | "eighth"
    totalShares: number
    availableShares: number
    pricePerShare: number
    annualMaintenanceFee: number
    usageDaysPerYear: number
  }[]
  availability: {
    season: "spring" | "summer" | "fall" | "winter" | "year_round"
    bookingWindow: number // days in advance
    minimumStay: number // nights
  }
  ratings: {
    overall: number
    cleanliness: number
    location: number
    value: number
    communication: number
    totalReviews: number
  }
  status: "available" | "limited" | "waitlist" | "sold_out"
  featured: boolean
  createdDate: string
  lastUpdated: string
}

// Mock timeshare properties data
const mockProperties: TimeshareProperty[] = [
  {
    id: "prop-001",
    name: "Alpine Tiny House Retreat",
    description: "A stunning tiny house nestled in the heart of the Rocky Mountains, featuring panoramic views and modern amenities. Perfect for couples seeking a romantic getaway or nature enthusiasts wanting to disconnect from city life.",
    location: {
      address: "1234 Mountain View Trail",
      city: "Aspen",
      state: "Colorado",
      country: "USA",
      coordinates: { lat: 39.1911, lng: -106.8175 }
    },
    propertyType: "tiny_house",
    images: ["/placeholder.jpg", "/placeholder.jpg", "/placeholder.jpg"],
    specifications: {
      bedrooms: 1,
      bathrooms: 1,
      squareFeet: 400,
      maxOccupancy: 2,
      yearBuilt: 2023
    },
    amenities: ["WiFi", "Kitchen", "Fireplace", "Deck", "Parking", "Hot Tub", "Mountain Views"],
    shareOptions: [
      {
        level: "full",
        totalShares: 1,
        availableShares: 0,
        pricePerShare: 180000,
        annualMaintenanceFee: 3600,
        usageDaysPerYear: 365
      },
      {
        level: "half",
        totalShares: 2,
        availableShares: 1,
        pricePerShare: 95000,
        annualMaintenanceFee: 1800,
        usageDaysPerYear: 182
      },
      {
        level: "quarter",
        totalShares: 4,
        availableShares: 2,
        pricePerShare: 48000,
        annualMaintenanceFee: 900,
        usageDaysPerYear: 91
      },
      {
        level: "eighth",
        totalShares: 8,
        availableShares: 3,
        pricePerShare: 25000,
        annualMaintenanceFee: 450,
        usageDaysPerYear: 45
      }
    ],
    availability: {
      season: "year_round",
      bookingWindow: 90,
      minimumStay: 2
    },
    ratings: {
      overall: 4.8,
      cleanliness: 4.9,
      location: 4.9,
      value: 4.7,
      communication: 4.8,
      totalReviews: 156
    },
    status: "available",
    featured: true,
    createdDate: "2024-01-15",
    lastUpdated: "2024-09-10"
  },
  {
    id: "prop-002",
    name: "Lakeside Cabin Escape",
    description: "Charming log cabin situated on the shores of Crystal Lake. Features rustic charm with modern conveniences, private dock, and spectacular sunset views. Ideal for families and fishing enthusiasts.",
    location: {
      address: "567 Lakeshore Drive",
      city: "Lake Tahoe",
      state: "California",
      country: "USA",
      coordinates: { lat: 39.0968, lng: -120.0324 }
    },
    propertyType: "cabin",
    images: ["/placeholder.jpg", "/placeholder.jpg", "/placeholder.jpg"],
    specifications: {
      bedrooms: 2,
      bathrooms: 2,
      squareFeet: 800,
      maxOccupancy: 6,
      yearBuilt: 2022
    },
    amenities: ["WiFi", "Full Kitchen", "Fireplace", "Private Dock", "Parking", "Lake Access", "Fishing"],
    shareOptions: [
      {
        level: "full",
        totalShares: 1,
        availableShares: 0,
        pricePerShare: 320000,
        annualMaintenanceFee: 6400,
        usageDaysPerYear: 365
      },
      {
        level: "half",
        totalShares: 2,
        availableShares: 0,
        pricePerShare: 165000,
        annualMaintenanceFee: 3200,
        usageDaysPerYear: 182
      },
      {
        level: "quarter",
        totalShares: 4,
        availableShares: 1,
        pricePerShare: 85000,
        annualMaintenanceFee: 1600,
        usageDaysPerYear: 91
      },
      {
        level: "eighth",
        totalShares: 8,
        availableShares: 2,
        pricePerShare: 43000,
        annualMaintenanceFee: 800,
        usageDaysPerYear: 45
      }
    ],
    availability: {
      season: "spring",
      bookingWindow: 120,
      minimumStay: 3
    },
    ratings: {
      overall: 4.9,
      cleanliness: 4.8,
      location: 5.0,
      value: 4.8,
      communication: 4.9,
      totalReviews: 203
    },
    status: "limited",
    featured: true,
    createdDate: "2024-02-01",
    lastUpdated: "2024-09-05"
  },
  {
    id: "prop-003",
    name: "Desert Zen Retreat",
    description: "Modern minimalist tiny house in the serene Sonoran Desert. Features sustainable design, solar power, and unparalleled stargazing opportunities. Perfect for meditation and digital detox.",
    location: {
      address: "890 Desert Bloom Road",
      city: "Sedona",
      state: "Arizona",
      country: "USA",
      coordinates: { lat: 34.8697, lng: -111.7610 }
    },
    propertyType: "retreat",
    images: ["/placeholder.jpg", "/placeholder.jpg", "/placeholder.jpg"],
    specifications: {
      bedrooms: 1,
      bathrooms: 1,
      squareFeet: 350,
      maxOccupancy: 2,
      yearBuilt: 2024
    },
    amenities: ["Solar Power", "Kitchen", "Meditation Space", "Outdoor Shower", "Stargazing Deck", "Hiking Trails"],
    shareOptions: [
      {
        level: "half",
        totalShares: 2,
        availableShares: 2,
        pricePerShare: 125000,
        annualMaintenanceFee: 2500,
        usageDaysPerYear: 182
      },
      {
        level: "quarter",
        totalShares: 4,
        availableShares: 4,
        pricePerShare: 63000,
        annualMaintenanceFee: 1250,
        usageDaysPerYear: 91
      },
      {
        level: "eighth",
        totalShares: 8,
        availableShares: 6,
        pricePerShare: 32000,
        annualMaintenanceFee: 625,
        usageDaysPerYear: 45
      }
    ],
    availability: {
      season: "fall",
      bookingWindow: 60,
      minimumStay: 2
    },
    ratings: {
      overall: 4.7,
      cleanliness: 4.8,
      location: 4.6,
      value: 4.9,
      communication: 4.7,
      totalReviews: 89
    },
    status: "available",
    featured: false,
    createdDate: "2024-03-15",
    lastUpdated: "2024-09-01"
  }
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "available": return "bg-green-600 text-white"
    case "limited": return "bg-yellow-600 text-white"
    case "waitlist": return "bg-orange-600 text-white"
    case "sold_out": return "bg-red-600 text-white"
    default: return "bg-gray-600 text-white"
  }
}

const getPropertyTypeIcon = (type: string) => {
  switch (type) {
    case "tiny_house": return "🏠"
    case "cabin": return "🏕️"
    case "retreat": return "🧘"
    default: return "🏠"
  }
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

const getShareDisplay = (level: string) => {
  switch (level) {
    case "full": return "1/1"
    case "half": return "1/2"
    case "quarter": return "1/4"
    case "eighth": return "1/8"
    default: return level
  }
}

export function TimesharePropertyCatalog() {
  const { user } = useAuth()
  const router = useRouter()
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchTerm, setSearchTerm] = useState("")
  const [locationFilter, setLocationFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [priceRange, setPriceRange] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("featured")
  const [selectedProperty, setSelectedProperty] = useState<TimeshareProperty | null>(null)
  const [cart, setCart] = useState<Array<{propertyId: string, shareLevel: string, price: number}>>([])
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null)

  // Role-based feature flags
  const isCustomer = user?.role === 'customer'
  const isSalesTeam = user?.role === 'affiliate' || user?.role === 'admin' || user?.role === 'super_admin'
  const canManageProperties = user?.role === 'admin' || user?.role === 'super_admin'

  const filteredProperties = mockProperties.filter(property => {
    const matchesSearch = property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLocation = locationFilter === "all" || property.location.state === locationFilter
    const matchesType = typeFilter === "all" || property.propertyType === typeFilter
    const matchesStatus = statusFilter === "all" || property.status === statusFilter
    
    // Price range filter based on cheapest share option
    const minPrice = Math.min(...property.shareOptions.map(opt => opt.pricePerShare))
    let matchesPrice = true
    if (priceRange === "under_50k") matchesPrice = minPrice < 50000
    else if (priceRange === "50k_100k") matchesPrice = minPrice >= 50000 && minPrice <= 100000
    else if (priceRange === "100k_200k") matchesPrice = minPrice >= 100000 && minPrice <= 200000
    else if (priceRange === "over_200k") matchesPrice = minPrice > 200000

    return matchesSearch && matchesLocation && matchesType && matchesStatus && matchesPrice
  })

  // Sort properties
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    switch (sortBy) {
      case "featured":
        if (a.featured && !b.featured) return -1
        if (!a.featured && b.featured) return 1
        return b.ratings.overall - a.ratings.overall
      case "price_low":
        return Math.min(...a.shareOptions.map(opt => opt.pricePerShare)) - 
               Math.min(...b.shareOptions.map(opt => opt.pricePerShare))
      case "price_high":
        return Math.min(...b.shareOptions.map(opt => opt.pricePerShare)) - 
               Math.min(...a.shareOptions.map(opt => opt.pricePerShare))
      case "rating":
        return b.ratings.overall - a.ratings.overall
      case "newest":
        return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
      default:
        return 0
    }
  })

  const handlePropertyClick = (property: TimeshareProperty) => {
    setSelectedProperty(property)
  }

  const addToCart = (propertyId: string, shareLevel: string, price: number) => {
    // Convert shareLevel to the format expected by the purchase flow
    const shareLevelMap: Record<string, "full" | "half" | "quarter" | "eighth"> = {
      "full": "full",
      "half": "half", 
      "quarter": "quarter",
      "eighth": "eighth"
    }
    
    const mappedShareLevel = shareLevelMap[shareLevel]
    
    if (mappedShareLevel) {
      // Redirect to embedded purchase flow with pre-selected share level
      const currentUser = user
      if (currentUser?.role === 'customer') {
        // For customers, go to purchase with their customer ID
        router.push(`/purchase?customerId=${currentUser.id}&shareLevel=${mappedShareLevel}`)
      } else {
        // For others, go to purchase without customer ID (will prompt for customer selection or new customer)
        router.push(`/purchase?shareLevel=${mappedShareLevel}`)
      }
    } else {
      console.log(`Added to cart: ${propertyId} - ${shareLevel} share for ${formatPrice(price)}`)
      setCart(prev => [...prev, { propertyId, shareLevel, price }])
    }
  }

  const createLeadFromProperty = (property: TimeshareProperty, shareLevel: string) => {
    console.log(`Creating lead for ${property.name} - ${shareLevel} share`)
    // In real app: navigate to lead creation with pre-filled property data
  }

  const schedulePropertyViewing = (property: TimeshareProperty) => {
    console.log(`Scheduling viewing for ${property.name}`)
    // In real app: open calendar scheduling modal
  }

  const assignToCustomer = (propertyId: string, customerId: string) => {
    console.log(`Assigning property ${propertyId} to customer ${customerId}`)
    // In real app: create customer-property relationship
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0)
  const cartCount = cart.length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isCustomer ? "Property Catalog" : "Timeshare Property Management"}
          </h1>
          <p className="text-muted-foreground">
            {isCustomer 
              ? "Discover unique tiny houses, cabins, and retreats available for fractional ownership"
              : "Manage property listings and help customers find their perfect timeshare"
            }
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {isCustomer && (
            <>
              <Button variant="outline" className="relative">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Cart ({cartCount})
                {cartCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                    {cartCount}
                  </Badge>
                )}
              </Button>
              <Button variant="outline">
                <Heart className="h-4 w-4 mr-2" />
                Wishlist
              </Button>
            </>
          )}
          {isSalesTeam && (
            <>
              <Button variant="outline">
                <UserPlus className="h-4 w-4 mr-2" />
                Create Lead
              </Button>
              <Button variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </Button>
            </>
          )}
          {canManageProperties && (
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Property
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-muted/50 rounded-lg">
        <div className="relative flex-1 min-w-[250px] max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search properties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <Select value={locationFilter} onValueChange={setLocationFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            <SelectItem value="Colorado">Colorado</SelectItem>
            <SelectItem value="California">California</SelectItem>
            <SelectItem value="Arizona">Arizona</SelectItem>
          </SelectContent>
        </Select>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="tiny_house">Tiny House</SelectItem>
            <SelectItem value="cabin">Cabin</SelectItem>
            <SelectItem value="retreat">Retreat</SelectItem>
          </SelectContent>
        </Select>

        <Select value={priceRange} onValueChange={setPriceRange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Price Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Prices</SelectItem>
            <SelectItem value="under_50k">Under $50K</SelectItem>
            <SelectItem value="50k_100k">$50K - $100K</SelectItem>
            <SelectItem value="100k_200k">$100K - $200K</SelectItem>
            <SelectItem value="over_200k">Over $200K</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="limited">Limited</SelectItem>
            <SelectItem value="waitlist">Waitlist</SelectItem>
            <SelectItem value="sold_out">Sold Out</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="featured">Featured</SelectItem>
            <SelectItem value="price_low">Price: Low to High</SelectItem>
            <SelectItem value="price_high">Price: High to Low</SelectItem>
            <SelectItem value="rating">Highest Rated</SelectItem>
            <SelectItem value="newest">Newest</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Shopping Cart Summary for Customers */}
      {isCustomer && cartCount > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-blue-900">Your Cart ({cartCount} items)</h3>
                <p className="text-sm text-blue-700">Total: {formatPrice(cartTotal)}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setCart([])}>
                  Clear Cart
                </Button>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Checkout
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* CRM Tools for Sales Team */}
      {isSalesTeam && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-green-900">CRM Tools</h3>
                <p className="text-sm text-green-700">Use these properties to help customers find their perfect timeshare</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Property List
                </Button>
                <Button variant="outline" size="sm">
                  <Phone className="h-4 w-4 mr-2" />
                  Schedule Call
                </Button>
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Create Proposal
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {sortedProperties.length} of {mockProperties.length} properties
        </p>
        <div className="flex items-center space-x-2">
          <Button 
            variant={viewMode === "grid" ? "default" : "outline"} 
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            Grid
          </Button>
          <Button 
            variant={viewMode === "list" ? "default" : "outline"} 
            size="sm"
            onClick={() => setViewMode("list")}
          >
            List
          </Button>
        </div>
      </div>

      {/* Property Grid */}
      <div className={viewMode === "grid" ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3" : "space-y-4"}>
        {sortedProperties.map((property) => (
          <Card 
            key={property.id} 
            className={`cursor-pointer transition-all hover:shadow-lg ${viewMode === "list" ? "flex" : ""}`}
            onClick={() => handlePropertyClick(property)}
          >
            <div className={viewMode === "list" ? "w-1/3" : ""}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg">
                <img
                  src={property.images[0]}
                  alt={property.name}
                  className="object-cover w-full h-full"
                />
                <div className="absolute top-2 left-2 flex gap-2">
                  {property.featured && (
                    <Badge className="bg-yellow-600 text-white">
                      Featured
                    </Badge>
                  )}
                  <Badge className={getStatusColor(property.status)}>
                    {property.status}
                  </Badge>
                </div>
                <div className="absolute top-2 right-2">
                  {isCustomer ? (
                    <Button variant="secondary" size="icon" className="bg-white/80 hover:bg-white">
                      <Heart className="h-4 w-4" />
                    </Button>
                  ) : (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="secondary" size="icon" className="bg-white/80 hover:bg-white">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => createLeadFromProperty(property, 'quarter')}>
                          <UserPlus className="mr-2 h-4 w-4" />
                          Create Lead
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => schedulePropertyViewing(property)}>
                          <Calendar className="mr-2 h-4 w-4" />
                          Schedule Viewing
                        </DropdownMenuItem>
                        {canManageProperties && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Property
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <BarChart3 className="mr-2 h-4 w-4" />
                              View Analytics
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
                <div className="absolute bottom-2 left-2">
                  <Badge variant="secondary" className="bg-white/90 text-black">
                    {getPropertyTypeIcon(property.propertyType)} {property.propertyType.replace("_", " ")}
                  </Badge>
                </div>
              </div>
            </div>

            <CardContent className={`p-4 ${viewMode === "list" ? "flex-1" : ""}`}>
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-lg">{property.name}</h3>
                  <p className="text-sm text-muted-foreground flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {property.location.city}, {property.location.state}
                  </p>
                </div>

                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span className="flex items-center">
                    <Bed className="h-3 w-3 mr-1" />
                    {property.specifications.bedrooms}
                  </span>
                  <span className="flex items-center">
                    <Bath className="h-3 w-3 mr-1" />
                    {property.specifications.bathrooms}
                  </span>
                  <span className="flex items-center">
                    <Square className="h-3 w-3 mr-1" />
                    {property.specifications.squareFeet} sq ft
                  </span>
                  <span className="flex items-center">
                    <Users className="h-3 w-3 mr-1" />
                    {property.specifications.maxOccupancy}
                  </span>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2">
                  {property.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{property.ratings.overall}</span>
                    <span className="text-sm text-muted-foreground">
                      ({property.ratings.totalReviews} reviews)
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Share Options:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {property.shareOptions
                      .filter(option => option.availableShares > 0)
                      .slice(0, 2)
                      .map((option) => (
                      <div key={option.level} className="text-xs bg-muted p-2 rounded">
                        <div className="font-medium">{getShareDisplay(option.level)} Share</div>
                        <div className="text-green-600 font-semibold">
                          {formatPrice(option.pricePerShare)}
                        </div>
                        <div className="text-muted-foreground">
                          {option.usageDaysPerYear} days/year
                        </div>
                      </div>
                    ))}
                  </div>
                  {property.shareOptions.filter(option => option.availableShares > 0).length > 2 && (
                    <p className="text-xs text-muted-foreground">
                      +{property.shareOptions.filter(option => option.availableShares > 0).length - 2} more options
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Property Detail Dialog */}
      {selectedProperty && (
        <Dialog open={!!selectedProperty} onOpenChange={() => setSelectedProperty(null)}>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedProperty.name}</DialogTitle>
              <DialogDescription>
                {selectedProperty.location.city}, {selectedProperty.location.state}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Property Images */}
              <div className="aspect-[16/9] rounded-lg overflow-hidden">
                <img
                  src={selectedProperty.images[0]}
                  alt={selectedProperty.name}
                  className="object-cover w-full h-full"
                />
              </div>

              {/* Property Details */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedProperty.description}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Specifications</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>Bedrooms: {selectedProperty.specifications.bedrooms}</div>
                      <div>Bathrooms: {selectedProperty.specifications.bathrooms}</div>
                      <div>Square Feet: {selectedProperty.specifications.squareFeet}</div>
                      <div>Max Occupancy: {selectedProperty.specifications.maxOccupancy}</div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Amenities</h3>
                    <div className="flex flex-wrap gap-1">
                      {selectedProperty.amenities.map((amenity) => (
                        <Badge key={amenity} variant="secondary" className="text-xs">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Share Options</h3>
                    <div className="space-y-3">
                      {selectedProperty.shareOptions.map((option) => (
                        <div key={option.level} className="border rounded-lg p-3">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <div className="font-medium">{getShareDisplay(option.level)} Share</div>
                              <div className="text-sm text-muted-foreground">
                                {option.usageDaysPerYear} days per year
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold text-green-600">
                                {formatPrice(option.pricePerShare)}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                +{formatPrice(option.annualMaintenanceFee)}/year
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="text-sm">
                              {option.availableShares} of {option.totalShares} available
                            </div>
                            {isCustomer ? (
                              <Button 
                                size="sm" 
                                disabled={option.availableShares === 0}
                                className="text-xs"
                                onClick={() => addToCart(selectedProperty.id, option.level, option.pricePerShare)}
                              >
                                {option.availableShares > 0 ? "Add to Cart" : "Waitlist"}
                              </Button>
                            ) : (
                              <div className="flex gap-1">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="text-xs"
                                  onClick={() => createLeadFromProperty(selectedProperty, option.level)}
                                >
                                  <UserPlus className="h-3 w-3 mr-1" />
                                  Lead
                                </Button>
                                <Button 
                                  size="sm" 
                                  className="text-xs"
                                  onClick={() => schedulePropertyViewing(selectedProperty)}
                                >
                                  <Calendar className="h-3 w-3 mr-1" />
                                  Schedule
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Ratings</h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Overall</span>
                        <span>{selectedProperty.ratings.overall}/5</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cleanliness</span>
                        <span>{selectedProperty.ratings.cleanliness}/5</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Location</span>
                        <span>{selectedProperty.ratings.location}/5</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Value</span>
                        <span>{selectedProperty.ratings.value}/5</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedProperty(null)}>
                Close
              </Button>
              {isCustomer ? (
                <Button>
                  <Heart className="h-4 w-4 mr-2" />
                  Add to Wishlist
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => createLeadFromProperty(selectedProperty, 'quarter')}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Create Lead
                  </Button>
                  <Button onClick={() => schedulePropertyViewing(selectedProperty)}>
                    <Phone className="h-4 w-4 mr-2" />
                    Contact Customer
                  </Button>
                </div>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
