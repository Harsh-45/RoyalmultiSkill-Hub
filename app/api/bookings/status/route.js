import { getBooking } from '@/lib/booking-store.mjs'
import { statusTokenMatches } from '@/lib/owner-auth.mjs'
import { apiError, json, publicBooking, rateAllowed, readJson, sameOrigin } from '@/lib/booking-api'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request) {
  if (!sameOrigin(request)) return json({ error: 'Please open your private booking link on this website.' }, 403)
  if (!rateAllowed(request, 'status', 120)) return json({ error: 'Please wait a moment before checking again.' }, 429)
  try {
    const { id, token } = await readJson(request)
    if (typeof id !== 'string' || !/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(id) || typeof token !== 'string' || token.length > 128) {
      return json({ error: 'This private booking link is not valid.' }, 404)
    }
    const booking = await getBooking(id)
    if (!booking || !statusTokenMatches(token, booking.statusTokenHash)) return json({ error: 'This private booking link is not valid.' }, 404)
    return json({ booking: publicBooking(booking) })
  } catch (error) {
    return apiError(error)
  }
}
