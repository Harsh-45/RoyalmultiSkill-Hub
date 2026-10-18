import { FiArrowUpRight } from 'react-icons/fi'
import Link from 'next/link'
import Reveal from '@/components/Reveal'

export default function BookingCTA({
  title = 'Book your visit.',
  description
}) {
  return (
    <section className="border-y border-white/10 bg-[#191918] py-16 md:py-20">
      <div className="studio-container">
        <Reveal className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <h2 className="font-display text-4xl md:text-5xl">{title}</h2>
            {description && (
              <p className="mt-4 text-sm text-muted">{description}</p>
            )}
          </div>
          <Link
            href="/book"
            className="button-primary shrink-0"
          >
            Choose a time <FiArrowUpRight aria-hidden="true" />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
