'use client'

import { motion } from 'framer-motion'
import siteConfig from '@/config/site'

export default function ServiceCard({ category, index }) {
  const isBeauty = category.theme === 'beauty'
  const isTattoo = category.theme === 'tattoo'

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`card-hover rounded-2xl p-6 ${
        isBeauty
          ? 'glass-light border-beauty-accent/20'
          : 'glass-dark border-tattoo-red/20'
      }`}
    >
      {/* Icon and Title */}
      <div className="flex items-center mb-4">
        <span className="text-4xl mr-3">{category.icon}</span>
        <h3
          className={`text-2xl font-bold ${
            isBeauty ? 'text-beauty-accent' : 'text-tattoo-red'
          }`}
        >
          {category.title}
        </h3>
      </div>

      {/* Description (if exists) */}
      {category.description && (
        <p className={`mb-4 text-sm ${isBeauty ? 'text-gray-700' : 'text-gray-300'}`}>
          {category.description}
        </p>
      )}

      {/* Services List */}
      <div className="space-y-3">
        {category.services.map((service, idx) => (
          <motion.div
            key={idx}
            whileHover={{ x: 5 }}
            className={`flex justify-between items-center p-3 rounded-lg ${
              isBeauty ? 'bg-white/50' : 'bg-black/30'
            } ${service.featured ? 'border-2 border-tattoo-red' : ''}`}
          >
            <span
              className={`font-medium ${
                isBeauty ? 'text-gray-800' : 'text-white'
              }`}
            >
              {service.name}
            </span>
            <span
              className={`font-bold ${
                isBeauty ? 'text-beauty-accent' : 'text-tattoo-red'
              }`}
            >
              {service.price}
            </span>
          </motion.div>
        ))}
      </div>

      {/* CTA Button */}
      <motion.a
        href={siteConfig.whatsapp.getUrl(siteConfig.whatsapp.serviceMessage(category.title))}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`mt-6 block text-center py-3 rounded-full font-semibold transition-all duration-300 ${
          isBeauty
            ? 'bg-gradient-to-r from-beauty-accent to-pink-400 text-white'
            : 'bg-gradient-to-r from-tattoo-red to-tattoo-accent text-white'
        }`}
      >
        Book Now
      </motion.a>
    </motion.div>
  )
}

