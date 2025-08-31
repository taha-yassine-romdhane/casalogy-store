"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Eye, EyeOff, Edit, Save, X, Plus, Trash2 } from "lucide-react"

export default function ProfilePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  
  // Profile editing state
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: ''
  })
  const [saving, setSaving] = useState(false)

  // Password change state
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })
  const [changingPassword, setChangingPassword] = useState(false)

  // Address management state
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [userAddress, setUserAddress] = useState(null)
  const [addressForm, setAddressForm] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Tunisia'
  })

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
    if (user) {
      setEditForm({
        firstName: user.firstName || '',
        lastName: user.lastName || ''
      })
      // Load user address if exists
      fetchAddress()
    }
  }, [user, isLoading, router])

  const fetchAddress = async () => {
    try {
      const response = await fetch('/api/user/address')
      if (response.ok) {
        const data = await response.json()
        setUserAddress(data.address)
        if (data.address) {
          setAddressForm({
            street: data.address.street || '',
            city: data.address.city || '',
            state: data.address.state || '',
            zipCode: data.address.zipCode || '',
            country: data.address.country || 'Tunisia'
          })
        }
      }
    } catch (error) {
      console.error('Error fetching address:', error)
    }
  }

  const handleEditProfile = () => {
    setIsEditing(true)
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      })

      if (response.ok) {
        setIsEditing(false)
        // Refresh user data
        window.location.reload()
      } else {
        throw new Error('Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Failed to update profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditForm({
      firstName: user.firstName || '',
      lastName: user.lastName || ''
    })
  }

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('New passwords do not match')
      return
    }

    if (passwordForm.newPassword.length < 6) {
      alert('New password must be at least 6 characters long')
      return
    }

    setChangingPassword(true)
    try {
      const response = await fetch('/api/user/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      })

      if (response.ok) {
        alert('Password changed successfully')
        setShowPasswordForm(false)
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to change password')
      }
    } catch (error) {
      console.error('Error changing password:', error)
      alert('Failed to change password. Please try again.')
    } finally {
      setChangingPassword(false)
    }
  }

  const handleManageAddresses = () => {
    setShowAddressForm(!showAddressForm)
  }

  const handleSaveAddress = async () => {
    try {
      const method = userAddress ? 'PUT' : 'POST'
      const url = '/api/user/address'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(addressForm),
      })

      if (response.ok) {
        await fetchAddress()
        setShowAddressForm(false)
        alert(userAddress ? 'Address updated successfully' : 'Address added successfully')
      } else {
        throw new Error('Failed to save address')
      }
    } catch (error) {
      console.error('Error saving address:', error)
      alert('Failed to save address. Please try again.')
    }
  }


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
      <div className="max-w-4xl mx-auto px-4 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-[#282828] mb-8">My Profile</h1>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Personal Information */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-[#282828]">Personal Information</h2>
                {!isEditing && (
                  <button
                    onClick={handleEditProfile}
                    className="p-2 text-gray-600 hover:text-[#282828] transition-colors"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                )}
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#282828]">First Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.firstName}
                      onChange={(e) => setEditForm({...editForm, firstName: e.target.value})}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#282828]"
                    />
                  ) : (
                    <p className="mt-1 text-lg text-[#282828]">{user.firstName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#282828]">Last Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.lastName}
                      onChange={(e) => setEditForm({...editForm, lastName: e.target.value})}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#282828]"
                    />
                  ) : (
                    <p className="mt-1 text-lg text-[#282828]">{user.lastName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#282828]">Email</label>
                  <p className="mt-1 text-lg text-[#282828]">{user.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#282828]">Account Type</label>
                  <p className="mt-1 text-lg text-[#282828]">
                    {user.role === 'CLIENT' ? 'Client' : user.role === 'ADMIN' ? 'Administrator' : user.role}
                  </p>
                </div>
                {user.isStudent && (
                  <div>
                    <label className="block text-sm font-medium text-[#282828]">Student Status</label>
                    {user.studentVerified ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Verified Student
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Verification Pending
                      </span>
                    )}
                  </div>
                )}
                
                {isEditing && (
                  <div className="flex gap-2 pt-4">
                    <button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="flex items-center gap-2 px-4 py-2 bg-[#282828] text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-[#282828]"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Account Actions */}
            <div>
              <h2 className="text-xl font-semibold text-[#282828] mb-4">Account Actions</h2>
              <div className="space-y-4">
                <button 
                  onClick={() => setShowPasswordForm(!showPasswordForm)}
                  className="w-full border border-[#282828] text-[#282828] py-3 px-4 rounded-lg hover:bg-[#282828] hover:text-white transition-colors"
                >
                  Change Password
                </button>
                <button 
                  onClick={handleManageAddresses}
                  className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {userAddress ? 'Edit Address' : 'Add Address'}
                </button>
              </div>

              {/* Password Change Form */}
              {showPasswordForm && (
                <div className="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <h3 className="text-lg font-semibold mb-4 text-[#282828]">Change Password</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[#282828]">Current Password</label>
                      <div className="relative">
                        <input
                          type={showPasswords.current ? "text" : "password"}
                          value={passwordForm.currentPassword}
                          onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:border-[#282828]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords({...showPasswords, current: !showPasswords.current})}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        >
                          {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#282828]">New Password</label>
                      <div className="relative">
                        <input
                          type={showPasswords.new ? "text" : "password"}
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:border-[#282828]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords({...showPasswords, new: !showPasswords.new})}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        >
                          {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#282828]">Confirm New Password</label>
                      <div className="relative">
                        <input
                          type={showPasswords.confirm ? "text" : "password"}
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:border-[#282828]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords({...showPasswords, confirm: !showPasswords.confirm})}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        >
                          {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleChangePassword}
                        disabled={changingPassword}
                        className="px-4 py-2 bg-[#282828] text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                      >
                        {changingPassword ? 'Changing...' : 'Change Password'}
                      </button>
                      <button
                        onClick={() => {
                          setShowPasswordForm(false)
                          setPasswordForm({
                            currentPassword: '',
                            newPassword: '',
                            confirmPassword: ''
                          })
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-[#282828]"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Address Management */}
          {showAddressForm && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-[#282828] mb-4">
                  {userAddress ? 'Edit Address' : 'Add Address'}
                </h2>
              </div>

              {/* Current Address Display */}
              {userAddress && (
                <div className="mb-6 p-4 border border-gray-200 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2 text-[#282828]">Current Address</h3>
                  <div>
                    <p className="font-medium text-[#282828]">{userAddress.street}</p>
                    <p className="text-[#282828]">
                      {userAddress.city}{userAddress.state ? `, ${userAddress.state}` : ''} {userAddress.zipCode}
                    </p>
                    <p className="text-[#282828]">{userAddress.country}</p>
                  </div>
                </div>
              )}

              {/* Address Form */}
              <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                <h3 className="text-lg font-semibold mb-4 text-[#282828]">
                  {userAddress ? 'Edit Address' : 'Add Address'}
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-[#282828]">Street Address</label>
                    <input
                      type="text"
                      value={addressForm.street}
                      onChange={(e) => setAddressForm({...addressForm, street: e.target.value})}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#282828]"
                      placeholder="123 Main Street"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#282828]">City</label>
                    <input
                      type="text"
                      value={addressForm.city}
                      onChange={(e) => setAddressForm({...addressForm, city: e.target.value})}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#282828]"
                      placeholder="Tunis"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#282828]">State/Region</label>
                    <input
                      type="text"
                      value={addressForm.state}
                      onChange={(e) => setAddressForm({...addressForm, state: e.target.value})}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#282828]"
                      placeholder="Tunis Governorate"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#282828]">Postal Code</label>
                    <input
                      type="text"
                      value={addressForm.zipCode}
                      onChange={(e) => setAddressForm({...addressForm, zipCode: e.target.value})}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#282828]"
                      placeholder="1000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#282828]">Country</label>
                    <select
                      value={addressForm.country}
                      onChange={(e) => setAddressForm({...addressForm, country: e.target.value})}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#282828]"
                    >
                      <option value="Tunisia">Tunisia</option>
                      <option value="Algeria">Algeria</option>
                      <option value="Morocco">Morocco</option>
                      <option value="Libya">Libya</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={handleSaveAddress}
                    className="px-4 py-2 bg-[#282828] text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    {userAddress ? 'Update Address' : 'Save Address'}
                  </button>
                  <button
                    onClick={() => {
                      setShowAddressForm(false)
                      if (userAddress) {
                        setAddressForm({
                          street: userAddress.street || '',
                          city: userAddress.city || '',
                          state: userAddress.state || '',
                          zipCode: userAddress.zipCode || '',
                          country: userAddress.country || 'Tunisia'
                        })
                      }
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-[#282828]"
                  >
                    Cancel
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* Quick Stats */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-xl font-semibold text-[#282828] mb-6">Account Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg text-center">
                <div className="text-2xl font-bold text-[#282828] mb-2">0</div>
                <div className="text-sm text-[#282828]">Total Orders</div>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg text-center">
                <div className="text-2xl font-bold text-[#282828] mb-2">0 TND</div>
                <div className="text-sm text-[#282828]">Total Spent</div>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg text-center">
                <div className="text-2xl font-bold text-[#282828] mb-2">0</div>
                <div className="text-sm text-[#282828]">Saved Items</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}