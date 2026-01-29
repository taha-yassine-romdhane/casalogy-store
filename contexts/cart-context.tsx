"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { trackAddToCart } from '@/lib/facebook-pixel'

export interface CartItem {
  id: string
  productId: string
  productName: string
  productSlug: string
  price: number
  color: string
  size: string
  quantity: number
  image?: string
  maxQuantity: number
  customization?: string // Customer's personalization request (logo, modifications, etc.)
}

interface CartContextType {
  items: CartItem[]
  itemCount: number
  totalAmount: number
  addItem: (item: Omit<CartItem, 'id'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  updateCustomization: (id: string, customization: string) => void
  clearCart: () => void
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

interface CartProviderProps {
  children: ReactNode
}

export function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('casalogy-cart')
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (error) {
        console.error('Error loading cart from localStorage:', error)
      }
    }
  }, [])

  // Save cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('casalogy-cart', JSON.stringify(items))
  }, [items])

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  const addItem = (newItem: Omit<CartItem, 'id'>) => {
    // Items with customization are always unique
    // Items without customization can be merged
    const existingItemIndex = !newItem.customization
      ? items.findIndex(
          item => item.productId === newItem.productId &&
                  item.color === newItem.color &&
                  item.size === newItem.size &&
                  !item.customization
        )
      : -1

    if (existingItemIndex > -1) {
      // Update quantity of existing item
      const updatedItems = [...items]
      const currentItem = updatedItems[existingItemIndex]
      const newQuantity = Math.min(currentItem.quantity + newItem.quantity, newItem.maxQuantity)
      updatedItems[existingItemIndex] = {
        ...currentItem,
        quantity: newQuantity
      }
      setItems(updatedItems)
    } else {
      // Add new item
      const cartItem: CartItem = {
        ...newItem,
        id: `${newItem.productId}-${newItem.color}-${newItem.size}-${Date.now()}`
      }
      setItems(prev => [...prev, cartItem])
    }

    // Track AddToCart event with Facebook Pixel
    trackAddToCart({
      name: newItem.productName,
      id: newItem.productId,
      price: newItem.price,
      currency: 'TND'
    })

    // Open cart dropdown briefly to show feedback
    setIsOpen(true)
  }

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }

    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          quantity: Math.min(quantity, item.maxQuantity)
        }
      }
      return item
    }))
  }

  const clearCart = () => {
    setItems([])
    setIsOpen(false)
  }

  const updateCustomization = (id: string, customization: string) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          customization: customization || undefined
        }
      }
      return item
    }))
  }

  const openCart = () => setIsOpen(true)
  const closeCart = () => setIsOpen(false)

  const value: CartContextType = {
    items,
    itemCount,
    totalAmount,
    addItem,
    removeItem,
    updateQuantity,
    updateCustomization,
    clearCart,
    isOpen,
    openCart,
    closeCart
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}