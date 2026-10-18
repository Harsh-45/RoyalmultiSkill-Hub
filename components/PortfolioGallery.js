'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { FiArrowUpRight } from 'react-icons/fi'
import { categories } from '@/data/portfolio'
import GalleryGrid from '@/components/GalleryGrid'
import Reveal from '@/components/Reveal'

const bookingServices = {
  Tattoo: 'Custom tattoos',
  Piercing: 'Piercing',
  Hair: 'Hair Services',
  Facial: 'Face Care',
  Waxing: 'Waxing',
  Threading: 'Threading',
}

function EmptyPortfolio({ category }) {
  const service = bookingServices[category]
  const bookingHref = service ? `/book?service=${encodeURIComponent(service)}` : '/book'

  return (
    <div className="surface relative overflow-hidden px-6 py-16 text-center md:py-24">
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full border border-gold/10" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 -left-20 h-64 w-64 rounded-full border border-gold/10" />
      <span className="eyebrow mb-6">{category === 'All' ? 'From our studio' : category}</span>
      <h2 className="font-display text-4xl md:text-5xl">Photos coming soon.</h2>
      <p className="mx-auto mt-5 max-w-sm text-sm leading-7 text-muted">
        {category === 'All'
          ? 'Our latest studio work will appear here.'
          : `${category} photos from our studio will appear here.`}
      </p>
      {category === 'All' ? (
        <div className="relative mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/book?service=Custom%20tattoos" className="button-outline">Book tattoo <FiArrowUpRight aria-hidden="true" /></Link>
          <Link href="/book?service=Piercing" className="button-outline">Book piercing <FiArrowUpRight aria-hidden="true" /></Link>
          <Link href="/services#beauty" className="button-outline">Beauty services <FiArrowUpRight aria-hidden="true" /></Link>
        </div>
      ) : (
        <Link href={bookingHref} className="button-primary relative mt-8">
          {category === 'Bridal' || category === 'Makeup' ? 'Book a beauty appointment' : `Book ${category.toLowerCase()}`}
          <FiArrowUpRight aria-hidden="true" />
        </Link>
      )}
    </div>
  )
}

export default function PortfolioGallery({ images = [] }) {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const reducedMotion = useReducedMotion()
  const filteredImages = selectedCategory === 'All'
    ? images
    : images.filter(image => image.category === selectedCategory)

  return (
    <section className="pb-20 md:pb-32" aria-label="Studio portfolio">
      <div className="studio-container">
        <Reveal className="mb-8 border-y border-white/10 py-6 md:mb-14">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter portfolio by service">
            {categories.map(category => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  aria-pressed={selectedCategory === category}
                  aria-controls="portfolio-results"
                  className={`filter-button ${selectedCategory === category ? 'is-active' : ''}`}
                >
                  {category}
                </button>
            ))}
          </div>
          <p className="mt-5 text-[10px] uppercase tracking-[0.2em] text-muted" aria-live="polite" aria-atomic="true">
            {filteredImages.length > 0
              ? `${selectedCategory === 'All' ? 'Studio' : selectedCategory} portfolio`
              : `${selectedCategory === 'All' ? 'Studio' : selectedCategory} photos coming soon`}
          </p>
        </Reveal>

        <div id="portfolio-results">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={selectedCategory}
              initial={{ opacity: 0, y: reducedMotion ? 0 : 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reducedMotion ? 0 : -10 }}
              transition={{ duration: reducedMotion ? 0 : 0.24 }}
            >
              {filteredImages.length > 0
                ? <GalleryGrid images={filteredImages} category={selectedCategory} />
                : <EmptyPortfolio category={selectedCategory} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
