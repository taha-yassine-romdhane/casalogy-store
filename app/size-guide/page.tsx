"use client"

import { useState } from 'react'
import { Ruler, User, Shirt, Zap, AlertCircle, CheckCircle, Calculator, Target } from 'lucide-react'

interface SizeChart {
  [key: string]: {
    chest?: string
    waist?: string
    hips?: string
    inseam?: string
    length?: string
    shoulders?: string
  }
}

const scrubTopsChart: SizeChart = {
  'XS': { chest: '81-86', shoulders: '38', length: '61' },
  'S': { chest: '86-91', shoulders: '40', length: '63' },
  'M': { chest: '91-97', shoulders: '42', length: '65' },
  'L': { chest: '97-102', shoulders: '44', length: '67' },
  'XL': { chest: '102-107', shoulders: '46', length: '69' },
  'XXL': { chest: '107-112', shoulders: '48', length: '71' },
  'XXXL': { chest: '112-117', shoulders: '50', length: '73' }
}

const scrubPantsChart: SizeChart = {
  'XS': { waist: '66-71', hips: '86-91', inseam: '76' },
  'S': { waist: '71-76', hips: '91-97', inseam: '79' },
  'M': { waist: '76-81', hips: '97-102', inseam: '81' },
  'L': { waist: '81-86', hips: '102-107', inseam: '84' },
  'XL': { waist: '86-91', hips: '107-112', inseam: '86' },
  'XXL': { waist: '91-97', hips: '112-117', inseam: '89' },
  'XXXL': { waist: '97-102', hips: '117-122', inseam: '91' }
}

const labCoatsChart: SizeChart = {
  'XS': { chest: '86-91', length: '91', shoulders: '40' },
  'S': { chest: '91-97', length: '94', shoulders: '42' },
  'M': { chest: '97-102', length: '97', shoulders: '44' },
  'L': { chest: '102-107', length: '99', shoulders: '46' },
  'XL': { chest: '107-112', length: '102', shoulders: '48' },
  'XXL': { chest: '112-117', length: '104', shoulders: '50' },
  'XXXL': { chest: '117-122', length: '107', shoulders: '52' }
}

const measurementPoints = [
  {
    name: 'Chest/Bust',
    icon: Target,
    description: 'Measure around the fullest part of your chest, keeping the tape horizontal.',
    instruction: 'Stand straight, arms at sides, breathe normally'
  },
  {
    name: 'Waist',
    icon: Target,
    description: 'Measure around your natural waistline, the narrowest part of your torso.',
    instruction: 'Find the smallest part, usually above the belly button'
  },
  {
    name: 'Hips',
    icon: Target,
    description: 'Measure around the fullest part of your hips and buttocks.',
    instruction: 'Keep feet together, measure around the widest point'
  },
  {
    name: 'Inseam',
    icon: Target,
    description: 'Measure from the crotch to the desired hem length along the inside of your leg.',
    instruction: 'Use well-fitting pants as reference for proper length'
  }
]

const fitTypes = [
  {
    name: 'Classic Fit',
    description: 'Traditional, comfortable fit with room for movement',
    benefits: ['Maximum comfort', 'Professional appearance', 'Suitable for all body types'],
    recommended: 'Long shifts, general medical practice'
  },
  {
    name: 'Modern Fit',
    description: 'Contemporary cut that follows body contours more closely',
    benefits: ['Flattering silhouette', 'Less bulk', 'Modern professional look'],
    recommended: 'Administrative roles, patient-facing positions'
  },
  {
    name: 'Athletic Fit',
    description: 'Tailored for active professionals with broader shoulders',
    benefits: ['Accommodates muscular build', 'Flexible movement', 'Maintains professional look'],
    recommended: 'Physical therapy, emergency medicine, surgery'
  }
]

