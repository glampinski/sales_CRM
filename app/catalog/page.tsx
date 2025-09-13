"use client"

import { useState } from "react"
import { ShoppingCart, Heart, Star, Info, Check, ArrowRight, Filter, Search, Grid, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  pv: number
}

interface Product {
  id: number
  name: string
  category: string
  price: number
  originalPrice?: number
  pv: number
  image: string
  rating: number
  reviews: number
  description: string
  benefits: string[]
  ingredients?: string[]
  inStock: boolean
  isNew?: boolean
  isBestSeller?: boolean
  discount?: number
}

// Mock product data following the glamping theme style
const products: Product[] = [
  {
    id: 1,
    name: "Wellness Retreat Pack",
    category: "Wellness",
    price: 89.99,
    originalPrice: 119.99,
    pv: 65,
    image: "/placeholder.jpg",
    rating: 4.8,
    reviews: 124,
    description: "Complete wellness solution with premium vitamins and minerals for your daily vitality journey.",
    benefits: [
      "Boosts daily energy levels",
      "Supports immune system",
      "Enhances mental clarity",
      "Premium organic ingredients"
    ],
    ingredients: ["Vitamin D3", "Magnesium", "Omega-3", "Turmeric"],
    inStock: true,
    isBestSeller: true,
    discount: 25
  },
  {
    id: 2,
    name: "Beauty Essentials Collection",
    category: "Beauty",
    price: 129.99,
    pv: 95,
    image: "/placeholder.jpg",
    rating: 4.9,
    reviews: 89,
    description: "Luxurious skincare and beauty products collection for radiant, healthy-looking skin.",
    benefits: [
      "Anti-aging properties",
      "Hydrates & nourishes",
      "Natural glow enhancement",
      "Cruelty-free formula"
    ],
    ingredients: ["Hyaluronic Acid", "Vitamin C", "Retinol", "Peptides"],
    inStock: true,
    isNew: true
  },
  {
    id: 3,
    name: "Performance Boost Formula",
    category: "Fitness",
    price: 45.99,
    pv: 35,
    image: "/placeholder.jpg",
    rating: 4.6,
    reviews: 156,
    description: "Advanced energy and performance enhancement supplement for active lifestyles.",
    benefits: [
      "Increases workout performance",
      "Faster recovery time",
      "Enhanced endurance",
      "Natural energy boost"
    ],
    ingredients: ["Creatine", "BCAAs", "Caffeine", "Beta-Alanine"],
    inStock: true,
    isBestSeller: true
  },
  {
    id: 4,
    name: "Complete Nutrition Bundle",
    category: "Nutrition",
    price: 199.99,
    originalPrice: 249.99,
    pv: 150,
    image: "/placeholder.jpg",
    rating: 4.7,
    reviews: 78,
    description: "Comprehensive nutrition package designed for optimal health and wellness transformation.",
    benefits: [
      "Complete daily nutrition",
      "Supports weight management",
      "Balances metabolism",
      "Premium quality assurance"
    ],
    ingredients: ["Protein Blend", "Fiber Complex", "Vitamins", "Minerals"],
    inStock: true,
    discount: 20
  },
  {
    id: 5,
    name: "Organic Green Tea Extract",
    category: "Wellness",
    price: 29.99,
    pv: 22,
    image: "/placeholder.jpg",
    rating: 4.5,
    reviews: 92,
    description: "Pure organic green tea extract for antioxidant support and natural detoxification.",
    benefits: [
      "Rich in antioxidants",
      "Supports metabolism",
      "Natural detox properties",
      "Certified organic"
    ],
    ingredients: ["Green Tea Extract", "EGCG", "Polyphenols"],
    inStock: true,
    isNew: true
  },
  {
    id: 6,
    name: "Sleep Support Formula",
    category: "Wellness",
    price: 39.99,
    pv: 30,
    image: "/placeholder.jpg",
    rating: 4.4,
    reviews: 67,
    description: "Natural sleep aid with melatonin and calming herbs for restful nights.",
    benefits: [
      "Promotes deep sleep",
      "Natural ingredients",
      "Non-habit forming",
      "Wake up refreshed"
    ],
    ingredients: ["Melatonin", "Valerian Root", "Chamomile", "L-Theanine"],
    inStock: false
  }
]

const categories = ["All Products", "Wellness", "Beauty", "Fitness", "Nutrition"]

