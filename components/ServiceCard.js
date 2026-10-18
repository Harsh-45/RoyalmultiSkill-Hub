'use client'

import { FiArrowUpRight } from 'react-icons/fi'
import Link from 'next/link'
import Reveal from '@/components/Reveal'

export default function ServiceCard({ category, index = 0 }) {
  return (
    <Reveal delay={Math.min(index * 0.08, 0.3)} className="h-full">
      <article
        id={category.key}
        className="surface group flex h-full min-w-0 scroll-mt-10 flex-col p-6 transition-colors duration-500 hover:border-gold/50 sm:p-8"
      >
        <h3 className="mb-6 font-display text-3xl text-paper sm:text-4xl">{category.title}</h3>

        <ul className="mb-8 divide-y divide-paper/10 border-y border-paper/10">
          {category.services.map((service) => (
            <li key={service.name} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 py-4 text-sm leading-relaxed">
              <span className="max-w-full break-words text-paper/85">{service.name}</span>
              <span className="max-w-full break-words font-medium text-gold">{service.price}</span>
            </li>
          ))}
        </ul>

        <Link
          href={`/book?service=${encodeURIComponent(category.title)}`}
          className="mt-auto flex min-h-[44px] items-center justify-between gap-4 py-2 text-sm text-paper transition-colors hover:text-gold"
          aria-label={`Book ${category.title}`}
        >
          <span>Book service</span>
          <FiArrowUpRight aria-hidden="true" className="text-xl text-gold transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
        </Link>
      </article>
    </Reveal>
  )
}
