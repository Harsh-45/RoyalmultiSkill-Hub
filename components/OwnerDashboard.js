'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { FiArrowUpRight, FiLogOut, FiPhone, FiRefreshCw } from 'react-icons/fi'
import siteConfig from '@/config/site'
import { slotIsFuture, slotLabel, todayInIndia } from '@/lib/booking-shared.mjs'

const filters = [
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'all', label: 'All requests' },
]

const statusLabels = {
  pending: 'Pending approval',
  approved: 'Approved',
  rejected: 'Declined',
  cancelled: 'Cancelled',
  expired: 'Expired',
  unavailable: 'Time unavailable',
}

function formatDate(date) {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  }).format(new Date(`${date}T12:00:00+05:30`))
}

async function responseBody(response) {
  try {
    return await response.json()
  } catch {
    return { error: 'The server could not complete this request. Please try again.' }
  }
}

function customerWhatsApp(booking) {
  let phone = booking.phone.replace(/\D/g, '')
  if (phone.length === 10) phone = `91${phone}`
  const message = `Hi ${booking.name}, your ${booking.service} appointment at ${siteConfig.businessName} is approved for ${formatDate(booking.date)}, ${slotLabel(booking.hour)} (India time). Please contact us if your plans change.`
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}

function BookingCard({ booking, selected, busy, onAction }) {
  const [confirmCancel, setConfirmCancel] = useState(false)
  const future = slotIsFuture(booking.date, booking.hour)
  const pending = booking.status === 'pending'
  const approved = booking.status === 'approved'
  const status = statusLabels[booking.status] || booking.status

  return (
    <article
      id={`booking-${booking.id}`}
      tabIndex={-1}
      className={`surface min-w-0 scroll-mt-36 p-5 sm:p-7 ${selected ? 'border-gold ring-1 ring-gold/40' : ''}`}
      aria-label={`${booking.name}, ${formatDate(booking.date)}, ${slotLabel(booking.hour)}, ${status}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          {selected && <p className="eyebrow mb-3">Selected request</p>}
          <h2 className="break-words font-display text-3xl leading-tight">{booking.name}</h2>
          <p className="mt-2 break-words text-sm text-muted">{booking.service}</p>
        </div>
        <p className={`max-w-full border px-3 py-2 text-[10px] uppercase tracking-[0.12em] ${approved ? 'border-gold/50 text-gold' : pending ? 'border-paper/25 text-paper' : 'border-paper/15 text-muted'}`}>
          {status}
        </p>
      </div>

      <dl className="mt-6 grid gap-5 border-t border-paper/10 pt-5 sm:grid-cols-2">
        <div>
          <dt className="mb-2 text-[10px] uppercase tracking-[0.16em] text-muted">Date</dt>
          <dd className="text-sm">{formatDate(booking.date)}{booking.date === todayInIndia() ? ' · Today' : ''}</dd>
        </div>
        <div>
          <dt className="mb-2 text-[10px] uppercase tracking-[0.16em] text-muted">Time · India</dt>
          <dd className="text-sm">{slotLabel(booking.hour)}</dd>
        </div>
      </dl>

      <a href={`tel:${booking.phone.replace(/[^+\d]/g, '')}`} className="mt-4 inline-flex min-h-[44px] max-w-full items-center gap-3 text-sm text-gold hover:underline">
        <FiPhone aria-hidden="true" />
        <span className="break-all">{booking.phone}</span>
      </a>

      {booking.notes && <p className="mt-3 whitespace-pre-wrap break-words border-t border-paper/10 pt-4 text-sm leading-6 text-muted">{booking.notes}</p>}

      {pending && future && (
        <div className="mt-5 grid grid-cols-2 gap-3 border-t border-paper/10 pt-5">
          <button type="button" onClick={() => onAction(booking.id, 'approve')} disabled={busy} className="button-primary gap-2 px-3 disabled:cursor-wait disabled:opacity-50">Approve</button>
          <button type="button" onClick={() => onAction(booking.id, 'reject')} disabled={busy} className="button-outline gap-2 px-3 disabled:cursor-wait disabled:opacity-50">Reject</button>
        </div>
      )}

      {pending && !future && <p className="mt-4 border-t border-paper/10 pt-4 text-xs leading-5 text-muted">This appointment time has passed.</p>}

      {approved && (
        <div className="mt-5 space-y-4 border-t border-paper/10 pt-5">
          <a href={customerWhatsApp(booking)} target="_blank" rel="noopener noreferrer" className="button-outline flex w-full gap-3 px-3 text-center">
            Send confirmation <FiArrowUpRight aria-hidden="true" />
          </a>
          <p className="text-xs leading-5 text-muted">Opens WhatsApp. Review and send the message yourself.</p>
          {future && (confirmCancel ? (
            <div className="border border-gold/40 p-4" role="group" aria-label="Confirm booking cancellation">
              <p className="text-sm leading-6">Cancel this appointment and make the hour available again?</p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <button type="button" disabled={busy} onClick={() => onAction(booking.id, 'cancel')} className="min-h-[48px] border border-gold bg-gold px-3 py-3 text-xs font-semibold text-ink disabled:opacity-50">Yes, cancel</button>
                <button type="button" disabled={busy} onClick={() => setConfirmCancel(false)} className="min-h-[48px] border border-paper/25 px-3 py-3 text-xs disabled:opacity-50">Keep booking</button>
              </div>
            </div>
          ) : (
            <button type="button" disabled={busy} onClick={() => setConfirmCancel(true)} className="min-h-[44px] text-xs text-muted underline hover:text-paper disabled:opacity-50">Cancel booking</button>
          ))}
        </div>
      )}
    </article>
  )
}

function BookingList({ onExpired, onLogout, logoutBusy }) {
  const [filter, setFilter] = useState('pending')
  const [date, setDate] = useState('')
  const [selectedId, setSelectedId] = useState('')
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')
  const [notice, setNotice] = useState('')
  const [action, setAction] = useState('')
  const [refreshVersion, setRefreshVersion] = useState(0)
  const refreshRef = useRef(() => {})
  const abortRef = useRef(null)
  const actionRef = useRef(false)
  const scrolledRef = useRef(false)

  useEffect(() => {
    const selected = new URLSearchParams(window.location.search).get('booking') || ''
    if (selected) {
      setSelectedId(selected)
      setFilter('all')
    }
  }, [])

  useEffect(() => {
    let active = true
    let fetching = false
    setLoading(true)
    setError('')

    async function refresh(silent = false) {
      if (!active || fetching || actionRef.current || (silent && document.visibilityState !== 'visible')) return
      fetching = true
      setRefreshing(true)
      const controller = new AbortController()
      abortRef.current = controller

      try {
        const query = new URLSearchParams()
        if (date) query.set('date', date)
        if (filter === 'pending') query.set('status', 'pending')
        const response = await fetch(`/api/owner/bookings${query.size ? `?${query}` : ''}`, {
          credentials: 'same-origin',
          cache: 'no-store',
          signal: controller.signal,
        })
        const body = await responseBody(response)
        if (!active) return
        if (response.status === 401) return onExpired()
        if (!response.ok) throw new Error(body.error || 'Appointments could not be loaded.')
        setBookings(Array.isArray(body.bookings) ? body.bookings : [])
        setError('')
      } catch (failure) {
        if (active && failure.name !== 'AbortError') setError(failure.message || 'Appointments could not be loaded. Please try again.')
      } finally {
        fetching = false
        if (active) {
          setLoading(false)
          setRefreshing(false)
        }
      }
    }

    refreshRef.current = () => refresh()
    refresh()
    const interval = window.setInterval(() => refresh(true), 25000)
    const onVisible = () => {
      if (document.visibilityState === 'visible') refresh(true)
    }
    document.addEventListener('visibilitychange', onVisible)

    return () => {
      active = false
      window.clearInterval(interval)
      document.removeEventListener('visibilitychange', onVisible)
      abortRef.current?.abort()
    }
  }, [date, filter, onExpired, refreshVersion])

  useEffect(() => {
    if (!selectedId || loading || scrolledRef.current || !bookings.some(booking => booking.id === selectedId)) return
    const target = document.getElementById(`booking-${selectedId}`)
    if (target) {
      scrolledRef.current = true
      target.focus({ preventScroll: true })
      target.scrollIntoView({ block: 'center', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
    }
  }, [bookings, loading, selectedId])

  const handleAction = async (id, nextAction) => {
    if (actionRef.current) return
    actionRef.current = true
    abortRef.current?.abort()
    setAction(`${id}:${nextAction}`)
    setActionError('')
    setNotice('')

    try {
      const response = await fetch(`/api/owner/bookings/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: nextAction }),
      })
      const body = await responseBody(response)
      if (response.status === 401) return onExpired()
      if (!response.ok) throw new Error(body.error || 'This appointment could not be updated.')
      setNotice(nextAction === 'approve' ? 'Appointment approved. The hour is now blocked.' : nextAction === 'cancel' ? 'Appointment cancelled. The hour is available again.' : 'Request declined.')
    } catch (failure) {
      setActionError(failure.message || 'This appointment could not be updated. Please try again.')
    } finally {
      actionRef.current = false
      setAction('')
      setRefreshVersion(value => value + 1)
    }
  }

  const visibleBookings = bookings.filter(booking => filter === 'all' || booking.status === filter)

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-paper/15 pb-6">
        <div className="max-w-xl text-sm leading-6 text-muted">
          <p>Approve requests to reserve an hour across the studio.</p>
          <p className="mt-2 text-xs">Requests are deleted three days after the appointment ends.</p>
        </div>
        <button type="button" disabled={logoutBusy || Boolean(action)} onClick={onLogout} className="inline-flex min-h-[44px] items-center gap-3 text-xs text-muted hover:text-paper disabled:opacity-50"><FiLogOut aria-hidden="true" />{logoutBusy ? 'Signing out…' : 'Sign out'}</button>
      </div>

      <div className="mt-7 flex flex-wrap gap-2" role="group" aria-label="Booking status filter">
        {filters.map(item => (
          <button key={item.value} type="button" aria-pressed={filter === item.value} onClick={() => { setFilter(item.value); setNotice('') }} className={`filter-button px-4 ${filter === item.value ? 'is-active' : ''}`}>{item.label}</button>
        ))}
      </div>

      <div className="mb-7 mt-5 flex flex-wrap items-end gap-3">
        <div className="min-w-0 w-full sm:w-auto">
          <label htmlFor="owner-booking-date" className="mb-2 block text-xs text-muted">Filter by date</label>
          <input id="owner-booking-date" type="date" value={date} onChange={event => setDate(event.target.value)} className="field min-h-[48px] min-w-0 max-w-full sm:w-[210px]" />
        </div>
        {date && <button type="button" onClick={() => setDate('')} className="min-h-[48px] px-3 text-xs text-muted underline hover:text-paper">Clear date</button>}
        <button type="button" disabled={refreshing || Boolean(action)} onClick={() => refreshRef.current()} className="ml-auto inline-flex min-h-[48px] items-center gap-3 border border-paper/20 px-4 text-xs hover:border-gold disabled:cursor-wait disabled:opacity-50"><FiRefreshCw aria-hidden="true" />{refreshing ? 'Refreshing…' : 'Refresh'}</button>
      </div>

      {error && <p role="alert" className="mb-5 border border-gold/40 bg-gold/5 p-4 text-sm leading-6">{error}</p>}
      {actionError && <p role="alert" className="mb-5 border border-gold/40 bg-gold/5 p-4 text-sm leading-6">{actionError}</p>}
      {notice && <p role="status" className="mb-5 border border-gold/40 bg-gold/5 p-4 text-sm leading-6">{notice}</p>}
      {action && <p role="status" className="mb-5 text-sm text-gold">Updating appointment…</p>}

      {loading ? <p role="status" className="py-10 text-sm text-muted">Loading appointments…</p> : (
        <>
          <p className="mb-5 text-xs text-muted" aria-live="polite">{visibleBookings.length} {visibleBookings.length === 1 ? 'request' : 'requests'}{date ? ` · ${formatDate(date)}` : ''}</p>
          {visibleBookings.length ? (
            <div className="grid items-start gap-5 lg:grid-cols-2">
              {visibleBookings.map(booking => <BookingCard key={booking.id} booking={booking} selected={booking.id === selectedId} busy={Boolean(action)} onAction={handleAction} />)}
            </div>
          ) : (
            <div className="surface px-5 py-12 text-center"><p className="font-display text-3xl">{filter === 'pending' ? 'No pending requests' : 'No appointments found'}</p><p className="mt-3 text-sm leading-6 text-muted">{filter === 'pending' ? 'New requests appear here, even before a customer sends their WhatsApp message.' : 'Choose another date or filter to see more requests.'}</p></div>
          )}
          {selectedId && !bookings.some(booking => booking.id === selectedId) && filter === 'all' && !date && <p className="mt-5 text-sm leading-6 text-muted">The linked request is not in the current list. It may be older or no longer available.</p>}
        </>
      )}
      <p className="mt-7 text-xs leading-5 text-muted">Refreshes every 25 seconds while this page is visible. WhatsApp messages are sent manually.</p>
    </>
  )
}

