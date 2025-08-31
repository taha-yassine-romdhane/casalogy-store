"use client"

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Loader2, Image, X, Check } from 'lucide-react'
import ImageUpload from './ImageUpload'

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
}

interface FeaturedCategory {
  id?: string
  categoryId: string
  title?: string
  description?: string
  imageUrl?: string
  isActive: boolean
  sortOrder: number
  category?: Category
}

export default function FeaturedCategories() {
  const [featuredCategories, setFeaturedCategories] = useState<FeaturedCategory[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<FeaturedCategory | null>(null)
  const [selectedCategoryId, setSelectedCategoryId] = useState('')
  const [customTitle, setCustomTitle] = useState('')
  const [customDescription, setCustomDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [featuredRes, categoriesRes] = await Promise.all([
        fetch('/api/admin/homepage/featured-categories'),
        fetch('/api/admin/categories')
      ])

      if (featuredRes.ok) {
        const data = await featuredRes.json()
        setFeaturedCategories(data)
      }

      if (categoriesRes.ok) {
        const data = await categoriesRes.json()
        setCategories(data)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!selectedCategoryId) {
      alert('Please select a category')
      return
    }

    try {
      setSaving(true)
      const data = {
        categoryId: selectedCategoryId,
        title: customTitle || undefined,
        description: customDescription || undefined,
        imageUrl: imageUrl || undefined,
        isActive: true,
        sortOrder: featuredCategories.length
      }

      const url = editingCategory?.id 
        ? `/api/admin/homepage/featured-categories?id=${editingCategory.id}`
        : '/api/admin/homepage/featured-categories'

      const response = await fetch(url, {
        method: editingCategory?.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        await fetchData()
        resetForm()
        setShowAddModal(false)
      } else {
        const error = await response.json()
        alert('Error saving category: ' + (error.message || 'Unknown error'))
      }
    } catch (error) {
      alert('Error saving category: ' + (error as Error).message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this featured category?')) return

    try {
      const response = await fetch(`/api/admin/homepage/featured-categories?id=${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchData()
      } else {
        alert('Error deleting category')
      }
    } catch (error) {
      alert('Error deleting category: ' + (error as Error).message)
    }
  }

  const handleEdit = (category: FeaturedCategory) => {
    setEditingCategory(category)
    setSelectedCategoryId(category.categoryId)
    setCustomTitle(category.title || '')
    setCustomDescription(category.description || '')
    setImageUrl(category.imageUrl || '')
    setShowAddModal(true)
  }

  const resetForm = () => {
    setEditingCategory(null)
    setSelectedCategoryId('')
    setCustomTitle('')
    setCustomDescription('')
    setImageUrl('')
  }

  const toggleActive = async (category: FeaturedCategory) => {
    try {
      const response = await fetch(`/api/admin/homepage/featured-categories?id=${category.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...category,
          isActive: !category.isActive
        })
      })

      if (response.ok) {
        await fetchData()
      }
    } catch (error) {
      console.error('Error toggling category:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Featured Categories</h2>
          <p className="text-sm text-gray-600 mt-1">Choose categories to highlight on your homepage</p>
        </div>
        <button 
          onClick={() => {
            resetForm()
            setShowAddModal(true)
          }}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredCategories.map((category) => (
          <div 
            key={category.id} 
            className={`border rounded-lg overflow-hidden ${
              category.isActive ? 'border-gray-200' : 'border-gray-100 opacity-60'
            }`}
          >
            <div className="aspect-video bg-gray-100 relative">
              {category.imageUrl || category.category?.image ? (
                <img 
                  src={category.imageUrl || category.category?.image} 
                  alt={category.title || category.category?.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Image className="w-12 h-12 text-gray-400" />
                </div>
              )}
              <div className="absolute top-2 right-2">
                <button
                  onClick={() => toggleActive(category)}
                  className={`p-1.5 rounded-lg ${
                    category.isActive 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {category.isActive ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                </button>
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="font-medium text-gray-800 mb-1">
                {category.title || category.category?.name}
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                {category.description || category.category?.description || 'No description'}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  Order: {category.sortOrder}
                </span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEdit(category)}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => category.id && handleDelete(category.id)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {editingCategory ? 'Edit Featured Category' : 'Add Featured Category'}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Category *
                </label>
                <select
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={!!editingCategory}
                >
                  <option value="">Choose a category...</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Custom Title (Optional)
                </label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Override category name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Custom Description (Optional)
                </label>
                <textarea
                  value={customDescription}
                  onChange={(e) => setCustomDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Override category description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Image
                </label>
                <ImageUpload
                  value={imageUrl}
                  onChange={setImageUrl}
                  placeholder="Drop category image here or click to browse"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false)
                  resetForm()
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !selectedCategoryId}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  editingCategory ? 'Update' : 'Add'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}