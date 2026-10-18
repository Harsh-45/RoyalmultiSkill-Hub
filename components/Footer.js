'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { FiArrowUpRight } from 'react-icons/fi'
import BrandMark from '@/components/BrandMark'
import siteConfig from '@/config/site'

const exploreLinks = [
  { name: 'Tattoo', href: '/services#tattoo' },
  { name: 'Piercing', href: '/services#piercing' },
  { name: 'Beauty', href: '/services#beauty' },
  { name: 'Portfolio', href: '/portfolio' },
]

export default function Footer() {
  const reducedMotion = useReducedMotion()
  const currentYear = new Date().getFullYear()
  const [brandName, ...brandDetails] = siteConfig.businessName.split(' ')
  const socialLinks = [
    { name: 'Instagram', href: siteConfig.social.instagram },
    { name: 'Facebook', href: siteConfig.social.facebook },
    { name: 'YouTube', href: siteConfig.social.youtube },
  ].filter((link) => link.href)
  const openingHours = [siteConfig.hours.weekdays, siteConfig.hours.weekend].filter((hours) => hours.days && hours.time)
  const reveal = (delay = 0) => ({
    initial: reducedMotion ? false : { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.15 },
    transition: { duration: 0.65, delay: reducedMotion ? 0 : delay, ease: [0.22, 1, 0.36, 1] },
  })

  return (
    <footer className="border-t border-paper/10 bg-[#0b0b0a] text-paper">
      <div className="studio-container">
        <div className="grid gap-x-10 gap-y-9 py-12 sm:grid-cols-2 md:py-14 lg:grid-cols-[1.3fr_1fr_0.8fr_1.1fr]">
          <motion.div {...reveal()}>
            <Link href="/" className="inline-flex items-center gap-3" aria-label={`${siteConfig.businessName} home`}>
              <BrandMark className="h-[52px] w-[52px] shrink-0 text-gold" />
              <span className="flex flex-col">
                <span className="font-display text-[28px] leading-none tracking-[0.16em] text-gold sm:text-[30px]">{brandName.toUpperCase()}</span>
                <span className="mt-1.5 font-display text-lg leading-tight tracking-wide text-paper">{brandDetails.join(' ')}</span>
              </span>
            </Link>
            <p className="mt-4 text-xs tracking-wide text-paper/50">{siteConfig.tagline}</p>
            <div className="mt-5 flex flex-wrap gap-5">
              {socialLinks.map((link) => (
                <a key={link.name} href={link.href} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.12em] text-paper/70 transition-colors hover:text-gold">
                  {link.name}<FiArrowUpRight aria-hidden="true" className="text-sm transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transform-none" />
                </a>
              ))}
            </div>
          </motion.div>

          <motion.div {...reveal(0.06)}>
            <h3 className="eyebrow mb-5 text-gold">Visit</h3>
            <address className="not-italic text-sm leading-7 text-paper/60">{siteConfig.address.street},<br />{siteConfig.address.area}, {siteConfig.address.city}<br />{siteConfig.address.state} {siteConfig.address.pincode}</address>
            <a href={siteConfig.maps.directionsUrl} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-3 border-b border-paper/25 pb-1 text-xs text-paper transition-colors hover:border-gold hover:text-gold">Get directions <FiArrowUpRight aria-hidden="true" /></a>
          </motion.div>

          <motion.div {...reveal(0.12)}>
            <h3 className="eyebrow mb-5 text-gold">Services</h3>
            <ul className="space-y-3.5">
              {exploreLinks.map((link) => <li key={link.href}><Link href={link.href} className="text-sm text-paper/60 transition-colors duration-300 hover:text-gold">{link.name}</Link></li>)}
            </ul>
          </motion.div>

          <motion.div {...reveal(0.18)}>
            <h3 className="eyebrow mb-5 text-gold">Contact</h3>
            <a href={`tel:${siteConfig.contact.phone.replace(/\s/g, '')}`} className="block text-sm text-paper/80 transition-colors hover:text-gold">{siteConfig.contact.phone}</a>
            <a href={siteConfig.whatsapp.getUrl()} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-2 text-sm text-paper/60 transition-colors hover:text-gold">Enquire on WhatsApp <FiArrowUpRight aria-hidden="true" /></a>
            <div className="mt-5 space-y-3 border-t border-paper/10 pt-4">
              {openingHours.map((hours) => <p key={hours.days} className="text-xs leading-6 text-paper/50"><span className="block text-paper/70">{hours.days}</span>{hours.time}</p>)}
            </div>
          </motion.div>
        </div>

        <div className="flex flex-wrap justify-between gap-3 border-t border-paper/10 py-5 text-[10px] leading-5 tracking-[0.05em] text-paper/40">
          <p>© {currentYear} {siteConfig.businessName}. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-5">
            <Link href="/#reviews" className="inline-flex min-h-[44px] items-center py-2 transition-colors hover:text-gold">Reviews</Link>
            <Link href="/privacy" className="inline-flex min-h-[44px] items-center py-2 transition-colors hover:text-gold">Privacy</Link>
            <Link href="/terms" className="inline-flex min-h-[44px] items-center py-2 transition-colors hover:text-gold">Website terms</Link>
            <Link href="/my-requests" className="inline-flex min-h-[44px] items-center py-2 transition-colors hover:text-gold">My requests</Link>
            <Link href="/owner" className="inline-flex min-h-[44px] items-center py-2 transition-colors hover:text-gold">Owner sign in</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
