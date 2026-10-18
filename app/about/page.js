'use client'

import Image from 'next/image'
import Link from 'next/link'
import { FiArrowUpRight } from 'react-icons/fi'
import siteConfig from '@/config/site'
import Reveal from '@/components/Reveal'
import PageIntro from '@/components/PageIntro'

export default function AboutPage() {
  const stats = [
    { number: siteConfig.stats.experience, label: 'Years of experience' },
    { number: siteConfig.stats.tattoos, label: 'Tattoos created' },
    { number: siteConfig.stats.clients, label: 'Clients welcomed' },
  ]

  return (
    <div className="min-h-screen">
      <PageIntro
        eyebrow={siteConfig.businessName}
        title="The studio"
        description={`Tattoo, piercing, and beauty services in ${siteConfig.address.city}.`}
      />

      <section className="section-space border-t border-paper/10" aria-labelledby="about-the-studio">
        <div className="studio-container grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal className="relative">
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src="/tattoo-studio.jpg"
                alt="A close-up of tattoo artistry"
                fill
                sizes="(max-width: 1023px) 100vw, 50vw"
                className="object-cover grayscale transition-all duration-700 hover:grayscale-0"
              />
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <h2 id="about-the-studio" className="section-title mb-6">{siteConfig.businessName}</h2>
            <p className="text-muted max-w-md text-sm leading-relaxed sm:text-base">Explore your style with our tattoo, piercing, hair, and beauty services. Contact the studio for details and appointments.</p>
            <Link href="/services" className="mt-8 inline-flex items-center gap-5 border-b border-gold/50 pb-3 text-sm text-gold transition-colors hover:text-paper">
              View services <FiArrowUpRight aria-hidden="true" className="text-lg" />
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="border-y border-paper/10 py-12 sm:py-16" aria-label="Studio at a glance">
        <div className="studio-container grid grid-cols-1 gap-10 text-center sm:grid-cols-3 sm:gap-4 sm:text-left">
          {stats.map((stat, index) => (
            <Reveal key={stat.label} delay={index * 0.1} className={index ? 'sm:border-l sm:border-paper/10 sm:pl-10' : ''}>
              <p className="font-display text-5xl text-gold sm:text-6xl">{stat.number}</p>
              <p className="text-muted mt-3 text-xs uppercase tracking-[0.16em]">{stat.label}</p>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  )
}
