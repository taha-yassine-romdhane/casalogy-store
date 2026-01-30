"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import {
  Star,
  Heart,
  ShoppingCart,
  Plus,
  Minus,
  Truck,
  Shield,
  RotateCcw,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Check,
  Pencil,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { useCart } from '@/contexts/cart-context'
import { trackViewContent } from '@/lib/facebook-pixel'

interface ProductImage {
  id: string
  url: string
  altText?: string
  isMain: boolean
}

interface Size {
  id: string
  sizeId: string
  sizeName: string
  sizeLabel: string
  sku: string
  price: number
  quantity: number
  isActive: boolean
}

interface ColorVariant {
  id: string
  colorName: string
  colorCode: string
  pantoneCode?: string
  images: ProductImage[]
  sizes: Size[]
  totalStock: number
}

interface Review {
  id: string
  rating: number
  title?: string
  comment?: string
  isVerified: boolean
  createdAt: string
  user: {
    name: string
  }
}

interface Product {
  id: string
  name: string
  slug: string
  description?: string
  shortDescription?: string
  sku: string
  price: number
  comparePrice?: number
  costPrice?: number
  trackQuantity: boolean
  isFeatured: boolean
  fabricType?: string
  pocketCount?: number
  gender?: string
  metaTitle?: string
  metaDescription?: string
  category: {
    name: string
    slug: string
  }
  rating: number
  reviewCount: number
  reviews: Review[]
  colorVariants: ColorVariant[]
  allSizes: Array<{
    id: string
    name: string
    label: string
    category: string
  }>
  totalStock: number
  isOnSale: boolean
  createdAt: string
  updatedAt: string
}

