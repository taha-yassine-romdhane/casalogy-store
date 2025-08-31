"use client"

import { useState } from 'react'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  Users, 
  ShoppingCart, 
  Package,
  Calendar,
  Download,
  Filter,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Target,
  Clock,
  Globe
} from 'lucide-react'

interface AnalyticsData {
  revenue: {
    current: number
    previous: number
    change: number
  }
  orders: {
    current: number
    previous: number
    change: number
  }
  customers: {
    current: number
    previous: number
    change: number
  }
  avgOrderValue: {
    current: number
    previous: number
    change: number
  }
}

interface TopProduct {
  id: string
  name: string
  category: string
  sales: number
  revenue: number
  trend: number
}

interface CustomerSegment {
  type: string
  count: number
  percentage: number
  revenue: number
}

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('30days')
  
  // Sample analytics data
  const [analytics] = useState<AnalyticsData>({
    revenue: {
      current: 24750.80,
      previous: 18650.40,
      change: 32.7
    },
    orders: {
      current: 145,
      previous: 112,
      change: 29.5
    },
    customers: {
      current: 87,
      previous: 65,
      change: 33.8
    },
    avgOrderValue: {
      current: 170.70,
      previous: 166.50,
      change: 2.5
    }
  })

  // Sample top products data
  const [topProducts] = useState<TopProduct[]>([
    {
      id: '1',
      name: 'Medical Scrubs - Navy Blue',
      category: 'Scrubs',
      sales: 45,
      revenue: 2025.00,
      trend: 15.2
    },
    {
      id: '2',
      name: 'Laboratory Coat - White',
      category: 'Lab Coats',
      sales: 32,
      revenue: 1920.00,
      trend: 8.7
    },
    {
      id: '3',
      name: 'Surgical Mask (Pack of 50)',
      category: 'PPE',
      sales: 78,
      revenue: 1170.00,
      trend: 25.3
    },
    {
      id: '4',
      name: 'Nursing Shoes - Comfortable',
      category: 'Footwear',
      sales: 28,
      revenue: 1680.00,
      trend: -3.2
    },
    {
      id: '5',
      name: 'Stethoscope - Professional',
      category: 'Equipment',
      sales: 15,
      revenue: 2250.00,
      trend: 12.4
    }
  ])

  // Sample customer segments
  const [customerSegments] = useState<CustomerSegment[]>([
    {
      type: 'Medical Professionals',
      count: 52,
      percentage: 59.8,
      revenue: 16890.50
    },
    {
      type: 'Medical Students',
      count: 28,
      percentage: 32.2,
      revenue: 5420.30
    },
    {
      type: 'Healthcare Institutions',
      count: 7,
      percentage: 8.0,
      revenue: 2440.00
    }
  ])

  const formatCurrency = (amount: number): string => {
    return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const formatPercentage = (value: number): string => {
    const sign = value >= 0 ? '+' : ''
    return `${sign}${value.toFixed(1)}%`
  }

  const getChangeIcon = (change: number) => {
    return change >= 0 ? (
      <ArrowUpRight className="w-4 h-4 text-green-600" />
    ) : (
      <ArrowDownRight className="w-4 h-4 text-red-600" />
    )
  }

  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-600' : 'text-red-600'
  }

  const getTrendIcon = (trend: number) => {
    return trend >= 0 ? (
      <TrendingUp className="w-3 h-3 text-green-600" />
    ) : (
      <TrendingDown className="w-3 h-3 text-red-600" />
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h1>
          <p className="text-gray-800">Sales reports, customer insights, and business metrics</p>
        </div>
        <div className="flex gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
            <option value="3months">Last 3 months</option>
            <option value="6months">Last 6 months</option>
            <option value="1year">Last year</option>
          </select>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
            {getChangeIcon(analytics.revenue.change)}
          </div>
          <div>
            <p className="text-sm text-gray-800 mb-1">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-800">{formatCurrency(analytics.revenue.current)}</p>
            <div className="flex items-center mt-2">
              <span className={`text-sm font-medium ${getChangeColor(analytics.revenue.change)}`}>
                {formatPercentage(analytics.revenue.change)}
              </span>
              <span className="text-sm text-gray-600 ml-2">vs last period</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            {getChangeIcon(analytics.orders.change)}
          </div>
          <div>
            <p className="text-sm text-gray-800 mb-1">Total Orders</p>
            <p className="text-2xl font-bold text-gray-800">{analytics.orders.current.toLocaleString()}</p>
            <div className="flex items-center mt-2">
              <span className={`text-sm font-medium ${getChangeColor(analytics.orders.change)}`}>
                {formatPercentage(analytics.orders.change)}
              </span>
              <span className="text-sm text-gray-600 ml-2">vs last period</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            {getChangeIcon(analytics.customers.change)}
          </div>
          <div>
            <p className="text-sm text-gray-800 mb-1">New Customers</p>
            <p className="text-2xl font-bold text-gray-800">{analytics.customers.current}</p>
            <div className="flex items-center mt-2">
              <span className={`text-sm font-medium ${getChangeColor(analytics.customers.change)}`}>
                {formatPercentage(analytics.customers.change)}
              </span>
              <span className="text-sm text-gray-600 ml-2">vs last period</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Target className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            {getChangeIcon(analytics.avgOrderValue.change)}
          </div>
          <div>
            <p className="text-sm text-gray-800 mb-1">Avg. Order Value</p>
            <p className="text-2xl font-bold text-gray-800">{formatCurrency(analytics.avgOrderValue.current)}</p>
            <div className="flex items-center mt-2">
              <span className={`text-sm font-medium ${getChangeColor(analytics.avgOrderValue.change)}`}>
                {formatPercentage(analytics.avgOrderValue.change)}
              </span>
              <span className="text-sm text-gray-600 ml-2">vs last period</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Revenue Trend</h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <BarChart3 className="w-4 h-4" />
              Chart View
            </div>
          </div>
          
          {/* Placeholder chart */}
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Revenue chart will be displayed here</p>
              <p className="text-sm text-gray-500 mt-2">Integration with charting library needed</p>
            </div>
          </div>
        </div>

        {/* Customer Segments */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Customer Segments</h3>
          <div className="space-y-4">
            {customerSegments.map((segment, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-800">{segment.type}</span>
                    <span className="text-sm text-gray-600">{segment.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${segment.percentage}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-600">{segment.count} customers</span>
                    <span className="text-xs font-medium text-gray-800">{formatCurrency(segment.revenue)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Products and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Top Products</h3>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View All
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Sales
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Trend
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-800">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {product.category}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {product.sales}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">
                      {formatCurrency(product.revenue)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {getTrendIcon(product.trend)}
                        <span className={`ml-1 text-sm ${product.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {Math.abs(product.trend)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Insights */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Quick Insights</h3>
          
          <div className="space-y-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-4">
                <Clock className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Peak Sales Time</p>
                <p className="text-sm text-gray-600">2:00 PM - 4:00 PM (38% of daily sales)</p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-4">
                <Globe className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Top Location</p>
                <p className="text-sm text-gray-600">New York, NY (24% of orders)</p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg mr-4">
                <Package className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Best Category</p>
                <p className="text-sm text-gray-600">Medical Scrubs (42% of revenue)</p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg mr-4">
                <Activity className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Conversion Rate</p>
                <p className="text-sm text-gray-600">3.2% (+0.4% vs last month)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}