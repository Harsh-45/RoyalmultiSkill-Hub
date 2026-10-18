import { createHash, createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'

export const OWNER_COOKIE = 'royal_owner_session'
export const SESSION_SECONDS = 8 * 60 * 60

function equal(first, second) {
  return timingSafeEqual(createHash('sha256').update(first).digest(), createHash('sha256').update(second).digest())
}

export function ownerIsConfigured(env = process.env) {
  return Boolean(env.OWNER_SESSION_SECRET?.length >= 32 && (
    env.OWNER_PASSWORD?.length >= 12 || /^scrypt:[a-f0-9]{32}:[a-f0-9]{128}$/.test(env.OWNER_PASSWORD_HASH || '')
  ))
}

export function passwordMatches(password, env = process.env) {
  if (!ownerIsConfigured(env) || typeof password !== 'string' || password.length > 256) return false
  if (env.OWNER_PASSWORD_HASH) {
    const [, salt, hash] = env.OWNER_PASSWORD_HASH.split(':')
    if (!salt || !hash) return false
    return equal(scryptSync(password, salt, 64).toString('hex'), hash)
  }
  return equal(password, env.OWNER_PASSWORD)
}

export function createOwnerSession(env = process.env, now = Date.now()) {
  if (!ownerIsConfigured(env)) throw new Error('Owner access is not configured.')
  const payload = Buffer.from(JSON.stringify({
    expires: Math.floor(now / 1000) + SESSION_SECONDS,
    nonce: randomBytes(16).toString('hex'),
  })).toString('base64url')
  const signature = createHmac('sha256', env.OWNER_SESSION_SECRET).update(payload).digest('base64url')
  return `${payload}.${signature}`
}

export function validOwnerSession(cookie, env = process.env, now = Date.now()) {
  if (!ownerIsConfigured(env) || typeof cookie !== 'string' || cookie.length > 1024) return false
  const [payload, signature, extra] = cookie.split('.')
  if (!payload || !signature || extra) return false
  const expected = createHmac('sha256', env.OWNER_SESSION_SECRET).update(payload).digest('base64url')
  if (!equal(expected, signature)) return false
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString())
    return Number.isSafeInteger(data.expires) && data.expires > Math.floor(now / 1000) &&
      data.expires <= Math.floor(now / 1000) + SESSION_SECONDS
  } catch {
    return false
  }
}

export function statusTokenHash(token) {
  return createHash('sha256').update(token).digest('hex')
}

export function statusTokenMatches(token, hash) {
  return typeof token === 'string' && token.length >= 32 && token.length <= 128 &&
    typeof hash === 'string' && equal(statusTokenHash(token), hash)
}
