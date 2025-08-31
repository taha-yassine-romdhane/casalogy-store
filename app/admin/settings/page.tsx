"use client"

import { useState } from 'react'
import { 
  Settings as SettingsIcon, 
  Store, 
  CreditCard, 
  Truck, 
  Bell, 
  Shield, 
  Mail, 
  Globe, 
  Palette,
  Database,
  Users,
  Save,
  Eye,
  EyeOff,
  Check,
  X,
  AlertCircle,
  Info
} from 'lucide-react'

interface StoreSettings {
  storeName: string
  storeDescription: string
  storeUrl: string
  contactEmail: string
  contactPhone: string
  address: string
  city: string
  country: string
  currency: string
  timezone: string
}

interface PaymentSettings {
  stripeEnabled: boolean
  stripePublicKey: string
  stripeSecretKey: string
  paypalEnabled: boolean
  paypalClientId: string
  cashOnDelivery: boolean
}

interface ShippingSettings {
  freeShippingThreshold: number
  standardShipping: number
  expressShipping: number
  internationalShipping: number
}

interface NotificationSettings {
  emailNotifications: boolean
  orderUpdates: boolean
  stockAlerts: boolean
  customerMessages: boolean
  systemUpdates: boolean
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('store')
  const [showSecretKeys, setShowSecretKeys] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  // Store Settings
  const [storeSettings, setStoreSettings] = useState<StoreSettings>({
    storeName: 'Casalogy Healthcare Store',
    storeDescription: 'Professional medical wear and equipment for healthcare professionals and students',
    storeUrl: 'https://casalogy.com',
    contactEmail: 'support@casalogy.com',
    contactPhone: '+1 (555) 123-4567',
    address: '123 Medical Plaza, Suite 100',
    city: 'New York',
    country: 'United States',
    currency: 'USD',
    timezone: 'America/New_York'
  })

  // Payment Settings
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>({
    stripeEnabled: true,
    stripePublicKey: 'pk_test_...',
    stripeSecretKey: 'sk_test_...',
    paypalEnabled: false,
    paypalClientId: '',
    cashOnDelivery: true
  })

