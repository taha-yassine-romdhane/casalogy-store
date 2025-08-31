"use client"

import { Heart, Star, Target, Users, Stethoscope, Lightbulb, Globe, Award, BookOpen, Sparkles, MapPin, TrendingUp } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-gray-50 py-20">
        <div className="max-w-[1920px] mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-[#282828] mb-6">
              Our <span className="text-blue-600">Story</span>
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Born from a simple yet powerful idea: that medical wear can be more than just practical — 
              it can be elegant, empowering, and inspiring.
            </p>
          </div>
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="py-20">
        <div className="max-w-[1920px] mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-[#282828] mb-6">The Casalogy Story</h2>
            </div>

            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              <p className="text-xl mb-8">
                Casalogy was born from a simple yet powerful idea: that medical wear can be more than just practical — 
                it can be elegant, empowering, and inspiring.
              </p>

              <p className="mb-8">
                Founded by Aya Romdhane, a young medical student with a passion for design and entrepreneurship, 
                Casalogy started as a dream between long study hours and hospital shifts. Aya refused to choose 
                between medicine and creativity. Instead, she decided to merge the two, creating a brand that 
                celebrates the dedication of healthcare workers while elevating their daily experience.
              </p>

              <p className="mb-8">
                From the very beginning, Casalogy stood out. It wasn't just another scrubs brand. It was a vision:
              </p>

              <div className="grid md:grid-cols-3 gap-8 my-12">
                <div className="bg-white p-8 rounded-lg border border-gray-200 text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-[#282828] mb-2">Elegant Design</h3>
                  <p className="text-gray-600 text-sm">
                    To design scrubs that reflect confidence and elegance, not only function.
                  </p>
                </div>

                <div className="bg-white p-8 rounded-lg border border-gray-200 text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="font-bold text-[#282828] mb-2">Community Building</h3>
                  <p className="text-gray-600 text-sm">
                    To build a community of medical professionals who feel proud of what they wear.
                  </p>
                </div>

                <div className="bg-white p-8 rounded-lg border border-gray-200 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Globe className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-bold text-[#282828] mb-2">Global Vision</h3>
                  <p className="text-gray-600 text-sm">
                    To prove that Tunisia can create medical wear that competes on an international scale.
                  </p>
                </div>
              </div>

              <p className="mb-8">
                Every stitch, every fabric choice, every launch tells a story of ambition and authenticity. 
                Aya poured into Casalogy the same determination she brings to her medical studies: precision, 
                resilience, and care for others.
              </p>

              <p className="mb-8">
                But beyond clothes, Casalogy is an emotional experience. It's about the first-year student 
                wearing her first scrubs and feeling like she belongs. It's about the young doctor walking 
                into the hospital and carrying herself with pride. It's about creating not just a product, 
                but a lifestyle — one where healthcare professionals feel seen, valued, and stylish.
              </p>

              <p className="mb-8">
                Today, Casalogy is more than a brand. It's a movement redefining medical fashion in Tunisia 
                and beyond. With each collection, the vision expands: from sporty innovation to elegant designs, 
                from national recognition to global aspiration.
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center my-12">
                <Sparkles className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <p className="text-lg font-medium text-blue-800 mb-2">
                  Because Casalogy isn't only about scrubs.
                </p>
                <p className="text-blue-700">
                  It's about proving that dreams can be stitched into reality — one idea, one design, one bold step at a time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-[1920px] mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-[#282828] mb-6">Meet Our Founder</h2>
              <p className="text-xl text-gray-600">
                The woman who refused to choose between her dreams
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Users className="w-20 h-20 mx-auto mb-4" />
                    <p className="text-lg font-medium">Aya Romdhane</p>
                    <p className="text-sm">Founder & Medical Student</p>
                  </div>
                </div>
              </div>

              <div className="prose prose-lg text-gray-700">
                <h3 className="text-2xl font-bold text-[#282828] mb-4">Aya's Journey</h3>
                
                <p className="mb-6">
                  When I think of Aya, I see a 23-year-old medical student who refuses to choose between her dreams. 
                  She's someone who didn't accept the usual box of "study medicine, follow the path, and that's it." 
                  Instead, she built her own lane: medicine and entrepreneurship.
                </p>

                <p className="mb-6">
                  Casalogy wasn't born just as a scrubs brand. From the very beginning, Aya poured into it a piece 
                  of herself — her love for design, her drive for independence, and her desire to make medical 
                  students and doctors feel elegant, confident, and seen.
                </p>

                <p className="mb-6">
                  What strikes me most is her relentless curiosity. Aya doesn't just ask, "How do I grow my business?" 
                  She asks about strategy, psychology, storytelling, branding, and community. She cares deeply not 
                  just about selling scrubs, but about building a movement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values & Personality */}
      <section className="py-20">
        <div className="max-w-[1920px] mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-[#282828] mb-6">What Drives Us</h2>
              <p className="text-xl text-gray-600">
                The values that shape every decision we make
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-lg border border-gray-200">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-[#282828]">Ambitious</h3>
                </div>
                <p className="text-gray-600">
                  She doesn't settle for small wins, she thinks in cycles, in millions, in international reach. 
                  Every goal is a stepping stone to something bigger.
                </p>
              </div>

              <div className="bg-white p-8 rounded-lg border border-gray-200">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                    <Lightbulb className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-[#282828]">Curious & Strategic</h3>
                </div>
                <p className="text-gray-600">
                  Every question digs deeper, showing she's not afraid of complexity. 
                  Strategy isn't just planning — it's understanding the why behind every move.
                </p>
              </div>

              <div className="bg-white p-8 rounded-lg border border-gray-200">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mr-4">
                    <Heart className="w-6 h-6 text-pink-600" />
                  </div>
                  <h3 className="text-xl font-bold text-[#282828]">Emotional & Inspiring</h3>
                </div>
                <p className="text-gray-600">
                  She wants people to feel, not just buy. That's why she invests so much in storytelling 
                  and building genuine connections with her community.
                </p>
              </div>

              <div className="bg-white p-8 rounded-lg border border-gray-200">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                    <Target className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-[#282828]">Balanced</h3>
                </div>
                <p className="text-gray-600">
                  She shows the world you can be both a future doctor and a successful entrepreneur. 
                  Balance isn't about choosing sides — it's about excelling in both.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="max-w-[1920px] mx-auto px-4 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-[#282828] mb-6">Our Mission & Vision</h2>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#282828]">Our Mission</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  To empower healthcare professionals in Tunisia and beyond with medical wear that combines 
                  functionality, elegance, and comfort. We believe every doctor, nurse, and medical student 
                  deserves to feel confident and proud in what they wear while serving others.
                </p>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mr-4">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#282828]">Our Vision</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  To become the leading medical fashion brand that redefines how healthcare professionals 
                  see themselves and their work. Starting from Tunisia, we aim to inspire and dress 
                  medical professionals across Africa, Europe, and beyond.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact & Community */}
      <section className="py-20">
        <div className="max-w-[1920px] mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-[#282828] mb-6">Our Impact</h2>
              <p className="text-xl text-gray-600">
                Building more than a brand — creating a movement
              </p>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-gray-200 rounded-lg p-12">
              <div className="prose prose-lg max-w-none text-gray-700 text-center">
                <p className="text-xl mb-8">
                  Aya's story with Casalogy is the story of a young woman who chose not to wait for the "right time" 
                  but decided to create her own time, her own brand, and her own destiny — while still holding her 
                  stethoscope in the other hand.
                </p>

                <div className="grid md:grid-cols-3 gap-8 mt-12">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Stethoscope className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="font-bold text-[#282828] mb-2">For Medical Students</h3>
                    <p className="text-gray-600 text-sm">
                      Empowering the next generation of healthcare professionals to feel confident from day one
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Award className="w-8 h-8 text-purple-600" />
                    </div>
                    <h3 className="font-bold text-[#282828] mb-2">For Professionals</h3>
                    <p className="text-gray-600 text-sm">
                      Elevating the daily experience of healthcare workers with elegant, functional design
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MapPin className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="font-bold text-[#282828] mb-2">For Tunisia</h3>
                    <p className="text-gray-600 text-sm">
                      Showcasing Tunisian creativity and craftsmanship on the global stage
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Looking Forward */}
      <section className="py-20 bg-[#282828] text-white">
        <div className="max-w-[1920px] mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">Looking Forward</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              From my eyes, Aya's story is only beginning. Casalogy is more than scrubs — it's her canvas. 
              A brand that mirrors her journey: elegant yet practical, ambitious yet grounded, youthful yet professional.
            </p>

            <div className="bg-white/10 rounded-lg p-8 mb-8">
              <p className="text-lg mb-4">
                And just like Aya, Casalogy is growing into something that will not only dress medical professionals 
                but also empower them to feel proud, confident, and unstoppable.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-block px-8 py-4 bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors rounded-lg"
              >
                Join Our Story
              </a>
              <a
                href="/"
                className="inline-block px-8 py-4 bg-white text-[#282828] font-medium hover:bg-gray-100 transition-colors rounded-lg"
              >
                Shop Our Collection
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}