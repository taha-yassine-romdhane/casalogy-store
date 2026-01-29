"use client"

import { useState, useEffect } from 'react'
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Ticket,
  Loader2,
  Calendar,
  Percent,
  DollarSign,
  Copy,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  AlertCircle
} from 'lucide-react'

interface PromoCode {
  id: string
  code: string
  description?: string
  discountType: 'PERCENTAGE' | 'FIXED'
  discountValue: number
  minOrderAmount?: number
  maxDiscount?: number
  usageLimit?: number
  usageCount: number
  perUserLimit?: number
  startDate?: string
  endDate?: string
  isActive: boolean
  createdAt: string
  _count?: {
    orders: number
  }
}

export default function PromoCodesPage() {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingCode, setEditingCode] = useState<PromoCode | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'PERCENTAGE' as 'PERCENTAGE' | 'FIXED',
    discountValue: '',
    minOrderAmount: '',
    maxDiscount: '',
    usageLimit: '',
    perUserLimit: '',
    startDate: '',
    endDate: '',
    isActive: true
  })

  useEffect(() => {
    fetchPromoCodes()
  }, [])

  const fetchPromoCodes = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/promo-codes')
      if (response.ok) {
        const data = await response.json()
        setPromoCodes(data)
      }
    } catch (error) {
      console.error('Error fetching promo codes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const url = editingCode
        ? `/api/admin/promo-codes/${editingCode.id}`
        : '/api/admin/promo-codes'

      const response = await fetch(url, {
        method: editingCode ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          discountValue: formData.discountValue || undefined,
          minOrderAmount: formData.minOrderAmount || undefined,
          maxDiscount: formData.maxDiscount || undefined,
          usageLimit: formData.usageLimit || undefined,
          perUserLimit: formData.perUserLimit || undefined,
          startDate: formData.startDate || undefined,
          endDate: formData.endDate || undefined
        })
      })

      if (response.ok) {
        await fetchPromoCodes()
        closeModal()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to save promo code')
      }
    } catch (error) {
      console.error('Error saving promo code:', error)
      alert('Failed to save promo code')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/promo-codes/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchPromoCodes()
        setDeleteConfirm(null)
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to delete promo code')
      }
    } catch (error) {
      console.error('Error deleting promo code:', error)
      alert('Failed to delete promo code')
    }
  }

  const toggleActive = async (promoCode: PromoCode) => {
    try {
      const response = await fetch(`/api/admin/promo-codes/${promoCode.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !promoCode.isActive })
      })

      if (response.ok) {
        await fetchPromoCodes()
      }
    } catch (error) {
      console.error('Error toggling promo code:', error)
    }
  }

  const openCreateModal = () => {
    setEditingCode(null)
    setFormData({
      code: '',
      description: '',
      discountType: 'PERCENTAGE',
      discountValue: '',
      minOrderAmount: '',
      maxDiscount: '',
      usageLimit: '',
      perUserLimit: '',
      startDate: '',
      endDate: '',
      isActive: true
    })
    setShowModal(true)
  }

  const openEditModal = (promoCode: PromoCode) => {
    setEditingCode(promoCode)
    setFormData({
      code: promoCode.code,
      description: promoCode.description || '',
      discountType: promoCode.discountType,
      discountValue: promoCode.discountValue.toString(),
      minOrderAmount: promoCode.minOrderAmount?.toString() || '',
      maxDiscount: promoCode.maxDiscount?.toString() || '',
      usageLimit: promoCode.usageLimit?.toString() || '',
      perUserLimit: promoCode.perUserLimit?.toString() || '',
      startDate: promoCode.startDate ? new Date(promoCode.startDate).toISOString().split('T')[0] : '',
      endDate: promoCode.endDate ? new Date(promoCode.endDate).toISOString().split('T')[0] : '',
      isActive: promoCode.isActive
    })
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingCode(null)
  }

  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedCode(code)
      setTimeout(() => setCopiedCode(null), 2000)
    } catch (error) {
      console.error('Failed to copy code:', error)
    }
  }

  const toggleRowExpand = (id: string) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedRows(newExpanded)
  }

  const filteredCodes = promoCodes.filter(code =>
    code.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    code.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const isCodeExpired = (endDate?: string) => {
    if (!endDate) return false
    return new Date(endDate) < new Date()
  }

  const isCodeNotStarted = (startDate?: string) => {
    if (!startDate) return false
    return new Date(startDate) > new Date()
  }

  const getStatusBadge = (code: PromoCode) => {
    if (!code.isActive) {
      return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">Inactive</span>
    }
    if (isCodeExpired(code.endDate)) {
      return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-600">Expired</span>
    }
    if (isCodeNotStarted(code.startDate)) {
      return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-600">Scheduled</span>
    }
    if (code.usageLimit && code.usageCount >= code.usageLimit) {
      return <span className="px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-600">Limit Reached</span>
    }
    return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-600">Active</span>
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Promo Codes</h1>
          <p className="text-gray-600 mt-1">Manage discount codes for your store</p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Promo Code
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search promo codes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Ticket className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{promoCodes.length}</p>
              <p className="text-sm text-gray-600">Total Codes</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Check className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {promoCodes.filter(c => c.isActive && !isCodeExpired(c.endDate)).length}
              </p>
              <p className="text-sm text-gray-600">Active</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Percent className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {promoCodes.filter(c => c.discountType === 'PERCENTAGE').length}
              </p>
              <p className="text-sm text-gray-600">Percentage</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {promoCodes.reduce((sum, c) => sum + (c._count?.orders || c.usageCount), 0)}
              </p>
              <p className="text-sm text-gray-600">Total Uses</p>
            </div>
          </div>
        </div>
      </div>

      {/* Promo Codes List */}
      {filteredCodes.length === 0 ? (
        <div className="bg-white rounded-lg p-8 text-center border border-gray-200">
          <Ticket className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No promo codes found</h3>
          <p className="text-gray-600 mb-4">
            {searchQuery ? 'Try a different search term' : 'Create your first promo code to get started'}
          </p>
          {!searchQuery && (
            <button
              onClick={openCreateModal}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Promo Code
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-gray-900">Code</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-gray-900">Discount</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-gray-900">Usage</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-gray-900">Valid Period</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-gray-900">Status</th>
                  <th className="text-right px-4 py-3 text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCodes.map((code) => (
                  <tr key={code.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-semibold text-gray-900">{code.code}</span>
                        <button
                          onClick={() => copyCode(code.code)}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                          title="Copy code"
                        >
                          {copiedCode === code.code ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                      {code.description && (
                        <p className="text-sm text-gray-500 mt-1">{code.description}</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {code.discountType === 'PERCENTAGE' ? (
                          <>
                            <Percent className="w-4 h-4 text-purple-600" />
                            <span className="font-semibold text-gray-900">{code.discountValue}%</span>
                          </>
                        ) : (
                          <>
                            <span className="font-semibold text-gray-900">{code.discountValue} TND</span>
                          </>
                        )}
                      </div>
                      {code.minOrderAmount && (
                        <p className="text-xs text-gray-500 mt-1">Min: {code.minOrderAmount} TND</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-gray-900">
                        {code._count?.orders || code.usageCount}
                        {code.usageLimit && <span className="text-gray-500"> / {code.usageLimit}</span>}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm">
                        {code.startDate || code.endDate ? (
                          <div className="flex items-center gap-1 text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {code.startDate ? new Date(code.startDate).toLocaleDateString() : '...'}
                              {' - '}
                              {code.endDate ? new Date(code.endDate).toLocaleDateString() : '...'}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-500">No date limit</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {getStatusBadge(code)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => toggleActive(code)}
                          className={`p-2 rounded-lg transition-colors ${
                            code.isActive
                              ? 'bg-green-100 text-green-600 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                          title={code.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {code.isActive ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => openEditModal(code)}
                          className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(code.id)}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
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

          {/* Mobile Cards */}
          <div className="lg:hidden divide-y divide-gray-200">
            {filteredCodes.map((code) => (
              <div key={code.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-semibold text-gray-900">{code.code}</span>
                      <button
                        onClick={() => copyCode(code.code)}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                      >
                        {copiedCode === code.code ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                      {getStatusBadge(code)}
                    </div>
                    {code.description && (
                      <p className="text-sm text-gray-500 mt-1">{code.description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => toggleRowExpand(code.id)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    {expandedRows.has(code.id) ? (
                      <ChevronUp className="w-5 h-5 text-gray-600" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-600" />
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1">
                    {code.discountType === 'PERCENTAGE' ? (
                      <>
                        <Percent className="w-4 h-4 text-purple-600" />
                        <span className="font-semibold">{code.discountValue}%</span>
                      </>
                    ) : (
                      <span className="font-semibold">{code.discountValue} TND</span>
                    )}
                  </div>
                  <span className="text-gray-400">|</span>
                  <span className="text-sm text-gray-600">
                    Used: {code._count?.orders || code.usageCount}
                    {code.usageLimit && ` / ${code.usageLimit}`}
                  </span>
                </div>

                {expandedRows.has(code.id) && (
                  <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                    {code.minOrderAmount && (
                      <div className="text-sm">
                        <span className="text-gray-500">Min Order:</span>
                        <span className="ml-2 text-gray-900">{code.minOrderAmount} TND</span>
                      </div>
                    )}
                    {code.maxDiscount && (
                      <div className="text-sm">
                        <span className="text-gray-500">Max Discount:</span>
                        <span className="ml-2 text-gray-900">{code.maxDiscount} TND</span>
                      </div>
                    )}
                    {(code.startDate || code.endDate) && (
                      <div className="text-sm flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span>
                          {code.startDate ? new Date(code.startDate).toLocaleDateString() : '...'}
                          {' - '}
                          {code.endDate ? new Date(code.endDate).toLocaleDateString() : '...'}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-2">
                      <button
                        onClick={() => toggleActive(code)}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                          code.isActive
                            ? 'bg-green-100 text-green-600'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {code.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => openEditModal(code)}
                        className="flex-1 py-2 bg-blue-100 text-blue-600 rounded-lg text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(code.id)}
                        className="flex-1 py-2 bg-red-100 text-red-600 rounded-lg text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingCode ? 'Edit Promo Code' : 'Create Promo Code'}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Promo Code *
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="e.g., SUMMER20"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g., Summer sale discount"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Discount Type & Value */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount Type *
                  </label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value as 'PERCENTAGE' | 'FIXED' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED">Fixed Amount (TND)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount Value *
                  </label>
                  <input
                    type="number"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                    placeholder={formData.discountType === 'PERCENTAGE' ? '10' : '20'}
                    min="0"
                    max={formData.discountType === 'PERCENTAGE' ? '100' : undefined}
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Min Order & Max Discount */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Min Order Amount (TND)
                  </label>
                  <input
                    type="number"
                    value={formData.minOrderAmount}
                    onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
                    placeholder="0"
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Discount (TND)
                  </label>
                  <input
                    type="number"
                    value={formData.maxDiscount}
                    onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                    placeholder="No limit"
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">For percentage discounts</p>
                </div>
              </div>

              {/* Usage Limits */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Usage Limit
                  </label>
                  <input
                    type="number"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                    placeholder="Unlimited"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Per User Limit
                  </label>
                  <input
                    type="number"
                    value={formData.perUserLimit}
                    onChange={(e) => setFormData({ ...formData, perUserLimit: e.target.value })}
                    placeholder="Unlimited"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Active */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                  Active (code can be used)
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : editingCode ? (
                    'Update'
                  ) : (
                    'Create'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-full">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Delete Promo Code?</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this promo code? If it has been used in orders, it will be deactivated instead.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
