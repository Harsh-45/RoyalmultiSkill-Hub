'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { FiArrowUpRight, FiCalendar, FiRefreshCw } from 'react-icons/fi'
import { servicesData } from '@/data/services'
import { lastBookingDate, slotLabel, todayInIndia } from '@/lib/booking-shared.mjs'
import { saveBookingRequest } from '@/lib/booking-history.mjs'

const serviceGroups = [
  { title: 'Tattoo & piercing', services: Object.values(servicesData).filter(category => category.theme !== 'beauty') },
  { title: 'Beauty', services: Object.values(servicesData).filter(category => category.theme === 'beauty') },
]
const initialDetails = { name: '', phone: '', service: '', notes: '' }
const serviceNames = Object.values(servicesData).map(category => category.title)

function secureUuid() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID()
  const bytes = globalThis.crypto.getRandomValues(new Uint8Array(16))
  bytes[6] = (bytes[6] & 0x0f) | 0x40
  bytes[8] = (bytes[8] & 0x3f) | 0x80
  const hex = Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('')
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}

function displayDate(date) {
  return new Date(`${date}T12:00:00+05:30`).toLocaleDateString('en-IN', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata',
  })
}

export default function BookingForm() {
  const [details, setDetails] = useState(initialDetails)
  const [date, setDate] = useState(todayInIndia)
  const [hour, setHour] = useState(null)
  const [bounds, setBounds] = useState(() => ({ today: todayInIndia(), maxDate: lastBookingDate() }))
  const [availability, setAvailability] = useState({ slots: [], loading: true, error: '' })
  const [refresh, setRefresh] = useState(0)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [uncertain, setUncertain] = useState(false)
  const [success, setSuccess] = useState(null)
  const [savedInBrowser, setSavedInBrowser] = useState(true)
  const attempt = useRef(null)
  const requestSequence = useRef(0)
  const successRef = useRef(null)

  useEffect(() => {
    const service = new URLSearchParams(window.location.search).get('service')
    if (serviceNames.includes(service)) setDetails(previous => ({ ...previous, service }))
  }, [])

  useEffect(() => {
    if (success || !date) {
      setAvailability({ slots: [], loading: false, error: '' })
      return
    }
    const controller = new AbortController()
    const sequence = ++requestSequence.current
    setAvailability(previous => ({ ...previous, loading: true, error: '' }))

    async function load() {
      try {
        const response = await fetch(`/api/bookings/availability?date=${encodeURIComponent(date)}`, {
          signal: controller.signal, cache: 'no-store',
        })
        const result = await response.json()
        if (!response.ok) throw new Error(result.error || 'Availability could not be loaded.')
        if (result.date !== date || !Array.isArray(result.slots)) throw new Error('Availability could not be loaded.')
        if (sequence !== requestSequence.current || controller.signal.aborted) return
        setBounds(previous => ({ today: result.today || previous.today, maxDate: result.maxDate || previous.maxDate }))
        setAvailability({ slots: result.slots, loading: false, error: '' })
        setHour(selected => result.slots.some(slot => slot.hour === selected && slot.available) ? selected : null)
      } catch (error) {
        if (controller.signal.aborted || sequence !== requestSequence.current) return
        setAvailability({ slots: [], loading: false, error: error.message || 'Availability could not be loaded.' })
      }
    }
    load()
    return () => controller.abort()
  }, [date, refresh, success])

  useEffect(() => {
    if (success) return
    const reload = () => {
      if (document.visibilityState === 'visible') setRefresh(value => value + 1)
    }
    const interval = window.setInterval(reload, 30000)
    window.addEventListener('focus', reload)
    document.addEventListener('visibilitychange', reload)
    return () => {
      window.clearInterval(interval)
      window.removeEventListener('focus', reload)
      document.removeEventListener('visibilitychange', reload)
    }
  }, [success])

  useEffect(() => {
    if (success && successRef.current) {
      successRef.current.focus({ preventScroll: true })
      successRef.current.scrollIntoView({ block: 'start', behavior: 'auto' })
    }
  }, [success])

  const changeDetails = event => {
    const { name, value } = event.target
    setDetails(previous => ({ ...previous, [name]: value }))
    setErrors(previous => ({ ...previous, [name]: '', form: '' }))
  }

  async function submit(event) {
    event.preventDefault()
    if (submitting) return
    const form = event.currentTarget
    const nextErrors = {}
    if (!uncertain) {
      if (!details.name.trim()) nextErrors.name = 'Enter your name.'
      if (!/^[+\d\s()-]+$/.test(details.phone) || details.phone.replace(/\D/g, '').length < 7 || details.phone.replace(/\D/g, '').length > 15) nextErrors.phone = 'Enter a valid phone number.'
      if (!serviceNames.includes(details.service)) nextErrors.service = 'Choose a service.'
      if (!date || date < bounds.today || date > bounds.maxDate) nextErrors.date = 'Choose a date within the next 60 days.'
      if (availability.loading || availability.error || !availability.slots.some(slot => slot.hour === hour && slot.available)) nextErrors.hour = 'Choose an available time.'
      setErrors(nextErrors)
      if (Object.keys(nextErrors).length) {
        const first = Object.keys(nextErrors)[0]
        if (first === 'hour') form.querySelector('[data-slot][aria-disabled="false"]')?.focus()
        else form.elements.namedItem(first)?.focus()
        return
      }
    }

    setSubmitting(true)
    setErrors({})
    try {
      if (!attempt.current) {
        attempt.current = {
          ...details, name: details.name.trim(), phone: details.phone.trim(), notes: details.notes.trim(),
          date, hour, requestKey: secureUuid(), statusToken: secureUuid(),
        }
      }
      const response = await fetch('/api/bookings', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(attempt.current),
      })
      const result = await response.json()
      if (!response.ok) {
        // A response confirms that the request was not accepted. Network failures
        // retain the same payload and keys so retrying cannot create a duplicate.
        if (response.status < 500) {
          attempt.current = null
          setUncertain(false)
          setErrors({ ...(result.errors || {}), form: result.error || 'Your request could not be saved. Please try again.' })
          setRefresh(value => value + 1)
          return
        }
        throw new Error(result.error || 'The connection was interrupted. Retry to check your request.')
      }
      if (!result.booking || !result.whatsappUrl || !result.statusUrl) throw new Error('The connection was interrupted. Retry to check your request.')
      setSavedInBrowser(saveBookingRequest(result.booking, result.statusUrl))
      setSuccess(result)
      setUncertain(false)
    } catch (error) {
      setUncertain(Boolean(attempt.current))
      setErrors({ form: attempt.current ? 'The connection was interrupted. Retry to check your request; it will not create a duplicate.' : 'Your browser could not prepare a secure request. Please use a current browser.' })
    } finally {
      setSubmitting(false)
    }
  }

  function reset() {
    attempt.current = null
    setSuccess(null)
    setUncertain(false)
    setDetails(initialDetails)
    setDate(todayInIndia())
    setHour(null)
    setErrors({})
    setSavedInBrowser(true)
    setRefresh(value => value + 1)
  }

  if (success) {
    return (
      <div ref={successRef} tabIndex={-1} className="surface min-w-0 p-5 focus:outline-none sm:p-9 lg:p-10" role="status">
        <span className="eyebrow mb-5">Pending approval</span>
        <h2 className="font-display text-4xl">Request saved.</h2>
        <p className="mt-4 text-sm leading-7 text-muted">Send it to the studio on WhatsApp. Confirmed only after approval.</p>
        <dl className="my-7 space-y-4 border-y border-paper/15 py-6 text-sm">
          <div className="flex flex-wrap justify-between gap-3"><dt className="text-muted">Service</dt><dd className="max-w-full break-words">{success.booking.service}</dd></div>
          <div className="flex flex-wrap justify-between gap-3"><dt className="text-muted">Date</dt><dd>{displayDate(success.booking.date)}</dd></div>
          <div className="flex flex-wrap justify-between gap-3"><dt className="text-muted">Time</dt><dd>{slotLabel(success.booking.hour)}</dd></div>
        </dl>
        <div className="flex flex-col gap-3">
          <a href={success.whatsappUrl} target="_blank" rel="noopener noreferrer" className="button-primary gap-3 px-3">Send on WhatsApp <FiArrowUpRight aria-hidden="true" /></a>
          <Link href={success.statusUrl} prefetch={false} className="button-outline gap-3 px-3">View booking status <FiArrowUpRight aria-hidden="true" /></Link>
        </div>
        {savedInBrowser ? (
          <p className="mt-5 text-xs leading-6 text-muted">Saved in this browser. Check the owner’s decision in <Link href="/my-requests" className="inline-flex min-h-[44px] items-center text-gold underline underline-offset-4">My requests</Link>.</p>
        ) : (
          <p className="mt-5 text-xs leading-6 text-muted" role="status">This browser could not save your status link. Keep the private link above to check the owner’s decision.</p>
        )}
        <button type="button" onClick={reset} className="mt-5 min-h-[44px] text-xs text-gold underline underline-offset-4">Request another visit</button>
      </div>
    )
  }

  const locked = submitting || uncertain
  const selectedAvailable = availability.slots.some(slot => slot.hour === hour && slot.available)
  const canSubmit = uncertain || (!availability.loading && !availability.error && selectedAvailable)

  return (
    <div className="surface min-w-0 p-5 sm:p-9 lg:p-10">
      <div className="mb-7 flex items-start justify-between gap-3"><div><span className="eyebrow mb-4">Your appointment</span><h2 className="font-display text-3xl sm:text-4xl">Choose your time</h2></div><FiCalendar aria-hidden="true" className="mt-1 text-xl text-gold" /></div>
      <form onSubmit={submit} noValidate className="space-y-6" aria-busy={submitting}>
        <fieldset disabled={locked} className="min-w-0 space-y-6 disabled:opacity-70">
          <legend className="sr-only">Appointment details</legend>
          <div>
            <label htmlFor="booking-service" className="mb-3 block text-xs text-paper/80">Service <span className="text-gold">*</span></label>
            <select id="booking-service" name="service" required value={details.service} onChange={changeDetails} className="field min-h-[48px] pr-8" aria-invalid={Boolean(errors.service)} aria-describedby={errors.service ? 'booking-service-error' : undefined}>
              <option value="" disabled>Select a service</option>
              {serviceGroups.map(group => <optgroup key={group.title} label={group.title}>{group.services.map(service => <option key={service.title} value={service.title}>{service.title}</option>)}</optgroup>)}
            </select>
            {errors.service && <p id="booking-service-error" className="mt-2 text-xs text-gold" role="alert">{errors.service}</p>}
          </div>
          <div className="min-w-0">
            <label htmlFor="booking-date" className="mb-3 block text-xs text-paper/80">Date <span className="text-gold">*</span></label>
            <input id="booking-date" name="date" type="date" required value={date} min={bounds.today} max={bounds.maxDate} onChange={event => { setDate(event.target.value); setHour(null); setErrors(previous => ({ ...previous, date: '', hour: '', form: '' })) }} className="field min-h-[52px] min-w-0 max-w-full" aria-invalid={Boolean(errors.date)} aria-describedby={errors.date ? 'booking-date-error' : undefined} />
            {errors.date && <p id="booking-date-error" className="mt-2 text-xs text-gold" role="alert">{errors.date}</p>}
          </div>
          <fieldset className="min-w-0" aria-describedby="booking-slot-help">
            <legend className="mb-3 text-xs text-paper/80">One-hour slot <span className="text-gold">*</span></legend>
            <p id="booking-slot-help" className="mb-4 text-xs leading-6 text-muted">All times are in India. Confirmed bookings are unavailable.</p>
            {availability.error ? (
              <div className="border border-paper/15 p-4"><p className="text-sm leading-6 text-muted" role="alert">{availability.error}</p><button type="button" onClick={() => setRefresh(value => value + 1)} className="mt-2 inline-flex min-h-[44px] items-center gap-2 text-xs text-gold"><FiRefreshCw aria-hidden="true" />Retry availability</button></div>
            ) : (
              <div className="grid grid-cols-1 gap-2 min-[360px]:grid-cols-2" role="group" aria-label="Available appointment times" aria-busy={availability.loading}>
                {availability.slots.map(slot => (
                  <button key={slot.hour} type="button" data-slot aria-disabled={!slot.available || availability.loading} aria-pressed={hour === slot.hour} disabled={!slot.available || availability.loading} onClick={() => { setHour(slot.hour); setErrors(previous => ({ ...previous, hour: '', form: '' })) }} className={`min-h-[52px] border px-2 py-3 text-[12px] leading-5 transition-colors ${hour === slot.hour ? 'border-gold bg-gold text-ink' : slot.available ? 'border-paper/25 text-paper hover:border-gold' : 'border-paper/10 text-muted opacity-50'} disabled:cursor-not-allowed`}>
                    <span className="block">{slot.label || slotLabel(slot.hour)}</span>{!slot.available && <span className="block text-[10px]">Unavailable</span>}
                  </button>
                ))}
              </div>
            )}
            {availability.loading && <p className="mt-3 text-xs text-muted" role="status">Checking available times…</p>}
            {!availability.loading && !availability.error && !availability.slots.length && <p className="text-xs leading-6 text-muted">Choose a date to see available times.</p>}
            {!availability.loading && !availability.error && availability.slots.length > 0 && availability.slots.every(slot => !slot.available) && <p className="mt-3 text-xs leading-6 text-muted">No times available on this date. Please choose another day.</p>}
            {errors.hour && <p className="mt-2 text-xs text-gold" role="alert">{errors.hour}</p>}
          </fieldset>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="booking-name" className="mb-3 block text-xs text-paper/80">Your name <span className="text-gold">*</span></label>
              <input id="booking-name" name="name" type="text" autoComplete="name" required maxLength={100} value={details.name} onChange={changeDetails} className="field" placeholder="Full name" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'booking-name-error' : undefined} />
              {errors.name && <p id="booking-name-error" className="mt-2 text-xs text-gold" role="alert">{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="booking-phone" className="mb-3 block text-xs text-paper/80">Phone number <span className="text-gold">*</span></label>
              <input id="booking-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" required maxLength={25} value={details.phone} onChange={changeDetails} className="field" placeholder="Your phone number" aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? 'booking-phone-error' : undefined} />
              {errors.phone && <p id="booking-phone-error" className="mt-2 text-xs text-gold" role="alert">{errors.phone}</p>}
            </div>
          </div>
          <div>
            <label htmlFor="booking-notes" className="mb-3 block text-xs text-paper/80">Notes <span className="text-muted">(optional)</span></label>
            <textarea id="booking-notes" name="notes" rows={3} maxLength={1500} value={details.notes} onChange={changeDetails} className="field resize-y" placeholder="Specific service or requirements" />
          </div>
        </fieldset>
        {errors.form && <p role="alert" className="border-l-2 border-gold pl-4 text-sm leading-7 text-paper">{errors.form}</p>}
        <button type="submit" disabled={submitting || !canSubmit} className="button-primary flex w-full gap-3 px-3 disabled:cursor-not-allowed disabled:opacity-50">{submitting ? 'Saving request…' : uncertain ? 'Check and retry request' : 'Request appointment'}<FiArrowUpRight aria-hidden="true" /></button>
        <p className="text-xs leading-6 text-muted">Your time is confirmed only after owner approval. After saving, send the request on WhatsApp.</p>
      </form>
    </div>
  )
}
