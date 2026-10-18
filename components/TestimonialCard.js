'use client'

import { FaStar, FaGoogle } from 'react-icons/fa'
import Reveal from '@/components/Reveal'

export default function TestimonialCard({ testimonial, index = 0 }) {
  const hasRating = testimonial.rating !== undefined && testimonial.rating !== null && testimonial.rating !== '' && Number.isFinite(Number(testimonial.rating))
  const rating = hasRating ? Math.min(5, Math.max(0, Number(testimonial.rating))) : null
  const isGoogleReview = testimonial.source?.trim().toLowerCase() === 'google'

  return (
    <Reveal delay={index * 0.08} className="surface flex h-full flex-col p-7 transition-colors duration-300 hover:border-gold/30 md:p-9">
      {(hasRating || isGoogleReview) && (
        <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
          {hasRating && (
            <div role="img" aria-label={`${rating} out of 5 stars`} className="flex gap-1.5">
              {Array.from({ length: 5 }, (_, star) => (
                <span key={star} className="relative h-3.5 w-3.5 text-paper/15" aria-hidden="true">
                  <FaStar className="h-3.5 w-3.5" />
                  <span className="absolute inset-y-0 left-0 overflow-hidden text-gold" style={{ width: `${Math.min(1, Math.max(0, rating - star)) * 100}%` }}>
                    <FaStar className="h-3.5 w-3.5" />
                  </span>
                </span>
              ))}
            </div>
          )}
          {isGoogleReview && <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.12em] text-paper/50"><FaGoogle aria-hidden="true" className="text-gold" />Google review</span>}
        </div>
      )}
      <blockquote className="mb-8 flex-1 font-display text-2xl italic leading-relaxed text-paper/90">
        <p>&ldquo;{testimonial.review}&rdquo;</p>
      </blockquote>
      <div className="flex items-center gap-4 border-t border-paper/10 pt-6">
        {testimonial.name && <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold/35 font-display text-xl text-gold" aria-hidden="true">{testimonial.name.charAt(0)}</div>}
        <div>
          <p className="text-sm font-medium text-paper">{testimonial.name}</p>
          {testimonial.service && <p className="mt-1 text-xs text-muted">{testimonial.service}</p>}
        </div>
      </div>
    </Reveal>
  )
}

