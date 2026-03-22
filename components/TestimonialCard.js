'use client'

import { motion } from 'framer-motion'
import { FaStar } from 'react-icons/fa'

export default function TestimonialCard({ testimonial, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="glass-light rounded-2xl p-6 card-hover"
    >
      {/* Stars */}
      <div className="flex mb-4">
        {[...Array(5)].map((_, i) => (
          <FaStar key={i} className="text-beauty-gold text-xl" />
        ))}
      </div>

      {/* Review Text */}
      <p className="text-gray-700 mb-4 italic">"{testimonial.review}"</p>

      {/* Customer Info */}
      <div className="flex items-center">
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-tattoo-red to-beauty-accent flex items-center justify-center text-white font-bold text-xl mr-3">
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

