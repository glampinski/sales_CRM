"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  Package, 
  ShoppingCart, 
  Star, 
  DollarSign, 
  Target, 
  Info,
  Plus,
  Minus
} from "lucide-react"
import Image from "next/image"

interface Product {
  id: string
  name: string
  sku: string
  category: string
  price: number
  wholesalePrice: number
  pv: number
  stock: number
  status: "active" | "inactive" | "discontinued"
  image: string
  description: string
  features?: string[]
  commission?: number
}

interface CartItem extends Product {
  quantity: number
}

interface ProductCatalogProps {
  onAddToCart?: (product: Product, quantity: number) => void
  showCartFeatures?: boolean
  customerTier?: string
}

const products: Product[] = [
  {
    id: "prod-001",
    name: "Wellness Pack Premium",
    sku: "WP-001",
    category: "Wellness",
    price: 89.99,
    wholesalePrice: 54.00,
    pv: 65,
    stock: 150,
    status: "active",
    image: "/placeholder.jpg",
    description: "Complete wellness solution with vitamins and minerals for daily health support.",
    features: ["Daily vitamins", "Mineral complex", "Antioxidants", "Energy support"],
    commission: 35.99
  },
  {
    id: "prod-002",
    name: "Beauty Essentials Set",
    sku: "BE-002",
    category: "Beauty",
    price: 129.99,
    wholesalePrice: 78.00,
    pv: 95,
    stock: 85,
    status: "active",
    image: "/placeholder.jpg",
    description: "Premium skincare collection for radiant, healthy-looking skin.",
    features: ["Anti-aging formula", "Natural ingredients", "Hydrating complex", "UV protection"],
    commission: 51.99
  },
  {
    id: "prod-003",
    name: "Fitness Boost Formula",
    sku: "FB-003",
    category: "Fitness",
    price: 45.99,
    wholesalePrice: 27.60,
    pv: 35,
    stock: 200,
    status: "active",
    image: "/placeholder.jpg",
    description: "Pre-workout supplement for enhanced performance and endurance.",
    features: ["Energy boost", "Muscle support", "Recovery aid", "Natural caffeine"],
    commission: 18.39
  },
  {
    id: "prod-004",
    name: "Complete Nutrition Bundle",
    sku: "CN-004",
    category: "Nutrition",
    price: 199.99,
    wholesalePrice: 120.00,
    pv: 150,
    stock: 65,
    status: "active",
    image: "/placeholder.jpg",
    description: "Comprehensive nutrition system with meal replacement and supplements.",
    features: ["Meal replacement", "Protein blend", "Superfood mix", "Digestive support"],
    commission: 79.99
  },
  {
    id: "prod-005",
    name: "Sleep Support Formula",
    sku: "SS-005",
    category: "Wellness",
    price: 39.99,
    wholesalePrice: 24.00,
    pv: 30,
    stock: 120,
    status: "active",
    image: "/placeholder.jpg",
    description: "Natural sleep aid for better rest and recovery.",
    features: ["Melatonin blend", "Herbal extracts", "Stress relief", "Non-habit forming"],
    commission: 15.99
  }
]

