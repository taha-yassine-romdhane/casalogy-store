"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Heart, Eye } from "lucide-react"

interface FeaturedProduct {
  id: string
  productId: string
  title?: string
  description?: string
  badge?: string
  isActive: boolean
  sortOrder: number
  product: {
    id: string
    name: string
    slug: string
    price: number
    comparePrice?: number
    category: {
      name: string
    }
    colors: Array<{
      id: string
      colorName: string
      colorCode: string
      images: Array<{
        url: string
        isMain: boolean
      }>
    }>
  }
}

export function FeaturedProducts() {
  const [featuredProducts, setFeaturedProducts] = useState<FeaturedProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [wishlistItems, setWishlistItems] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchFeaturedProducts()
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

  const fetchFeaturedProducts = async () => {
    try {
      const response = await fetch('/api/admin/homepage/featured-products')
      if (response.ok) {
        const data = await response.json()
        setFeaturedProducts(data.filter((p: FeaturedProduct) => p.isActive && p.product))
      }
    } catch (error) {
      console.error('Error fetching featured products:', error)
    } finally {
      setLoading(false)
    }
  }

  const getProductImage = (product: FeaturedProduct['product']) => {
    const mainImage = product.colors?.[0]?.images?.find(img => img.isMain)
    return mainImage?.url || product.colors?.[0]?.images?.[0]?.url || '/placeholder.png'
  }

  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-[1920px] mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-[#282828] mb-4">
              Best Sellers
            </h2>
            <p className="text-lg text-gray-600">
              Top picks from medical students across Tunisia
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-gray-200 rounded-lg mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (featuredProducts.length === 0) {
    return null
  }
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-[1920px] mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-[#282828] mb-4">
            Best Sellers
          </h2>
          <p className="text-lg text-gray-600">
            Top picks from medical students across Tunisia
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.slice(0, 8).map((featured) => {
            const product = featured.product
            return (
              <div key={featured.id} className="group">
                <div className="relative">
                  {featured.badge && (
                    <span className="absolute top-2 left-2 z-10 px-3 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
                      {featured.badge}
                    </span>
                  )}
                  <Link href={`/products/${product.slug}`}>
                    <div className="aspect-[3/4] bg-white mb-4 overflow-hidden rounded-lg cursor-pointer relative">
                      <Image
                        src={getProductImage(product)}
                        alt={featured.title || product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        quality={90}
                        priority={false}
                      />
                    </div>
                  </Link>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">{product.category.name}</p>
                  <Link href={`/products/${product.slug}`}>
                    <h3 className="font-medium text-[#282828] hover:underline line-clamp-2 cursor-pointer">
                      {featured.title || product.name}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-lg text-gray-900 animate-pulse hover:animate-bounce transition-all duration-300">
                      {Number(product.price).toFixed(2)} TND
                    </p>
                    {product.comparePrice && (
                      <p className="text-sm text-gray-500 line-through">
                        {Number(product.comparePrice).toFixed(2)} TND
                      </p>
                    )}
                  </div>
                  {product.colors.length > 0 && (
                    <div className="flex gap-2">
                      {product.colors.slice(0, 4).map((color, index) => (
                        <div
                          key={color.id}
                          className="w-5 h-5 rounded-full border border-gray-300"
                          style={{ backgroundColor: color.colorCode }}
                          title={color.colorName}
                        />
                      ))}
                      {product.colors.length > 4 && (
                        <span className="text-xs text-gray-600 flex items-center">
                          +{product.colors.length - 4} more
                        </span>
                      )}
                    </div>
                  )}
                  {featured.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {featured.description}
                    </p>
                  )}
                </div>
                <div className="mt-4 flex gap-2">
                  <Link 
                    href={`/products/${product.slug}`}
                    className="flex-1 px-4 py-2 bg-[#282828] text-white text-sm font-medium rounded hover:bg-gray-800 transition-colors text-center flex items-center justify-center"
                  >
                    <Eye className="w-4 h-4 inline mr-1" />
                    View Details
                  </Link>
                  <button 
                    onClick={() => toggleWishlist(product.id)}
                    className={`p-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors ${
                      wishlistItems.has(product.id) ? 'bg-red-50 border-red-300' : ''
                    }`}
                  >
                    <Heart 
                      className={`w-4 h-4 transition-colors ${
                        wishlistItems.has(product.id) 
                          ? 'text-red-600 fill-current' 
                          : 'text-gray-600'
                      }`} 
                    />
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/shop"
            className="inline-block px-8 py-4 bg-[#282828] text-white font-medium hover:bg-gray-800 transition-colors"
          >
            VIEW ALL PRODUCTS
          </Link>
        </div>
      </div>
    </section>
  )
}