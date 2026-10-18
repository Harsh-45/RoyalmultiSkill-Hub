import { randomUUID } from 'node:crypto'
import { servicesData } from '@/data/services'
import siteConfig from '@/config/site'
import { createBooking } from '@/lib/booking-store.mjs'
import { isBookingDate, slotIsFuture, slotLabel } from '@/lib/booking-shared.mjs'
import { statusTokenHash, statusTokenMatches } from '@/lib/owner-auth.mjs'
import { apiError, json, publicBooking, rateAllowed, readJson, sameOrigin } from '@/lib/booking-api'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const services = Object.values(servicesData).map((category) => category.title)
const uuid = /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i

export async function POST(request) {
  if (!sameOrigin(request)) return json({ error: 'Please submit your request from this website.' }, 403)
  if (!rateAllowed(request, 'request', 20)) return json({ error: 'Too many requests. Please try again in a few minutes.' }, 429)
  try {
    const body = await readJson(request)
    const name = typeof body.name === 'string' ? body.name.trim() : ''
    const phone = typeof body.phone === 'string' ? body.phone.trim() : ''
    const notes = typeof body.notes === 'string' ? body.notes.trim() : ''
    const errors = {}
    if (!name || name.length > 100 || /[\x00-\x1f]/.test(name)) errors.name = 'Enter your name (up to 100 characters).'
    if (!/^[+\d\s()-]{7,25}$/.test(phone) || !/^\d{7,15}$/.test(phone.replace(/\D/g, ''))) errors.phone = 'Enter a valid phone number.'
    if (!services.includes(body.service)) errors.service = 'Select a service.'
    if (!isBookingDate(body.date)) errors.date = 'Choose a date within the next 60 days.'
    if (!Number.isInteger(body.hour) || !slotIsFuture(body.date, body.hour)) errors.hour = 'Select an upcoming appointment time.'
    if (notes.length > 1500) errors.notes = 'Keep your notes within 1500 characters.'
    if (typeof body.requestKey !== 'string' || typeof body.statusToken !== 'string' ||
      !uuid.test(body.requestKey) || !uuid.test(body.statusToken)) return json({ error: 'Please refresh this page and try again.' }, 400)
    if (Object.keys(errors).length) return json({ error: 'Please check your booking details.', errors }, 400)

    const timestamp = new Date().toISOString()
    const saved = await createBooking({
      id: randomUUID(), requestKey: body.requestKey, statusTokenHash: statusTokenHash(body.statusToken),
      name, phone, service: body.service, date: body.date, hour: body.hour, notes,
      status: 'pending', createdAt: timestamp, updatedAt: timestamp,
    })
    // An idempotency key must never allow someone to retrieve another customer's tracking link.
    if (!statusTokenMatches(body.statusToken, saved.statusTokenHash)) return json({ error: 'Please start a new booking request.' }, 409)
    const origin = process.env.APP_URL ? new URL(process.env.APP_URL).origin : new URL(request.url).origin
    const statusUrl = `/booking-status?id=${saved.id}#token=${encodeURIComponent(body.statusToken)}`
    const dateLabel = new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeZone: 'Asia/Kolkata' }).format(new Date(`${saved.date}T12:00:00+05:30`))
    const message = [
      `New booking request — ${siteConfig.businessName}`,
      `Name: ${saved.name}`, `Phone: ${saved.phone}`, `Service: ${saved.service}`,
      `Date: ${dateLabel}`, `Time: ${slotLabel(saved.hour)} (IST)`,
      ...(saved.notes ? [`Notes: ${saved.notes}`] : []),
      `Booking reference: ${saved.id}`, `Owner approval: ${origin}/owner?booking=${saved.id}`,
      'Awaiting your approval.',
    ].join('\n')
    return json({ booking: publicBooking(saved), whatsappUrl: siteConfig.whatsapp.getUrl(message), statusUrl }, 201)
  } catch (error) {
    return apiError(error)
  }
}
