"use client"

import { useState, useEffect } from 'react'
import {
  Image as ImageIcon,
  Upload,
  Search,
  Grid3X3,
  List,
  Trash2,
  Eye,
  Download,
  FileImage,
  Tag,
  X,
  Loader2,
  Copy,
  Check
} from 'lucide-react'

interface ImageFile {
  id: string
  filename: string
  originalName: string
  url: string
  size: number
  type: string
  uploadedAt: string
}

export default function ImagesPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [previewImage, setPreviewImage] = useState<ImageFile | null>(null)
  const [images, setImages] = useState<ImageFile[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)

  useEffect(() => {
    fetchImages()
  }, [])

  const fetchImages = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/images')
      if (response.ok) {
        const data = await response.json()
        setImages(data)
      }
    } catch (error) {
      console.error('Error fetching images:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredImages = images.filter(image => {
    const matchesSearch = image.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         image.filename.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleImageSelect = (imageId: string) => {
    setSelectedImages(prev =>
      prev.includes(imageId)
        ? prev.filter(id => id !== imageId)
        : [...prev, imageId]
    )
  }

  const handleBulkDelete = async () => {
    if (selectedImages.length > 0) {
      for (const filename of selectedImages) {
        await fetch(`/api/admin/images?filename=${encodeURIComponent(filename)}`, {
          method: 'DELETE'
        })
      }
      setSelectedImages([])
      fetchImages()
    }
  }

  const handleDelete = async (filename: string) => {
    try {
      const response = await fetch(`/api/admin/images?filename=${encodeURIComponent(filename)}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        fetchImages()
      }
    } catch (error) {
      console.error('Error deleting image:', error)
    }
    setDeleteConfirm(null)
  }

  const handleUpload = async (files: FileList) => {
    setUploading(true)
    for (const file of Array.from(files)) {
      const formData = new FormData()
      formData.append('file', file)

      try {
        await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData
        })
      } catch (error) {
        console.error('Error uploading file:', error)
      }
    }
    setUploading(false)
    setShowUploadModal(false)
    fetchImages()
  }

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url)
    setCopiedUrl(url)
    setTimeout(() => setCopiedUrl(null), 2000)
  }

  const totalStorage = images.reduce((acc, img) => acc + img.size, 0)

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Image Management</h1>
          <p className="text-gray-600">Manage your uploaded images</p>
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Images</p>
              <p className="text-2xl font-bold text-gray-800">{images.length}</p>
            </div>
            <ImageIcon className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Storage</p>
              <p className="text-2xl font-bold text-gray-800">{formatFileSize(totalStorage)}</p>
            </div>
            <FileImage className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Selected</p>
              <p className="text-2xl font-bold text-gray-800">{selectedImages.length}</p>
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
                placeholder="Search images by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex gap-4">
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

      {/* Empty State */}
      {filteredImages.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
          <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">No images found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm ? 'No images match your search.' : 'Upload some images to get started.'}
          </p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Images
          </button>
        </div>
      )}

      {/* Images Display */}
      {filteredImages.length > 0 && viewMode === 'grid' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredImages.map((image) => (
            <div key={image.id} className="bg-white rounded-lg shadow-sm border overflow-hidden group">
              <div className="relative aspect-square bg-gray-100">
                <img
                  src={image.url}
                  alt={image.originalName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.png'
                  }}
                />

                {/* Selection Checkbox */}
                <div className="absolute top-2 left-2">
                  <input
                    type="checkbox"
                    checked={selectedImages.includes(image.filename)}
                    onChange={() => handleImageSelect(image.filename)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                  />
                </div>

                {/* Action Buttons */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <button
                    onClick={() => setPreviewImage(image)}
                    className="p-1.5 bg-white/90 rounded text-gray-600 hover:text-blue-600"
                    title="Preview"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => copyToClipboard(image.url)}
                    className="p-1.5 bg-white/90 rounded text-gray-600 hover:text-green-600"
                    title="Copy URL"
                  >
                    {copiedUrl === image.url ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(image.filename)}
                    className="p-1.5 bg-white/90 rounded text-gray-600 hover:text-red-600"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-3">
                <h3 className="text-sm font-medium text-gray-800 truncate" title={image.originalName}>
                  {image.originalName}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {formatFileSize(image.size)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredImages.length > 0 && viewMode === 'list' && (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedImages.length === filteredImages.length && filteredImages.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedImages(filteredImages.map(img => img.filename))
                        } else {
                          setSelectedImages([])
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Preview
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Size
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Uploaded
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredImages.map((image) => (
                  <tr key={image.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedImages.includes(image.filename)}
                        onChange={() => handleImageSelect(image.filename)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <img
                        src={image.url}
                        alt={image.originalName}
                        className="w-12 h-12 object-cover rounded-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.png'
                        }}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-gray-800">{image.originalName}</div>
                      <div className="text-xs text-gray-500">{image.type}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {formatFileSize(image.size)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {formatDate(image.uploadedAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setPreviewImage(image)}
                          className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                          title="Preview"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => copyToClipboard(image.url)}
                          className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-50"
                          title="Copy URL"
                        >
                          {copiedUrl === image.url ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                        <a
                          href={image.url}
                          download={image.originalName}
                          className="text-purple-600 hover:text-purple-800 p-1 rounded hover:bg-purple-50"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => setDeleteConfirm(image.filename)}
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

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-800">Upload Images</h3>
              <button onClick={() => setShowUploadModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault()
                if (e.dataTransfer.files.length > 0) {
                  handleUpload(e.dataTransfer.files)
                }
              }}
            >
              {uploading ? (
                <div className="flex flex-col items-center">
                  <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-3" />
                  <p className="text-gray-600">Uploading...</p>
                </div>
              ) : (
                <>
                  <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-2">Drag and drop images here</p>
                  <p className="text-sm text-gray-500 mb-4">or</p>
                  <label className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          handleUpload(e.target.files)
                        }
                      }}
                    />
                    Browse Files
                  </label>
                  <p className="text-xs text-gray-500 mt-4">
                    Supported: JPEG, PNG, GIF, WebP (max 5MB each)
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={() => setPreviewImage(null)}>
          <div className="max-w-4xl max-h-[90vh] relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={previewImage.url}
              alt={previewImage.originalName}
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
            />
            <div className="mt-2 text-white text-center">
              <p className="font-medium">{previewImage.originalName}</p>
              <p className="text-sm text-gray-300">{formatFileSize(previewImage.size)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Delete Image</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this image? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
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
