"use client"

import { useState, useRef, useCallback, useEffect } from 'react'
import { 
  X, 
  Upload, 
  Check, 
  Plus,
  Trash2,
  Info,
  Package,
  Palette,
  Ruler,
  Shirt,
  Star,
  GripVertical,
  Eye,
  ChevronUp,
  ChevronDown,
  Bold,
  Italic,
  List,
  Link,
  Image,
  Smile,
  Type,
  AlignLeft,
  AlignCenter
} from 'lucide-react'
import { 
  FABRIC_TYPES,
  GENDER_OPTIONS
} from '@/lib/medical-constants'

// Common emojis for product descriptions
const PRODUCT_EMOJIS = [
  // Medical/Health
  '🏥', '⚕️', '🩺', '💊', '🧬', '🔬', '🧪', '💉', '🚑', '🏨',
  // Clothing/Fashion  
  '👔', '👗', '👕', '🧥', '👖', '🧦', '👟', '👠', '💼', '🎽',
  // Quality/Features
  '✨', '⭐', '🌟', '💎', '🔥', '💯', '✅', '🎯', '🚀', '⚡',
  // Comfort/Care
  '😊', '😌', '🤗', '💪', '👍', '👌', '💝', '🎉', '🏆', '🥇',
  // Nature/Clean
  '🌿', '🍃', '💧', '🌊', '☀️', '🌙', '❄️', '🔆', '💨', '🌸',
  // Arrows/Symbols
  '➡️', '⬅️', '⬆️', '⬇️', '↗️', '↘️', '🔄', '💫', '📍', '🎪'
]

interface Category {
  id: string
  name: string
  slug: string
}

interface Color {
  id: string
  name: string
  hexCode: string
  pantoneCode?: string
}

interface Size {
  id: string
  name: string
  category: string
}

interface MedicalProductFormProps {
  categories: Category[]
  availableColors: Color[]
  availableSizes: Size[]
  onSubmit: (data: any) => void
  onClose: () => void
  isEdit?: boolean
  initialData?: any
}

interface ColorImage {
  id: string
  file: File
  url: string
  isMain: boolean
  order: number
}

interface SelectedColor {
  id: string
  name: string
  hex: string
  pantone?: string
  images: ColorImage[]
}

interface SizeInventory {
  sizeId: string
  sizeName: string
  quantity: number
  sku: string
}

