"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Lock, Mail, Shield, Clock, UserCheck, MessageCircle, ArrowLeft, CheckCircle } from "lucide-react"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")

  const handleContactRedirect = () => {
    // Redirect to contact page with password reset context
    router.push('/contact?subject=Password Reset Request')
  }

  const passwordResetRules = [
    {
      icon: <UserCheck className="w-5 h-5 text-blue-600" />,
      title: "Account Verification Required",
      description: "You must provide proof of identity to verify account ownership"
    },
    {
      icon: <Mail className="w-5 h-5 text-green-600" />,
      title: "Valid Email Address",
      description: "Use the email address associated with your Casalogy account"
    },
    {
      icon: <Clock className="w-5 h-5 text-orange-600" />,
      title: "Processing Time",
      description: "Password reset requests are processed within 24-48 hours during business days"
    },
    {
      icon: <Shield className="w-5 h-5 text-purple-600" />,
      title: "Security Verification",
      description: "Additional verification may be required for account security"
    }
  ]

  const contactInstructions = [
    "Include your registered email address",
    "Provide your full name as registered",
    "Mention your phone number for verification",
    "Include any order numbers from recent purchases (if available)",
    "Clearly state 'Password Reset Request' in your message"
  ]

  return (
    <div className="min-h-[calc(100vh-72px)] bg-gray-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white p-10 rounded-lg shadow-sm">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-[#282828] mb-2">Forgot Your Password?</h1>
            <p className="text-gray-700">
              Don't worry! Follow our secure password reset process to regain access to your account.
            </p>
          </div>

          {/* Password Reset Rules */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-[#282828] mb-6">Password Reset Requirements</h2>
            <div className="space-y-4">
              {passwordResetRules.map((rule, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 mt-0.5">
                    {rule.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">{rule.title}</h3>
                    <p className="text-sm text-gray-700">{rule.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Instructions */}
          <div className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-4 flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              How to Request Password Reset
            </h3>
            <p className="text-blue-800 text-sm mb-4">
              For security reasons, password resets must be handled manually by our support team. 
              Please contact us with the following information:
            </p>
            <ul className="space-y-2">
              {contactInstructions.map((instruction, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-blue-800">
                  <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>{instruction}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Privacy & Security Policy */}
          <div className="mb-8 p-6 bg-green-50 rounded-lg border border-green-200">
            <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Our Password Security Policy
            </h3>
            <div className="space-y-3 text-sm text-green-800">
              <p>
                <strong>Privacy Protection:</strong> We do not store or know your actual password. 
                All passwords are encrypted using advanced security measures, making them unreadable even to our team.
              </p>
              <p>
                <strong>Password Recovery Process:</strong> Since we cannot see your current password, 
                our admin team will generate a secure temporary password for your account upon verification.
              </p>
              <p>
                <strong>Secure Delivery:</strong> The new temporary password will be sent directly 
                to your registered email address, allowing you to regain access to your account safely.
              </p>
              <p>
                <strong>Next Steps:</strong> Once you log in with the temporary password, 
                you can immediately change it to a new password of your choice in your account settings.
              </p>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mb-8 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <h3 className="font-medium text-amber-900 mb-2 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Security Notice
            </h3>
            <p className="text-sm text-amber-800">
              We take account security seriously. Manual password resets help protect your account 
              from unauthorized access. Our support team will verify your identity before processing any requests.
            </p>
          </div>

          {/* Contact Button */}
          <div className="text-center">
            <button
              onClick={handleContactRedirect}
              className="w-full py-3 bg-[#282828] text-white font-medium hover:bg-gray-800 transition-colors rounded-lg mb-4"
            >
              Contact Support for Password Reset
            </button>
            
            <div className="text-center">
              <p className="text-gray-700 mb-4">
                Remember your password?{" "}
                <Link href="/login" className="text-[#282828] font-medium hover:opacity-70">
                  Sign in
                </Link>
              </p>
              
              <Link 
                href="/login" 
                className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Login
              </Link>
            </div>
          </div>
        </div>

        {/* Additional Help Section */}
        <div className="mt-8 text-center space-y-2">
          <h3 className="font-medium text-gray-900">Need Additional Help?</h3>
          <div className="text-sm text-gray-700 space-y-1">
            <p>• Check your email for any previous reset instructions</p>
            <p>• Ensure you're using the correct email address</p>
            <p>• Contact us during business hours for faster response</p>
            <p>• Keep your account information handy for verification</p>
          </div>
        </div>
      </div>
    </div>
  )
}