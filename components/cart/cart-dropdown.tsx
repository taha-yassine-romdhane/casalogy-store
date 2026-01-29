"use client"

import { useCart } from '@/contexts/cart-context'
import Link from 'next/link'
import { Plus, Minus, Trash2, X, ShoppingBag, Pencil } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface CartDropdownProps {
  isOpen: boolean
  onClose: () => void
}

export default function CartDropdown({ isOpen, onClose }: CartDropdownProps) {
  const { items, itemCount, totalAmount, updateQuantity, removeItem } = useCart()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Close dropdown when clicking outside - only on desktop
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Only handle on desktop
      if (!isMobile) {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          const target = event.target as Element
          // Don't close if clicking on the cart button itself
          if (!target.closest('[data-cart-button]')) {
            onClose()
          }
        }
      }
    }

    if (isOpen && !isMobile) {
      // Use timeout to prevent immediate closing when opening
      const timer = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside)
      }, 100)
      
      return () => {
        clearTimeout(timer)
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [isOpen, onClose, isMobile])

  // Only prevent scroll on mobile when dropdown is open
  useEffect(() => {
    if (isOpen && isMobile) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, isMobile])

  if (!isOpen) return null

  return (
    <>
      {/* Mobile Overlay - only show on mobile */}
      {isMobile && (
        <div className="fixed inset-0 bg-gray-900/75 backdrop-blur-sm z-40" onClick={onClose} />
      )}
      
      {/* Desktop Dropdown / Mobile Slide-in */}
      <div
        ref={dropdownRef}
        className={`
          /* Desktop styles */
          hidden lg:block
          ${isOpen ? 'lg:block' : 'lg:hidden'}
          absolute top-full right-0 w-96 mt-2 rounded-lg
          max-h-[80vh] bg-white shadow-xl border border-gray-200
          transform transition-all duration-200 z-[60]
          ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}
        `}
      >
        {/* Desktop Content */}
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">
                Shopping Cart ({itemCount})
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto max-h-96">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <ShoppingBag className="w-12 h-12 text-gray-300 mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h4>
                <p className="text-gray-500 text-center mb-6">
                  Add some medical scrubs and accessories to get started
                </p>
                <Link
                  href="/scrubs"
                  onClick={onClose}
                  className="bg-[#282828] text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Shop Scrubs
                </Link>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                    {/* Product Image */}
                    <div className="w-16 h-16 bg-gray-200 rounded-md flex-shrink-0 flex items-center justify-center">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.productName}
                          className="w-full h-full object-cover rounded-md"
                        />
                      ) : (
                        <ShoppingBag className="w-8 h-8 text-gray-400" />
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/products/${item.productSlug}`}
                        onClick={onClose}
                        className="font-medium text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 text-sm"
                      >
                        {item.productName}
                      </Link>
                      <div className="text-xs text-gray-600 mt-1">
                        <span>{item.color}</span>
                        {item.color && item.size && <span className="mx-1">•</span>}
                        <span>{item.size}</span>
                      </div>
                      {item.customization && (
                        <div className="flex items-center gap-1 mt-1 text-xs text-blue-600">
                          <Pencil className="w-3 h-3" />
                          <span className="truncate max-w-[120px]">Customized</span>
                        </div>
                      )}
                      <div className="text-sm font-semibold text-gray-900 mt-1">
                        {item.price} TND
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-3 h-3 text-gray-600" />
                        </button>
                        <span className="text-sm font-medium px-2 py-1 bg-white rounded border min-w-[2rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                          disabled={item.quantity >= item.maxQuantity}
                        >
                          <Plus className="w-3 h-3 text-gray-600" />
                        </button>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1 hover:bg-red-100 rounded transition-colors ml-2"
                        >
                          <Trash2 className="w-3 h-3 text-red-500" />
                        </button>
                      </div>
                    </div>

                    {/* Item Total */}
                    <div className="text-right flex-shrink-0">
                      <div className="font-semibold text-gray-900">
                        {(item.price * item.quantity).toFixed(2)} TND
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-gray-200 p-4 space-y-4">
              {/* Total */}
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900">Subtotal:</span>
                <span className="font-bold text-xl text-[#282828]">
                  {totalAmount.toFixed(2)} TND
                </span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Link
                  href="/cart"
                  onClick={onClose}
                  className="w-full bg-gray-100 text-gray-900 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center font-medium"
                >
                  View Cart ({itemCount})
                </Link>
                <Link
                  href="/checkout"
                  onClick={onClose}
                  className="w-full bg-[#282828] text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center font-medium"
                >
                  Checkout
                </Link>
              </div>

              {/* Free Shipping Notice */}
              {totalAmount < 200 && (
                <div className="text-xs text-gray-600 text-center pt-2 border-t border-gray-100">
                  Add {(200 - totalAmount).toFixed(2)} TND more for free shipping
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Slide-in */}
      <div
        className={`
          lg:hidden fixed inset-x-0 bottom-0 top-auto z-50
          max-h-[90vh] bg-white rounded-t-2xl
          transform transition-transform duration-300 ease-out
          ${isOpen ? 'translate-y-0' : 'translate-y-full'}
        `}
        style={{ display: typeof window !== 'undefined' && window.innerWidth >= 1024 ? 'none' : 'block' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">
              Shopping Cart ({itemCount})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto max-h-[50vh]">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <ShoppingBag className="w-12 h-12 text-gray-300 mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h4>
              <p className="text-gray-500 text-center mb-6">
                Add some medical scrubs and accessories to get started
              </p>
              <Link
                href="/scrubs"
                onClick={onClose}
                className="bg-[#282828] text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Shop Scrubs
              </Link>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                  {/* Product Image */}
                  <div className="w-16 h-16 bg-gray-200 rounded-md flex-shrink-0 flex items-center justify-center">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.productName}
                        className="w-full h-full object-cover rounded-md"
                      />
                    ) : (
                      <ShoppingBag className="w-8 h-8 text-gray-400" />
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${item.productSlug}`}
                      onClick={onClose}
                      className="font-medium text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 text-sm"
                    >
                      {item.productName}
                    </Link>
                    <div className="text-xs text-gray-600 mt-1">
                      <span>{item.color}</span>
                      {item.color && item.size && <span className="mx-1">•</span>}
                      <span>{item.size}</span>
                    </div>
                    {item.customization && (
                      <div className="flex items-center gap-1 mt-1 text-xs text-blue-600">
                        <Pencil className="w-3 h-3" />
                        <span className="truncate max-w-[120px]">Customized</span>
                      </div>
                    )}
                    <div className="text-sm font-semibold text-gray-900 mt-1">
                      {item.price} TND
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-3 h-3 text-gray-600" />
                      </button>
                      <span className="text-sm font-medium px-2 py-1 bg-white rounded border min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                        disabled={item.quantity >= item.maxQuantity}
                      >
                        <Plus className="w-3 h-3 text-gray-600" />
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1 hover:bg-red-100 rounded transition-colors ml-2"
                      >
                        <Trash2 className="w-3 h-3 text-red-500" />
                      </button>
                    </div>
                  </div>

                  {/* Item Total */}
                  <div className="text-right flex-shrink-0">
                    <div className="font-semibold text-gray-900">
                      {(item.price * item.quantity).toFixed(2)} TND
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 p-4 space-y-4">
            {/* Total */}
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-900">Subtotal:</span>
              <span className="font-bold text-xl text-[#282828]">
                {totalAmount.toFixed(2)} TND
              </span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link
                href="/cart"
                onClick={onClose}
                className="w-full bg-gray-100 text-gray-900 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center font-medium"
              >
                View Cart ({itemCount})
              </Link>
              <Link
                href="/checkout"
                onClick={onClose}
                className="w-full bg-[#282828] text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center font-medium"
              >
                Checkout
              </Link>
            </div>

            {/* Free Shipping Notice */}
            {totalAmount < 200 && (
              <div className="text-xs text-gray-600 text-center pt-2 border-t border-gray-100">
                Add {(200 - totalAmount).toFixed(2)} TND more for free shipping
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}