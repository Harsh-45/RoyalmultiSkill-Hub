'use client'

import { useRef, useState } from 'react'
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform
} from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { FiArrowDown, FiArrowUpRight, FiPause, FiPlay } from 'react-icons/fi'
import siteConfig from '@/config/site'
import { portfolioImages } from '@/data/portfolio'
import { servicesData, getCategoriesByTheme } from '@/data/services'
import Reveal from '@/components/Reveal'
import BookingCTA from '@/components/BookingCTA'

function PiercingArtwork() {
  return (
    <div className="piercing-art" aria-hidden="true">
      <svg viewBox="0 0 500 500" fill="none">
        <defs>
          <linearGradient
            id="jewellery-gold"
            x1="120"
            y1="80"
            x2="390"
            y2="420"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#7f6747" />
            <stop offset="0.28" stopColor="#ebd9b6" />
            <stop offset="0.5" stopColor="#af9064" />
            <stop offset="0.75" stopColor="#f0e1c9" />
            <stop offset="1" stopColor="#705a3e" />
          </linearGradient>
          <filter id="jewellery-shadow">
            <feGaussianBlur stdDeviation="10" />
          </filter>
        </defs>
        <ellipse
          cx="270"
          cy="382"
          rx="140"
          ry="28"
          fill="#000"
          opacity=".35"
          filter="url(#jewellery-shadow)"
        />
        <g transform="rotate(-28 250 240)">
          <ellipse
            cx="222"
            cy="244"
            rx="100"
            ry="139"
            stroke="#0b0b0a"
            strokeWidth="20"
          />
          <ellipse
            cx="218"
            cy="237"
            rx="100"
            ry="139"
            stroke="url(#jewellery-gold)"
            strokeWidth="10"
          />
          <ellipse
            cx="218"
            cy="237"
            rx="96"
            ry="135"
            stroke="#eedcba"
            strokeOpacity=".6"
            strokeWidth="1"
          />
          <circle cx="218" cy="98" r="13" fill="url(#jewellery-gold)" />
          <circle cx="214" cy="94" r="4" fill="#fff3db" opacity=".6" />
        </g>
        <g transform="rotate(26 310 210)">
          <ellipse
            cx="314"
            cy="214"
            rx="77"
            ry="108"
            stroke="#121210"
            strokeWidth="16"
          />
          <ellipse
            cx="310"
            cy="208"
            rx="77"
            ry="108"
            stroke="url(#jewellery-gold)"
            strokeWidth="8"
          />
          <ellipse
            cx="310"
            cy="208"
            rx="74"
            ry="105"
            stroke="#eedcba"
            strokeOpacity=".5"
            strokeWidth="1"
          />
          <circle cx="310" cy="100" r="10" fill="url(#jewellery-gold)" />
          <circle cx="307" cy="97" r="3" fill="#fff3db" opacity=".6" />
        </g>
      </svg>
    </div>
  )
}

