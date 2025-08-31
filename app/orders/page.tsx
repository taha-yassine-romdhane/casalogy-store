"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Package, Calendar, Truck, CheckCircle, Clock } from "lucide-react"

export default function OrdersPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#282828]"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-[#282828] mb-8">My Orders</h1>
          
          {/* No Orders State */}
          <div className="text-center py-16">
            <Package className="mx-auto h-24 w-24 text-gray-400 mb-6" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">No orders yet</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              You haven't placed any orders yet. Start shopping to see your order history here.
            </p>
            <button 
              onClick={() => router.push('/')}
              className="bg-[#282828] text-white px-8 py-3 rounded-lg hover:opacity-90 transition-opacity"
            >
              Start Shopping
            </button>
          </div>

          {/* Orders List - This will be populated when orders exist */}
          <div className="hidden">
            <div className="space-y-6">
              {/* Order Item Example */}
              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-[#282828]">Order #12345</h3>
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Placed on March 15, 2024
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-[#282828]">350 TND</p>
                    <div className="flex items-center gap-2 text-sm">
                      <Truck className="w-4 h-4 text-blue-600" />
                      <span className="text-blue-600">In Transit</span>
                    </div>
                  </div>
                </div>
                
                {/* Order Items */}
                <div className="space-y-3">
                  <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1">
                      <h4 className="font-medium text-[#282828]">Medical Scrub Set - Navy Blue</h4>
                      <p className="text-sm text-gray-600">Size: M | Quantity: 1</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-[#282828]">120 TND</p>
                    </div>
                  </div>
                </div>
                
                {/* Order Actions */}
                <div className="flex gap-3 mt-4 pt-4 border-t border-gray-200">
                  <button className="flex-1 bg-[#282828] text-white py-2 px-4 rounded-lg hover:opacity-90 transition-opacity">
                    Track Order
                  </button>
                  <button className="flex-1 border border-[#282828] text-[#282828] py-2 px-4 rounded-lg hover:bg-[#282828] hover:text-white transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}