export default function CustomerCatalogPage() {
  const [selectedCategory, setSelectedCategory] = useState("All Products")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("featured")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [cart, setCart] = useState<CartItem[]>([])
  const [wishlist, setWishlist] = useState<number[]>([])

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === "All Products" || product.category === selectedCategory
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "rating":
        return b.rating - a.rating
      case "name":
        return a.name.localeCompare(b.name)
      default: // featured
        return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0)
    }
  })

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        pv: product.pv
      }]
    })
  }

  const toggleWishlist = (productId: number) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const cartPV = cart.reduce((sum, item) => sum + (item.pv * item.quantity), 0)
  const cartItems = cart.reduce((sum, item) => sum + item.quantity, 0)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const ProductCard = ({ product }: { product: Product }) => (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      <CardHeader className="pb-3">
        <div className="relative aspect-square bg-gradient-to-br from-muted to-muted/50 rounded-lg mb-3 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-2xl">🌿</span>
            </div>
          </div>
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.isNew && (
              <Badge className="bg-blue-500 hover:bg-blue-600">New</Badge>
            )}
            {product.isBestSeller && (
              <Badge className="bg-orange-500 hover:bg-orange-600">Best Seller</Badge>
            )}
            {product.discount && (
              <Badge variant="destructive">-{product.discount}%</Badge>
            )}
          </div>

          {/* Wishlist */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 bg-white/80 hover:bg-white"
            onClick={() => toggleWishlist(product.id)}
          >
            <Heart className={`h-4 w-4 ${wishlist.includes(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
        </div>

        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
                {product.name}
              </CardTitle>
              <Badge variant="outline" className="mt-1">{product.category}</Badge>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {product.rating} ({product.reviews})
            </span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
              <span className="text-xl font-bold text-primary">
                {formatCurrency(product.price)}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              {product.pv} PV
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                  <Info className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>{product.name}</DialogTitle>
                  <DialogDescription>{product.description}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Benefits</h4>
                    <ul className="space-y-1">
                      {product.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <Check className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {product.ingredients && (
                    <div>
                      <h4 className="font-medium mb-2">Key Ingredients</h4>
                      <div className="flex flex-wrap gap-1">
                        {product.ingredients.map((ingredient, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {ingredient}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
            
            <Button 
              onClick={() => addToCart(product)}
              disabled={!product.inStock}
              className="gap-2"
            >
              <ShoppingCart className="h-4 w-4" />
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-start mb-6">
            <Image src="/images/glampinski-logo.jpg" alt="Glampinski" width={200} height={60} className="h-12 w-auto" />
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-2">Premium Wellness Products</h1>
            <p className="text-xl text-muted-foreground">Discover our collection of high-quality wellness and beauty products</p>
          </div>
        </div>

        {/* Progress/Navigation */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-center space-x-8 mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                <span className="text-sm font-medium">1</span>
              </div>
              <span className="text-sm font-medium text-primary">Browse Products</span>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center">
                <span className="text-sm font-medium">2</span>
              </div>
              <span className="text-sm text-muted-foreground">Review Cart</span>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center">
                <span className="text-sm font-medium">3</span>
              </div>
              <span className="text-sm text-muted-foreground">Checkout</span>
            </div>
          </div>
          <Progress value={33} className="h-2" />
        </div>

        {/* Filters & Search */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
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
              
              <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
                <TabsList className="grid grid-cols-5 w-[500px]">
                  {categories.map((category) => (
                    <TabsTrigger key={category} value={category} className="text-xs">
                      {category.replace(" Products", "")}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            <div className="flex items-center space-x-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex border rounded-lg">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="max-w-6xl mx-auto">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="space-y-4 mb-8">
              {sortedProducts.map((product) => (
                <Card key={product.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-6">
                      <div className="w-24 h-24 bg-gradient-to-br from-muted to-muted/50 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">🌿</span>
                      </div>
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-semibold">{product.name}</h3>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline">{product.category}</Badge>
                              {product.isNew && <Badge className="bg-blue-500">New</Badge>}
                              {product.isBestSeller && <Badge className="bg-orange-500">Best Seller</Badge>}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-primary">{formatCurrency(product.price)}</div>
                            <div className="text-sm text-muted-foreground">{product.pv} PV</div>
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground">{product.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                              />
                            ))}
                            <span className="text-sm text-muted-foreground ml-2">
                              {product.rating} ({product.reviews})
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => toggleWishlist(product.id)}
                            >
                              <Heart className={`h-4 w-4 ${wishlist.includes(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
                            </Button>
                            <Button 
                              onClick={() => addToCart(product)}
                              disabled={!product.inStock}
                            >
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Cart Summary - Fixed Bottom */}
        {cartItems > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg p-4 z-50">
            <div className="container mx-auto flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-sm text-muted-foreground">
                  {cartItems} item{cartItems !== 1 ? 's' : ''} in cart
                </div>
                <Separator orientation="vertical" className="h-6" />
                <div className="text-lg font-bold">
                  {formatCurrency(cartTotal)}
                </div>
                <div className="text-sm text-muted-foreground">
                  {cartPV} PV Total
                </div>
              </div>
              
              <Button size="lg" className="gap-2">
                <ShoppingCart className="h-4 w-4" />
                Continue to Cart
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
