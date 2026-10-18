import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { mock, test } from 'node:test'
import {
  BOOKING_HISTORY_KEY, MAX_SAVED_REQUESTS, readSavedRequests, removeSavedRequest,
  requestStatusUrl, saveBookingRequest, saveVerifiedRequest, updateSavedRequest,
} from '../lib/booking-history.mjs'

function storage() {
  const values = new Map()
  return { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) }
}

function booking(overrides = {}) {
  return { id: randomUUID(), service: 'Piercing', date: '2099-12-01', hour: 10, status: 'pending', ...overrides }
}

test('saved capability links survive reload while customer details never enter browser history', () => {
  const target = storage()
  const entry = booking({ name: 'Private name', phone: '9876543210', notes: 'Private notes', statusTokenHash: 'secret hash' })
  const token = randomUUID()
  const url = `/booking-status?id=${entry.id}#token=${token}`
  assert.equal(saveBookingRequest(entry, url, target), true)
  const [saved] = readSavedRequests(target).requests
  assert.equal(requestStatusUrl(saved), url)
  assert.deepEqual(Object.keys(saved).sort(), ['date', 'hour', 'id', 'savedAt', 'service', 'status', 'token'])
  const raw = target.getItem(BOOKING_HISTORY_KEY)
  for (const privateValue of ['Private name', '9876543210', 'Private notes', 'secret hash']) assert.equal(raw.includes(privateValue), false)
})

test('refresh updates the existing entry without changing its saved time or position', () => {
  const target = storage()
  const first = booking()
  const second = booking()
  const token = randomUUID()
  saveVerifiedRequest(first, token, target)
  saveVerifiedRequest(second, randomUUID(), target)
  const before = readSavedRequests(target).requests
  assert.equal(updateSavedRequest({ ...first, status: 'approved' }, token, target), true)
  const after = readSavedRequests(target).requests
  assert.deepEqual(after.map(entry => entry.id), before.map(entry => entry.id))
  assert.equal(after.find(entry => entry.id === first.id).savedAt, before.find(entry => entry.id === first.id).savedAt)
  assert.equal(after.find(entry => entry.id === first.id).status, 'approved')
  saveVerifiedRequest({ ...first, status: 'cancelled' }, token, target)
  assert.equal(readSavedRequests(target).requests.length, 2)
})

test('only 50 most recent references are retained, and duplicate IDs are sanitized', () => {
  const target = storage()
  const entries = Array.from({ length: MAX_SAVED_REQUESTS + 2 }, () => booking())
  for (const entry of entries) saveVerifiedRequest(entry, randomUUID(), target)
  const saved = readSavedRequests(target).requests
  assert.equal(saved.length, MAX_SAVED_REQUESTS)
  assert.equal(saved[0].id, entries.at(-1).id)
  assert.equal(saved.some(entry => entry.id === entries[0].id), false)
  target.setItem(BOOKING_HISTORY_KEY, JSON.stringify({ version: 1, requests: [...saved, saved[0], { ...saved[0], id: 'injected' }] }))
  assert.deepEqual(readSavedRequests(target).requests, saved)
})

test('corrupt storage recovers and blocked or full storage fails without throwing', () => {
  const target = storage()
  target.setItem(BOOKING_HISTORY_KEY, '{broken')
  assert.deepEqual(readSavedRequests(target), { available: true, requests: [] })
  assert.equal(saveVerifiedRequest(booking(), randomUUID(), target), true)
  const blocked = { getItem() { throw new Error('blocked') }, setItem() { throw new Error('blocked') } }
  assert.deepEqual(readSavedRequests(blocked), { available: false, requests: [] })
  assert.equal(saveVerifiedRequest(booking(), randomUUID(), blocked), false)
  assert.equal(removeSavedRequest(randomUUID(), blocked), false)
  const full = { getItem: () => null, setItem() { throw new Error('quota') } }
  assert.equal(saveVerifiedRequest(booking(), randomUUID(), full), false)
  assert.deepEqual(readSavedRequests(null), { available: false, requests: [] })
})

test('malformed references and unsafe URLs are rejected before they can be stored or linked', () => {
  const target = storage()
  const entry = booking()
  const token = randomUUID()
  for (const invalid of [
    { id: 'bad' }, { service: 'x' }, { service: 'a'.repeat(161) }, { service: 'Hidden\ntext' },
    { date: '2026-02-30' }, { hour: 20 }, { hour: '10' }, { status: 'fake' },
  ]) assert.equal(saveVerifiedRequest({ ...entry, ...invalid }, token, target), false)
  assert.equal(saveVerifiedRequest(entry, 'bad', target), false)
  for (const url of [
    `https://attacker.invalid/booking-status?id=${entry.id}#token=${token}`,
    `//attacker.invalid/booking-status?id=${entry.id}#token=${token}`,
    `javascript:alert(1)`, `/booking-status?id=${randomUUID()}#token=${token}`,
    `/booking-status?id=${entry.id}&id=${entry.id}#token=${token}`,
    `/booking-status?id=${entry.id}#token=${token}&next=external`,
  ]) assert.equal(saveBookingRequest(entry, url, target), false)
  assert.equal(requestStatusUrl({ ...entry, token: 'bad', savedAt: 1 }), '')
  assert.deepEqual(readSavedRequests(target).requests, [])
})

test('removal is browser-only and background updates never recreate a removed reference', () => {
  const target = storage()
  const entry = booking()
  const token = randomUUID()
  saveVerifiedRequest(entry, token, target)
  assert.equal(removeSavedRequest(entry.id, target), true)
  assert.deepEqual(readSavedRequests(target).requests, [])
  assert.equal(updateSavedRequest({ ...entry, status: 'approved' }, token, target), true)
  assert.deepEqual(readSavedRequests(target).requests, [])
  assert.equal(saveVerifiedRequest(entry, token, target), true)
  assert.equal(readSavedRequests(target).requests.length, 1)
  assert.equal(updateSavedRequest({ ...entry, status: 'cancelled' }, randomUUID(), target), true)
  assert.equal(readSavedRequests(target).requests[0].status, 'pending')
})

test('browser links are removed exactly 72 hours after the appointment ends while future requests stay', () => {
  const target = storage()
  const entry = booking({ date: '2099-01-02', hour: 10 })
  const future = booking({ date: '2099-01-20' })
  const token = randomUUID()
  const cutoff = new Date('2099-01-05T11:00:00+05:30').getTime()
  const clock = mock.method(Date, 'now', () => cutoff - 1)
  try {
    saveVerifiedRequest(entry, token, target)
    saveVerifiedRequest(future, randomUUID(), target)
    assert.equal(readSavedRequests(target).requests.length, 2)
    clock.mock.mockImplementation(() => cutoff)
    assert.deepEqual(readSavedRequests(target).requests.map(item => item.id), [future.id])
    assert.equal(target.getItem(BOOKING_HISTORY_KEY).includes(token), false)
    saveVerifiedRequest(entry, token, target)
    assert.deepEqual(readSavedRequests(target).requests.map(item => item.id), [future.id])
  } finally {
    clock.mock.restore()
  }
})
