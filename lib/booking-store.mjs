import { randomUUID } from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { requestRetentionTime, slotIsFuture } from './booking-shared.mjs';

// The JSON adapter is for local development or a single process on a persistent
// server. Serverless deployments must use the shared Supabase database instead.
const mutexKey = Symbol.for('royal.booking-storage.mutexes');
const mutexes = globalThis[mutexKey] || (globalThis[mutexKey] = new Map());
const statuses = new Set(['pending', 'approved', 'rejected', 'unavailable', 'cancelled']);
const columns = 'id,request_key,status_token_hash,customer_name,phone,service,booking_date,start_hour,notes,status,created_at,updated_at';

function failure(code, message) {
  return Object.assign(new Error(message), { code });
}

function storageFailure() {
  return failure('STORAGE_UNAVAILABLE', 'The booking service is temporarily unavailable. Please try again later.');
}

function configuration() {
  const explicitlyLocal = process.env.BOOKING_STORAGE === 'local';
  const cloud = Boolean(process.env.VERCEL || process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.AWS_EXECUTION_ENV || process.env.K_SERVICE || process.env.FUNCTION_TARGET);
  if (!explicitlyLocal && process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    let url;
    try {
      url = new URL(process.env.SUPABASE_URL);
    } catch {
      throw storageFailure();
    }
    const localHost = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
    if ((url.protocol !== 'https:' && !(url.protocol === 'http:' && localHost)) || url.username || url.password) throw storageFailure();
    return { type: 'supabase', url: url.origin, key: process.env.SUPABASE_SERVICE_ROLE_KEY };
  }
  if (cloud || (!explicitlyLocal && (process.env.NODE_ENV === 'production' || process.env.SUPABASE_URL || process.env.SUPABASE_SERVICE_ROLE_KEY))) {
    throw storageFailure();
  }
  return { type: 'local', file: path.resolve(process.env.BOOKING_DATA_FILE || '.booking-data/bookings.json') };
}

async function locked(file, operation) {
  const previous = mutexes.get(file) || Promise.resolve();
  let release;
  const current = new Promise((resolve) => { release = resolve; });
  mutexes.set(file, current);
  await previous;
  try {
    return await operation();
  } finally {
    release();
    if (mutexes.get(file) === current) mutexes.delete(file);
  }
}

async function readLocal(file) {
  try {
    const data = JSON.parse(await fs.readFile(file, 'utf8'));
    if (data.version !== 1 || !Array.isArray(data.bookings)) throw storageFailure();
    const now = Date.now();
    const retained = data.bookings.filter((entry) => !(requestRetentionTime(entry.date, entry.hour) <= now));
    // Every caller holds the file mutex. Persist deletion on reads as well as
    // writes, so expired customer records do not remain in the development file.
    if (retained.length !== data.bookings.length) await writeLocal(file, retained);
    return retained;
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw storageFailure();
  }
}

async function writeLocal(file, bookings) {
  const temporary = `${file}.${process.pid}.${randomUUID()}.tmp`;
  let handle;
  try {
    await fs.mkdir(path.dirname(file), { recursive: true, mode: 0o700 });
    handle = await fs.open(temporary, 'wx', 0o600);
    await handle.writeFile(JSON.stringify({ version: 1, bookings }), 'utf8');
    await handle.sync();
    await handle.close();
    handle = undefined;
    await fs.rename(temporary, file);
  } catch {
    if (handle) await handle.close().catch(() => {});
    await fs.unlink(temporary).catch(() => {});
    throw storageFailure();
  }
}

function validateBooking(booking) {
  const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const validText = (value, min, max) => typeof value === 'string' && value.trim().length >= min && value.length <= max;
  if (!booking || !uuid.test(booking.id || '') || !validText(booking.requestKey, 16, 128)
    || !/^[0-9a-f]{64}$/.test(booking.statusTokenHash || '') || !validText(booking.name, 1, 100)
    || !validText(booking.phone, 7, 25) || !validText(booking.service, 2, 160)
    || typeof booking.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(booking.date)
    || !Number.isInteger(booking.hour) || booking.hour < 10 || booking.hour > 19
    || typeof booking.notes !== 'string' || booking.notes.length > 1500 || booking.status !== 'pending'
    || typeof booking.createdAt !== 'string' || typeof booking.updatedAt !== 'string'
    || !Number.isFinite(Date.parse(booking.createdAt)) || !Number.isFinite(Date.parse(booking.updatedAt))) {
    throw failure('INVALID_BOOKING', 'Please check your booking details.');
  }
  const parsedDate = new Date(`${booking.date}T00:00:00+05:30`);
  if (!Number.isFinite(parsedDate.getTime()) || new Date(`${booking.date}T00:00:00Z`).toISOString().slice(0, 10) !== booking.date) {
    throw failure('INVALID_BOOKING', 'Please check your booking date.');
  }
}

