"use client"

import { useState } from 'react'
import { Plus, X, Upload, Palette, Ruler, Trash2 } from 'lucide-react'

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
}

interface ProductVariant {
  colorId: string
  sizeId: string
  price: number
  quantity: number
  sku: string
}

interface Category {
  id: string
  name: string
  slug: string
}

interface ProfessionalProductFormProps {
  categories: Category[]
  availableColors: Color[]
  availableSizes: Size[]
  onSubmit: (data: any) => void
  onClose: () => void
  isEdit?: boolean
  initialData?: any
}

export function ProfessionalProductForm({
  categories,
  availableColors,
  availableSizes,
  onSubmit,
  onClose,
  isEdit = false,
  initialData
}: ProfessionalProductFormProps) {
  const [productColors, setProductColors] = useState<Color[]>([])
  const [productSizes, setProductSizes] = useState<Size[]>([])
  const [productVariants, setProductVariants] = useState<ProductVariant[]>([])
  const [dragOverColorId, setDragOverColorId] = useState<string | null>(null)

  // Color management
  const addProductColor = (color: Color) => {
    if (!productColors.find(c => c.id === color.id)) {
      const newColor = { ...color, images: [] }
      setProductColors([...productColors, newColor])
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
      addProductColor(newColor)
    }
  }

  // Size management
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
        label: sizeLabel
      }
      addProductSize(newSize)
    }
  }

  // Variant management
  const updateVariantsForNewColor = (colorId: string) => {
    productSizes.forEach(size => {
      if (!productVariants.find(v => v.colorId === colorId && v.sizeId === size.id)) {
        const basePrice = parseFloat((document.querySelector('[name="price"]') as HTMLInputElement)?.value || '0') || 0
        const newVariant: ProductVariant = {
          colorId,
          sizeId: size.id,
          price: basePrice,
          quantity: 0,
          sku: `${(document.querySelector('[name="sku"]') as HTMLInputElement)?.value || ''}-${colorId}-${size.id}`
        }
        setProductVariants(prev => [...prev, newVariant])
      }
    })
  }

  const updateVariantsForNewSize = (sizeId: string) => {
    productColors.forEach(color => {
      if (!productVariants.find(v => v.colorId === color.id && v.sizeId === sizeId)) {
        const basePrice = parseFloat((document.querySelector('[name="price"]') as HTMLInputElement)?.value || '0') || 0
        const newVariant: ProductVariant = {
          colorId: color.id,
          sizeId,
          price: basePrice,
          quantity: 0,
          sku: `${(document.querySelector('[name="sku"]') as HTMLInputElement)?.value || ''}-${color.id}-${sizeId}`
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

  // Image management
  const handleImageDrop = (e: React.DragEvent, colorId: string) => {
    e.preventDefault()
    setDragOverColorId(null)
    
    const files = Array.from(e.dataTransfer.files)
    const imageFiles = files.filter(file => file.type.startsWith('image/'))
    
    if (imageFiles.length > 0) {
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

  const handleImageDragOver = (e: React.DragEvent, colorId: string) => {
    e.preventDefault()
    setDragOverColorId(colorId)
  }

  const handleImageDragLeave = () => {
    setDragOverColorId(null)
  }

  const removeImage = (colorId: string, imageIndex: number) => {
    setProductColors(prev =>
      prev.map(color =>
        color.id === colorId
          ? { ...color, images: color.images.filter((_, index) => index !== imageIndex) }
          : color
      )
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget as HTMLFormElement)
    
    const data = {
      name: formData.get('name'),
      sku: formData.get('sku'),
      description: formData.get('description'),
      shortDescription: formData.get('shortDescription'),
      price: formData.get('price'),
      comparePrice: formData.get('comparePrice') || null,
      categoryId: formData.get('categoryId'),
      isActive: formData.get('isActive') === 'on',
      isFeatured: formData.get('isFeatured') === 'on',
      metaTitle: formData.get('metaTitle'),
      metaDescription: formData.get('metaDescription'),
      colors: productColors,
      sizes: productSizes,
      variants: productVariants
    }
    
    await onSubmit(data)
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-bold text-gray-800">
          {isEdit ? 'Edit Product' : 'Add New Product'}
        </h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-800 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                required
                defaultValue={initialData?.name}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter product name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Base SKU *
              </label>
              <input
                type="text"
                name="sku"
                required
                defaultValue={initialData?.sku}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter base SKU"
              />
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Short Description
              </label>
              <input
                type="text"
                name="shortDescription"
                defaultValue={initialData?.shortDescription}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Brief product description"
              />
            </div>
            
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Description
              </label>
              <textarea
                name="description"
                rows={4}
                defaultValue={initialData?.description}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Detailed product description"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Base Price *
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="price"
                  required
                  step="0.01"
                  min="0"
                  defaultValue={initialData?.price}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
                <span className="absolute right-4 top-3 text-gray-700">TND</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Compare Price
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="comparePrice"
                  step="0.01"
                  min="0"
                  defaultValue={initialData?.comparePrice || ''}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
                <span className="absolute right-4 top-3 text-gray-700">TND</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Category *
              </label>
              <select
                name="categoryId"
                required
                defaultValue={initialData?.categoryId || ''}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Colors Management */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-semibold text-gray-800 flex items-center">
              <Palette className="w-5 h-5 mr-2" />
              Product Colors
            </h4>
            <button
              type="button"
              onClick={createNewColor}
              className="flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-1" />
              Create Color
            </button>
          </div>

          <div className="mb-6">
            <h5 className="text-sm font-medium text-gray-800 mb-3">Available Colors</h5>
            <div className="flex flex-wrap gap-2">
              {availableColors.map((color) => (
                <button
                  key={color.id}
                  type="button"
                  onClick={() => addProductColor(color)}
                  className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={productColors.some(c => c.id === color.id)}
                >
                  <div 
                    className="w-4 h-4 rounded-full mr-2 border border-gray-300"
                    style={{ backgroundColor: color.hexCode }}
                  ></div>
                  {color.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h5 className="text-sm font-medium text-gray-800 mb-3">Selected Colors</h5>
            {productColors.length === 0 ? (
              <p className="text-gray-700 text-sm">No colors selected yet</p>
            ) : (
              <div className="space-y-6">
                {productColors.map((color) => (
                  <div key={color.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div 
                          className="w-6 h-6 rounded-full mr-3 border border-gray-300"
                          style={{ backgroundColor: color.hexCode }}
                        ></div>
                        <span className="font-medium text-gray-800">{color.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeProductColor(color.id)}
                        className="text-red-600 hover:text-red-800 p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Image Upload Area */}
                    <div
                      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                        dragOverColorId === color.id
                          ? 'border-blue-400 bg-blue-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      onDrop={(e) => handleImageDrop(e, color.id)}
                      onDragOver={(e) => handleImageDragOver(e, color.id)}
                      onDragLeave={handleImageDragLeave}
                    >
                      <Upload className="w-10 h-10 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-800 font-medium">
                        Drop images for {color.name} here
                      </p>
                      <p className="text-gray-400 text-sm">
                        or click to browse files
                      </p>
                    </div>

                    {/* Uploaded Images */}
                    {color.images.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        {color.images.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={image}
                              alt={`${color.name} ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg border border-gray-200"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(color.id, index)}
                              className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sizes Management */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-semibold text-gray-800 flex items-center">
              <Ruler className="w-5 h-5 mr-2" />
              Product Sizes
            </h4>
            <button
              type="button"
              onClick={createNewSize}
              className="flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-1" />
              Create Size
            </button>
          </div>

          <div className="mb-6">
            <h5 className="text-sm font-medium text-gray-800 mb-3">Available Sizes</h5>
            <div className="flex flex-wrap gap-2">
              {availableSizes.map((size) => (
                <button
                  key={size.id}
                  type="button"
                  onClick={() => addProductSize(size)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={productSizes.some(s => s.id === size.id)}
                >
                  <div className="font-medium">{size.name}</div>
                  <div className="text-xs text-gray-700">{size.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h5 className="text-sm font-medium text-gray-800 mb-3">Selected Sizes</h5>
            {productSizes.length === 0 ? (
              <p className="text-gray-700 text-sm">No sizes selected yet</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {productSizes.map((size) => (
                  <div
                    key={size.id}
                    className="flex items-center px-3 py-2 bg-blue-100 text-blue-800 rounded-lg"
                  >
                    <span className="font-medium mr-2">{size.name}</span>
                    <button
                      type="button"
                      onClick={() => removeProductSize(size.id)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Variants & Pricing */}
        {productColors.length > 0 && productSizes.length > 0 && (
          <div className="bg-gray-50 p-6 rounded-lg">
            <h4 className="text-lg font-semibold text-gray-800 mb-6">Variants & Pricing</h4>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-800">Color</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-800">Size</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-800">Price (TND)</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-800">Quantity</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-800">SKU</th>
                  </tr>
                </thead>
                <tbody>
                  {productColors.map((color) =>
                    productSizes.map((size) => {
                      const variant = productVariants.find(
                        v => v.colorId === color.id && v.sizeId === size.id
                      )
                      return (
                        <tr key={`${color.id}-${size.id}`} className="border-b border-gray-100">
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <div 
                                className="w-4 h-4 rounded-full mr-2 border border-gray-300"
                                style={{ backgroundColor: color.hexCode }}
                              ></div>
                              {color.name}
                            </div>
                          </td>
                          <td className="py-3 px-4">{size.name}</td>
                          <td className="py-3 px-4">
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              value={variant?.price || 0}
                              onChange={(e) => updateVariant(color.id, size.id, 'price', parseFloat(e.target.value) || 0)}
                              className="w-20 px-2 py-1 border border-gray-300 rounded"
                            />
                          </td>
                          <td className="py-3 px-4">
                            <input
                              type="number"
                              min="0"
                              value={variant?.quantity || 0}
                              onChange={(e) => updateVariant(color.id, size.id, 'quantity', parseInt(e.target.value) || 0)}
                              className="w-20 px-2 py-1 border border-gray-300 rounded"
                            />
                          </td>
                          <td className="py-3 px-4">
                            <input
                              type="text"
                              value={variant?.sku || ''}
                              onChange={(e) => updateVariant(color.id, size.id, 'sku', e.target.value)}
                              className="w-32 px-2 py-1 border border-gray-300 rounded text-sm"
                              placeholder="SKU"
                            />
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SEO & Settings */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">SEO & Settings</h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Meta Title
              </label>
              <input
                type="text"
                name="metaTitle"
                defaultValue={initialData?.metaTitle}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="SEO meta title"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Meta Description
              </label>
              <input
                type="text"
                name="metaDescription"
                defaultValue={initialData?.metaDescription}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="SEO meta description"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-8 mt-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                defaultChecked={initialData?.isActive !== false}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-3 text-sm font-medium text-gray-800">Active Product</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isFeatured"
                defaultChecked={initialData?.isFeatured}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-3 text-sm font-medium text-gray-800">Featured Product</span>
            </label>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 text-gray-800 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {isEdit ? 'Update Product' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  )
}