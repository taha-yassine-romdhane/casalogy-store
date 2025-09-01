"use client"

import { useAuth } from "@/contexts/auth-context"
import { GuestNavbar } from "./guest-navbar"
import { LoggedInNavbar } from "./logged-in-navbar"

export function DynamicNavbar() {
  const { user, isLoading } = useAuth()

  // Show loading skeleton while checking auth
  if (isLoading) {
    return (
      <>
        {/* Top Banner */}
        <div className="bg-[#282828] text-white text-center py-2 text-sm">
          <p>Free Shipping on Orders Over 200 TND | Student Discount Available</p>
        </div>
        
        <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
          <div className="max-w-[1920px] mx-auto">
            <div className="flex items-center justify-between h-[72px] px-4 lg:px-8">
              <div className="w-32 h-8 bg-gray-200 rounded animate-pulse" />
              <span className="text-3xl font-black text-[#282828] tracking-wide" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>CASALOGY</span>
              <div className="w-32 h-8 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </nav>
      </>
    )
  }

  // Show appropriate navbar based on auth status
  if (user) {
    return <LoggedInNavbar user={user} />
  } else {
    return <GuestNavbar />
  }
}