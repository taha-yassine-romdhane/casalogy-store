"use client"

import { useState, useEffect } from 'react'
import { Search, Plus, Trash2, Check, X, Package, Loader2, Star, StarOff } from 'lucide-react'

interface Product {
  id: string
  name: string
  sku: string
  price: number
  comparePrice?: number
  category: { name: string }
  colors: Array<{
    colorName: string
    colorCode: string
    images: Array<{ url: string; isMain: boolean }>
  }>
  isActive: boolean
  isFeatured: boolean
  totalStock: number
}

interface FeaturedProduct {
  id?: string
  productId: string
  title?: string
  description?: string
  badge?: string
  isActive: boolean
  sortOrder: number
  product?: Product
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [featuredProducts, setFeaturedProducts] = useState<FeaturedProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [editingProduct, setEditingProduct] = useState<FeaturedProduct | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      // Fetch all products and featured products in parallel
      const [productsRes, featuredRes] = await Promise.all([
        fetch('/api/admin/products?limit=100'),
        fetch('/api/admin/homepage/featured-products')
      ])

      if (productsRes.ok) {
        const data = await productsRes.json()
        setProducts(data.products || [])
      }

      if (featuredRes.ok) {
        const featured = await featuredRes.json()
        setFeaturedProducts(featured || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddFeaturedProduct = async () => {
    if (!selectedProduct) return

    try {
      const response = await fetch('/api/admin/homepage/featured-products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: selectedProduct.id,
          title: editingProduct?.title || selectedProduct.name,
          description: editingProduct?.description,
          badge: editingProduct?.badge,
          sortOrder: featuredProducts.length
        })
      })

      if (response.ok) {
        await fetchData()
        setShowAddModal(false)
        setSelectedProduct(null)
        setEditingProduct(null)
      }
    } catch (error) {
      console.error('Error adding featured product:', error)
      alert('Failed to add featured product')
    }
  }

  const handleRemoveFeaturedProduct = async (id: string) => {
    if (!confirm('Remove this product from featured?')) return

    try {
      const response = await fetch(`/api/admin/homepage/featured-products?id=${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchData()
      }
    } catch (error) {
      console.error('Error removing featured product:', error)
      alert('Failed to remove featured product')
    }
  }

  const toggleProductFeatured = async (product: Product) => {
    try {
      // Check if product is already featured
      const featured = featuredProducts.find(fp => fp.productId === product.id)
      
      if (featured) {
        // Remove from featured
        await handleRemoveFeaturedProduct(featured.id!)
      } else {
        // Add to featured
        const response = await fetch('/api/admin/homepage/featured-products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId: product.id,
            title: product.name,
            sortOrder: featuredProducts.length
          })
        })

        if (response.ok) {
          await fetchData()
        }
      }
    } catch (error) {
      console.error('Error toggling featured status:', error)
      alert('Failed to update featured status')
    }
  }

  const getProductImage = (product: Product) => {
    const mainImage = product.colors?.[0]?.images?.find(img => img.isMain)
    return mainImage?.url || product.colors?.[0]?.images?.[0]?.url || '/placeholder.png'
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const featuredProductIds = new Set(featuredProducts.map(fp => fp.productId))

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Featured Products</h2>
          <p className="text-sm text-gray-600 mt-1">
            {featuredProducts.length} products featured
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Featured Product
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search products by name or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Featured Products Grid */}
      {featuredProducts.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Currently Featured</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {featuredProducts.map((featured) => {
              const product = featured.product || products.find(p => p.id === featured.productId)
              if (!product) return null

              return (
                <div key={featured.id} className="border border-gray-200 rounded-lg p-4 relative">
                  <button
                    onClick={() => handleRemoveFeaturedProduct(featured.id!)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  
                  {featured.badge && (
                    <span className="absolute top-2 left-2 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                      {featured.badge}
                    </span>
                  )}
                  
                  <img
                    src={getProductImage(product)}
                    alt={product.name}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                  <h4 className="font-medium text-gray-800 text-sm mb-1">{featured.title || product.name}</h4>
                  <p className="text-xs text-gray-600 mb-2">{product.sku}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-gray-800">
                      {Number(product.price).toFixed(2)} TND
                    </span>
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* All Products List */}
      <div>
        <h3 className="text-lg font-medium text-gray-800 mb-4">All Products</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((product) => {
            const isFeatured = featuredProductIds.has(product.id)
            
            return (
              <div
                key={product.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  isFeatured 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => toggleProductFeatured(product)}
              >
                <div className="relative">
                  <img
                    src={getProductImage(product)}
                    alt={product.name}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                  {isFeatured && (
                    <div className="absolute top-2 right-2 p-2 bg-blue-600 text-white rounded-full">
                      <Star className="w-3 h-3 fill-current" />
                    </div>
                  )}
                </div>
                
                <h4 className="font-medium text-gray-800 text-sm mb-1 line-clamp-1">{product.name}</h4>
                <p className="text-xs text-gray-600 mb-1">{product.sku}</p>
                <p className="text-xs text-gray-500 mb-2">{product.category.name}</p>
                
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-semibold text-gray-800">
                      {Number(product.price).toFixed(2)} TND
                    </span>
                    {product.comparePrice && (
                      <span className="text-xs text-gray-500 line-through ml-2">
                        {Number(product.comparePrice).toFixed(2)}
                      </span>
                    )}
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    product.totalStock > 0 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.totalStock > 0 ? `${product.totalStock} in stock` : 'Out of stock'}
                  </span>
                </div>
                
                <button
                  className={`mt-3 w-full py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    isFeatured
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleProductFeatured(product)
                  }}
                >
                  {isFeatured ? (
                    <>
                      <StarOff className="w-4 h-4 inline mr-1" />
                      Remove from Featured
                    </>
                  ) : (
                    <>
                      <Star className="w-4 h-4 inline mr-1" />
                      Add to Featured
                    </>
                  )}
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add Featured Product</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Product
                </label>
                <select
                  value={selectedProduct?.id || ''}
                  onChange={(e) => {
                    const product = products.find(p => p.id === e.target.value)
                    setSelectedProduct(product || null)
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a product</option>
                  {products.filter(p => !featuredProductIds.has(p.id)).map(product => (
                    <option key={product.id} value={product.id}>
                      {product.name} - {product.sku}
                    </option>
                  ))}
                </select>
              </div>

              {selectedProduct && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Custom Title (optional)
                    </label>
                    <input
                      type="text"
                      placeholder={selectedProduct.name}
                      value={editingProduct?.title || ''}
                      onChange={(e) => setEditingProduct({
                        ...editingProduct,
                        productId: selectedProduct.id,
                        title: e.target.value,
                        isActive: true,
                        sortOrder: 0
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Badge (optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., New, Sale, Limited"
                      value={editingProduct?.badge || ''}
                      onChange={(e) => setEditingProduct({
                        ...editingProduct!,
                        badge: e.target.value
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description (optional)
                    </label>
                    <textarea
                      placeholder="Short description..."
                      value={editingProduct?.description || ''}
                      onChange={(e) => setEditingProduct({
                        ...editingProduct!,
                        description: e.target.value
                      })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false)
                  setSelectedProduct(null)
                  setEditingProduct(null)
                }}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddFeaturedProduct}
                disabled={!selectedProduct}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add to Featured
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}