function toDatabase(booking) {
  return {
    id: booking.id, request_key: booking.requestKey, status_token_hash: booking.statusTokenHash,
    customer_name: booking.name, phone: booking.phone, service: booking.service,
    booking_date: booking.date, start_hour: booking.hour, notes: booking.notes,
    status: booking.status, created_at: booking.createdAt, updated_at: booking.updatedAt,
  };
}

function fromDatabase(row) {
  return {
    id: row.id, requestKey: row.request_key, statusTokenHash: row.status_token_hash,
    name: row.customer_name, phone: row.phone, service: row.service,
    date: row.booking_date, hour: row.start_hour, notes: row.notes,
    status: row.status, createdAt: row.created_at, updatedAt: row.updated_at,
  };
}

async function request(config, endpoint, options = {}) {
  let response;
  try {
    response = await fetch(`${config.url}/rest/v1/${endpoint}`, {
      ...options,
      headers: {
        apikey: config.key,
        Authorization: `Bearer ${config.key}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
      cache: 'no-store',
      signal: AbortSignal.timeout(15000),
    });
  } catch {
    throw storageFailure();
  }
  let data;
  try {
    data = await response.json();
  } catch {
    throw storageFailure();
  }
  if (!response.ok) {
    const code = typeof data?.message === 'string' ? data.message : '';
    const messages = {
      SLOT_TAKEN: 'This appointment time is already booked.',
      NOT_FOUND: 'This booking could not be found.',
      INVALID_TRANSITION: 'This booking can no longer be changed in that way.',
      INVALID_BOOKING: 'Please check your booking details.',
    };
    if (messages[code]) throw failure(code, messages[code]);
    throw storageFailure();
  }
  return data;
}

export async function getApprovedHours(date) {
  const config = configuration();
  if (config.type === 'supabase') {
    const query = new URLSearchParams({ select: 'start_hour', booking_date: `eq.${date}`, status: 'eq.approved', order: 'start_hour.asc' });
    const rows = await request(config, `studio_bookings?${query}`);
    return rows.map((row) => row.start_hour);
  }
  return locked(config.file, async () => (await readLocal(config.file)).filter((entry) => entry.date === date && entry.status === 'approved').map((entry) => entry.hour).sort((a, b) => a - b));
}

export async function createBooking(booking) {
  validateBooking(booking);
  const config = configuration();
  if (config.type === 'supabase') {
    const rows = await request(config, 'rpc/create_studio_booking', { method: 'POST', body: JSON.stringify({ p_booking: toDatabase(booking) }) });
    if (!rows[0]) throw storageFailure();
    return fromDatabase(rows[0]);
  }
  return locked(config.file, async () => {
    const bookings = await readLocal(config.file);
    const existing = bookings.find((entry) => entry.requestKey === booking.requestKey);
    if (existing) return existing;
    if (!slotIsFuture(booking.date, booking.hour)) throw failure('INVALID_BOOKING', 'Please choose an appointment time in the future.');
    if (bookings.some((entry) => entry.date === booking.date && entry.hour === booking.hour && entry.status === 'approved')) {
      throw failure('SLOT_TAKEN', 'This appointment time is already booked.');
    }
    if (bookings.some((entry) => entry.id === booking.id)) throw failure('INVALID_BOOKING', 'Please submit a new booking request.');
    const saved = { ...booking };
    bookings.push(saved);
    await writeLocal(config.file, bookings);
    return saved;
  });
}

export async function listBookings({ date, status } = {}) {
  if (status && !statuses.has(status)) throw failure('INVALID_BOOKING', 'Please choose a valid booking status.');
  const config = configuration();
  if (config.type === 'supabase') {
    const query = new URLSearchParams({ select: columns, order: 'booking_date.asc,start_hour.asc,created_at.asc,id.asc' });
    if (date) query.set('booking_date', `eq.${date}`);
    if (status) query.set('status', `eq.${status}`);
    const rows = [];
    const pageSize = 500;
    for (let offset = 0; ; offset += pageSize) {
      const page = await request(config, `studio_bookings?${query}`, {
        headers: { 'Range-Unit': 'items', Range: `${offset}-${offset + pageSize - 1}` },
      });
      rows.push(...page.map(fromDatabase));
      if (page.length < pageSize) break;
    }
    return rows;
  }
  return locked(config.file, async () => (await readLocal(config.file))
    .filter((entry) => (!date || entry.date === date) && (!status || entry.status === status))
    .sort((a, b) => a.date.localeCompare(b.date) || a.hour - b.hour || a.createdAt.localeCompare(b.createdAt) || a.id.localeCompare(b.id)));
}

export async function getBooking(id) {
  const config = configuration();
  if (config.type === 'supabase') {
    const query = new URLSearchParams({ select: columns, id: `eq.${id}`, limit: '1' });
    const rows = await request(config, `studio_bookings?${query}`);
    return rows[0] ? fromDatabase(rows[0]) : null;
  }
  return locked(config.file, async () => (await readLocal(config.file)).find((entry) => entry.id === id) || null);
}

export async function getBookingsByIds(ids) {
  const uuid = /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i;
  if (!Array.isArray(ids) || ids.length > 50) throw failure('INVALID_BOOKING', 'Please provide up to 50 valid booking references.');
  const unique = new Set();
  for (const id of ids) {
    if (typeof id !== 'string' || !uuid.test(id)) throw failure('INVALID_BOOKING', 'Please provide valid booking references.');
    unique.add(id.toLowerCase());
  }
  if (!unique.size) return [];

  const config = configuration();
  if (config.type === 'supabase') {
    const query = new URLSearchParams({
      select: 'id,status_token_hash,service,booking_date,start_hour,status',
      id: `in.(${[...unique].join(',')})`,
    });
    const rows = await request(config, `studio_bookings?${query}`);
    return rows.map((row) => ({
      id: row.id, statusTokenHash: row.status_token_hash, service: row.service,
      date: row.booking_date, hour: row.start_hour, status: row.status,
    }));
  }
  return locked(config.file, async () => (await readLocal(config.file))
    .filter((entry) => unique.has(entry.id.toLowerCase()))
    .map((entry) => ({
      id: entry.id, statusTokenHash: entry.statusTokenHash, service: entry.service,
      date: entry.date, hour: entry.hour, status: entry.status,
    })));
}

export async function decideBooking(id, action) {
  if (!['approve', 'reject', 'cancel'].includes(action)) throw failure('INVALID_TRANSITION', 'Please choose a valid booking action.');
  const config = configuration();
  if (config.type === 'supabase') {
    const rows = await request(config, 'rpc/decide_studio_booking', { method: 'POST', body: JSON.stringify({ p_id: id, p_action: action }) });
    // Older installed RPC versions can return a null row when a scheduled
    // retention delete wins the race between their initial read and row lock.
    if (!rows[0]?.id) throw failure('NOT_FOUND', 'This booking could not be found.');
    return fromDatabase(rows[0]);
  }
  return locked(config.file, async () => {
    const bookings = await readLocal(config.file);
    const booking = bookings.find((entry) => entry.id === id);
    if (!booking) throw failure('NOT_FOUND', 'This booking could not be found.');
    const sameSlot = (entry) => entry.date === booking.date && entry.hour === booking.hour;
    if (action === 'approve' && bookings.some((entry) => sameSlot(entry) && entry.id !== id && entry.status === 'approved')) {
      throw failure('SLOT_TAKEN', 'This appointment time is already booked.');
    }
    if ((action === 'cancel' && booking.status !== 'approved') || (action !== 'cancel' && booking.status !== 'pending')) {
      throw failure('INVALID_TRANSITION', 'This booking can no longer be changed in that way.');
    }
    if (action === 'approve' && !slotIsFuture(booking.date, booking.hour)) {
      throw failure('INVALID_TRANSITION', 'This appointment time has passed.');
    }
    const updatedAt = new Date().toISOString();
    booking.status = { approve: 'approved', reject: 'rejected', cancel: 'cancelled' }[action];
    booking.updatedAt = updatedAt;
    if (action === 'approve') {
      for (const entry of bookings) {
        if (entry.id !== id && sameSlot(entry) && entry.status === 'pending') {
          entry.status = 'unavailable';
          entry.updatedAt = updatedAt;
        }
      }
    }
    await writeLocal(config.file, bookings);
    return booking;
  });
}
