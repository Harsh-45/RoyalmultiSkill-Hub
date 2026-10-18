import test from 'node:test'
import assert from 'node:assert/strict'
import { todayInIndia, lastBookingDate, isCalendarDate, isBookingDate, slotIsFuture, slotLabel, SLOT_HOURS, visibleBookingStatus, requestRetentionTime } from '../lib/booking-shared.mjs'

test('dates follow India time across UTC midnight and month boundaries', () => {
  const now = Date.parse('2026-10-18T19:00:00Z')
  assert.equal(todayInIndia(now), '2026-10-19')
  assert.equal(lastBookingDate(now), '2026-12-18')
  assert.equal(isBookingDate('2026-10-18', now), false)
  assert.equal(isBookingDate('2026-12-18', now), true)
  assert.equal(isBookingDate('2026-12-19', now), false)
  assert.equal(isCalendarDate('2026-02-30'), false)
  assert.equal(isCalendarDate('2026-13-01'), false)
  assert.equal(isCalendarDate('2028-02-29'), true)
})

test('only ten future studio hours are bookable with correct noon and closing labels', () => {
  const now = Date.parse('2026-10-18T04:30:00Z')
  assert.equal(SLOT_HOURS.length, 10)
  assert.equal(slotIsFuture('2026-10-18', 10, now), false)
  assert.equal(slotIsFuture('2026-10-18', 11, now), true)
  assert.equal(slotIsFuture('2026-10-19', 20, now), false)
  assert.equal(slotIsFuture('2026-10-19', '11', now), false)
  assert.equal(slotLabel(11), '11:00 AM – 12:00 PM')
  assert.equal(slotLabel(19), '7:00 PM – 8:00 PM')
  assert.equal(visibleBookingStatus({ date: '2026-10-18', hour: 10, status: 'pending' }, now), 'expired')
  assert.equal(visibleBookingStatus({ date: '2026-10-18', hour: 10, status: 'approved' }, now), 'approved')
})

test('request retention uses three full days after the slot end in India across month boundaries', () => {
  assert.equal(requestRetentionTime('2026-10-31', 19), Date.parse('2026-11-03T20:00:00+05:30'))
  assert.equal(requestRetentionTime('2028-02-28', 10), Date.parse('2028-03-02T11:00:00+05:30'))
  assert.ok(Number.isNaN(requestRetentionTime('2026-02-30', 10)))
  assert.ok(Number.isNaN(requestRetentionTime('2026-10-31', 20)))
})
