'use client'

import { FiArrowUpRight } from 'react-icons/fi'
import siteConfig from '@/config/site'
import Reveal from '@/components/Reveal'

export default function ReviewsSection() {
  return (
    <section id="reviews" className="section-space border-b border-paper/10" aria-labelledby="reviews-heading">
      <div className="studio-container">
        <Reveal className="surface flex flex-wrap items-center justify-between gap-8 p-6 sm:p-9 lg:p-12">
          <div>
            <p className="eyebrow mb-5">Client experiences</p>
            <h2 id="reviews-heading" className="section-title">Reviews</h2>
            <p className="mt-5 max-w-lg text-sm leading-7 text-muted">Read our clients’ experiences on Google.</p>
          </div>
          <div className="flex w-full flex-col items-start gap-4 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:gap-7">
            <a href={siteConfig.reviews.viewReviewsUrl} target="_blank" rel="noopener noreferrer" className="button-primary">Read Google reviews <FiArrowUpRight aria-hidden="true" /></a>
            <a href={siteConfig.reviews.googleReviewsUrl} target="_blank" rel="noopener noreferrer" className="link-line min-h-[44px]">Write a review <FiArrowUpRight aria-hidden="true" /></a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
