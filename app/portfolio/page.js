'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { FiArrowUpRight } from 'react-icons/fi'
import { portfolioImages, categories, getImagesByCategory } from '@/data/portfolio'
import GalleryGrid from '@/components/GalleryGrid'
import PageIntro from '@/components/PageIntro'
import Reveal from '@/components/Reveal'
import BookingCTA from '@/components/BookingCTA'

export default function PortfolioPage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const reducedMotion = useReducedMotion()
  const filteredImages = getImagesByCategory(selectedCategory)

  return (
    <>
      <PageIntro
        eyebrow="Gallery"
        title="Style inspiration."
        description="Explore tattoo, hair and beauty references for your next appointment."
      />

      <section className="pb-20 md:pb-32" aria-label="Style inspiration gallery">
        <div className="studio-container">
          <Reveal className="mb-10 border-y border-white/10 py-6 md:mb-14 md:flex md:items-center md:justify-between md:gap-8">
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter inspiration by service">
              {categories.map((category) => {
                const count = category === 'All'
                  ? portfolioImages.length
                  : getImagesByCategory(category).length

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    aria-pressed={selectedCategory === category}
                    aria-controls="inspiration-results"
                    className={`filter-button ${selectedCategory === category ? 'is-active' : ''}`}
                  >
                    {category}
                    {count > 0 && <span className="ml-2 text-[10px] opacity-50" aria-hidden="true">{String(count).padStart(2, '0')}</span>}
                  </button>
                )
              })}
            </div>
            <p className="mt-5 shrink-0 text-[10px] uppercase tracking-[0.2em] text-muted md:mt-0" aria-live="polite" aria-atomic="true">
              {filteredImages.length > 0
                ? `${String(filteredImages.length).padStart(2, '0')} style references`
                : 'A personal consultation'}
            </p>
          </Reveal>

          <div id="inspiration-results">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={selectedCategory}
                initial={{ opacity: 0, y: reducedMotion ? 0 : 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reducedMotion ? 0 : -10 }}
                transition={{ duration: reducedMotion ? 0 : 0.24 }}
              >
                {filteredImages.length > 0 ? (
                  <GalleryGrid images={filteredImages} category={selectedCategory} />
                ) : (
                  <div className="surface relative overflow-hidden px-6 py-16 text-center md:py-24">
                    <div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-24 h-64 w-64 rounded-full border border-[#c6a77c]/10" />
                    <svg aria-hidden="true" className="mx-auto mb-8 h-20 w-20 text-[#c6a77c]" viewBox="0 0 80 80" fill="none">
                      <circle cx="31" cy="43" r="22" stroke="currentColor" strokeWidth="1" />
                      <circle cx="49" cy="35" r="22" stroke="currentColor" strokeWidth="1" />
                      <circle cx="31" cy="21" r="3" fill="currentColor" />
                      <circle cx="49" cy="13" r="3" fill="currentColor" />
                    </svg>
                    <h2 className="font-display text-3xl md:text-5xl">Piercing consultations</h2>
                    <p className="mx-auto mb-8 mt-5 max-w-lg text-sm leading-7 text-muted">
                      Discuss placement, jewellery and aftercare with the studio.
                    </p>
                    <Link href="/book?service=Piercing" className="button-primary">
                      Plan your piercing <FiArrowUpRight aria-hidden="true" />
                    </Link>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <Reveal className="mt-10 border-t border-white/10 pt-6">
            <p className="text-xs leading-6 text-muted">
              Reference imagery for inspiration; not studio work.
            </p>
          </Reveal>
        </div>
      </section>

      <BookingCTA
        title="Plan your appointment."
        description="Share a reference and book your service."
      />
    </>
  )
}
