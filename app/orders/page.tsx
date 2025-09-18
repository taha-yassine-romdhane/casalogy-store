"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Package, Calendar, Truck, CheckCircle, Clock, Eye, Hash, ShoppingBag, MapPin } from "lucide-react"
import Image from "next/image"

interface OrderItem {
  id: string
  productId: string
  variantId?: string | null
  quantity: number
  price: number
  colorName?: string | null
  sizeName?: string | null
  product: {
    id: string
    name: string
    slug: string
    description: string | null
    shortDescription: string | null
    sku: string
    price: number
    comparePrice: number | null
    costPrice: number | null
    trackQuantity: boolean
    isActive: boolean
    isFeatured: boolean
    fabricType: string | null
    pocketCount: number | null
    gender: string | null
    metaTitle: string | null
    metaDescription: string | null
    createdAt: string
    updatedAt: string
    categoryId: string
    colors: {
      images: {
        url: string
        altText: string | null
        isMain: boolean
      }[]
    }[]
  }
  variant?: {
    color: {
      colorName: string
      colorCode: string
    }
    size: {
      name: string
      label: string
    }
  } | null
}

interface Order {
  id: string
  orderNumber: string
  subtotal: number
  shippingCost: number
  total: number
  status: string
  paymentStatus: string
  paymentMethod: string
  createdAt: string
  updatedAt: string
  address: {
    firstName: string
    lastName: string
    phone: string
    address: string
    region: string
  }
  items: OrderItem[]
}

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  PROCESSING: 'bg-purple-100 text-purple-800',
  SHIPPED: 'bg-green-100 text-green-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
  RETURNED: 'bg-gray-100 text-gray-800'
}

const statusIcons = {
  PENDING: Clock,
  CONFIRMED: CheckCircle,
  PROCESSING: Package,
  SHIPPED: Truck,
  DELIVERED: CheckCircle,
  CANCELLED: Package,
  RETURNED: Package
}

