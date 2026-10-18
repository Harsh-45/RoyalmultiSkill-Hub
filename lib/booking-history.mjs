import { isCalendarDate, requestRetentionTime } from './booking-shared.mjs'

export const BOOKING_HISTORY_KEY = 'royal.booking.requests.v1'
export const MAX_SAVED_REQUESTS = 50

const uuid = /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i
const statuses = new Set(['pending', 'approved', 'rejected', 'unavailable', 'expired', 'cancelled'])

function browserStorage(storage) {
  if (storage !== undefined) return storage
  return typeof window === 'undefined' ? null : window.localStorage
}

function safeRequest(booking, token, savedAt) {
  if (!booking || typeof booking !== 'object' || Array.isArray(booking) ||
    typeof booking.id !== 'string' || !uuid.test(booking.id) ||
    typeof token !== 'string' || !uuid.test(token) ||
    typeof booking.service !== 'string' || booking.service.trim().length < 2 || booking.service.length > 160 ||
    /[\p{Cc}\p{Zl}\p{Zp}]/u.test(booking.service) || !isCalendarDate(booking.date) ||
    !Number.isInteger(booking.hour) || booking.hour < 10 || booking.hour > 19 ||
    !statuses.has(booking.status) || !Number.isSafeInteger(savedAt) || savedAt < 0) return null
  // Persist only the private reference and public status fields, never contact details.
  return {
    id: booking.id.toLowerCase(), token, service: booking.service,
    date: booking.date, hour: booking.hour, status: booking.status, savedAt,
  }
}

export function readSavedRequests(storage) {
  try {
    const target = browserStorage(storage)
    if (!target) return { available: false, requests: [] }
    const contents = target.getItem(BOOKING_HISTORY_KEY)
    if (!contents) return { available: true, requests: [] }
    let data
    try { data = JSON.parse(contents) } catch { return { available: true, requests: [] } }
    if (data?.version !== 1 || !Array.isArray(data.requests)) return { available: true, requests: [] }
    const seen = new Set()
    const valid = data.requests.map(entry => safeRequest(entry, entry?.token, entry?.savedAt)).filter(Boolean)
    const retained = valid.filter(entry => requestRetentionTime(entry.date, entry.hour) > Date.now())
    const requests = retained.sort((a, b) => b.savedAt - a.savedAt)
      .filter(entry => {
        if (seen.has(entry.id)) return false
        seen.add(entry.id)
        return true
      }).slice(0, MAX_SAVED_REQUESTS)
    if (retained.length < valid.length) {
      // Remove expired private references when the browser is next opened.
      try { writeRequests(target, requests) } catch { /* Still hide expired entries if writes are blocked. */ }
    }
    return { available: true, requests }
  } catch {
    return { available: false, requests: [] }
  }
}

function writeRequests(storage, requests) {
  storage.setItem(BOOKING_HISTORY_KEY, JSON.stringify({ version: 1, requests }))
}

function saveRequest(booking, token, storage, onlyExisting) {
  try {
    const target = browserStorage(storage)
    const current = readSavedRequests(target)
    if (!current.available) return false
    const previous = current.requests.find(entry => entry.id === booking?.id?.toLowerCase())
    const next = safeRequest(booking, token, previous?.savedAt ?? Date.now())
    if (!next) return false
    if (requestRetentionTime(next.date, next.hour) <= Date.now()) return true
    // Background status refreshes must never recreate a link removed elsewhere.
    if (onlyExisting && (!previous || previous.token !== token)) return true
    const requests = previous
      ? current.requests.map(entry => entry.id === next.id ? next : entry)
      : [next, ...current.requests].slice(0, MAX_SAVED_REQUESTS)
    writeRequests(target, requests)
    return true
  } catch {
    return false
  }
}

export function saveVerifiedRequest(booking, token, storage) {
  return saveRequest(booking, token, storage, false)
}

export function updateSavedRequest(booking, token, storage) {
  return saveRequest(booking, token, storage, true)
}

export function saveBookingRequest(booking, statusUrl, storage) {
  try {
    // Booking responses use relative links. Reject external and unexpected URLs.
    if (typeof statusUrl !== 'string' || !statusUrl.startsWith('/booking-status?') || statusUrl.length > 256) return false
    const url = new URL(statusUrl, 'https://saved-requests.invalid')
    const hash = new URLSearchParams(url.hash.slice(1))
    if (url.origin !== 'https://saved-requests.invalid' || url.pathname !== '/booking-status' ||
      [...url.searchParams.keys()].join() !== 'id' || [...hash.keys()].join() !== 'token' ||
      url.searchParams.get('id') !== booking?.id) return false
    return saveVerifiedRequest(booking, hash.get('token'), storage)
  } catch {
    return false
  }
}

export function requestStatusUrl(entry) {
  const safe = safeRequest(entry, entry?.token, entry?.savedAt)
  return safe ? `/booking-status?id=${safe.id}#token=${encodeURIComponent(safe.token)}` : ''
}

export function removeSavedRequest(id, storage) {
  try {
    if (typeof id !== 'string' || !uuid.test(id)) return false
    const target = browserStorage(storage)
    const current = readSavedRequests(target)
    if (!current.available) return false
    writeRequests(target, current.requests.filter(entry => entry.id !== id.toLowerCase()))
    return true
  } catch {
    return false
  }
}
