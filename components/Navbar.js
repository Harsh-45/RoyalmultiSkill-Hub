'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import { FiArrowUpRight, FiMenu, FiX } from 'react-icons/fi'
import BrandMark from '@/components/BrandMark'
import siteConfig from '@/config/site'

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Services', href: '/services' },
  { name: 'Portfolio', href: '/portfolio' },
  { name: 'Studio', href: '/about' },
  { name: 'Contact', href: '/contact' },
  { name: 'My requests', href: '/my-requests' },
]

function Brand({ onClick }) {
  const [name, ...details] = siteConfig.businessName.split(' ')

  return (
    <Link href="/" onClick={onClick} className="group flex shrink-0 items-center gap-3 text-paper" aria-label={`${siteConfig.businessName} home`}>
      <BrandMark className="h-11 w-11 text-gold transition-transform duration-500 group-hover:rotate-6 motion-reduce:transform-none lg:h-[52px] lg:w-[52px]" />
      <span className="flex flex-col">
        <span className="font-display text-[26px] leading-none tracking-[0.16em] text-gold sm:text-[28px]">{name.toUpperCase()}</span>
        <span className="mt-1.5 whitespace-nowrap text-[10px] font-medium uppercase leading-tight tracking-[0.16em] text-paper/90 sm:text-[11px]">{details.join(' ')}</span>
      </span>
    </Link>
  )
}

export default function Navbar() {
  const pathname = usePathname()
  const reducedMotion = useReducedMotion()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const menuButtonRef = useRef(null)
  const dialogRef = useRef(null)
  const closeButtonRef = useRef(null)
  const { scrollYProgress } = useScroll()
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 180, damping: 30, restDelta: 0.001 })

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!isOpen) return

    const previousOverflow = document.body.style.overflow
    const menuButton = menuButtonRef.current
    document.body.style.overflow = 'hidden'
    const frame = window.requestAnimationFrame(() => closeButtonRef.current?.focus())

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setIsOpen(false)
      }
      if (event.key !== 'Tab') return

      const focusableElements = dialogRef.current?.querySelectorAll('a[href], button:not([disabled]), [tabindex="0"]')
      if (!focusableElements?.length) return
      const first = focusableElements[0]
      const last = focusableElements[focusableElements.length - 1]
      if (event.shiftKey && (document.activeElement === first || !dialogRef.current.contains(document.activeElement))) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && (document.activeElement === last || !dialogRef.current.contains(document.activeElement))) {
        event.preventDefault()
        first.focus()
      }
    }
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsOpen(false)
    }

    document.addEventListener('keydown', handleKeyDown)
    window.addEventListener('resize', handleResize)
    return () => {
      window.cancelAnimationFrame(frame)
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('resize', handleResize)
      menuButton?.focus()
    }
  }, [isOpen])

  const isActive = (href) => href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <>
      <motion.header
        initial={reducedMotion ? false : { opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden={isOpen ? true : undefined}
        className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-500 ${scrolled ? 'border-paper/10 bg-ink/95 backdrop-blur-xl' : 'border-paper/10 bg-ink/80 backdrop-blur-md'}`}
      >
        <div className="studio-container flex h-[88px] items-center justify-between gap-3 xl:gap-5">
          <Brand />
          <nav aria-label="Main navigation" className="hidden items-center gap-3 lg:flex xl:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? 'page' : undefined}
                className={`group relative whitespace-nowrap py-3 text-[10px] font-medium uppercase tracking-[0.1em] transition-colors duration-300 xl:tracking-[0.16em] ${isActive(link.href) ? 'text-gold' : 'text-paper/70 hover:text-paper'}`}
              >
                {link.name}
                <span className={`absolute bottom-1 left-0 h-px w-full origin-left bg-gold transition-transform duration-300 ${isActive(link.href) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
              </Link>
            ))}
          </nav>
          <Link href="/book" className="button-primary hidden gap-3 whitespace-nowrap px-5 py-3 text-[10px] lg:inline-flex">
            Book a session <FiArrowUpRight aria-hidden="true" className="text-base" />
          </Link>
          <button
            ref={menuButtonRef}
            type="button"
            aria-label="Open navigation menu"
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsOpen(true)}
            className="flex h-11 w-11 shrink-0 items-center justify-center border border-paper/20 text-paper transition-colors hover:border-gold hover:text-gold lg:hidden"
          >
            <FiMenu className="text-xl" aria-hidden="true" />
          </button>
        </div>
        <motion.div className="absolute inset-x-0 bottom-0 h-px origin-left bg-gold" style={{ scaleX: reducedMotion ? scrollYProgress : smoothProgress }} />
      </motion.header>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-navigation"
            ref={dialogRef}
            id="mobile-navigation"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.25 }}
            className="fixed inset-0 z-[70] flex h-[100dvh] flex-col overflow-y-auto overscroll-contain bg-ink text-paper lg:hidden"
          >
            <div className="studio-container sticky top-0 z-10 flex h-[88px] shrink-0 items-center justify-between gap-5 border-b border-paper/10 bg-ink">
              <Brand onClick={() => setIsOpen(false)} />
              <button ref={closeButtonRef} type="button" aria-label="Close navigation menu" onClick={() => setIsOpen(false)} className="flex h-11 w-11 shrink-0 items-center justify-center border border-paper/20 text-paper transition-colors hover:border-gold hover:text-gold">
                <FiX className="text-xl" aria-hidden="true" />
              </button>
            </div>
            <div className="studio-container flex flex-1 shrink-0 flex-col justify-center py-6">
              <nav aria-label="Mobile navigation" className="space-y-1">
                {navLinks.map((link, index) => (
                  <motion.div key={link.href} initial={reducedMotion ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: reducedMotion ? 0 : 0.08 + index * 0.055 }}>
                    <Link href={link.href} onClick={() => setIsOpen(false)} aria-current={isActive(link.href) ? 'page' : undefined} className={`group flex min-h-[44px] items-center justify-between border-b border-paper/10 py-2.5 font-display text-[clamp(1.6rem,5dvh,3.5rem)] leading-tight transition-colors ${isActive(link.href) ? 'text-gold' : 'text-paper hover:text-gold'}`}>
                      <span><span className="mr-5 align-middle font-sans text-[10px] tracking-[0.12em] text-gold/70">0{index + 1}</span>{link.name}</span>
                      <FiArrowUpRight className="text-2xl transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 motion-reduce:transform-none" aria-hidden="true" />
                    </Link>
                  </motion.div>
                ))}
              </nav>
              <Link href="/book" onClick={() => setIsOpen(false)} className="button-primary mt-6 w-fit gap-5">
                Book a session <FiArrowUpRight aria-hidden="true" />
              </Link>
            </div>
            <p className="studio-container shrink-0 pb-[calc(1.5rem+env(safe-area-inset-bottom))] text-[10px] uppercase tracking-[0.18em] text-paper/40">Tattoo · Piercing · Beauty / {siteConfig.address.city}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
