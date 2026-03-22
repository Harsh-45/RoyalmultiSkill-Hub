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
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-tattoo-dark via-tattoo-red to-beauty-accent py-20 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-display font-bold mb-6"
          >
            Our Services
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-100 max-w-3xl mx-auto"
          >
            Discover our comprehensive range of premium tattoo and beauty services, 
            tailored to bring out your best self
          </motion.p>
        </div>
      </section>

      {/* Tattoo Services Section */}
      <section className="py-20 bg-tattoo-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              Tattoo Services
            </h2>
            <p className="text-gray-400 text-lg">
              Professional custom tattoos with premium quality ink
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tattooCategories.map((category, index) => (
              <ServiceCard key={category.key} category={category} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Beauty Services Section */}
      <section className="py-20 bg-beauty-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-800 mb-4">
              Beauty Services
            </h2>
            <p className="text-gray-600 text-lg">
              Comprehensive beauty treatments for your complete transformation
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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

