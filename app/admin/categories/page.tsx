"use client"

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Eye, Search, FolderTree, Image, Loader2 } from 'lucide-react'

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  parentId?: string
  isActive: boolean
  sortOrder: number
  productCount?: number
  createdAt: string
  updatedAt: string
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch categories from database
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/admin/categories')
        if (!response.ok) throw new Error('Failed to fetch categories')
        const data = await response.json()
        setCategories(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch categories')
      } finally {
        setLoading(false)
      }
    }
    
    fetchCategories()
  }, [])

  const handleAddCategory = async (categoryData: { name: string; description?: string }) => {
    try {
      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData)
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to add category')
      }
      
      const newCategory = await response.json()
      setCategories(prev => [...prev, newCategory])
      setShowAddModal(false)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to add category')
    }
  }

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete category')
      }
      
      setCategories(prev => prev.filter(c => c.id !== categoryId))
      setDeleteConfirm(null)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete category')
      setDeleteConfirm(null)
    }
  }

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const getStatusBadge = (isActive: boolean) => (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
      isActive 
        ? 'bg-green-100 text-green-800' 
        : 'bg-red-100 text-red-800'
    }`}>
      {isActive ? 'Active' : 'Inactive'}
    </span>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading categories...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">⚠️</div>
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Categories Management</h1>
            <p className="text-gray-600">Organize your medical products into categories</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
            <p className="text-sm text-gray-500">Total Categories</p>
          </div>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white hover:shadow-sm"
            />
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Category
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCategories.map((category) => (
          <div key={category.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 hover:border-blue-200">
            <div className="h-40 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
              <FolderTree className="w-12 h-12 text-blue-400" />
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{category.name}</h3>
                  <p className="text-xs text-gray-500 font-mono">{category.slug}</p>
                </div>
                {getStatusBadge(category.isActive)}
              </div>
              
              {category.description && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{category.description}</p>
              )}
              
              <div className="flex items-center justify-between text-sm mb-4">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center text-blue-600">
                    <span className="font-semibold">{category.productCount || 0}</span>
                    <span className="ml-1 text-gray-500">products</span>
                  </span>
                  <span className="text-gray-400">#{category.sortOrder}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="text-xs text-gray-500">
                  {new Date(category.createdAt).toLocaleDateString()}
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setEditingCategory(category)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit Category"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(category.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredCategories.length === 0 && (
        <div className="text-center py-16">
          <div className="bg-white rounded-2xl p-12 max-w-md mx-auto">
            <FolderTree className="w-16 h-16 text-gray-300 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-700 mb-3">No categories found</h3>
            <p className="text-gray-500 mb-8">
              {searchTerm ? 'Try adjusting your search terms' : 'Get started by creating your first category to organize your medical products'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-lg transition-all duration-200"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Category
              </button>
            )}
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {showAddModal && (
        <AddCategoryModal 
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddCategory}
        />
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Delete Category</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this category? This action cannot be undone and will affect all products in this category.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleDeleteCategory(deleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
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

// Add Category Modal Component
function AddCategoryModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (data: any) => void }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    
    setSubmitting(true)
    await onSubmit({
      name: name.trim(),
      description: description.trim() || undefined
    })
    setSubmitting(false)
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl max-w-lg w-full mx-4 shadow-2xl">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">Add New Category</h3>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Medical Scrubs, Lab Coats"
              required
            />
            <p className="text-xs text-gray-500 mt-1">The category slug will be generated automatically</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Brief description of the category..."
            />
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start">
              <div className="text-blue-600 text-sm">
                💡 <strong>Tip:</strong> Categories help organize your medical products and make them easier for customers to find. Popular categories include Scrubs, Lab Coats, Stethoscopes, and Medical Footwear.
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !name.trim()}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Create Category
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}