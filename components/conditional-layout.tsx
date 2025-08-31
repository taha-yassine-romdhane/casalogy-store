"use client"

import { usePathname } from 'next/navigation'
import { DynamicNavbar } from '@/components/navbar/dynamic-navbar'

interface ConditionalLayoutProps {
  children: React.ReactNode
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname()
  
  // Check if we're on admin routes
  const isAdminRoute = pathname.startsWith('/admin')
  
  if (isAdminRoute) {
    // Admin routes: No navbar, no footer, no main wrapper
    return <>{children}</>
  }
  
  // Regular routes: Show navbar, main wrapper, and footer
  return (
    <>
      <DynamicNavbar />
      <main className="min-h-screen">
        {children}
      </main>
      <footer className="bg-[#282828] text-white">
        <div className="max-w-[1920px] mx-auto px-4 lg:px-8 py-16">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="font-bold text-lg mb-4">SHOP</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="/women" className="hover:opacity-70 transition-opacity">Women</a></li>
                <li><a href="/men" className="hover:opacity-70 transition-opacity">Men</a></li>
                <li><a href="/scrubs" className="hover:opacity-70 transition-opacity">Scrubs</a></li>
                <li><a href="/lab-coats" className="hover:opacity-70 transition-opacity">Lab Coats</a></li>
                <li><a href="/footwear" className="hover:opacity-70 transition-opacity">Footwear</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">HELP</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="/contact" className="hover:opacity-70 transition-opacity">Contact Us</a></li>
                <li><a href="/shipping" className="hover:opacity-70 transition-opacity">Shipping Info</a></li>
                <li><a href="/returns" className="hover:opacity-70 transition-opacity">Returns & Exchanges</a></li>
                <li><a href="/size-guide" className="hover:opacity-70 transition-opacity">Size Guide</a></li>
                <li><a href="/faq" className="hover:opacity-70 transition-opacity">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">ABOUT</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="/about" className="hover:opacity-70 transition-opacity">Our Story</a></li>
                <li><a href="/student-discount" className="hover:opacity-70 transition-opacity">Student Discount</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">CONNECT</h3>
              <p className="text-sm mb-4">
                Sign up for exclusive offers and new product updates.
              </p>
              <form className="space-y-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:border-white/40"
                />
                <button className="w-full px-4 py-2 bg-white text-[#282828] font-medium hover:bg-gray-100 transition-colors">
                  SUBSCRIBE
                </button>
              </form>
              <div className="flex space-x-4 mt-6">
                <a href="https://www.facebook.com/profile.php?id=61556849727440" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="https://www.instagram.com/casalogy_/" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"/>
                  </svg>
                </a>
                <a href="https://www.tiktok.com/@casalogy" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.39 6.39 0 00-1-.05A6.27 6.27 0 004 15.59a6.27 6.27 0 0011.08 4.02 6.16 6.16 0 00.37-2.02V8.71a8.18 8.18 0 004.73 1.47v-3.46a4.85 4.85 0 01-1.59-.03z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/20 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-sm">&copy; 2024 Casalogy Tunisia. All rights reserved.</p>
              <div className="flex space-x-6 text-sm">
                <a href="/privacy" className="hover:opacity-70 transition-opacity">Privacy Policy</a>
                <a href="/terms" className="hover:opacity-70 transition-opacity">Terms of Service</a>
                <a href="/accessibility" className="hover:opacity-70 transition-opacity">Accessibility</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}