export default function ProductPage() {
  const params = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [selectedColorIndex, setSelectedColorIndex] = useState(0)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [quantity, setQuantity] = useState(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [customization, setCustomization] = useState('')
  const [showCustomization, setShowCustomization] = useState(false)

  const { addItem } = useCart()

  useEffect(() => {
    if (params.slug) {
      fetchProduct(params.slug as string)
    }
  }, [params.slug])

  const fetchProduct = async (slug: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/products/${slug}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Product not found')
        } else {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        return
      }
      
      const data = await response.json()
      setProduct(data.product)

      // Track ViewContent event with Facebook Pixel
      if (data.product) {
        trackViewContent({
          name: data.product.name,
          category: data.product.category?.name,
          id: data.product.id,
          price: data.product.price,
          currency: 'TND'
        })
      }

      // Reset selections when product loads
      setSelectedColorIndex(0)
      setSelectedImageIndex(0)
      setSelectedSize('')
      setQuantity(1)
      setCustomization('')
      setShowCustomization(false)
    } catch (error) {
      console.error('Error fetching product:', error)
      setError('Failed to load product. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const handleColorChange = (colorIndex: number) => {
    setSelectedColorIndex(colorIndex)
    setSelectedImageIndex(0)
    setSelectedSize('') // Reset size selection when color changes
  }

  const handleImageChange = (imageIndex: number) => {
    setSelectedImageIndex(imageIndex)
  }

  const handleAddToCart = async () => {
    if (!product || !selectedSize) {
      alert('Please select a size')
      return
    }

    const selectedColorVariant = product.colorVariants[selectedColorIndex]
    const selectedSizeVariant = selectedColorVariant.sizes.find(s => s.sizeName === selectedSize)

    if (!selectedSizeVariant) {
      alert('Selected size is not available')
      return
    }

    if (selectedSizeVariant.quantity < quantity) {
      alert('Not enough stock available')
      return
    }

    setIsAddingToCart(true)
    
    try {
      // Get main image from the selected color variant
      const mainImage = selectedColorVariant.images.find(img => img.isMain)?.url || 
                        selectedColorVariant.images[0]?.url || null

      await addItem({
        productId: product.id,
        productName: product.name,
        productSlug: product.slug,
        price: selectedSizeVariant.price,
        color: selectedColorVariant.colorName,
        size: selectedSize,
        quantity: quantity,
        image: mainImage,
        maxQuantity: selectedSizeVariant.quantity,
        customization: customization.trim() || undefined
      })

      // Reset customization after adding to cart
      setCustomization('')
      setShowCustomization(false)
      
      // Success feedback - the cart dropdown will open automatically
    } catch (error) {
      console.error('Error adding to cart:', error)
      alert('Error adding product to cart. Please try again.')
    } finally {
      setIsAddingToCart(false)
    }
  }

  const getMaxQuantity = () => {
    if (!product || !selectedSize) return 1
    
    const selectedColorVariant = product.colorVariants[selectedColorIndex]
    const selectedSizeVariant = selectedColorVariant.sizes.find(s => s.sizeName === selectedSize)
    
    return selectedSizeVariant ? Math.min(selectedSizeVariant.quantity, 10) : 1
  }

  const getSelectedVariantPrice = () => {
    if (!product || !selectedSize) return product?.price || 0
    
    const selectedColorVariant = product.colorVariants[selectedColorIndex]
    const selectedSizeVariant = selectedColorVariant.sizes.find(s => s.sizeName === selectedSize)
    
    return selectedSizeVariant?.price || product.price
  }

  const isSelectedSizeInStock = (sizeName: string) => {
    if (!product) return false
    
    const selectedColorVariant = product.colorVariants[selectedColorIndex]
    const sizeVariant = selectedColorVariant.sizes.find(s => s.sizeName === sizeName)
    
    return sizeVariant && sizeVariant.quantity > 0 && sizeVariant.isActive
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading product...</span>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">{error || 'Product not found'}</div>
          <button 
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  const currentColorVariant = product.colorVariants[selectedColorIndex]
  const currentImages = currentColorVariant?.images || []
  const currentImage = currentImages[selectedImageIndex]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1920px] mx-auto px-4 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-600 mb-8">
          <span>Home</span>
          <span className="mx-2">/</span>
          <span>{product.category.name}</span>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative">
              {currentImage ? (
                <img 
                  src={currentImage.url}
                  alt={currentImage.altText || product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-gray-400">No image available</span>
                </div>
              )}
              
              {/* Image Navigation */}
              {currentImages.length > 1 && (
                <>
                  <button 
                    onClick={() => handleImageChange(selectedImageIndex > 0 ? selectedImageIndex - 1 : currentImages.length - 1)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <button 
                    onClick={() => handleImageChange(selectedImageIndex < currentImages.length - 1 ? selectedImageIndex + 1 : 0)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Images */}
            {currentImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {currentImages.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => handleImageChange(index)}
                    className={`flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImageIndex === index ? 'border-blue-600' : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <img 
                      src={image.url}
                      alt={image.altText || product.name}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Basic Info */}
            <div>
              <h1 className="text-3xl font-bold text-[#282828] mb-2">{product.name}</h1>
              <p className="text-gray-600 mb-4">{product.shortDescription}</p>
              
              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <span className="text-3xl font-bold text-[#282828]">{getSelectedVariantPrice()} TND</span>
                {product.comparePrice && (
                  <span className="text-xl text-gray-500 line-through ml-3">{product.comparePrice} TND</span>
                )}
                {product.isOnSale && (
                  <span className="ml-3 bg-red-100 text-red-800 text-sm font-medium px-2 py-1 rounded-full">
                    Sale
                  </span>
                )}
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <h3 className="font-semibold text-[#282828] mb-3">
                Color: {currentColorVariant?.colorName}
              </h3>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {product.colorVariants.map((colorVariant, index) => (
                  <button
                    key={colorVariant.id}
                    onClick={() => handleColorChange(index)}
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 transition-colors flex-shrink-0 ${
                      selectedColorIndex === index ? 'border-blue-600 ring-2 ring-blue-200' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    style={{ backgroundColor: colorVariant.colorCode }}
                    title={colorVariant.colorName}
                  >
                    {selectedColorIndex === index && (
                      <Check className="w-5 h-5 sm:w-6 sm:h-6 text-white mx-auto" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <h3 className="font-semibold text-[#282828] mb-3">Size</h3>
              <div className="grid grid-cols-4 gap-2">
                {currentColorVariant?.sizes.map((size) => {
                  const inStock = isSelectedSizeInStock(size.sizeName)
                  return (
                    <button
                      key={size.id}
                      onClick={() => inStock && setSelectedSize(size.sizeName)}
                      disabled={!inStock}
                      className={`p-3 border rounded-lg text-sm font-medium transition-colors ${
                        selectedSize === size.sizeName
                          ? 'border-blue-600 bg-blue-50 text-blue-600'
                          : inStock
                            ? 'border-gray-300 hover:border-gray-400 text-gray-900'
                            : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {size.sizeName}
                      {!inStock && (
                        <div className="text-xs mt-1">Out of Stock</div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="font-semibold text-[#282828] mb-3">Quantity</h3>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-50 transition-colors"
                  >
                    <Minus className="w-4 h-4 text-gray-700" />
                  </button>
                  <span className="px-4 py-2 font-medium text-gray-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(getMaxQuantity(), quantity + 1))}
                    className="p-2 hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="w-4 h-4 text-gray-700" />
                  </button>
                </div>
                <span className="text-sm text-gray-600">
                  {getMaxQuantity()} available
                </span>
              </div>
            </div>

            {/* Customization */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setShowCustomization(!showCustomization)}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Pencil className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-[#282828]">Add Personalization</span>
                  {customization && (
                    <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-600 rounded-full">Added</span>
                  )}
                </div>
                {showCustomization ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>

              {showCustomization && (
                <div className="p-4 bg-white border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-3">
                    Need customization? Add your logo, personalize the product, or request specific modifications.
                  </p>
                  <textarea
                    value={customization}
                    onChange={(e) => setCustomization(e.target.value)}
                    placeholder="Describe your customization request... (e.g., 'Add my company logo on the left chest pocket', 'I need only the top part', 'Embroider my name: Dr. Ahmed')"
                    rows={3}
                    maxLength={500}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                  />
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-gray-500">
                      {customization.length}/500 characters
                    </p>
                    {customization && (
                      <button
                        onClick={() => setCustomization('')}
                        className="text-xs text-red-600 hover:text-red-700"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-amber-600 mt-2 bg-amber-50 p-2 rounded">
                    Note: Customized orders may have additional processing time. Our team will contact you to confirm details and pricing.
                  </p>
                </div>
              )}
            </div>

            {/* Add to Cart */}
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                disabled={!selectedSize || isAddingToCart}
                className="flex-1 bg-[#282828] text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAddingToCart ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <ShoppingCart className="w-5 h-5" />
                )}
                Add to Cart
              </button>
              <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Heart className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Product Features */}
            <div className="border-t pt-6">
              <div className="grid gap-4">
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-700">Free shipping on orders over 150 TND</span>
                </div>
                <div className="flex items-center gap-3">
                  <RotateCcw className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-gray-700">30-day return policy</span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-purple-600" />
                  <span className="text-sm text-gray-700">1-year warranty</span>
                </div>
              </div>
            </div>

            {/* Product Details */}
            {(product.fabricType || product.pocketCount || product.gender) && (
              <div className="border-t pt-6">
                <h3 className="font-semibold text-[#282828] mb-3">Product Details</h3>
                <div className="space-y-2 text-sm text-gray-700">
                  {product.fabricType && (
                    <div><strong>Fabric:</strong> {product.fabricType}</div>
                  )}
                  {product.pocketCount && (
                    <div><strong>Pockets:</strong> {product.pocketCount}</div>
                  )}
                  {product.gender && (
                    <div><strong>Fit:</strong> {product.gender}</div>
                  )}
                  <div><strong>SKU:</strong> {product.sku}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <div className="mt-16 max-w-4xl">
            <h2 className="text-2xl font-bold text-[#282828] mb-6">Description</h2>
            <div className="prose max-w-none text-gray-700">
              <p>{product.description}</p>
            </div>
          </div>
        )}

        {/* Reviews */}
        {product.reviews.length > 0 && (
          <div className="mt-16 max-w-4xl">
            <h2 className="text-2xl font-bold text-[#282828] mb-6">
              Customer Reviews ({product.reviewCount})
            </h2>
            <div className="space-y-6">
              {product.reviews.slice(0, 5).map((review) => (
                <div key={review.id} className="border-b pb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    <span className="font-medium text-gray-900">{review.user.name}</span>
                    {review.isVerified && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        Verified Purchase
                      </span>
                    )}
                  </div>
                  {review.title && (
                    <h4 className="font-medium text-gray-900 mb-1">{review.title}</h4>
                  )}
                  {review.comment && (
                    <p className="text-gray-700 text-sm">{review.comment}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}