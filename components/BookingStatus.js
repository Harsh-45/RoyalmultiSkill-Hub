'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { FiArrowUpRight, FiRefreshCw } from 'react-icons/fi'
import { slotLabel } from '@/lib/booking-shared.mjs'
import { saveVerifiedRequest, updateSavedRequest } from '@/lib/booking-history.mjs'

const statusCopy = {
  pending: { label: 'Pending approval', title: 'Awaiting the studio.', description: 'Your request is saved. The owner will review it before confirming your time.' },
  approved: { label: 'Approved', title: 'Your visit is confirmed.', description: 'The studio has reserved this time for you.' },
  rejected: { label: 'Declined', title: 'Please choose another time.', description: 'The studio could not accept this request. You can request another visit.' },
  unavailable: { label: 'Time unavailable', title: 'Please choose another time.', description: 'This time has been reserved for another appointment. You can request another visit.' },
  expired: { label: 'Request expired', title: 'This time has passed.', description: 'This request was not approved before the appointment time. Please choose a new time.' },
  cancelled: { label: 'Cancelled', title: 'This visit was cancelled.', description: 'The studio has cancelled this appointment. You can request another visit.' },
}

export default function BookingStatus() {
  const [credentials, setCredentials] = useState(null)
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [retry, setRetry] = useState(0)
  const [savedInBrowser, setSavedInBrowser] = useState(true)
  const savedOnce = useRef(false)

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('id')
    const token = new URLSearchParams(window.location.hash.slice(1)).get('token')
    if (!id || !token) {
      setError('Open the complete private status link provided after your request.')
      setLoading(false)
      return
    }
    setCredentials({ id, token })
  }, [])

  useEffect(() => {
    if (!credentials) return
    const controller = new AbortController()
    let active = true
    let busy = false

    async function refreshStatus() {
      if (!active || busy || document.visibilityState !== 'visible') return
      busy = true
      setLoading(true)
      try {
        const response = await fetch('/api/bookings/status', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(credentials),
          cache: 'no-store', signal: controller.signal,
        })
        const result = await response.json()
        if (!response.ok) throw new Error(result.error || 'Your booking status could not be loaded.')
        if (!result.booking) throw new Error('Your booking status could not be loaded.')
        if (active) {
          const stored = savedOnce.current
            ? updateSavedRequest(result.booking, credentials.token)
            : saveVerifiedRequest(result.booking, credentials.token)
          if (stored) savedOnce.current = true
          setSavedInBrowser(stored)
          setBooking(result.booking)
          setError('')
        }
      } catch (failure) {
        if (active && !controller.signal.aborted) setError(failure.message || 'Your booking status could not be loaded. Please try again.')
      } finally {
        busy = false
        if (active) setLoading(false)
      }
    }

    refreshStatus()
    const interval = window.setInterval(refreshStatus, 25000)
    window.addEventListener('focus', refreshStatus)
    document.addEventListener('visibilitychange', refreshStatus)
    return () => {
      active = false
      controller.abort()
      window.clearInterval(interval)
      window.removeEventListener('focus', refreshStatus)
      document.removeEventListener('visibilitychange', refreshStatus)
    }
  }, [credentials, retry])

  const copy = booking && statusCopy[booking.status]

  return (
    <div className="surface min-w-0 p-5 sm:p-9 lg:p-10">
      {booking && copy ? (
        <>
          <div role="status" aria-live="polite" aria-atomic="true">
            <span className="eyebrow mb-5">{copy.label}</span>
            <h2 className="font-display text-4xl sm:text-5xl">{copy.title}</h2>
            <p className="mt-4 text-sm leading-7 text-muted">{copy.description}</p>
          </div>
          <dl className="my-7 space-y-4 border-y border-paper/15 py-6 text-sm">
            <div className="flex flex-wrap justify-between gap-3"><dt className="text-muted">Service</dt><dd className="max-w-full break-words">{booking.service}</dd></div>
            <div className="flex flex-wrap justify-between gap-3"><dt className="text-muted">Date</dt><dd>{new Date(`${booking.date}T12:00:00+05:30`).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' })}</dd></div>
            <div className="flex flex-wrap justify-between gap-3"><dt className="text-muted">Time</dt><dd>{slotLabel(booking.hour)} <span className="text-muted">IST</span></dd></div>
          </dl>
        </>
      ) : loading ? <p role="status" className="text-sm leading-7 text-muted">Checking your booking…</p> : <h2 className="font-display text-3xl">Booking status unavailable</h2>}
      {error && <p role="alert" className="my-5 text-sm leading-7 text-muted">{booking ? `Could not refresh. Last known status shown. ${error}` : error}</p>}
      {credentials && <button type="button" disabled={loading} onClick={() => setRetry(value => value + 1)} className="mb-5 inline-flex min-h-[44px] items-center gap-3 text-xs text-gold disabled:opacity-50"><FiRefreshCw aria-hidden="true" />{loading ? 'Checking status…' : 'Refresh status'}</button>}
      {booking && <p className="mb-6 text-xs leading-6 text-muted">Updates automatically while this page is open. Keep this link private.</p>}
      {booking && !savedInBrowser && <p className="mb-5 text-xs leading-6 text-muted" role="status">This browser could not save your request. Keep this private status link to return later.</p>}
      <Link href="/my-requests" className="mb-4 inline-flex min-h-[44px] items-center gap-3 text-xs text-gold underline underline-offset-4">My requests <FiArrowUpRight aria-hidden="true" /></Link>
      <Link href="/book" className="button-outline flex w-full gap-3 px-3">{booking ? 'Request another visit' : 'Book a visit'}<FiArrowUpRight aria-hidden="true" /></Link>
    </div>
  )
}
