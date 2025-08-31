"use client"

import { useState, useEffect } from 'react'
import { 
  Users, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  ShoppingBag,
  UserCheck,
  UserX,
  Crown,
  GraduationCap,
  X
} from 'lucide-react'

interface Customer {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  region: string
  faculty?: string
  isActive: boolean
  isVerified: boolean
  isStudent: boolean
  studentVerified?: boolean
  totalOrders: number
  totalSpent: number
  lastOrderDate?: string
  registeredAt: string
}

interface CustomerStats {
  totalCustomers: number
  activeCustomers: number
  studentCustomers: number
  verifiedCustomers: number
}

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [stats, setStats] = useState<CustomerStats>({
    totalCustomers: 0,
    activeCustomers: 0,
    studentCustomers: 0,
    verifiedCustomers: 0
  })
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [deactivating, setDeactivating] = useState(false)
  const [viewingCustomer, setViewingCustomer] = useState<Customer | null>(null)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    region: '',
    isVerified: false
  })
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/admin/customers')
      const data = await response.json()
      
      if (data.success) {
        setCustomers(data.customers)
        setStats(data.stats)
      } else {
        console.error('Failed to fetch customers:', data.error)
      }
    } catch (error) {
      console.error('Error fetching customers:', error)
    } finally {
      setLoading(false)
    }
  }


  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = !statusFilter || 
      (statusFilter === 'active' && customer.isActive) ||
      (statusFilter === 'inactive' && !customer.isActive) ||
      (statusFilter === 'verified' && customer.isVerified) ||
      (statusFilter === 'unverified' && !customer.isVerified)
    
    const matchesType = !typeFilter ||
      (typeFilter === 'student' && customer.isStudent) ||
      (typeFilter === 'professional' && !customer.isStudent)
    
    return matchesSearch && matchesStatus && matchesType
  })

  const formatCurrency = (amount: number): string => {
    return `${amount.toFixed(2)} TND`
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusBadge = (isActive: boolean) => (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
      isActive 
        ? 'bg-green-100 text-green-800' 
        : 'bg-red-100 text-red-800'
    }`}>
      {isActive ? 'Active' : 'Inactive'}
    </span>
  )

  const getVerificationBadge = (isVerified: boolean) => (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
      isVerified 
        ? 'bg-blue-100 text-blue-800' 
        : 'bg-yellow-100 text-yellow-800'
    }`}>
      {isVerified ? 'Verified' : 'Pending'}
    </span>
  )

  const getCustomerTypeBadge = (isStudent: boolean, studentVerified?: boolean) => (
    isStudent ? (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
        studentVerified ? 'bg-purple-100 text-purple-800' : 'bg-yellow-100 text-yellow-800'
      }`}>
        {studentVerified ? 'Student (Verified)' : 'Student (Pending)'}
      </span>
    ) : (
      <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
        Professional
      </span>
    )
  )

  const handleDelete = async (customerId: string) => {
    setDeleting(true)
    
    try {
      const response = await fetch('/api/admin/customers', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerId }),
      })

      const data = await response.json()
      
      if (data.success) {
        // Refresh the customers list
        await fetchCustomers()
        alert('Customer deleted successfully')
      } else {
        alert(data.error || 'Failed to delete customer')
      }
    } catch (error) {
      console.error('Error deleting customer:', error)
      alert('Network error occurred')
    } finally {
      setDeleting(false)
      setDeleteConfirm(null)
    }
  }

  const handleToggleActive = async (customerId: string) => {
    const customer = customers.find(c => c.id === customerId)
    if (!customer) return
    
    setDeactivating(true)
    
    try {
      const response = await fetch('/api/admin/customers/deactivate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerId }),
      })

      const data = await response.json()
      
      if (data.success) {
        // Refresh the customers list
        await fetchCustomers()
        alert(data.message)
      } else {
        alert(data.error || 'Failed to update customer status')
      }
    } catch (error) {
      console.error('Error updating customer status:', error)
      alert('Network error occurred')
    } finally {
      setDeactivating(false)
      setDeleteConfirm(null)
    }
  }

  const handleView = (customer: Customer) => {
    setViewingCustomer(customer)
  }

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer)
    setEditForm({
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      region: customer.region,
      isVerified: customer.isVerified
    })
  }

  const handleUpdateCustomer = async () => {
    if (!editingCustomer) return
    
    setUpdating(true)
    
    try {
      const response = await fetch('/api/admin/customers/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: editingCustomer.id,
          ...editForm
        }),
      })

      const data = await response.json()
      
      if (data.success) {
        // Refresh the customers list
        await fetchCustomers()
        setEditingCustomer(null)
        alert('Customer updated successfully')
      } else {
        alert(data.error || 'Failed to update customer')
      }
    } catch (error) {
      console.error('Error updating customer:', error)
      alert('Network error occurred')
    } finally {
      setUpdating(false)
    }
  }

  // Use stats from API instead of calculating locally
  const { totalCustomers, activeCustomers, studentCustomers, verifiedCustomers } = stats

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Customer Management</h1>
          <p className="text-gray-800">Manage customer accounts and information</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-800">Total Customers</p>
              <p className="text-2xl font-bold text-gray-800">{totalCustomers}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-800">Active Customers</p>
              <p className="text-2xl font-bold text-gray-800">{activeCustomers}</p>
            </div>
            <UserCheck className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-800">Student Customers</p>
              <p className="text-2xl font-bold text-gray-800">{studentCustomers}</p>
            </div>
            <GraduationCap className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-800">Verified</p>
              <p className="text-2xl font-bold text-gray-800">{verifiedCustomers}</p>
            </div>
            <Crown className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search customers by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="verified">Verified</option>
              <option value="unverified">Unverified</option>
            </select>
            
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              <option value="professional">Professional</option>
              <option value="student">Student</option>
            </select>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {filteredCustomers.length === 0 ? (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter || typeFilter 
                ? 'Try adjusting your search or filter criteria.'
                : 'No customers have signed up yet.'
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Orders
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Total Spent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className={`hover:bg-gray-50 ${!customer.isActive ? 'opacity-60 bg-gray-25' : ''}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-gray-700" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-800 flex items-center gap-2">
                          {customer.firstName} {customer.lastName}
                          {!customer.isActive && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                              Inactive
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-800">
                          {customer.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    <div className="flex items-center mb-1">
                      <Phone className="w-3 h-3 mr-1 text-gray-400" />
                      {customer.phone}
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-3 h-3 mr-1 text-gray-400" />
                      {customer.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    <div className="flex items-center">
                      <MapPin className="w-3 h-3 mr-1 text-gray-400" />
                      {customer.region || 'N/A'}
                    </div>
                    {customer.faculty && (
                      <div className="text-xs text-gray-500 mt-1">
                        {customer.faculty}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {getCustomerTypeBadge(customer.isStudent, customer.studentVerified)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    <div className="flex items-center">
                      <ShoppingBag className="w-3 h-3 mr-1 text-gray-400" />
                      {customer.totalOrders}
                    </div>
                    {customer.lastOrderDate && (
                      <div className="text-xs text-gray-600">
                        Last: {formatDate(customer.lastOrderDate)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-800">
                    {formatCurrency(customer.totalSpent)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {getStatusBadge(customer.isActive)}
                      {getVerificationBadge(customer.isVerified)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleView(customer)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(customer)}
                        className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-50"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(customer.id)}
                        className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                        title="Delete"
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
        )}
      </div>

      {/* Delete/Deactivate Confirmation Modal */}
      {deleteConfirm && (() => {
        const customer = customers.find(c => c.id === deleteConfirm)
        const isActive = customer?.isActive ?? true
        
        return (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl max-w-md w-full mx-4 shadow-2xl">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Customer Account Action</h3>
              <p className="text-gray-600 mb-6">
                Choose an action for this customer account:
              </p>
              
              <div className="space-y-3 mb-6">
                {/* Activate/Deactivate Option */}
                <div className={`border rounded-lg p-4 ${
                  isActive 
                    ? 'border-orange-200 bg-orange-50' 
                    : 'border-green-200 bg-green-50'
                }`}>
                  <div className="flex items-start">
                    <div className="flex-1">
                      <h4 className={`font-medium ${
                        isActive ? 'text-orange-800' : 'text-green-800'
                      }`}>
                        {isActive ? 'Deactivate Account' : 'Activate Account'}
                      </h4>
                      <p className={`text-sm mt-1 ${
                        isActive ? 'text-orange-600' : 'text-green-600'
                      }`}>
                        {isActive 
                          ? 'Temporarily disable access. Account can be reactivated later. Orders and data remain intact.'
                          : 'Restore account access. Customer will be able to log in and place orders again.'
                        }
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Delete Option */}
                <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                  <div className="flex items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-red-800">Delete Permanently</h4>
                      <p className="text-sm text-red-600 mt-1">
                        Completely remove customer and all related data. This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => handleToggleActive(deleteConfirm)}
                  disabled={deactivating || deleting}
                  className={`w-full px-4 py-2 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
                    isActive 
                      ? 'bg-orange-600 hover:bg-orange-700' 
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {deactivating 
                    ? (isActive ? 'Deactivating...' : 'Activating...') 
                    : (isActive ? 'Deactivate Account' : 'Activate Account')
                  }
                </button>
                
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  disabled={deleting || deactivating}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {deleting ? 'Deleting...' : 'Delete Permanently'}
                </button>
                
                <button
                  onClick={() => setDeleteConfirm(null)}
                  disabled={deleting || deactivating}
                  className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )
      })()}

      {/* View Customer Modal */}
      {viewingCustomer && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-auto shadow-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Customer Details</h3>
                <button
                  onClick={() => setViewingCustomer(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">First Name</label>
                      <p className="mt-1 text-sm text-gray-900">{viewingCustomer.firstName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Last Name</label>
                      <p className="mt-1 text-sm text-gray-900">{viewingCustomer.lastName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <p className="mt-1 text-sm text-gray-900">{viewingCustomer.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <p className="mt-1 text-sm text-gray-900">{viewingCustomer.phone || 'N/A'}</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Address</label>
                      <p className="mt-1 text-sm text-gray-900">{viewingCustomer.address || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Region</label>
                      <p className="mt-1 text-sm text-gray-900">{viewingCustomer.region || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Account Information */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Account Information</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Account Status</label>
                      <div className="mt-1">
                        {getStatusBadge(viewingCustomer.isActive)}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Verification Status</label>
                      <div className="mt-1">
                        {getVerificationBadge(viewingCustomer.isVerified)}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Customer Type</label>
                      <div className="mt-1">
                        {getCustomerTypeBadge(viewingCustomer.isStudent, viewingCustomer.studentVerified)}
                      </div>
                    </div>
                    {viewingCustomer.faculty && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Faculty</label>
                        <p className="mt-1 text-sm text-gray-900">{viewingCustomer.faculty}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Statistics */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Order Statistics</h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Total Orders</p>
                      <p className="text-2xl font-bold text-gray-900">{viewingCustomer.totalOrders}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Total Spent</p>
                      <p className="text-2xl font-bold text-gray-900">{formatCurrency(viewingCustomer.totalSpent)}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Registered</p>
                      <p className="text-sm font-medium text-gray-900">{formatDate(viewingCustomer.registeredAt)}</p>
                      {viewingCustomer.lastOrderDate && (
                        <p className="text-xs text-gray-600 mt-1">
                          Last order: {formatDate(viewingCustomer.lastOrderDate)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Customer Modal */}
      {editingCustomer && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-auto shadow-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Edit Customer</h3>
                <button
                  onClick={() => setEditingCustomer(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <input
                      type="text"
                      value={editForm.firstName}
                      onChange={(e) => setEditForm({...editForm, firstName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <input
                      type="text"
                      value={editForm.lastName}
                      onChange={(e) => setEditForm({...editForm, lastName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="text"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <input
                    type="text"
                    value={editForm.address}
                    onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
                  <select
                    value={editForm.region}
                    onChange={(e) => setEditForm({...editForm, region: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select region</option>
                    <option value="tunis">Tunis</option>
                    <option value="ariana">Ariana</option>
                    <option value="ben-arous">Ben Arous</option>
                    <option value="manouba">Manouba</option>
                    <option value="nabeul">Nabeul</option>
                    <option value="zaghouan">Zaghouan</option>
                    <option value="bizerte">Bizerte</option>
                    <option value="beja">Béja</option>
                    <option value="jendouba">Jendouba</option>
                    <option value="kef">Le Kef</option>
                    <option value="siliana">Siliana</option>
                    <option value="kairouan">Kairouan</option>
                    <option value="kasserine">Kasserine</option>
                    <option value="sidi-bouzid">Sidi Bouzid</option>
                    <option value="sousse">Sousse</option>
                    <option value="monastir">Monastir</option>
                    <option value="mahdia">Mahdia</option>
                    <option value="sfax">Sfax</option>
                    <option value="gafsa">Gafsa</option>
                    <option value="tozeur">Tozeur</option>
                    <option value="kebili">Kébili</option>
                    <option value="gabes">Gabès</option>
                    <option value="medenine">Médenine</option>
                    <option value="tataouine">Tataouine</option>
                  </select>
                </div>
                
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={editForm.isVerified}
                      onChange={(e) => setEditForm({...editForm, isVerified: e.target.checked})}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Account Verified</span>
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end gap-4 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setEditingCustomer(null)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateCustomer}
                  disabled={updating}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {updating ? 'Updating...' : 'Update Customer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}