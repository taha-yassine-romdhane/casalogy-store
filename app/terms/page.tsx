"use client"

import { FileText, Scale, ShoppingCart, Shield, AlertTriangle, Mail, Phone } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-gray-50 py-16">
        <div className="max-w-[1920px] mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-blue-600 p-4 rounded-full">
                <Scale className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-[#282828] mb-6">
              Terms of <span className="text-blue-600">Service</span>
            </h1>
            <p className="text-xl text-gray-700">
              Please read these terms and conditions carefully before using Casalogy's medical wear 
              e-commerce platform and services in Tunisia.
            </p>
            <p className="text-sm text-gray-600 mt-4">
              Last updated: January 15, 2025
            </p>
          </div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 lg:px-8">
          <div className="bg-white rounded-lg p-8 border border-gray-200">
            
            {/* Acceptance */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#282828] mb-4">Acceptance of Terms</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                By accessing and using the Casalogy website ("Site") and our services, you accept and agree to be bound by 
                the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
              <p className="text-gray-700 leading-relaxed">
                These Terms of Service ("Terms") govern your use of our website located at casalogy.tn and our medical clothing 
                e-commerce services operated by Casalogy, a company registered in Tunisia.
              </p>
            </div>

            {/* Company Information */}
            <div className="mb-12">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-[#282828]">Company Information</h2>
              </div>

              <div className="space-y-3 text-gray-700">
                <p><strong>Company Name:</strong> Casalogy Medical Wear</p>
                <p><strong>Registration:</strong> Tunisia Commercial Registry</p>
                <p><strong>Address:</strong> 123 Avenue Habib Bourguiba, Tunis 1000, Tunisia</p>
                <p><strong>Email:</strong> legal@casalogy.tn</p>
                <p><strong>Phone:</strong> +216 71 123 456</p>
                <p><strong>VAT Number:</strong> [Tunisia VAT Registration Number]</p>
              </div>
            </div>

            {/* Services */}
            <div className="mb-12">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <ShoppingCart className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-[#282828]">Our Services</h2>
              </div>

              <div className="space-y-4">
                <p className="text-gray-700">
                  Casalogy provides an e-commerce platform for the sale of medical clothing and accessories, including:
                </p>

                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Medical scrubs, lab coats, and professional attire</li>
                  <li>Medical footwear and accessories</li>
                  <li>Student verification and discount services</li>
                  <li>Custom embroidery and personalization services</li>
                  <li>Order fulfillment and delivery within Tunisia</li>
                  <li>Customer support and return/exchange services</li>
                </ul>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                  <p className="text-blue-800 text-sm">
                    <strong>Note:</strong> Our products are designed for medical professionals and students. 
                    We do not provide medical advice or guarantee any medical efficacy of our products.
                  </p>
                </div>
              </div>
            </div>

            {/* User Accounts */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#282828] mb-6">User Accounts and Registration</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-[#282828] mb-2">Account Creation</h3>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700">
                    <li>You must provide accurate, current, and complete information</li>
                    <li>You are responsible for maintaining the confidentiality of your account</li>
                    <li>You must be at least 18 years old to create an account</li>
                    <li>One account per person is permitted</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-[#282828] mb-2">Student and Professional Verification</h3>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700">
                    <li>Student discounts require valid educational institution enrollment</li>
                    <li>Professional discounts may require medical license verification</li>
                    <li>False verification information may result in account suspension</li>
                    <li>Verification documents must be current and authentic</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-[#282828] mb-2">Account Security</h3>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700">
                    <li>You are responsible for all activities under your account</li>
                    <li>Notify us immediately of any unauthorized use</li>
                    <li>Use strong passwords and keep them confidential</li>
                    <li>We may suspend accounts for security reasons</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Orders and Payments */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#282828] mb-6">Orders, Payments, and Pricing</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-[#282828] mb-2">Order Process</h3>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700">
                    <li>Orders are subject to acceptance and product availability</li>
                    <li>We reserve the right to refuse or cancel any order</li>
                    <li>Order confirmation does not guarantee product availability</li>
                    <li>Custom orders may have extended processing times</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-[#282828] mb-2">Pricing and Currency</h3>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700">
                    <li>All prices are listed in Tunisian Dinars (TND)</li>
                    <li>Prices include applicable Tunisian VAT where required</li>
                    <li>Prices may change without notice</li>
                    <li>Promotional pricing is subject to terms and time limits</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-[#282828] mb-2">Payment Methods</h3>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700">
                    <li>Credit/debit cards (Visa, Mastercard)</li>
                    <li>Bank transfers within Tunisia</li>
                    <li>Cash on delivery (where available)</li>
                    <li>Payment processing is handled by certified third-party providers</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-[#282828] mb-2">Order Modifications and Cancellations</h3>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700">
                    <li>Orders can be modified or cancelled within 2 hours of placement</li>
                    <li>Processed orders cannot be modified</li>
                    <li>Custom/embroidered orders cannot be cancelled once production begins</li>
                    <li>Cancellation refunds may take 3-5 business days</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Shipping and Delivery */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#282828] mb-6">Shipping and Delivery</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-[#282828] mb-2">Delivery Areas</h3>
                  <p className="text-gray-700 mb-2">We currently deliver to:</p>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700">
                    <li>All governorates within Tunisia</li>
                    <li>Medical institutions and hospitals</li>
                    <li>Universities and educational facilities</li>
                    <li>Residential and business addresses</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-[#282828] mb-2">Delivery Times and Responsibilities</h3>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700">
                    <li>Standard delivery: 2-4 business days</li>
                    <li>Express delivery: 1-2 business days (major cities)</li>
                    <li>Delivery times are estimates and not guaranteed</li>
                    <li>You must provide accurate delivery information</li>
                    <li>Risk transfers to you upon delivery</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-[#282828] mb-2">Shipping Costs</h3>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700">
                    <li>Free shipping on orders over 200 TND (Zone 1) / 250 TND (Zone 2)</li>
                    <li>Standard shipping: 15 TND</li>
                    <li>Express shipping: 25 TND</li>
                    <li>Same-day delivery: 45 TND (Tunis area only)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Returns and Exchanges */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#282828] mb-6">Returns and Exchanges</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-[#282828] mb-2">Return Policy</h3>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700">
                    <li>30-day return period from delivery date</li>
                    <li>Items must be unworn, unwashed, and in original condition</li>
                    <li>Original tags and packaging must be included</li>
                    <li>Custom/embroidered items are final sale unless defective</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-[#282828] mb-2">Return Process</h3>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700">
                    <li>Contact customer service to initiate return</li>
                    <li>Receive return authorization number</li>
                    <li>Package items securely with return form</li>
                    <li>Return shipping costs vary by reason for return</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-[#282828] mb-2">Refunds and Processing</h3>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700">
                    <li>Refunds processed within 3-5 business days of receipt</li>
                    <li>Refunded to original payment method</li>
                    <li>Original shipping costs are not refundable</li>
                    <li>Store credit may be offered as an alternative</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Intellectual Property */}
            <div className="mb-12">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <Shield className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-[#282828]">Intellectual Property</h2>
              </div>

              <div className="space-y-4">
                <p className="text-gray-700">
                  All content on this website, including but not limited to text, graphics, logos, images, and software, 
                  is the property of Casalogy or its content suppliers and is protected by Tunisian and international copyright laws.
                </p>

                <div>
                  <h3 className="text-lg font-semibold text-[#282828] mb-2">Permitted Use</h3>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700">
                    <li>Personal, non-commercial use of website content</li>
                    <li>Downloading and printing for personal reference</li>
                    <li>Sharing product links and information</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-[#282828] mb-2">Prohibited Use</h3>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700">
                    <li>Commercial use without written permission</li>
                    <li>Reproduction or distribution of content</li>
                    <li>Modification or creation of derivative works</li>
                    <li>Use of automated systems to access the site</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* User Conduct */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#282828] mb-6">User Conduct and Prohibited Activities</h2>
              
              <div className="space-y-4">
                <p className="text-gray-700">
                  By using our services, you agree not to:
                </p>

                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Violate any applicable Tunisian or international laws</li>
                  <li>Infringe on intellectual property rights</li>
                  <li>Upload malicious code or viruses</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Use the service for fraudulent activities</li>
                  <li>Harass, abuse, or harm other users</li>
                  <li>Submit false or misleading information</li>
                  <li>Interfere with the proper working of the service</li>
                  <li>Use automated systems without permission</li>
                  <li>Resell products for commercial purposes without authorization</li>
                </ul>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
                  <div className="flex items-start">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                    <p className="text-yellow-800 text-sm">
                      <strong>Warning:</strong> Violation of these terms may result in immediate account suspension 
                      and legal action under Tunisian law.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Disclaimers */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#282828] mb-6">Disclaimers and Limitations</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-[#282828] mb-2">Service Availability</h3>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700">
                    <li>We do not guarantee uninterrupted service availability</li>
                    <li>Scheduled maintenance may temporarily affect access</li>
                    <li>Product availability is subject to inventory</li>
                    <li>We reserve the right to modify or discontinue services</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-[#282828] mb-2">Product Information</h3>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700">
                    <li>We strive for accuracy but do not guarantee error-free content</li>
                    <li>Colors may vary due to display settings</li>
                    <li>Product descriptions are for general information</li>
                    <li>Size charts are approximations</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-[#282828] mb-2">Medical Disclaimers</h3>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700">
                    <li>Products are clothing items, not medical devices</li>
                    <li>We provide no medical advice or guarantees</li>
                    <li>Consult healthcare professionals for medical needs</li>
                    <li>Individual results and comfort may vary</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-[#282828] mb-2">Limitation of Liability</h3>
                  <p className="text-gray-700 text-sm">
                    To the maximum extent permitted by Tunisian law, Casalogy shall not be liable for any indirect, 
                    incidental, special, or consequential damages resulting from your use of our services. 
                    Our total liability shall not exceed the amount paid for the specific product or service.
                  </p>
                </div>
              </div>
            </div>

            {/* Governing Law */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#282828] mb-6">Governing Law and Disputes</h2>
              
              <div className="space-y-4">
                <p className="text-gray-700">
                  These Terms of Service are governed by the laws of the Republic of Tunisia. Any disputes arising from 
                  these terms or your use of our services shall be subject to the exclusive jurisdiction of the courts of Tunisia.
                </p>

                <div>
                  <h3 className="text-lg font-semibold text-[#282828] mb-2">Dispute Resolution</h3>
                  <ol className="list-decimal pl-6 space-y-1 text-gray-700">
                    <li>Contact our customer service team first</li>
                    <li>Attempt mediation through recognized Tunisian mediation services</li>
                    <li>Legal proceedings in Tunisian courts if necessary</li>
                  </ol>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-[#282828] mb-2">Consumer Rights</h3>
                  <p className="text-gray-700 text-sm">
                    These terms do not affect your statutory consumer rights under Tunisian consumer protection law. 
                    You may have additional rights that cannot be excluded or limited.
                  </p>
                </div>
              </div>
            </div>

            {/* Changes to Terms */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#282828] mb-6">Changes to Terms</h2>
              
              <p className="text-gray-700 mb-4">
                We reserve the right to modify these Terms of Service at any time. Changes will be effective immediately 
                upon posting on our website. We will notify users of material changes through:
              </p>

              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Email notification to registered users</li>
                <li>Prominent website notice</li>
                <li>Account dashboard notifications</li>
              </ul>

              <p className="text-gray-700 mt-4">
                Your continued use of our services after changes constitutes acceptance of the new terms.
              </p>
            </div>

            {/* Severability */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#282828] mb-6">Severability and Entire Agreement</h2>
              
              <div className="space-y-4">
                <p className="text-gray-700">
                  If any provision of these terms is found to be unenforceable or invalid, that provision shall be 
                  limited or eliminated to the minimum extent necessary so that the remaining terms shall remain in full force and effect.
                </p>

                <p className="text-gray-700">
                  These Terms of Service, along with our Privacy Policy, constitute the entire agreement between you and 
                  Casalogy regarding your use of our services.
                </p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-[#282828] mb-6">Contact Information</h2>
              
              <p className="text-gray-700 mb-6">
                If you have any questions about these Terms of Service, please contact us:
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start">
                  <Mail className="w-5 h-5 text-blue-600 mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold text-[#282828] mb-1">Email</h3>
                    <p className="text-gray-700">legal@casalogy.tn</p>
                    <p className="text-gray-700">support@casalogy.tn</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="w-5 h-5 text-blue-600 mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold text-[#282828] mb-1">Phone</h3>
                    <p className="text-gray-700">+216 71 123 456</p>
                    <p className="text-gray-600 text-sm">Monday-Friday: 9 AM - 6 PM (Tunisia Time)</p>
                  </div>
                </div>

                <div className="md:col-span-2 flex items-start">
                  <FileText className="w-5 h-5 text-blue-600 mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold text-[#282828] mb-1">Legal Department</h3>
                    <p className="text-gray-700">
                      Casalogy Medical Wear - Legal Department<br />
                      123 Avenue Habib Bourguiba<br />
                      Tunis 1000, Tunisia
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}