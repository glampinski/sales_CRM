"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { usePermissions } from "@/contexts/PermissionContext-simple"
import { Package, Search, Plus, Filter, Download, Eye, Edit, Trash2, Star, TrendingUp, ShoppingCart, DollarSign, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mock product data - Timeshare products only
const products = [
  {
    id: 1,
    name: "Full Share",
    sku: "TS-FULL",
    category: "Timeshare",
    price: 150000.00,
    wholesalePrice: 112500.00, // 75% commission
    pv: 1500,
    stock: 25,
    status: "active" as const,
    image: "/placeholder.jpg",
    description: "Full ownership share with 365 days/year access and complete privileges",
    rating: 4.9,
    reviews: 45,
    sales: 12,
    tags: ["Popular", "Full Access", "Premium"],
    fraction: "1/1",
    usageDays: "365 days/year",
    commissionShare: "75%",
  },
  {
    id: 2,
    name: "1/2 Share",
    sku: "TS-HALF",
    category: "Timeshare",
    price: 80000.00,
    wholesalePrice: 58000.00, // 72.5% commission
    pv: 800,
    stock: 40,
    status: "active" as const,
    image: "/placeholder.jpg",
    description: "Half ownership share with 180 days/year access and standard privileges",
    rating: 4.8,
    reviews: 67,
    sales: 28,
    tags: ["Best Seller", "Balanced"],
    fraction: "1/2",
    usageDays: "180 days/year",
    commissionShare: "72.5%",
  },
  {
    id: 3,
    name: "1/4 Share",
    sku: "TS-QUARTER",
    category: "Timeshare",
    price: 42500.00,
    wholesalePrice: 29750.00, // 70% commission
    pv: 425,
    stock: 60,
    status: "active" as const,
    image: "/placeholder.jpg",
    description: "Quarter ownership share with 90 days/year access and basic privileges",
    rating: 4.7,
    reviews: 89,
    sales: 45,
    tags: ["Popular Choice", "Affordable"],
    fraction: "1/4",
    usageDays: "90 days/year",
    commissionShare: "70%",
  },
  {
    id: 4,
    name: "1/8 Share",
    sku: "TS-EIGHTH",
    category: "Timeshare",
    price: 21250.00,
    wholesalePrice: 14343.75, // 67.5% commission
    pv: 212,
    stock: 80,
    status: "active" as const,
    image: "/placeholder.jpg",
    description: "Eighth ownership share with 40 days/year access and essential privileges",
    rating: 4.6,
    reviews: 124,
    sales: 67,
    tags: ["Entry Level", "Starter"],
    fraction: "1/8",
    usageDays: "40 days/year",
    commissionShare: "67.5%",
  },
]

const stats = [
  { label: "Total Products", value: "4", change: "0", icon: Package },
  { label: "Active Products", value: "4", change: "0", icon: Package },
  { label: "Avg. Product Value", value: "€73,437", change: "+€2,100", icon: DollarSign },
  { label: "Total Shares Sold", value: "152", change: "+8", icon: TrendingUp },
]

const categories = ["All", "Timeshare"]

export default function ProductsPage() {
  const { user } = useAuth()
  const { canPurchaseProducts, canManageProducts, hasModuleAccess } = usePermissions()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [statusFilter, setStatusFilter] = useState("all")
  const [viewMode, setViewMode] = useState<"table" | "grid">("grid")

  const isCustomer = hasModuleAccess('customers')

  const handleProductPurchase = (product: any) => {
    if (canPurchaseProducts) {
      // Redirect existing customers to internal purchase flow
      const shareLevel = product.sku.toLowerCase().includes('full') ? 'full' :
                        product.sku.toLowerCase().includes('half') ? 'half' :
                        product.sku.toLowerCase().includes('quarter') ? 'quarter' : 'eighth'
      router.push(`/dashboard/purchase?step=3&share=${shareLevel}`)
    } else {
      // For admin/sales team, add to order (existing functionality)
      console.log("Adding to order:", product.name)
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "All" || product.category === categoryFilter
    const matchesStatus = statusFilter === "all" || product.status === statusFilter
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-EU', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "default"
      case "low_stock": return "destructive"
      case "out_of_stock": return "secondary"
      default: return "secondary"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active": return "Active"
      case "low_stock": return "Low Stock"
      case "out_of_stock": return "Out of Stock"
      default: return status
    }
  }

  const ProductCard = ({ product }: { product: typeof products[0] }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="aspect-square bg-muted rounded-lg mb-3 flex items-center justify-center">
          <Package className="h-12 w-12 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg leading-tight">{product.name}</CardTitle>
              <CardDescription>{product.sku} • {product.category}</CardDescription>
            </div>
            <Badge variant={getStatusColor(product.status) as any} className="text-xs">
              {getStatusText(product.status)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
        
        <div className="flex items-center space-x-1 text-sm">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="font-medium">{product.rating}</span>
          <span className="text-muted-foreground">({product.reviews} reviews)</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Share Price</p>
            <p className="text-lg font-bold">{formatCurrency(product.price)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">PV</p>
            <p className="text-lg font-bold">{product.pv}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Commission</p>
            <p className="text-sm font-medium">{formatCurrency(product.wholesalePrice)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Available</p>
            <p className="text-sm font-medium">{product.stock} shares</p>
          </div>
        </div>

        {/* Timeshare-specific info */}
        {(product as any).fraction && (
          <div className="grid grid-cols-2 gap-4 pt-2 border-t">
            <div>
              <p className="text-sm text-muted-foreground">Ownership</p>
              <p className="text-sm font-medium">{(product as any).fraction}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Usage Days</p>
              <p className="text-sm font-medium">{(product as any).usageDays}</p>
            </div>
          </div>
        )}

        <div>
          <p className="text-sm text-muted-foreground mb-2">Tags</p>
          <div className="flex flex-wrap gap-1">
            {product.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-sm text-muted-foreground">
            {product.sales} sold this month
          </span>
          <div className="flex items-center gap-2">
            {canPurchaseProducts && (
              <Button 
                onClick={() => handleProductPurchase(product)}
                size="sm"
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <ShoppingCart className="h-3 w-3 mr-1" />
                Buy This
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 z-50">
              <DropdownMenuItem className="cursor-pointer">
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </DropdownMenuItem>
              {!isCustomer && user?.role !== 'affiliate' && (
                <>
                  <DropdownMenuItem className="cursor-pointer">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Product
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="cursor-pointer"
                    onClick={() => handleProductPurchase(product)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Order
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600 cursor-pointer">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isCustomer ? "Available Timeshare Products" : "Timeshare Products"}
          </h1>
          <p className="text-muted-foreground">
            {isCustomer 
              ? "Choose your timeshare ownership level and start your onboarding process"
              : "Manage your timeshare offerings and ownership levels"
            }
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {!isCustomer && (
            <>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Catalog
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </>
          )}
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
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{stat.change}</span> this month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative w-72">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="low_stock">Low Stock</SelectItem>
              <SelectItem value="out_of_stock">Out of Stock</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "table" | "grid")}>
          <TabsList>
            <TabsTrigger value="grid">Grid</TabsTrigger>
            <TabsTrigger value="table">Table</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Product List */}
      <Tabs value={viewMode} className="space-y-6">
        <TabsContent value="grid">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="table">
          <Card>
            <CardHeader>
              <CardTitle>Timeshare Products ({filteredProducts.length})</CardTitle>
              <CardDescription>
                Manage your timeshare ownership levels and pricing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timeshare Type</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Ownership</TableHead>
                    <TableHead>Share Price</TableHead>
                    <TableHead>Commission</TableHead>
                    <TableHead>PV</TableHead>
                    <TableHead>Available</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Sales</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-muted rounded flex items-center justify-center">
                            <Package className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-muted-foreground flex items-center">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                              {product.rating} ({product.reviews})
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{(product as any).fraction || 'N/A'}</span>
                          <span className="text-xs text-muted-foreground">{(product as any).usageDays || ''}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{formatCurrency(product.price)}</TableCell>
                      <TableCell>{formatCurrency(product.wholesalePrice)}</TableCell>
                      <TableCell className="font-medium">{product.pv}</TableCell>
                      <TableCell>
                        <span className={product.stock < 20 ? "text-red-600 font-medium" : ""}>
                          {product.stock} shares
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(product.status) as any}>
                          {getStatusText(product.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>{product.sales}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {canPurchaseProducts && (
                            <Button 
                              onClick={() => handleProductPurchase(product)}
                              size="sm"
                              className="bg-primary hover:bg-primary/90 text-primary-foreground"
                            >
                              <ShoppingCart className="h-3 w-3 mr-1" />
                              Buy This
                            </Button>
                          )}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 z-50">
                            <DropdownMenuItem className="cursor-pointer">
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            {!isCustomer && user?.role !== 'affiliate' && (
                              <>
                                <DropdownMenuItem className="cursor-pointer">
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit Product
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="cursor-pointer"
                                  onClick={() => handleProductPurchase(product)}
                                >
                                  <ShoppingCart className="h-4 w-4 mr-2" />
                                  Add to Order
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600 cursor-pointer">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
