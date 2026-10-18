'use client'

import { getAllCategories } from '@/data/services'
import ServiceCard from '@/components/ServiceCard'
import Reveal from '@/components/Reveal'
import PageIntro from '@/components/PageIntro'
import BookingCTA from '@/components/BookingCTA'

export default function ServicesPage() {
  const allCategories = getAllCategories()
  const mainCategories = allCategories.filter(category => ['tattoo', 'piercing'].includes(category.theme))
  const beautyCategories = allCategories.filter(category => category.theme === 'beauty')

  return (
    <div className="min-h-screen">
      <PageIntro
        eyebrow="The menu"
        title="Our services"
        description="Tattoo, piercing, and a full range of beauty services."
      />

      <nav aria-label="Jump to a service" className="sticky top-[88px] z-30 border-y border-paper/15 bg-ink md:hidden">
        <div className="studio-container grid grid-cols-3">
          {['Tattoo', 'Piercing', 'Beauty'].map(service => (
            <a key={service} href={`#${service.toLowerCase()}`} className="flex min-h-[52px] items-center justify-center px-2 py-3 text-xs text-paper transition-colors hover:text-gold">
              {service}
            </a>
          ))}
        </div>
      </nav>

      <section className="section-space border-t border-paper/10" aria-labelledby="signature-services">
        <div className="studio-container">
          <Reveal className="mb-10">
            <h2 id="signature-services" className="section-title">Tattoo & piercing</h2>
          </Reveal>
          <div className="grid items-stretch gap-5 lg:grid-cols-2">
            {mainCategories.map((category, index) => (
              <ServiceCard key={category.key} category={category} index={index} />
            ))}
          </div>
          <Reveal className="mt-5">
            <p className="text-muted text-xs">Final tattoo pricing varies by design and size.</p>
          </Reveal>
        </div>
      </section>

      <section id="beauty" className="section-space scroll-mt-10 border-t border-paper/10" aria-labelledby="beauty-services">
        <div className="studio-container">
          <Reveal className="mb-10">
            <h2 id="beauty-services" className="section-title">Beauty services</h2>
          </Reveal>
          <div className="grid items-start gap-5 md:grid-cols-2 xl:grid-cols-3">
            {beautyCategories.map((category, index) => (
              <ServiceCard key={category.key} category={category} index={index} />
            ))}
          </div>
        </div>
      </section>

      <BookingCTA />
    </div>
  )
}
