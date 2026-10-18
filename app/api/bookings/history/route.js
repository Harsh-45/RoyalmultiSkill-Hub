import { getBookingsByIds } from '@/lib/booking-store.mjs'
import { statusTokenMatches } from '@/lib/owner-auth.mjs'
import { apiError, json, publicBooking, rateAllowed, readJson, sameOrigin } from '@/lib/booking-api'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const uuid = /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i

export async function POST(request) {
  if (!sameOrigin(request)) return json({ error: 'Please check your saved requests on this website.' }, 403)
  if (!rateAllowed(request, 'history', 120)) return json({ error: 'Please wait a moment before checking again.' }, 429)
  try {
    const { requests } = await readJson(request)
    if (!Array.isArray(requests) || requests.length > 50 || requests.some(entry =>
      !entry || typeof entry !== 'object' || Array.isArray(entry) ||
      typeof entry.id !== 'string' || !uuid.test(entry.id) ||
      typeof entry.token !== 'string' || !uuid.test(entry.token))) {
      return json({ error: 'Please use the private links saved in this browser.' }, 400)
    }
    const bookings = await getBookingsByIds(requests.map(entry => entry.id.toLowerCase()))
    const references = new Map()
    for (const { id, token } of requests) {
      const key = id.toLowerCase()
      if (!references.has(key)) references.set(key, new Set())
      references.get(key).add(token)
    }
    return json({ bookings: bookings.filter(booking =>
      [...(references.get(booking.id) || [])].some(token => statusTokenMatches(token, booking.statusTokenHash))
    ).map(publicBooking) })
  } catch (error) {
    return apiError(error)
  }
}
