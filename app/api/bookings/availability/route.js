import { getApprovedHours } from '@/lib/booking-store.mjs'
import { isBookingDate, SLOT_HOURS, slotIsFuture, slotLabel, todayInIndia, lastBookingDate } from '@/lib/booking-shared.mjs'
import { apiError, json } from '@/lib/booking-api'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request) {
  const date = new URL(request.url).searchParams.get('date') || todayInIndia()
  if (!isBookingDate(date)) return json({ error: 'Choose a date within the next 60 days.' }, 400)
  try {
    const approved = new Set(await getApprovedHours(date))
    return json({ date, today: todayInIndia(), maxDate: lastBookingDate(), slots: SLOT_HOURS.map((hour) => ({
      hour, label: slotLabel(hour), available: slotIsFuture(date, hour) && !approved.has(hour),
    })) })
  } catch (error) {
    return apiError(error)
  }
}
