"use client"

import { useState } from 'react'
import { ChevronDown, ChevronUp, Search, Package, Shirt, Truck, CreditCard, Users, Shield, HelpCircle } from 'lucide-react'

interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
}

const faqData: FAQItem[] = [
  // Medical Clothing FAQs
  {
    id: "1",
    category: "Medical Clothing",
    question: "What types of medical clothing do you offer?",
    answer: "We offer a comprehensive range of medical clothing including scrubs (tops and pants), lab coats, underscrubs, medical footwear, surgical caps, and accessories like stethoscope covers and badge reels. All our products are designed specifically for medical students and healthcare professionals in Tunisia."
  },
  {
    id: "2",
    category: "Medical Clothing",
    question: "Are your scrubs suitable for both medical students and professionals?",
    answer: "Yes, absolutely! Our scrubs are designed to meet the needs of both medical students and practicing healthcare professionals. We offer different styles and fits to accommodate various workplace requirements and personal preferences."
  },
  {
    id: "3",
    category: "Medical Clothing",
    question: "What fabrics are used in your medical clothing?",
    answer: "We use high-quality, medical-grade fabrics that are durable, breathable, and easy to care for. Our materials are designed to withstand frequent washing and sterilization processes while maintaining their shape and color. Most of our products feature moisture-wicking and antimicrobial properties."
  },
  {
    id: "4",
    category: "Medical Clothing",
    question: "How do I choose the right size for scrubs?",
    answer: "We provide a detailed size guide with measurements for chest, waist, and length. We recommend measuring yourself and comparing with our size chart. If you're between sizes, we suggest sizing up for comfort during long shifts. You can also visit our showroom in Tunis for personalized fitting assistance."
  },
  {
    id: "5",
    category: "Medical Clothing",
    question: "Can I customize or embroider my medical clothing?",
    answer: "Yes, we offer customization services including embroidery of names, titles, hospital logos, and medical school emblems. Contact our customer service team for customization options, pricing, and turnaround times."
  },
  {
    id: "6",
    category: "Medical Clothing",
    question: "How do I care for and wash my medical scrubs?",
    answer: "Wash scrubs in warm water (40°C) with mild detergent. Avoid bleach unless necessary for disinfection. Tumble dry on medium heat or air dry. Iron on low heat if needed. For heavily soiled scrubs, pre-treat stains and consider a disinfectant rinse cycle."
  },

  // Shipping & Delivery FAQs
  {
    id: "7",
    category: "Shipping & Delivery",
    question: "Do you offer free shipping in Tunisia?",
    answer: "Yes, we offer free standard shipping within Tunisia for orders over 200 TND. For orders under 200 TND, shipping costs 15 TND for standard delivery and 25 TND for express delivery."
  },
  {
    id: "8",
    category: "Shipping & Delivery",
    question: "How long does delivery take?",
    answer: "Standard delivery within Tunisia takes 2-4 business days. Express delivery takes 1-2 business days. Delivery to remote areas may take an additional 1-2 days. You'll receive a tracking number once your order ships."
  },
  {
    id: "9",
    category: "Shipping & Delivery",
    question: "Do you deliver to medical schools and hospitals?",
    answer: "Yes, we deliver directly to medical schools, hospitals, and healthcare facilities across Tunisia. For bulk orders to institutions, we offer special delivery arrangements and discounted rates."
  },
  {
    id: "10",
    category: "Shipping & Delivery",
    question: "Can I track my order?",
    answer: "Yes, once your order is shipped, you'll receive an email with tracking information. You can track your package through our website or the carrier's tracking system."
  },
  {
    id: "11",
    category: "Shipping & Delivery",
    question: "What if I'm not home during delivery?",
    answer: "Our delivery partners will attempt delivery twice. If unsuccessful, they'll leave a notice with pickup instructions. You can also arrange delivery to your workplace or a nearby pickup point."
  },

  // Orders & Payment FAQs
  {
    id: "12",
    category: "Orders & Payment",
    question: "What payment methods do you accept?",
    answer: "We accept major credit cards (Visa, Mastercard), debit cards, bank transfers, and cash on delivery within Tunisia. For international orders, we accept PayPal and international credit cards."
  },
  {
    id: "13",
    category: "Orders & Payment",
    question: "Is it safe to shop on your website?",
    answer: "Yes, our website uses SSL encryption to protect your personal and payment information. We comply with international security standards and never store your full credit card details on our servers."
  },
  {
    id: "14",
    category: "Orders & Payment",
    question: "Can I cancel or modify my order?",
    answer: "You can cancel or modify your order within 2 hours of placing it, provided it hasn't been processed for shipping. Contact our customer service immediately at +216 71 123 456 or support@casalogy.tn."
  },
  {
    id: "15",
    category: "Orders & Payment",
    question: "Do you offer bulk discounts for medical schools or hospitals?",
    answer: "Yes, we offer special pricing for bulk orders (10+ items) for medical institutions, schools, and healthcare facilities. Contact us at info@casalogy.tn for custom quotes and institutional accounts."
  },

  // Student Discounts & Policies
  {
    id: "16",
    category: "Student Discounts",
    question: "How do I get the 15% student discount?",
    answer: "Medical students can get 15% off by verifying their student status. Upload a photo of your current student ID or enrollment certificate during checkout. Verification typically takes 24-48 hours."
  },
  {
    id: "17",
    category: "Student Discounts",
    question: "Which students are eligible for discounts?",
    answer: "The discount is available to medical students, nursing students, pharmacy students, and other healthcare-related program students from accredited institutions in Tunisia and internationally."
  },
  {
    id: "18",
    category: "Student Discounts",
    question: "Can I use the student discount with other promotions?",
    answer: "Student discounts cannot be combined with other promotional codes or sale prices. The best available discount will be automatically applied to your order."
  },

  // Returns & Exchanges
  {
    id: "19",
    category: "Returns & Exchanges",
    question: "What is your return policy?",
    answer: "We offer 30-day returns for unworn, unwashed items with original tags. Items must be in original condition. Return shipping is free for defective items, otherwise customer pays return shipping."
  },
  {
    id: "20",
    category: "Returns & Exchanges",
    question: "How do I exchange for a different size?",
    answer: "Contact our customer service to initiate an exchange. We'll send you the new size and provide a prepaid return label for the original item. Size exchanges are free within Tunisia."
  },
  {
    id: "21",
    category: "Returns & Exchanges",
    question: "Can I return customized or embroidered items?",
    answer: "Customized or embroidered items can only be returned if there's a manufacturing defect or error on our part. Custom orders are final sale unless we made a mistake."
  },

  // Website & Account FAQs
  {
    id: "22",
    category: "Website & Account",
    question: "Do I need to create an account to shop?",
    answer: "You can shop as a guest, but creating an account allows you to track orders, save favorites, access exclusive discounts, and enjoy faster checkout for future purchases."
  },
  {
    id: "23",
    category: "Website & Account",
    question: "How do I reset my password?",
    answer: "Click 'Forgot Password' on the login page and enter your email. We'll send you a reset link. If you don't receive it within 15 minutes, check your spam folder or contact support."
  },
  {
    id: "24",
    category: "Website & Account",
    question: "Can I save items for later?",
    answer: "Yes, you can add items to your wishlist by clicking the heart icon on any product. You'll need to be logged in to save and access your wishlist across devices."
  },

  // General Policies
  {
    id: "25",
    category: "Policies",
    question: "Are your products made in Tunisia?",
    answer: "Yes, we're proud to manufacture our medical clothing in Tunisia, supporting local craftsmanship and ensuring high quality standards while keeping costs reasonable for healthcare professionals."
  },
  {
    id: "26",
    category: "Policies",
    question: "Do you have a physical store?",
    answer: "Yes, our showroom is located at 123 Avenue Habib Bourguiba, Tunis 1000. Visit us Monday-Friday 9 AM-6 PM, Saturday 9 AM-2 PM. We're closed Sundays. Try on products and get personalized fitting advice."
  },
  {
    id: "27",
    category: "Policies",
    question: "How can I contact customer service?",
    answer: "Contact us by phone at +216 71 123 456, email at support@casalogy.tn, or use our contact form. Our support team is available Monday-Friday 9 AM-6 PM, Saturday 9 AM-2 PM Tunisia time."
  }
]

