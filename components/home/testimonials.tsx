export function Testimonials() {
  const testimonials = [
    {
      quote: "The quality of Casalogy scrubs is exceptional. They're comfortable for long shifts and still look professional after many washes.",
      author: "Dr. Sarah M.",
      role: "Resident at Charles Nicolle Hospital",
      rating: 5
    },
    {
      quote: "As a medical student, finding affordable yet durable medical wear was challenging until I found Casalogy. The student discount is a huge help!",
      author: "Ahmed B.",
      role: "Medical Student, University of Tunis",
      rating: 5
    },
    {
      quote: "Best lab coats in Tunisia! The fit is perfect and the fabric quality is outstanding. Highly recommend for all healthcare professionals.",
      author: "Dr. Fatima K.",
      role: "Physician at La Rabta Hospital",
      rating: 5
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1920px] mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-[#282828] mb-4">
            What Our Customers Say
          </h2>
          <p className="text-lg text-gray-600">
            Trusted by medical professionals across Tunisia
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-50 p-8">
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <blockquote className="text-gray-700 mb-6">
                "{testimonial.quote}"
              </blockquote>
              <div>
                <p className="font-medium text-[#282828]">{testimonial.author}</p>
                <p className="text-sm text-gray-600">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}