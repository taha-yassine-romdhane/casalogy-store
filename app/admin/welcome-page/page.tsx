"use client"

import { useState, useEffect, useCallback } from 'react'
import { Save, Upload, Eye, Edit, Trash2, Plus, Image, Type, Sparkles, Package, MessageCircle, Star, Play, Video, Monitor, Loader2, Settings, Users, Mail, Award, X, Facebook, Instagram, MessageSquare, Phone } from 'lucide-react'
import FeaturedCategories from '../components/FeaturedCategories'
import FeaturedProducts from '../components/FeaturedProducts'

interface HeroSection {
  id?: string
  title: string
  subtitle: string
  buttonText: string
  buttonLink: string
  mediaType: 'image' | 'video'
  mediaUrl: string
  mediaUrls?: string[]
  isActive: boolean
}

interface AboutSection {
  id?: string
  title: string
  description: string
  features: { id?: string; icon: string; title: string; description: string; sortOrder?: number }[]
  isActive: boolean
}

interface NewsletterSection {
  id?: string
  title: string
  description: string
  placeholder: string
  buttonText: string
  isActive: boolean
}

interface Testimonial {
  id?: string
  name: string
  role: string
  content: string
  rating: number
  socialMediaSource?: string
  isActive: boolean
  sortOrder: number
}

interface FeaturedCategory {
  id?: string
  categoryId: string
  title?: string
  description?: string
  imageUrl?: string
  isActive: boolean
  sortOrder: number
  category?: {
    id: string
    name: string
  }
}

interface FeaturedProduct {
  id?: string
  productId: string
  title?: string
  description?: string
  badge?: string
  isActive: boolean
  sortOrder: number
  product?: {
    id: string
    name: string
    price: number
  }
}

