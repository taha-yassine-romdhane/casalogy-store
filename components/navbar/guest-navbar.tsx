"use client"

import Link from "next/link"
import { ShoppingBag, Search, Menu, X, User } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { useCart } from "@/contexts/cart-context"
import CartDropdown from "@/components/cart/cart-dropdown"

export function GuestNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { itemCount, isOpen, openCart, closeCart } = useCart()

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
              
              <Link href="/login" className="hidden lg:flex items-center px-4 py-2 text-[#282828] font-medium hover:opacity-70 transition-opacity">
                Login
              </Link>

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
        </div>

        {/* Search Overlay */}
        {isSearchOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-b shadow-lg p-4">
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for scrubs, lab coats, and more..."
                  className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:border-[#282828]"
                  autoFocus
                />
                <button 
                  onClick={() => setIsSearchOpen(false)}
                  className="absolute right-3 top-3"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        <div className={cn(
          "lg:hidden fixed inset-0 bg-white z-50 transform transition-transform duration-300",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="flex items-center justify-between p-4 border-b border-gray-300">
            <span className="text-xl font-bold text-[#282828]">Menu</span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2"
            >
              <X className="w-6 h-6 text-[#282828]" />
            </button>
          </div>
          <div className="p-4 space-y-4">
            <Link href="/women" className="block py-3 text-lg font-medium border-b text-[#282828]" onClick={handleLinkClick}>
              WOMEN
            </Link>
            <Link href="/men" className="block py-3 text-lg font-medium border-b text-[#282828]" onClick={handleLinkClick}>
              MEN
            </Link>
            <Link href="/new-arrivals" className="block py-3 text-lg font-medium border-b text-[#282828]" onClick={handleLinkClick}>
              NEW
            </Link>
            <div className="pt-4 space-y-3 border-t border-gray-300">
              <Link href="/scrubs" className="block py-2 text-[#282828]" onClick={handleLinkClick}>Scrubs</Link>
              <Link href="/lab-coats" className="block py-2 text-[#282828]" onClick={handleLinkClick}>Lab Coats</Link>
              <Link href="/underscrubs" className="block py-2 text-[#282828]" onClick={handleLinkClick}>Underscrubs</Link>
              <Link href="/outerwear" className="block py-2 text-[#282828]" onClick={handleLinkClick}>Outerwear</Link>
              <Link href="/footwear" className="block py-2 text-[#282828]" onClick={handleLinkClick}>Footwear</Link>
              <Link href="/accessories" className="block py-2 text-[#282828]" onClick={handleLinkClick}>Accessories</Link>
              <Link href="/size-guide" className="block py-2 text-[#282828]" onClick={handleLinkClick}>Size Guide</Link>
            </div>
            <div className="pt-6 border-t border-gray-300">
              <Link href="/login" className="flex items-center py-3 text-[#282828]" onClick={handleLinkClick}>
                <User className="w-5 h-5 mr-3" />
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}