export default function OrdersPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (user) {
      fetchOrders()
    }
  }, [user])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/user/orders')
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      } else {
        console.error('Failed to fetch orders')
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setOrdersLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatPrice = (price: number | string) => {
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price
    return `${numericPrice.toFixed(2)} TND`
  }

  const getProductMainImage = (product: OrderItem['product']) => {
    // Get the main image from the first color's images
    if (product.colors && product.colors.length > 0) {
      const firstColor = product.colors[0]
      if (firstColor.images && firstColor.images.length > 0) {
        return firstColor.images[0].url
      }
    }
    return '/placeholder-product.jpg' // Fallback image
  }

  if (isLoading || ordersLoading) {
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
          <h1 className="text-3xl font-bold text-[#282828] mb-8">My Orders ({orders.length})</h1>

          {/* No Orders State */}
          {orders.length === 0 ? (
            <div className="text-center py-16">
              <Package className="mx-auto h-24 w-24 text-gray-400 mb-6" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">No orders yet</h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                You haven&apos;t placed any orders yet. Start shopping to see your order history here.
              </p>
              <button
                onClick={() => router.push('/')}
                className="bg-[#282828] text-white px-8 py-3 rounded-lg hover:opacity-90 transition-opacity"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            /* Orders List */
            <div className="space-y-6">
              {orders.map((order) => {
                const StatusIcon = statusIcons[order.status as keyof typeof statusIcons] || Package

                return (
                  <div key={order.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Hash className="w-4 h-4 text-gray-400" />
                          <h3 className="text-lg font-semibold text-[#282828]">
                            {order.orderNumber}
                          </h3>
                        </div>
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Placed on {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-[#282828] mb-1">
                          {formatPrice(order.total)}
                        </p>
                        <div className="flex items-center gap-2 justify-end">
                          <StatusIcon className="w-4 h-4" />
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[order.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
                            {order.status.toLowerCase()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Order Items Preview */}
                    <div className="space-y-2 mb-4">
                      {order.items.slice(0, 2).map((item) => (
                        <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                          <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
                            <Image
                              src={getProductMainImage(item.product)}
                              alt={item.product.name}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-[#282828] truncate">
                              {item.product.name}
                            </h4>
                            <div className="text-sm text-gray-600">
                              {item.variant ? (
                                <>
                                  <span className="inline-flex items-center gap-1">
                                    <div
                                      className="w-3 h-3 rounded border border-gray-300"
                                      style={{ backgroundColor: item.variant.color.colorCode }}
                                    />
                                    {item.variant.color.colorName}
                                  </span>
                                  {' • '}
                                  Size: {item.variant.size.name}
                                  {' • '}
                                </>
                              ) : (
                                item.colorName && item.sizeName && (
                                  <>
                                    {item.colorName} • Size: {item.sizeName} •
                                  </>
                                )
                              )}
                              Qty: {item.quantity}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-[#282828]">
                              {formatPrice(item.price * item.quantity)}
                            </p>
                          </div>
                        </div>
                      ))}

                      {/* Show more items indicator */}
                      {order.items.length > 2 && (
                        <div className="text-sm text-gray-500 text-center py-2">
                          +{order.items.length - 2} more item{order.items.length - 2 > 1 ? 's' : ''}
                        </div>
                      )}
                    </div>

                    {/* Order Actions */}
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="flex-1 border border-[#282828] text-[#282828] py-2 px-4 rounded-lg hover:bg-[#282828] hover:text-white transition-colors flex items-center justify-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-gray-900/75 backdrop-blur-sm transition-opacity" onClick={() => setSelectedOrder(null)} />

            <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-screen overflow-y-auto">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  Order {selectedOrder.orderNumber}
                </h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Order Info */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      Order Information
                    </h3>
                    <div className="space-y-2 text-sm text-gray-800">
                      <p><strong>Status:</strong> {selectedOrder.status}</p>
                      <p><strong>Payment:</strong> {selectedOrder.paymentStatus}</p>
                      <p><strong>Method:</strong> {selectedOrder.paymentMethod}</p>
                      <p><strong>Placed:</strong> {formatDate(selectedOrder.createdAt)}</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Delivery Address
                    </h3>
                    <div className="space-y-1 text-sm text-gray-800">
                      <p>{selectedOrder.address.firstName} {selectedOrder.address.lastName}</p>
                      <p>{selectedOrder.address.phone}</p>
                      <p>{selectedOrder.address.address}</p>
                      <p>{selectedOrder.address.region}</p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4" />
                    Order Items ({selectedOrder.items.length})
                  </h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                          <Image
                            src={getProductMainImage(item.product)}
                            alt={item.product.name}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.product.name}</h4>
                          <div className="text-sm text-gray-600 mt-1">
                            {item.variant ? (
                              <>
                                <div className="flex items-center gap-2 mb-1">
                                  <div
                                    className="w-4 h-4 rounded border border-gray-300"
                                    style={{ backgroundColor: item.variant.color.colorCode }}
                                  />
                                  <span>{item.variant.color.colorName}</span>
                                </div>
                                <p>Size: {item.variant.size.label} ({item.variant.size.name})</p>
                              </>
                            ) : (
                              item.colorName && item.sizeName && (
                                <div>{item.colorName} • Size: {item.sizeName}</div>
                              )
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                          <p className="font-semibold text-gray-900">{formatPrice(item.price * item.quantity)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Order Summary</h3>
                  <div className="space-y-2 text-gray-800">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>{formatPrice(selectedOrder.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping:</span>
                      <span>{formatPrice(selectedOrder.shippingCost)}</span>
                    </div>
                    <hr className="my-2" />
                    <div className="flex justify-between font-bold text-lg text-gray-900">
                      <span>Total:</span>
                      <span>{formatPrice(selectedOrder.total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}