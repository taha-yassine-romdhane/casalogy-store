"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Mail, Lock, Eye, EyeOff, User, GraduationCap, Upload, FileImage, CheckCircle, Phone, MapPin } from "lucide-react"

interface SignupResponse {
  success: boolean
  message?: string
  error?: string
  user?: any
}

export default function SignupPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    region: "",
    password: "",
    confirmPassword: "",
    isStudent: false,
    faculty: "",
    agreeToTerms: false
  })
  const [idFront, setIdFront] = useState<File | null>(null)
  const [idBack, setIdBack] = useState<File | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      // Create FormData for file upload
      const submitData = new FormData()
      
      // Add form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (typeof value === 'boolean') {
          submitData.append(key, String(value))
        } else {
          submitData.append(key, value)
        }
      })
      
      // Add image files if student verification requested
      if (formData.isStudent) {
        if (idFront) {
          submitData.append('idFront', idFront)
        }
        if (idBack) {
          submitData.append('idBack', idBack)
        }
      }

      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        body: submitData, // Changed from JSON to FormData
      })

      const data: SignupResponse = await response.json()

      if (response.ok && data.success) {
        setSuccess(data.message || 'Account created successfully!')
        // Clear form
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          address: "",
          region: "",
          password: "",
          confirmPassword: "",
          isStudent: false,
          faculty: "",
          agreeToTerms: false
        })
        setIdFront(null)
        setIdBack(null)
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          router.push('/login?message=Account created successfully! Please sign in.')
        }, 2000)
      } else {
        setError(data.error || 'Failed to create account')
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
            <h1 className="text-3xl font-bold text-[#282828] mb-2">Create Account</h1>
            <p className="text-gray-700">Join Casalogy for exclusive medical wear</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 text-sm">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-700" />
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#282828] focus:border-transparent text-gray-900"
                    placeholder="Ahmed"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#282828] focus:border-transparent text-gray-900"
                  placeholder="Ben Ali"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-700" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#282828] focus:border-transparent text-gray-900"
                  placeholder="student@university.tn"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-700" />
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#282828] focus:border-transparent text-gray-900"
                  placeholder="+216 20 123 456"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                Street Address
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-700" />
                <input
                  id="address"
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#282828] focus:border-transparent text-gray-900"
                  placeholder="123 Avenue Habib Bourguiba"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-2">
                Governorate (Region)
              </label>
              <select
                id="region"
                name="region"
                value={formData.region}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#282828] focus:border-transparent text-gray-900"
                required
              >
                <option value="">Select your governorate</option>
                <option value="tunis">Tunis</option>
                <option value="ariana">Ariana</option>
                <option value="ben-arous">Ben Arous</option>
                <option value="manouba">Manouba</option>
                <option value="nabeul">Nabeul</option>
                <option value="zaghouan">Zaghouan</option>
                <option value="bizerte">Bizerte</option>
                <option value="beja">Béja</option>
                <option value="jendouba">Jendouba</option>
                <option value="kef">Le Kef</option>
                <option value="siliana">Siliana</option>
                <option value="kairouan">Kairouan</option>
                <option value="kasserine">Kasserine</option>
                <option value="sidi-bouzid">Sidi Bouzid</option>
                <option value="sousse">Sousse</option>
                <option value="monastir">Monastir</option>
                <option value="mahdia">Mahdia</option>
                <option value="sfax">Sfax</option>
                <option value="gafsa">Gafsa</option>
                <option value="tozeur">Tozeur</option>
                <option value="kebili">Kébili</option>
                <option value="gabes">Gabès</option>
                <option value="medenine">Médenine</option>
                <option value="tataouine">Tataouine</option>
              </select>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-700" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#282828] focus:border-transparent text-gray-900"
                  placeholder="Create a strong password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-700 hover:text-gray-800"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-700">Must be at least 8 characters</p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-700" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#282828] focus:border-transparent text-gray-900"
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-700 hover:text-gray-800"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Student Verification Option */}
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="isStudent"
                    checked={formData.isStudent}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-[#282828] border-gray-300 rounded focus:ring-[#282828]"
                  />
                  <div className="ml-3">
                    <div className="flex items-center">
                      <GraduationCap className="w-5 h-5 text-blue-600 mr-2" />
                      <span className="text-sm font-medium text-gray-900">I'm a medical student</span>
                    </div>
                    <p className="text-xs text-gray-700 mt-1">Get 15% discount after verification</p>
                  </div>
                </label>
              </div>

              {formData.isStudent && (
                <div className="border border-gray-200 rounded-lg p-6 space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Student ID Verification</h3>
                    <p className="text-sm text-gray-700">
                      Upload your student ID card (front and back) for verification. 
                      Our team will review within 24-48 hours.
                    </p>
                  </div>

                  <div>
                    <label htmlFor="faculty" className="block text-sm font-medium text-gray-700 mb-2">
                      Medical Faculty
                    </label>
                    <select
                      id="faculty"
                      name="faculty"
                      value={formData.faculty}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#282828] focus:border-transparent text-gray-900 bg-white"
                      required={formData.isStudent}
                    >
                      <option value="">Select your faculty</option>
                      <option value="tunis">Faculty of Medicine of Tunis</option>
                      <option value="monastir">Faculty of Medicine of Monastir</option>
                      <option value="sousse">Faculty of Medicine of Sousse</option>
                      <option value="sfax">Faculty of Medicine of Sfax</option>
                      <option value="dental-monastir">Faculty of Dental Medicine of Monastir</option>
                      <option value="pharmacy-monastir">Faculty of Pharmacy of Monastir</option>
                      <option value="nursing-tunis">Higher School of Health Sciences and Techniques of Tunis</option>
                      <option value="nursing-sousse">Higher School of Health Sciences and Techniques of Sousse</option>
                      <option value="nursing-sfax">Higher School of Health Sciences and Techniques of Sfax</option>
                      <option value="other">Other Medical Institution</option>
                    </select>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ID Front Side
                      </label>
                      <label className="block">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setIdFront(e.target.files?.[0] || null)}
                          className="hidden"
                        />
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-gray-400 transition-colors">
                          {idFront ? (
                            <div className="flex items-center justify-center space-x-2">
                              <CheckCircle className="w-5 h-5 text-green-600" />
                              <span className="text-sm text-gray-700">{idFront.name}</span>
                            </div>
                          ) : (
                            <>
                              <FileImage className="w-8 h-8 mx-auto text-gray-700 mb-2" />
                              <p className="text-sm text-gray-700">Click to upload front side</p>
                              <p className="text-xs text-gray-700 mt-1">JPG, PNG up to 5MB</p>
                            </>
                          )}
                        </div>
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ID Back Side
                      </label>
                      <label className="block">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setIdBack(e.target.files?.[0] || null)}
                          className="hidden"
                        />
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-gray-400 transition-colors">
                          {idBack ? (
                            <div className="flex items-center justify-center space-x-2">
                              <CheckCircle className="w-5 h-5 text-green-600" />
                              <span className="text-sm text-gray-700">{idBack.name}</span>
                            </div>
                          ) : (
                            <>
                              <FileImage className="w-8 h-8 mx-auto text-gray-700 mb-2" />
                              <p className="text-sm text-gray-700">Click to upload back side</p>
                              <p className="text-xs text-gray-700 mt-1">JPG, PNG up to 5MB</p>
                            </>
                          )}
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="bg-amber-50 p-3 rounded-lg">
                    <p className="text-xs text-amber-800">
                      <strong>Note:</strong> Student verification is optional during signup. 
                      You can complete it later from your account settings to activate your discount.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <label className="flex items-start">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-[#282828] border-gray-300 rounded focus:ring-[#282828] mt-0.5"
                  required
                />
                <span className="ml-2 text-sm text-gray-700">
                  I agree to the{" "}
                  <Link href="/terms" className="text-[#282828] hover:opacity-70">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-[#282828] hover:opacity-70">
                    Privacy Policy
                  </Link>
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#282828] text-white font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-700">
              Already have an account?{" "}
              <Link href="/login" className="text-[#282828] font-medium hover:opacity-70">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-8 text-center space-y-2">
          <h3 className="font-medium text-gray-900">Why Join Casalogy?</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Exclusive access to new collections</li>
            <li>• Special discounts for students & healthcare workers</li>
            <li>• Free shipping on orders over 200 TND</li>
            <li>• Easy returns and exchanges</li>
          </ul>
        </div>
      </div>
    </div>
  )
}