import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, mock, test } from 'node:test';
import { createBooking, decideBooking, getApprovedHours, getBooking, getBookingsByIds, listBookings } from '../lib/booking-store.mjs';

const environmentKeys = ['BOOKING_STORAGE', 'BOOKING_DATA_FILE', 'NODE_ENV', 'SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'VERCEL', 'NETLIFY', 'AWS_LAMBDA_FUNCTION_NAME', 'AWS_EXECUTION_ENV', 'K_SERVICE', 'FUNCTION_TARGET'];
let directory;
let environment;

function booking(overrides = {}) {
  return {
    id: randomUUID(), requestKey: randomUUID(), statusTokenHash: 'a'.repeat(64),
    name: 'Test customer', phone: '+919876543210', service: 'Piercing consultation',
    date: '2099-01-02', hour: 10, notes: '', status: 'pending',
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

beforeEach(async () => {
  environment = Object.fromEntries(environmentKeys.map((key) => [key, process.env[key]]));
  for (const key of environmentKeys) delete process.env[key];
  directory = await fs.mkdtemp(path.join(os.tmpdir(), 'royal-booking-store-'));
  process.env.BOOKING_STORAGE = 'local';
  process.env.BOOKING_DATA_FILE = path.join(directory, 'bookings.json');
});

afterEach(async () => {
  mock.restoreAll();
  for (const [key, value] of Object.entries(environment)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  await fs.rm(directory, { recursive: true, force: true });
});

test('pending requests do not block a slot; concurrent approvals produce exactly one approved appointment', async () => {
  const requests = Array.from({ length: 12 }, () => booking());
  await Promise.all(requests.map(createBooking));
  assert.deepEqual(await getApprovedHours('2099-01-02'), []);

  const outcomes = await Promise.allSettled(requests.map((entry) => decideBooking(entry.id, 'approve')));
  assert.equal(outcomes.filter((result) => result.status === 'fulfilled').length, 1);
  for (const result of outcomes.filter((entry) => entry.status === 'rejected')) assert.equal(result.reason.code, 'SLOT_TAKEN');
  assert.deepEqual(await getApprovedHours('2099-01-02'), [10]);
  const saved = await listBookings();
  assert.equal(saved.filter((entry) => entry.status === 'approved').length, 1);
  assert.equal(saved.filter((entry) => entry.status === 'unavailable').length, 11);
  await assert.rejects(createBooking(booking()), { code: 'SLOT_TAKEN' });
});

test('concurrent retries persist one booking and preserve its original private status token', async () => {
  const original = booking();
  const outcomes = await Promise.all(Array.from({ length: 8 }, () => createBooking({ ...original, id: randomUUID(), statusTokenHash: 'b'.repeat(64) })));
  assert.equal(new Set(outcomes.map((entry) => entry.id)).size, 1);
  assert.equal((await listBookings()).length, 1);
  const retry = await createBooking({ ...original, date: '2099-02-01', id: randomUUID() });
  assert.equal(retry.id, outcomes[0].id);
  assert.equal(retry.date, original.date);
  assert.equal(retry.statusTokenHash, 'b'.repeat(64));
});

test('saved requests survive module reload and the data file has owner-only permissions', async () => {
  const original = await createBooking(booking());
  const reopened = await import(`../lib/booking-store.mjs?reopen=${randomUUID()}`);
  assert.deepEqual(await reopened.getBooking(original.id), original);
  assert.equal((await fs.stat(process.env.BOOKING_DATA_FILE)).mode & 0o777, 0o600);
  assert.equal(await reopened.getBooking(randomUUID()), null);
});

test('mutex remains shared across module reloads so concurrent writes cannot lose requests', async () => {
  const reopened = await import(`../lib/booking-store.mjs?parallel=${randomUUID()}`);
  await Promise.all(Array.from({ length: 20 }, (_, index) => (index % 2 ? reopened.createBooking : createBooking)(booking({ hour: 11 }))));
  assert.equal((await listBookings()).length, 20);
});

test('rejecting a request does not block or change other requests', async () => {
  const first = await createBooking(booking());
  const second = await createBooking(booking());
  assert.equal((await decideBooking(first.id, 'reject')).status, 'rejected');
  assert.equal((await getBooking(second.id)).status, 'pending');
  assert.deepEqual(await getApprovedHours(first.date), []);
  await assert.rejects(decideBooking(first.id, 'approve'), { code: 'INVALID_TRANSITION' });
});

test('cancelling an approved appointment frees the studio slot for a new request', async () => {
  const original = await createBooking(booking());
  await decideBooking(original.id, 'approve');
  assert.equal((await decideBooking(original.id, 'cancel')).status, 'cancelled');
  assert.deepEqual(await getApprovedHours(original.date), []);
  const replacement = await createBooking(booking());
  await decideBooking(replacement.id, 'approve');
  assert.deepEqual(await getApprovedHours(original.date), [10]);
  await assert.rejects(decideBooking(replacement.id, 'reject'), { code: 'INVALID_TRANSITION' });
});

test('a slot that has started in India cannot be approved, even if originally requested in the future', async () => {
  const original = await createBooking(booking());
  mock.method(Date, 'now', () => new Date('2099-01-02T10:00:00+05:30').getTime());
  await assert.rejects(decideBooking(original.id, 'approve'), { code: 'INVALID_TRANSITION' });
  assert.equal((await getBooking(original.id)).status, 'pending');
});

test('invalid dates and past appointments are rejected before storage', async () => {
  await assert.rejects(createBooking(booking({ date: '2099-02-31' })), { code: 'INVALID_BOOKING' });
  await assert.rejects(createBooking(booking({ date: '2000-01-01' })), { code: 'INVALID_BOOKING' });
  await assert.rejects(createBooking(booking({ hour: 20 })), { code: 'INVALID_BOOKING' });
  assert.deepEqual(await listBookings(), []);
});

test('date/status filters do not disclose unrelated entries to the filtered query', async () => {
  const first = await createBooking(booking());
  const second = await createBooking(booking({ date: '2099-01-03', hour: 13 }));
  await decideBooking(second.id, 'approve');
  assert.deepEqual((await listBookings({ date: first.date })).map((entry) => entry.id), [first.id]);
  assert.deepEqual((await listBookings({ status: 'approved' })).map((entry) => entry.id), [second.id]);
});

test('missing bookings, unsupported transitions and corrupt files fail safely', async () => {
  await assert.rejects(decideBooking(randomUUID(), 'approve'), { code: 'NOT_FOUND' });
  await assert.rejects(decideBooking(randomUUID(), 'delete'), { code: 'INVALID_TRANSITION' });
  await fs.writeFile(process.env.BOOKING_DATA_FILE, 'corrupt private customer information');
  await assert.rejects(listBookings(), (error) => error.code === 'STORAGE_UNAVAILABLE' && !error.message.includes('private customer'));
});

test('production and serverless deployments do not silently use temporary local storage', async () => {
  process.env.NODE_ENV = 'production';
  delete process.env.BOOKING_STORAGE;
  await assert.rejects(listBookings(), { code: 'STORAGE_UNAVAILABLE' });
  process.env.BOOKING_STORAGE = 'local';
  assert.deepEqual(await listBookings(), []);
  process.env.VERCEL = '1';
  await assert.rejects(listBookings(), { code: 'STORAGE_UNAVAILABLE' });
});

test('Supabase adapter uses server credentials, maps database fields and sanitizes upstream errors', async () => {
  delete process.env.BOOKING_STORAGE;
  process.env.SUPABASE_URL = 'https://example.supabase.co';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'server-secret';
  const original = booking();
  const row = {
    id: original.id, request_key: original.requestKey, status_token_hash: original.statusTokenHash,
    customer_name: original.name, phone: original.phone, service: original.service,
    booking_date: original.date, start_hour: original.hour, notes: original.notes,
    status: original.status, created_at: original.createdAt, updated_at: original.updatedAt,
  };
  const calls = [];
  mock.method(globalThis, 'fetch', async (url, options) => {
    calls.push({ url, options });
    return new Response(JSON.stringify([row]), { status: 200 });
  });
  assert.deepEqual(await createBooking(original), original);
  assert.equal(calls[0].url, 'https://example.supabase.co/rest/v1/rpc/create_studio_booking');
  assert.equal(calls[0].options.headers.Authorization, 'Bearer server-secret');
  assert.equal(calls[0].options.cache, 'no-store');
  assert.equal(JSON.parse(calls[0].options.body).p_booking.request_key, original.requestKey);
  globalThis.fetch.mock.mockImplementation(async () => new Response(JSON.stringify({ message: 'SLOT_TAKEN' }), { status: 400 }));
  await assert.rejects(decideBooking(original.id, 'approve'), { code: 'SLOT_TAKEN' });
  globalThis.fetch.mock.mockImplementation(async () => new Response(JSON.stringify({ message: 'leaked server-secret customer data' }), { status: 500 }));
  await assert.rejects(getBooking(original.id), (error) => error.code === 'STORAGE_UNAVAILABLE' && !error.message.includes('server-secret'));
});

test('Supabase lists all pages instead of hiding bookings after the database response limit', async () => {
  delete process.env.BOOKING_STORAGE;
  process.env.SUPABASE_URL = 'https://example.supabase.co';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'server-secret';
  const ranges = [];
  mock.method(globalThis, 'fetch', async (url, options) => {
    ranges.push(options.headers.Range);
    assert.ok(url.includes('booking_date=eq.2099-01-02'));
    const start = Number(options.headers.Range.split('-')[0]);
    return new Response(JSON.stringify(Array.from({ length: start === 0 ? 500 : 1 }, (_, index) => ({
      id: `booking-${start + index}`, request_key: `key-${start + index}`, status_token_hash: 'a'.repeat(64),
      customer_name: 'Customer', phone: '+919876543210', service: 'Piercing consultation',
      booking_date: '2099-01-02', start_hour: 10, notes: '', status: 'pending',
      created_at: '2099-01-01T10:00:00Z', updated_at: '2099-01-01T10:00:00Z',
    }))), { status: 200 });
  });
  const entries = await listBookings({ date: '2099-01-02' });
  assert.equal(entries.length, 501);
  assert.equal(entries.at(-1).id, 'booking-500');
  assert.deepEqual(ranges, ['0-499', '500-999']);
});

test('remote database credentials cannot be sent over plain HTTP', async () => {
  delete process.env.BOOKING_STORAGE;
  process.env.SUPABASE_URL = 'http://example.supabase.co';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'server-secret';
  await assert.rejects(listBookings(), { code: 'STORAGE_UNAVAILABLE' });
});

test('batch lookup filters and deduplicates references without returning customer details or changing records', async () => {
  const first = await createBooking(booking());
  const second = await createBooking(booking({ hour: 11 }));
  await createBooking(booking({ hour: 12 }));
  await decideBooking(second.id, 'approve');
  const before = await fs.readFile(process.env.BOOKING_DATA_FILE);
  const entries = await getBookingsByIds([first.id, second.id, first.id.toUpperCase(), randomUUID()]);
  assert.equal(entries.length, 2);
  assert.deepEqual(new Set(entries.map((entry) => entry.id)), new Set([first.id, second.id]));
  assert.equal(entries.find((entry) => entry.id === second.id).status, 'approved');
  for (const entry of entries) {
    assert.deepEqual(Object.keys(entry).sort(), ['date', 'hour', 'id', 'service', 'status', 'statusTokenHash'].sort());
    assert.equal(entry.statusTokenHash, 'a'.repeat(64));
  }
  assert.deepEqual(await fs.readFile(process.env.BOOKING_DATA_FILE), before);
});

test('empty batch lookup returns before configuring or reading storage', async () => {
  process.env.VERCEL = '1';
  process.env.NODE_ENV = 'production';
  await fs.writeFile(process.env.BOOKING_DATA_FILE, 'corrupt data that must not be read');
  assert.deepEqual(await getBookingsByIds([]), []);
});

test('batch lookup validates every UUIDv4 and rejects oversized or malformed inputs before storage', async () => {
  process.env.VERCEL = '1';
  const invalid = [undefined, null, {}, randomUUID(), [null], [123], [['not-a-string']], ['-'.repeat(36)], ['123e4567-e89b-12d3-a456-426614174000'], Array(1), Array.from({ length: 51 }, () => randomUUID())];
  for (const ids of invalid) await assert.rejects(getBookingsByIds(ids), { code: 'INVALID_BOOKING' });
});

test('Supabase batch lookup makes one limited query and returns only status verification fields', async () => {
  delete process.env.BOOKING_STORAGE;
  process.env.SUPABASE_URL = 'https://example.supabase.co';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'server-secret';
  const first = booking();
  const second = booking();
  const calls = [];
  mock.method(globalThis, 'fetch', async (url, options) => {
    calls.push({ url, options });
    return new Response(JSON.stringify([{
      id: first.id, status_token_hash: first.statusTokenHash, service: first.service,
      booking_date: first.date, start_hour: first.hour, status: 'pending',
      customer_name: 'must not be returned', phone: 'must not be returned',
      notes: 'must not be returned', request_key: 'must not be returned',
    }]), { status: 200 });
  });
  const entries = await getBookingsByIds([first.id, second.id, first.id.toUpperCase()]);
  assert.equal(calls.length, 1);
  const url = new URL(calls[0].url);
  assert.equal(url.pathname, '/rest/v1/studio_bookings');
  assert.equal(url.searchParams.get('select'), 'id,status_token_hash,service,booking_date,start_hour,status');
  assert.equal(url.searchParams.get('id'), `in.(${first.id},${second.id})`);
  assert.equal(calls[0].options.cache, 'no-store');
  assert.deepEqual(entries, [{
    id: first.id, statusTokenHash: first.statusTokenHash, service: first.service,
    date: first.date, hour: first.hour, status: 'pending',
  }]);
});

test('retention removes all statuses exactly 72 hours after appointment end, never after submission', async () => {
  const expired = ['pending', 'approved', 'rejected', 'unavailable', 'cancelled'].map((status) => booking({ status }));
  const laterSlot = booking({ status: 'approved', hour: 11 });
  const future = booking({ date: '2099-01-08', createdAt: '2000-01-01T00:00:00.000Z', updatedAt: '2000-01-01T00:00:00.000Z' });
  await fs.writeFile(process.env.BOOKING_DATA_FILE, JSON.stringify({ version: 1, bookings: [...expired, laterSlot, future] }));
  // The expired appointments are 10–11 AM on January 2, so the cutoff is
  // January 5 at 11 AM IST (05:30 UTC), rather than 10 AM or midnight.
  let now = new Date('2099-01-05T11:00:00+05:30').getTime() - 1;
  mock.method(Date, 'now', () => now);
  assert.equal((await listBookings()).length, 7);
  now += 1;
  assert.deepEqual(await getApprovedHours('2099-01-02'), [11]);
  const persisted = JSON.parse(await fs.readFile(process.env.BOOKING_DATA_FILE, 'utf8')).bookings;
  assert.deepEqual(new Set(persisted.map((entry) => entry.id)), new Set([laterSlot.id, future.id]));
  assert.equal(await getBooking(expired[0].id), null);
  assert.equal((await getBooking(future.id)).createdAt, '2000-01-01T00:00:00.000Z');
  assert.equal((await fs.stat(process.env.BOOKING_DATA_FILE)).mode & 0o777, 0o600);
});

test('every local read and write access persists retention cleanup', async () => {
  mock.method(Date, 'now', () => new Date('2099-01-05T11:00:00+05:30').getTime());
  const operations = [
    (future) => getBooking(future.id),
    (future) => getBookingsByIds([future.id]),
    (future) => getApprovedHours(future.date),
    () => listBookings(),
    () => createBooking(booking({ date: '2099-01-09' })),
    (future) => decideBooking(future.id, 'reject'),
  ];
  for (const operation of operations) {
    const expired = booking();
    const future = booking({ date: '2099-01-08' });
    await fs.writeFile(process.env.BOOKING_DATA_FILE, JSON.stringify({ version: 1, bookings: [expired, future] }));
    await operation(future);
    const persisted = JSON.parse(await fs.readFile(process.env.BOOKING_DATA_FILE, 'utf8')).bookings;
    assert.equal(persisted.some((entry) => entry.id === expired.id), false);
    assert.equal(persisted.some((entry) => entry.id === future.id), true);
  }
});

test('expired local bookings cannot be changed and cleanup write failures remain sanitized', async () => {
  mock.method(Date, 'now', () => new Date('2099-01-05T11:00:00+05:30').getTime());
  const expired = booking();
  await fs.writeFile(process.env.BOOKING_DATA_FILE, JSON.stringify({ version: 1, bookings: [expired] }));
  await assert.rejects(decideBooking(expired.id, 'reject'), { code: 'NOT_FOUND' });
  assert.deepEqual(JSON.parse(await fs.readFile(process.env.BOOKING_DATA_FILE, 'utf8')).bookings, []);

  await fs.writeFile(process.env.BOOKING_DATA_FILE, JSON.stringify({ version: 1, bookings: [expired] }));
  mock.method(fs, 'rename', async () => { throw new Error('private customer data in underlying filesystem error'); });
  await assert.rejects(listBookings(), (error) => error.code === 'STORAGE_UNAVAILABLE' && !error.message.includes('private customer'));
});

test('Supabase decisions handle retention deletion racing with an older installed RPC', async () => {
  delete process.env.BOOKING_STORAGE;
  process.env.SUPABASE_URL = 'https://example.supabase.co';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'server-secret';
  mock.method(globalThis, 'fetch', async () => new Response(JSON.stringify([{ id: null, status: null }]), { status: 200 }));
  await assert.rejects(decideBooking(randomUUID(), 'reject'), { code: 'NOT_FOUND' });
});