export default function Home() {
  const [brandName, ...brandDetails] = siteConfig.businessName.split(' ')
  const heroRef = useRef(null)
  const reducedMotion = useReducedMotion()
  const [marqueePaused, setMarqueePaused] = useState(false)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  })
  const photoY = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const featuredWorks = ['Tattoo', 'Bridal', 'Facial']
    .map((category) =>
      portfolioImages.find((image) => image.category === category)
    )
    .filter(Boolean)
  const beautyCategories = getCategoriesByTheme('beauty')
  const revealTitle = {
    hidden: { y: '105%', opacity: 0 },
    visible: { y: 0, opacity: 1 }
  }

  return (
    <>
      <section className="hero" ref={heroRef} aria-labelledby="hero-heading">
        <motion.div
          className="hero-photo"
          style={{ y: reducedMotion ? 0 : photoY }}
          initial={reducedMotion ? false : { scale: 1.08, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.8 }}
        >
          <Image
            src="/tattoo-studio.jpg"
            alt="Close detail of tattoo artistry"
            fill
            priority
            sizes="(max-width: 767px) 100vw, 72vw"
            className="object-cover"
          />
        </motion.div>
        <div className="hero-shade" />
        <div className="studio-container hero-copy">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: reducedMotion ? 0 : 0.2 }}
            className="eyebrow mb-8 flex items-center gap-3"
          >
            <span className="h-px w-6 shrink-0 bg-gold" />
            Tattoo / Piercing / Beauty
          </motion.p>
          <motion.h1
            id="hero-heading"
            className="display-title hero-title"
            initial={reducedMotion ? false : 'hidden'}
            animate="visible"
            transition={{ staggerChildren: 0.14, delayChildren: 0.2 }}
          >
            <span className="block overflow-hidden pb-2">
              <motion.span
                className="block text-[clamp(5rem,11vw,10rem)] leading-[0.95] tracking-[0.025em]"
                variants={revealTitle}
                transition={{ duration: 1 }}
              >
                {brandName.toUpperCase()}
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-3">
              <motion.em
                className="block text-[clamp(2.5rem,5.8vw,5.6rem)] leading-[1.1] tracking-[-0.02em]"
                variants={revealTitle}
                transition={{ duration: 1 }}
              >
                {brandDetails.join(' ')}
              </motion.em>
            </span>
          </motion.h1>
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reducedMotion ? 0 : 0.7 }}
          >
            <div className="mt-9 flex flex-wrap items-center gap-5 sm:gap-8">
              <Link href="#studio-services" className="button-primary">
                Explore services <FiArrowUpRight aria-hidden="true" />
              </Link>
              <Link href="/book" className="link-line text-paper/85">
                Book a session <FiArrowUpRight aria-hidden="true" />
              </Link>
            </div>
          </motion.div>
        </div>
        <motion.div
          aria-hidden="true"
          className="hero-orbit"
          initial={{ opacity: 0, rotate: -25 }}
          animate={{ opacity: 1, rotate: 0 }}
          transition={{ duration: 1.7, delay: 0.5 }}
        >
          <svg
            viewBox="0 0 80 80"
            fill="none"
            stroke="currentColor"
            strokeWidth=".8"
          >
            <path d="M40 4 46 31 73 40 46 49 40 76 34 49 7 40 34 31Z" />
            <circle cx="40" cy="40" r="19" />
            <path d="m15 15 50 50m0-50L15 65" opacity=".5" />
          </svg>
        </motion.div>
        <div className="hero-bottom">
          <div className="studio-container flex items-end justify-between">
            <p className="text-[9px] uppercase tracking-[0.2em] text-paper/50">
              {siteConfig.address.city}, {siteConfig.address.state}
              <br />
              <span className="mt-2 block text-paper/75">
                Royal Multiskill Hub
              </span>
            </p>
            <a
              href="#studio-services"
              className="flex items-center gap-4 text-[9px] uppercase tracking-[0.2em] text-paper/60"
            >
              <span className="hidden sm:inline">View services</span>
              <span className="scroll-indicator" aria-hidden="true" />
              <FiArrowDown aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <div
        className="marquee relative"
        aria-label="Tattoo, piercing and beauty services"
      >
        <div
          className="marquee-track"
          aria-hidden="true"
          style={{ animationPlayState: marqueePaused ? 'paused' : undefined }}
        >
          {[0, 1].map((copy) => (
            <div key={copy}>
              {[
                'Custom tattoos',
                'Piercing',
                'Hair & colour',
                'Beauty & grooming',
                'Waxing & threading'
              ].map((item) => (
                <span
                  key={item}
                  className="flex items-center gap-12 text-paper/65"
                >
                  {item}
                  <svg
                    viewBox="0 0 12 12"
                    className="h-3 w-3 text-gold"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path d="M6 0v12M0 6h12M2 2l8 8M2 10l8-8" />
                  </svg>
                </span>
              ))}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setMarqueePaused((value) => !value)}
          className="absolute inset-y-0 left-0 flex w-12 items-center justify-center border-r border-white/10 bg-ink text-gold hover:text-paper"
          aria-label={
            marqueePaused
              ? 'Resume moving service list'
              : 'Pause moving service list'
          }
          aria-pressed={marqueePaused}
        >
          {marqueePaused ? (
            <FiPlay aria-hidden="true" />
          ) : (
            <FiPause aria-hidden="true" />
          )}
        </button>
      </div>

      <section
        id="studio-services"
        className="section-space"
        aria-labelledby="services-heading"
      >
        <div className="studio-container">
          <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-6">
            <h2 id="services-heading" className="section-title">
              Our services
            </h2>
            <Link href="/services" className="link-line">
              View all prices <FiArrowUpRight aria-hidden="true" />
            </Link>
          </Reveal>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            <Reveal>
              <Link
                href="/services#tattoo"
                className="service-feature group"
                aria-label="Explore custom tattoo services"
              >
                <Image
                  src="/tattoo-studio.jpg"
                  alt="Tattoo design in close detail"
                  fill
                  sizes="(max-width: 767px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="feature-copy">
                  <span className="eyebrow mb-3">01 / Ink</span>
                  <div className="flex items-end justify-between gap-5">
                    <div>
                      <h3 className="font-display text-5xl">Tattoos</h3>
                      <p className="mt-4 max-w-xs text-sm leading-6 text-paper/65">
                        {servicesData.tattoo.services[0].price}
                      </p>
                    </div>
                    <span className="flex h-12 w-12 items-center justify-center rounded-full border border-paper/40 transition-colors group-hover:border-gold group-hover:bg-gold group-hover:text-ink">
                      <FiArrowUpRight aria-hidden="true" className="text-xl" />
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
            <Reveal delay={0.12}>
              <Link
                href="/services#piercing"
                className="service-feature group"
                aria-label="Explore piercing services"
              >
                <PiercingArtwork />
                <div className="feature-copy">
                  <span className="eyebrow mb-3">02 / Adornment</span>
                  <div className="flex items-end justify-between gap-5">
                    <div>
                      <h3 className="font-display text-5xl">Piercing</h3>
                      <p className="mt-4 max-w-xs text-sm leading-6 text-paper/65">
                        {servicesData.piercing.services[0].price}
                      </p>
                    </div>
                    <span className="flex h-12 w-12 items-center justify-center rounded-full border border-paper/40 transition-colors group-hover:border-gold group-hover:bg-gold group-hover:text-ink">
                      <FiArrowUpRight aria-hidden="true" className="text-xl" />
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
            <Reveal delay={0.24} className="md:col-span-2 xl:col-span-1">
              <Link
                href="/services#beauty"
                className="service-feature group"
                aria-label="Explore beauty, hair, and skin services"
              >
                <Image
                  src="/gallery/beauty-bridal.jpg"
                  alt="Beauty and makeup inspiration"
                  fill
                  sizes="(max-width: 1279px) 100vw, 33vw"
                  className="object-cover"
                />
                <div className="feature-copy">
                  <span className="eyebrow mb-3">03 / Beauty</span>
                  <div className="flex items-end justify-between gap-5">
                    <div>
                      <h3 className="font-display text-5xl">Beauty</h3>
                      <p className="mt-4 max-w-xs text-sm leading-6 text-paper/65">
                        Hair / Skin / Beauty
                      </p>
                    </div>
                    <span className="flex h-12 w-12 items-center justify-center rounded-full border border-paper/40 transition-colors group-hover:border-gold group-hover:bg-gold group-hover:text-ink">
                      <FiArrowUpRight aria-hidden="true" className="text-xl" />
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          </div>
          <Reveal className="mt-8 border-t border-white/15 pt-7">
            <h3 className="eyebrow mb-5">Beauty menu</h3>
            <div className="flex flex-wrap gap-3">
              {beautyCategories.map((category) => (
                <Link
                  key={category.key}
                  href={`/services#${category.key}`}
                  className="filter-button flex items-center gap-4 text-paper"
                >
                  {category.title}
                  <FiArrowUpRight aria-hidden="true" />
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-space" aria-labelledby="inspiration-heading">
        <div className="studio-container">
          <Reveal className="mb-12 flex flex-col justify-between gap-7 sm:flex-row sm:items-end">
            <h2 id="inspiration-heading" className="section-title">
              Inspiration
            </h2>
            <Link href="/portfolio" className="link-line w-fit">
              View the gallery <FiArrowUpRight aria-hidden="true" />
            </Link>
          </Reveal>
          <div className="grid gap-7 sm:grid-cols-3">
            {featuredWorks.map((work, index) => (
              <Reveal
                key={work.title}
                delay={index * 0.1}
                className={index === 1 ? 'sm:pt-14' : ''}
              >
                <Link href="/portfolio" className="work-image group block">
                  <div className="relative aspect-[3/4] overflow-hidden bg-white/5">
                    <Image
                      src={work.src}
                      alt={work.alt}
                      fill
                      sizes="(max-width: 639px) 100vw, 33vw"
                      className="object-cover"
                    />
                    <span className="absolute bottom-5 left-5 text-[9px] uppercase tracking-[0.2em] text-white/80">
                      Style inspiration
                    </span>
                  </div>
                  <div className="mt-5 flex justify-between border-b border-white/15 pb-4">
                    <h3 className="font-display text-2xl">{work.title}</h3>
                    <FiArrowUpRight aria-hidden="true" className="text-gold" />
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
          <p className="mt-8 text-xs leading-6 text-muted">
            Reference imagery for inspiration; not studio work.
          </p>
        </div>
      </section>

      <section
        className="border-y border-white/10 bg-[#191918] py-16 md:py-20"
        aria-labelledby="studio-film-heading"
      >
        <div className="studio-container grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <h2 id="studio-film-heading" className="section-title">
              The studio
            </h2>
            <p className="mt-6 text-sm leading-7 text-muted">
              {siteConfig.address.short}
              <br />
              {siteConfig.hours.weekdays.time}
            </p>
            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-5">
              <a
                href={siteConfig.maps.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="link-line"
              >
                Directions <FiArrowUpRight aria-hidden="true" />
              </a>
              <a
                href={siteConfig.reviews.viewReviewsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="link-line"
              >
                Google reviews <FiArrowUpRight aria-hidden="true" />
              </a>
              <a
                href={siteConfig.reviews.googleReviewsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="link-line"
              >
                Leave a review <FiArrowUpRight aria-hidden="true" />
              </a>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <video
              controls
              playsInline
              preload="none"
              className="studio-video"
              aria-label="Royal Multiskill Hub studio film"
            >
              <source src="/homepage.mov" />
              Your browser does not support this video.
            </video>
            <a
              href="/homepage.mov"
              className="mt-4 inline-block text-xs text-muted underline"
            >
              Open the studio film
            </a>
          </Reveal>
        </div>
      </section>

      <BookingCTA />
    </>
  )
}