function MultiImageUploader({ 
  currentImages, 
  onImagesChange,
  mediaType 
}: { 
  currentImages?: string | string[], 
  onImagesChange: (urls: string | string[]) => void,
  mediaType: 'image' | 'video'
}) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [previews, setPreviews] = useState<string[]>(() => {
    if (mediaType === 'video') {
      return typeof currentImages === 'string' && currentImages ? [currentImages] : []
    }
    if (Array.isArray(currentImages)) return currentImages
    if (typeof currentImages === 'string' && currentImages) return [currentImages]
    return []
  })

  useEffect(() => {
    if (mediaType === 'video') {
      setPreviews(typeof currentImages === 'string' && currentImages ? [currentImages] : [])
    } else {
      if (Array.isArray(currentImages)) setPreviews(currentImages)
      else if (typeof currentImages === 'string' && currentImages) setPreviews([currentImages])
      else setPreviews([])
    }
  }, [currentImages, mediaType])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files)
    for (const file of files) {
      await uploadFile(file)
    }
  }, [previews, mediaType])

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    for (const file of files) {
      await uploadFile(file)
    }
  }, [previews, mediaType])

  const uploadFile = async (file: File) => {
    const maxFiles = mediaType === 'video' ? 1 : 5
    if (previews.length >= maxFiles) {
      alert(`Maximum ${maxFiles} ${mediaType}${maxFiles > 1 ? 's' : ''} allowed`)
      return
    }

    if (mediaType === 'video') {
      if (!file.type.startsWith('video/')) {
        alert('Please upload a video file')
        return
      }
      if (file.size > 50 * 1024 * 1024) {
        alert('Video file size must be less than 50MB')
        return
      }
    } else {
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file')
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('Image file size must be less than 5MB')
        return
      }
    }

    setUploading(true)
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      })
      
      if (!response.ok) {
        throw new Error('Upload failed')
      }
      
      const data = await response.json()
      
      if (mediaType === 'video') {
        setPreviews([data.url])
        onImagesChange(data.url)
      } else {
        const newPreviews = [...previews, data.url]
        setPreviews(newPreviews)
        onImagesChange(newPreviews.length === 1 ? newPreviews[0] : newPreviews)
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload file')
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (index: number) => {
    const newPreviews = previews.filter((_, i) => i !== index)
    setPreviews(newPreviews)
    if (newPreviews.length === 0) {
      onImagesChange('')
    } else if (newPreviews.length === 1) {
      onImagesChange(newPreviews[0])
    } else {
      onImagesChange(newPreviews)
    }
  }

  const maxFiles = mediaType === 'video' ? 1 : 5
  const canAddMore = previews.length < maxFiles

  return (
    <div className="space-y-4">
      {previews.length > 0 && (
        <div className={`grid gap-4 ${previews.length === 1 ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-3'}`}>
          {previews.map((preview, index) => (
            <div key={index} className="relative">
              {mediaType === 'video' ? (
                <video 
                  src={preview} 
                  className="w-full h-48 object-cover rounded-lg"
                  controls
                />
              ) : (
                <img 
                  src={preview} 
                  alt={`Hero preview ${index + 1}`} 
                  className="w-full h-48 object-cover rounded-lg"
                />
              )}
              <button
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              {previews.length > 1 && mediaType === 'image' && (
                <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
                  Image {index + 1}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {canAddMore && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          {uploading ? (
            <div className="py-8">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Uploading {mediaType}...</p>
            </div>
          ) : (
            <>
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">
                {mediaType === 'video' 
                  ? 'Drag and drop a video here, or click to select'
                  : `Drag and drop ${previews.length === 0 ? 'images' : 'more images'} here (${previews.length}/${maxFiles})`
                }
              </p>
              <p className="text-sm text-gray-500 mb-4">
                {mediaType === 'video'
                  ? 'Supports: MP4, WebM (Max 50MB)'
                  : `Supports: JPG, PNG, GIF, WebP (Max 5MB per image)`
                }
              </p>
              <label className="inline-block">
                <input
                  type="file"
                  accept={mediaType === 'video' ? 'video/*' : 'image/*'}
                  onChange={handleFileSelect}
                  className="hidden"
                  multiple={mediaType === 'image' && previews.length < maxFiles - 1}
                />
                <span className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
                  {mediaType === 'video' ? 'Choose Video' : `Choose Image${maxFiles > 1 ? 's' : ''}`}
                </span>
              </label>
            </>
          )}
        </div>
      )}
    </div>
  )
}

// Social Media Icons Component
function SocialMediaIcon({ platform }: { platform: string }) {
  switch (platform) {
    case 'facebook':
      return <Facebook className="w-5 h-5 text-blue-600" />
    case 'instagram':
      return <Instagram className="w-5 h-5 text-pink-600" />
    case 'messenger':
      return <MessageSquare className="w-5 h-5 text-blue-500" />
    case 'whatsapp':
      return <Phone className="w-5 h-5 text-green-600" />
    case 'tiktok':
      return <Play className="w-5 h-5 text-black" />
    default:
      return <MessageCircle className="w-5 h-5 text-gray-600" />
  }
}

// Testimonials Section Component
function TestimonialsSection({ testimonials, onRefresh, onSave, onDelete, saving }: {
  testimonials: Testimonial[]
  onRefresh: () => void
  onSave: (data: Testimonial) => void
  onDelete: (id: string) => void
  saving: boolean
}) {
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)

  const socialMediaOptions = [
    { value: 'facebook', label: 'Facebook' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'messenger', label: 'Messenger' },
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'tiktok', label: 'TikTok' }
  ]

  const handleSave = async (testimonial: Testimonial) => {
    onSave(testimonial)
    setEditingTestimonial(null)
    setShowAddForm(false)
  }

  const startEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial)
    setShowAddForm(false)
  }

  const startAdd = () => {
    setEditingTestimonial({
      name: '',
      role: '',
      content: '',
      rating: 5,
      socialMediaSource: '',
      isActive: true,
      sortOrder: testimonials.length
    })
    setShowAddForm(true)
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Customer Testimonials</h2>
        <button 
          onClick={startAdd}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Testimonial
        </button>
      </div>

      {(showAddForm || editingTestimonial) && (
        <div className="mb-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            {showAddForm ? 'Add New Testimonial' : 'Edit Testimonial'}
          </h3>
          <TestimonialForm
            testimonial={editingTestimonial!}
            onSave={handleSave}
            onCancel={() => {
              setEditingTestimonial(null)
              setShowAddForm(false)
            }}
            socialMediaOptions={socialMediaOptions}
            saving={saving}
          />
        </div>
      )}

      <div className="space-y-6">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div>
                  <h3 className="font-medium text-gray-800">{testimonial.name}</h3>
                  <p className="text-sm text-gray-700">{testimonial.role}</p>
                </div>
                {testimonial.socialMediaSource && (
                  <SocialMediaIcon platform={testimonial.socialMediaSource} />
                )}
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => startEdit(testimonial)}
                  className="p-2 text-gray-700 hover:text-blue-600"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => testimonial.id && onDelete(testimonial.id)}
                  className="p-2 text-gray-700 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-gray-800 mb-3">"{testimonial.content}"</p>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
              ))}
            </div>
          </div>
        ))}
        {testimonials.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No testimonials yet. Add your first testimonial!</p>
          </div>
        )}
      </div>
    </div>
  )
}

