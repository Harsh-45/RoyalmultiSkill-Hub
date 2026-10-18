'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { FiArrowLeft, FiArrowRight, FiArrowUpRight } from 'react-icons/fi'
import Image from 'next/image'

export default function GalleryGrid({ images, category }) {
  const [selectedIndex, setSelectedIndex] = useState(null)
  const dialogRef = useRef(null)
  const closeButtonRef = useRef(null)
  const reducedMotion = useReducedMotion()
  const selectedImage = selectedIndex === null ? null : images[selectedIndex]
  const isOpen = Boolean(selectedImage)
  const closeGallery = useCallback(() => setSelectedIndex(null), [])

  useEffect(() => {
    if (!isOpen) return undefined

    const previousFocus = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const focusFrame = window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus({ preventScroll: true })
    })

    return () => {
      window.cancelAnimationFrame(focusFrame)
      document.body.style.overflow = previousOverflow
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus({ preventScroll: true })
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return undefined

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeGallery()
      }

      if (event.key === 'ArrowRight' && images.length > 1) {
        event.preventDefault()
        setSelectedIndex((index) => (index + 1) % images.length)
      }

      if (event.key === 'ArrowLeft' && images.length > 1) {
        event.preventDefault()
        setSelectedIndex((index) => (index - 1 + images.length) % images.length)
      }

      if (event.key === 'Tab') {
        const focusable = dialogRef.current?.querySelectorAll('button, [href], [tabindex="0"]')
        if (!focusable?.length) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]

        if (event.shiftKey && (document.activeElement === first || !dialogRef.current.contains(document.activeElement))) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && (document.activeElement === last || !dialogRef.current.contains(document.activeElement))) {
          event.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [closeGallery, images.length, isOpen])

  return (
    <>
      <div className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-7 lg:gap-y-14 lg:pb-10">
        {images.map((image, index) => (
          <motion.figure
            key={`${image.src}-${image.title}`}
            initial={{ opacity: 0, y: reducedMotion ? 0 : 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: reducedMotion ? 0 : 0.65, delay: reducedMotion ? 0 : (index % 3) * 0.07 }}
            className={index % 3 === 1 ? 'lg:relative lg:top-10' : ''}
          >
            <button
              type="button"
              onClick={() => setSelectedIndex(index)}
              aria-label={`View ${image.title}, ${image.category} style inspiration`}
              aria-haspopup="dialog"
              className="group relative block w-full overflow-hidden bg-white/5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c6a77c]"
            >
              <div className={`relative ${index % 3 === 1 ? 'aspect-[4/5]' : 'aspect-[3/4]'}`}>
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover saturate-[0.65] transition duration-700 group-hover:scale-105 group-hover:saturate-100 group-focus-visible:scale-105 motion-reduce:transform-none motion-reduce:transition-none"
                  sizes="(max-width: 639px) calc(100vw - 48px), (max-width: 1023px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <span aria-hidden="true" className="absolute bottom-5 right-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-black/15 text-xl text-white backdrop-blur-sm transition duration-300 group-hover:rotate-45 group-hover:border-[#c6a77c] group-hover:bg-[#c6a77c] group-hover:text-[#111110] motion-reduce:transform-none motion-reduce:transition-none"><FiArrowUpRight /></span>
                <span className="absolute bottom-6 left-5 text-[9px] uppercase tracking-[0.22em] text-white/75">Style inspiration</span>
              </div>
            </button>
            <figcaption className="flex items-start justify-between gap-4 border-b border-white/10 pb-4 pt-5">
              <div>
                <h3 className="font-display text-xl">{image.title}</h3>
                <p className="mt-2 text-[10px] uppercase tracking-[0.18em] text-muted">{image.category}</p>
              </div>
              <span aria-hidden="true" className="pt-1 text-[10px] text-[#c6a77c]">{String(index + 1).padStart(2, '0')}</span>
            </figcaption>
          </motion.figure>
        ))}
      </div>

      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              key="gallery-dialog"
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="gallery-dialog-title"
              aria-describedby="gallery-dialog-description"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reducedMotion ? 0 : 0.2 }}
              className="fixed inset-0 z-[100] flex flex-col overflow-y-auto overscroll-contain bg-[#111110]/[0.98] text-[#f0ece4]"
              style={{
                height: '100dvh',
                padding: 'max(12px, env(safe-area-inset-top)) max(16px, env(safe-area-inset-right)) max(12px, env(safe-area-inset-bottom)) max(16px, env(safe-area-inset-left))',
              }}
              onClick={(event) => { if (event.target === event.currentTarget) closeGallery() }}
            >
              <div className="flex shrink-0 items-center justify-between gap-5 border-b border-white/10 pb-3 sm:pb-4 [@media(max-height:500px)]:pb-2">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#c6a77c]">Style inspiration / {category}</p>
                <button ref={closeButtonRef} type="button" onClick={closeGallery} aria-label="Close image viewer" className="flex h-11 w-11 shrink-0 items-center justify-center border border-white/20 transition-colors hover:border-[#c6a77c] hover:text-[#c6a77c]">
                  <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m6 6 12 12M6 18 18 6" /></svg>
                </button>
              </div>

              <div className="relative my-3 min-h-[80px] flex-1 sm:my-5 [@media(max-height:500px)]:my-2" onClick={(event) => { if (event.target === event.currentTarget) closeGallery() }}>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div key={`${selectedImage.title}-${selectedIndex}`} className="absolute inset-0" initial={{ opacity: 0, scale: reducedMotion ? 1 : 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0 : 0.18 }}>
                    <Image src={selectedImage.src} alt={selectedImage.alt} fill className="object-contain" sizes="100vw" />
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-3 sm:gap-5 sm:pt-5 [@media(max-height:500px)]:gap-3 [@media(max-height:500px)]:pt-2">
                <div aria-live="polite" aria-atomic="true">
                  <h2 id="gallery-dialog-title" className="font-display text-2xl sm:text-3xl [@media(max-height:500px)]:text-xl">{selectedImage.title}</h2>
                  <p id="gallery-dialog-description" className="mt-1 max-w-lg text-xs leading-4 text-white/55">{selectedImage.category} reference; not studio work.</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="mr-2 text-xs tabular-nums text-white/55">{String(selectedIndex + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}</span>
                  {images.length > 1 && (
                    <>
                      <button type="button" aria-label="Previous image" onClick={() => setSelectedIndex((index) => (index - 1 + images.length) % images.length)} className="flex h-11 w-11 shrink-0 items-center justify-center border border-white/20 transition-colors hover:border-[#c6a77c] hover:text-[#c6a77c]"><FiArrowLeft aria-hidden="true" /></button>
                      <button type="button" aria-label="Next image" onClick={() => setSelectedIndex((index) => (index + 1) % images.length)} className="flex h-11 w-11 shrink-0 items-center justify-center border border-white/20 transition-colors hover:border-[#c6a77c] hover:text-[#c6a77c]"><FiArrowRight aria-hidden="true" /></button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  )
}
