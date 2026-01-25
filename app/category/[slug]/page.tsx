"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Shirt, Filter, Grid3X3, List, Heart, ShoppingCart, Loader2, ArrowLeft } from 'lucide-react'

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

interface Category {
  id: string
  name: string
  slug: string
  description?: string
}

export default function CategoryPage() {
  const params = useParams()
  const slug = params.slug as string

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('featured')
  const [filterColor, setFilterColor] = useState('')
  const [filterSize, setFilterSize] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [wishlistItems, setWishlistItems] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (slug) {
      fetchCategoryProducts()
      loadWishlist()
    }
  }, [slug])

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

  const fetchCategoryProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/products/category/${slug}`)

      if (!response.ok) {
        if (response.status === 404) {
          setError('Category not found')
        } else {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        return
      }

      const data = await response.json()
      setCategory(data.category)
      setProducts(data.products || [])
    } catch (error) {
      console.error('Error fetching category products:', error)
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

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'rating':
        return b.rating - a.rating
      case 'newest':
        return 0 // Already sorted by createdAt desc from API
      default:
        return 0
    }
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading category...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shirt className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Category Not Found</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#282828] text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-100 to-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            <h1 className="text-4xl lg:text-5xl font-bold text-[#282828] mb-4">
              {category?.name || 'Category'}
            </h1>
            {category?.description && (
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                {category.description}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Filters and Sort */}
      <section className="py-6 sm:py-8 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex flex-col gap-4">
            {/* Filters Row */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center flex-shrink-0">
                <Filter className="w-5 h-5 text-gray-600 mr-2" />
                <span className="font-medium text-gray-700">Filters:</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 flex-1">
                {allColors.length > 0 && (
                  <select
                    value={filterColor}
                    onChange={(e) => setFilterColor(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 text-sm"
                  >
                    <option value="">All Colors</option>
                    {allColors.map(color => (
                      <option key={color} value={color}>{color}</option>
                    ))}
                  </select>
                )}

                {allSizes.length > 0 && (
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
                )}
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
              Showing {sortedProducts.length} of {products.length} products
            </p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section id="products" className="py-12">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          {sortedProducts.length === 0 ? (
            <div className="text-center py-20">
              <Shirt className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
              <p className="text-gray-500">Try adjusting your filters or check back later.</p>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8' : 'space-y-6'}>
              {sortedProducts.map((product) => (
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
                          sizes={viewMode === 'list' ? '80px' : '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw'}
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
                      {product.isNew && (
                        <span className="bg-green-100 text-green-800 font-medium px-2 py-1 rounded-full text-xs">
                          New
                        </span>
                      )}
                      {product.isOnSale && (
                        <span className="bg-red-100 text-red-800 font-medium px-2 py-1 rounded-full text-xs">
                          Sale
                        </span>
                      )}
                    </div>

                    {/* Product Info */}
                    <Link href={`/products/${product.slug}`}>
                      <h3 className={`font-bold text-[#282828] hover:text-blue-600 transition-colors cursor-pointer ${viewMode === 'list' ? 'text-sm mb-1 line-clamp-1' : 'mb-2 line-clamp-1'}`}>
                        {product.name}
                      </h3>
                    </Link>

                    {/* Colors */}
                    {product.colors.length > 0 && (
                      <div className={`items-center gap-2 ${viewMode === 'list' ? 'hidden sm:flex mb-2' : 'flex mb-3'}`}>
                        <span className="text-sm text-gray-600">Colors:</span>
                        <div className="flex gap-1">
                          {product.colors.slice(0, viewMode === 'list' ? 3 : 4).map((color, index) => (
                            <div
                              key={index}
                              className={`rounded-full border border-gray-300 ${viewMode === 'list' ? 'w-3 h-3' : 'w-4 h-4'}`}
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
                                               color === 'Purple' ? '#a855f7' :
                                               color === 'Teal' ? '#14b8a6' :
                                               color === 'Gray' ? '#6b7280' :
                                               color === 'Charcoal' ? '#374151' : '#6b7280'
                              }}
                            />
                          ))}
                          {product.colors.length > (viewMode === 'list' ? 3 : 4) && (
                            <span className="text-xs text-gray-500">+{product.colors.length - (viewMode === 'list' ? 3 : 4)}</span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Sizes */}
                    {product.sizes.length > 0 && (
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
                    )}

                    {/* Price and Actions */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xl font-bold text-[#282828]">{product.price} TND</span>
                        {product.comparePrice && (
                          <span className="text-sm text-gray-500 line-through ml-2">{product.comparePrice} TND</span>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleWishlist(product.id)}
                          className={`border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors ${
                            viewMode === 'list' ? 'p-1.5' : 'p-2'
                          } ${
                            wishlistItems.has(product.id) ? 'bg-red-50 border-red-300' : ''
                          }`}
                        >
                          <Heart
                            className={`transition-colors ${
                              viewMode === 'list' ? 'w-4 h-4' : 'w-5 h-5'
                            } ${
                              wishlistItems.has(product.id)
                                ? 'text-red-600 fill-current'
                                : 'text-gray-600'
                            }`}
                          />
                        </button>
                        <Link href={`/products/${product.slug}`}>
                          <button className={`bg-[#282828] text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2 ${
                            viewMode === 'list' ? 'px-3 py-1.5 text-sm' : 'px-3 py-2 text-sm'
                          }`}>
                            <ShoppingCart className={viewMode === 'list' ? 'w-3 h-3' : 'w-4 h-4'} />
                            <span className="whitespace-nowrap">View</span>
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
    </div>
  )
}