// Testimonial Form Component
function TestimonialForm({ testimonial, onSave, onCancel, socialMediaOptions, saving }: {
  testimonial: Testimonial
  onSave: (testimonial: Testimonial) => void
  onCancel: () => void
  socialMediaOptions: { value: string; label: string }[]
  saving: boolean
}) {
  const [formData, setFormData] = useState<Testimonial>(testimonial)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-2">Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Customer name"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-2">Role *</label>
          <input
            type="text"
            value={formData.role}
            onChange={(e) => setFormData({...formData, role: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Medical Student, Nurse, etc."
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-800 mb-2">Testimonial Content *</label>
        <textarea
          value={formData.content}
          onChange={(e) => setFormData({...formData, content: e.target.value})}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter the testimonial text..."
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-2">Rating *</label>
          <select
            value={formData.rating}
            onChange={(e) => setFormData({...formData, rating: parseInt(e.target.value)})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {[1, 2, 3, 4, 5].map(rating => (
              <option key={rating} value={rating}>
                {rating} Star{rating > 1 ? 's' : ''}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-2">Social Media Source</label>
          <select
            value={formData.socialMediaSource || ''}
            onChange={(e) => setFormData({...formData, socialMediaSource: e.target.value || undefined})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select platform (optional)</option>
            {socialMediaOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save Testimonial
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

export default function WelcomePageManagement() {
  const [activeSection, setActiveSection] = useState('hero')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [heroData, setHeroData] = useState<HeroSection>({} as HeroSection)
  const [newsletterData, setNewsletterData] = useState<NewsletterSection>({} as NewsletterSection)
  const [categories, setCategories] = useState<FeaturedCategory[]>([])
  const [products, setProducts] = useState<FeaturedProduct[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [previewMode, setPreviewMode] = useState(false)

  // Fetch all homepage data
  useEffect(() => {
    fetchHomepageData()
  }, [])

  const fetchHomepageData = async () => {
    try {
      setLoading(true)
      // Fetch hero section
      const heroResponse = await fetch('/api/admin/homepage/hero')
      const heroData = heroResponse.ok ? await heroResponse.json() : getDefaultHero()
      setHeroData(heroData)
      
      // Fetch all sections in parallel
      const [categoriesRes, productsRes, testimonialsRes, newsletterRes] = await Promise.all([
        fetch('/api/admin/homepage/featured-categories'),
        fetch('/api/admin/homepage/featured-products'), 
        fetch('/api/admin/homepage/testimonials'),
        fetch('/api/admin/homepage/newsletter')
      ])
      
      if (categoriesRes.ok) setCategories(await categoriesRes.json())
      if (productsRes.ok) setProducts(await productsRes.json())
      if (testimonialsRes.ok) setTestimonials(await testimonialsRes.json())
      if (newsletterRes.ok) setNewsletterData(await newsletterRes.json())
    } catch (error) {
      console.error('Error fetching homepage data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getDefaultHero = (): HeroSection => ({
    title: "Premium Medical Wear for Healthcare Professionals",
    subtitle: "Comfortable, durable, and stylish scrubs designed for medical students and healthcare workers in Tunisia",
    buttonText: "Shop Now",
    buttonLink: "/products",
    mediaType: 'image',
    mediaUrl: "/hero-bg.jpg",
    isActive: true
  })

  const saveSection = async (sectionType: string, data: any, method: string = 'POST') => {
    try {
      setSaving(true)
      const url = data.id && method === 'PUT' 
        ? `/api/admin/homepage/${sectionType}?id=${data.id}`
        : `/api/admin/homepage/${sectionType}`
      
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      
      if (response.ok) {
        alert('Section saved successfully!')
        await fetchHomepageData() // Refresh data
      } else {
        throw new Error('Failed to save section')
      }
    } catch (error) {
      alert('Error saving section: ' + (error as Error).message)
    } finally {
      setSaving(false)
    }
  }
  
  const deleteItem = async (sectionType: string, id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return
    
    try {
      const response = await fetch(`/api/admin/homepage/${sectionType}?id=${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        alert('Item deleted successfully!')
        await fetchHomepageData()
      } else {
        throw new Error('Failed to delete item')
      }
    } catch (error) {
      alert('Error deleting item: ' + (error as Error).message)
    }
  }

  const sections = [
    { id: 'hero', name: 'Hero Section', icon: Sparkles, color: 'bg-purple-100 text-purple-600' },
    { id: 'categories', name: 'Featured Categories', icon: Type, color: 'bg-blue-100 text-blue-600' },
    { id: 'products', name: 'Featured Products', icon: Package, color: 'bg-green-100 text-green-600' },
    { id: 'testimonials', name: 'Testimonials', icon: MessageCircle, color: 'bg-pink-100 text-pink-600' },
    { id: 'newsletter', name: 'Newsletter', icon: Mail, color: 'bg-indigo-100 text-indigo-600' },
    { id: 'settings', name: 'Global Settings', icon: Settings, color: 'bg-gray-100 text-gray-600' }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading homepage data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Homepage CMS</h1>
            <p className="text-gray-600">Manage your website's homepage content and layout</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className={`flex items-center px-4 py-2 rounded-xl transition-all duration-200 ${
                previewMode 
                  ? 'bg-green-100 text-green-700 border border-green-200'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {previewMode ? <Eye className="w-4 h-4 mr-2" /> : <Monitor className="w-4 h-4 mr-2" />}
              {previewMode ? 'Preview Mode' : 'Edit Mode'}
            </button>
            <a 
              href="/" 
              target="_blank" 
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Live Site
            </a>
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Sidebar */}
        <div className="w-80 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 mb-6 text-lg">Page Sections</h3>
          <div className="space-y-3">
            {sections.map((section) => {
              const Icon = section.icon
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                    activeSection === section.id
                      ? section.color + ' border-2 border-current transform scale-105 shadow-lg'
                      : 'text-gray-700 hover:bg-gray-50 border-2 border-transparent'
                  }`}
                >
                  <div className={`p-2 rounded-lg mr-4 ${
                    activeSection === section.id ? 'bg-white/20' : 'bg-gray-100'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">{section.name}</div>
                    <div className="text-xs opacity-70">
                      {section.id === 'hero' && 'Main banner area'}
                      {section.id === 'categories' && 'Featured product categories'}
                      {section.id === 'products' && 'Highlighted products'}
                      {section.id === 'testimonials' && 'Customer reviews'}
                      {section.id === 'newsletter' && 'Email subscription'}
                      {section.id === 'settings' && 'Global page settings'}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
          
          <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">💡 Quick Tip</h4>
            <p className="text-sm text-blue-700">
              {activeSection === 'hero' && 'Use high-quality images or videos that showcase your medical products. Recommended size: 1920x1080px.'}
              {activeSection === 'categories' && 'Select your most popular product categories to feature on the homepage.'}
              {activeSection === 'products' && 'Choose your best-selling or newest products to attract customer attention.'}
              {activeSection === 'testimonials' && 'Real customer reviews build trust. Include photos and detailed roles.'}
              {activeSection === 'newsletter' && 'Offer incentives like discounts for email subscriptions.'}
              {activeSection === 'settings' && 'Configure global settings that affect the entire homepage.'}
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200">
          {activeSection === 'hero' && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Hero Section</h2>
                <button 
                  onClick={() => saveSection('hero', heroData, heroData.id ? 'PUT' : 'POST')}
                  disabled={saving}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Save Changes
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">Hero Title</label>
                  <input
                    type="text"
                    value={heroData.title || ''}
                    onChange={(e) => setHeroData({...heroData, title: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter hero title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">Hero Subtitle</label>
                  <textarea
                    value={heroData.subtitle || ''}
                    onChange={(e) => setHeroData({...heroData, subtitle: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter hero subtitle"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">Button Text</label>
                  <input
                    type="text"
                    value={heroData.buttonText || ''}
                    onChange={(e) => setHeroData({...heroData, buttonText: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter button text"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-2">Button Link</label>
                    <input
                      type="text"
                      value={heroData.buttonLink || ''}
                      onChange={(e) => setHeroData({...heroData, buttonLink: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="/products"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-2">Media Type</label>
                    <select
                      value={heroData.mediaType || 'image'}
                      onChange={(e) => setHeroData({...heroData, mediaType: e.target.value as 'image' | 'video'})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    {heroData.mediaType === 'image' ? 'Hero Images' : 'Hero Video'}
                  </label>
                  <MultiImageUploader
                    currentImages={heroData.mediaType === 'image' ? (heroData.mediaUrls || heroData.mediaUrl) : heroData.mediaUrl}
                    onImagesChange={(urls) => {
                      if (heroData.mediaType === 'image') {
                        if (Array.isArray(urls)) {
                          setHeroData({...heroData, mediaUrls: urls, mediaUrl: urls[0] || ''})
                        } else {
                          setHeroData({...heroData, mediaUrls: urls ? [urls] : [], mediaUrl: urls})
                        }
                      } else {
                        setHeroData({...heroData, mediaUrl: urls as string})
                      }
                    }}
                    mediaType={heroData.mediaType}
                  />
                </div>
              </div>
            </div>
          )}

          {activeSection === 'categories' && (
            <FeaturedCategories />
          )}

          {activeSection === 'products' && (
            <FeaturedProducts />
          )}

          {activeSection === 'testimonials' && (
            <TestimonialsSection 
              testimonials={testimonials} 
              onRefresh={fetchHomepageData}
              onSave={(data) => saveSection('testimonials', data, data.id ? 'PUT' : 'POST')}
              onDelete={(id) => deleteItem('testimonials', id)}
              saving={saving}
            />
          )}

          {activeSection === 'newsletter' && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Newsletter Section</h2>
                <button 
                  onClick={() => saveSection('newsletter', newsletterData, newsletterData.id ? 'PUT' : 'POST')}
                  disabled={saving}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Save Changes
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">Title</label>
                  <input
                    type="text"
                    value={newsletterData.title || ''}
                    onChange={(e) => setNewsletterData({...newsletterData, title: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Stay Updated"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">Description</label>
                  <textarea
                    value={newsletterData.description || ''}
                    onChange={(e) => setNewsletterData({...newsletterData, description: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Get exclusive offers and updates..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-2">Email Placeholder</label>
                    <input
                      type="text"
                      value={newsletterData.placeholder || ''}
                      onChange={(e) => setNewsletterData({...newsletterData, placeholder: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-2">Button Text</label>
                    <input
                      type="text"
                      value={newsletterData.buttonText || ''}
                      onChange={(e) => setNewsletterData({...newsletterData, buttonText: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Subscribe"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}