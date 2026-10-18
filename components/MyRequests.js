'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FiArrowUpRight, FiRefreshCw } from 'react-icons/fi'
import { readSavedRequests, removeSavedRequest, requestStatusUrl, updateSavedRequest } from '@/lib/booking-history.mjs'
import { requestRetentionTime, slotLabel } from '@/lib/booking-shared.mjs'

const statusLabels = {
  pending: 'Pending approval',
  approved: 'Approved',
  rejected: 'Declined',
  unavailable: 'Time unavailable',
  expired: 'Expired',
  cancelled: 'Cancelled',
}

function displayDate(date) {
  return new Date(`${date}T12:00:00+05:30`).toLocaleDateString('en-IN', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata',
  })
}

function retainedRequests(requests) {
  return requests.filter(entry => requestRetentionTime(entry.date, entry.hour) > Date.now())
}

export default function MyRequests() {
  const [saved, setSaved] = useState({ available: null, requests: [] })
  const [verifiedIds, setVerifiedIds] = useState([])
  const [checked, setChecked] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [storageWarning, setStorageWarning] = useState(false)
  const [removeId, setRemoveId] = useState(null)
  const [removeError, setRemoveError] = useState('')
  const [retry, setRetry] = useState(0)

  useEffect(() => {
    const reloadSaved = () => {
      const latest = readSavedRequests()
      setSaved(previous => latest.available ? latest : { ...latest, requests: retainedRequests(previous.requests) })
      if (!latest.available) setStorageWarning(true)
      setChecked(false)
      setVerifiedIds([])
    }
    reloadSaved()
    const retentionInterval = window.setInterval(() => {
      const latest = readSavedRequests()
      setSaved(previous => latest.available ? latest : { ...latest, requests: retainedRequests(previous.requests) })
    }, 30000)
    window.addEventListener('storage', reloadSaved)
    window.addEventListener('focus', reloadSaved)
    return () => {
      window.clearInterval(retentionInterval)
      window.removeEventListener('storage', reloadSaved)
      window.removeEventListener('focus', reloadSaved)
    }
  }, [])

  const signature = JSON.stringify(saved.requests.map(({ id, token }) => ({ id, token })))

  useEffect(() => {
    const requests = JSON.parse(signature)
    if (!requests.length) {
      setLoading(false)
      setError('')
      setChecked(false)
      setVerifiedIds([])
      return
    }
    const controller = new AbortController()
    let active = true
    let busy = false
    const tokens = new Map(requests.map(entry => [entry.id, entry.token]))

    async function refreshRequests() {
      if (!active || busy || document.visibilityState !== 'visible') return
      busy = true
      setLoading(true)
      try {
        const response = await fetch('/api/bookings/history', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ requests }), cache: 'no-store', signal: controller.signal,
        })
        const result = await response.json()
        if (!response.ok) throw new Error(result.error || 'Could not refresh your requests.')
        if (!Array.isArray(result.bookings)) throw new Error('Could not refresh your requests.')
        if (!active || controller.signal.aborted) return
        // A response may arrive after another tab removed a saved link. Only
        // update links still present, and never recreate them while polling.
        const beforeUpdate = readSavedRequests()
        // When storage is temporarily blocked, retain the references already in
        // memory so successful server checks can still update their statuses.
        const currentTokens = beforeUpdate.available
          ? new Map(beforeUpdate.requests.map(entry => [entry.id, entry.token]))
          : tokens
        const bookings = result.bookings.filter(booking => tokens.has(booking.id) && currentTokens.get(booking.id) === tokens.get(booking.id))
        let couldSave = beforeUpdate.available
        bookings.forEach(booking => {
          if (!updateSavedRequest(booking, tokens.get(booking.id))) couldSave = false
        })
        const latestSaved = readSavedRequests()
        // Also show verified updates when browser storage becomes unavailable.
        const verified = new Map(bookings.map(booking => [booking.id, booking]))
        setSaved(previous => ({ ...latestSaved, requests: retainedRequests(latestSaved.available ? latestSaved.requests : previous.requests).map(entry => ({ ...entry, ...(verified.get(entry.id) || {}), token: entry.token })) }))
        setStorageWarning(!couldSave || !latestSaved.available)
        setVerifiedIds(bookings.map(booking => booking.id))
        setChecked(true)
        setError('')
      } catch (failure) {
        if (active && !controller.signal.aborted) setError(failure.message || 'Could not refresh your requests.')
      } finally {
        busy = false
        if (active) setLoading(false)
      }
    }

    refreshRequests()
    const interval = window.setInterval(refreshRequests, 30000)
    window.addEventListener('focus', refreshRequests)
    document.addEventListener('visibilitychange', refreshRequests)
    return () => {
      active = false
      controller.abort()
      window.clearInterval(interval)
      window.removeEventListener('focus', refreshRequests)
      document.removeEventListener('visibilitychange', refreshRequests)
    }
  }, [signature, retry])

  function confirmRemove(id) {
    if (!removeSavedRequest(id)) {
      setRemoveError('This browser could not remove the saved link. Please try again.')
      return
    }
    const latest = readSavedRequests()
    setSaved(previous => latest.available ? latest : { ...latest, requests: previous.requests.filter(entry => entry.id !== id) })
    if (!latest.available) setStorageWarning(true)
    setRemoveId(null)
    setRemoveError('')
  }

  if (saved.available === null) return <p className="text-sm text-muted" role="status">Loading saved requests…</p>

  if (!saved.available && !saved.requests.length) {
    return (
      <div className="surface p-5 sm:p-9">
        <h2 className="font-display text-3xl">Browser storage is unavailable.</h2>
        <p className="my-5 max-w-xl text-sm leading-7 text-muted">Open the private status link provided after booking to check your request. Keep that link for future visits.</p>
        <Link href="/book" className="button-outline gap-3 px-4">Book a visit <FiArrowUpRight aria-hidden="true" /></Link>
      </div>
    )
  }

  if (!saved.requests.length) {
    return (
      <div className="surface p-5 sm:p-9">
        <h2 className="font-display text-3xl sm:text-4xl">No saved requests yet.</h2>
        <p className="my-5 max-w-xl text-sm leading-7 text-muted">Requests you make in this browser will appear here. To add an earlier request, open its private status link.</p>
        <Link href="/book" className="button-primary gap-3 px-4">Book a visit <FiArrowUpRight aria-hidden="true" /></Link>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
        <p className="text-xs leading-6 text-muted">{saved.requests.length} saved {saved.requests.length === 1 ? 'request' : 'requests'} · All times in India</p>
        <button type="button" onClick={() => setRetry(value => value + 1)} disabled={loading} className="inline-flex min-h-[44px] items-center gap-3 text-xs text-gold disabled:opacity-50"><FiRefreshCw aria-hidden="true" />{loading ? 'Checking requests…' : 'Refresh requests'}</button>
      </div>
      {error && <p role="alert" className="mb-6 border-l-2 border-gold pl-4 text-sm leading-7 text-muted">{error} Last known statuses are shown below.</p>}
      {storageWarning && <p role="status" className="mb-6 text-xs leading-6 text-muted">This browser could not save the latest updates. Keep each private status link to return later.</p>}
      <div className="grid min-w-0 gap-5 md:grid-cols-2">
        {saved.requests.map(entry => {
          const verified = checked && verifiedIds.includes(entry.id)
          return (
            <article key={entry.id} className="surface min-w-0 p-5 sm:p-7">
              <span className={`mb-5 inline-block border px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.13em] ${entry.status === 'approved' ? 'border-gold bg-gold text-ink' : 'border-paper/20 text-gold'}`}>{statusLabels[entry.status] || 'Status unavailable'}</span>
              <h2 className="break-words font-display text-3xl sm:text-4xl">{entry.service}</h2>
              <dl className="my-6 space-y-3 text-sm">
                <div className="flex flex-wrap justify-between gap-3"><dt className="text-muted">Date</dt><dd>{displayDate(entry.date)}</dd></div>
                <div className="flex flex-wrap justify-between gap-3"><dt className="text-muted">Time</dt><dd>{slotLabel(entry.hour)}</dd></div>
              </dl>
              {(!verified || error || loading) && <p className="mb-4 text-xs leading-6 text-muted">{loading ? 'Last known status. Checking for updates…' : checked && !verified ? 'Last saved status. Open the private link to verify this request.' : 'Last known status. Check for the latest update.'}</p>}
              <Link href={requestStatusUrl(entry)} prefetch={false} className="button-outline flex w-full gap-3 px-3">View status <FiArrowUpRight aria-hidden="true" /></Link>
              {removeId === entry.id ? (
                <div className="mt-4 border-t border-paper/15 pt-4">
                  <p className="text-xs leading-6 text-muted">Remove this saved link from this browser? This does not cancel the booking.</p>
                  <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
                    <button type="button" onClick={() => confirmRemove(entry.id)} className="min-h-[44px] text-xs text-gold underline underline-offset-4">Remove saved link</button>
                    <button type="button" onClick={() => { setRemoveId(null); setRemoveError('') }} className="min-h-[44px] text-xs text-paper">Keep link</button>
                  </div>
                  {removeError && <p role="alert" className="mt-2 text-xs leading-6 text-muted">{removeError}</p>}
                </div>
              ) : <button type="button" onClick={() => { setRemoveId(entry.id); setRemoveError('') }} className="mt-3 min-h-[44px] text-xs text-muted underline underline-offset-4">Remove saved link</button>}
            </article>
          )
        })}
      </div>
      <p className="mt-7 text-xs leading-6 text-muted">Saved in this browser only. Requests are deleted three days after the appointment ends. Clearing browser data removes saved links.</p>
      <Link href="/book" className="button-primary mt-7 gap-3 px-4">Request another visit <FiArrowUpRight aria-hidden="true" /></Link>
    </div>
  )
}
