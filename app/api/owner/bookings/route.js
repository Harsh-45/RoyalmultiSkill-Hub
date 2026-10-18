import { listBookings } from '@/lib/booking-store.mjs'
import { isCalendarDate, todayInIndia, visibleBookingStatus } from '@/lib/booking-shared.mjs'
import { apiError, json, ownerAuthenticated } from '@/lib/booking-api'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request) {
  if (!ownerAuthenticated(request)) return json({ error: 'Please sign in to view bookings.' }, 401)
  const params = new URL(request.url).searchParams
  const date = params.get('date') || undefined
  const status = params.get('status') || undefined
  if (date && !isCalendarDate(date)) return json({ error: 'Choose a valid date.' }, 400)
  if (status && !['pending', 'approved', 'rejected', 'unavailable', 'cancelled'].includes(status)) return json({ error: 'Choose a valid booking status.' }, 400)
  try {
    const bookings = await listBookings({ date, status })
    return json({ today: todayInIndia(), bookings: bookings.map((booking) => ({
      id: booking.id, name: booking.name, phone: booking.phone, service: booking.service,
      date: booking.date, hour: booking.hour, notes: booking.notes,
      status: visibleBookingStatus(booking), createdAt: booking.createdAt, updatedAt: booking.updatedAt,
    })).sort((first, second) => first.date.localeCompare(second.date) || first.hour - second.hour || first.createdAt.localeCompare(second.createdAt)) })
  } catch (error) {
    return apiError(error)
  }
}
