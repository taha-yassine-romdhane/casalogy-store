"use client"

import Link from 'next/link'
import { CheckCircle, Package, Truck, Mail, ArrowLeft } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function CheckoutSuccessPage() {
  const [orderNumber] = useState(() => 
    `CAS-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substr(2, 3).toUpperCase()}`
  )

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-3xl mx-auto px-4 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-[#282828] mb-4">
            Order Placed Successfully!
          </h1>
          <p className="text-gray-600 mb-8">
            Thank you for your order. We've received your payment and will begin processing your order shortly.
          </p>

          {/* Order Details */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div>
                <h3 className="font-semibold text-[#282828] mb-2">Order Number</h3>
                <p className="text-gray-600 font-mono text-lg">{orderNumber}</p>
              </div>
              <div>
                <h3 className="font-semibold text-[#282828] mb-2">Order Date</h3>
                <p className="text-gray-600">{new Date().toLocaleDateString('en-GB')}</p>
              </div>
            </div>
          </div>

          {/* What's Next */}
          <div className="text-left mb-8">
            <h2 className="text-xl font-bold text-[#282828] mb-6 text-center">What happens next?</h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#282828] mb-1">Order Confirmation</h3>
                  <p className="text-gray-600 text-sm">
                    You'll receive an email confirmation with your order details within the next few minutes.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Package className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#282828] mb-1">Order Processing</h3>
                  <p className="text-gray-600 text-sm">
                    We'll prepare your medical scrubs with care. Processing typically takes 1-2 business days.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Truck className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#282828] mb-1">Shipping & Delivery</h3>
                  <p className="text-gray-600 text-sm">
                    Your order will be shipped via our trusted delivery partners. 
                    Delivery within Tunisia typically takes 2-5 business days.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Important Information */}
          <div className="bg-blue-50 rounded-lg p-4 mb-8 text-left">
            <h3 className="font-semibold text-blue-900 mb-2">Important Information</h3>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• Please keep your order number for tracking and support</li>
              <li>• You'll receive tracking information once your order ships</li>
              <li>• For urgent inquiries, contact us with your order number</li>
              <li>• Free returns within 30 days of delivery</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/scrubs"
              className="bg-[#282828] text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-semibold"
            >
              Continue Shopping
            </Link>
            <Link
              href="/"
              className="bg-gray-100 text-[#282828] px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-semibold flex items-center justify-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </div>

          {/* Contact Information */}
          <div className="mt-12 pt-8 border-t border-gray-200 text-sm text-gray-600">
            <p className="mb-2">
              <strong>Need Help?</strong> Contact our customer service team
            </p>
            <p>Email: support@casalogy.tn | Phone: +216 71 123 456</p>
          </div>
        </div>
      </div>
    </div>
  )
}