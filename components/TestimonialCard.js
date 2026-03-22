'use client'

import { motion } from 'framer-motion'
import { FaStar, FaGoogle } from 'react-icons/fa'

export default function TestimonialCard({ testimonial, index }) {
  const rating = testimonial.rating || 5 // Default to 5 stars if not specified

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="glass-light rounded-2xl p-6 card-hover relative"
    >
      {/* Google Badge */}
      <div className="absolute top-4 right-4">
        <FaGoogle className="text-blue-500 text-xl" title="Google Review" />
      </div>

      {/* Stars */}
      <div className="flex mb-4">
        {[...Array(5)].map((_, i) => (
          <FaStar
            key={i}
            className={`text-xl ${i < rating ? 'text-yellow-500' : 'text-gray-300'}`}
          />
        ))}
      </div>

      {/* Review Text */}
      <p className="text-gray-700 mb-4 italic leading-relaxed">&ldquo;{testimonial.review}&rdquo;</p>

      {/* Customer Info */}
      <div className="flex items-center">
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-xl mr-3 shadow-md">
          {testimonial.name.charAt(0)}
        </div>
        <div>
          <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
          <p className="text-sm text-gray-500">{testimonial.service}</p>
        </div>
      </div>
    </motion.div>
  )
}

