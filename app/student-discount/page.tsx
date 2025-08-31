"use client"

import { useState } from 'react'
import { GraduationCap, Percent, Upload, CheckCircle, AlertCircle, Clock, Users, Star, FileText, Camera, Mail, Phone, Info, Award, Heart, User } from 'lucide-react'

export default function StudentDiscountPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    university: '',
    studentId: '',
    program: '',
    year: '',
    phone: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    setTimeout(() => {
      setSubmitted(true)
      setIsSubmitting(false)
    }, 2000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md mx-auto text-center p-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-[#282828] mb-4">Application Submitted!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for applying for our student discount. We'll review your application within 24-48 hours 
            and send you a confirmation email with your discount code.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800 text-sm">
              <strong>What's next?</strong><br />
              Check your email for updates and prepare to save 15% on all medical wear!
            </p>
          </div>
          <button
            onClick={() => setSubmitted(false)}
            className="px-6 py-3 bg-[#282828] text-white font-medium hover:bg-gray-800 transition-colors rounded-lg"
          >
            Submit Another Application
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-gray-50 py-20">
        <div className="max-w-[1920px] mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-blue-600 p-4 rounded-full">
                <GraduationCap className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-[#282828] mb-6">
              Student <span className="text-blue-600">Discount</span>
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              Supporting Tunisia's future healthcare heroes with 15% off all medical wear. 
              Because your education journey deserves the best.
            </p>
            
            <div className="inline-flex items-center bg-blue-600 text-white px-8 py-4 rounded-lg font-bold text-2xl">
              <Percent className="w-8 h-8 mr-3" />
              Save 15% on Everything
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="max-w-[1920px] mx-auto px-4 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-[#282828] text-center mb-12">Student Benefits</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-lg border border-gray-200 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Percent className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-[#282828] mb-3">15% Off Everything</h3>
                <p className="text-gray-600">
                  Exclusive student pricing on all scrubs, lab coats, medical accessories, and more.
                </p>
              </div>

              <div className="bg-white p-8 rounded-lg border border-gray-200 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-[#282828] mb-3">Priority Access</h3>
                <p className="text-gray-600">
                  Get early access to new collections, sales, and student-only exclusive items.
                </p>
              </div>

              <div className="bg-white p-8 rounded-lg border border-gray-200 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-[#282828] mb-3">Student Community</h3>
                <p className="text-gray-600">
                  Join our community of medical students across Tunisia and share your journey.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Eligibility Section */}
      <section className="py-16 bg-white">
        <div className="max-w-[1920px] mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-[#282828] text-center mb-12">Who's Eligible?</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-green-50 border border-green-200 rounded-lg p-8">
                <div className="flex items-center mb-6">
                  <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
                  <h3 className="text-2xl font-bold text-[#282828]">Eligible Students</h3>
                </div>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Medical students (all years)</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Nursing students</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Pharmacy students</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Dental students</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Veterinary students</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Healthcare technology students</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Paramedic students</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>International healthcare students</span>
                  </li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-8">
                <div className="flex items-center mb-6">
                  <FileText className="w-8 h-8 text-blue-600 mr-3" />
                  <h3 className="text-2xl font-bold text-[#282828]">Required Documents</h3>
                </div>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <Info className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Valid student ID card</span>
                  </li>
                  <li className="flex items-start">
                    <Info className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Current enrollment certificate</span>
                  </li>
                  <li className="flex items-start">
                    <Info className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>University transcript (optional)</span>
                  </li>
                  <li className="flex items-start">
                    <Info className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>University email address</span>
                  </li>
                </ul>
                
                <div className="mt-6 p-4 bg-white rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> Documents must be current and clearly show your name, 
                    university, and enrollment status for the current academic year.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="max-w-[1920px] mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-[#282828] text-center mb-12">How It Works</h2>
            
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="font-bold text-[#282828] mb-2">Apply</h3>
                <p className="text-gray-600 text-sm">
                  Fill out the verification form with your student information
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-yellow-600">2</span>
                </div>
                <h3 className="font-bold text-[#282828] mb-2">Upload</h3>
                <p className="text-gray-600 text-sm">
                  Submit a photo of your student ID or enrollment certificate
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-600">3</span>
                </div>
                <h3 className="font-bold text-[#282828] mb-2">Verify</h3>
                <p className="text-gray-600 text-sm">
                  We review your application within 24-48 hours
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600">4</span>
                </div>
                <h3 className="font-bold text-[#282828] mb-2">Shop</h3>
                <p className="text-gray-600 text-sm">
                  Start saving 15% on all your medical wear needs
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-16 bg-gray-100">
        <div className="flex items-center justify-center px-4">
          <div className="max-w-2xl w-full">
            <div className="bg-white p-10 rounded-lg shadow-sm">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-[#282828] mb-2">Apply for Student Discount</h2>
                <p className="text-gray-700">Complete the form below to get verified and start saving 15%</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-700" />
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#282828] focus:border-transparent text-gray-900"
                        placeholder="Ahmed"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#282828] focus:border-transparent text-gray-900"
                      placeholder="Ben Ali"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    University Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-700" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#282828] focus:border-transparent text-gray-900"
                      placeholder="student@university.edu.tn"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-700">Use your official university email address</p>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-700" />
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#282828] focus:border-transparent text-gray-900"
                      placeholder="+216 XX XXX XXX"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="university" className="block text-sm font-medium text-gray-700 mb-2">
                    University/Institution
                  </label>
                  <select
                    id="university"
                    name="university"
                    value={formData.university}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#282828] focus:border-transparent text-gray-900"
                  >
                    <option value="">Select your university</option>
                    <option value="tunis-medicine">Faculty of Medicine of Tunis</option>
                    <option value="sfax-medicine">Faculty of Medicine of Sfax</option>
                    <option value="sousse-medicine">Faculty of Medicine of Sousse</option>
                    <option value="monastir-medicine">Faculty of Medicine of Monastir</option>
                    <option value="dental-monastir">Faculty of Dental Medicine of Monastir</option>
                    <option value="pharmacy-monastir">Faculty of Pharmacy of Monastir</option>
                    <option value="nursing-tunis">Higher School of Health Sciences and Techniques of Tunis</option>
                    <option value="nursing-sousse">Higher School of Health Sciences and Techniques of Sousse</option>
                    <option value="nursing-sfax">Higher School of Health Sciences and Techniques of Sfax</option>
                    <option value="other">Other Medical Institution</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="program" className="block text-sm font-medium text-gray-700 mb-2">
                      Study Program
                    </label>
                    <select
                      id="program"
                      name="program"
                      value={formData.program}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#282828] focus:border-transparent text-gray-900"
                    >
                      <option value="">Select program</option>
                      <option value="medicine">Medicine</option>
                      <option value="nursing">Nursing</option>
                      <option value="pharmacy">Pharmacy</option>
                      <option value="dental">Dentistry</option>
                      <option value="veterinary">Veterinary Medicine</option>
                      <option value="paramedic">Paramedic</option>
                      <option value="health-tech">Healthcare Technology</option>
                      <option value="other">Other Healthcare Program</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
                      Academic Year
                    </label>
                    <select
                      id="year"
                      name="year"
                      value={formData.year}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#282828] focus:border-transparent text-gray-900"
                    >
                      <option value="">Select year</option>
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year</option>
                      <option value="5">5th Year</option>
                      <option value="6">6th Year</option>
                      <option value="7">7th Year</option>
                      <option value="resident">Resident</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-2">
                    Student ID Number
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-700" />
                    <input
                      type="text"
                      id="studentId"
                      name="studentId"
                      value={formData.studentId}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#282828] focus:border-transparent text-gray-900"
                      placeholder="Your student ID number"
                    />
                  </div>
                </div>

                {/* Student ID Verification */}
                <div className="border border-gray-200 rounded-lg p-6 space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Student ID Verification</h3>
                    <p className="text-sm text-gray-700">
                      Upload your student ID card or enrollment certificate for verification. 
                      Our team will review within 24-48 hours.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Student ID or Enrollment Certificate
                    </label>
                    <label className="block">
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        className="hidden"
                        required
                      />
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-gray-400 transition-colors">
                        <Camera className="w-8 h-8 mx-auto text-gray-700 mb-2" />
                        <p className="text-sm text-gray-700">Click to upload document</p>
                        <p className="text-xs text-gray-700 mt-1">JPG, PNG or PDF up to 5MB</p>
                      </div>
                    </label>
                  </div>

                  <div className="bg-amber-50 p-3 rounded-lg">
                    <p className="text-xs text-amber-800">
                      <strong>Note:</strong> Your application will be reviewed within 24-48 hours. 
                      Once approved, you'll receive an email with your discount code.
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 font-medium transition-colors ${
                    isSubmitting
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-[#282828] text-white hover:bg-gray-800'
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      SUBMITTING APPLICATION...
                    </span>
                  ) : (
                    'APPLY FOR STUDENT DISCOUNT'
                  )}
                </button>
              </form>
            </div>

            {/* Benefits Section */}
            <div className="mt-8 text-center space-y-2">
              <h3 className="font-medium text-gray-900">Student Benefits</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• 15% discount on all medical wear</li>
                <li>• Priority access to new collections</li>
                <li>• Exclusive student-only promotions</li>
                <li>• Free shipping on orders over 150 TND</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="max-w-[1920px] mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-[#282828] text-center mb-12">Student Discount FAQ</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="font-bold text-[#282828] mb-3">How long does verification take?</h3>
                <p className="text-gray-600 text-sm">
                  Most applications are reviewed within 24-48 hours. You'll receive an email 
                  confirmation once your student status is verified.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="font-bold text-[#282828] mb-3">Can I use the discount with sales?</h3>
                <p className="text-gray-600 text-sm">
                  Student discounts cannot be combined with other promotional codes or sale prices. 
                  The best available discount will be automatically applied.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="font-bold text-[#282828] mb-3">How long is the discount valid?</h3>
                <p className="text-gray-600 text-sm">
                  Your student discount is valid for one academic year. You'll need to re-verify 
                  your student status annually to maintain your discount.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="font-bold text-[#282828] mb-3">What if I'm studying abroad?</h3>
                <p className="text-gray-600 text-sm">
                  International students studying healthcare programs are eligible! 
                  Contact us for assistance with document verification.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#282828] text-white">
        <div className="max-w-[1920px] mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <Heart className="w-16 h-16 text-blue-400" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Supporting Tunisia's Future Healthcare Heroes</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              At Casalogy, we believe in investing in the next generation of healthcare professionals. 
              Your education journey deserves the best medical wear at student-friendly prices.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-block px-8 py-4 bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors rounded-lg"
              >
                Have Questions?
              </a>
              <a
                href="/"
                className="inline-block px-8 py-4 bg-white text-[#282828] font-medium hover:bg-gray-100 transition-colors rounded-lg"
              >
                Shop Medical Wear
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}