"use client"

import { useState, useEffect } from 'react'
import { 
  Palette, 
  Shirt, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  MoreHorizontal,
  Circle,
  Square,
  Loader2
} from 'lucide-react'

interface Color {
  id: string
  name: string
  hexCode: string
  pantoneCode?: string
  isActive: boolean
  isSystem: boolean
  sortOrder: number
  productCount?: number
  createdAt: string
  updatedAt: string
}

interface Size {
  id: string
  name: string
  label: string
  category: string
  isActive: boolean
  sortOrder: number
  productCount?: number
  createdAt: string
  updatedAt: string
}

export default function VariantsPage() {
  const [activeTab, setActiveTab] = useState<'colors' | 'sizes'>('colors')
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddColorModal, setShowAddColorModal] = useState(false)
  const [showAddSizeModal, setShowAddSizeModal] = useState(false)
  const [editingColor, setEditingColor] = useState<Color | null>(null)
  const [editingSize, setEditingSize] = useState<Size | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [colors, setColors] = useState<Color[]>([])
  const [sizes, setSizes] = useState<Size[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch colors and sizes from database
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Fetch colors
        const colorsResponse = await fetch('/api/admin/colors')
        if (!colorsResponse.ok) throw new Error('Failed to fetch colors')
        const colorsData = await colorsResponse.json()
        
        // Fetch sizes
        const sizesResponse = await fetch('/api/admin/sizes')
        if (!sizesResponse.ok) throw new Error('Failed to fetch sizes')
        const sizesData = await sizesResponse.json()
        
        setColors(colorsData)
        setSizes(sizesData)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data')
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])

  const filteredColors = colors.filter(color =>
    color.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredSizes = sizes.filter(size =>
    size.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    size.label.toLowerCase().includes(searchTerm.toLowerCase())
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

  const getProductCountBadge = (count: number = 0) => (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
      count > 0
        ? 'bg-blue-100 text-blue-800'
        : 'bg-gray-100 text-gray-600'
    }`}>
      {count} product{count !== 1 ? 's' : ''}
    </span>
  )

  const handleAddColor = async (colorData: { name: string; hexCode: string; pantoneCode?: string }) => {
    try {
      const response = await fetch('/api/admin/colors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(colorData)
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to add color')
      }
      
      const newColor = await response.json()
      setColors(prev => [...prev, { ...newColor, productCount: 0, updatedAt: newColor.createdAt }])
      setShowAddColorModal(false)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to add color')
    }
  }

  const handleAddSize = async (sizeData: { name: string; label: string; category: string }) => {
    try {
      const response = await fetch('/api/admin/sizes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sizeData)
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to add size')
      }
      
      const newSize = await response.json()
      setSizes(prev => [...prev, { ...newSize, productCount: 0, updatedAt: newSize.createdAt }])
      setShowAddSizeModal(false)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to add size')
    }
  }

  const handleEditColor = async (colorData: { id: string; name: string; hexCode: string; pantoneCode?: string }) => {
    try {
      const response = await fetch(`/api/admin/colors/${colorData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: colorData.name,
          hexCode: colorData.hexCode,
          pantoneCode: colorData.pantoneCode
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update color')
      }
      
      const updatedColor = await response.json()
      setColors(prev => prev.map(c => c.id === colorData.id ? { ...updatedColor, productCount: c.productCount, updatedAt: updatedColor.updatedAt } : c))
      setEditingColor(null)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update color')
    }
  }

  const handleEditSize = async (sizeData: { id: string; name: string; label: string; category: string }) => {
    try {
      const response = await fetch(`/api/admin/sizes/${sizeData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: sizeData.name,
          label: sizeData.label,
          category: sizeData.category
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update size')
      }
      
      const updatedSize = await response.json()
      setSizes(prev => prev.map(s => s.id === sizeData.id ? { ...updatedSize, productCount: s.productCount, updatedAt: updatedSize.updatedAt } : s))
      setEditingSize(null)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update size')
    }
  }

  const handleDeleteColor = async (colorId: string) => {
    try {
      const response = await fetch(`/api/admin/colors/${colorId}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete color')
      }
      
      setColors(prev => prev.filter(c => c.id !== colorId))
      setDeleteConfirm(null)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete color')
      setDeleteConfirm(null)
    }
  }

  const handleDeleteSize = async (sizeId: string) => {
    try {
      const response = await fetch(`/api/admin/sizes/${sizeId}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete size')
      }
      
      setSizes(prev => prev.filter(s => s.id !== sizeId))
      setDeleteConfirm(null)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete size')
      setDeleteConfirm(null)
    }
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-96">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading variants data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 flex items-center justify-center min-h-96">
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
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Product Variants</h1>
            <p className="text-gray-600">Manage colors and sizes for your medical wear collection</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowAddColorModal(true)}
              className="flex items-center px-4 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Palette className="w-5 h-5 mr-2" />
              Add Color
            </button>
            <button
              onClick={() => setShowAddSizeModal(true)}
              className="flex items-center px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Shirt className="w-5 h-5 mr-2" />
              Add Size
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Colors</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{colors.length}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-xl">
              <Palette className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Colors</p>
              <p className="text-3xl font-bold text-green-600 mt-1">
                {colors.filter(c => c.isActive).length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <Circle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Sizes</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{sizes.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <Shirt className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Sizes</p>
              <p className="text-3xl font-bold text-blue-600 mt-1">
                {sizes.filter(s => s.isActive).length}
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-xl">
              <Square className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab('colors')}
              className={`py-5 px-8 font-semibold text-sm border-b-3 transition-all duration-200 ${
                activeTab === 'colors'
                  ? 'border-purple-500 text-purple-600 bg-purple-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center">
                <Palette className="w-5 h-5 mr-3" />
                Colors
                <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                  {colors.length}
                </span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('sizes')}
              className={`py-5 px-8 font-semibold text-sm border-b-3 transition-all duration-200 ${
                activeTab === 'sizes'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center">
                <Shirt className="w-5 h-5 mr-3" />
                Sizes
                <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                  {sizes.length}
                </span>
              </div>
            </button>
          </nav>
        </div>

        {/* Search Bar */}
        <div className="p-6 border-b border-gray-200">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
            />
          </div>
        </div>

        {/* Colors Tab */}
        {activeTab === 'colors' && (
          <div className="overflow-hidden">
            {filteredColors.length === 0 ? (
              <div className="text-center py-16">
                <Palette className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">No colors found</h3>
                <p className="text-gray-500">
                  {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first color'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {filteredColors.map((color) => (
                  <div key={color.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:border-purple-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-12 h-12 rounded-xl shadow-sm border-2 border-white"
                          style={{ backgroundColor: color.hexCode }}
                        />
                        <div>
                          <h3 className="font-semibold text-gray-900">{color.name}</h3>
                          <p className="text-sm text-gray-500 font-mono">{color.hexCode}</p>
                          {color.pantoneCode && (
                            <p className="text-xs text-gray-400">Pantone: {color.pantoneCode}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {color.isSystem && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-lg">
                            System
                          </span>
                        )}
                        {getStatusBadge(color.isActive)}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {getProductCountBadge(color.productCount || 0)}
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setEditingColor(color)}
                          className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          title="Edit Color"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        {!color.isSystem && (
                          <button
                            onClick={() => setDeleteConfirm(color.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Color"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Sizes Tab */}
        {activeTab === 'sizes' && (
          <div className="overflow-hidden">
            {filteredSizes.length === 0 ? (
              <div className="text-center py-16">
                <Shirt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">No sizes found</h3>
                <p className="text-gray-500">
                  {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first size'}
                </p>
              </div>
            ) : (
              <div className="p-6">
                {/* Group sizes by category */}
                {['UNISEX', 'WOMEN', 'MEN', 'PETITE', 'TALL'].map(category => {
                  const categorySizes = filteredSizes.filter(size => size.category === category)
                  if (categorySizes.length === 0) return null
                  
                  return (
                    <div key={category} className="mb-8 last:mb-0">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Shirt className="w-5 h-5 mr-2 text-blue-600" />
                        {category} ({categorySizes.length})
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {categorySizes.map((size) => (
                          <div key={size.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all duration-200 hover:border-blue-200">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h4 className="font-bold text-xl text-gray-900">{size.name}</h4>
                                <p className="text-sm text-gray-600">{size.label}</p>
                              </div>
                              {getStatusBadge(size.isActive)}
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                {getProductCountBadge(size.productCount || 0)}
                                <span className="text-xs text-gray-400">#{size.sortOrder}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => setEditingSize(size)}
                                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="Edit Size"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setDeleteConfirm(size.id)}
                                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Delete Size"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Color Modal */}
      {showAddColorModal && (
        <AddColorModal 
          onClose={() => setShowAddColorModal(false)}
          onSubmit={handleAddColor}
        />
      )}

      {/* Edit Color Modal */}
      {editingColor && (
        <EditColorModal 
          color={editingColor}
          onClose={() => setEditingColor(null)}
          onSubmit={handleEditColor}
        />
      )}

      {/* Add Size Modal */}
      {showAddSizeModal && (
        <AddSizeModal 
          onClose={() => setShowAddSizeModal(false)}
          onSubmit={handleAddSize}
        />
      )}

      {/* Edit Size Modal */}
      {editingSize && (
        <EditSizeModal 
          size={editingSize}
          onClose={() => setEditingSize(null)}
          onSubmit={handleEditSize}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Delete {activeTab === 'colors' ? 'Color' : 'Size'}
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this {activeTab === 'colors' ? 'color' : 'size'}? 
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => activeTab === 'colors' ? handleDeleteColor(deleteConfirm) : handleDeleteSize(deleteConfirm)}
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

// Helper functions for color conversions
const hexToHsl = (hex: string): [number, number, number] => {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0, s = 0, l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
    }
    h /= 6
  }

  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)]
}

const hslToHex = (h: number, s: number, l: number): string => {
  h = h / 360
  s = s / 100
  l = l / 100

  const hue2rgb = (p: number, q: number, t: number): number => {
    if (t < 0) t += 1
    if (t > 1) t -= 1
    if (t < 1/6) return p + (q - p) * 6 * t
    if (t < 1/2) return q
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
    return p
  }

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s
  const p = 2 * l - q
  const r = hue2rgb(p, q, h + 1/3)
  const g = hue2rgb(p, q, h)
  const b = hue2rgb(p, q, h - 1/3)

  const toHex = (c: number) => {
    const hex = Math.round(c * 255).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

// Add Color Modal Component
function AddColorModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (data: any) => void }) {
  const [name, setName] = useState('')
  const [hexCode, setHexCode] = useState('#4169E1')
  const [pantoneCode, setPantoneCode] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('blues')
  const [activeTab, setActiveTab] = useState<'presets' | 'custom' | 'variations'>('presets')
  
  // HSL controls
  const [hue, setHue] = useState(225)
  const [saturation, setSaturation] = useState(73)
  const [lightness, setLightness] = useState(57)
  
  // Base color for variations
  const [baseColor, setBaseColor] = useState('#4169E1')

  // Update HSL values when hex changes
  const updateHslFromHex = (hex: string) => {
    if (hex.match(/^#[0-9A-Fa-f]{6}$/)) {
      const [h, s, l] = hexToHsl(hex)
      setHue(h)
      setSaturation(s)
      setLightness(l)
    }
  }

  // Update hex when HSL changes
  const updateHexFromHsl = () => {
    const newHex = hslToHex(hue, saturation, lightness)
    setHexCode(newHex)
  }

  // Generate color variations
  const generateVariations = (baseHex: string) => {
    const [baseH, baseS, baseL] = hexToHsl(baseHex)
    return [
      { name: 'Lighter', hex: hslToHex(baseH, baseS, Math.min(baseL + 20, 95)), desc: '+20% lightness' },
      { name: 'Light', hex: hslToHex(baseH, baseS, Math.min(baseL + 10, 90)), desc: '+10% lightness' },
      { name: 'Original', hex: baseHex, desc: 'base color' },
      { name: 'Dark', hex: hslToHex(baseH, baseS, Math.max(baseL - 10, 10)), desc: '-10% lightness' },
      { name: 'Darker', hex: hslToHex(baseH, baseS, Math.max(baseL - 20, 5)), desc: '-20% lightness' },
      { name: 'Saturated', hex: hslToHex(baseH, Math.min(baseS + 20, 100), baseL), desc: '+20% saturation' },
      { name: 'Muted', hex: hslToHex(baseH, Math.max(baseS - 30, 0), baseL), desc: '-30% saturation' },
      { name: 'Cool', hex: hslToHex((baseH + 30) % 360, baseS, baseL), desc: '+30° hue' },
      { name: 'Warm', hex: hslToHex((baseH - 30 + 360) % 360, baseS, baseL), desc: '-30° hue' }
    ]
  }

  // Medical color palette organized by categories
  const colorPalettes = {
    blues: [
      { name: 'Navy Blue', hex: '#003366', pantone: '533C' },
      { name: 'Royal Blue', hex: '#4169E1', pantone: '286C' },
      { name: 'Ceil Blue', hex: '#8AC5D8', pantone: '5415C' },
      { name: 'Caribbean Blue', hex: '#00CED1', pantone: '3125C' },
      { name: 'Galaxy Blue', hex: '#2C5985', pantone: '7469C' },
      { name: 'Powder Blue', hex: '#B0E0E6', pantone: '656C' },
      { name: 'Slate Blue', hex: '#6A5ACD', pantone: '2725C' },
      { name: 'Turquoise', hex: '#40E0D0', pantone: '3252C' },
      { name: 'Deep Turquoise', hex: '#00B4D8', pantone: '3145C' },
      { name: 'Lagoon Blue', hex: '#006A8E', pantone: '315C' },
      { name: 'Deep Lagoon', hex: '#003F5C', pantone: '3035C' },
      { name: 'Tropical Teal', hex: '#17A2B8', pantone: '632C' },
      { name: 'Ocean Blue', hex: '#0077BE', pantone: '3005C' },
      { name: 'Aqua Marine', hex: '#7FDBFF', pantone: '3115C' },
      { name: 'Peacock Blue', hex: '#005F73', pantone: '3155C' },
      { name: 'Steel Blue', hex: '#4682B4', pantone: '5415C' },
      { name: 'Whispy Blue', hex: '#E8F4FD', pantone: '656C' }
    ],
    greens: [
      { name: 'Surgical Green', hex: '#7CB342', pantone: '7489C' },
      { name: 'Hunter Green', hex: '#355E3B', pantone: '5535C' },
      { name: 'Sage Green', hex: '#87A96B', pantone: '5783C' },
      { name: 'Olive', hex: '#6B8E23', pantone: '5757C' },
      { name: 'Mint', hex: '#98FB98', pantone: '351C' },
      { name: 'Emerald', hex: '#50C878', pantone: '3415C' },
      { name: 'Seafoam', hex: '#93E9BE', pantone: '332C' },
      { name: 'Teal', hex: '#008B8B', pantone: '3155C' },
      { name: 'Forest Green', hex: '#228B22', pantone: '356C' },
      { name: 'Pine Green', hex: '#01796F', pantone: '569C' },
      { name: 'Jade Green', hex: '#00A86B', pantone: '3405C' },
      { name: 'Kelly Green', hex: '#4CBB17', pantone: '354C' },
      { name: 'Lime Green', hex: '#32CD32', pantone: '375C' },
      { name: 'Spring Green', hex: '#00FF7F', pantone: '354C' }
    ],
    neutrals: [
      { name: 'Black', hex: '#000000', pantone: 'Black C' },
      { name: 'Charcoal', hex: '#36454F', pantone: '432C' },
      { name: 'Pewter Gray', hex: '#91989F', pantone: '429C' },
      { name: 'White', hex: '#FFFFFF', pantone: 'White' },
      { name: 'Light Gray', hex: '#D3D3D3', pantone: '420C' },
      { name: 'Medium Gray', hex: '#808080', pantone: '424C' },
      { name: 'Dark Gray', hex: '#2F2F2F', pantone: '426C' },
      { name: 'Silver', hex: '#C0C0C0', pantone: '877C' },
      { name: 'Ash Gray', hex: '#B2BEB5', pantone: '5665C' },
      { name: 'Stone Gray', hex: '#928E85', pantone: 'Warm Gray 8C' }
    ],
    accents: [
      { name: 'Wine', hex: '#722F37', pantone: '7428C' },
      { name: 'Burgundy', hex: '#800020', pantone: '7421C' },
      { name: 'Plum', hex: '#8E4585', pantone: '2583C' },
      { name: 'Hot Pink', hex: '#EC4899', pantone: '219C' },
      { name: 'Purple', hex: '#7C3AED', pantone: '2665C' },
      { name: 'Lavender', hex: '#E6E6FA', pantone: '2635C' },
      { name: 'Coral', hex: '#FF7F50', pantone: '16-1546' },
      { name: 'Peach', hex: '#FFCBA4', pantone: '162C' },
      { name: 'Mauve', hex: '#E0B4D6', pantone: '2573C' },
      { name: 'Rose Gold', hex: '#E8B4CB', pantone: '197C' },
      { name: 'Deep Red', hex: '#8B0000', pantone: '18-1763' },
      { name: 'Crimson', hex: '#DC143C', pantone: '18-1664' }
    ]
  }

  // Effect handlers
  const handlePresetColorClick = (color: { name: string; hex: string; pantone: string }) => {
    setName(color.name)
    setHexCode(color.hex)
    setPantoneCode(color.pantone)
    updateHslFromHex(color.hex)
  }

  const handleHexChange = (newHex: string) => {
    setHexCode(newHex)
    updateHslFromHex(newHex)
  }

  const handleHslChange = (newH: number, newS: number, newL: number) => {
    setHue(newH)
    setSaturation(newS)
    setLightness(newL)
    const newHex = hslToHex(newH, newS, newL)
    setHexCode(newHex)
  }

  const handleVariationClick = (variation: { name: string; hex: string; desc: string }) => {
    setHexCode(variation.hex)
    updateHslFromHex(variation.hex)
    if (!name.includes(variation.name) && variation.name !== 'Original') {
      setName(`${variation.name} ${name || 'Color'}`.trim())
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !hexCode.match(/^#[0-9A-Fa-f]{6}$/)) return
    
    setSubmitting(true)
    await onSubmit({
      name: name.trim(),
      hexCode: hexCode.toLowerCase(),
      pantoneCode: pantoneCode.trim() || undefined
    })
    setSubmitting(false)
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-auto shadow-2xl">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">Advanced Color Creator</h3>
          <p className="text-sm text-gray-600 mt-1">Create colors with presets, custom controls, or generate variations</p>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex">
            {[
              { id: 'presets', label: '🎨 Presets', desc: 'Medical color presets' },
              { id: 'custom', label: '🎛️ Custom', desc: 'HSL color controls' },
              { id: 'variations', label: '✨ Variations', desc: 'Generate from base color' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600 bg-purple-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="text-center">
                  <div className="font-semibold">{tab.label}</div>
                  <div className="text-xs opacity-75">{tab.desc}</div>
                </div>
              </button>
            ))}
          </nav>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
          {/* Left Column - Content based on active tab */}
          <div className="lg:col-span-2">
            {/* Presets Tab */}
            {activeTab === 'presets' && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Medical Color Presets</h4>
                
                {/* Category tabs */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {Object.keys(colorPalettes).map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                        selectedCategory === category
                          ? 'bg-purple-100 text-purple-700 border border-purple-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                {/* Color grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
                  {colorPalettes[selectedCategory as keyof typeof colorPalettes].map((color, index) => (
                    <button
                      key={index}
                      onClick={() => handlePresetColorClick(color)}
                      className="group p-3 bg-gray-50 rounded-xl hover:bg-gray-100 hover:shadow-md transition-all duration-200 text-left border-2 hover:border-purple-200"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-lg shadow-sm border border-gray-200 flex-shrink-0"
                          style={{ backgroundColor: color.hex }}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-900 text-sm truncate">{color.name}</p>
                          <p className="text-xs font-mono text-gray-600">{color.hex}</p>
                          <p className="text-xs text-gray-500">Pantone {color.pantone}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Custom HSL Controls Tab */}
            {activeTab === 'custom' && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Custom Color Controls</h4>
                
                <div className="space-y-6">
                  {/* Hue Slider */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hue: {hue}°
                    </label>
                    <div className="relative">
                      <input
                        type="range"
                        min="0"
                        max="360"
                        value={hue}
                        onChange={(e) => handleHslChange(parseInt(e.target.value), saturation, lightness)}
                        className="w-full h-6 rounded-lg appearance-none cursor-pointer"
                        style={{
                          background: 'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)'
                        }}
                      />
                    </div>
                  </div>

                  {/* Saturation Slider */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Saturation: {saturation}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={saturation}
                      onChange={(e) => handleHslChange(hue, parseInt(e.target.value), lightness)}
                      className="w-full h-6 rounded-lg appearance-none cursor-pointer bg-gradient-to-r from-gray-200 to-current"
                      style={{
                        background: `linear-gradient(to right, hsl(${hue}, 0%, ${lightness}%), hsl(${hue}, 100%, ${lightness}%))`
                      }}
                    />
                  </div>

                  {/* Lightness Slider */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lightness: {lightness}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={lightness}
                      onChange={(e) => handleHslChange(hue, saturation, parseInt(e.target.value))}
                      className="w-full h-6 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, hsl(${hue}, ${saturation}%, 0%), hsl(${hue}, ${saturation}%, 50%), hsl(${hue}, ${saturation}%, 100%))`
                      }}
                    />
                  </div>

                  {/* HSL Values Display */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm font-medium text-gray-700">Hue</div>
                      <div className="text-lg font-bold text-gray-900">{hue}°</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm font-medium text-gray-700">Saturation</div>
                      <div className="text-lg font-bold text-gray-900">{saturation}%</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm font-medium text-gray-700">Lightness</div>
                      <div className="text-lg font-bold text-gray-900">{lightness}%</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Variations Tab */}
            {activeTab === 'variations' && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Color Variations</h4>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Base Color
                  </label>
                  <input
                    type="text"
                    value={baseColor}
                    onChange={(e) => setBaseColor(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono"
                    placeholder="#4169E1"
                  />
                </div>

                {baseColor.match(/^#[0-9A-Fa-f]{6}$/) && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {generateVariations(baseColor).map((variation, index) => (
                      <button
                        key={index}
                        onClick={() => handleVariationClick(variation)}
                        className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 hover:shadow-md transition-all duration-200 text-left border-2 hover:border-purple-200"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div
                            className="w-8 h-8 rounded-lg shadow-sm border border-gray-200 flex-shrink-0"
                            style={{ backgroundColor: variation.hex }}
                          />
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-gray-900 text-sm">{variation.name}</p>
                          </div>
                        </div>
                        <p className="text-xs font-mono text-gray-600">{variation.hex}</p>
                        <p className="text-xs text-gray-500">{variation.desc}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-5 sticky top-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Live Preview
                </label>
                <div className="flex items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
                  <div 
                    className="w-24 h-24 rounded-2xl shadow-xl border-4 border-white transform hover:scale-105 transition-transform"
                    style={{ backgroundColor: hexCode.match(/^#[0-9A-Fa-f]{6}$/) ? hexCode : '#f3f4f6' }}
                  />
                </div>
                <div className="text-center mt-2">
                  <p className="text-sm font-mono text-gray-600">{hexCode}</p>
                  <p className="text-xs text-gray-500">HSL({hue}, {saturation}%, {lightness}%)</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter color name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hex Code *
                </label>
                <input
                  type="text"
                  value={hexCode}
                  onChange={(e) => handleHexChange(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-center text-lg"
                  placeholder="#000000"
                  pattern="^#[0-9A-Fa-f]{6}$"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pantone Code (optional)
                </label>
                <input
                  type="text"
                  value={pantoneCode}
                  onChange={(e) => setPantoneCode(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., 533C"
                />
              </div>

              {/* Quick Actions */}
              <div className="border-t pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Quick Actions</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const lighterHex = hslToHex(hue, saturation, Math.min(lightness + 15, 95))
                      handleHexChange(lighterHex)
                      setName(name ? `Light ${name}` : 'Light Color')
                    }}
                    className="px-3 py-2 text-xs bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    ☀️ Lighter
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const darkerHex = hslToHex(hue, saturation, Math.max(lightness - 15, 5))
                      handleHexChange(darkerHex)
                      setName(name ? `Dark ${name}` : 'Dark Color')
                    }}
                    className="px-3 py-2 text-xs bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    🌙 Darker
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const mutedHex = hslToHex(hue, Math.max(saturation - 25, 0), lightness)
                      handleHexChange(mutedHex)
                      setName(name ? `Muted ${name}` : 'Muted Color')
                    }}
                    className="px-3 py-2 text-xs bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    🎨 Muted
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const saturatedHex = hslToHex(hue, Math.min(saturation + 25, 100), lightness)
                      handleHexChange(saturatedHex)
                      setName(name ? `Vivid ${name}` : 'Vivid Color')
                    }}
                    className="px-3 py-2 text-xs bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
                  >
                    ✨ Vivid
                  </button>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start">
                  <div className="text-blue-700 text-sm">
                    🎯 <strong>Pro Tips:</strong>
                    <ul className="mt-1 text-xs space-y-1 opacity-90">
                      <li>• Use HSL sliders for precise control</li>
                      <li>• Generate variations from any base color</li>
                      <li>• Medical colors work best with 40-70% saturation</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !name.trim() || !hexCode.match(/^#[0-9A-Fa-f]{6}$/)}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center transform hover:scale-105"
                >
                  {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Create Color
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

// Add Size Modal Component  
function AddSizeModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (data: any) => void }) {
  const [name, setName] = useState('')
  const [label, setLabel] = useState('')
  const [category, setCategory] = useState('UNISEX')
  const [submitting, setSubmitting] = useState(false)

  const categories = [
    { value: 'UNISEX', label: 'Unisex' },
    { value: 'WOMEN', label: 'Women' },
    { value: 'MEN', label: 'Men' },
    { value: 'PETITE', label: 'Petite' },
    { value: 'TALL', label: 'Tall' }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !label.trim()) return
    
    setSubmitting(true)
    await onSubmit({
      name: name.trim().toUpperCase(),
      label: label.trim(),
      category
    })
    setSubmitting(false)
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl max-w-md w-full mx-4 shadow-2xl">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">Add New Size</h3>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Size Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., XL, 2XL"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Size Label *
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Extra Large, Double Extra Large"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
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
              disabled={submitting || !name.trim() || !label.trim()}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Add Size
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Edit Color Modal Component
function EditColorModal({ color, onClose, onSubmit }: { color: Color; onClose: () => void; onSubmit: (data: any) => void }) {
  const [name, setName] = useState(color.name)
  const [hexCode, setHexCode] = useState(color.hexCode)
  const [pantoneCode, setPantoneCode] = useState(color.pantoneCode || '')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !hexCode.match(/^#[0-9A-Fa-f]{6}$/)) return
    
    setSubmitting(true)
    await onSubmit({
      id: color.id,
      name: name.trim(),
      hexCode: hexCode.toLowerCase(),
      pantoneCode: pantoneCode.trim() || undefined
    })
    setSubmitting(false)
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl max-w-md w-full mx-4 shadow-2xl">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">Edit Color</h3>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter color name"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hex Code *
            </label>
            <div className="flex items-center space-x-3">
              <div 
                className="w-12 h-12 rounded-xl border-2 border-gray-300 shadow-sm"
                style={{ backgroundColor: hexCode.match(/^#[0-9A-Fa-f]{6}$/) ? hexCode : '#ffffff' }}
              />
              <input
                type="text"
                value={hexCode}
                onChange={(e) => setHexCode(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono"
                placeholder="#000000"
                pattern="^#[0-9A-Fa-f]{6}$"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pantone Code (optional)
            </label>
            <input
              type="text"
              value={pantoneCode}
              onChange={(e) => setPantoneCode(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="e.g., 533C"
            />
          </div>
          
          {color.isSystem && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center">
                <div className="text-blue-600 text-sm">
                  ℹ️ This is a system color used for medical products
                </div>
              </div>
            </div>
          )}
          
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
              disabled={submitting || !name.trim() || !hexCode.match(/^#[0-9A-Fa-f]{6}$/)}
              className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Update Color
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Edit Size Modal Component
function EditSizeModal({ size, onClose, onSubmit }: { size: Size; onClose: () => void; onSubmit: (data: any) => void }) {
  const [name, setName] = useState(size.name)
  const [label, setLabel] = useState(size.label)
  const [category, setCategory] = useState(size.category)
  const [submitting, setSubmitting] = useState(false)

  const categories = [
    { value: 'UNISEX', label: 'Unisex' },
    { value: 'WOMEN', label: 'Women' },
    { value: 'MEN', label: 'Men' },
    { value: 'PETITE', label: 'Petite' },
    { value: 'TALL', label: 'Tall' }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !label.trim()) return
    
    setSubmitting(true)
    await onSubmit({
      id: size.id,
      name: name.trim().toUpperCase(),
      label: label.trim(),
      category
    })
    setSubmitting(false)
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl max-w-md w-full mx-4 shadow-2xl">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">Edit Size</h3>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Size Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., XL, 2XL"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Size Label *
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Extra Large, Double Extra Large"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
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
              disabled={submitting || !name.trim() || !label.trim()}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Update Size
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}