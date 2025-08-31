"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useCart } from '@/contexts/cart-context'
import { useAuth } from '@/contexts/auth-context'
import { ShoppingBag, CreditCard, Truck, ArrowLeft, Lock, MapPin, User, Mail, Phone, CheckCircle, Copy, Home } from 'lucide-react'
import { useRouter } from 'next/navigation'

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

  const shippingCost = totalAmount >= 200 ? 0 : 7
  const finalTotal = totalAmount + shippingCost

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
    }
  }, [items.length, router, showSuccess])

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
      // Prepare order data (shipping is handled externally, so we only save subtotal)
      const orderData = {
        orderNumber,
        email: form.email || null,
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        address: form.address,
        city: form.city,
        governorate: form.governorate,
        items: items.map(item => ({
          productId: item.productId,
          variantId: null, // For now, we'll handle variants separately or make them optional
          quantity: item.quantity,
          price: item.price,
          color: item.color,
          size: item.size
        })),
        subtotal: totalAmount,
        shippingCost: 0, // Shipping is external service, not included in order
        total: totalAmount // Only product total, shipping handled separately
      }
      
      // Save order to database
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      })
      
      if (response.ok) {
        // Clear cart and show success dialog
        clearCart()
        setShowSuccess(true)
      } else {
        console.error('Failed to create order')
        alert('Failed to create order. Please try again.')
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
                      <p className="font-semibold text-[#282828] mt-1">
                        {(item.price * item.quantity).toFixed(2)} TND
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pricing */}
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#282828] font-medium">Subtotal ({itemCount} items)</span>
                  <span className="font-semibold text-[#282828]">{totalAmount.toFixed(2)} TND</span>
                </div>
                
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