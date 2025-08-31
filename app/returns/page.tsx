"use client"

import { RotateCcw, Package, Truck, Clock, CheckCircle, AlertCircle, Mail, Phone, FileText, Shield } from 'lucide-react'

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-gray-50 py-20">
        <div className="max-w-[1920px] mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-[#282828] mb-6">
              Returns & <span className="text-blue-600">Exchanges</span>
            </h1>
            <p className="text-xl text-gray-700">
              Easy returns and exchanges for Tunisia's healthcare professionals. 
              Your satisfaction is our priority.
            </p>
          </div>
        </div>
      </section>

      {/* Key Info Cards */}
      <section className="py-16">
        <div className="max-w-[1920px] mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-8 rounded-lg border border-gray-200 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-[#282828] mb-2">30-Day Returns</h3>
              <p className="text-gray-600">
                Return unworn, unwashed items with original tags within 30 days of delivery.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg border border-gray-200 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-[#282828] mb-2">Free Size Exchanges</h3>
              <p className="text-gray-600">
                Free size exchanges within Tunisia. We'll send the new size and handle the return.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg border border-gray-200 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-[#282828] mb-2">Quality Guarantee</h3>
              <p className="text-gray-600">
                Defective items are eligible for full refund or replacement at no charge.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Return Process */}
      <section className="py-16 bg-white">
        <div className="max-w-[1920px] mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-[#282828] text-center mb-12">How to Return Your Items</h2>
            
            <div className="grid md:grid-cols-2 gap-12">
              {/* Return Steps */}
              <div>
                <h3 className="text-2xl font-bold text-[#282828] mb-8">Return Process</h3>
                <div className="space-y-6">
                  <div className="flex">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0 mt-1">
                      1
                    </div>
                    <div>
                      <h4 className="font-bold text-[#282828] mb-1">Contact Customer Service</h4>
                      <p className="text-gray-600 text-sm">
                        Call +216 71 123 456 or email support@casalogy.tn to initiate your return. 
                        Have your order number ready.
                      </p>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0 mt-1">
                      2
                    </div>
                    <div>
                      <h4 className="font-bold text-[#282828] mb-1">Receive Return Authorization</h4>
                      <p className="text-gray-600 text-sm">
                        We'll email you a return authorization number and prepaid shipping label 
                        (for eligible returns within Tunisia).
                      </p>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0 mt-1">
                      3
                    </div>
                    <div>
                      <h4 className="font-bold text-[#282828] mb-1">Package Your Items</h4>
                      <p className="text-gray-600 text-sm">
                        Pack items in original packaging with tags attached. Include the return form 
                        and authorization number.
                      </p>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0 mt-1">
                      4
                    </div>
                    <div>
                      <h4 className="font-bold text-[#282828] mb-1">Ship Your Return</h4>
                      <p className="text-gray-600 text-sm">
                        Drop off at any Tunisia Post office or schedule a pickup. 
                        Processing takes 3-5 business days after we receive your return.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Return Conditions */}
              <div>
                <h3 className="text-2xl font-bold text-[#282828] mb-8">Return Conditions</h3>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                  <div className="flex items-start mb-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <h4 className="font-bold text-green-800">Returnable Items</h4>
                  </div>
                  <ul className="space-y-2 text-sm text-green-700 ml-7">
                    <li>• Unworn, unwashed medical clothing</li>
                    <li>• Items with original tags attached</li>
                    <li>• Products in original packaging</li>
                    <li>• Returned within 30 days of delivery</li>
                    <li>• Defective or damaged items (any condition)</li>
                  </ul>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <div className="flex items-start mb-3">
                    <AlertCircle className="w-5 h-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                    <h4 className="font-bold text-red-800">Non-Returnable Items</h4>
                  </div>
                  <ul className="space-y-2 text-sm text-red-700 ml-7">
                    <li>• Worn or washed items</li>
                    <li>• Items without original tags</li>
                    <li>• Customized/embroidered products*</li>
                    <li>• Items returned after 30 days</li>
                    <li>• Undergarments and accessories</li>
                  </ul>
                  <p className="text-xs text-red-600 mt-3 ml-7">
                    *Except for manufacturing defects or our errors
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Exchange Information */}
      <section className="py-16">
        <div className="max-w-[1920px] mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-[#282828] text-center mb-12">Size Exchanges</h2>
            
            <div className="grid md:grid-cols-2 gap-12">
              <div className="bg-white p-8 rounded-lg border border-gray-200">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <RotateCcw className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-[#282828]">Free Size Exchanges</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Need a different size? We offer free size exchanges within Tunisia for unworn items with original tags.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Contact us within 30 days of delivery</li>
                  <li>• We send the new size immediately</li>
                  <li>• Return original size with provided label</li>
                  <li>• No additional charges for size exchanges</li>
                </ul>
              </div>

              <div className="bg-white p-8 rounded-lg border border-gray-200">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                    <Package className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-[#282828]">Sizing Help</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Avoid returns with our comprehensive size guide and personalized fitting assistance.
                </p>
                <div className="space-y-3">
                  <a 
                    href="/size-guide" 
                    className="block text-blue-600 hover:opacity-70 transition-opacity text-sm"
                  >
                    → View detailed size guide
                  </a>
                  <a 
                    href="/contact" 
                    className="block text-blue-600 hover:opacity-70 transition-opacity text-sm"
                  >
                    → Get personalized sizing help
                  </a>
                  <p className="text-xs text-gray-500">
                    Visit our showroom in Tunis for in-person fitting
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Refund Information */}
      <section className="py-16 bg-white">
        <div className="max-w-[1920px] mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-[#282828] text-center mb-12">Refunds & Processing</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-bold text-[#282828] mb-2">Processing Time</h3>
                <p className="text-gray-600 text-sm">
                  3-5 business days after we receive your returned items
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-bold text-[#282828] mb-2">Refund Method</h3>
                <p className="text-gray-600 text-sm">
                  Refunded to original payment method or store credit
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-bold text-[#282828] mb-2">Confirmation</h3>
                <p className="text-gray-600 text-sm">
                  Email confirmation sent when refund is processed
                </p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-12">
              <h3 className="font-bold text-[#282828] mb-3">Refund Details for Tunisia</h3>
              <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-700">
                <div>
                  <h4 className="font-bold text-[#282828] mb-2">Credit Card Refunds</h4>
                  <p>2-5 business days to appear on your statement</p>
                </div>
                <div>
                  <h4 className="font-bold text-[#282828] mb-2">Bank Transfer Refunds</h4>
                  <p>1-3 business days for Tunisian bank accounts</p>
                </div>
                <div>
                  <h4 className="font-bold text-[#282828] mb-2">Cash on Delivery</h4>
                  <p>Bank transfer to your specified account</p>
                </div>
                <div>
                  <h4 className="font-bold text-[#282828] mb-2">Store Credit</h4>
                  <p>Instant credit for future purchases</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shipping Costs */}
      <section className="py-16">
        <div className="max-w-[1920px] mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-[#282828] text-center mb-12">Return Shipping Information</h2>
            
            <div className="bg-white p-8 rounded-lg border border-gray-200">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-[#282828] mb-4">Free Return Shipping</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Defective or damaged items</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Wrong item sent by us</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Size exchanges within Tunisia</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Orders over 300 TND</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-[#282828] mb-4">Customer Pays Shipping</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start">
                      <AlertCircle className="w-5 h-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Change of mind returns (15 TND)</span>
                    </li>
                    <li className="flex items-start">
                      <AlertCircle className="w-5 h-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Orders under 300 TND (15 TND)</span>
                    </li>
                    <li className="flex items-start">
                      <AlertCircle className="w-5 h-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Returns after 14 days (15 TND)</span>
                    </li>
                  </ul>
                  
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <strong>Tunisia Post:</strong> Drop off at any post office or schedule pickup by calling 80-100-300
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-[#282828] text-white">
        <div className="max-w-[1920px] mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Need Help with Your Return?</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Our customer service team is here to help with returns, exchanges, and any questions about our medical clothing.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
              <div className="bg-white/10 p-6 rounded-lg">
                <Phone className="w-8 h-8 mx-auto mb-4 text-blue-400" />
                <h3 className="font-bold mb-2">Call Us</h3>
                <p className="text-gray-300 text-sm mb-3">Monday-Friday: 9 AM - 6 PM<br />Saturday: 9 AM - 2 PM</p>
                <a 
                  href="tel:+21671123456" 
                  className="text-blue-400 hover:opacity-80 transition-opacity"
                >
                  +216 71 123 456
                </a>
              </div>
              
              <div className="bg-white/10 p-6 rounded-lg">
                <Mail className="w-8 h-8 mx-auto mb-4 text-blue-400" />
                <h3 className="font-bold mb-2">Email Us</h3>
                <p className="text-gray-300 text-sm mb-3">Response within 24 hours<br />Include your order number</p>
                <a 
                  href="mailto:support@casalogy.tn" 
                  className="text-blue-400 hover:opacity-80 transition-opacity"
                >
                  support@casalogy.tn
                </a>
              </div>
            </div>
            
            <div className="mt-8">
              <a
                href="/contact"
                className="inline-block px-8 py-4 bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors rounded-lg"
              >
                Contact Support Team
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}