export default function SizeGuidePage() {
  const [activeChart, setActiveChart] = useState('scrub-tops')
  const [measurements, setMeasurements] = useState({
    chest: '',
    waist: '',
    hips: '',
    height: ''
  })
  const [recommendedSize, setRecommendedSize] = useState('')
  const [showMeasurementGuide, setShowMeasurementGuide] = useState(false)

  const getCurrentChart = () => {
    switch (activeChart) {
      case 'scrub-tops': return scrubTopsChart
      case 'scrub-pants': return scrubPantsChart
      case 'lab-coats': return labCoatsChart
      default: return scrubTopsChart
    }
  }

  const findRecommendedSize = () => {
    if (!measurements.chest && !measurements.waist) return

    const chart = getCurrentChart()
    const chest = parseFloat(measurements.chest)
    const waist = parseFloat(measurements.waist)

    for (const [size, dims] of Object.entries(chart)) {
      if (activeChart === 'scrub-tops' || activeChart === 'lab-coats') {
        if (dims.chest) {
          const [min, max] = dims.chest.split('-').map(Number)
          if (chest >= min && chest <= max) {
            setRecommendedSize(size)
            return
          }
        }
      } else if (activeChart === 'scrub-pants') {
        if (dims.waist) {
          const [min, max] = dims.waist.split('-').map(Number)
          if (waist >= min && waist <= max) {
            setRecommendedSize(size)
            return
          }
        }
      }
    }
    setRecommendedSize('Not found - contact support')
  }

  const renderSizeChart = () => {
    const chart = getCurrentChart()
    const isTop = activeChart === 'scrub-tops' || activeChart === 'lab-coats'
    
    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border text-[#282828] border-gray-300 px-4 py-3 text-left font-semibold">Size</th>
              {isTop ? (
                <>
                  <th className="border text-[#282828] border-gray-300 px-4 py-3 text-center font-semibold">Chest (cm)</th>
                  <th className="border text-[#282828] border-gray-300 px-4 py-3 text-center font-semibold">Shoulders (cm)</th>
                  <th className="border text-[#282828] border-gray-300 px-4 py-3 text-center font-semibold">Length (cm)</th>
                </>
              ) : (
                <>
                  <th className="border text-[#282828] border-gray-300 px-4 py-3 text-center font-semibold">Waist (cm)</th>
                  <th className="border text-[#282828] border-gray-300 px-4 py-3 text-center font-semibold">Hips (cm)</th>
                  <th className="border text-[#282828] border-gray-300 px-4 py-3 text-center font-semibold">Inseam (cm)</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {Object.entries(chart).map(([size, measurements]) => (
              <tr key={size} className="hover:bg-gray-50">
                <td className="border text-[#282828] border-gray-300 px-4 py-3 font-medium">{size}</td>
                {isTop ? (
                  <>
                    <td className="border text-[#282828] border-gray-300 px-4 py-3 text-center">{measurements.chest}</td>
                    <td className="border text-[#282828] border-gray-300 px-4 py-3 text-center">{measurements.shoulders}</td>
                    <td className="border text-[#282828] border-gray-300 px-4 py-3 text-center">{measurements.length}</td>
                  </>
                ) : (
                  <>
                    <td className="border text-[#282828] border-gray-300 px-4 py-3 text-center">{measurements.waist}</td>
                    <td className="border text-[#282828] border-gray-300 px-4 py-3 text-center">{measurements.hips}</td>
                    <td className="border text-[#282828] border-gray-300 px-4 py-3 text-center">{measurements.inseam}</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-gray-50 py-20">
        <div className="max-w-[1920px] mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-[#282828] mb-6">
              Professional <span className="text-blue-600">Size Guide</span>
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              Find your perfect fit with our comprehensive sizing guide for medical professionals. 
              Accurate measurements ensure comfort during long shifts.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setShowMeasurementGuide(true)}
                className="inline-flex items-center px-8 py-4 bg-[#282828] text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Ruler className="w-5 h-5 mr-2" />
                How to Measure
              </button>
              <a
                href="#size-finder"
                className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Calculator className="w-5 h-5 mr-2" />
                Find My Size
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Size Charts Section */}
      <section className="py-16">
        <div className="max-w-[1920px] mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#282828] mb-4">Size Charts</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              All measurements are in centimeters. For the best fit, compare your measurements to our size charts below.
            </p>
          </div>

          {/* Chart Navigation */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {[
              { id: 'scrub-tops', name: 'Scrub Tops', icon: Shirt },
              { id: 'scrub-pants', name: 'Scrub Pants', icon: User },
              { id: 'lab-coats', name: 'Lab Coats', icon: Shirt }
            ].map(({ id, name, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveChart(id)}
                className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeChart === id
                    ? 'bg-[#282828] text-white'
                    : 'bg-white text-[#282828] border border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5 mr-2" />
                {name}
              </button>
            ))}
          </div>

          {/* Size Chart */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-6 bg-gray-50 border-b">
              <h3 className="text-xl font-bold text-[#282828]">
                {activeChart === 'scrub-tops' && 'Scrub Tops Size Chart'}
                {activeChart === 'scrub-pants' && 'Scrub Pants Size Chart'}
                {activeChart === 'lab-coats' && 'Lab Coats Size Chart'}
              </h3>
            </div>
            <div className="p-6">
              {renderSizeChart()}
            </div>
          </div>
        </div>
      </section>

      {/* Size Finder Tool */}
      <section id="size-finder" className="py-16 bg-white">
        <div className="max-w-[1920px] mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#282828] mb-4">Find Your Perfect Size</h2>
              <p className="text-gray-600">
                Enter your measurements to get personalized size recommendations.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-[#282828] mb-6">Enter Your Measurements</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[#282828] mb-2">
                        Chest/Bust (cm)
                      </label>
                      <input
                        type="number"
                        value={measurements.chest}
                        onChange={(e) => setMeasurements({...measurements, chest: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                        placeholder="e.g. 92"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#282828] mb-2">
                        Waist (cm)
                      </label>
                      <input
                        type="number"
                        value={measurements.waist}
                        onChange={(e) => setMeasurements({...measurements, waist: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                        placeholder="e.g. 78"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#282828] mb-2">
                        Hips (cm)
                      </label>
                      <input
                        type="number"
                        value={measurements.hips}
                        onChange={(e) => setMeasurements({...measurements, hips: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                        placeholder="e.g. 97"
                      />
                    </div>
                    <button
                      onClick={findRecommendedSize}
                      className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Find My Size
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-[#282828] mb-6">Size Recommendation</h3>
                  {recommendedSize ? (
                    <div className="bg-white rounded-lg p-6 border-2 border-green-200">
                      <div className="flex items-center mb-4">
                        <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
                        <span className="text-lg font-semibold text-green-800">Recommended Size</span>
                      </div>
                      <div className="text-3xl font-bold text-green-600 mb-4">{recommendedSize}</div>
                      <p className="text-gray-600">
                        Based on your measurements for {activeChart.replace('-', ' ')}.
                      </p>
                    </div>
                  ) : (
                    <div className="bg-white rounded-lg p-6 border-2 border-gray-200">
                      <div className="flex items-center mb-4">
                        <AlertCircle className="w-6 h-6 text-gray-400 mr-2" />
                        <span className="text-lg font-semibold text-gray-600">Enter Measurements</span>
                      </div>
                      <p className="text-gray-500">
                        Enter your measurements above to get a personalized size recommendation.
                      </p>
                    </div>
                  )}

                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-2">Sizing Tips:</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• If between sizes, size up for comfort</li>
                      <li>• Consider shrinkage after washing</li>
                      <li>• Account for undergarments and layering</li>
                      <li>• Different fits may require different sizes</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fit Types */}
      <section className="py-16">
        <div className="max-w-[1920px] mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#282828] mb-4">Choose Your Fit</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Different fits serve different purposes. Choose the style that best suits your work environment and personal preference.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {fitTypes.map((fit, index) => (
              <div key={index} className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-[#282828] mb-3">{fit.name}</h3>
                <p className="text-gray-600 mb-4">{fit.description}</p>
                
                <div className="mb-4">
                  <h4 className="font-semibold text-[#282828] mb-2">Benefits:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {fit.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 bg-blue-50 rounded-lg">
                  <span className="text-xs font-medium text-blue-800 uppercase tracking-wide">Best For:</span>
                  <p className="text-sm text-blue-700 mt-1">{fit.recommended}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Measurement Guide Modal */}
      {showMeasurementGuide && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[#282828]">How to Measure Yourself</h2>
                <button
                  onClick={() => setShowMeasurementGuide(false)}
                  className="text-gray-800 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-8">
                {measurementPoints.map((point, index) => {
                  const Icon = point.icon
                  return (
                    <div key={index} className="flex items-start">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                        <Icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-[#282828] mb-2">{point.name}</h3>
                        <p className="text-gray-600 mb-2">{point.description}</p>
                        <p className="text-sm text-blue-600 italic">{point.instruction}</p>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="mt-8 p-6 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-start">
                  <AlertCircle className="w-6 h-6 text-yellow-600 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-yellow-800 mb-2">Important Measuring Tips:</h3>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• Use a flexible measuring tape, not a ruler</li>
                      <li>• Measure over the undergarments you'll typically wear</li>
                      <li>• Keep the tape snug but not tight</li>
                      <li>• Take measurements in the morning when you're not bloated</li>
                      <li>• Have someone help you measure for accuracy</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Support */}
      <section className="py-16 bg-[#282828] text-white">
        <div className="max-w-[1920px] mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Need Personal Fitting Advice?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Visit our showroom in Tunis for personalized fitting sessions, or contact our sizing experts for help choosing the right size.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-block px-8 py-4 bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors rounded-lg"
            >
              Book Fitting Appointment
            </a>
            <a
              href="tel:+21671123456"
              className="inline-block px-8 py-4 bg-white text-[#282828] font-medium hover:bg-gray-100 transition-colors rounded-lg"
            >
              Call Sizing Expert
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}