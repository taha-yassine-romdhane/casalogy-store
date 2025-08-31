"use client"

import { useState } from 'react'
import { 
  Image as ImageIcon, 
  Upload, 
  Search, 
  Filter,
  Grid3X3,
  List,
  Edit,
  Trash2,
  Eye,
  Download,
  MoreHorizontal,
  FileImage,
  Tag
} from 'lucide-react'

interface ImageFile {
  id: string
  filename: string
  originalName: string
  url: string
  size: number
  type: string
  category: string
  tags: string[]
  uploadedAt: string
  usedInProducts: number
}

export default function ImagesPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  // Sample images data
  const [images] = useState<ImageFile[]>([
    {
      id: '1',
      filename: 'scrubs-navy-front.jpg',
      originalName: 'Medical Scrubs Navy Front View.jpg',
      url: '/images/products/scrubs-navy-front.jpg',
      size: 245000,
      type: 'image/jpeg',
      category: 'product',
      tags: ['scrubs', 'navy', 'front-view', 'medical-wear'],
      uploadedAt: '2024-02-15T10:30:00Z',
      usedInProducts: 3
    },
    {
      id: '2',
      filename: 'lab-coat-white-detail.jpg',
      originalName: 'Laboratory Coat White Detail.jpg',
      url: '/images/products/lab-coat-white-detail.jpg',
      size: 189000,
      type: 'image/jpeg',
      category: 'product',
      tags: ['lab-coat', 'white', 'detail', 'medical-wear'],
      uploadedAt: '2024-02-14T15:45:00Z',
      usedInProducts: 2
    },
    {
      id: '3',
      filename: 'stethoscope-banner.jpg',
      originalName: 'Stethoscope Marketing Banner.jpg',
      url: '/images/marketing/stethoscope-banner.jpg',
      size: 512000,
      type: 'image/jpeg',
      category: 'marketing',
      tags: ['stethoscope', 'banner', 'marketing', 'hero'],
      uploadedAt: '2024-02-13T09:15:00Z',
      usedInProducts: 0
    },
    {
      id: '4',
      filename: 'surgical-mask-blue.png',
      originalName: 'Surgical Mask Blue Transparent.png',
      url: '/images/products/surgical-mask-blue.png',
      size: 95000,
      type: 'image/png',
      category: 'product',
      tags: ['surgical-mask', 'blue', 'ppe', 'transparent'],
      uploadedAt: '2024-02-12T14:20:00Z',
      usedInProducts: 5
    },
    {
      id: '5',
      filename: 'medical-team-photo.jpg',
      originalName: 'Medical Team Professional Photo.jpg',
      url: '/images/about/medical-team-photo.jpg',
      size: 678000,
      type: 'image/jpeg',
      category: 'about',
      tags: ['team', 'medical', 'professional', 'about-us'],
      uploadedAt: '2024-02-11T11:00:00Z',
      usedInProducts: 0
    },
    {
      id: '6',
      filename: 'nursing-shoes-white.jpg',
      originalName: 'Nursing Shoes White Comfortable.jpg',
      url: '/images/products/nursing-shoes-white.jpg',
      size: 156000,
      type: 'image/jpeg',
      category: 'product',
      tags: ['shoes', 'nursing', 'white', 'comfortable'],
      uploadedAt: '2024-02-10T16:30:00Z',
      usedInProducts: 1
    }
  ])

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'product', label: 'Product Images' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'about', label: 'About Us' },
    { value: 'blog', label: 'Blog' }
  ]

  const filteredImages = images.filter(image => {
    const matchesSearch = image.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         image.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = !selectedCategory || image.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const handleImageSelect = (imageId: string) => {
    setSelectedImages(prev => 
      prev.includes(imageId) 
        ? prev.filter(id => id !== imageId)
        : [...prev, imageId]
    )
  }

  const handleBulkDelete = () => {
    if (selectedImages.length > 0) {
      console.log('Bulk delete images:', selectedImages)
      setSelectedImages([])
    }
  }

  const handleDelete = (imageId: string) => {
    console.log('Delete image:', imageId)
    setDeleteConfirm(null)
  }

  const getCategoryBadge = (category: string) => {
    const colors = {
      product: 'bg-blue-100 text-blue-800',
      marketing: 'bg-purple-100 text-purple-800',
      about: 'bg-green-100 text-green-800',
      blog: 'bg-yellow-100 text-yellow-800'
    }
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`}>
        {category}
      </span>
    )
  }

  const getUsageBadge = (count: number) => (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
      count > 0
        ? 'bg-green-100 text-green-800'
        : 'bg-gray-100 text-gray-600'
    }`}>
      {count > 0 ? `Used in ${count} product${count !== 1 ? 's' : ''}` : 'Unused'}
    </span>
  )

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Image Management</h1>
          <p className="text-gray-800">Organize and manage your store images</p>
        </div>
        <div className="flex gap-2">
          {selectedImages.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Selected ({selectedImages.length})
            </button>
          )}
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Images
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-800">Total Images</p>
              <p className="text-2xl font-bold text-gray-800">{images.length}</p>
            </div>
            <ImageIcon className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-800">Product Images</p>
              <p className="text-2xl font-bold text-gray-800">
                {images.filter(img => img.category === 'product').length}
              </p>
            </div>
            <FileImage className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-800">Total Storage</p>
              <p className="text-2xl font-bold text-gray-800">
                {formatFileSize(images.reduce((acc, img) => acc + img.size, 0))}
              </p>
            </div>
            <FileImage className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-800">Images in Use</p>
              <p className="text-2xl font-bold text-gray-800">
                {images.filter(img => img.usedInProducts > 0).length}
              </p>
            </div>
            <Tag className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search images by name or tags..."
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
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
            
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Images Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {filteredImages.map((image) => (
            <div key={image.id} className="bg-white rounded-lg shadow-sm border overflow-hidden group">
              <div className="relative aspect-square bg-gray-100">
                <div className="absolute inset-2 bg-gray-200 rounded-lg flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                </div>
                
                {/* Selection Checkbox */}
                <div className="absolute top-2 left-2">
                  <input
                    type="checkbox"
                    checked={selectedImages.includes(image.id)}
                    onChange={() => handleImageSelect(image.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>
                
                {/* Action Buttons */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <button className="p-1 bg-white/90 rounded text-gray-600 hover:text-blue-600">
                    <Eye className="w-3 h-3" />
                  </button>
                  <button className="p-1 bg-white/90 rounded text-gray-600 hover:text-green-600">
                    <Download className="w-3 h-3" />
                  </button>
                  <button 
                    onClick={() => setDeleteConfirm(image.id)}
                    className="p-1 bg-white/90 rounded text-gray-600 hover:text-red-600"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
                
                {/* Category Badge */}
                <div className="absolute bottom-2 left-2">
                  {getCategoryBadge(image.category)}
                </div>
              </div>
              
              <div className="p-3">
                <h3 className="text-sm font-medium text-gray-800 truncate" title={image.originalName}>
                  {image.originalName}
                </h3>
                <p className="text-xs text-gray-600 mt-1">
                  {formatFileSize(image.size)} • {image.type.split('/')[1].toUpperCase()}
                </p>
                <div className="mt-2">
                  {getUsageBadge(image.usedInProducts)}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedImages.length === filteredImages.length && filteredImages.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedImages(filteredImages.map(img => img.id))
                        } else {
                          setSelectedImages([])
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Usage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Uploaded
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredImages.map((image) => (
                  <tr key={image.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedImages.includes(image.id)}
                        onChange={() => handleImageSelect(image.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 text-gray-400" />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-800">{image.originalName}</div>
                      <div className="text-sm text-gray-600">{image.filename}</div>
                    </td>
                    <td className="px-6 py-4">
                      {getCategoryBadge(image.category)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      <div>{formatFileSize(image.size)}</div>
                      <div className="text-xs text-gray-600">{image.type}</div>
                    </td>
                    <td className="px-6 py-4">
                      {getUsageBadge(image.usedInProducts)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {formatDate(image.uploadedAt)}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50" title="View">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-50" title="Download">
                          <Download className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-800 p-1 rounded hover:bg-gray-50" title="Edit">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => setDeleteConfirm(image.id)}
                          className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50" 
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Delete Image</h3>
            <p className="text-gray-800 mb-6">
              Are you sure you want to delete this image? This action cannot be undone.
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
    </div>
  )
}