export const BOOKING_TIME_ZONE = 'Asia/Kolkata'
export const BOOKING_WINDOW_DAYS = 60
export const REQUEST_RETENTION_DAYS = 3
export const SLOT_HOURS = Object.freeze(Array.from({ length: 10 }, (_, index) => index + 10))

export function todayInIndia(now = Date.now()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: BOOKING_TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(new Date(now))
  const part = (type) => parts.find((item) => item.type === type).value
  return `${part('year')}-${part('month')}-${part('day')}`
}

export function lastBookingDate(now = Date.now()) {
  const last = new Date(`${todayInIndia(now)}T00:00:00Z`)
  last.setUTCDate(last.getUTCDate() + BOOKING_WINDOW_DAYS)
  return last.toISOString().slice(0, 10)
}

export function isCalendarDate(date) {
  if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return false
  const parsed = new Date(`${date}T00:00:00Z`)
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === date
}

export function isBookingDate(date, now = Date.now()) {
  return isCalendarDate(date) && date >= todayInIndia(now) && date <= lastBookingDate(now)
}

export function slotIsFuture(date, hour, now = Date.now()) {
  return isCalendarDate(date) && SLOT_HOURS.includes(hour) &&
    new Date(`${date}T${String(hour).padStart(2, '0')}:00:00+05:30`).getTime() > Number(now)
}

export function requestRetentionTime(date, hour) {
  if (!isCalendarDate(date) || !SLOT_HOURS.includes(hour)) return NaN
  const end = new Date(`${date}T${String(hour + 1).padStart(2, '0')}:00:00+05:30`).getTime()
  return end + REQUEST_RETENTION_DAYS * 24 * 60 * 60 * 1000
}

export function slotLabel(hour) {
  const format = (value) => `${value % 12 || 12}:00 ${value < 12 ? 'AM' : 'PM'}`
  return `${format(hour)} – ${format(hour + 1)}`
}

export function visibleBookingStatus(booking, now = Date.now()) {
  return booking.status === 'pending' && !slotIsFuture(booking.date, booking.hour, now)
    ? 'expired'
    : booking.status
}
