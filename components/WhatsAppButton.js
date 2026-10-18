'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { FaWhatsapp } from 'react-icons/fa'
import siteConfig from '@/config/site'

export default function WhatsAppButton() {
  const reducedMotion = useReducedMotion()
  const pathname = usePathname()
  const hasBookingControls = pathname === '/contact' || pathname === '/services' || pathname === '/book' || pathname === '/booking-status' || pathname === '/my-requests'

  if (pathname === '/owner') return null

  return (
    <motion.a
      href={siteConfig.whatsapp.getUrl()}
      target="_blank"
      rel="noopener noreferrer"
      initial={reducedMotion ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: reducedMotion ? 0 : 1.1 }}
      whileHover={reducedMotion ? undefined : { y: -4 }}
      whileTap={reducedMotion ? undefined : { scale: 0.97 }}
      className={`fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 z-40 h-12 w-12 items-center justify-center gap-2.5 rounded-full border border-gold/45 bg-ink text-gold shadow-[0_5px_25px_rgba(0,0,0,0.25)] transition-colors hover:bg-gold hover:text-ink sm:bottom-7 sm:right-7 sm:w-auto sm:px-5 ${hasBookingControls ? 'hidden sm:flex' : 'flex'}`}
      aria-label="Enquire about a session on WhatsApp"
    >
      <FaWhatsapp className="text-xl" aria-hidden="true" />
      <span className="hidden text-[10px] font-medium uppercase tracking-[0.13em] sm:inline">Let’s talk</span>
    </motion.a>
  )
}
