"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Shirt, Filter, Grid3X3, List, Star, Heart, ShoppingCart, Palette, Package, Loader2, Play } from 'lucide-react'

interface Product {
  id: string
  name: string
  slug: string
  description?: string
  shortDescription?: string
  price: number
  comparePrice?: number
  rating: number
  reviews: number
  colors: string[]
  sizes: string[]
  mainImage?: string | null
  isNew?: boolean
  isOnSale?: boolean
  isFeatured?: boolean
  fabricType?: string
  pocketCount?: number
  gender?: string
  category?: {
    name: string
    slug: string
  }
}

export default function ScrubsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('featured')
  const [filterColor, setFilterColor] = useState('')
  const [filterSize, setFilterSize] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [heroData, setHeroData] = useState<any>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [wishlistItems, setWishlistItems] = useState<Set<string>>(new Set())
  

  useEffect(() => {
    fetchProducts()
    fetchHeroData()
    loadWishlist()
  }, [])

  const loadWishlist = () => {
    if (typeof window !== 'undefined') {
      const savedWishlist = localStorage.getItem('wishlist')
      if (savedWishlist) {
        setWishlistItems(new Set(JSON.parse(savedWishlist)))
      }
    }
  }

  const toggleWishlist = (productId: string) => {
    const newWishlistItems = new Set(wishlistItems)
    if (newWishlistItems.has(productId)) {
      newWishlistItems.delete(productId)
    } else {
      newWishlistItems.add(productId)
    }
    setWishlistItems(newWishlistItems)
    if (typeof window !== 'undefined') {
      localStorage.setItem('wishlist', JSON.stringify(Array.from(newWishlistItems)))
    }
  }

  // Image carousel effect
  useEffect(() => {
    if (!heroData || !heroData.mediaUrls || heroData.mediaUrls.length <= 1) {
      return
    }
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroData.mediaUrls.length)
    }, 4000) // Change image every 4 seconds
    
    return () => clearInterval(interval)
  }, [heroData])

  const fetchHeroData = async () => {
    try {
      const response = await fetch('/api/admin/homepage/hero')
      if (response.ok) {
        const data = await response.json()
        setHeroData(data)
      }
    } catch (error) {
      console.error('Error fetching hero data:', error)
    }
  }

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/products/scrubs')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      setProducts(data.products || [])
    } catch (error) {
      console.error('Error fetching products:', error)
      setError('Failed to load products. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const allColors = [...new Set(products.flatMap(product => product.colors))]
  const allSizes = [...new Set(products.flatMap(product => product.sizes))]

  const filteredProducts = products.filter(product => {
    const colorMatch = !filterColor || product.colors.includes(filterColor)
    const sizeMatch = !filterSize || product.sizes.includes(filterSize)
    return colorMatch && sizeMatch
  })


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Only Hero Section */}
      <section className="md:hidden relative">
        <div className="relative">
          {heroData && heroData.mediaType === 'image' ? (
            (() => {
              const images = heroData.mediaUrls && heroData.mediaUrls.length > 0 ? heroData.mediaUrls : [heroData.mediaUrl].filter(Boolean)
              
              if (images.length > 0) {
                return images.map((image: string, index: number) => (
                  <div
                    key={index}
                    className={`relative ${
                      index === currentImageIndex ? 'block' : 'hidden'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`Scrubs hero image ${index + 1}`}
                      width={1920}
                      height={1080}
                      className="w-full h-auto object-contain"
                      sizes="100vw"
                      quality={95}
                      priority={index === 0}
                    />
                    {/* Mobile Shop Now Button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Link
                        href="#products"
                        className="px-6 py-2.5 bg-[#282828] text-white font-medium text-sm hover:bg-gray-800 transition-colors shadow-lg rounded"
                      >
                        SHOP NOW
                      </Link>
                    </div>
                  </div>
                ))
              }
              return null
            })()
          ) : (
            <div className="aspect-video bg-gradient-to-br from-blue-50 to-gray-50 flex items-center justify-center">
              <Link
                href="#products"
                className="px-6 py-2.5 bg-[#282828] text-white font-medium text-sm hover:bg-gray-800 transition-colors shadow-lg rounded"
              >
                SHOP NOW
              </Link>
            </div>
          )}
          
          {/* Mobile Carousel Indicators */}
          {heroData && heroData.mediaType === 'image' && (() => {
            const images = heroData.mediaUrls && heroData.mediaUrls.length > 0 ? heroData.mediaUrls : [heroData.mediaUrl].filter(Boolean)
            const hasMultipleImages = images.length > 1
            
            return hasMultipleImages ? (
              <div className="flex justify-center gap-2 py-3 bg-white">
                {images.map((_: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentImageIndex 
                        ? 'bg-black w-8' 
                        : 'bg-black/40 hover:bg-black/60'
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            ) : null
          })()}
        </div>
      </section>

      {/* Desktop Only Hero Section */}
      <section className="hidden md:block relative">
        <div className="relative h-[600px] lg:h-[700px] bg-gray-100 overflow-hidden">
          {/* Background Images */}
          {heroData && heroData.mediaType === 'image' ? (
            <>
              {(() => {
                const images = heroData.mediaUrls && heroData.mediaUrls.length > 0 ? heroData.mediaUrls : [heroData.mediaUrl].filter(Boolean)
                const hasMultipleImages = images.length > 1
                
                if (images.length > 0) {
                  return (
                    <>
                      {/* Image Carousel */}
                      {images.map((image: string, index: number) => (
                        <div
                          key={index}
                          className={`absolute inset-0 transition-opacity duration-1000 ${
                            index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                          }`}
                          style={{ border: 'none' }}
                        >
                          <Image
                            src={image}
                            alt={`Scrubs hero image ${index + 1}`}
                            fill
                            className="object-cover"
                            sizes="100vw"
                            quality={95}
                            priority={index === 0}
                          />
                        </div>
                      ))}
                      
                      {/* Carousel Indicators */}
                      {hasMultipleImages && (
                        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
                          {images.map((_: string, index: number) => (
                            <button
                              key={index}
                              onClick={() => setCurrentImageIndex(index)}
                              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                index === currentImageIndex 
                                  ? 'bg-white w-8' 
                                  : 'bg-white/50 hover:bg-white/75'
                              }`}
                              aria-label={`Go to image ${index + 1}`}
                            />
                          ))}
                        </div>
                      )}
                    </>
                  )
                }
                
                return (
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-gray-50">
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-10 left-10 w-40 h-40 bg-blue-300 rounded-full blur-3xl"></div>
                      <div className="absolute bottom-10 right-10 w-60 h-60 bg-purple-300 rounded-full blur-3xl"></div>
                    </div>
                  </div>
                )
              })()}
            </>
          ) : heroData && heroData.mediaType === 'video' ? (
            <div className="absolute inset-0">
              <video 
                autoPlay 
                muted 
                loop 
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              >
                <source src={heroData.mediaUrl} type="video/mp4" />
              </video>
            </div>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-gray-50">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 left-10 w-40 h-40 bg-blue-300 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 right-10 w-60 h-60 bg-purple-300 rounded-full blur-3xl"></div>
              </div>
            </div>
          )}
          
          {/* Content */}
          <div className="relative z-10 h-full flex items-center justify-center">
            <div className="max-w-[1920px] mx-auto px-4 lg:px-8 w-full">
              <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-5xl lg:text-7xl font-bold mb-6 text-[#282828]">
                  Premium Medical <span className="text-blue-600">Scrubs</span>
                </h1>
                <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-700">
                  Professional-grade scrubs designed for comfort, durability, and style. 
                  Perfect for Tunisia's dedicated healthcare professionals and medical students.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="#products"
                    className="inline-block px-8 py-4 bg-[#282828] text-white font-medium text-center hover:bg-gray-800 transition-colors"
                  >
                    Shop Scrubs
                  </Link>
                  <Link
                    href="/size-guide"
                    className="inline-block px-8 py-4 bg-white text-[#282828] font-medium text-center border-2 border-[#282828] hover:bg-gray-50 transition-colors"
                  >
                    Size Guide
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Strips - Scrubs Specific */}
        <div className="relative grid md:grid-cols-3 bg-white overflow-hidden">
          {/* Animated light bond */}
          <div 
            className="absolute top-0 h-1 w-1/3 bg-gradient-to-r from-transparent via-gray-600 to-transparent transition-transform duration-1000 ease-in-out"
            style={{ 
              transform: `translateX(${currentImageIndex % 3 * 100}%)`,
              boxShadow: '0 0 8px rgba(107, 114, 128, 0.6)'
            }}
          ></div>
          
          <div className="p-8 text-center border-b md:border-b-0 md:border-r border-gray-200">
            <h3 className="font-bold text-lg mb-2">Premium Fabrics</h3>
            <p className="text-gray-600">Medical-grade materials for all-day comfort</p>
          </div>
          <div className="p-8 text-center border-b md:border-b-0 md:border-r border-gray-200">
            <h3 className="font-bold text-lg mb-2">Functional Design</h3>
            <p className="text-gray-600">Multiple pockets and ergonomic fit</p>
          </div>
          <div className="p-8 text-center">
            <h3 className="font-bold text-lg mb-2">Perfect Fit</h3>
            <p className="text-gray-600">Extended sizes for every body type</p>
          </div>
        </div>
      </section>

      {/* Filters and Sort */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-[1920px] mx-auto px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center">
                <Filter className="w-5 h-5 text-gray-600 mr-2" />
                <span className="font-medium text-gray-700">Filters:</span>
              </div>
              
              <select
                value={filterColor}
                onChange={(e) => setFilterColor(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
              >
                <option value="">All Colors</option>
                {allColors.map(color => (
                  <option key={color} value={color}>{color}</option>
                ))}
              </select>

              <select
                value={filterSize}
                onChange={(e) => setFilterSize(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
              >
                <option value="">All Sizes</option>
                {allSizes.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>

            {/* Sort and View */}
            <div className="flex items-center gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest</option>
              </select>

              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-[#282828] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-[#282828] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-gray-600">
              Showing {filteredProducts.length} of {products.length} products
            </p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section id="products" className="py-12">
        <div className="max-w-[1920px] mx-auto px-4 lg:px-8">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Loading products...</span>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <div className="text-red-600 mb-4">{error}</div>
              <button 
                onClick={fetchProducts}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <Shirt className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
              <p className="text-gray-500">Try adjusting your filters or check back later.</p>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8' : 'space-y-6'}>
              {filteredProducts.map((product) => (
              <div key={product.id} className={`bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow ${viewMode === 'list' ? 'flex items-center p-6' : ''}`}>
                {/* Product Image */}
                <Link href={`/products/${product.slug}`}>
                  <div className={`bg-gray-100 flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity relative ${viewMode === 'list' ? 'w-32 h-32 rounded-lg flex-shrink-0' : 'aspect-square'}`}>
                    {product.mainImage ? (
                      <Image 
                        src={product.mainImage} 
                        alt={product.name}
                        fill
                        className={`object-cover ${viewMode === 'list' ? 'rounded-lg' : ''}`}
                        sizes={viewMode === 'list' ? '128px' : '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw'}
                        quality={85}
                        loading="lazy"
                      />
                    ) : (
                      <Shirt className={`text-gray-400 ${viewMode === 'list' ? 'w-12 h-12' : 'w-16 h-16'}`} />
                    )}
                  </div>
                </Link>

                <div className={`p-6 flex-1 ${viewMode === 'list' ? 'ml-6' : ''}`}>
                  {/* Badges */}
                  <div className="flex gap-2 mb-3">
                    {product.isNew && (
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                        New
                      </span>
                    )}
                    {product.isOnSale && (
                      <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                        Sale
                      </span>
                    )}
                  </div>

                  {/* Product Info */}
                  <Link href={`/products/${product.slug}`}>
                    <h3 className="font-bold text-[#282828] mb-2 line-clamp-2 hover:text-blue-600 transition-colors cursor-pointer">
                      {product.name}
                    </h3>
                  </Link>
                  

                  {/* Colors */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm text-gray-600">Colors:</span>
                    <div className="flex gap-1">
                      {product.colors.slice(0, 4).map((color, index) => (
                        <div
                          key={index}
                          className="w-4 h-4 rounded-full border border-gray-300"
                          style={{
                            backgroundColor: color === 'White' ? '#fff' : 
                                           color === 'Black' ? '#000' :
                                           color === 'Navy' ? '#1e3a8a' :
                                           color === 'Royal Blue' ? '#2563eb' :
                                           color === 'Light Blue' ? '#93c5fd' :
                                           color === 'Forest Green' ? '#166534' :
                                           color === 'Hunter Green' ? '#15803d' :
                                           color === 'Mint Green' ? '#86efac' :
                                           color === 'Pink' ? '#f9a8d4' :
                                           color === 'Hot Pink' ? '#ec4899' :
                                           color === 'Purple' ? '#a855f7' :
                                           color === 'Teal' ? '#14b8a6' :
                                           color === 'Orange' ? '#f97316' :
                                           color === 'Gray' ? '#6b7280' :
                                           color === 'Charcoal' ? '#374151' :
                                           color === 'Wine' ? '#7c2d12' :
                                           color === 'Burgundy' ? '#7c2d12' :
                                           color === 'Pewter' ? '#9ca3af' :
                                           color === 'Olive' ? '#65a30d' :
                                           color === 'Brown' ? '#92400e' : '#6b7280'
                          }}
                        />
                      ))}
                      {product.colors.length > 4 && (
                        <span className="text-xs text-gray-500">+{product.colors.length - 4}</span>
                      )}
                    </div>
                  </div>

                  {/* Sizes */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm text-gray-600">Sizes:</span>
                    <span className="text-sm text-gray-800">{product.sizes.join(', ')}</span>
                  </div>

                  {/* Price and Actions */}
                  <div className={`flex items-center ${viewMode === 'list' ? 'justify-between' : 'justify-between'}`}>
                    <div>
                      <span className="text-xl font-bold text-[#282828]">{product.price} TND</span>
                      {product.comparePrice && (
                        <span className="text-sm text-gray-500 line-through ml-2">{product.comparePrice} TND</span>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={() => toggleWishlist(product.id)}
                        className={`p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors ${
                          wishlistItems.has(product.id) ? 'bg-red-50 border-red-300' : ''
                        }`}
                      >
                        <Heart 
                          className={`w-5 h-5 transition-colors ${
                            wishlistItems.has(product.id) 
                              ? 'text-red-600 fill-current' 
                              : 'text-gray-600'
                          }`} 
                        />
                      </button>
                      <Link href={`/products/${product.slug}`}>
                        <button className="px-4 py-2 bg-[#282828] text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2">
                          <ShoppingCart className="w-4 h-4" />
                          View Details
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-[1920px] mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#282828] mb-4">Why Choose Our Scrubs?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Designed specifically for Tunisia's healthcare professionals with premium features and local craftsmanship.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Palette className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-bold text-[#282828] mb-2">Premium Fabrics</h3>
              <p className="text-gray-600 text-sm">
                High-quality, medical-grade fabrics that are durable, comfortable, and easy to maintain.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-bold text-[#282828] mb-2">Functional Design</h3>
              <p className="text-gray-600 text-sm">
                Multiple pockets, reinforced seams, and ergonomic fit designed for long shifts.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shirt className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-bold text-[#282828] mb-2">Perfect Fit</h3>
              <p className="text-gray-600 text-sm">
                Available in extended sizes with options for petite, regular, and tall fits.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}