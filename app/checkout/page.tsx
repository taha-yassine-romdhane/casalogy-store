"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useCart } from '@/contexts/cart-context'
import { useAuth } from '@/contexts/auth-context'
import { ShoppingBag, CreditCard, Truck, ArrowLeft, Lock, MapPin, User, Mail, Phone, CheckCircle, Copy, Home, Ticket, X, Loader2, Pencil } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { trackInitiateCheckout, trackPurchase } from '@/lib/facebook-pixel'

interface CheckoutForm {
  email: string
  firstName: string
  lastName: string
  phone: string
  address: string
  city: string
  governorate: string
  paymentMethod: 'cash'
}

const tunisianGovernorates = [
  'Tunis', 'Ariana', 'Ben Arous', 'Manouba', 'Nabeul', 'Zaghouan', 'Bizerte',
  'Béja', 'Jendouba', 'Kef', 'Siliana', 'Kairouan', 'Kasserine', 'Sidi Bouzid',
  'Sousse', 'Monastir', 'Mahdia', 'Sfax', 'Gafsa', 'Tozeur', 'Kebili',
  'Gabès', 'Medenine', 'Tataouine'
]

export default function CheckoutPage() {
  const { items, totalAmount, itemCount, clearCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [userAddress, setUserAddress] = useState<any>(null)
  const [form, setForm] = useState<CheckoutForm>({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    governorate: '',
    paymentMethod: 'cash'
  })
  const [errors, setErrors] = useState<Partial<CheckoutForm>>({})

const shippingCost = totalAmount >= 200 ? 0 : 8

  // Promo code state
  const [promoCode, setPromoCode] = useState('')
  const [promoCodeInput, setPromoCodeInput] = useState('')
  const [promoCodeLoading, setPromoCodeLoading] = useState(false)
  const [promoCodeError, setPromoCodeError] = useState('')
  const [appliedPromo, setAppliedPromo] = useState<{
    id: string
    code: string
    discountType: string
    discountValue: number
    description?: string
  } | null>(null)
  const [discountAmount, setDiscountAmount] = useState(0)

  const finalTotal = totalAmount - discountAmount + shippingCost

  const [showSuccess, setShowSuccess] = useState(false)
  const [copied, setCopied] = useState(false)
  const [orderNumber] = useState(() => 
    `CAS-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substr(2, 3).toUpperCase()}`
  )

  const copyOrderNumber = async () => {
    try {
      await navigator.clipboard.writeText(orderNumber)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy order number:', err)
    }
  }

  const goToHome = () => {
    router.push('/')
  }

  useEffect(() => {
    if (items.length === 0 && !showSuccess) {
      router.push('/cart')
    } else if (items.length > 0) {
      // Track InitiateCheckout when user reaches checkout page
      trackInitiateCheckout({
        value: finalTotal,
        currency: 'TND',
        items: items.map(item => ({
          id: item.productId,
          name: item.productName,
          quantity: item.quantity,
          price: item.price
        }))
      })
    }
  }, [items.length, router, showSuccess, finalTotal, items])

  // Fetch user data and address when logged in
  useEffect(() => {
    if (user) {
      // Auto-fill user information
      setForm(prev => ({
        ...prev,
        email: user.email || '',
        firstName: user.firstName || '',
        lastName: user.lastName || ''
      }))

      // Fetch user's address
      fetchUserAddress()
    }
  }, [user])

  const fetchUserAddress = async () => {
    try {
      const response = await fetch('/api/user/address')
      if (response.ok) {
        const data = await response.json()
        if (data.address) {
          setUserAddress(data.address)
          // Auto-fill address fields
          setForm(prev => ({
            ...prev,
            address: data.address.street || '',
            city: data.address.city || '',
            governorate: data.address.state || ''
          }))
        }
      }
    } catch (error) {
      console.error('Error fetching user address:', error)
    }
  }

  const applyPromoCode = async () => {
    if (!promoCodeInput.trim()) {
      setPromoCodeError('Please enter a promo code')
      return
    }

    setPromoCodeLoading(true)
    setPromoCodeError('')

    try {
      const response = await fetch('/api/promo-codes/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: promoCodeInput.trim().toUpperCase(),
          subtotal: totalAmount,
          userId: user?.id
        })
      })

      const data = await response.json()

      if (data.valid) {
        setAppliedPromo(data.promoCode)
        setDiscountAmount(data.discountAmount)
        setPromoCode(data.promoCode.code)
        setPromoCodeInput('')
      } else {
        setPromoCodeError(data.error || 'Invalid promo code')
      }
    } catch (error) {
      console.error('Error validating promo code:', error)
      setPromoCodeError('Failed to validate promo code')
    } finally {
      setPromoCodeLoading(false)
    }
  }

  const removePromoCode = () => {
    setAppliedPromo(null)
    setDiscountAmount(0)
    setPromoCode('')
    setPromoCodeError('')
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<CheckoutForm> = {}

    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Invalid email format'
    
    if (!form.firstName) newErrors.firstName = 'First name is required'
    if (!form.lastName) newErrors.lastName = 'Last name is required'
    if (!form.phone) newErrors.phone = 'Phone number is required'
    else if (!/^[0-9]{8}$/.test(form.phone.replace(/\s+/g, ''))) newErrors.phone = 'Invalid phone number (8 digits required)'
    
    if (!form.address) newErrors.address = 'Address is required'
    if (!form.city) newErrors.city = 'City is required'
    if (!form.governorate) newErrors.governorate = 'Governorate is required'


    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof CheckoutForm, value: string) => {
    // Prevent editing first and last name if user is logged in
    if (user && (field === 'firstName' || field === 'lastName')) {
      return
    }
    
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {
      // Resolve variantIds for all cart items
      const itemsWithVariantIds = await Promise.all(
        items.map(async (item) => {
          try {
            // Find the variant ID based on product, color, and size
            const response = await fetch(`/api/products/${item.productSlug}`)
            if (!response.ok) {
              throw new Error(`Failed to fetch product details for ${item.productSlug}`)
            }

            const productData = await response.json()
            const product = productData.product || productData // Handle both wrapped and unwrapped responses

            console.log(`🔍 Looking for variant: ${item.productName} - ${item.color} - ${item.size}`)
            console.log(`📋 Available colors:`, product.colorVariants?.map((cv: any) => cv.colorName) || 'None')

            // Find the variant that matches the color and size
            let variant = null

            // Search through colorVariants structure
            for (const colorVariant of product.colorVariants || []) {
              if (colorVariant.colorName === item.color) {
                console.log(`✅ Found matching color: ${colorVariant.colorName}`)
                console.log(`📏 Available sizes:`, colorVariant.sizes?.map((s: any) => s.sizeName) || 'None')

                // Found matching color, now find matching size
                const sizeVariant = colorVariant.sizes?.find((s: any) =>
                  s.sizeName === item.size
                )
                if (sizeVariant) {
                  variant = sizeVariant
                  console.log(`✅ Found matching variant:`, { id: variant.id, size: variant.sizeName, quantity: variant.quantity })
                  break
                } else {
                  console.log(`❌ Size '${item.size}' not found in available sizes`)
                }
              }
            }

            if (!variant) {
              throw new Error(`Variant not found for ${item.productName} - ${item.color} - ${item.size}`)
            }

            return {
              productId: item.productId,
              variantId: variant.id, // This should be the size variant ID
              quantity: item.quantity,
              price: item.price,
              colorName: item.color,
              sizeName: item.size,
              customization: item.customization || null
            }
          } catch (error) {
            console.error(`Error resolving variant for item:`, item, error)
            // Fallback: create order item without variantId
            return {
              productId: item.productId,
              variantId: null,
              quantity: item.quantity,
              price: item.price,
              colorName: item.color,
              sizeName: item.size,
              customization: item.customization || null
            }
          }
        })
      )

      // Prepare order data
      const orderData = {
        orderNumber,
        email: form.email || null,
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        address: form.address,
        city: form.city,
        governorate: form.governorate,
        items: itemsWithVariantIds,
        subtotal: totalAmount,
        shippingCost: 0, // Shipping is external service, not included in order
        discountAmount: discountAmount,
        total: totalAmount - discountAmount, // Product total minus discount
        promoCodeId: appliedPromo?.id || null,
        promoCodeUsed: appliedPromo?.code || null
      }

      console.log('Order data with variants:', orderData)

      // Save order to database
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      })

      if (response.ok) {
        // Track Purchase event with Facebook Pixel
        trackPurchase({
          orderId: orderNumber,
          value: totalAmount - discountAmount, // Track actual paid amount
          currency: 'TND',
          items: items.map(item => ({
            id: item.productId,
            name: item.productName,
            category: '', // Add category if available
            quantity: item.quantity,
            price: item.price
          }))
        })

        // Clear cart and show success dialog
        clearCart()
        setShowSuccess(true)
      } else {
        const errorData = await response.json()
        console.error('Failed to create order:', errorData)
        alert(`Failed to create order: ${errorData.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (items.length === 0 && !showSuccess) {
    return null
  }

  return (
    <>
      {/* Success Notification Dialog */}
      {showSuccess && (
        <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md mx-4 text-center border border-gray-200 shadow-2xl">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-[#282828] mb-4">Order Placed Successfully!</h2>
            <p className="text-gray-600 mb-4">
              Thank you for your order. Please save your order number:
            </p>
            
            {/* Order Number with Copy Button */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Order Number</p>
              <div className="flex items-center justify-center gap-3">
                <p className="font-mono text-xl font-semibold text-[#282828]">
                  {orderNumber}
                </p>
                <button
                  onClick={copyOrderNumber}
                  className="p-2 bg-[#282828] text-white rounded-lg hover:bg-gray-800 transition-colors"
                  title="Copy order number"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              {copied && (
                <p className="text-sm text-green-600 mt-2">✓ Copied to clipboard!</p>
              )}
            </div>

            <p className="text-sm text-gray-600 mb-6">
              You'll receive an email confirmation shortly. Keep this order number for tracking your purchase.
            </p>

            {/* Return to Home Button */}
            <button
              onClick={goToHome}
              className="w-full bg-[#282828] text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors font-semibold flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Return to Home
            </button>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* Back Button */}
        <Link 
          href="/cart"
          className="inline-flex items-center text-[#282828] hover:opacity-70 mb-8"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Cart
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Checkout Form */}
          <div>
            <h1 className="text-3xl font-bold text-[#282828] mb-8">Checkout</h1>
            
            {/* Logged In User Notice */}
            {user && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800">
                  <span className="font-semibold">Logged in as:</span> {user.firstName} {user.lastName} ({user.email})
                  <br />
                  <span className="text-xs mt-1">Your account information has been automatically filled. Name fields cannot be changed.</span>
                </p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Contact Information */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-center mb-4">
                  <Mail className="w-5 h-5 text-gray-600 mr-2" />
                  <h2 className="text-lg font-semibold text-[#282828]">Contact Information</h2>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-[#282828] ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="your.email@example.com"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-center mb-4">
                  <User className="w-5 h-5 text-gray-600 mr-2" />
                  <h2 className="text-lg font-semibold text-[#282828]">Personal Information</h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name * {user && <span className="text-xs text-gray-500">(Cannot be changed)</span>}
                    </label>
                    <input
                      type="text"
                      value={form.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      readOnly={!!user}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none ${
                        user ? 'bg-gray-100 cursor-not-allowed' : 'focus:border-[#282828]'
                      } ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Ahmed"
                    />
                    {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name * {user && <span className="text-xs text-gray-500">(Cannot be changed)</span>}
                    </label>
                    <input
                      type="text"
                      value={form.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      readOnly={!!user}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none ${
                        user ? 'bg-gray-100 cursor-not-allowed' : 'focus:border-[#282828]'
                      } ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Ben Ali"
                    />
                    {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-[#282828] ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="12 345 678"
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-center mb-4">
                  <MapPin className="w-5 h-5 text-gray-600 mr-2" />
                  <h2 className="text-lg font-semibold text-[#282828]">Shipping Address</h2>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address *
                    </label>
                    <input
                      type="text"
                      value={form.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-[#282828] ${
                        errors.address ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="123 Avenue Habib Bourguiba"
                    />
                    {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      value={form.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-[#282828] ${
                        errors.city ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Tunis"
                    />
                    {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Governorate *
                    </label>
                    <select
                      value={form.governorate}
                      onChange={(e) => handleInputChange('governorate', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-[#282828] ${
                        errors.governorate ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select Governorate</option>
                      {tunisianGovernorates.map(gov => (
                        <option key={gov} value={gov}>{gov}</option>
                      ))}
                    </select>
                    {errors.governorate && <p className="text-red-500 text-sm mt-1">{errors.governorate}</p>}
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-center mb-4">
                  <CreditCard className="w-5 h-5 text-gray-600 mr-2" />
                  <h2 className="text-lg font-semibold text-[#282828]">Payment Method</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center">
                      <div className="flex-1">
                        <span className="text-base font-semibold text-[#282828]">Cash on Delivery</span>
                        <p className="text-sm text-gray-600 mt-1">
                          Pay with cash when your order is delivered to your doorstep
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#282828] text-white py-4 rounded-lg hover:bg-gray-800 transition-colors font-semibold flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing Order...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5 mr-2" />
                    Complete Order - {finalTotal.toFixed(2)} TND
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 sticky top-28 z-10">
              <h2 className="text-lg font-semibold text-[#282828] mb-4">Order Summary</h2>
              
              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.productName}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <ShoppingBag className="w-8 h-8 text-gray-400" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-[#282828] text-sm line-clamp-2">
                        {item.productName}
                      </h4>
                      <p className="text-xs text-gray-700 mt-1">
                        {item.color} • {item.size} • Qty: {item.quantity}
                      </p>
                      {item.customization && (
                        <div className="flex items-start gap-1 mt-1 bg-blue-50 rounded p-1.5">
                          <Pencil className="w-3 h-3 text-blue-600 flex-shrink-0 mt-0.5" />
                          <p className="text-xs text-blue-700 line-clamp-2">
                            {item.customization}
                          </p>
                        </div>
                      )}
                      <p className="font-semibold text-[#282828] mt-1">
                        {(item.price * item.quantity).toFixed(2)} TND
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo Code */}
              <div className="mb-6 border-t border-gray-200 pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <Ticket className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-[#282828]">Promo Code</span>
                </div>

                {appliedPromo ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-mono font-semibold text-green-700">{appliedPromo.code}</p>
                        <p className="text-xs text-green-600 mt-0.5">
                          {appliedPromo.discountType === 'PERCENTAGE'
                            ? `${appliedPromo.discountValue}% off`
                            : `${appliedPromo.discountValue} TND off`}
                          {appliedPromo.description && ` - ${appliedPromo.description}`}
                        </p>
                      </div>
                      <button
                        onClick={removePromoCode}
                        className="p-1 hover:bg-green-100 rounded transition-colors"
                        title="Remove promo code"
                      >
                        <X className="w-4 h-4 text-green-700" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoCodeInput}
                        onChange={(e) => {
                          setPromoCodeInput(e.target.value.toUpperCase())
                          setPromoCodeError('')
                        }}
                        placeholder="Enter code"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#282828] font-mono"
                      />
                      <button
                        onClick={applyPromoCode}
                        disabled={promoCodeLoading || !promoCodeInput.trim()}
                        className="px-4 py-2 bg-[#282828] text-white text-sm rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {promoCodeLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          'Apply'
                        )}
                      </button>
                    </div>
                    {promoCodeError && (
                      <p className="text-xs text-red-600">{promoCodeError}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Pricing */}
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#282828] font-medium">Subtotal ({itemCount} items)</span>
                  <span className="font-semibold text-[#282828]">{totalAmount.toFixed(2)} TND</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600 font-medium flex items-center">
                      <Ticket className="w-4 h-4 mr-1" />
                      Discount ({appliedPromo?.code})
                    </span>
                    <span className="font-semibold text-green-600">-{discountAmount.toFixed(2)} TND</span>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span className="text-[#282828] font-medium flex items-center">
                    <Truck className="w-4 h-4 mr-1" />
                    Shipping (Estimate)
                  </span>
                  <span className="font-semibold text-[#282828]">
                    {shippingCost === 0 ? 'Free' : `${shippingCost.toFixed(2)} TND`}
                  </span>
                </div>

                <div className="flex justify-between text-lg font-bold text-[#282828] pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span>{finalTotal.toFixed(2)} TND</span>
                </div>
              </div>

              {/* Shipping Notice */}
              <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-xs text-yellow-800">
                  <strong>Note:</strong> Shipping cost shown is an estimate. Final shipping will be arranged and paid separately through our delivery partner.
                </p>
              </div>
              
              {/* Free Shipping Notice */}
              {totalAmount < 200 && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    Add {(200 - totalAmount).toFixed(2)} TND more for free shipping!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        </div>
      </div>
    </>
  )
}