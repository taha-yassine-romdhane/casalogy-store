"use client"

import { useState, useEffect } from 'react'
import { ChevronRight, Package } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
}

interface FeaturedCategory {
  id: string
  categoryId: string
  title?: string
  description?: string
  imageUrl?: string
  isActive: boolean
  sortOrder: number
  category: Category
}

export function FeaturedCategories() {
  const [categories, setCategories] = useState<FeaturedCategory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/featured-categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error('Error fetching featured categories:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-20">
            <div className="h-8 bg-gray-200 rounded-full w-48 mx-auto mb-6 animate-pulse"></div>
            <div className="h-16 bg-gray-200 rounded w-80 mx-auto mb-6 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-gray-100 animate-pulse rounded-lg"></div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // Fallback to static categories if no database categories
  if (categories.length === 0) {
    const fallbackCategories = [
      {
        title: "SCRUBS",
        subtitle: "Performance Fabric",
        description: "Moisture-wicking, anti-wrinkle scrubs",
        href: "/scrubs",
        bgColor: "bg-gradient-to-br from-blue-500 to-blue-600"
      },
      {
        title: "LAB COATS",
        subtitle: "Professional Style",
        description: "Classic white coats for medical students",
        href: "/lab-coats",
        bgColor: "bg-gradient-to-br from-gray-600 to-gray-700"
      },
      {
        title: "UNDERSCRUBS",
        subtitle: "Base Layer Comfort",
        description: "Breathable underlayers for all-day wear",
        href: "/underscrubs",
        bgColor: "bg-gradient-to-br from-purple-500 to-purple-600"
      },
      {
        title: "FOOTWEAR",
        subtitle: "All-Day Support",
        description: "Comfortable shoes for long shifts",
        href: "/footwear",
        bgColor: "bg-gradient-to-br from-green-500 to-green-600"
      }
    ]

    return (
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-block px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full mb-4">
              <span className="text-sm font-semibold text-indigo-700">PREMIUM COLLECTION</span>
            </div>
            <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-[#282828] mb-6 leading-tight">
              Shop by Category
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Premium medical apparel designed for comfort, functionality, and style. 
              Perfect for Tunisia's medical professionals.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
            {fallbackCategories.map((category) => (
              <Link
                key={category.title}
                href={category.href}
                className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="aspect-[3/4] relative overflow-hidden transition-transform duration-300 group-hover:scale-[1.02]">
                  <div className={`absolute inset-0 ${category.bgColor}`}></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                  
                  {/* Content Overlay */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-between">
                    {/* Top Content */}
                    <div className="flex flex-col">
                      <span className="inline-block px-3 py-1 bg-white/90 text-xs font-semibold text-gray-800 rounded-full w-fit mb-3">
                        {category.subtitle}
                      </span>
                    </div>
                    
                    {/* Bottom Content */}
                    <div className="flex flex-col">
                      <h3 className="text-2xl font-bold text-white mb-2 uppercase tracking-wide drop-shadow-lg">
                        {category.title}
                      </h3>
                      <p className="text-white/90 text-sm mb-4 line-clamp-2 drop-shadow">
                        {category.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center text-sm font-semibold text-white bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full group-hover:bg-white/30 transition-all duration-300">
                          Shop Now
                          <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // Database-driven categories
  const bgColors = ['bg-gradient-to-br from-blue-500 to-blue-600', 'bg-gradient-to-br from-gray-600 to-gray-700', 'bg-gradient-to-br from-purple-500 to-purple-600', 'bg-gradient-to-br from-green-500 to-green-600', 'bg-gradient-to-br from-indigo-500 to-indigo-600', 'bg-gradient-to-br from-pink-500 to-pink-600']

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="text-center mb-20">
          <div className="inline-block px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full mb-4">
            <span className="text-sm font-semibold text-indigo-700">PREMIUM COLLECTION</span>
          </div>
          <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-[#282828] mb-6 leading-tight">
            Shop by Category
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Premium medical apparel designed for comfort, functionality, and style. 
            Perfect for Tunisia's medical professionals.
          </p>
        </div>

        <div className={`grid gap-8 ${categories.length >= 4 ? 'md:grid-cols-2 xl:grid-cols-4' : categories.length === 3 ? 'md:grid-cols-3' : categories.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-1 max-w-sm mx-auto'}`}>
          {categories.map((category, index) => (
            <Link
              key={category.id}
              href={`/category/${category.category.slug}`}
              className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="aspect-[3/4] relative overflow-hidden transition-transform duration-300 group-hover:scale-[1.02]">
                {/* Background Image */}
                {(category.imageUrl || category.category.image) ? (
                  <div className="absolute inset-0">
                    <Image
                      src={category.imageUrl || category.category.image}
                      alt={category.title || category.category.name}
                      fill
                      className="object-cover transition-all duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                      quality={85}
                      priority={index < 2}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  </div>
                ) : (
                  <div className={`w-full h-full ${bgColors[index % bgColors.length]}`}>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                  </div>
                )}
                
                {/* Content Overlay */}
                <div className="absolute inset-0 p-6 flex flex-col justify-between">

                  {/* Top Content */}
                  <div className="flex flex-col">
                    <span className="inline-block px-3 py-1 bg-white/90 text-xs font-semibold text-gray-800 rounded-full w-fit mb-3">
                      Professional Quality
                    </span>
                  </div>
                  
                  {/* Bottom Content */}
                  <div className="flex flex-col">
                    <h3 className="text-2xl font-bold text-white mb-2 uppercase tracking-wide drop-shadow-lg">
                      {category.title || category.category.name}
                    </h3>
                    <p className="text-white/90 text-sm mb-4 line-clamp-2 drop-shadow">
                      {category.description || category.category.description || 'High-quality medical wear designed for professionals'}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center text-sm font-semibold text-white bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full group-hover:bg-white/30 transition-all duration-300">
                        Shop Now
                        <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {categories.length > 3 && (
          <div className="text-center mt-16">
            <Link
              href="/categories"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#282828] to-gray-700 text-white font-semibold rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              View All Categories
              <ChevronRight className="ml-3 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}