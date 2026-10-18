import { NextResponse } from 'next/server'
import { createHash } from 'node:crypto'
import { OWNER_COOKIE, validOwnerSession } from './owner-auth.mjs'
import { visibleBookingStatus } from './booking-shared.mjs'

export function json(data, status = 200) {
  return NextResponse.json(data, { status, headers: {
    'Cache-Control': 'no-store, private', 'Referrer-Policy': 'no-referrer',
    'X-Content-Type-Options': 'nosniff',
  } })
}

export function ownerAuthenticated(request) {
  return validOwnerSession(request.cookies.get(OWNER_COOKIE)?.value)
}

export function sameOrigin(request) {
  const origin = request.headers.get('origin')
  if (!origin) return false
  try {
    const expected = process.env.APP_URL ? new URL(process.env.APP_URL).origin : new URL(request.url).origin
    return new URL(origin).origin === expected
  } catch {
    return false
  }
}

export function publicBooking(booking) {
  return {
    id: booking.id, date: booking.date, hour: booking.hour,
    service: booking.service, status: visibleBookingStatus(booking),
  }
}

export async function readJson(request) {
  if (!request.headers.get('content-type')?.startsWith('application/json')) {
    throw Object.assign(new Error('Please send a JSON request.'), { status: 415 })
  }
  const reader = request.body?.getReader()
  if (!reader) throw Object.assign(new Error('Please complete the form.'), { status: 400 })
  const chunks = []
  let size = 0
  while (true) {
    const { value, done } = await reader.read()
    if (done) break
    size += value.byteLength
    if (size > 8192) {
      await reader.cancel()
      throw Object.assign(new Error('The request is too large.'), { status: 413 })
    }
    chunks.push(value)
  }
  try {
    const parsed = JSON.parse(Buffer.concat(chunks).toString('utf8'))
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error()
    return parsed
  } catch {
    throw Object.assign(new Error('Please send a valid request.'), { status: 400 })
  }
}

// Best-effort burst protection per server process. Database constraints remain authoritative.
const rateKey = Symbol.for('royal.booking.rateLimits')
export function rateAllowed(request, scope, limit = 15, windowMs = 10 * 60 * 1000, identifier = '') {
  const rates = globalThis[rateKey] ||= new Map()
  const now = Date.now()
  for (const [key, item] of rates) if (item.until <= now) rates.delete(key)
  if (rates.size > 10000) return false
  const address = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local'
  const digest = createHash('sha256').update(`${scope}:${address}:${identifier}`).digest('hex')
  const current = rates.get(digest) || { count: 0, until: now + windowMs }
  current.count++
  rates.set(digest, current)
  return current.count <= limit
}

export function apiError(error) {
  if (error.status && error.status >= 400 && error.status < 500) return json({ error: error.message }, error.status)
  if (error.code === 'NOT_FOUND') return json({ error: 'Booking not found.' }, 404)
  if (error.code === 'INVALID_BOOKING') return json({ error: error.message || 'Please check your booking details.' }, 400)
  if (error.code === 'SLOT_TAKEN') return json({ error: 'This time has just been booked. Please choose another slot.' }, 409)
  if (error.code === 'INVALID_TRANSITION') return json({ error: error.message || 'This booking can no longer be changed that way.' }, 409)
  // Never send database errors or customer details to clients or logs.
  console.error('Booking service unavailable:', error.code || error.name || 'Unknown error')
  return json({ error: 'Bookings are temporarily unavailable. Please contact the studio on WhatsApp.' }, 503)
}
