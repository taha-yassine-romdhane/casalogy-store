"use client"

import { useState } from 'react'
import { Save, Globe, Search, FileText, Image, Link, TrendingUp, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react'

const seoData = {
  general: {
    siteTitle: 'Casalogy Tunisia - Premium Medical Wear for Healthcare Professionals',
    metaDescription: 'Shop high-quality medical scrubs, lab coats, and healthcare apparel in Tunisia. Student discounts available. Fast delivery across Tunis, Sfax, Sousse.',
    keywords: 'medical scrubs tunisia, lab coats tunisia, healthcare clothing, medical wear, scrubs tunis, medical uniforms, student discount medical wear',
    canonicalUrl: 'https://casalogy.tn',
    robotsTxt: 'User-agent: *\nAllow: /\nDisallow: /admin/\nSitemap: https://casalogy.tn/sitemap.xml'
  },
  social: {
    ogTitle: 'Casalogy Tunisia - Premium Medical Wear',
    ogDescription: 'Quality medical scrubs and healthcare apparel for professionals and students in Tunisia',
    ogImage: '/og-image.jpg',
    twitterCard: 'summary_large_image',
    twitterSite: '@CasalogyTunisia',
    facebookAppId: ''
  },
  analytics: {
    googleAnalyticsId: '',
    googleTagManagerId: '',
    facebookPixelId: '',
    hotjarId: ''
  },
  schema: {
    organizationName: 'Casalogy Tunisia',
    organizationType: 'OnlineStore',
    address: {
      streetAddress: '123 Medical Street',
      city: 'Tunis',
      postalCode: '1000',
      country: 'Tunisia'
    },
    contactInfo: {
      telephone: '+216-XX-XXX-XXX',
      email: 'contact@casalogy.tn'
    }
  }
}

const seoPages = [
  {
    page: 'Homepage',
    url: '/',
    title: 'Casalogy Tunisia - Premium Medical Wear',
    metaDescription: 'Shop high-quality medical scrubs, lab coats...',
    status: 'optimized',
    issues: 0
  },
  {
    page: 'Products',
    url: '/products',
    title: 'Medical Scrubs & Healthcare Apparel | Casalogy',
    metaDescription: 'Browse our collection of medical scrubs...',
    status: 'good',
    issues: 1
  },
  {
    page: 'Categories',
    url: '/categories',
    title: 'Medical Wear Categories',
    metaDescription: 'Explore different categories of medical...',
    status: 'needs-work',
    issues: 3
  },
  {
    page: 'About Us',
    url: '/about',
    title: 'About Casalogy Tunisia',
    metaDescription: 'Learn about our mission to provide...',
    status: 'good',
    issues: 1
  }
]

export default function SEOSettingsPage() {
  const [activeTab, setActiveTab] = useState('general')
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const tabs = [
    { id: 'general', name: 'General SEO', icon: Globe },
    { id: 'social', name: 'Social Media', icon: Link },
    { id: 'analytics', name: 'Analytics', icon: TrendingUp },
    { id: 'schema', name: 'Schema Markup', icon: FileText },
    { id: 'pages', name: 'Page Optimization', icon: Search }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'optimized':
        return 'bg-green-100 text-green-800'
      case 'good':
        return 'bg-blue-100 text-blue-800'
      case 'needs-work':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'optimized':
        return <CheckCircle className="w-4 h-4" />
      case 'good':
        return <CheckCircle className="w-4 h-4" />
      case 'needs-work':
        return <AlertCircle className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">SEO Settings</h1>
            <p className="text-gray-800">Optimize your store for search engines and social media</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors">
              <ExternalLink className="w-4 h-4 mr-2" />
              SEO Analyzer
            </button>
            <button className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
              hasUnsavedChanges 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </button>
          </div>
        </div>
      </div>

      {/* SEO Score Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-800">SEO Score</p>
              <p className="text-2xl font-bold text-green-600">85/100</p>
              <p className="text-xs text-green-600">Good</p>
            </div>
            <Search className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-800">Pages Indexed</p>
              <p className="text-2xl font-bold text-gray-800">47</p>
              <p className="text-xs text-gray-800">of 52 pages</p>
            </div>
            <Globe className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-800">Keywords Ranking</p>
              <p className="text-2xl font-bold text-gray-800">23</p>
              <p className="text-xs text-gray-800">in top 10</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-800">Issues Found</p>
              <p className="text-2xl font-bold text-yellow-600">5</p>
              <p className="text-xs text-yellow-600">need attention</p>
            </div>
            <AlertCircle className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Sidebar */}
        <div className="w-64 bg-white rounded-lg shadow-sm border p-4">
          <h3 className="font-semibold text-gray-800 mb-4">SEO Settings</h3>
          <div className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-800 border border-blue-200'
                      : 'text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-3" />
                  {tab.name}
                  {hasUnsavedChanges && activeTab === tab.id && (
                    <div className="w-2 h-2 bg-orange-500 rounded-full ml-auto"></div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-white rounded-lg shadow-sm border">
          {activeTab === 'general' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">General SEO Settings</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">Site Title *</label>
                  <input
                    type="text"
                    defaultValue={seoData.general.siteTitle}
                    onChange={() => setHasUnsavedChanges(true)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter site title"
                  />
                  <p className="text-sm text-gray-700 mt-1">Recommended: 50-60 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">Meta Description *</label>
                  <textarea
                    rows={3}
                    defaultValue={seoData.general.metaDescription}
                    onChange={() => setHasUnsavedChanges(true)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter meta description"
                  />
                  <p className="text-sm text-gray-700 mt-1">Recommended: 150-160 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">Keywords</label>
                  <textarea
                    rows={2}
                    defaultValue={seoData.general.keywords}
                    onChange={() => setHasUnsavedChanges(true)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter keywords separated by commas"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">Canonical URL</label>
                  <input
                    type="url"
                    defaultValue={seoData.general.canonicalUrl}
                    onChange={() => setHasUnsavedChanges(true)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://casalogy.tn"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">Robots.txt</label>
                  <textarea
                    rows={5}
                    defaultValue={seoData.general.robotsTxt}
                    onChange={() => setHasUnsavedChanges(true)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                    placeholder="Enter robots.txt content"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'social' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Social Media SEO</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Open Graph (Facebook)</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-800 mb-2">OG Title</label>
                      <input
                        type="text"
                        defaultValue={seoData.social.ogTitle}
                        onChange={() => setHasUnsavedChanges(true)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-800 mb-2">OG Description</label>
                      <textarea
                        rows={2}
                        defaultValue={seoData.social.ogDescription}
                        onChange={() => setHasUnsavedChanges(true)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-800 mb-2">OG Image URL</label>
                      <input
                        type="url"
                        defaultValue={seoData.social.ogImage}
                        onChange={() => setHasUnsavedChanges(true)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <p className="text-sm text-gray-700 mt-1">Recommended: 1200x630 pixels</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Twitter Cards</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-800 mb-2">Twitter Card Type</label>
                      <select
                        defaultValue={seoData.social.twitterCard}
                        onChange={() => setHasUnsavedChanges(true)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="summary">Summary</option>
                        <option value="summary_large_image">Summary with Large Image</option>
                        <option value="app">App</option>
                        <option value="player">Player</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-800 mb-2">Twitter Site</label>
                      <input
                        type="text"
                        defaultValue={seoData.social.twitterSite}
                        onChange={() => setHasUnsavedChanges(true)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="@CasalogyTunisia"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Analytics & Tracking</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">Google Analytics ID</label>
                  <input
                    type="text"
                    defaultValue={seoData.analytics.googleAnalyticsId}
                    onChange={() => setHasUnsavedChanges(true)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="G-XXXXXXXXXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">Google Tag Manager ID</label>
                  <input
                    type="text"
                    defaultValue={seoData.analytics.googleTagManagerId}
                    onChange={() => setHasUnsavedChanges(true)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="GTM-XXXXXXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">Facebook Pixel ID</label>
                  <input
                    type="text"
                    defaultValue={seoData.analytics.facebookPixelId}
                    onChange={() => setHasUnsavedChanges(true)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="XXXXXXXXXXXXXXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">Hotjar Site ID</label>
                  <input
                    type="text"
                    defaultValue={seoData.analytics.hotjarId}
                    onChange={() => setHasUnsavedChanges(true)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="XXXXXXX"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'schema' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Schema Markup</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Organization Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-800 mb-2">Organization Name</label>
                      <input
                        type="text"
                        defaultValue={seoData.schema.organizationName}
                        onChange={() => setHasUnsavedChanges(true)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-800 mb-2">Organization Type</label>
                      <select
                        defaultValue={seoData.schema.organizationType}
                        onChange={() => setHasUnsavedChanges(true)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="OnlineStore">Online Store</option>
                        <option value="Organization">Organization</option>
                        <option value="Corporation">Corporation</option>
                        <option value="LocalBusiness">Local Business</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Address Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-800 mb-2">Street Address</label>
                      <input
                        type="text"
                        defaultValue={seoData.schema.address.streetAddress}
                        onChange={() => setHasUnsavedChanges(true)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-800 mb-2">City</label>
                      <input
                        type="text"
                        defaultValue={seoData.schema.address.city}
                        onChange={() => setHasUnsavedChanges(true)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-800 mb-2">Postal Code</label>
                      <input
                        type="text"
                        defaultValue={seoData.schema.address.postalCode}
                        onChange={() => setHasUnsavedChanges(true)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-800 mb-2">Country</label>
                      <input
                        type="text"
                        defaultValue={seoData.schema.address.country}
                        onChange={() => setHasUnsavedChanges(true)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-800 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        defaultValue={seoData.schema.contactInfo.telephone}
                        onChange={() => setHasUnsavedChanges(true)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-800 mb-2">Email</label>
                      <input
                        type="email"
                        defaultValue={seoData.schema.contactInfo.email}
                        onChange={() => setHasUnsavedChanges(true)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'pages' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Page Optimization</h2>
              <div className="space-y-4">
                {seoPages.map((page, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <h3 className="font-medium text-gray-800 mr-3">{page.page}</h3>
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(page.status)}`}>
                          {getStatusIcon(page.status)}
                          <span className="ml-1 capitalize">{page.status.replace('-', ' ')}</span>
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-700">
                        {page.issues > 0 && (
                          <span className="flex items-center text-yellow-600">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {page.issues} issues
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-700 font-medium">URL:</span>
                        <span className="text-blue-600 ml-2">{page.url}</span>
                      </div>
                      <div>
                        <span className="text-gray-700 font-medium">Title:</span>
                        <span className="text-gray-800 ml-2">{page.title}</span>
                      </div>
                      <div>
                        <span className="text-gray-700 font-medium">Meta Description:</span>
                        <span className="text-gray-800 ml-2">{page.metaDescription}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-4">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        Edit SEO
                      </button>
                      <button className="text-gray-700 hover:text-gray-800 text-sm font-medium">
                        Analyze
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}