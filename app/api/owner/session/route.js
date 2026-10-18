import { OWNER_COOKIE, SESSION_SECONDS, createOwnerSession, ownerIsConfigured, passwordMatches } from '@/lib/owner-auth.mjs'
import { apiError, json, ownerAuthenticated, rateAllowed, readJson, sameOrigin } from '@/lib/booking-api'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const cookieOptions = { httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production', path: '/api/owner' }

export async function GET(request) {
  return json({ authenticated: ownerAuthenticated(request), configured: ownerIsConfigured() })
}

export async function POST(request) {
  if (!sameOrigin(request)) return json({ error: 'Please sign in from this website.' }, 403)
  if (!ownerIsConfigured()) return json({ error: 'Owner access has not been set up yet.' }, 503)
  if (!rateAllowed(request, 'login', 8)) return json({ error: 'Too many sign-in attempts. Please try again in ten minutes.' }, 429)
  try {
    const { password } = await readJson(request)
    if (!passwordMatches(password)) return json({ error: 'Incorrect password.' }, 401)
    const response = json({ authenticated: true })
    response.cookies.set(OWNER_COOKIE, createOwnerSession(), { ...cookieOptions, maxAge: SESSION_SECONDS })
    return response
  } catch (error) {
    return apiError(error)
  }
}

export async function DELETE(request) {
  if (!sameOrigin(request)) return json({ error: 'Please sign out from this website.' }, 403)
  const response = json({ authenticated: false })
  response.cookies.set(OWNER_COOKIE, '', { ...cookieOptions, maxAge: 0 })
  return response
}