export function MedicalProductForm({
  categories,
  availableColors,
  availableSizes,
  onSubmit,
  onClose,
  isEdit = false,
  initialData
}: MedicalProductFormProps) {
  const [selectedColors, setSelectedColors] = useState<SelectedColor[]>([])
  const [selectedGender, setSelectedGender] = useState<string>('unisex')
  const [sizeInventory, setSizeInventory] = useState<Record<string, SizeInventory[]>>({})
  const [dragOverColorId, setDragOverColorId] = useState<string | null>(null)
  const [description, setDescription] = useState<string>(initialData?.description || '')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [descriptionImages, setDescriptionImages] = useState<Array<{id: string, url: string, file: File}>>([])
  const fileInputRefs = useRef<Record<string, HTMLInputElement>>({})
  const descriptionRef = useRef<HTMLTextAreaElement>(null)
  const descriptionImageInputRef = useRef<HTMLInputElement>(null)
  const emojiPickerRef = useRef<HTMLDivElement>(null)

  // Initialize form data when editing
  useEffect(() => {
    if (isEdit && initialData) {
      // Set gender
      if (initialData.gender) {
        setSelectedGender(initialData.gender.toLowerCase())
      }
      
      // Initialize colors and images from database data
      if (initialData.colors && initialData.colors.length > 0) {
        const colors: SelectedColor[] = initialData.colors.map((dbColor: any) => {
          const images: ColorImage[] = dbColor.images ? dbColor.images.map((dbImage: any, index: number) => ({
            id: dbImage.id,
            file: null as any, // For existing images, file is not needed
            url: dbImage.url,
            isMain: dbImage.isMain,
            order: dbImage.sortOrder || index
          })) : []
          
          return {
            id: dbColor.id,
            name: dbColor.colorName,
            hex: dbColor.colorCode,
            pantone: dbColor.pantoneCode,
            images: images
          }
        })
        
        setSelectedColors(colors)
        
        // Initialize size inventory from variants
        const inventory: Record<string, SizeInventory[]> = {}
        colors.forEach(color => {
          const dbColor = initialData.colors.find((c: any) => c.id === color.id)
          if (dbColor && dbColor.variants) {
            inventory[color.id] = dbColor.variants.map((variant: any) => ({
              sizeId: variant.size.id,
              sizeName: variant.size.name,
              quantity: variant.quantity,
              sku: variant.sku || ''
            }))
          } else {
            // If no variants, initialize with default sizes based on gender
            const categoryMap: Record<string, string> = {
              'unisex': 'UNISEX',
              'women': 'WOMEN',
              'men': 'MEN'
            }
            const category = categoryMap[initialData.gender?.toLowerCase() || 'unisex'] || 'UNISEX'
            
            let sizes = availableSizes.filter(size => size.category === category)
            if (category !== 'UNISEX') {
              // Also include UNISEX sizes for gendered products
              const sizesMap = new Map<string, typeof availableSizes[0]>()
              sizes.forEach(size => sizesMap.set(size.name, size))
              availableSizes
                .filter(size => size.category === 'UNISEX')
                .forEach(size => {
                  if (!sizesMap.has(size.name)) {
                    sizesMap.set(size.name, size)
                  }
                })
              sizes = Array.from(sizesMap.values())
            }
            
            inventory[color.id] = sizes.map(size => ({
              sizeId: size.id,
              sizeName: size.name,
              quantity: 0,
              sku: ''
            }))
          }
        })
        
        setSizeInventory(inventory)
      }
    }
  }, [isEdit, initialData, availableSizes])

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false)
      }
    }

    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showEmojiPicker])

  // Update size inventories when gender changes
  useEffect(() => {
    if (selectedColors.length > 0) {
      const newSizes = getSizesForGender()
      const newInventory: Record<string, SizeInventory[]> = {}
      
      selectedColors.forEach(color => {
        newInventory[color.id] = newSizes.map(size => {
          // Try to preserve existing quantity if the size already existed
          const existingSize = sizeInventory[color.id]?.find(s => s.sizeId === size.id)
          return {
            sizeId: size.id,
            sizeName: size.name,
            quantity: existingSize?.quantity ?? 10, // Default to 10 if no existing quantity
            sku: existingSize?.sku || ''
          }
        })
      })
      
      setSizeInventory(newInventory)
    }
  }, [selectedGender, availableSizes]) // Re-run when gender or available sizes change

  // Get appropriate sizes based on gender selection
  const getSizesForGender = () => {
    // Filter sizes based on selected gender/category
    const categoryMap: Record<string, string> = {
      'unisex': 'UNISEX',
      'women': 'WOMEN',
      'men': 'MEN'
    }
    const category = categoryMap[selectedGender.toLowerCase()] || 'UNISEX'
    
    // If UNISEX is selected, only show UNISEX sizes
    if (category === 'UNISEX') {
      return availableSizes.filter(size => size.category === 'UNISEX')
    }
    
    // For MEN/WOMEN, show gender-specific sizes plus UNISEX
    // But deduplicate by size name to avoid showing duplicates
    const sizesMap = new Map<string, typeof availableSizes[0]>()
    
    // First add gender-specific sizes
    availableSizes
      .filter(size => size.category === category)
      .forEach(size => sizesMap.set(size.name, size))
    
    // Then add UNISEX sizes only if that size name doesn't exist
    availableSizes
      .filter(size => size.category === 'UNISEX')
      .forEach(size => {
        if (!sizesMap.has(size.name)) {
          sizesMap.set(size.name, size)
        }
      })
    
    // Return deduplicated sizes sorted by typical size order
    return Array.from(sizesMap.values()).sort((a, b) => {
      const sizeOrder = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '2XL', '3XL', '4XL', '5XL']
      return sizeOrder.indexOf(a.name) - sizeOrder.indexOf(b.name)
    })
  }

  // Toggle color selection
  const toggleColor = (color: Color) => {
    const isSelected = selectedColors.some(c => c.id === color.id)
    
    if (isSelected) {
      // Remove color and its inventory
      setSelectedColors(prev => prev.filter(c => c.id !== color.id))
      setSizeInventory(prev => {
        const newInventory = { ...prev }
        delete newInventory[color.id]
        return newInventory
      })
    } else {
      // Add color and initialize inventory
      const newColor: SelectedColor = {
        id: color.id,
        name: color.name,
        hex: color.hexCode,
        pantone: color.pantoneCode,
        images: []
      }
      setSelectedColors(prev => [...prev, newColor])
      
      // Initialize size inventory for this color
      const sizes = getSizesForGender()
      const newInventory: SizeInventory[] = sizes.map(size => ({
        sizeId: size.id,
        sizeName: size.name,
        quantity: 10, // Default quantity set to 10
        sku: ''
      }))
      setSizeInventory(prev => ({
        ...prev,
        [color.id]: newInventory
      }))
    }
  }

  // Upload image to server
  const uploadImageToServer = async (file: File): Promise<string | null> => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      })
      
      if (response.ok) {
        const data = await response.json()
        return data.url
      }
      return null
    } catch (error) {
      console.error('Failed to upload image:', error)
      return null
    }
  }

  // Handle image upload for specific color
  const handleImageUpload = async (colorId: string, files: FileList | null) => {
    if (!files) return
    
    const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'))
    
    // Show loading state (you could add a loading indicator here)
    for (const file of imageFiles) {
      // Upload to server
      const uploadedUrl = await uploadImageToServer(file)
      
      if (uploadedUrl) {
        setSelectedColors(prev => prev.map(color => {
          if (color.id === colorId) {
            const currentMaxOrder = Math.max(0, ...color.images.map(img => img.order))
            const newImage: ColorImage = {
              id: `${Date.now()}-${Math.random()}`,
              file,
              url: uploadedUrl, // Use the uploaded URL instead of blob URL
              isMain: color.images.length === 0, // First image is main
              order: currentMaxOrder + 1
            }
            
            return {
              ...color,
              images: [...color.images, newImage]
            }
          }
          return color
        }))
      }
    }
  }

  // Handle drag and drop
  const handleImageDrop = async (e: React.DragEvent, colorId: string) => {
    e.preventDefault()
    setDragOverColorId(null)
    await handleImageUpload(colorId, e.dataTransfer.files)
  }

  // Remove image
  const removeImage = (colorId: string, imageId: string) => {
    setSelectedColors(prev => prev.map(color => {
      if (color.id === colorId) {
        const updatedImages = color.images.filter(img => img.id !== imageId)
        // If we removed the main image, make the first remaining image main
        if (updatedImages.length > 0 && !updatedImages.some(img => img.isMain)) {
          updatedImages[0].isMain = true
        }
        return { ...color, images: updatedImages }
      }
      return color
    }))
  }

  // Set main image
  const setMainImage = (colorId: string, imageId: string) => {
    setSelectedColors(prev => prev.map(color => {
      if (color.id === colorId) {
        return {
          ...color,
          images: color.images.map(img => ({
            ...img,
            isMain: img.id === imageId
          }))
        }
      }
      return color
    }))
  }

  // Move image up in order
  const moveImageUp = (colorId: string, imageId: string) => {
    setSelectedColors(prev => prev.map(color => {
      if (color.id === colorId) {
        const images = [...color.images].sort((a, b) => a.order - b.order)
        const currentIndex = images.findIndex(img => img.id === imageId)
        
        if (currentIndex > 0) {
          const temp = images[currentIndex].order
          images[currentIndex].order = images[currentIndex - 1].order
          images[currentIndex - 1].order = temp
        }
        
        return { ...color, images }
      }
      return color
    }))
  }

  // Move image down in order
  const moveImageDown = (colorId: string, imageId: string) => {
    setSelectedColors(prev => prev.map(color => {
      if (color.id === colorId) {
        const images = [...color.images].sort((a, b) => a.order - b.order)
        const currentIndex = images.findIndex(img => img.id === imageId)
        
        if (currentIndex < images.length - 1) {
          const temp = images[currentIndex].order
          images[currentIndex].order = images[currentIndex + 1].order
          images[currentIndex + 1].order = temp
        }
        
        return { ...color, images }
      }
      return color
    }))
  }

  // Update inventory for a specific color and size
  const updateInventory = (colorId: string, sizeIndex: number, field: 'quantity' | 'sku', value: string | number) => {
    setSizeInventory(prev => ({
      ...prev,
      [colorId]: prev[colorId].map((item, index) => 
        index === sizeIndex
          ? { ...item, [field]: value }
          : item
      )
    }))
  }

  // Auto-generate SKU
  const generateSKU = (baseSKU: string, colorId: string, sizeName: string) => {
    const colorCode = colorId.substring(0, 3).toUpperCase()
    return `${baseSKU}-${colorCode}-${sizeName}`
  }

  // Description editor functions
  const insertTextAtCursor = useCallback((text: string) => {
    const textarea = descriptionRef.current
    if (!textarea) return
    
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const currentValue = textarea.value
    
    const newValue = currentValue.substring(0, start) + text + currentValue.substring(end)
    setDescription(newValue)
    
    // Reset cursor position
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + text.length, start + text.length)
    }, 0)
  }, [])

  const insertEmoji = useCallback((emoji: string) => {
    insertTextAtCursor(emoji + ' ')
    setShowEmojiPicker(false)
  }, [insertTextAtCursor])

  const formatText = useCallback((format: string) => {
    const textarea = descriptionRef.current
    if (!textarea) return
    
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = textarea.value.substring(start, end)
    
    let formattedText = ''
    switch (format) {
      case 'bold':
        formattedText = `**${selectedText || 'bold text'}**`
        break
      case 'italic':
        formattedText = `*${selectedText || 'italic text'}*`
        break
      case 'list':
        formattedText = selectedText ? 
          selectedText.split('\n').map(line => `• ${line}`).join('\n') :
          '• List item 1\n• List item 2\n• List item 3'
        break
      case 'link':
        formattedText = `[${selectedText || 'link text'}](https://example.com)`
        break
    }
    
    const newValue = textarea.value.substring(0, start) + formattedText + textarea.value.substring(end)
    setDescription(newValue)
    
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + formattedText.length, start + formattedText.length)
    }, 0)
  }, [])

  const handleDescriptionImageUpload = (files: FileList | null) => {
    if (!files) return
    
    const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'))
    
    imageFiles.forEach(file => {
      const id = `desc-img-${Date.now()}-${Math.random()}`
      const url = URL.createObjectURL(file)
      
      setDescriptionImages(prev => [...prev, { id, url, file }])
      
      // Insert image markdown into description
      const imageMarkdown = `\n![Product Image](${url})\n`
      insertTextAtCursor(imageMarkdown)
    })
  }

  const removeDescriptionImage = (imageId: string) => {
    const imageToRemove = descriptionImages.find(img => img.id === imageId)
    if (imageToRemove) {
      // Remove image reference from description
      const imageMarkdown = `![Product Image](${imageToRemove.url})`
      setDescription(prev => prev.replace(imageMarkdown, '').replace(/\n\n\n/g, '\n\n'))
    }
    setDescriptionImages(prev => prev.filter(img => img.id !== imageId))
  }

  // Enhanced preview parser
  const parseDescriptionPreview = (text: string) => {
    if (!text) return null
    
    return text.split('\n').map((line, lineIndex) => {
      // Handle images
      const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g
      let lastIndex = 0
      const elements: React.ReactNode[] = []
      let match
      
      while ((match = imageRegex.exec(line)) !== null) {
        // Add text before image
        if (match.index > lastIndex) {
          const textBefore = line.substring(lastIndex, match.index)
          elements.push(...parseTextFormatting(textBefore, `${lineIndex}-text-${lastIndex}`))
        }
        
        // Add image
        elements.push(
          <img
            key={`${lineIndex}-img-${match.index}`}
            src={match[2]}
            alt={match[1] || 'Description image'}
            className="inline-block max-w-full h-auto max-h-20 rounded border border-gray-200 mx-1"
          />
        )
        lastIndex = imageRegex.lastIndex
      }
      
      // Add remaining text
      if (lastIndex < line.length) {
        const remainingText = line.substring(lastIndex)
        elements.push(...parseTextFormatting(remainingText, `${lineIndex}-text-${lastIndex}`))
      }
      
      return (
        <div key={lineIndex} className="leading-relaxed">
          {elements.length > 0 ? elements : parseTextFormatting(line, `${lineIndex}-full`)}
        </div>
      )
    })
  }

  const parseTextFormatting = (text: string, keyPrefix: string): React.ReactNode[] => {
    const elements: React.ReactNode[] = []
    let currentText = text
    let partIndex = 0
    
    // Handle bold text **text**
    currentText = currentText.replace(/\*\*(.*?)\*\*/g, (match, content) => {
      return `<BOLD>${content}</BOLD>`
    })
    
    // Handle italic text *text*
    currentText = currentText.replace(/(?<!\*)\*(?!\*)(.*?)(?<!\*)\*(?!\*)/g, (match, content) => {
      return `<ITALIC>${content}</ITALIC>`
    })
    
    // Handle links [text](url)
    currentText = currentText.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, linkText, url) => {
      return `<LINK url="${url}">${linkText}</LINK>`
    })
    
    // Split by custom tags and render
    const parts = currentText.split(/(<\/?(?:BOLD|ITALIC|LINK)[^>]*>)/g)
    let isInBold = false
    let isInItalic = false
    
    parts.forEach((part, index) => {
      if (part === '<BOLD>') {
        isInBold = true
      } else if (part === '</BOLD>') {
        isInBold = false
      } else if (part === '<ITALIC>') {
        isInItalic = true
      } else if (part === '</ITALIC>') {
        isInItalic = false
      } else if (part.startsWith('<LINK url="')) {
        const urlMatch = part.match(/url="([^"]+)">(.+)<\/LINK>/)
        if (urlMatch) {
          elements.push(
            <a
              key={`${keyPrefix}-link-${index}`}
              href={urlMatch[1]}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              {urlMatch[2]}
            </a>
          )
        }
      } else if (part && !part.startsWith('<')) {
        let element: React.ReactNode = part
        
        if (isInBold) {
          element = <strong key={`${keyPrefix}-bold-${index}`}>{part}</strong>
        } else if (isInItalic) {
          element = <em key={`${keyPrefix}-italic-${index}`}>{part}</em>
        } else {
          element = <span key={`${keyPrefix}-text-${index}`}>{part}</span>
        }
        
        elements.push(element)
      }
    })
    
    return elements.length > 0 ? elements : [<span key={keyPrefix}>{text}</span>]
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget as HTMLFormElement)
    
    // Prepare colors data
    const colorsData = selectedColors.map(color => ({
      colorName: color.name,
      colorCode: color.hex,
      pantoneCode: color.pantone,
      images: color.images
        .sort((a, b) => a.order - b.order)
        .map(img => ({
          url: img.url, // Now using uploaded URLs
          isMain: img.isMain,
          order: img.order
        }))
    }))
    
    // Prepare variants data
    const variantsData: any[] = []
    Object.entries(sizeInventory).forEach(([colorId, sizes]) => {
      const color = selectedColors.find(c => c.id === colorId)
      if (color) {
        sizes.forEach(sizeData => {
          if (sizeData.quantity > 0 || sizeData.sku) {
            variantsData.push({
              colorId: color.id,
              colorName: color.name,
              sizeId: sizeData.sizeId,
              sizeName: sizeData.sizeName,
              quantity: sizeData.quantity,
              sku: sizeData.sku || generateSKU(formData.get('sku') as string, colorId, sizeData.sizeName)
            })
          }
        })
      }
    })
    
    const data = {
      // Basic info
      name: formData.get('name'),
      sku: formData.get('sku'),
      description: formData.get('description'),
      shortDescription: formData.get('shortDescription'),
      price: parseFloat(formData.get('price') as string),
      comparePrice: formData.get('comparePrice') ? parseFloat(formData.get('comparePrice') as string) : null,
      categoryId: formData.get('categoryId'),
      
      // Product-specific attributes
      fabricType: formData.get('fabricType'),
      gender: selectedGender,
      pocketCount: formData.get('pocketCount') ? parseInt(formData.get('pocketCount') as string) : null,
      
      // Status
      isActive: formData.get('isActive') === 'on',
      isFeatured: formData.get('isFeatured') === 'on',
      
      // SEO
      metaTitle: formData.get('metaTitle'),
      metaDescription: formData.get('metaDescription'),
      
      // Relations
      colors: colorsData,
      variants: variantsData,
      
      // Description with images
      descriptionImages: descriptionImages.map(img => ({
        file: img.file,
        url: img.url
      }))
    }
    
    await onSubmit(data)
  }

  return (
    <div className="p-8 max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-bold text-gray-900">
          {isEdit ? 'Edit Medical Product' : 'Add New Medical Product'}
        </h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Package className="w-5 h-5 mr-2 text-blue-600" />
            <h4 className="text-lg font-semibold text-gray-900">Basic Information</h4>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                required
                defaultValue={initialData?.name}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Professional Scrub Top"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Base SKU
              </label>
              <input
                type="text"
                name="sku"
                defaultValue={initialData?.sku}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Auto-generated if left empty (e.g., PROD-001)"
              />
              <p className="text-xs text-gray-500 mt-1">Leave empty to auto-generate. Variant SKUs will be: {'{baseSKU}-{color}-{size}'}</p>
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Short Description
              </label>
              <input
                type="text"
                name="shortDescription"
                defaultValue={initialData?.shortDescription}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Brief product description for cards and lists"
              />
            </div>
            
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Description
              </label>
              
              {/* Rich Text Editor Toolbar */}
              <div className="border border-gray-300 rounded-t-lg bg-gray-50 p-2">
                <div className="flex items-center gap-1 flex-wrap">
                  {/* Text Formatting */}
                  <button
                    type="button"
                    onClick={() => formatText('bold')}
                    className="p-2 text-gray-600 hover:bg-gray-200 rounded"
                    title="Bold"
                  >
                    <Bold className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => formatText('italic')}
                    className="p-2 text-gray-600 hover:bg-gray-200 rounded"
                    title="Italic"
                  >
                    <Italic className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => formatText('list')}
                    className="p-2 text-gray-600 hover:bg-gray-200 rounded"
                    title="Bullet List"
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => formatText('link')}
                    className="p-2 text-gray-600 hover:bg-gray-200 rounded"
                    title="Add Link"
                  >
                    <Link className="w-4 h-4" />
                  </button>
                  
                  <div className="w-px h-6 bg-gray-300 mx-1"></div>
                  
                  {/* Image Upload */}
                  <button
                    type="button"
                    onClick={() => descriptionImageInputRef.current?.click()}
                    className="p-2 text-gray-600 hover:bg-gray-200 rounded"
                    title="Add Image"
                  >
                    <Image className="w-4 h-4" />
                  </button>
                  <input
                    ref={descriptionImageInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleDescriptionImageUpload(e.target.files)}
                  />
                  
                  {/* Emoji Picker */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="p-2 text-gray-600 hover:bg-gray-200 rounded"
                      title="Add Emoji"
                    >
                      <Smile className="w-4 h-4" />
                    </button>
                    
                    {showEmojiPicker && (
                      <div 
                        ref={emojiPickerRef}
                        className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-xl p-4 z-50 w-96"
                        style={{ maxWidth: '90vw' }}
                      >
                        <div className="mb-2">
                          <h6 className="text-xs font-medium text-gray-700 mb-2">Medical & Healthcare Emojis</h6>
                        </div>
                        <div className="grid grid-cols-8 gap-3 p-2">
                          {PRODUCT_EMOJIS.map((emoji, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => insertEmoji(emoji)}
                              className="w-10 h-10 flex items-center justify-center hover:bg-blue-100 rounded-lg text-xl transition-all duration-200 hover:scale-110 border border-transparent hover:border-blue-200"
                              title={`Add ${emoji}`}
                              style={{ 
                                fontFamily: 'Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, Twemoji Mozilla, sans-serif',
                                fontSize: '20px',
                                lineHeight: '1'
                              }}
                            >
                              <span className="select-none pointer-events-none block">{emoji}</span>
                            </button>
                          ))}
                        </div>
                        <div className="mt-3 pt-2 border-t border-gray-200 flex justify-between items-center">
                          <span className="text-xs text-gray-500">Click emoji to add</span>
                          <button
                            type="button"
                            onClick={() => setShowEmojiPicker(false)}
                            className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100"
                          >
                            ✕ Close
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Text Area */}
              <textarea
                ref={descriptionRef}
                name="description"
                rows={8}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 border-t-0 rounded-b-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-y"
                style={{ 
                  fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace, Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji',
                  lineHeight: '1.5'
                }}
                placeholder="Detailed product description with emojis and images...

Examples:
✨ **Premium Medical Scrubs** ✨
• Super soft fabric blend 🧵
• 6 functional pockets 👔  
• Fade-resistant colors 🌈
• Machine washable 💧

Perfect for healthcare professionals! 🏥⚕️"
              />
              
              {/* Description Images */}
              {descriptionImages.length > 0 && (
                <div className="mt-3">
                  <h6 className="text-sm font-medium text-gray-700 mb-2">
                    Description Images ({descriptionImages.length})
                  </h6>
                  <div className="flex flex-wrap gap-2">
                    {descriptionImages.map((image) => (
                      <div key={image.id} className="relative group">
                        <img
                          src={image.url}
                          alt="Description"
                          className="w-16 h-16 object-cover rounded border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeDescriptionImage(image.id)}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-2 h-2" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Description Preview */}
              <div className="mt-3 p-4 bg-gray-50 rounded-lg border">
                <div className="flex items-center justify-between mb-3">
                  <h6 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Live Preview
                  </h6>
                  <span className="text-xs text-gray-500">
                    {description.length} characters
                  </span>
                </div>
                <div 
                  className="text-sm text-gray-700 max-h-40 overflow-y-auto bg-white p-3 rounded border"
                  style={{ 
                    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji'
                  }}
                >
                  {description ? (
                    <div className="space-y-2">
                      {parseDescriptionPreview(description)}
                    </div>
                  ) : (
                    <span className="text-gray-400 italic">
                      Your description preview will appear here... 
                      <br />
                      Try adding some text with emojis! 😊
                    </span>
                  )}
                </div>
                
                {/* Quick Tips */}
                {description.length === 0 && (
                  <div className="mt-3 p-2 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-xs text-blue-700">
                      <p className="font-medium mb-1">Quick Tips:</p>
                      <ul className="space-y-0.5">
                        <li>• Use **text** for bold, *text* for italic</li>
                        <li>• Click 😊 to add emojis, 📷 to add images</li>
                        <li>• Start lines with • for bullet points</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (TND) *
              </label>
              <input
                type="number"
                name="price"
                required
                step="0.01"
                min="0"
                defaultValue={initialData?.price}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.00"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Compare Price (TND)
              </label>
              <input
                type="number"
                name="comparePrice"
                step="0.01"
                min="0"
                defaultValue={initialData?.comparePrice}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.00"
              />
              <p className="text-xs text-gray-500 mt-1">Original price before discount</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="categoryId"
                required
                defaultValue={initialData?.categoryId || ''}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender/Fit Type *
              </label>
              <select
                value={selectedGender}
                onChange={(e) => setSelectedGender(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {GENDER_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Medical-Specific Attributes */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Shirt className="w-5 h-5 mr-2 text-green-600" />
            <h4 className="text-lg font-semibold text-gray-900">Product Details</h4>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fabric Type
              </label>
              <select
                name="fabricType"
                defaultValue={initialData?.fabricType || ''}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select fabric</option>
                {FABRIC_TYPES.map((fabric) => (
                  <option key={fabric.value} value={fabric.value}>
                    {fabric.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Pockets
              </label>
              <input
                type="number"
                name="pocketCount"
                min="0"
                max="20"
                defaultValue={initialData?.pocketCount || ''}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        {/* Color Selection */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Palette className="w-5 h-5 mr-2 text-purple-600" />
              <h4 className="text-lg font-semibold text-gray-900">Available Colors</h4>
            </div>
            <span className="text-sm text-gray-500">
              {selectedColors.length} color{selectedColors.length !== 1 ? 's' : ''} selected
            </span>
          </div>
          
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-10 xl:grid-cols-12 gap-3">
            {availableColors.map(color => {
              const isSelected = selectedColors.some(c => c.id === color.id)
              return (
                <button
                  key={color.id}
                  type="button"
                  onClick={() => toggleColor(color)}
                  className={`group relative p-2 rounded-lg border-2 transition-all ${
                    isSelected 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  title={`${color.name}${color.pantoneCode ? ` - Pantone ${color.pantoneCode}` : ''}`}
                >
                  <div className="relative">
                    <div 
                      className="w-10 h-10 rounded-full mx-auto shadow-sm border border-gray-200"
                      style={{ backgroundColor: color.hexCode }}
                    />
                    {isSelected && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  <span className="text-xs mt-1 block text-center text-gray-600 truncate">
                    {color.name}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Color Variants & Images */}
        {selectedColors.length > 0 && (
          <div className="space-y-6">
            {selectedColors.map((color) => (
              <div key={color.id} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div 
                      className="w-8 h-8 rounded-full mr-3 border border-gray-300"
                      style={{ backgroundColor: color.hex }}
                    />
                    <h5 className="text-lg font-medium text-gray-900">{color.name}</h5>
                    {color.pantone && (
                      <span className="ml-2 text-sm text-gray-500">Pantone {color.pantone}</span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleColor(color)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Image Upload */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Images - {color.name}
                  </label>
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                      dragOverColorId === color.id
                        ? 'border-blue-400 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onDrop={(e) => handleImageDrop(e, color.id)}
                    onDragOver={(e) => {
                      e.preventDefault()
                      setDragOverColorId(color.id)
                    }}
                    onDragLeave={() => setDragOverColorId(null)}
                  >
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      Drag and drop images here, or{' '}
                      <label className="text-blue-600 hover:text-blue-700 cursor-pointer">
                        browse
                        <input
                          ref={el => {
                            if (el) fileInputRefs.current[color.id] = el
                          }}
                          type="file"
                          multiple
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageUpload(color.id, e.target.files)}
                        />
                      </label>
                    </p>
                  </div>

                  {/* Image Management */}
                  {color.images.length > 0 && (
                    <div className="mt-6">
                      <div className="flex items-center justify-between mb-3">
                        <h6 className="text-sm font-medium text-gray-700">
                          Images ({color.images.length})
                        </h6>
                        <span className="text-xs text-gray-500">
                          {color.images.filter(img => img.isMain).length > 0 && '★ = Main Image'}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {color.images
                          .sort((a, b) => a.order - b.order)
                          .map((image, index) => (
                          <div key={image.id} className="relative group bg-gray-50 rounded-lg p-2">
                            {/* Image Preview */}
                            <div className="relative">
                              <img
                                src={image.url}
                                alt={`${color.name} ${index + 1}`}
                                className={`w-full h-32 object-cover rounded-md border-2 transition-all ${
                                  image.isMain 
                                    ? 'border-yellow-400 shadow-md' 
                                    : 'border-gray-200'
                                }`}
                              />
                              
                              {/* Main Image Badge */}
                              {image.isMain && (
                                <div className="absolute top-1 left-1">
                                  <div className="bg-yellow-500 text-white rounded-full p-1">
                                    <Star className="w-3 h-3" />
                                  </div>
                                </div>
                              )}
                              
                              {/* Order Number */}
                              <div className="absolute top-1 right-1">
                                <div className="bg-black/70 text-white text-xs rounded px-1.5 py-0.5">
                                  #{index + 1}
                                </div>
                              </div>
                            </div>
                            
                            {/* Image Controls */}
                            <div className="mt-2 space-y-1">
                              {/* Main Image Toggle */}
                              <button
                                type="button"
                                onClick={() => setMainImage(color.id, image.id)}
                                className={`w-full px-2 py-1 text-xs rounded transition-colors ${
                                  image.isMain
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-gray-100 text-gray-600 hover:bg-yellow-50'
                                }`}
                                title={image.isMain ? 'Main image' : 'Set as main image'}
                              >
                                <Star className={`w-3 h-3 inline mr-1 ${image.isMain ? 'fill-current' : ''}`} />
                                {image.isMain ? 'Main' : 'Set Main'}
                              </button>
                              
                              {/* Reorder Controls */}
                              <div className="flex gap-1">
                                <button
                                  type="button"
                                  onClick={() => moveImageUp(color.id, image.id)}
                                  disabled={index === 0}
                                  className="flex-1 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                  title="Move up"
                                >
                                  <ChevronUp className="w-3 h-3 mx-auto" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => moveImageDown(color.id, image.id)}
                                  disabled={index === color.images.length - 1}
                                  className="flex-1 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                  title="Move down"
                                >
                                  <ChevronDown className="w-3 h-3 mx-auto" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => removeImage(color.id, image.id)}
                                  className="flex-1 px-2 py-1 text-xs bg-red-100 text-red-600 rounded hover:bg-red-200"
                                  title="Delete image"
                                >
                                  <Trash2 className="w-3 h-3 mx-auto" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {color.images.length > 1 && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                          <div className="flex items-start gap-2">
                            <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div className="text-sm text-blue-700">
                              <p className="font-medium">Image Order Tips:</p>
                              <ul className="text-xs mt-1 space-y-1">
                                <li>• Use ↑↓ buttons to reorder images</li>
                                <li>• First image is shown in product listings</li>
                                <li>• Main image (★) appears first in galleries</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Size Inventory */}
                <div>
                  <div className="flex items-center mb-3">
                    <Ruler className="w-4 h-4 mr-2 text-gray-600" />
                    <label className="text-sm font-medium text-gray-700">
                      Size Inventory - {color.name}
                    </label>
                  </div>
                  <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-3">
                    {sizeInventory[color.id]?.map((sizeData, index) => (
                      <div key={sizeData.sizeId} className="text-center">
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          {sizeData.sizeName}
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={sizeData.quantity}
                          onChange={(e) => updateInventory(color.id, index, 'quantity', parseInt(e.target.value) || 0)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                          placeholder="0"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SEO & Settings */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Info className="w-5 h-5 mr-2 text-gray-600" />
            <h4 className="text-lg font-semibold text-gray-900">SEO & Settings</h4>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta Title
              </label>
              <input
                type="text"
                name="metaTitle"
                defaultValue={initialData?.metaTitle}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="SEO page title"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta Description
              </label>
              <input
                type="text"
                name="metaDescription"
                defaultValue={initialData?.metaDescription}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="SEO page description"
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
              <span className="ml-2 text-sm font-medium text-gray-700">Active Product</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isFeatured"
                defaultChecked={initialData?.isFeatured}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm font-medium text-gray-700">Featured Product</span>
            </label>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {isEdit ? 'Update Product' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  )
}