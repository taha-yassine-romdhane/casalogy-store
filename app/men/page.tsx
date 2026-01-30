"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Users, Filter, Grid3X3, List, Star, Heart, ShoppingCart, Shirt, Loader2, Play } from 'lucide-react'

interface ProductColor {
  name: string
  code: string
}

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
  colors: ProductColor[]
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

export default function MenPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('featured')
  const [filterColor, setFilterColor] = useState('')
  const [filterSize, setFilterSize] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [heroData, setHeroData] = useState<any>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    fetchProducts()
    fetchHeroData()
  }, [])

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
      const response = await fetch('/api/products/filtered?gender=men')
      
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

  const allColors = [...new Map(products.flatMap(product => product.colors).map(c => [c.name, c])).values()]
  const allSizes = [...new Set(products.flatMap(product => product.sizes))]

  const filteredProducts = products.filter(product => {
    const colorMatch = !filterColor || product.colors.some(c => c.name === filterColor)
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
                      alt={`Men's medical wear hero image ${index + 1}`}
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
                            alt={`Men's medical wear hero image ${index + 1}`}
                            fill
                            className="object-cover"
                            sizes="100vw"
                            quality={95}
                            priority={index === 0}
                            style={{ border: 'none', outline: 'none' }}
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
                <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-[#282828]">
                  Men's Medical <span className="text-blue-600">Wear</span>
                </h1>
                <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-700 leading-relaxed">
                  Professional medical clothing designed specifically for men in healthcare. 
                  Combining durability, comfort, and professional styling for Tunisia's male medical professionals.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="#products"
                    className="inline-block px-8 py-4 bg-[#282828] text-white font-medium text-center hover:bg-gray-800 transition-colors"
                  >
                    Shop Men's Wear
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

        {/* Feature Strips */}
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
            <h3 className="font-bold text-lg mb-2 text-gray-900">Men's Fit</h3>
            <p className="text-gray-600">Tailored specifically for men's physique</p>
          </div>
          <div className="p-8 text-center border-b md:border-b-0 md:border-r border-gray-200">
            <h3 className="font-bold text-lg mb-2 text-gray-900">Professional Style</h3>
            <p className="text-gray-600">Modern designs for healthcare professionals</p>
          </div>
          <div className="p-8 text-center">
            <h3 className="font-bold text-lg mb-2 text-gray-900">Durable Quality</h3>
            <p className="text-gray-600">Built for long shifts and frequent washing</p>
          </div>
        </div>
      </section>

      {/* Filters and Sort */}
      <section className="py-6 sm:py-8 bg-white border-b border-gray-200">
        <div className="max-w-[1920px] mx-auto px-4 lg:px-8">
          <div className="flex flex-col gap-4">
            {/* Filters Row */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center flex-shrink-0">
                <Filter className="w-5 h-5 text-gray-600 mr-2" />
                <span className="font-medium text-gray-700">Filters:</span>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 flex-1">
                <select
                  value={filterColor}
                  onChange={(e) => setFilterColor(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 text-sm"
                >
                  <option value="">All Colors</option>
                  {allColors.map(color => (
                    <option key={color.name} value={color.name}>{color.name}</option>
                  ))}
                </select>

                <select
                  value={filterSize}
                  onChange={(e) => setFilterSize(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 text-sm"
                >
                  <option value="">All Sizes</option>
                  {allSizes.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Sort and View Row */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="font-medium text-gray-700 hidden sm:inline">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="flex-1 sm:flex-none px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 text-sm"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest</option>
                </select>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4">
                <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-[#282828] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                    aria-label="Grid view"
                  >
                    <Grid3X3 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-[#282828] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                    aria-label="List view"
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-gray-600">
              Showing {filteredProducts.length} of {products.length} men's products
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
              <span className="ml-2 text-gray-600">Loading men's products...</span>
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
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No men's products found</h3>
              <p className="text-gray-500">Try adjusting your filters or check back later.</p>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8' : 'space-y-6'}>
              {filteredProducts.map((product) => (
              <div key={product.id} className={`bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow ${viewMode === 'list' ? 'flex items-center p-3 gap-3' : ''}`}>
                {/* Product Image */}
                <Link href={`/products/${product.slug}`}>
                  <div className={`bg-gray-100 flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity relative ${viewMode === 'list' ? 'w-20 h-20 rounded-lg flex-shrink-0' : 'aspect-square'}`}>
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
                      <Shirt className={`text-gray-400 ${viewMode === 'list' ? 'w-8 h-8' : 'w-16 h-16'}`} />
                    )}
                  </div>
                </Link>

                <div className={`flex-1 min-w-0 ${viewMode === 'list' ? '' : 'p-6'}`}>
                  {/* Badges */}
                  <div className={`flex gap-1 ${viewMode === 'list' ? 'mb-1' : 'mb-3'}`}>
                    {product.category && (
                      <span className={`bg-blue-100 text-blue-800 font-medium px-2 py-1 rounded-full ${viewMode === 'list' ? 'text-xs' : 'text-xs'}`}>
                        {product.category.name}
                      </span>
                    )}
                    {product.isNew && (
                      <span className={`bg-green-100 text-green-800 font-medium px-2 py-1 rounded-full ${viewMode === 'list' ? 'text-xs' : 'text-xs'}`}>
                        New
                      </span>
                    )}
                    {product.isOnSale && (
                      <span className={`bg-red-100 text-red-800 font-medium px-2 py-1 rounded-full ${viewMode === 'list' ? 'text-xs' : 'text-xs'}`}>
                        Sale
                      </span>
                    )}
                  </div>

                  {/* Product Info */}
                  <Link href={`/products/${product.slug}`}>
                    <h3 className={`font-bold text-[#282828] hover:text-blue-600 transition-colors cursor-pointer ${viewMode === 'list' ? 'text-sm mb-1 line-clamp-1' : 'mb-2 line-clamp-1'}`}>{product.name}</h3>
                  </Link>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-1">
                      {product.rating} ({product.reviews})
                    </span>
                  </div>

                  {/* Colors - Hidden in list view on mobile */}
                  <div className={`items-center gap-2 ${viewMode === 'list' ? 'hidden sm:flex mb-2' : 'flex mb-3'}`}>
                    <span className="text-sm text-gray-600">Colors:</span>
                    <div className="flex gap-1">
                      {product.colors.slice(0, viewMode === 'list' ? 3 : 4).map((color, index) => (
                        <div
                          key={index}
                          className={`rounded-full border border-gray-300 ${viewMode === 'list' ? 'w-3 h-3' : 'w-4 h-4'}`}
                          style={{ backgroundColor: color.code }}
                          title={color.name}
                        />
                      ))}
                      {product.colors.length > (viewMode === 'list' ? 3 : 4) && (
                        <span className="text-xs text-gray-500">+{product.colors.length - (viewMode === 'list' ? 3 : 4)}</span>
                      )}
                    </div>
                  </div>

                  {/* Sizes */}
                  <div className={`${viewMode === 'list' ? 'hidden sm:flex items-center gap-2 mb-2' : 'mb-3'}`}>
                    {viewMode === 'list' ? (
                      <>
                        <span className="text-sm text-gray-600">Sizes:</span>
                        <span className="text-sm text-gray-800">{product.sizes.slice(0, 3).join(', ')}{product.sizes.length > 3 && '...'}</span>
                      </>
                    ) : (
                      <>
                        <span className="text-sm text-gray-600 mb-2 block">Available Sizes:</span>
                        <div className="flex flex-wrap gap-1">
                          {product.sizes.slice(0, 6).map((size, index) => (
                            <span key={index} className="bg-gray-100 text-gray-700 text-xs font-medium px-2 py-1 rounded-full border">
                              {size}
                            </span>
                          ))}
                          {product.sizes.length > 6 && (
                            <span className="bg-gray-100 text-gray-500 text-xs font-medium px-2 py-1 rounded-full border">
                              +{product.sizes.length - 6}
                            </span>
                          )}
                        </div>
                      </>
                    )}
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
                      <button className={`border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors ${
                        viewMode === 'list' ? 'p-1.5' : 'p-2'
                      }`}>
                        <Heart className={`transition-colors text-gray-600 ${
                          viewMode === 'list' ? 'w-4 h-4' : 'w-5 h-5'
                        }`} />
                      </button>
                      <Link href={`/products/${product.slug}`}>
                        <button className={`bg-[#282828] text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2 ${
                          viewMode === 'list' ? 'px-3 py-1.5 text-sm' : 'px-3 py-2 text-sm'
                        }`}>
                          <ShoppingCart className={viewMode === 'list' ? 'w-3 h-3' : 'w-4 h-4'} />
                          <span className="whitespace-nowrap">{viewMode === 'list' ? 'View' : 'View'}</span>
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
            <h2 className="text-3xl font-bold text-[#282828] mb-4">Designed for Men in Healthcare</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Every piece in our men's collection is designed to meet the professional needs of male healthcare workers.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-bold text-[#282828] mb-2">Professional Fit</h3>
              <p className="text-gray-600 text-sm">
                Tailored cuts designed for comfort and professional appearance during long shifts.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shirt className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-bold text-[#282828] mb-2">Durable Design</h3>
              <p className="text-gray-600 text-sm">
                Built to withstand the demands of healthcare environments with reinforced construction.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-bold text-[#282828] mb-2">Functional Features</h3>
              <p className="text-gray-600 text-sm">
                Multiple pockets and practical design elements for medical professionals on the go.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}