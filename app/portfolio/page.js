'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { portfolioImages, categories, getImagesByCategory } from '@/data/portfolio'
import GalleryGrid from '@/components/GalleryGrid'

export default function PortfolioPage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const filteredImages = getImagesByCategory(selectedCategory)

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section - Mobile Optimized */}
      <section className="bg-gradient-to-r from-neutral-900 via-primary-600 to-accent-600 py-12 md:py-20 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4 md:mb-6"
          >
            Our Portfolio
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm sm:text-base md:text-xl text-neutral-100 max-w-3xl mx-auto px-4"
          >
            Stunning tattoo art and beauty transformations
          </motion.p>
        </div>
      </section>

      {/* Filter Section - Mobile Optimized */}
      <section className="py-8 md:py-12 bg-neutral-950 sticky top-20 z-40 border-b border-primary-500/20">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap justify-center gap-2 md:gap-4"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 md:px-6 py-2 md:py-3 rounded-full font-semibold text-sm md:text-base transition-all duration-300 touch-manipulation ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white scale-105 shadow-lg'
                    : 'bg-white/10 text-white hover:bg-white/20 active:scale-95'
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Gallery Section - Mobile Optimized */}
      <section className="py-12 md:py-20 bg-gradient-to-b from-neutral-900 to-neutral-800">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <GalleryGrid images={filteredImages} category={selectedCategory} />
          </motion.div>

          {filteredImages.length === 0 && (
            <div className="text-center text-white py-12 md:py-20">
              <p className="text-xl md:text-2xl">No images found in this category</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section - Mobile Optimized */}
      <section className="py-12 md:py-20 bg-gradient-to-b from-primary-50 to-primary-100 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-neutral-800 mb-4 md:mb-6">
              Want to Be Featured?
            </h2>
            <p className="text-sm sm:text-base md:text-xl mb-6 md:mb-8 text-neutral-600 px-4">
              Book your appointment and let us create your masterpiece
            </p>
            <a
              href="https://wa.me/917264939526?text=Hi! I want to book an appointment"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary btn-beauty inline-block text-sm md:text-base px-6 md:px-8 py-3 md:py-4"
            >
              Book Your Session
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

