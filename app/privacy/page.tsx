"use client"

import { Shield, Lock, Eye, FileText, Mail, Phone } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-gray-50 py-16">
        <div className="max-w-[1920px] mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-blue-600 p-4 rounded-full">
                <Shield className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-[#282828] mb-6">
              Privacy <span className="text-blue-600">Policy</span>
            </h1>
            <p className="text-xl text-gray-700">
              Your privacy is important to us. Learn how we collect, use, and protect your personal information 
              when you use Casalogy's medical wear services in Tunisia.
            </p>
            <p className="text-sm text-gray-600 mt-4">
              Last updated: January 15, 2025
            </p>
          </div>
        </div>
      </section>

      {/* Privacy Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 lg:px-8">
          <div className="bg-white rounded-lg p-8 border border-gray-200">
            {/* Introduction */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#282828] mb-4">Introduction</h2>
              <p className="text-gray-700 leading-relaxed">
                Casalogy ("we," "our," or "us") respects your privacy and is committed to protecting your personal data. 
                This privacy policy explains how we collect, use, disclose, and safeguard your information when you visit 
                our website and use our services for medical clothing in Tunisia.
              </p>
            </div>

            {/* Information We Collect */}
            <div className="mb-12">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <Eye className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-[#282828]">Information We Collect</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-[#282828] mb-3">Personal Information</h3>
                  <p className="text-gray-700 mb-3">We may collect the following personal information:</p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>Name, email address, and phone number</li>
                    <li>Shipping and billing addresses within Tunisia</li>
                    <li>Payment information (processed securely through third-party providers)</li>
                    <li>Student verification documents (for discount eligibility)</li>
                    <li>Professional credentials (for medical professional verification)</li>
                    <li>Account preferences and communication settings</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-[#282828] mb-3">Technical Information</h3>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>IP address and browser information</li>
                    <li>Device type and operating system</li>
                    <li>Website usage patterns and preferences</li>
                    <li>Cookies and similar tracking technologies</li>
                    <li>Order history and shopping behavior</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-[#282828] mb-3">Medical Professional Information</h3>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>Medical institution affiliation</li>
                    <li>Professional license information (if provided)</li>
                    <li>Department or specialty area</li>
                    <li>Student status and academic year</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* How We Use Information */}
            <div className="mb-12">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <FileText className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-[#282828]">How We Use Your Information</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-[#282828] mb-2">Order Processing & Fulfillment</h3>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700">
                    <li>Process and fulfill your orders</li>
                    <li>Coordinate delivery within Tunisia</li>
                    <li>Handle returns and exchanges</li>
                    <li>Provide customer support</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-[#282828] mb-2">Account Management</h3>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700">
                    <li>Create and maintain your account</li>
                    <li>Verify student or professional status for discounts</li>
                    <li>Personalize your shopping experience</li>
                    <li>Save your preferences and order history</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-[#282828] mb-2">Communication</h3>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700">
                    <li>Send order confirmations and shipping updates</li>
                    <li>Provide customer service support</li>
                    <li>Send promotional offers (with your consent)</li>
                    <li>Share important policy updates</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-[#282828] mb-2">Business Operations</h3>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700">
                    <li>Improve our website and services</li>
                    <li>Analyze customer preferences and trends</li>
                    <li>Prevent fraud and ensure security</li>
                    <li>Comply with legal obligations in Tunisia</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Information Sharing */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#282828] mb-6">Information Sharing and Disclosure</h2>
              
              <div className="space-y-4">
                <p className="text-gray-700">
                  We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
                </p>

                <div>
                  <h3 className="text-lg font-semibold text-[#282828] mb-2">Service Providers</h3>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700">
                    <li>Payment processors for secure transaction handling</li>
                    <li>Shipping companies for order delivery in Tunisia</li>
                    <li>Email service providers for communication</li>
                    <li>Website hosting and technical support services</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-[#282828] mb-2">Legal Requirements</h3>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700">
                    <li>Compliance with Tunisian laws and regulations</li>
                    <li>Response to legal processes or government requests</li>
                    <li>Protection of our rights and property</li>
                    <li>Investigation of fraud or security issues</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-[#282828] mb-2">Business Transfers</h3>
                  <p className="text-gray-700">
                    In the event of a merger, acquisition, or sale of business assets, your information may be transferred 
                    as part of the transaction, subject to the same privacy protections.
                  </p>
                </div>
              </div>
            </div>

            {/* Data Security */}
            <div className="mb-12">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <Lock className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-[#282828]">Data Security</h2>
              </div>

              <div className="space-y-4">
                <p className="text-gray-700">
                  We implement appropriate technical and organizational measures to protect your personal information:
                </p>

                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>SSL encryption for all data transmission</li>
                  <li>Secure payment processing through certified providers</li>
                  <li>Regular security audits and updates</li>
                  <li>Limited access to personal data on a need-to-know basis</li>
                  <li>Employee training on data protection practices</li>
                  <li>Secure data storage with backup and recovery procedures</li>
                </ul>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
                  <p className="text-yellow-800 text-sm">
                    <strong>Important:</strong> While we strive to protect your information, no method of transmission over 
                    the internet or electronic storage is 100% secure. We cannot guarantee absolute security.
                  </p>
                </div>
              </div>
            </div>

            {/* Your Rights */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#282828] mb-6">Your Rights and Choices</h2>
              
              <div className="space-y-4">
                <p className="text-gray-700">
                  Under Tunisian data protection laws, you have the following rights regarding your personal information:
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-[#282828] mb-2">Access and Portability</h3>
                    <ul className="list-disc pl-6 space-y-1 text-gray-700 text-sm">
                      <li>Request a copy of your personal data</li>
                      <li>Receive your data in a portable format</li>
                      <li>Know how your data is being used</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-[#282828] mb-2">Correction and Updates</h3>
                    <ul className="list-disc pl-6 space-y-1 text-gray-700 text-sm">
                      <li>Correct inaccurate information</li>
                      <li>Update your personal details</li>
                      <li>Complete incomplete data</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-[#282828] mb-2">Deletion and Restriction</h3>
                    <ul className="list-disc pl-6 space-y-1 text-gray-700 text-sm">
                      <li>Request deletion of your data</li>
                      <li>Restrict processing of your information</li>
                      <li>Object to certain uses of your data</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-[#282828] mb-2">Communication Preferences</h3>
                    <ul className="list-disc pl-6 space-y-1 text-gray-700 text-sm">
                      <li>Opt out of marketing communications</li>
                      <li>Manage cookie preferences</li>
                      <li>Control notification settings</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                  <p className="text-blue-800 text-sm">
                    To exercise any of these rights, please contact us using the information provided below. 
                    We will respond to your request within 30 days.
                  </p>
                </div>
              </div>
            </div>

            {/* Cookies */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#282828] mb-6">Cookies and Tracking Technologies</h2>
              
              <div className="space-y-4">
                <p className="text-gray-700">
                  We use cookies and similar technologies to enhance your browsing experience and provide personalized services:
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-[#282828] mb-2">Essential Cookies</h3>
                    <p className="text-gray-700 text-sm">
                      Required for website functionality, including shopping cart, account access, and security features.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-[#282828] mb-2">Performance Cookies</h3>
                    <p className="text-gray-700 text-sm">
                      Help us understand how you use our website to improve performance and user experience.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-[#282828] mb-2">Functional Cookies</h3>
                    <p className="text-gray-700 text-sm">
                      Remember your preferences and settings to provide a personalized experience.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-[#282828] mb-2">Marketing Cookies</h3>
                    <p className="text-gray-700 text-sm">
                      Used to show relevant advertisements and measure the effectiveness of marketing campaigns.
                    </p>
                  </div>
                </div>

                <p className="text-gray-700 text-sm">
                  You can manage your cookie preferences through your browser settings or our cookie consent tool.
                </p>
              </div>
            </div>

            {/* Data Retention */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#282828] mb-6">Data Retention</h2>
              
              <p className="text-gray-700 mb-4">
                We retain your personal information only as long as necessary for the purposes outlined in this policy:
              </p>

              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Account Information:</strong> Until you delete your account or request removal</li>
                <li><strong>Order History:</strong> 7 years for tax and legal compliance in Tunisia</li>
                <li><strong>Student Verification:</strong> Updated annually or until graduation</li>
                <li><strong>Marketing Communications:</strong> Until you unsubscribe</li>
                <li><strong>Website Analytics:</strong> Aggregated data for up to 3 years</li>
              </ul>
            </div>

            {/* International Transfers */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#282828] mb-6">International Data Transfers</h2>
              
              <p className="text-gray-700 mb-4">
                Your personal information is primarily processed and stored in Tunisia. In some cases, we may transfer 
                data to service providers in other countries for:
              </p>

              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Cloud storage and backup services</li>
                <li>Payment processing</li>
                <li>Customer support tools</li>
                <li>Website analytics</li>
              </ul>

              <p className="text-gray-700 mt-4">
                When we transfer data internationally, we ensure appropriate safeguards are in place to protect your information 
                in accordance with Tunisian data protection standards.
              </p>
            </div>

            {/* Updates */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#282828] mb-6">Policy Updates</h2>
              
              <p className="text-gray-700">
                We may update this privacy policy from time to time to reflect changes in our practices or applicable laws. 
                We will notify you of any material changes by:
              </p>

              <ul className="list-disc pl-6 space-y-2 text-gray-700 mt-4">
                <li>Posting the updated policy on our website</li>
                <li>Sending an email notification to registered users</li>
                <li>Displaying a prominent notice on our homepage</li>
              </ul>

              <p className="text-gray-700 mt-4">
                Your continued use of our services after any changes indicates your acceptance of the updated policy.
              </p>
            </div>

            {/* Contact Information */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-[#282828] mb-6">Contact Us</h2>
              
              <p className="text-gray-700 mb-6">
                If you have any questions about this privacy policy or our data practices, please contact us:
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start">
                  <Mail className="w-5 h-5 text-blue-600 mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold text-[#282828] mb-1">Email</h3>
                    <p className="text-gray-700">privacy@casalogy.tn</p>
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
                    <h3 className="font-semibold text-[#282828] mb-1">Mailing Address</h3>
                    <p className="text-gray-700">
                      Casalogy Medical Wear<br />
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