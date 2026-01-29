"use client"

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  Settings,
  LogOut,
  X,
  BarChart3,
  GraduationCap,
  Image,
  Home,
  FolderTree,
  Palette,
  MessageSquare,
  FileText,
  Globe,
  Ticket,
} from 'lucide-react'

const sidebarSections = [
  {
    title: 'Dashboard',
    items: [
      {
        name: 'Overview',
        href: '/admin/dashboard',
        icon: LayoutDashboard
      },
      {
        name: 'Analytics',
        href: '/admin/analytics',
        icon: BarChart3
      }
    ]
  },
  {
    title: 'Content Management',
    items: [
      {
        name: 'Welcome Page',
        href: '/admin/welcome-page',
        icon: Home
      },
      {
        name: 'Content Pages',
        href: '/admin/content',
        icon: FileText
      },
      {
        name: 'Image Management',
        href: '/admin/images',
        icon: Image
      },
      {
        name: 'SEO Settings',
        href: '/admin/seo',
        icon: Globe
      }
    ]
  },
  {
    title: 'Product Management',
    items: [
      {
        name: 'Products',
        href: '/admin/products',
        icon: Package
      },
      {
        name: 'Categories',
        href: '/admin/categories',
        icon: FolderTree
      },
      {
        name: 'Colors & Sizes',
        href: '/admin/variants',
        icon: Palette
      }
    ]
  },
  {
    title: 'E-commerce',
    items: [
      {
        name: 'Orders',
        href: '/admin/orders',
        icon: ShoppingCart
      },
      {
        name: 'Promo Codes',
        href: '/admin/promo-codes',
        icon: Ticket
      },
      {
        name: 'Customers',
        href: '/admin/customers',
        icon: Users
      },
      {
        name: 'Student Verification',
        href: '/admin/student-verification',
        icon: GraduationCap
      },
    ]
  },
  {
    title: 'Customer Support',
    items: [
      {
        name: 'Contact Messages',
        href: '/admin/messages',
        icon: MessageSquare
      }
    ]
  },
  {
    title: 'System',
    items: [
      {
        name: 'Settings',
        href: '/admin/settings',
        icon: Settings
      }
    ]
  }
]

interface AdminSidebarProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export default function AdminSidebar({ sidebarOpen, setSidebarOpen }: AdminSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
      router.push('/login')
    }
  }


  const isCurrentSection = (items: any[]) => {
    return items.some(item => pathname === item.href)
  }

  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-72 h-full bg-gradient-to-b from-slate-900 to-slate-800 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 shadow-xl flex flex-col`}>
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-6 bg-slate-800/50 backdrop-blur border-b border-slate-700/50 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">C</span>
          </div>
          <div>
            <span className="text-xl font-bold text-white">CASALOGY</span>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 text-xs bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-medium">
                ADMIN
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden text-slate-400 hover:text-white transition-colors duration-200"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto scrollbar-hide">
        {sidebarSections.map((section) => {
          const isCurrent = isCurrentSection(section.items)
          
          return (
            <div key={section.title} className="space-y-1">
              <div className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
                isCurrent
                  ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-500/30'
                  : 'text-slate-300'
              }`}>
                <span className={`text-xs font-semibold ${isCurrent ? 'text-blue-400' : 'text-slate-500'}`}>
                  {section.title}
                </span>
              </div>

              <div className="ml-2 space-y-1 border-l border-slate-700 pl-4">
                {section.items.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  
                  return (
                    <button
                      key={item.name}
                      onClick={() => {
                        router.push(item.href)
                        setSidebarOpen(false)
                      }}
                      className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg w-full text-left transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25 transform scale-105'
                          : 'text-slate-300 hover:text-white hover:bg-slate-700/60 hover:translate-x-1'
                      }`}
                    >
                      <Icon className={`mr-3 h-4 w-4 transition-colors duration-200 ${
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                      }`} />
                      <span className="truncate">{item.name}</span>
                      {isActive && (
                        <div className="ml-auto w-2 h-2 bg-white rounded-full opacity-75"></div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="mt-auto p-4 border-t border-slate-700/50 bg-slate-800/30 flex-shrink-0">
        <button
          onClick={handleLogout}
          className="group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg w-full text-left text-slate-300 hover:text-white hover:bg-red-600/20 hover:border-red-500/30 transition-all duration-200 border border-transparent"
        >
          <LogOut className="mr-3 h-4 w-4 text-slate-400 group-hover:text-red-400 transition-colors duration-200" />
          <span>Logout</span>
        </button>
        
        <div className="mt-4 pt-4 border-t border-slate-700/30">
          <div className="text-xs text-slate-500 text-center">
            <div>Casalogy Admin Panel</div>
            <div className="mt-1">v1.0.0</div>
          </div>
        </div>
      </div>
    </div>
  )
}