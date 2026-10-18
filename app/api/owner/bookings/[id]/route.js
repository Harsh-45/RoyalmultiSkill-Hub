import { decideBooking } from '@/lib/booking-store.mjs'
import { apiError, json, ownerAuthenticated, publicBooking, readJson, sameOrigin } from '@/lib/booking-api'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function PATCH(request, { params }) {
  if (!sameOrigin(request)) return json({ error: 'Please make changes from the owner dashboard.' }, 403)
  if (!ownerAuthenticated(request)) return json({ error: 'Please sign in to manage bookings.' }, 401)
  if (!/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(params.id)) return json({ error: 'Booking not found.' }, 404)
  try {
    const { action } = await readJson(request)
    if (!['approve', 'reject', 'cancel'].includes(action)) return json({ error: 'Choose approve, reject or cancel.' }, 400)
    return json({ booking: publicBooking(await decideBooking(params.id, action)) })
  } catch (error) {
    return apiError(error)
  }
}
