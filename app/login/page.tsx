"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Mail, Lock, Eye, EyeOff } from "lucide-react"

interface LoginResponse {
  success: boolean
  user?: {
    id: string
    email: string
    firstName: string
    lastName: string
    role: 'CLIENT' | 'ADMIN'
    isStudent: boolean
    studentVerified: boolean
  }
  error?: string
}

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, rememberMe }),
      })

      const data: LoginResponse = await response.json()
      
      console.log('Login response:', { status: response.status, data })

      if (response.ok && data.success && data.user) {
        console.log('Login successful, redirecting...', data.user.role)
        
        // Small delay to ensure cookie is set
        setTimeout(() => {
          if (data.user?.role === 'ADMIN') {
            window.location.href = '/admin/dashboard'
          } else {
            window.location.href = '/' // Redirect to home for clients
          }
        }, 100)
      } else {
        console.log('Login failed:', data)
        setError(data.error || 'Login failed')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-72px)] bg-gray-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white p-10 rounded-lg shadow-sm">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#282828] mb-2">Welcome Back</h1>
            <p className="text-gray-700">Sign in to your Casalogy account</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-700" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#282828] focus:border-transparent text-gray-900"
                  placeholder="admin@casalogy.tn"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-700" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#282828] focus:border-transparent text-gray-900"
                  placeholder="Enter your password"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-700 hover:text-gray-800"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-[#282828] border-gray-300 rounded focus:ring-[#282828]"
                  disabled={isLoading}
                />
                <span className="ml-2 text-sm text-gray-700">Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-sm text-[#282828] hover:opacity-70">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#282828] text-white font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'SIGNING IN...' : 'SIGN IN'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-700">
              New to Casalogy?{" "}
              <Link href="/signup" className="text-[#282828] font-medium hover:opacity-70">
                Create an account
              </Link>
            </p>
          </div>


          {/* Student Discount Banner */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800 text-center">
              <span className="font-medium">Medical Students:</span> Get 15% off with valid student ID
            </p>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-8 text-center space-y-2">
          <h3 className="font-medium text-gray-900">Member Benefits</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Exclusive discounts and early access</li>
            <li>• Track your orders and favorites</li>
            <li>• Fast checkout with saved details</li>
            <li>• Special offers for healthcare workers</li>
          </ul>
        </div>
      </div>
    </div>
  )
}