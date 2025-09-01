"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronDown, Filter, X, ShoppingBag, Star, Grid, List } from 'lucide-react'
import { useCart } from '@/contexts/cart-context'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  comparePrice?: number
  sku: string
  description?: string
  images: { url: string; altText?: string }[]
  colors: { name: string; code: string }[]
  sizes: string[]
  rating?: number
  reviewCount?: number
}

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A to Z' },
  { value: 'name-desc', label: 'Name: Z to A' },
]

const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL']

const colorOptions = [
  { name: 'Navy Blue', code: '#001f3f' },
  { name: 'Ceil Blue', code: '#4B9BFF' },
  { name: 'Royal Blue', code: '#4169E1' },
  { name: 'Hunter Green', code: '#355E3B' },
  { name: 'Wine', code: '#722F37' },
  { name: 'Black', code: '#000000' },
  { name: 'Gray', code: '#808080' },
  { name: 'White', code: '#FFFFFF' },
]

export default function HijebiScrubsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [sortBy, setSortBy] = useState('featured')
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState({ min: 0, max: 200 })
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const { addToCart } = useCart()

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    filterAndSortProducts()
  }, [products, sortBy, selectedSizes, selectedColors, priceRange])

  const fetchProducts = async () => {
    try {
      // Fetch products from the Hijebi Scrubs category
      const response = await fetch('/api/products?category=hijebi-scrubs')
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products || [])
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterAndSortProducts = () => {
    let filtered = [...products]

    // Filter by size
    if (selectedSizes.length > 0) {
      filtered = filtered.filter(product =>
        product.sizes.some(size => selectedSizes.includes(size))
      )
    }

    // Filter by color
    if (selectedColors.length > 0) {
      filtered = filtered.filter(product =>
        product.colors.some(color => selectedColors.includes(color.name))
      )
    }

    // Filter by price
    filtered = filtered.filter(product =>
      product.price >= priceRange.min && product.price <= priceRange.max
    )

    // Sort products
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'name-desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name))
        break
      default:
        // Featured - keep original order
        break
    }

    setFilteredProducts(filtered)
  }

  const toggleSize = (size: string) => {
    setSelectedSizes(prev =>
      prev.includes(size)
        ? prev.filter(s => s !== size)
        : [...prev, size]
    )
  }

  const toggleColor = (color: string) => {
    setSelectedColors(prev =>
      prev.includes(color)
        ? prev.filter(c => c !== color)
        : [...prev, color]
    )
  }

  const clearFilters = () => {
    setSelectedSizes([])
    setSelectedColors([])
    setPriceRange({ min: 0, max: 200 })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#282828]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Only Hero Section */}
      <section className="md:hidden relative">
        <div className="relative">
          {/* Mobile hero image placeholder */}
          <div className="relative">
            <Image
              src="/images/hijebi-hero.jpg"
              alt="Hijebi Scrubs Collection"
              width={1920}
              height={1080}
              className="w-full h-auto object-contain"
              sizes="100vw"
              quality={95}
              priority
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
        </div>
      </section>

      {/* Desktop Only Hero Section */}
      <section className="hidden md:block relative overflow-hidden">
        <div className="relative h-[60vh] min-h-[500px] max-h-[800px]">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 w-40 h-40 bg-teal-300 rounded-full blur-3xl"></div>
              <div className="absolute bottom-10 right-10 w-60 h-60 bg-purple-300 rounded-full blur-3xl"></div>
              <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-blue-300 rounded-full blur-3xl"></div>
            </div>
          </div>
          
          {/* Content */}
          <div className="relative z-10 h-full flex items-center justify-center">
            <div className="max-w-[1920px] mx-auto px-4 lg:px-8 w-full">
              <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-5xl lg:text-7xl font-bold mb-6 text-[#282828]">
                  Hijebi <span className="text-teal-600">Scrubs</span>
                </h1>
                <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-700">
                  Specially designed medical scrubs with integrated hijab-friendly features. 
                  Combining modesty, comfort, and professional style for Tunisia's healthcare professionals.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="#products"
                    className="inline-block px-8 py-4 bg-[#282828] text-white font-medium text-center hover:bg-gray-800 transition-colors"
                  >
                    Shop Collection
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
          <div className="p-8 text-center border-b md:border-b-0 md:border-r border-gray-200">
            <h3 className="font-bold text-lg mb-2">Hijab-Integrated Design</h3>
            <p className="text-gray-600">Specially designed with attached or matching hijab options</p>
          </div>
          <div className="p-8 text-center border-b md:border-b-0 md:border-r border-gray-200">
            <h3 className="font-bold text-lg mb-2">Full Coverage</h3>
            <p className="text-gray-600">Longer tops and modest cuts for complete comfort</p>
          </div>
          <div className="p-8 text-center">
            <h3 className="font-bold text-lg mb-2">Premium Comfort</h3>
            <p className="text-gray-600">Breathable fabrics perfect for long shifts</p>
          </div>
        </div>
      </section>

      {/* Filters and Products */}
      <section id="products" className="py-8">
        <div className="max-w-[1920px] mx-auto px-4 lg:px-8">
          {/* Filter Bar */}
          <div className="py-6 sm:py-8">
            <div className="flex flex-col gap-4">
              {/* Filters Row */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center flex-shrink-0">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Filter className="w-4 h-4" />
                    Filters
                    {(selectedSizes.length > 0 || selectedColors.length > 0) && (
                      <span className="bg-[#282828] text-white text-xs px-2 py-0.5 rounded-full">
                        {selectedSizes.length + selectedColors.length}
                      </span>
                    )}
                  </button>
                  
                  {(selectedSizes.length > 0 || selectedColors.length > 0) && (
                    <button
                      onClick={clearFilters}
                      className="text-sm text-gray-600 hover:text-[#282828] ml-4"
                    >
                      Clear all
                    </button>
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
                    className="flex-1 sm:flex-none px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#282828] text-sm"
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded ${viewMode === 'grid' ? 'bg-[#282828] text-white' : 'text-gray-600'}`}
                      aria-label="Grid view"
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded ${viewMode === 'list' ? 'bg-[#282828] text-white' : 'text-gray-600'}`}
                      aria-label="List view"
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>

                  <span className="text-sm text-gray-600">
                    {filteredProducts.length} Products
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="bg-white p-6 rounded-lg border border-gray-200 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Size Filter */}
                <div>
                  <h3 className="font-medium text-[#282828] mb-3">Size</h3>
                  <div className="flex flex-wrap gap-2">
                    {sizeOptions.map(size => (
                      <button
                        key={size}
                        onClick={() => toggleSize(size)}
                        className={`px-3 py-1.5 border rounded-lg transition-colors ${
                          selectedSizes.includes(size)
                            ? 'bg-[#282828] text-white border-[#282828]'
                            : 'border-gray-300 hover:border-[#282828]'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Filter */}
                <div>
                  <h3 className="font-medium text-[#282828] mb-3">Color</h3>
                  <div className="flex flex-wrap gap-2">
                    {colorOptions.map(color => (
                      <button
                        key={color.name}
                        onClick={() => toggleColor(color.name)}
                        className={`flex items-center gap-2 px-3 py-1.5 border rounded-lg transition-colors ${
                          selectedColors.includes(color.name)
                            ? 'bg-[#282828] text-white border-[#282828]'
                            : 'border-gray-300 hover:border-[#282828]'
                        }`}
                      >
                        <span
                          className="w-4 h-4 rounded-full border border-gray-300"
                          style={{ backgroundColor: color.code }}
                        />
                        {color.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Filter */}
                <div>
                  <h3 className="font-medium text-[#282828] mb-3">Price Range</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                        className="w-24 px-2 py-1 border border-gray-300 rounded"
                        placeholder="Min"
                      />
                      <span>-</span>
                      <input
                        type="number"
                        min="0"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                        className="w-24 px-2 py-1 border border-gray-300 rounded"
                        placeholder="Max"
                      />
                      <span className="text-sm text-gray-600">TND</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Products Grid/List */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-600 mb-4">No products found matching your criteria.</p>
              <button
                onClick={clearFilters}
                className="px-6 py-2 bg-[#282828] text-white rounded-lg hover:bg-gray-800"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
              : "space-y-6"
            }>
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className={viewMode === 'grid'
                    ? "bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                    : "bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow flex items-center p-3 gap-3"
                  }
                >
                  {viewMode === 'grid' ? (
                    <>
                      <Link href={`/products/${product.slug}`}>
                        <div className="aspect-square bg-gray-100 relative overflow-hidden">
                          {product.images[0] && (
                            <Image
                              src={product.images[0].url}
                              alt={product.images[0].altText || product.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform"
                            />
                          )}
                          {product.comparePrice && (
                            <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                              SALE
                            </span>
                          )}
                        </div>
                      </Link>
                      <div className="p-6">
                        <Link href={`/products/${product.slug}`}>
                          <h3 className="font-bold text-[#282828] mb-2 line-clamp-1 hover:text-blue-600 transition-colors cursor-pointer">
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
                                style={{ backgroundColor: color.code }}
                                title={color.name}
                              />
                            ))}
                            {product.colors.length > 4 && (
                              <span className="text-xs text-gray-500">+{product.colors.length - 4}</span>
                            )}
                          </div>
                        </div>

                        {/* Sizes */}
                        <div className="mb-3">
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
                        </div>

                        {/* Price */}
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xl font-bold text-[#282828]">
                            {product.price} TND
                          </span>
                          {product.comparePrice && (
                            <span className="text-sm text-gray-500 line-through ml-2">
                              {product.comparePrice} TND
                            </span>
                          )}
                        </div>

                        {/* Rating */}
                        {product.rating && (
                          <div className="flex items-center gap-1 mb-3">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < Math.floor(product.rating!) 
                                      ? 'text-yellow-400 fill-current' 
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-600">
                              ({product.reviewCount || 0})
                            </span>
                          </div>
                        )}

                        <Link href={`/products/${product.slug}`}>
                          <button className="w-full px-3 py-2 text-sm bg-[#282828] text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                            <ShoppingBag className="w-4 h-4" />
                            <span className="whitespace-nowrap">View</span>
                          </button>
                        </Link>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* List View */}
                      <Link href={`/products/${product.slug}`} className="w-20 h-20 bg-gray-100 relative flex-shrink-0 rounded-lg">
                        {product.images[0] && (
                          <Image
                            src={product.images[0].url}
                            alt={product.images[0].altText || product.name}
                            fill
                            className="object-cover rounded-lg"
                          />
                        )}
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link href={`/products/${product.slug}`}>
                          <h3 className="text-sm mb-1 line-clamp-1 font-bold text-[#282828] hover:text-blue-600 transition-colors cursor-pointer">
                            {product.name}
                          </h3>
                        </Link>
                        
                        {/* Colors - Hidden on mobile */}
                        <div className="hidden sm:flex items-center gap-2 mb-2">
                          <span className="text-sm text-gray-600">Colors:</span>
                          <div className="flex gap-1">
                            {product.colors.slice(0, 3).map((color, index) => (
                              <div
                                key={index}
                                className="w-3 h-3 rounded-full border border-gray-300"
                                style={{ backgroundColor: color.code }}
                                title={color.name}
                              />
                            ))}
                            {product.colors.length > 3 && (
                              <span className="text-xs text-gray-500">+{product.colors.length - 3}</span>
                            )}
                          </div>
                        </div>

                        {/* Sizes - Hidden on mobile */}
                        <div className="hidden sm:flex items-center gap-2 mb-2">
                          <span className="text-sm text-gray-600">Sizes:</span>
                          <span className="text-sm text-gray-800">{product.sizes.slice(0, 3).join(', ')}{product.sizes.length > 3 && '...'}</span>
                        </div>
                        
                        {/* Price and Actions */}
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-xl font-bold text-[#282828]">
                              {product.price} TND
                            </span>
                            {product.comparePrice && (
                              <span className="text-sm text-gray-500 line-through ml-2">
                                {product.comparePrice} TND
                              </span>
                            )}
                          </div>
                          
                          <Link
                            href={`/products/${product.slug}`}
                            className="px-3 py-1.5 text-sm bg-[#282828] text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
                          >
                            <ShoppingBag className="w-3 h-3" />
                            <span className="whitespace-nowrap">View</span>
                          </Link>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-[1920px] mx-auto px-4 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-[#282828] mb-12">
            Why Choose Hijebi Scrubs?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🧕</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Hijab-Friendly Design</h3>
              <p className="text-gray-600">
                Specially designed with longer tops and integrated hijab options for complete coverage.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Premium Quality</h3>
              <p className="text-gray-600">
                Made from breathable, comfortable fabrics that maintain professional appearance all day.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👩‍⚕️</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Professional Style</h3>
              <p className="text-gray-600">
                Modern, professional designs that respect modesty requirements while looking great.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}