"use client"

import { Accessibility, Eye, Ear, MousePointer, Keyboard, Monitor, Users, CheckCircle, AlertCircle, Mail, Phone } from 'lucide-react'

export default function AccessibilityPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-blue-50 py-16">
        <div className="max-w-[1920px] mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-green-600 p-4 rounded-full">
                <Accessibility className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-[#282828] mb-6">
              Accessibility <span className="text-green-600">Statement</span>
            </h1>
            <p className="text-xl text-gray-700">
              Casalogy is committed to ensuring digital accessibility for people with disabilities in Tunisia and worldwide. 
              We are continually improving the user experience for everyone.
            </p>
            <p className="text-sm text-gray-600 mt-4">
              Last updated: January 15, 2025
            </p>
          </div>
        </div>
      </section>

      {/* Accessibility Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 lg:px-8">
          <div className="bg-white rounded-lg p-8 border border-gray-200">
            
            {/* Our Commitment */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#282828] mb-4">Our Commitment to Accessibility</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                At Casalogy, we believe that healthcare professionals and students, regardless of their abilities, 
                should have equal access to quality medical clothing and our online services. We are committed to 
                providing an inclusive digital experience that serves all users in Tunisia's medical community.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We strive to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards and 
                continuously work to improve accessibility across our platform to ensure everyone can easily navigate, 
                understand, and interact with our website.
              </p>
            </div>

            {/* Standards Compliance */}
            <div className="mb-12">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-[#282828]">Accessibility Standards</h2>
              </div>

              <div className="space-y-4">
                <p className="text-gray-700">
                  Our website aims to comply with the following accessibility standards:
                </p>

                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li><strong>WCAG 2.1 Level AA:</strong> Web Content Accessibility Guidelines by W3C</li>
                  <li><strong>Section 508:</strong> U.S. federal accessibility requirements</li>
                  <li><strong>EN 301 549:</strong> European accessibility standard</li>
                  <li><strong>ISO/IEC 40500:</strong> International accessibility standard</li>
                </ul>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
                  <p className="text-green-800 text-sm">
                    <strong>Goal:</strong> We aim to achieve and maintain WCAG 2.1 Level AA compliance across 
                    all areas of our website to ensure equal access for all users.
                  </p>
                </div>
              </div>
            </div>

            {/* Accessibility Features */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#282828] mb-6">Accessibility Features</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <div className="flex items-center mb-4">
                    <Eye className="w-6 h-6 text-blue-600 mr-3" />
                    <h3 className="text-lg font-semibold text-[#282828]">Visual Accessibility</h3>
                  </div>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700 text-sm">
                    <li>High contrast color schemes</li>
                    <li>Scalable text up to 200% without loss of functionality</li>
                    <li>Clear, readable fonts and appropriate font sizes</li>
                    <li>Alternative text for all images and icons</li>
                    <li>Visual focus indicators for keyboard navigation</li>
                    <li>Color is not the sole means of conveying information</li>
                  </ul>
                </div>

                <div>
                  <div className="flex items-center mb-4">
                    <Keyboard className="w-6 h-6 text-green-600 mr-3" />
                    <h3 className="text-lg font-semibold text-[#282828]">Keyboard Navigation</h3>
                  </div>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700 text-sm">
                    <li>Full keyboard accessibility throughout the site</li>
                    <li>Logical tab order for all interactive elements</li>
                    <li>Skip navigation links to main content</li>
                    <li>Keyboard shortcuts for common actions</li>
                    <li>No keyboard traps in any interface</li>
                    <li>Clear focus indicators for all focusable elements</li>
                  </ul>
                </div>

                <div>
                  <div className="flex items-center mb-4">
                    <Ear className="w-6 h-6 text-purple-600 mr-3" />
                    <h3 className="text-lg font-semibold text-[#282828]">Screen Reader Support</h3>
                  </div>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700 text-sm">
                    <li>Semantic HTML structure and proper headings</li>
                    <li>Descriptive link text and button labels</li>
                    <li>ARIA labels and landmarks for navigation</li>
                    <li>Compatible with popular screen readers</li>
                    <li>Form labels and error message announcements</li>
                    <li>Page titles that describe content and location</li>
                  </ul>
                </div>

                <div>
                  <div className="flex items-center mb-4">
                    <MousePointer className="w-6 h-6 text-orange-600 mr-3" />
                    <h3 className="text-lg font-semibold text-[#282828]">Motor Accessibility</h3>
                  </div>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700 text-sm">
                    <li>Large click targets (minimum 44x44 pixels)</li>
                    <li>Adequate spacing between interactive elements</li>
                    <li>No time limits on form completion</li>
                    <li>Drag and drop alternatives provided</li>
                    <li>Multiple ways to access the same functionality</li>
                    <li>Error prevention and correction mechanisms</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Assistive Technologies */}
            <div className="mb-12">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <Monitor className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-[#282828]">Supported Assistive Technologies</h2>
              </div>

              <p className="text-gray-700 mb-4">
                Our website is designed to be compatible with the following assistive technologies:
              </p>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-[#282828] mb-3">Screen Readers</h3>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700">
                    <li>NVDA (Windows)</li>
                    <li>JAWS (Windows)</li>
                    <li>VoiceOver (macOS/iOS)</li>
                    <li>TalkBack (Android)</li>
                    <li>Orca (Linux)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-[#282828] mb-3">Input Methods</h3>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700">
                    <li>Standard keyboards</li>
                    <li>Alternative keyboards</li>
                    <li>Voice recognition software</li>
                    <li>Switch devices</li>
                    <li>Eye-tracking systems</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-[#282828] mb-3">Browsers</h3>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700">
                    <li>Chrome (Windows, macOS, Android)</li>
                    <li>Firefox (Windows, macOS, Linux)</li>
                    <li>Safari (macOS, iOS)</li>
                    <li>Edge (Windows)</li>
                    <li>Internet Explorer 11</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-[#282828] mb-3">Mobile Devices</h3>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700">
                    <li>iOS with VoiceOver</li>
                    <li>Android with TalkBack</li>
                    <li>Mobile browser accessibility features</li>
                    <li>Touch and gesture alternatives</li>
                    <li>Voice control compatibility</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Current Status */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#282828] mb-6">Current Accessibility Status</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-[#282828] mb-2">Implemented Features</h3>
                    <ul className="list-disc pl-6 space-y-1 text-gray-700 text-sm">
                      <li>Semantic HTML structure throughout the site</li>
                      <li>Keyboard navigation for all interactive elements</li>
                      <li>Alternative text for product images and icons</li>
                      <li>High contrast color schemes meeting WCAG standards</li>
                      <li>Responsive design for various screen sizes</li>
                      <li>Form labels and error messaging</li>
                      <li>Skip navigation links</li>
                      <li>Focus management for dynamic content</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start">
                  <AlertCircle className="w-6 h-6 text-yellow-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-[#282828] mb-2">Areas of Ongoing Improvement</h3>
                    <ul className="list-disc pl-6 space-y-1 text-gray-700 text-sm">
                      <li>Enhanced ARIA landmarks and descriptions</li>
                      <li>Improved color contrast in some interface elements</li>
                      <li>Additional keyboard shortcuts for power users</li>
                      <li>Enhanced mobile accessibility features</li>
                      <li>Video content captioning and transcripts</li>
                      <li>Multi-language accessibility support</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Testing and Validation */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#282828] mb-6">Testing and Validation</h2>
              
              <div className="space-y-4">
                <p className="text-gray-700">
                  We regularly test our website accessibility through:
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-[#282828] mb-2">Automated Testing</h3>
                    <ul className="list-disc pl-6 space-y-1 text-gray-700 text-sm">
                      <li>WAVE accessibility evaluation tool</li>
                      <li>axe accessibility checker</li>
                      <li>Lighthouse accessibility audits</li>
                      <li>Pa11y command-line testing</li>
                      <li>Color contrast analyzers</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-[#282828] mb-2">Manual Testing</h3>
                    <ul className="list-disc pl-6 space-y-1 text-gray-700 text-sm">
                      <li>Keyboard-only navigation testing</li>
                      <li>Screen reader compatibility testing</li>
                      <li>Mobile accessibility testing</li>
                      <li>User testing with accessibility tools</li>
                      <li>Expert accessibility reviews</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                  <p className="text-blue-800 text-sm">
                    <strong>Regular Audits:</strong> We conduct comprehensive accessibility audits quarterly 
                    and address any issues promptly to maintain high accessibility standards.
                  </p>
                </div>
              </div>
            </div>

            {/* User Support */}
            <div className="mb-12">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-[#282828]">User Support and Assistance</h2>
              </div>

              <div className="space-y-4">
                <p className="text-gray-700">
                  If you encounter any accessibility barriers while using our website, we are here to help:
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-[#282828] mb-2">Immediate Assistance</h3>
                    <ul className="list-disc pl-6 space-y-1 text-gray-700 text-sm">
                      <li>Call our accessibility support line</li>
                      <li>Email our accessibility team</li>
                      <li>Request information in alternative formats</li>
                      <li>Get help with online ordering</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-[#282828] mb-2">Alternative Access Methods</h3>
                    <ul className="list-disc pl-6 space-y-1 text-gray-700 text-sm">
                      <li>Phone ordering assistance</li>
                      <li>Email catalog requests</li>
                      <li>In-person showroom visits</li>
                      <li>Personal shopping assistance</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-[#282828] mb-2">Response Times</h3>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700">
                    <li><strong>Phone support:</strong> Immediate assistance during business hours</li>
                    <li><strong>Email support:</strong> Response within 24 hours</li>
                    <li><strong>Accessibility issues:</strong> Acknowledged within 48 hours</li>
                    <li><strong>Critical accessibility barriers:</strong> Priority response within 24 hours</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Feedback and Complaints */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#282828] mb-6">Feedback and Improvement</h2>
              
              <div className="space-y-4">
                <p className="text-gray-700">
                  We welcome your feedback on the accessibility of our website. Your input helps us identify 
                  areas for improvement and prioritize accessibility enhancements.
                </p>

                <div>
                  <h3 className="text-lg font-semibold text-[#282828] mb-2">How to Provide Feedback</h3>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>Use our accessible feedback form on the website</li>
                    <li>Email our accessibility team directly</li>
                    <li>Call our dedicated accessibility support line</li>
                    <li>Request a callback at your convenience</li>
                    <li>Provide feedback during customer service interactions</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-[#282828] mb-2">What We Do With Your Feedback</h3>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700">
                    <li>Acknowledge receipt within 48 hours</li>
                    <li>Investigate and assess the issue</li>
                    <li>Provide updates on progress</li>
                    <li>Implement improvements where possible</li>
                    <li>Follow up to ensure resolution</li>
                  </ul>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
                  <p className="text-yellow-800 text-sm">
                    <strong>Complaint Process:</strong> If you are not satisfied with our accessibility efforts, 
                    you may file a formal complaint with our management team or relevant Tunisian authorities.
                  </p>
                </div>
              </div>
            </div>

            {/* Ongoing Commitment */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#282828] mb-6">Our Ongoing Commitment</h2>
              
              <div className="space-y-4">
                <p className="text-gray-700">
                  Accessibility is an ongoing effort, not a one-time achievement. We are committed to:
                </p>

                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Continuously monitoring and improving website accessibility</li>
                  <li>Training our staff on accessibility best practices</li>
                  <li>Staying current with accessibility standards and guidelines</li>
                  <li>Incorporating accessibility into our development processes</li>
                  <li>Engaging with the disability community for feedback and guidance</li>
                  <li>Regular accessibility audits and updates</li>
                  <li>Transparent communication about our accessibility efforts</li>
                </ul>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
                  <p className="text-green-800 text-sm">
                    <strong>Our Promise:</strong> We are dedicated to making Casalogy accessible to all members 
                    of Tunisia's healthcare community, regardless of their abilities or assistive technology needs.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-[#282828] mb-6">Accessibility Support Contact</h2>
              
              <p className="text-gray-700 mb-6">
                For accessibility support, alternative formats, or to report accessibility issues:
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start">
                  <Mail className="w-5 h-5 text-green-600 mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold text-[#282828] mb-1">Email</h3>
                    <p className="text-gray-700">accessibility@casalogy.tn</p>
                    <p className="text-gray-700">support@casalogy.tn</p>
                    <p className="text-gray-600 text-sm">Response within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="w-5 h-5 text-green-600 mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold text-[#282828] mb-1">Phone</h3>
                    <p className="text-gray-700">+216 71 123 456</p>
                    <p className="text-gray-600 text-sm">Monday-Friday: 9 AM - 6 PM (Tunisia Time)</p>
                    <p className="text-gray-600 text-sm">Accessibility support available</p>
                  </div>
                </div>

                <div className="md:col-span-2 flex items-start">
                  <Accessibility className="w-5 h-5 text-green-600 mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold text-[#282828] mb-1">Accessibility Team</h3>
                    <p className="text-gray-700">
                      Casalogy Medical Wear - Accessibility Department<br />
                      123 Avenue Habib Bourguiba<br />
                      Tunis 1000, Tunisia
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-blue-800 text-sm">
                  <strong>Alternative Formats:</strong> This accessibility statement is available in large print, 
                  audio format, and other accessible formats upon request.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}