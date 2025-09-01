"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Play } from "lucide-react"

interface HeroData {
  title: string
  subtitle: string
  buttonText: string
  buttonLink: string
  mediaType: 'image' | 'video'
  mediaUrl: string
  mediaUrls?: string[]
}

export function HeroSection() {
  const [heroData, setHeroData] = useState<HeroData | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0)

  useEffect(() => {
    fetchHeroData()
  }, [])

  useEffect(() => {
    if (!heroData || !heroData.mediaUrls || heroData.mediaUrls.length <= 1) {
      return
    }
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroData.mediaUrls.length)
    }, 4000) // Change image every 4 seconds
    
    return () => clearInterval(interval)
  }, [heroData])

  // Animation for feature strips light bond
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeatureIndex((prev) => (prev + 1) % 3)
    }, 2000) // Move light bond every 2 seconds
    
    return () => clearInterval(interval)
  }, [])

  const fetchHeroData = async () => {
    try {
      const response = await fetch('/api/admin/homepage/hero')
      if (response.ok) {
        const data = await response.json()
        setHeroData(data)
      }
    } catch (error) {
      console.error('Error fetching hero data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="relative h-[600px] lg:h-[700px] bg-gray-100">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-gray-50 animate-pulse" />
      </section>
    )
  }

  const data = heroData || {
    title: "Medical Wear\nDesigned for\nTunisia's Heroes",
    subtitle: "Premium scrubs and lab coats for medical students and healthcare professionals. Comfort meets professionalism.",
    buttonText: "SHOP NOW",
    buttonLink: "/products",
    mediaType: 'image' as const,
    mediaUrl: "/hero-bg.jpg",
    mediaUrls: []
  }

  const images = data.mediaUrls && data.mediaUrls.length > 0 ? data.mediaUrls : [data.mediaUrl].filter(Boolean)
  const hasMultipleImages = images.length > 1
  const formatTitle = (title: string) => {
    const parts = title.split('\n')
    if (parts.length > 1) {
      return (
        <>
          {parts.map((part, index) => {
            const isHighlighted = part.toLowerCase().includes('tunisia') || part.toLowerCase().includes('heroes')
            return (
              <span key={index}>
                {isHighlighted ? (
                  <span className="text-blue-600">{part}</span>
                ) : (
                  part
                )}
                {index < parts.length - 1 && <br />}
              </span>
            )
          })}
        </>
      )
    }
    return title
  }

  return (
    <>
      {/* Mobile Only Hero Section */}
      <section className="md:hidden relative">
        <div className="relative">
          {images.length > 0 && images.map((image, index) => (
            <div
              key={index}
              className={`relative ${
                index === currentImageIndex ? 'block' : 'hidden'
              }`}
            >
              <Image
                src={image}
                alt={`Hero image ${index + 1}`}
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
                  href="/scrubs"
                  className="px-6 py-2.5 bg-[#282828] text-white font-medium text-sm hover:bg-gray-800 transition-colors shadow-lg rounded"
                >
                  SHOP NOW
                </Link>
              </div>
            </div>
          ))}
          
          {/* Mobile Carousel Indicators */}
          {hasMultipleImages && (
            <div className="flex justify-center gap-2 py-3 bg-white">
              {images.map((_, index) => (
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
          )}
        </div>
      </section>

      {/* Desktop Only Hero Section */}
      <section className="hidden md:block relative">
        <div className="relative h-[600px] lg:h-[700px] bg-gray-100 overflow-hidden">
          {/* Background Media */}
          {data.mediaType === 'image' ? (
            <>
              {images.length > 0 ? (
                <>
                  {images.map((image, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 transition-opacity duration-1000 ${
                        index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`Hero image ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="100vw"
                        quality={95}
                        priority={index === 0}
                      />
                    </div>
                  ))}
                  
                  {/* Desktop Carousel Indicators */}
                  {hasMultipleImages && (
                    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
                      {images.map((_, index) => (
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
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-gray-50">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-10 left-10 w-40 h-40 bg-blue-300 rounded-full blur-3xl"></div>
                  <div className="absolute bottom-10 right-10 w-60 h-60 bg-purple-300 rounded-full blur-3xl"></div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="absolute inset-0">
            <video 
              autoPlay 
              muted 
              loop 
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src={data.mediaUrl} type="video/mp4" />
            </video>
          </div>
        )}
        
        {/* Hide content on mobile, show on desktop */}
        <div className="relative z-10 h-full hidden md:flex items-center justify-center">
          <div className="max-w-[1920px] mx-auto px-4 lg:px-8 w-full">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6 text-[#282828] leading-tight">
                {formatTitle(data.title)}
              </h1>
              <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto text-gray-700 px-4">
                {data.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
                <Link
                  href="/scrubs"
                  className="inline-block px-6 sm:px-8 py-3 sm:py-4 bg-[#282828] text-white font-medium text-center hover:bg-gray-800 transition-colors text-sm sm:text-base"
                >
                  SHOP NOW
                </Link>
                <Link
                  href="/size-guide"
                  className="inline-block px-6 sm:px-8 py-3 sm:py-4 bg-white text-[#282828] font-medium text-center border-2 border-[#282828] hover:bg-gray-50 transition-colors text-sm sm:text-base"
                >
                  SIZE GUIDE
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

        {/* Feature Strips - Hidden on mobile */}
        <div className="relative hidden md:grid md:grid-cols-3 bg-white overflow-hidden">
        {/* Animated light bond */}
        <div 
          className="absolute top-0 h-1 w-1/3 bg-gradient-to-r from-transparent via-gray-600 to-transparent transition-transform duration-1000 ease-in-out"
          style={{ 
            transform: `translateX(${currentFeatureIndex * 100}%)`,
            boxShadow: '0 0 8px rgba(107, 114, 128, 0.6)'
          }}
        ></div>
        
        <div className="p-4 sm:p-6 md:p-8 text-center border-b md:border-b-0 md:border-r border-gray-200">
          <h3 className="font-bold text-base sm:text-lg mb-1 sm:mb-2 text-gray-900">Free Shipping</h3>
          <p className="text-gray-800 text-sm sm:text-base">On orders over 200 TND</p>
        </div>
        <div className="p-4 sm:p-6 md:p-8 text-center border-b md:border-b-0 md:border-r border-gray-200">
          <h3 className="font-bold text-base sm:text-lg mb-1 sm:mb-2 text-gray-900">Student Discount</h3>
          <p className="text-gray-800 text-sm sm:text-base">15% off with valid student ID</p>
        </div>
        <div className="p-4 sm:p-6 md:p-8 text-center">
          <h3 className="font-bold text-base sm:text-lg mb-1 sm:mb-2 text-gray-900">Made in Tunisia</h3>
          <p className="text-gray-800 text-sm sm:text-base">Supporting local manufacturing</p>
        </div>
        </div>
      </section>
    </>
  )
}