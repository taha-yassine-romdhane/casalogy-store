"use client"

import { useState, useEffect } from 'react'
import { Package, Eye, Truck, CheckCircle, Clock, X, User, Phone, MapPin, ShoppingBag, Calendar, Hash, Trash2, Edit, AlertTriangle, Download, FileSpreadsheet } from 'lucide-react'

interface OrderItem {
  id: string
  productId: string
  variantId?: string | null
  quantity: number
  price: number | string
  colorName?: string | null
  sizeName?: string | null
  product: {
    id: string
    name: string
    slug: string
  }
  variant?: {
    id: string
    quantity: number
    color: {
      colorName: string
      colorCode: string
    }
    size: {
      name: string
    }
  } | null
}

interface Order {
  id: string
  orderNumber: string
  subtotal: number | string
  shippingCost: number | string
  total: number | string
  status: string
  paymentStatus: string
  paymentMethod: string
  createdAt: string
  user: {
    firstName: string
    lastName: string
    email: string
    phone?: string
  }
  address: {
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

const statusOptions = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'PROCESSING', label: 'Processing' },
  { value: 'SHIPPED', label: 'Shipped' },
  { value: 'DELIVERED', label: 'Delivered' },
  { value: 'CANCELLED', label: 'Cancelled' },
  { value: 'RETURNED', label: 'Returned' }
]

