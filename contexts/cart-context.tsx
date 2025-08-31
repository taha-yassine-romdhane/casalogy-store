"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

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
}

interface CartContextType {
  items: CartItem[]
  itemCount: number
  totalAmount: number
  addItem: (item: Omit<CartItem, 'id'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
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
    const existingItemIndex = items.findIndex(
      item => item.productId === newItem.productId && 
               item.color === newItem.color && 
               item.size === newItem.size
    )

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

  const openCart = () => setIsOpen(true)
  const closeCart = () => setIsOpen(false)

  const value: CartContextType = {
    items,
    itemCount,
    totalAmount,
    addItem,
    removeItem,
    updateQuantity,
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