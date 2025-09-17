"use client"

import { useCart } from '@/contexts/cart-context'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Minus, Trash2, ArrowLeft, ShoppingBag, Truck } from 'lucide-react'

export default function CartPage() {
  const { items, itemCount, totalAmount, updateQuantity, removeItem, clearCart } = useCart()

  const shippingCost = totalAmount >= 200 ? 0 : 15
  const finalTotal = totalAmount + shippingCost

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 lg:px-8">
          <div className="text-center">
            <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-[#282828] mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">
              Add some medical scrubs and accessories to get started
            </p>
            <Link
              href="/scrubs"
              className="bg-[#282828] text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors font-semibold"
            >
              Shop Scrubs
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#282828]">Shopping Cart</h1>
            <p className="text-gray-600 mt-2">{itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart</p>
          </div>
          <Link
            href="/scrubs"
            className="flex items-center text-[#282828] hover:opacity-70 transition-opacity"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Continue Shopping
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
              {items.map((item) => (
                <div key={item.id} className="p-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Product Image */}
                    <div className="w-28 h-28 sm:w-24 sm:h-24 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center mx-auto sm:mx-0">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.productName}
                          width={112}
                          height={112}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <ShoppingBag className="w-8 h-8 text-gray-400" />
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/products/${item.productSlug}`}
                        className="font-semibold text-base sm:text-lg text-[#282828] hover:text-blue-600 transition-colors line-clamp-2"
                      >
                        {item.productName}
                      </Link>
                      
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2 text-sm text-gray-600">
                        <span>Color: <span className="font-medium text-gray-800">{item.color}</span></span>
                        <span>Size: <span className="font-medium text-gray-800">{item.size}</span></span>
                      </div>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-600">Quantity:</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              aria-label={`Decrease quantity of ${item.productName}`}
                              className="p-2.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200 disabled:opacity-50"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="w-4 h-4 text-gray-600" />
                            </button>
                            <span className="text-lg font-semibold text-[#282828] px-4 py-2 bg-gray-50 rounded-lg min-w-[3rem] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              aria-label={`Increase quantity of ${item.productName}`}
                              className="p-2.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200 disabled:opacity-50"
                              disabled={item.quantity >= item.maxQuantity}
                            >
                              <Plus className="w-4 h-4 text-gray-600" />
                            </button>
                          </div>
                        </div>

                        {/* Price and Remove */}
                        <div className="flex items-center justify-between sm:justify-end gap-4 w-full">
                          <div className="text-right">
                            <div className="text-lg font-bold text-[#282828]">
                              {(item.price * item.quantity).toFixed(2)} TND
                            </div>
                            <div className="text-sm text-gray-600">
                              {item.price} TND each
                            </div>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            aria-label={`Remove ${item.productName} from cart`}
                            className="p-2.5 sm:p-2 hover:bg-red-50 rounded-lg transition-colors text-red-500 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-200"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Clear Cart */}
            <div className="mt-6">
              <button
                onClick={clearCart}
                className="text-red-600 hover:text-red-800 font-medium transition-colors"
              >
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6 lg:sticky lg:top-8">
              <h2 className="text-xl font-bold text-[#282828] mb-6">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-[#282828] font-medium">Subtotal ({itemCount} items)</span>
                  <span className="font-semibold text-[#282828]">{totalAmount.toFixed(2)} TND</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-[#282828] font-medium flex items-center">
                    <Truck className="w-4 h-4 mr-2" />
                    Shipping
                  </span>
                  <span className="font-semibold text-[#282828]">
                    {shippingCost === 0 ? 'Free' : `${shippingCost.toFixed(2)} TND`}
                  </span>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-xl">
                    <span className="font-bold text-[#282828]">Total</span>
                    <span className="font-bold text-[#282828]">{finalTotal.toFixed(2)} TND</span>
                  </div>
                </div>
              </div>

              {/* Free Shipping Notice */}
              {totalAmount < 200 && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    Add {(200 - totalAmount).toFixed(2)} TND more for free shipping!
                  </p>
                </div>
              )}

              {/* Checkout Button */}
              <Link
                href="/checkout"
                className="w-full bg-[#282828] text-white py-4 px-6 rounded-lg hover:bg-gray-800 transition-colors font-semibold mt-6 block text-center"
              >
                Proceed to Checkout
              </Link>
              
              <Link
                href="/scrubs"
                className="w-full bg-gray-100 text-[#282828] py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors font-medium mt-3 block text-center"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}