"use client"

import { useState, useEffect } from 'react'
import { Package, Users, ShoppingCart, TrendingUp, Eye, Plus, GraduationCap } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface DashboardStats {
  totalProducts: number
  totalUsers: number
  totalOrders: number
  revenue: number
  pendingStudentVerifications: number
  growth: {
    products: number
    users: number
    orders: number
    revenue: number
  }
  recentActivity: Array<{
    id: string
    description: string
    time: string
    type: string
  }>
}

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/dashboard')
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data')
        }
        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error('Error fetching stats:', error)
        setError('Failed to load dashboard data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#282828] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="p-6 flex items-center justify-center min-h-96">
        <div className="text-center">
          <p className="text-red-600">{error || 'Failed to load dashboard data'}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-[#282828] text-white rounded-lg hover:bg-gray-800"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to Casalogy Admin Panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Products</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalProducts}</p>
              <p className={`text-sm ${stats.growth.products >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.growth.products >= 0 ? '+' : ''}{stats.growth.products} this month
              </p>
            </div>
            <Package className="w-12 h-12 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
              <p className={`text-sm ${stats.growth.users >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.growth.users >= 0 ? '+' : ''}{stats.growth.users} this month
              </p>
            </div>
            <Users className="w-12 h-12 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
              <p className={`text-sm ${stats.growth.orders >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.growth.orders >= 0 ? '+' : ''}{stats.growth.orders} this month
              </p>
            </div>
            <ShoppingCart className="w-12 h-12 text-purple-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Revenue</p>
              <p className="text-3xl font-bold text-gray-900">{Number(stats.revenue).toFixed(2)} TND</p>
              <p className={`text-sm ${stats.growth.revenue >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.growth.revenue >= 0 ? '+' : ''}{Number(stats.growth.revenue).toFixed(2)} TND this month
              </p>
            </div>
            <TrendingUp className="w-12 h-12 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Actions</h3>
          <div className="space-y-3">
            <button 
              onClick={() => router.push('/admin/products')}
              className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </button>
            <button 
              onClick={() => router.push('/admin/orders')}
              className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Orders
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.push('/admin/student-verification')}>
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
            <GraduationCap className="w-5 h-5 mr-2 text-blue-600" />
            Student Verifications
          </h3>
          <div className="text-center py-4">
            <p className={`text-2xl font-bold ${stats.pendingStudentVerifications > 0 ? 'text-orange-600' : 'text-gray-900'}`}>
              {stats.pendingStudentVerifications}
            </p>
            <p className="text-sm text-gray-600">Pending verifications</p>
            {stats.pendingStudentVerifications > 0 && (
              <p className="text-xs text-orange-600 mt-1">Requires attention</p>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">System Status</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Database</span>
              <span className="flex items-center text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Online
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">API</span>
              <span className="flex items-center text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Healthy
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {stats.recentActivity.length > 0 ? (
              stats.recentActivity.map((activity, index) => (
                <div key={activity.id} className={`flex items-center justify-between py-3 ${index < stats.recentActivity.length - 1 ? 'border-b' : ''}`}>
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-3 ${
                      activity.type === 'unread' ? 'bg-red-500' : 'bg-green-500'
                    }`}></div>
                    <span className="text-gray-700">{activity.description}</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(activity.time).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No recent activity</p>
              </div>
            )}
          </div>
          {stats.recentActivity.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <button 
                onClick={() => router.push('/admin/messages')}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View all messages →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}