  // Shipping Settings
  const [shippingSettings, setShippingSettings] = useState<ShippingSettings>({
    freeShippingThreshold: 100,
    standardShipping: 9.99,
    expressShipping: 19.99,
    internationalShipping: 29.99
  })

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    orderUpdates: true,
    stockAlerts: true,
    customerMessages: true,
    systemUpdates: false
  })

  const handleSave = () => {
    console.log('Saving settings...')
    setHasChanges(false)
    // Show success message
    alert('Settings saved successfully!')
  }

  const tabs = [
    { id: 'store', label: 'Store Settings', icon: Store },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'shipping', label: 'Shipping', icon: Truck },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield }
  ]

  const renderStoreSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">Store Name</label>
            <input
              type="text"
              value={storeSettings.storeName}
              onChange={(e) => {
                setStoreSettings({ ...storeSettings, storeName: e.target.value })
                setHasChanges(true)
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">Store URL</label>
            <input
              type="url"
              value={storeSettings.storeUrl}
              onChange={(e) => {
                setStoreSettings({ ...storeSettings, storeUrl: e.target.value })
                setHasChanges(true)
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-800 mb-2">Store Description</label>
          <textarea
            value={storeSettings.storeDescription}
            onChange={(e) => {
              setStoreSettings({ ...storeSettings, storeDescription: e.target.value })
              setHasChanges(true)
            }}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">Contact Email</label>
            <input
              type="email"
              value={storeSettings.contactEmail}
              onChange={(e) => {
                setStoreSettings({ ...storeSettings, contactEmail: e.target.value })
                setHasChanges(true)
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">Contact Phone</label>
            <input
              type="tel"
              value={storeSettings.contactPhone}
              onChange={(e) => {
                setStoreSettings({ ...storeSettings, contactPhone: e.target.value })
                setHasChanges(true)
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Location</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">Address</label>
            <input
              type="text"
              value={storeSettings.address}
              onChange={(e) => {
                setStoreSettings({ ...storeSettings, address: e.target.value })
                setHasChanges(true)
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">City</label>
              <input
                type="text"
                value={storeSettings.city}
                onChange={(e) => {
                  setStoreSettings({ ...storeSettings, city: e.target.value })
                  setHasChanges(true)
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">Country</label>
              <select
                value={storeSettings.country}
                onChange={(e) => {
                  setStoreSettings({ ...storeSettings, country: e.target.value })
                  setHasChanges(true)
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="United States">United States</option>
                <option value="Canada">Canada</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="France">France</option>
                <option value="Germany">Germany</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">Currency</label>
              <select
                value={storeSettings.currency}
                onChange={(e) => {
                  setStoreSettings({ ...storeSettings, currency: e.target.value })
                  setHasChanges(true)
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="CAD">CAD - Canadian Dollar</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderPaymentSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Methods</h3>
        
        {/* Stripe Settings */}
        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <CreditCard className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="text-lg font-medium text-gray-800">Stripe</h4>
                <p className="text-sm text-gray-600">Accept credit cards and digital payments</p>
              </div>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={paymentSettings.stripeEnabled}
                onChange={(e) => {
                  setPaymentSettings({ ...paymentSettings, stripeEnabled: e.target.checked })
                  setHasChanges(true)
                }}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-800">Enabled</span>
            </div>
          </div>
          
          {paymentSettings.stripeEnabled && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">Public Key</label>
                <input
                  type="text"
                  value={paymentSettings.stripePublicKey}
                  onChange={(e) => {
                    setPaymentSettings({ ...paymentSettings, stripePublicKey: e.target.value })
                    setHasChanges(true)
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">Secret Key</label>
                <div className="relative">
                  <input
                    type={showSecretKeys ? "text" : "password"}
                    value={paymentSettings.stripeSecretKey}
                    onChange={(e) => {
                      setPaymentSettings({ ...paymentSettings, stripeSecretKey: e.target.value })
                      setHasChanges(true)
                    }}
                    className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSecretKeys(!showSecretKeys)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showSecretKeys ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* PayPal Settings */}
        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                <CreditCard className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <h4 className="text-lg font-medium text-gray-800">PayPal</h4>
                <p className="text-sm text-gray-600">Accept PayPal payments</p>
              </div>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={paymentSettings.paypalEnabled}
                onChange={(e) => {
                  setPaymentSettings({ ...paymentSettings, paypalEnabled: e.target.checked })
                  setHasChanges(true)
                }}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-800">Enabled</span>
            </div>
          </div>
          
          {paymentSettings.paypalEnabled && (
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">PayPal Client ID</label>
              <input
                type="text"
                value={paymentSettings.paypalClientId}
                onChange={(e) => {
                  setPaymentSettings({ ...paymentSettings, paypalClientId: e.target.value })
                  setHasChanges(true)
                }}
                placeholder="Enter your PayPal Client ID"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </div>

        {/* Cash on Delivery */}
        <div className="border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <Truck className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h4 className="text-lg font-medium text-gray-800">Cash on Delivery</h4>
                <p className="text-sm text-gray-600">Accept payment upon delivery</p>
              </div>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={paymentSettings.cashOnDelivery}
                onChange={(e) => {
                  setPaymentSettings({ ...paymentSettings, cashOnDelivery: e.target.checked })
                  setHasChanges(true)
                }}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-800">Enabled</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderShippingSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Shipping Options</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">Free Shipping Threshold</label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-500">$</span>
              <input
                type="number"
                value={shippingSettings.freeShippingThreshold}
                onChange={(e) => {
                  setShippingSettings({ ...shippingSettings, freeShippingThreshold: parseFloat(e.target.value) })
                  setHasChanges(true)
                }}
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <p className="text-xs text-gray-600 mt-1">Minimum order amount for free shipping</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">Standard Shipping</label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-500">$</span>
              <input
                type="number"
                step="0.01"
                value={shippingSettings.standardShipping}
                onChange={(e) => {
                  setShippingSettings({ ...shippingSettings, standardShipping: parseFloat(e.target.value) })
                  setHasChanges(true)
                }}
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <p className="text-xs text-gray-600 mt-1">5-7 business days</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">Express Shipping</label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-500">$</span>
              <input
                type="number"
                step="0.01"
                value={shippingSettings.expressShipping}
                onChange={(e) => {
                  setShippingSettings({ ...shippingSettings, expressShipping: parseFloat(e.target.value) })
                  setHasChanges(true)
                }}
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <p className="text-xs text-gray-600 mt-1">2-3 business days</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">International Shipping</label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-500">$</span>
              <input
                type="number"
                step="0.01"
                value={shippingSettings.internationalShipping}
                onChange={(e) => {
                  setShippingSettings({ ...shippingSettings, internationalShipping: parseFloat(e.target.value) })
                  setHasChanges(true)
                }}
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <p className="text-xs text-gray-600 mt-1">7-14 business days</p>
          </div>
        </div>
      </div>
    </div>
  )

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Email Notifications</h3>
        
        <div className="space-y-4">
          {[
            { key: 'emailNotifications', label: 'Enable Email Notifications', description: 'Receive email notifications for important events' },
            { key: 'orderUpdates', label: 'Order Updates', description: 'Get notified when orders are placed, updated, or completed' },
            { key: 'stockAlerts', label: 'Stock Alerts', description: 'Receive alerts when product stock is low' },
            { key: 'customerMessages', label: 'Customer Messages', description: 'Get notified when customers send messages' },
            { key: 'systemUpdates', label: 'System Updates', description: 'Receive notifications about system maintenance and updates' }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-800">{item.label}</h4>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
              <div className="flex items-center ml-4">
                <input
                  type="checkbox"
                  checked={notificationSettings[item.key as keyof NotificationSettings] as boolean}
                  onChange={(e) => {
                    setNotificationSettings({
                      ...notificationSettings,
                      [item.key]: e.target.checked
                    })
                    setHasChanges(true)
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Security Options</h3>
        
        <div className="space-y-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-800">Two-Factor Authentication</h4>
                <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                Enable 2FA
              </button>
            </div>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-800">Change Password</h4>
                <p className="text-sm text-gray-600">Update your account password</p>
              </div>
              <button className="px-4 py-2 border border-gray-300 text-gray-800 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                Change Password
              </button>
            </div>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-800">Session Management</h4>
                <p className="text-sm text-gray-600">Manage your active sessions</p>
              </div>
              <button className="px-4 py-2 border border-gray-300 text-gray-800 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                View Sessions
              </button>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Data & Privacy</h3>
        
        <div className="space-y-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-800">Export Data</h4>
                <p className="text-sm text-gray-600">Download a copy of your store data</p>
              </div>
              <button className="px-4 py-2 border border-gray-300 text-gray-800 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                Export Data
              </button>
            </div>
          </div>

          <div className="p-4 border border-red-200 rounded-lg bg-red-50">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-red-800">Delete Account</h4>
                <p className="text-sm text-red-600">Permanently delete your account and all data</p>
              </div>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">System Settings</h1>
          <p className="text-gray-800">Configure your store settings and preferences</p>
        </div>
        
        {hasChanges && (
          <div className="flex items-center gap-3">
            <div className="flex items-center text-orange-600">
              <AlertCircle className="w-4 h-4 mr-1" />
              <span className="text-sm">Unsaved changes</span>
            </div>
            <button
              onClick={handleSave}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                      : 'text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            {activeTab === 'store' && renderStoreSettings()}
            {activeTab === 'payment' && renderPaymentSettings()}
            {activeTab === 'shipping' && renderShippingSettings()}
            {activeTab === 'notifications' && renderNotificationSettings()}
            {activeTab === 'security' && renderSecuritySettings()}
          </div>
        </div>
      </div>
    </div>
  )
}