const categories = [
  { id: "all", name: "All Questions", icon: HelpCircle },
  { id: "Medical Clothing", name: "Medical Clothing", icon: Shirt },
  { id: "Shipping & Delivery", name: "Shipping & Delivery", icon: Truck },
  { id: "Orders & Payment", name: "Orders & Payment", icon: CreditCard },
  { id: "Student Discounts", name: "Student Discounts", icon: Users },
  { id: "Returns & Exchanges", name: "Returns & Exchanges", icon: Package },
  { id: "Website & Account", name: "Website & Account", icon: Shield },
  { id: "Policies", name: "Policies", icon: HelpCircle }
]

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [openItems, setOpenItems] = useState<string[]>([])

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-gray-50 py-20">
        <div className="max-w-[1920px] mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-[#282828] mb-6">
              Frequently Asked <span className="text-blue-600">Questions</span>
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              Everything you need to know about our medical clothing, shipping, and services for Tunisia's healthcare community.
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for answers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 transition-colors"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-[1920px] mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-12">
            
            {/* Category Sidebar */}
            <div className="lg:col-span-1">
              <h2 className="text-2xl font-bold text-[#282828] mb-6">Categories</h2>
              <div className="space-y-2">
                {categories.map((category) => {
                  const Icon = category.icon
                  const count = category.id === 'all' ? faqData.length : faqData.filter(faq => faq.category === category.id).length
                  
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                        selectedCategory === category.id
                          ? 'bg-[#282828] text-white'
                          : 'bg-white text-[#282828] hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      <div className="flex items-center">
                        <Icon className="w-5 h-5 mr-3" />
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <span className={`text-sm px-2 py-1 rounded-full ${
                        selectedCategory === category.id
                          ? 'bg-white/20 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {count}
                      </span>
                    </button>
                  )
                })}
              </div>

              {/* Quick Contact */}
              <div className="mt-12 p-6 bg-white rounded-lg border border-gray-200">
                <h3 className="font-bold text-[#282828] mb-4">Still have questions?</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Can't find what you're looking for? Our support team is here to help.
                </p>
                <a 
                  href="/contact"
                  className="inline-block w-full px-4 py-2 bg-blue-600 text-white text-center font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Contact Support
                </a>
              </div>
            </div>

            {/* FAQ Content */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-[#282828]">
                  {selectedCategory === 'all' ? 'All Questions' : selectedCategory}
                </h2>
                <span className="text-gray-500">
                  {filteredFAQs.length} question{filteredFAQs.length !== 1 ? 's' : ''}
                </span>
              </div>

              {filteredFAQs.length === 0 ? (
                <div className="text-center py-12">
                  <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-600 mb-2">No results found</h3>
                  <p className="text-gray-500">Try adjusting your search terms or browse different categories.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredFAQs.map((faq) => (
                    <div key={faq.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                      <button
                        onClick={() => toggleItem(faq.id)}
                        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-1">
                          <h3 className="font-medium text-[#282828] pr-4">{faq.question}</h3>
                          <span className="inline-block mt-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                            {faq.category}
                          </span>
                        </div>
                        {openItems.includes(faq.id) ? (
                          <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                        )}
                      </button>
                      
                      {openItems.includes(faq.id) && (
                        <div className="px-6 pb-6">
                          <div className="pt-4 border-t border-gray-100">
                            <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-[#282828] text-white">
        <div className="max-w-[1920px] mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Need More Help?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Our customer support team is ready to assist you with any questions about our medical clothing, orders, or services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-block px-8 py-4 bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors rounded-lg"
            >
              Contact Support
            </a>
            <a
              href="tel:+21671123456"
              className="inline-block px-8 py-4 bg-white text-[#282828] font-medium hover:bg-gray-100 transition-colors rounded-lg"
            >
              Call +216 71 123 456
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}