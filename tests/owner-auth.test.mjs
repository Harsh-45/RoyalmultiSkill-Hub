import test from 'node:test'
import assert from 'node:assert/strict'
import { randomBytes, scryptSync } from 'node:crypto'
import { ownerIsConfigured, passwordMatches, createOwnerSession, validOwnerSession, statusTokenHash, statusTokenMatches, SESSION_SECONDS } from '../lib/owner-auth.mjs'

const env = { OWNER_PASSWORD: 'test-password-very-long', OWNER_SESSION_SECRET: randomBytes(32).toString('hex') }

test('owner access fails closed until a strong password and signing secret are configured', () => {
  assert.equal(ownerIsConfigured({}), false)
  assert.equal(ownerIsConfigured({ ...env, OWNER_PASSWORD: 'short' }), false)
  assert.equal(passwordMatches(env.OWNER_PASSWORD, {}), false)
  assert.equal(passwordMatches(env.OWNER_PASSWORD, env), true)
  assert.equal(passwordMatches('wrong', env), false)
  const salt = randomBytes(16).toString('hex')
  const hashed = { OWNER_SESSION_SECRET: env.OWNER_SESSION_SECRET, OWNER_PASSWORD_HASH: `scrypt:${salt}:${scryptSync(env.OWNER_PASSWORD, salt, 64).toString('hex')}` }
  assert.equal(ownerIsConfigured(hashed), true)
  assert.equal(passwordMatches(env.OWNER_PASSWORD, hashed), true)
  assert.equal(passwordMatches('wrong', hashed), false)
})

test('sessions reject tampering, expiry, and credential rotation', () => {
  const now = Date.now()
  const session = createOwnerSession(env, now)
  assert.equal(validOwnerSession(session, env, now), true)
  assert.equal(validOwnerSession(`${session}x`, env, now), false)
  assert.equal(validOwnerSession(session, env, now + SESSION_SECONDS * 1000), false)
  assert.equal(validOwnerSession(session, { ...env, OWNER_SESSION_SECRET: 'different-secret-more-than-32-characters' }, now), false)
  assert.equal(validOwnerSession('bad.input.too-many', env, now), false)
})

test('status access needs the private token rather than a booking id', () => {
  const token = randomBytes(24).toString('hex')
  const hash = statusTokenHash(token)
  assert.equal(statusTokenMatches(token, hash), true)
  assert.equal(statusTokenMatches(randomBytes(24).toString('hex'), hash), false)
  assert.equal(statusTokenMatches('', hash), false)
})