export default function OwnerDashboard() {
  const [view, setView] = useState('checking')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [checkVersion, setCheckVersion] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    let active = true
    setView('checking')
    fetch('/api/owner/session', { credentials: 'same-origin', cache: 'no-store', signal: controller.signal })
      .then(async response => {
        const body = await responseBody(response)
        if (!active) return
        if (!response.ok) throw new Error(body.error || 'Owner access is temporarily unavailable.')
        setView(!body.configured ? 'setup' : body.authenticated ? 'authenticated' : 'login')
      })
      .catch(failure => {
        if (active && failure.name !== 'AbortError') {
          setError(failure.message || 'Owner access is temporarily unavailable.')
          setView('unavailable')
        }
      })
    return () => { active = false; controller.abort() }
  }, [checkVersion])

  const onExpired = useCallback(() => {
    setPassword('')
    setError('Your session has expired. Please sign in again.')
    setView('login')
  }, [])

  const handleLogin = async event => {
    event.preventDefault()
    if (busy) return
    setBusy(true)
    setError('')
    try {
      const response = await fetch('/api/owner/session', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) })
      const body = await responseBody(response)
      if (!response.ok) throw new Error(body.error || 'Sign-in failed. Please try again.')
      setPassword('')
      setView('authenticated')
    } catch (failure) {
      setError(failure.message || 'Sign-in failed. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  const handleLogout = async () => {
    setBusy(true)
    setError('')
    try {
      const response = await fetch('/api/owner/session', { method: 'DELETE', credentials: 'same-origin' })
      if (!response.ok && response.status !== 401) {
        const body = await responseBody(response)
        throw new Error(body.error || 'Sign-out failed. Please try again.')
      }
      setPassword('')
      setView('login')
    } catch (failure) {
      setError(failure.message || 'Sign-out failed. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="pb-20 pt-36 md:pt-44">
      <div className="studio-container max-w-[1100px]">
        <header className="mb-10">
          <p className="eyebrow mb-4">Royal Multiskill Hub · Owner access</p>
          <h1 className="font-display text-5xl leading-none tracking-[-0.03em] sm:text-6xl">Booking desk</h1>
        </header>

        {view === 'checking' && <p role="status" className="py-10 text-sm text-muted">Checking owner access…</p>}
        {view === 'setup' && <div className="surface max-w-xl p-6 sm:p-9"><h2 className="font-display text-3xl">Set up owner access</h2><p className="mt-4 text-sm leading-7 text-muted">Run <code className="break-words text-paper">npm run booking:setup</code> in the project folder to set up owner access.</p><button type="button" onClick={() => setCheckVersion(value => value + 1)} className="button-outline mt-6 px-4">Check again</button></div>}
        {view === 'unavailable' && <div className="surface max-w-xl p-6 sm:p-9"><p role="alert" className="text-sm leading-7">{error}</p><button type="button" onClick={() => setCheckVersion(value => value + 1)} className="button-outline mt-6 px-4">Try again</button></div>}
        {view === 'login' && (
          <div className="surface max-w-md p-6 sm:p-9">
            <h2 className="mb-6 font-display text-3xl">Owner sign in</h2>
            <form onSubmit={handleLogin} className="space-y-5">
              <div><label htmlFor="owner-password" className="mb-3 block text-xs text-muted">Password</label><input id="owner-password" name="password" type="password" autoComplete="current-password" required value={password} onChange={event => setPassword(event.target.value)} className="field" aria-describedby={error ? 'owner-login-error' : undefined} /></div>
              {error && <p id="owner-login-error" role="alert" className="text-sm leading-6 text-gold">{error}</p>}
              <button type="submit" disabled={busy || !password} className="button-primary w-full px-4 disabled:cursor-wait disabled:opacity-50">{busy ? 'Signing in…' : 'Sign in'}</button>
            </form>
          </div>
        )}
        {view === 'authenticated' && <>{error && <p role="alert" className="mb-5 border border-gold/40 p-4 text-sm leading-6">{error}</p>}<BookingList onExpired={onExpired} onLogout={handleLogout} logoutBusy={busy} /></>}
      </div>
    </div>
  )
}
