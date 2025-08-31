"use client"

import { Truck, Clock, MapPin, Package, CheckCircle, AlertCircle, Info, Phone, Mail, Calculator, Shield, Zap } from 'lucide-react'

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-gray-50 py-20">
        <div className="max-w-[1920px] mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-[#282828] mb-6">
              Shipping & <span className="text-blue-600">Delivery</span>
            </h1>
            <p className="text-xl text-gray-700">
              Fast, reliable delivery across Tunisia for medical professionals. 
              Free shipping on orders over 200 TND.
            </p>
          </div>
        </div>
      </section>

      {/* Key Shipping Info Cards */}
      <section className="py-16">
        <div className="max-w-[1920px] mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-8 rounded-lg border border-gray-200 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-[#282828] mb-2">Free Shipping</h3>
              <p className="text-gray-600">
                Orders over 200 TND qualify for free standard shipping anywhere in Tunisia.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg border border-gray-200 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-[#282828] mb-2">Express Delivery</h3>
              <p className="text-gray-600">
                Next-day delivery available in Tunis, Sfax, and Sousse for urgent orders.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg border border-gray-200 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-[#282828] mb-2">Secure Packaging</h3>
              <p className="text-gray-600">
                Medical clothing carefully packaged to maintain quality and sterility.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Shipping Options */}
      <section className="py-16 bg-white">
        <div className="max-w-[1920px] mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-[#282828] text-center mb-12">Shipping Options in Tunisia</h2>
            
            <div className="space-y-6">
              {/* Standard Shipping */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-8">
                <div className="flex items-start justify-between">
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-6 flex-shrink-0">
                      <Truck className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-[#282828] mb-2">Standard Shipping</h3>
                      <p className="text-gray-600 mb-4">
                        Reliable delivery to your door via Tunisia Post and local courier partners.
                      </p>
                      <div className="grid md:grid-cols-3 gap-6">
                        <div>
                          <h4 className="font-bold text-[#282828] mb-1">Delivery Time</h4>
                          <p className="text-gray-600 text-sm">2-4 business days</p>
                        </div>
                        <div>
                          <h4 className="font-bold text-[#282828] mb-1">Cost</h4>
                          <p className="text-gray-600 text-sm">15 TND (Free over 200 TND)</p>
                        </div>
                        <div>
                          <h4 className="font-bold text-[#282828] mb-1">Tracking</h4>
                          <p className="text-gray-600 text-sm">Full tracking provided</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Express Shipping */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-8">
                <div className="flex items-start justify-between">
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-6 flex-shrink-0">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-[#282828] mb-2">Express Shipping</h3>
                      <p className="text-gray-600 mb-4">
                        Priority delivery for urgent orders to major Tunisian cities.
                      </p>
                      <div className="grid md:grid-cols-3 gap-6">
                        <div>
                          <h4 className="font-bold text-[#282828] mb-1">Delivery Time</h4>
                          <p className="text-gray-600 text-sm">1-2 business days</p>
                        </div>
                        <div>
                          <h4 className="font-bold text-[#282828] mb-1">Cost</h4>
                          <p className="text-gray-600 text-sm">25 TND</p>
                        </div>
                        <div>
                          <h4 className="font-bold text-[#282828] mb-1">Availability</h4>
                          <p className="text-gray-600 text-sm">Major cities only</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Same-Day Delivery */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-8">
                <div className="flex items-start justify-between">
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mr-6 flex-shrink-0">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-[#282828] mb-2">Same-Day Delivery</h3>
                      <p className="text-gray-600 mb-4">
                        Emergency delivery service within Greater Tunis area.
                      </p>
                      <div className="grid md:grid-cols-3 gap-6">
                        <div>
                          <h4 className="font-bold text-[#282828] mb-1">Delivery Time</h4>
                          <p className="text-gray-600 text-sm">4-8 hours</p>
                        </div>
                        <div>
                          <h4 className="font-bold text-[#282828] mb-1">Cost</h4>
                          <p className="text-gray-600 text-sm">45 TND</p>
                        </div>
                        <div>
                          <h4 className="font-bold text-[#282828] mb-1">Order By</h4>
                          <p className="text-gray-600 text-sm">2:00 PM for same day</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Delivery Zones */}
      <section className="py-16">
        <div className="max-w-[1920px] mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-[#282828] text-center mb-12">Delivery Zones in Tunisia</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-lg border border-gray-200">
                <div className="flex items-center mb-6">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <h3 className="text-xl font-bold text-[#282828]">Zone 1 - Major Cities</h3>
                </div>
                <div className="mb-6">
                  <p className="text-gray-600 mb-4">
                    Standard delivery: 1-2 business days<br />
                    Express delivery: Same day or next day
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                    <div>• Tunis & Greater Tunis</div>
                    <div>• Sfax</div>
                    <div>• Sousse</div>
                    <div>• Monastir</div>
                    <div>• Nabeul</div>
                    <div>• Bizerte</div>
                    <div>• Gabes</div>
                    <div>• Ariana</div>
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>Free shipping</strong> on orders over 200 TND
                  </p>
                </div>
              </div>

              <div className="bg-white p-8 rounded-lg border border-gray-200">
                <div className="flex items-center mb-6">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                  <h3 className="text-xl font-bold text-[#282828]">Zone 2 - Other Areas</h3>
                </div>
                <div className="mb-6">
                  <p className="text-gray-600 mb-4">
                    Standard delivery: 3-5 business days<br />
                    Express delivery: 2-3 business days
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                    <div>• Kairouan</div>
                    <div>• Gafsa</div>
                    <div>• Mahdia</div>
                    <div>• Beja</div>
                    <div>• Jendouba</div>
                    <div>• Siliana</div>
                    <div>• Zaghouan</div>
                    <div>• Other regions</div>
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Free shipping</strong> on orders over 250 TND
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Institutional Delivery */}
      <section className="py-16 bg-white">
        <div className="max-w-[1920px] mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-[#282828] text-center mb-12">Institutional Delivery</h2>
            
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                    <Package className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-[#282828]">Hospital & Clinic Delivery</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Special delivery arrangements for healthcare facilities across Tunisia.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Bulk order discounts (10+ items)</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Scheduled delivery appointments</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Direct delivery to departments</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Invoice billing options</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <MapPin className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-[#282828]">Medical School Delivery</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Convenient delivery to medical schools and universities throughout Tunisia.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Student discount applies (15% off)</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Campus delivery available</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Group order coordination</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Semester start rush delivery</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Order Tracking */}
      <section className="py-16">
        <div className="max-w-[1920px] mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-[#282828] text-center mb-12">Order Tracking</h2>
            
            <div className="bg-white p-8 rounded-lg border border-gray-200">
              <div className="text-center mb-8">
                <p className="text-gray-600">
                  Track your order every step of the way from our warehouse to your door.
                </p>
              </div>
              
              <div className="grid md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-[#282828] mb-2">Order Confirmed</h3>
                  <p className="text-gray-600 text-sm">
                    Order received and payment confirmed
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-yellow-600" />
                  </div>
                  <h3 className="font-bold text-[#282828] mb-2">Preparing</h3>
                  <p className="text-gray-600 text-sm">
                    Items being picked and packaged
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Truck className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="font-bold text-[#282828] mb-2">In Transit</h3>
                  <p className="text-gray-600 text-sm">
                    Package is on its way to you
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-bold text-[#282828] mb-2">Delivered</h3>
                  <p className="text-gray-600 text-sm">
                    Package delivered to your address
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg mt-8">
                <h3 className="font-bold text-[#282828] mb-3">How to Track Your Order</h3>
                <ol className="space-y-2 text-sm text-gray-700">
                  <li>1. Check your email for the tracking number after your order ships</li>
                  <li>2. Visit our tracking page or use the carrier's website directly</li>
                  <li>3. Get real-time updates via SMS (optional)</li>
                  <li>4. Contact us if you need assistance with tracking</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shipping Calculator */}
      <section className="py-16 bg-white">
        <div className="max-w-[1920px] mx-auto px-4 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-[#282828] text-center mb-12">Shipping Calculator</h2>
            
            <div className="bg-gray-50 p-8 rounded-lg border border-gray-200">
              <div className="flex items-center justify-center mb-6">
                <Calculator className="w-12 h-12 text-blue-600" />
              </div>
              
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-[#282828] mb-2">Calculate Your Shipping Cost</h3>
                <p className="text-gray-600">
                  Enter your details to get an accurate shipping estimate.
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-[#282828] mb-2">
                    Delivery City
                  </label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600">
                    <option value="">Select your city</option>
                    <option value="tunis">Tunis (Zone 1)</option>
                    <option value="sfax">Sfax (Zone 1)</option>
                    <option value="sousse">Sousse (Zone 1)</option>
                    <option value="other-zone1">Other Zone 1 Cities</option>
                    <option value="zone2">Zone 2 Cities</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#282828] mb-2">
                    Order Value (TND)
                  </label>
                  <input 
                    type="number" 
                    placeholder="Enter order value"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#282828] mb-2">
                    Shipping Speed
                  </label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600">
                    <option value="standard">Standard (2-4 days)</option>
                    <option value="express">Express (1-2 days)</option>
                    <option value="same-day">Same Day (Tunis only)</option>
                  </select>
                </div>
              </div>

              <button className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                Calculate Shipping Cost
              </button>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start">
                  <Info className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Free Shipping Thresholds:</p>
                    <p>• Zone 1: Orders over 200 TND</p>
                    <p>• Zone 2: Orders over 250 TND</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="max-w-[1920px] mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-[#282828] text-center mb-12">Shipping FAQ</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="font-bold text-[#282828] mb-3">What if I'm not home during delivery?</h3>
                <p className="text-gray-600 text-sm">
                  Our delivery partners will attempt delivery twice. If unsuccessful, they'll leave a pickup notice. 
                  You can also arrange delivery to your workplace or schedule redelivery.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="font-bold text-[#282828] mb-3">Do you deliver to P.O. Boxes?</h3>
                <p className="text-gray-600 text-sm">
                  Yes, we deliver to P.O. Boxes through Tunisia Post. However, express and same-day delivery 
                  options are not available for P.O. Box addresses.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="font-bold text-[#282828] mb-3">Can I change my delivery address?</h3>
                <p className="text-gray-600 text-sm">
                  You can change your delivery address within 2 hours of placing your order. 
                  Contact customer service immediately at +216 71 123 456.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="font-bold text-[#282828] mb-3">What about customs for international orders?</h3>
                <p className="text-gray-600 text-sm">
                  For international shipping outside Tunisia, additional customs fees may apply. 
                  Contact us for international shipping rates and customs information.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-[#282828] text-white">
        <div className="max-w-[1920px] mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Questions About Shipping?</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Our shipping team is here to help with delivery questions, tracking issues, or special delivery requests.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
              <div className="bg-white/10 p-6 rounded-lg">
                <Phone className="w-8 h-8 mx-auto mb-4 text-blue-400" />
                <h3 className="font-bold mb-2">Call Shipping Support</h3>
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
                <h3 className="font-bold mb-2">Email Support</h3>
                <p className="text-gray-300 text-sm mb-3">For tracking and delivery questions<br />Response within 4 hours</p>
                <a 
                  href="mailto:shipping@casalogy.tn" 
                  className="text-blue-400 hover:opacity-80 transition-opacity"
                >
                  shipping@casalogy.tn
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