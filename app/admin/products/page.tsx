"use client"

import { useState, useEffect } from 'react'
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Filter,
  MoreHorizontal,
  Package,
  DollarSign,
  Tag
} from 'lucide-react'
import { MedicalProductForm } from '@/components/admin/medical-product-form'

interface Product {
  id: string
  name: string
  sku: string
  price: any // Prisma Decimal type
  comparePrice?: any // Prisma Decimal type
  category: { name: string }
  colors?: {
    images?: {
      url: string
      isMain: boolean
    }[]
  }[]
  isActive: boolean
  isFeatured: boolean
  totalStock: number
  variantCount: number
  createdAt: string
}

interface Category {
  id: string
  name: string
  slug: string
}

interface Color {
  id: string
  name: string
  hexCode: string
  images: string[]
}

interface Size {
  id: string
  name: string
  label: string
  category: string
}

interface ProductVariant {
  colorId: string
  sizeId: string
  price: number
  quantity: number
  sku: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [availableColors, setAvailableColors] = useState<Color[]>([])
  const [availableSizes, setAvailableSizes] = useState<Size[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  
  // Product form state
  const [productColors, setProductColors] = useState<Color[]>([])
  const [productSizes, setProductSizes] = useState<Size[]>([])
  const [productVariants, setProductVariants] = useState<ProductVariant[]>([])
  const [dragOverColorId, setDragOverColorId] = useState<string | null>(null)

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...(searchTerm && { search: searchTerm }),
        ...(selectedCategory && { category: selectedCategory }),
        ...(statusFilter && { isActive: statusFilter })
      })

      const response = await fetch(`/api/admin/products?${params}`)
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products)
        setTotalPages(data.pagination.pages)
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  // Delete product
  const handleDelete = async (productId: string) => {
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        setProducts(products.filter(p => p.id !== productId))
        setDeleteConfirm(null)
      }
    } catch (error) {
      console.error('Failed to delete product:', error)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [currentPage, searchTerm, selectedCategory, statusFilter])

  useEffect(() => {
    fetchCategories()
    fetchColorsAndSizes()
  }, [])

  // Fetch available colors and sizes
  const fetchColorsAndSizes = async () => {
    try {
      // Fetch colors from database
      const colorsResponse = await fetch('/api/admin/colors')
      if (colorsResponse.ok) {
        const colorsData = await colorsResponse.json()
        setAvailableColors(colorsData.map((color: any) => ({
          id: color.id,
          name: color.name,
          hexCode: color.hexCode,
          images: []
        })))
      }
      
      // Fetch sizes from database
      const sizesResponse = await fetch('/api/admin/sizes')
      if (sizesResponse.ok) {
        const sizesData = await sizesResponse.json()
        // Filter active sizes only
        setAvailableSizes(sizesData.filter((size: any) => size.isActive))
      }
    } catch (error) {
      console.error('Failed to fetch colors and sizes:', error)
    }
  }

  // Color management functions
  const addProductColor = (color: Color) => {
    if (!productColors.find(c => c.id === color.id)) {
      setProductColors([...productColors, { ...color, images: [] }])
      updateVariantsForNewColor(color.id)
    }
  }

  const removeProductColor = (colorId: string) => {
    setProductColors(productColors.filter(c => c.id !== colorId))
    setProductVariants(productVariants.filter(v => v.colorId !== colorId))
  }

  const createNewColor = () => {
    const colorName = prompt('Enter color name:')
    const hexCode = prompt('Enter hex code (e.g., #ff0000):')
    
    if (colorName && hexCode) {
      const newColor: Color = {
        id: Date.now().toString(),
        name: colorName,
        hexCode: hexCode,
        images: []
      }
      setAvailableColors([...availableColors, newColor])
      addProductColor(newColor)
    }
  }

  // Size management functions
  const addProductSize = (size: Size) => {
    if (!productSizes.find(s => s.id === size.id)) {
      setProductSizes([...productSizes, size])
      updateVariantsForNewSize(size.id)
    }
  }

  const removeProductSize = (sizeId: string) => {
    setProductSizes(productSizes.filter(s => s.id !== sizeId))
    setProductVariants(productVariants.filter(v => v.sizeId !== sizeId))
  }

  const createNewSize = () => {
    const sizeName = prompt('Enter size name (e.g., S, M, L):')
    const sizeLabel = prompt('Enter size label (e.g., Small, Medium, Large):')
    
    if (sizeName && sizeLabel) {
      const newSize: Size = {
        id: Date.now().toString(),
        name: sizeName,
        label: sizeLabel,
        category: 'UNISEX' // Default category for new sizes
      }
      setAvailableSizes([...availableSizes, newSize])
      addProductSize(newSize)
    }
  }

  // Variant management functions
  const updateVariantsForNewColor = (colorId: string) => {
    productSizes.forEach(size => {
      if (!productVariants.find(v => v.colorId === colorId && v.sizeId === size.id)) {
        const newVariant: ProductVariant = {
          colorId,
          sizeId: size.id,
          price: 0,
          quantity: 0,
          sku: ''
        }
        setProductVariants(prev => [...prev, newVariant])
      }
    })
  }

  const updateVariantsForNewSize = (sizeId: string) => {
    productColors.forEach(color => {
      if (!productVariants.find(v => v.colorId === color.id && v.sizeId === sizeId)) {
        const newVariant: ProductVariant = {
          colorId: color.id,
          sizeId,
          price: 0,
          quantity: 0,
          sku: ''
        }
        setProductVariants(prev => [...prev, newVariant])
      }
    })
  }

  const updateVariant = (colorId: string, sizeId: string, field: keyof ProductVariant, value: string | number) => {
    setProductVariants(prev => 
      prev.map(variant => 
        variant.colorId === colorId && variant.sizeId === sizeId
          ? { ...variant, [field]: value }
          : variant
      )
    )
  }

  // Image management functions
  const handleImageDrop = (e: React.DragEvent, colorId: string) => {
    e.preventDefault()
    setDragOverColorId(null)
    
    const files = Array.from(e.dataTransfer.files)
    const imageFiles = files.filter(file => file.type.startsWith('image/'))
    
    if (imageFiles.length > 0) {
      // In a real app, you would upload these files to a storage service
      // For now, we'll create object URLs for preview
      const imageUrls = imageFiles.map(file => URL.createObjectURL(file))
      
      setProductColors(prev =>
        prev.map(color =>
          color.id === colorId
            ? { ...color, images: [...color.images, ...imageUrls] }
            : color
        )
      )
    }
  }

  const resetForm = () => {
    setProductColors([])
    setProductSizes([])
    setProductVariants([])
  }

  // Handle professional form submission
  const handleProductSubmit = async (data: any) => {
    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      
      if (response.ok) {
        setShowAddModal(false)
        resetForm()
        fetchProducts()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to create product')
      }
    } catch (error) {
      console.error('Error creating product:', error)
      alert('Failed to create product')
    }
  }

  const handleEditProduct = async (product: Product) => {
    try {
      // Fetch full product data with colors and images
      const response = await fetch(`/api/admin/products/${product.id}`)
      if (response.ok) {
        const fullProduct = await response.json()
        setEditingProduct(fullProduct)
      } else {
        alert('Failed to load product details')
      }
    } catch (error) {
      console.error('Error loading product:', error)
      alert('Failed to load product details')
    }
  }

  const handleProductUpdate = async (data: any) => {
    if (!editingProduct) return
    
    try {
      const response = await fetch(`/api/admin/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      
      if (response.ok) {
        setEditingProduct(null)
        resetForm()
        fetchProducts()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to update product')
      }
    } catch (error) {
      console.error('Error updating product:', error)
      alert('Failed to update product')
    }
  }

  const formatPrice = (price: number | any) => {
    // Handle Prisma Decimal type
    const numPrice = typeof price === 'object' ? parseFloat(price.toString()) : Number(price)
    return `${numPrice.toFixed(2)} TND`
  }

  const getMainImageUrl = (product: Product): string | null => {
    if (!product.colors || product.colors.length === 0) return null
    
    // Look for main image across all colors
    for (const color of product.colors) {
      if (color.images) {
        const mainImage = color.images.find(img => img.isMain)
        if (mainImage) return mainImage.url
      }
    }
    
    // Fallback to first image if no main image found
    for (const color of product.colors) {
      if (color.images && color.images.length > 0) {
        return color.images[0].url
      }
    }
    
    return null
  }

  const getStatusBadge = (isActive: boolean) => (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
      isActive 
        ? 'bg-green-100 text-green-800' 
        : 'bg-red-100 text-red-800'
    }`}>
      {isActive ? 'Active' : 'Inactive'}
    </span>
  )

  const getStockBadge = (stock: number) => (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
      stock > 10 
        ? 'bg-green-100 text-green-800'
        : stock > 0
        ? 'bg-yellow-100 text-yellow-800'
        : 'bg-red-100 text-red-800'
    }`}>
      {stock} units
    </span>
  )

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Products</h1>
          <p className="text-gray-800">Manage your medical wear inventory</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-800">Total Products</p>
              <p className="text-2xl font-bold text-gray-800">{products.length}</p>
            </div>
            <Package className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-800">Active Products</p>
              <p className="text-2xl font-bold text-gray-800">
                {products.filter(p => p.isActive).length}
              </p>
            </div>
            <Eye className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-800">Low Stock</p>
              <p className="text-2xl font-bold text-gray-800">
                {products.filter(p => p.totalStock <= 5).length}
              </p>
            </div>
            <Tag className="w-8 h-8 text-orange-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-800">Featured</p>
              <p className="text-2xl font-bold text-gray-800">
                {products.filter(p => p.isFeatured).length}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products by name, SKU, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-700">Loading products...</p>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-700">No products found</p>
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12 bg-gray-200 rounded-lg overflow-hidden">
                          {getMainImageUrl(product) ? (
                            <img 
                              src={getMainImageUrl(product)!} 
                              alt={product.name}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                // Fallback to placeholder on error
                                (e.target as HTMLImageElement).style.display = 'none'
                                const parent = (e.target as HTMLImageElement).parentElement
                                if (parent) {
                                  parent.innerHTML = `
                                    <div class="h-full w-full flex items-center justify-center">
                                      <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                                      </svg>
                                    </div>
                                  `
                                }
                              }}
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center">
                              <Package className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-800">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-700">
                            {product.variantCount} variant{product.variantCount !== 1 ? 's' : ''}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {product.sku}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {product.category.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      <div>
                        {formatPrice(product.price)}
                        {product.comparePrice && (
                          <div className="text-xs text-gray-700 line-through">
                            {formatPrice(product.comparePrice)}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStockBadge(product.totalStock)}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(product.isActive)}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(product.id)}
                          className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-gray-900/75 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Delete Product</h3>
            <p className="text-gray-800 mb-6">
              Are you sure you want to delete this product? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-900/75 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-7xl w-full mx-4 max-h-[95vh] overflow-y-auto">
            <MedicalProductForm
              categories={categories}
              availableColors={availableColors}
              availableSizes={availableSizes}
              onSubmit={handleProductSubmit}
              onClose={() => {
                setShowAddModal(false)
                resetForm()
              }}
              isEdit={false}
            />
          </div>
        </div>
      )}

      {editingProduct && (
        <div className="fixed inset-0 bg-gray-900/75 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-7xl w-full mx-4 max-h-[95vh] overflow-y-auto">
            <MedicalProductForm
              categories={categories}
              availableColors={availableColors}
              availableSizes={availableSizes}
              onSubmit={handleProductUpdate}
              onClose={() => {
                setEditingProduct(null)
                resetForm()
              }}
              isEdit={true}
              initialData={editingProduct}
            />
          </div>
        </div>
      )}
    </div>
  )
}