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
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-tattoo-dark via-tattoo-red to-beauty-accent py-20 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-display font-bold mb-6"
          >
            Our Portfolio
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-100 max-w-3xl mx-auto"
          >
            Explore our collection of stunning tattoo art and beauty transformations
          </motion.p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-12 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap justify-center gap-4"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-tattoo-red to-beauty-accent text-white scale-105'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 bg-gradient-to-b from-black to-tattoo-grey">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <GalleryGrid images={filteredImages} category={selectedCategory} />
          </motion.div>

          {filteredImages.length === 0 && (
            <div className="text-center text-white py-20">
              <p className="text-2xl">No images found in this category</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-beauty-gradient text-center">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-800 mb-6">
              Want to Be Featured?
            </h2>
            <p className="text-xl mb-8 text-gray-600">
              Book your appointment and let us create your masterpiece
            </p>
            <a
              href="https://wa.me/917264939526?text=Hi! I want to book an appointment"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary btn-beauty inline-block"
            >
              Book Your Session
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

