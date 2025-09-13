"use client"

import { useState } from "react"
import { Package, Search, Plus, Filter, Download, Eye, Edit, Trash2, Star, TrendingUp, ShoppingCart, DollarSign } from "lucide-react"
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

// Mock product data
const products = [
  {
    id: 1,
    name: "Wellness Pack Premium",
    sku: "WP-001",
    category: "Wellness",
    price: 89.99,
    wholesalePrice: 54.00,
    pv: 65,
    stock: 150,
    status: "active" as const,
    image: "/placeholder.jpg",
    description: "Complete wellness solution with vitamins and minerals",
    rating: 4.8,
    reviews: 124,
    sales: 89,
    tags: ["Popular", "Best Seller"],
  },
  {
    id: 2,
    name: "Beauty Essentials Set",
    sku: "BE-002",
    category: "Beauty",
    price: 129.99,
    wholesalePrice: 78.00,
    pv: 95,
    stock: 85,
    status: "active" as const,
    image: "/placeholder.jpg",
    description: "Premium skincare and beauty products collection",
    rating: 4.9,
    reviews: 89,
    sales: 67,
    tags: ["Premium", "New"],
  },
  {
    id: 3,
    name: "Fitness Boost Formula",
    sku: "FB-003",
    category: "Fitness",
    price: 45.99,
    wholesalePrice: 27.60,
    pv: 35,
    stock: 220,
    status: "active" as const,
    image: "/placeholder.jpg",
    description: "Energy and performance enhancement supplement",
    rating: 4.6,
    reviews: 156,
    sales: 134,
    tags: ["Fast Moving"],
  },
  {
    id: 4,
    name: "Complete Nutrition Bundle",
    sku: "CN-004",
    category: "Nutrition",
    price: 199.99,
    wholesalePrice: 120.00,
    pv: 150,
    stock: 45,
    status: "active" as const,
    image: "/placeholder.jpg",
    description: "Comprehensive nutrition package for optimal health",
    rating: 4.7,
    reviews: 78,
    sales: 34,
    tags: ["Bundle", "High Value"],
  },
  {
    id: 5,
    name: "Organic Green Tea Extract",
    sku: "GT-005",
    category: "Wellness",
    price: 29.99,
    wholesalePrice: 18.00,
    pv: 22,
    stock: 8,
    status: "low_stock" as const,
    image: "/placeholder.jpg",
    description: "Pure organic green tea extract for antioxidant support",
    rating: 4.5,
    reviews: 92,
    sales: 78,
    tags: ["Organic", "Low Stock"],
  },
  {
    id: 6,
    name: "Sleep Support Formula",
    sku: "SS-006",
    category: "Wellness",
    price: 39.99,
    wholesalePrice: 24.00,
    pv: 30,
    stock: 0,
    status: "out_of_stock" as const,
    image: "/placeholder.jpg",
    description: "Natural sleep aid with melatonin and herbs",
    rating: 4.4,
    reviews: 67,
    sales: 56,
    tags: ["Out of Stock"],
  },
]

const stats = [
  { label: "Total Products", value: "156", change: "+8", icon: Package },
  { label: "Active Products", value: "142", change: "+5", icon: Package },
  { label: "Avg. Product Value", value: "$89.50", change: "+$5.20", icon: DollarSign },
  { label: "Top Performer PV", value: "150", change: "+12", icon: TrendingUp },
]

const categories = ["All", "Wellness", "Beauty", "Fitness", "Nutrition"]

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [statusFilter, setStatusFilter] = useState("all")
  const [viewMode, setViewMode] = useState<"table" | "grid">("grid")

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "All" || product.category === categoryFilter
    const matchesStatus = statusFilter === "all" || product.status === statusFilter
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
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
            <p className="text-sm text-muted-foreground">Retail Price</p>
            <p className="text-lg font-bold">{formatCurrency(product.price)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">PV</p>
            <p className="text-lg font-bold">{product.pv}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Wholesale</p>
            <p className="text-sm font-medium">{formatCurrency(product.wholesalePrice)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Stock</p>
            <p className="text-sm font-medium">{product.stock} units</p>
          </div>
        </div>

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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="h-4 w-4 mr-2" />
                Edit Product
              </DropdownMenuItem>
              <DropdownMenuItem>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Order
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Product Catalog</h1>
          <p className="text-muted-foreground">
            Manage your product inventory and pricing
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Catalog
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
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
              <CardTitle>Products ({filteredProducts.length})</CardTitle>
              <CardDescription>
                Manage your product catalog and inventory
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Retail Price</TableHead>
                    <TableHead>Wholesale</TableHead>
                    <TableHead>PV</TableHead>
                    <TableHead>Stock</TableHead>
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
                      <TableCell>{product.category}</TableCell>
                      <TableCell className="font-medium">{formatCurrency(product.price)}</TableCell>
                      <TableCell>{formatCurrency(product.wholesalePrice)}</TableCell>
                      <TableCell className="font-medium">{product.pv}</TableCell>
                      <TableCell>
                        <span className={product.stock < 20 ? "text-red-600 font-medium" : ""}>
                          {product.stock}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(product.status) as any}>
                          {getStatusText(product.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>{product.sales}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              Actions
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Product
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              Add to Order
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
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
        </TabsContent>
      </Tabs>
    </div>
  )
}