const paymentStatusOptions = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'PAID', label: 'Paid' },
  { value: 'FAILED', label: 'Failed' },
  { value: 'REFUNDED', label: 'Refunded' }
]

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [editingOrder, setEditingOrder] = useState<Order | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [updating, setUpdating] = useState(false)
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders')
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      } else {
        console.error('Failed to fetch orders')
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatPrice = (price: number | string) => {
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price
    return `${numericPrice.toFixed(2)} TND`
  }

  const handleUpdateOrderStatus = async (orderId: string, status: string, paymentStatus?: string) => {
    try {
      setUpdating(true)
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status,
          ...(paymentStatus && { paymentStatus })
        })
      })

      if (response.ok) {
        const updatedOrder = await response.json()
        setOrders(orders.map(order => 
          order.id === orderId ? updatedOrder : order
        ))
        setEditingOrder(null)
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(updatedOrder)
        }
      } else {
        console.error('Failed to update order status')
        alert('Failed to update order status')
      }
    } catch (error) {
      console.error('Error updating order:', error)
      alert('Error updating order status')
    } finally {
      setUpdating(false)
    }
  }

  const handleDeleteOrder = async (orderId: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setOrders(orders.filter(order => order.id !== orderId))
        setDeleteConfirm(null)
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(null)
        }
      } else {
        console.error('Failed to delete order')
        alert('Failed to delete order')
      }
    } catch (error) {
      console.error('Error deleting order:', error)
      alert('Error deleting order')
    }
  }

  const handleExportExcel = async () => {
    try {
      setExporting(true)
      const response = await fetch('/api/admin/orders/export')

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `orders-export-${new Date().toISOString().split('T')[0]}.xlsx`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        alert('Failed to export orders')
      }
    } catch (error) {
      console.error('Error exporting orders:', error)
      alert('Error exporting orders')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Package className="w-6 h-6" />
            Orders ({orders.length})
          </h1>
          <p className="text-gray-600">View and manage customer orders</p>
        </div>
        <button
          onClick={handleExportExcel}
          disabled={exporting || orders.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {exporting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              Exporting...
            </>
          ) : (
            <>
              <FileSpreadsheet className="w-4 h-4" />
              Export Excel
            </>
          )}
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-lg shadow-sm border p-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading orders...</p>
          </div>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border p-12">
          <div className="text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600">Orders will appear here once customers start placing orders.</p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Hash className="w-4 h-4 text-gray-400 mr-1" />
                        <span className="font-mono text-sm font-medium text-gray-900">
                          {order.orderNumber}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {order.user.firstName} {order.user.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{order.user.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-900">
                          {formatDate(order.createdAt)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[order.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
                        {order.status.toLowerCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        {formatPrice(order.total)}
                      </div>
                      <div className="text-xs text-gray-500">
                        Subtotal: {formatPrice(order.subtotal)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <ShoppingBag className="w-4 h-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-900">
                          {order.items.reduce((total, item) => total + item.quantity, 0)} items
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded transition-colors"
                          title="View Order"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingOrder(order)}
                          className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded transition-colors"
                          title="Edit Status"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(order.id)}
                          className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded transition-colors"
                          title="Delete Order"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

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
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Order Info */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Customer Information
                    </h3>
                    <div className="space-y-2 text-sm text-gray-800">
                      <p><strong>Name:</strong> {selectedOrder.user.firstName} {selectedOrder.user.lastName}</p>
                      <p><strong>Email:</strong> {selectedOrder.user.email}</p>
                      {selectedOrder.user.phone && (
                        <p><strong>Phone:</strong> {selectedOrder.user.phone}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Shipping Address
                    </h3>
                    <div className="space-y-2 text-sm text-gray-800">
                      <p>{selectedOrder.address.address}</p>
                      <p>{selectedOrder.address.region}</p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4" />
                    Order Items
                  </h3>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Product</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Variant</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Quantity</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Current Stock</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Price</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {selectedOrder.items.map((item) => (
                          <tr key={item.id}>
                            <td className="px-4 py-3">
                              <div className="font-medium text-gray-900">{item.product.name}</div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="text-sm text-gray-800">
                                {/* Show variant info if available */}
                                {item.variant ? (
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                      <div
                                        className="w-4 h-4 rounded border border-gray-300"
                                        style={{ backgroundColor: item.variant.color.colorCode }}
                                        title={item.variant.color.colorName}
                                      />
                                      <span>{item.variant.color.colorName}</span>
                                    </div>
                                    <div className="text-gray-700">Size: {item.variant.size.name}</div>
                                  </div>
                                ) : (
                                  /* Fallback to colorName/sizeName from order item */
                                  <div className="space-y-1">
                                    {item.colorName && (
                                      <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded border bg-gray-300" />
                                        <span>{item.colorName}</span>
                                      </div>
                                    )}
                                    {item.sizeName && (
                                      <div className="text-gray-700">Size: {item.sizeName}</div>
                                    )}
                                    {!item.colorName && !item.sizeName && (
                                      <span className="text-red-500 text-xs">⚠️ No variant data</span>
                                    )}
                                  </div>
                                )}
                                {/* Show variant ID for debugging */}
                                {item.variantId && (
                                  <div className="text-xs text-gray-400 mt-1">
                                    ID: {item.variantId.slice(-8)}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-gray-800">{item.quantity}</td>
                            <td className="px-4 py-3">
                              {item.variant ? (
                                <div className="text-sm">
                                  <span className={`font-medium ${item.variant.quantity < 10 ? 'text-red-600' : item.variant.quantity < 20 ? 'text-orange-600' : 'text-green-600'}`}>
                                    {item.variant.quantity}
                                  </span>
                                  <span className="text-gray-500 ml-1">in stock</span>
                                </div>
                              ) : (
                                <span className="text-gray-400 text-xs">No variant</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-gray-800">{formatPrice(item.price)}</td>
                            <td className="px-4 py-3 font-medium text-gray-900">{formatPrice(item.quantity * parseFloat(item.price.toString()))}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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

                {/* Order Status */}
                <div className="flex items-center justify-between bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="font-medium text-gray-900">Order Status</div>
                      <div className="text-sm text-gray-800">
                        Placed on {formatDate(selectedOrder.createdAt)}
                      </div>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-sm font-semibold rounded-full ${statusColors[selectedOrder.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
                    {selectedOrder.status.toLowerCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Order Status Modal */}
      {editingOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-gray-900/75 backdrop-blur-sm transition-opacity" onClick={() => setEditingOrder(null)} />
            
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="px-6 py-4 border-b flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">
                  Edit Order Status
                </h2>
                <button
                  onClick={() => setEditingOrder(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order Number: {editingOrder.orderNumber}
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order Status
                  </label>
                  <select
                    defaultValue={editingOrder.status}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                    onChange={(e) => {
                      if (e.target.value !== editingOrder.status) {
                        handleUpdateOrderStatus(editingOrder.id, e.target.value)
                      }
                    }}
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Status
                  </label>
                  <select
                    defaultValue={editingOrder.paymentStatus}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                    onChange={(e) => {
                      if (e.target.value !== editingOrder.paymentStatus) {
                        handleUpdateOrderStatus(editingOrder.id, editingOrder.status, e.target.value)
                      }
                    }}
                  >
                    {paymentStatusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="px-6 py-4 border-t flex justify-end gap-3">
                <button
                  onClick={() => setEditingOrder(null)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  disabled={updating}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-gray-900/75 backdrop-blur-sm transition-opacity" onClick={() => setDeleteConfirm(null)} />
            
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Delete Order</h2>
                    <p className="text-sm text-gray-600">This action cannot be undone.</p>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-6">
                  Are you sure you want to delete this order? This will permanently remove the order and all associated data.
                </p>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDeleteOrder(deleteConfirm)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Delete Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}