export function ProductCatalog({ onAddToCart, showCartFeatures = true, customerTier = "standard" }: ProductCatalogProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [cart, setCart] = useState<CartItem[]>([])
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter
    return matchesSearch && matchesCategory && product.status === "active"
  })

  const categories = [...new Set(products.map(p => p.category))]

  const addToCart = (product: Product, quantity: number = 1) => {
    const existingItem = cart.find(item => item.id === product.id)
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ))
    } else {
      setCart([...cart, { ...product, quantity }])
    }

    if (onAddToCart) {
      onAddToCart(product, quantity)
    }
  }

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    
    setCart(cart.map(item => 
      item.id === productId 
        ? { ...item, quantity }
        : item
    ))
  }

  const getCustomerPrice = (product: Product) => {
    switch (customerTier) {
      case "VIP":
      case "vip":
        return product.wholesalePrice
      case "Gold":
        return product.price * 0.9 // 10% discount
      default:
        return product.price
    }
  }

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (getCustomerPrice(item) * item.quantity), 0)
  }

  const getCartPV = () => {
    return cart.reduce((total, item) => total + (item.pv * item.quantity), 0)
  }

  const ProductCard = ({ product }: { product: Product }) => {
    const customerPrice = getCustomerPrice(product)
    const savings = product.price - customerPrice

    return (
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader className="pb-3">
          <div className="relative">
            <Image
              src={product.image}
              alt={product.name}
              width={300}
              height={200}
              className="w-full h-40 object-cover rounded-lg"
            />
            {savings > 0 && (
              <Badge className="absolute top-2 right-2 bg-red-500">
                Save ${savings.toFixed(2)}
              </Badge>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-3">
          <div>
            <CardTitle className="text-lg">{product.name}</CardTitle>
            <CardDescription className="text-sm">{product.sku}</CardDescription>
          </div>

          <Badge variant="outline">{product.category}</Badge>

          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold">${customerPrice.toFixed(2)}</span>
                {savings > 0 && (
                  <span className="text-sm text-muted-foreground line-through">
                    ${product.price.toFixed(2)}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Target className="h-3 w-3" />
                <span>{product.pv} PV</span>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <Button
                size="sm"
                onClick={() => addToCart(product)}
                disabled={product.stock === 0}
              >
                <ShoppingCart className="h-4 w-4 mr-1" />
                Add
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedProduct(product)}
              >
                <Info className="h-4 w-4 mr-1" />
                Details
              </Button>
            </div>
          </div>

          <div className="text-xs text-muted-foreground">
            Stock: {product.stock} • Commission: ${product.commission?.toFixed(2)}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex gap-2">
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

      {/* Customer Tier Info */}
      {customerTier !== "standard" && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-primary" />
              <span className="font-medium">
                {customerTier} Customer - Special pricing applied!
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Shopping Cart Summary */}
      {showCartFeatures && cart.length > 0 && (
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Shopping Cart ({cart.length} items)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {cart.map(item => (
                <div key={item.id} className="flex items-center justify-between">
                  <span className="text-sm">{item.name}</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="text-sm min-w-[2rem] text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    <span className="text-sm min-w-[4rem] text-right">
                      ${(getCustomerPrice(item) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-semibold">
                  <span>Total: ${getCartTotal().toFixed(2)}</span>
                  <span>{getCartPV()} PV</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Products Grid/List */}
      <div className={
        viewMode === "grid" 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          : "space-y-4"
      }>
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Product Detail Dialog */}
      {selectedProduct && (
        <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedProduct.name}</DialogTitle>
              <DialogDescription>{selectedProduct.sku}</DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <Image
                src={selectedProduct.image}
                alt={selectedProduct.name}
                width={400}
                height={300}
                className="w-full h-64 object-cover rounded-lg"
              />
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Price</Label>
                  <p className="text-lg font-bold">${getCustomerPrice(selectedProduct).toFixed(2)}</p>
                </div>
                <div>
                  <Label>Personal Volume</Label>
                  <p className="text-lg font-bold">{selectedProduct.pv} PV</p>
                </div>
                <div>
                  <Label>Commission</Label>
                  <p className="text-lg font-bold">${selectedProduct.commission?.toFixed(2)}</p>
                </div>
                <div>
                  <Label>Stock</Label>
                  <p className="text-lg font-bold">{selectedProduct.stock}</p>
                </div>
              </div>
              
              <div>
                <Label>Description</Label>
                <p className="text-muted-foreground">{selectedProduct.description}</p>
              </div>
              
              {selectedProduct.features && (
                <div>
                  <Label>Features</Label>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {selectedProduct.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="flex gap-2">
                <Button 
                  onClick={() => {
                    addToCart(selectedProduct)
                    setSelectedProduct(null)
                  }}
                  className="flex-1"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                <Button variant="outline" onClick={() => setSelectedProduct(null)}>
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
