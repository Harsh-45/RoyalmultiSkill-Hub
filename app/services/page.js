'use client'

import { motion } from 'framer-motion'
import { getAllCategories } from '@/data/services'
import ServiceCard from '@/components/ServiceCard'

export default function ServicesPage() {
  const allCategories = getAllCategories()
  const beautyCategories = allCategories.filter(cat => cat.theme === 'beauty')
  const tattooCategories = allCategories.filter(cat => cat.theme === 'tattoo')

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section - Mobile Optimized */}
      <section className="bg-gradient-to-r from-neutral-900 via-primary-600 to-accent-600 py-12 md:py-20 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4 md:mb-6"
          >
            Our Services
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base md:text-xl text-neutral-100 max-w-3xl mx-auto px-4"
          >
            Premium tattoo and beauty services tailored for you
          </motion.p>
        </div>
      </section>

      {/* Tattoo Services Section - Mobile Optimized */}
      <section className="py-12 md:py-20 bg-gradient-to-b from-neutral-900 to-neutral-800">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 md:mb-12"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-3 md:mb-4">
              Tattoo Services
            </h2>
            <p className="text-neutral-300 text-base md:text-lg px-4">
              Professional custom tattoos with premium quality ink
            </p>
          </motion.div>

          <div className="flex justify-center">
            <div className="w-full max-w-md">
              {tattooCategories.map((category, index) => (
                <ServiceCard key={category.key} category={category} index={index} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Beauty Services Section - Mobile Optimized */}
      <section className="py-12 md:py-20 bg-gradient-to-b from-primary-50 to-primary-100">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 md:mb-12"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-neutral-800 mb-3 md:mb-4">
              Beauty Services
            </h2>
            <p className="text-neutral-600 text-base md:text-lg px-4">
              Comprehensive beauty treatments for your transformation
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {beautyCategories.map((category, index) => (
              <ServiceCard key={category.key} category={category} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Ready to Book?
            </h2>
            <p className="text-xl mb-8 text-gray-300">
              Contact us now to schedule your appointment
            </p>
            <a
              href="https://wa.me/917264939526?text=Hi! I want to book an appointment"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary btn-tattoo inline-block"
            >
              Book on WhatsApp
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

