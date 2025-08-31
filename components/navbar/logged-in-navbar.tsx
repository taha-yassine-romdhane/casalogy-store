"use client"

import Link from "next/link"
import { ShoppingBag, Search, Menu, X, User, ChevronDown, LogOut, Package, Settings } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { useCart } from "@/contexts/cart-context"
import { useRouter } from "next/navigation"
import CartDropdown from "@/components/cart/cart-dropdown"

interface LoggedInNavbarProps {
  user: {
    firstName: string
    lastName: string
    email: string
    role?: string
  }
}

export function LoggedInNavbar({ user }: LoggedInNavbarProps) {
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)
  const { itemCount, isOpen, openCart, closeCart } = useCart()
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false)
      }
    }

    if (isUserDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isUserDropdownOpen])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      window.location.href = '/'
    } catch (error) {
      console.error('Logout error:', error)
      window.location.href = '/'
    }
  }

  const getUserInitials = () => {
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
  }

  return (
    <>
      {/* Top Banner */}
      <div className="bg-[#282828] text-white text-center py-2 text-sm">
        <p>Free Shipping on Orders Over 200 TND | Student Discount Available</p>
      </div>
      
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-[1920px] mx-auto">
          <div className="flex items-center justify-between h-[72px] px-4 lg:px-8">
            {/* Left Navigation */}
            <div className="flex items-center flex-1">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 -ml-2"
              >
                <Menu className="w-6 h-6 text-[#282828]" />
              </button>
              
              <div className="hidden lg:flex items-center space-x-8">
                <Link href="/women" className="text-[#282828] font-medium hover:opacity-70 transition-opacity">
                  WOMEN
                </Link>
                <Link href="/men" className="text-[#282828] font-medium hover:opacity-70 transition-opacity">
                  MEN
                </Link>
                <Link href="/new-arrivals" className="text-[#282828] font-medium hover:opacity-70 transition-opacity">
                  NEW
                </Link>
              </div>
            </div>

            {/* Center Logo */}
            <Link href="/" className="flex items-center">
              <span className="text-3xl font-bold text-[#282828] tracking-wider">CASALOGY</span>
            </Link>

            {/* Right Navigation */}
            <div className="flex items-center justify-end flex-1 space-x-4">
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 hover:opacity-70 transition-opacity"
              >
                <Search className="w-5 h-5 text-[#282828]" />
              </button>
              
              {/* User Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-[#282828] text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {getUserInitials()}
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium text-[#282828]">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="text-xs text-gray-600 truncate max-w-32">
                      {user.email}
                    </div>
                  </div>
                  <ChevronDown className={cn(
                    "w-4 h-4 text-gray-600 transition-transform",
                    isUserDropdownOpen && "rotate-180"
                  )} />
                </button>

                {/* Dropdown Menu */}
                {isUserDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <div className="font-medium text-[#282828]">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-sm text-gray-600 truncate">
                        {user.email}
                      </div>
                    </div>
                    
                    <Link 
                      href="/profile" 
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setIsUserDropdownOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      My Profile
                    </Link>
                    
                    <Link 
                      href="/orders" 
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setIsUserDropdownOpen(false)}
                    >
                      <Package className="w-4 h-4" />
                      My Orders
                    </Link>
                    
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>

              <div className="relative">
                <button 
                  onClick={openCart}
                  data-cart-button
                  className="relative p-2 hover:opacity-70 transition-opacity"
                >
                  <ShoppingBag className="w-5 h-5 text-[#282828]" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#282828] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {itemCount > 99 ? '99+' : itemCount}
                    </span>
                  )}
                </button>
                <CartDropdown isOpen={isOpen} onClose={closeCart} />
              </div>
            </div>
          </div>

          {/* Secondary Navigation */}
          <div className="hidden lg:block border-t border-gray-200">
            <div className="flex items-center justify-center space-x-12 py-4">
              <Link href="/scrubs" className="text-sm text-[#282828] hover:opacity-70 transition-opacity">
                Scrubs
              </Link>
              <Link href="/lab-coats" className="text-sm text-[#282828] hover:opacity-70 transition-opacity">
                Lab Coats
              </Link>
              <Link href="/underscrubs" className="text-sm text-[#282828] hover:opacity-70 transition-opacity">
                Underscrubs
              </Link>
              <Link href="/outerwear" className="text-sm text-[#282828] hover:opacity-70 transition-opacity">
                Outerwear
              </Link>
              <Link href="/footwear" className="text-sm text-[#282828] hover:opacity-70 transition-opacity">
                Footwear
              </Link>
              <Link href="/accessories" className="text-sm text-[#282828] hover:opacity-70 transition-opacity">
                Accessories
              </Link>
              <Link href="/size-guide" className="text-sm text-[#282828] hover:opacity-70 transition-opacity">
                Size Guide
              </Link>
            </div>
          </div>

          {/* Search Bar */}
          {isSearchOpen && (
            <div className="border-t border-gray-200 p-4">
              <div className="relative max-w-md mx-auto">
                <input
                  type="text"
                  placeholder="Search medical wear..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#282828]"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <button 
                  onClick={() => setIsSearchOpen(false)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        <div className={cn(
          "lg:hidden fixed inset-0 bg-white z-50 transform transition-transform duration-300",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <span className="text-xl font-bold text-[#282828]">CASALOGY</span>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2"
            >
              <X className="w-6 h-6 text-[#282828]" />
            </button>
          </div>
          
          <div className="flex flex-col space-y-4 p-4">
            {/* User Info */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-[#282828] text-white rounded-full flex items-center justify-center text-sm font-medium">
                {getUserInitials()}
              </div>
              <div>
                <div className="font-medium text-[#282828]">
                  {user.firstName} {user.lastName}
                </div>
                <div className="text-sm text-gray-600">
                  {user.email}
                </div>
              </div>
            </div>

            <Link href="/women" className="flex items-center py-3 text-[#282828] font-medium" onClick={handleLinkClick}>
              WOMEN
            </Link>
            <Link href="/men" className="flex items-center py-3 text-[#282828] font-medium" onClick={handleLinkClick}>
              MEN
            </Link>
            <Link href="/new-arrivals" className="flex items-center py-3 text-[#282828] font-medium" onClick={handleLinkClick}>
              NEW ARRIVALS
            </Link>
            
            {/* Category Links */}
            <div className="border-t border-gray-200 pt-4">
              <Link href="/scrubs" className="flex items-center py-2 text-[#282828]" onClick={handleLinkClick}>
                Scrubs
              </Link>
              <Link href="/lab-coats" className="flex items-center py-2 text-[#282828]" onClick={handleLinkClick}>
                Lab Coats
              </Link>
              <Link href="/underscrubs" className="flex items-center py-2 text-[#282828]" onClick={handleLinkClick}>
                Underscrubs
              </Link>
              <Link href="/outerwear" className="flex items-center py-2 text-[#282828]" onClick={handleLinkClick}>
                Outerwear
              </Link>
              <Link href="/footwear" className="flex items-center py-2 text-[#282828]" onClick={handleLinkClick}>
                Footwear
              </Link>
              <Link href="/accessories" className="flex items-center py-2 text-[#282828]" onClick={handleLinkClick}>
                Accessories
              </Link>
              <Link href="/size-guide" className="flex items-center py-2 text-[#282828]" onClick={handleLinkClick}>
                Size Guide
              </Link>
            </div>
            
            {/* User Links */}
            <div className="border-t border-gray-200 pt-4">
            <Link href="/profile" className="flex items-center py-3 text-[#282828]" onClick={handleLinkClick}>
              <User className="w-5 h-5 mr-3" />
              My Profile
            </Link>
            <Link href="/orders" className="flex items-center py-3 text-[#282828]" onClick={handleLinkClick}>
              <Package className="w-5 h-5 mr-3" />
              My Orders
            </Link>
            <button 
              onClick={handleLogout}
              className="flex items-center py-3 text-red-600"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}