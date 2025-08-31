import Link from "next/link"
import { Percent, Clock, TrendingUp } from "lucide-react"

export function SpecialOffers() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 md:p-12 text-white">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Percent className="w-8 h-8" />
                <span className="text-lg font-semibold">Student Special</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                15% OFF for Medical Students
              </h3>
              <p className="text-lg mb-6 opacity-90">
                Show your student ID and get exclusive discounts on all medical wear. 
                Valid for all Tunisian medical schools.
              </p>
              <Link
                href="/student-discount"
                className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Learn More
              </Link>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur rounded-lg p-6 text-center">
                <Clock className="w-10 h-10 mx-auto mb-2" />
                <p className="font-semibold">Fast Delivery</p>
                <p className="text-sm opacity-90">2-3 days in Tunis</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-6 text-center">
                <TrendingUp className="w-10 h-10 mx-auto mb-2" />
                <p className="font-semibold">Quality Assured</p>
                <p className="text-sm opacity-90">100% Cotton</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}