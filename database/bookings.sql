-- Run once in the Supabase SQL editor. Only the server's service-role key may
-- access this table or these RPCs. Never expose that key in browser code.
create table if not exists public.studio_bookings (
  id uuid primary key,
  request_key text not null unique check (length(request_key) between 16 and 128),
  status_token_hash text not null check (status_token_hash ~ '^[0-9a-f]{64}$'),
  customer_name text not null check (length(trim(customer_name)) between 1 and 100),
  phone text not null check (length(phone) between 7 and 25),
  service text not null check (length(trim(service)) between 2 and 160),
  booking_date date not null,
  start_hour smallint not null check (start_hour between 10 and 19),
  notes text not null default '' check (length(notes) <= 1500),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'unavailable', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists studio_bookings_one_approved_slot
  on public.studio_bookings (booking_date, start_hour) where status = 'approved';
create index if not exists studio_bookings_date_status
  on public.studio_bookings (booking_date, status);

alter table public.studio_bookings enable row level security;
revoke all on table public.studio_bookings from public, anon, authenticated;
grant select, insert, update on table public.studio_bookings to service_role;

create or replace function public.create_studio_booking(p_booking jsonb)
returns setof public.studio_bookings
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_existing public.studio_bookings%rowtype;
  v_date date;
  v_hour smallint;
  v_request_key text;
begin
  v_request_key := p_booking ->> 'request_key';
  if v_request_key is null or length(v_request_key) not between 16 and 128
    or (p_booking ->> 'status') is distinct from 'pending' then
    raise exception using message = 'INVALID_BOOKING', errcode = 'P0001';
  end if;

  -- Serialize retries before slot locking, including retries with changed data.
  perform pg_advisory_xact_lock(hashtextextended('royal-request:' || v_request_key, 0));
  select * into v_existing from public.studio_bookings where request_key = v_request_key;
  if found then
    return next v_existing;
    return;
  end if;

  begin
    v_date := (p_booking ->> 'booking_date')::date;
    v_hour := (p_booking ->> 'start_hour')::smallint;
  exception when invalid_text_representation or datetime_field_overflow or numeric_value_out_of_range then
    raise exception using message = 'INVALID_BOOKING', errcode = 'P0001';
  end;
  if v_date is null or v_hour is null or v_hour not between 10 and 19 then
    raise exception using message = 'INVALID_BOOKING', errcode = 'P0001';
  end if;

  -- All writes for one studio slot acquire this lock before taking row locks.
  perform pg_advisory_xact_lock(hashtextextended('royal-slot:' || v_date::text || ':' || v_hour::text, 0));
  if ((v_date + make_time(v_hour, 0, 0)) at time zone 'Asia/Kolkata') <= clock_timestamp() then
    raise exception using message = 'INVALID_BOOKING', errcode = 'P0001';
  end if;
  if exists (select 1 from public.studio_bookings where booking_date = v_date and start_hour = v_hour and status = 'approved') then
    raise exception using message = 'SLOT_TAKEN', errcode = 'P0001';
  end if;

  begin
    insert into public.studio_bookings (
      id, request_key, status_token_hash, customer_name, phone, service,
      booking_date, start_hour, notes, status
    ) values (
      (p_booking ->> 'id')::uuid, v_request_key, p_booking ->> 'status_token_hash',
      p_booking ->> 'customer_name', p_booking ->> 'phone', p_booking ->> 'service',
      v_date, v_hour, coalesce(p_booking ->> 'notes', ''), 'pending'
    ) returning * into v_existing;
  exception when invalid_text_representation or check_violation or not_null_violation or unique_violation then
    raise exception using message = 'INVALID_BOOKING', errcode = 'P0001';
  end;
  return next v_existing;
end;
$$;

create or replace function public.decide_studio_booking(p_id uuid, p_action text)
returns setof public.studio_bookings
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_booking public.studio_bookings%rowtype;
  v_status text;
begin
  if p_action is null or p_action not in ('approve', 'reject', 'cancel') then
    raise exception using message = 'INVALID_TRANSITION', errcode = 'P0001';
  end if;
  select * into v_booking from public.studio_bookings where id = p_id;
  if not found then
    raise exception using message = 'NOT_FOUND', errcode = 'P0001';
  end if;

  -- Lock the slot before any booking rows. Locking each requested row first
  -- would deadlock when two owners approve competing requests simultaneously.
  perform pg_advisory_xact_lock(hashtextextended('royal-slot:' || v_booking.booking_date::text || ':' || v_booking.start_hour::text, 0));
  select * into v_booking from public.studio_bookings where id = p_id for update;
  if not found then
    raise exception using message = 'NOT_FOUND', errcode = 'P0001';
  end if;

  if p_action = 'approve' and exists (
    select 1 from public.studio_bookings where booking_date = v_booking.booking_date
      and start_hour = v_booking.start_hour and status = 'approved' and id <> p_id
  ) then
    raise exception using message = 'SLOT_TAKEN', errcode = 'P0001';
  end if;
  if (p_action = 'cancel' and v_booking.status <> 'approved')
    or (p_action <> 'cancel' and v_booking.status <> 'pending') then
    raise exception using message = 'INVALID_TRANSITION', errcode = 'P0001';
  end if;
  if p_action = 'approve'
    and ((v_booking.booking_date + make_time(v_booking.start_hour, 0, 0)) at time zone 'Asia/Kolkata') <= clock_timestamp() then
    raise exception using message = 'INVALID_TRANSITION', errcode = 'P0001';
  end if;

  v_status := case p_action when 'approve' then 'approved' when 'reject' then 'rejected' else 'cancelled' end;
  begin
    update public.studio_bookings set status = v_status, updated_at = now() where id = p_id returning * into v_booking;
  exception when unique_violation then
    raise exception using message = 'SLOT_TAKEN', errcode = 'P0001';
  end;
  if p_action = 'approve' then
    update public.studio_bookings set status = 'unavailable', updated_at = now()
      where booking_date = v_booking.booking_date and start_hour = v_booking.start_hour
        and status = 'pending' and id <> p_id;
  end if;
  return next v_booking;
end;
$$;

revoke all on function public.create_studio_booking(jsonb) from public, anon, authenticated;
revoke all on function public.decide_studio_booking(uuid, text) from public, anon, authenticated;
grant execute on function public.create_studio_booking(jsonb) to service_role;
grant execute on function public.decide_studio_booking(uuid, text) to service_role;

-- Retention for fresh installations. Existing projects can instead run only
-- database/booking-retention.sql, which installs this same cleanup job.
create extension if not exists pg_cron with schema pg_catalog;
create schema if not exists royal_private;
revoke all on schema royal_private from public, anon, authenticated;
grant usage on schema royal_private to service_role;

create or replace function royal_private.purge_expired_studio_bookings()
returns bigint
language plpgsql
security definer
set search_path = pg_catalog
as $$
declare
  v_deleted bigint;
begin
  -- An appointment occupies [start_hour, start_hour + 1). Retention begins
  -- at its END in India time, regardless of submission date or booking status.
  delete from public.studio_bookings
    where (((booking_date + make_time(start_hour + 1, 0, 0)) at time zone 'Asia/Kolkata')
      + interval '72 hours') <= clock_timestamp();
  get diagnostics v_deleted = row_count;
  return v_deleted;
end;
$$;

revoke all on function royal_private.purge_expired_studio_bookings() from public, anon, authenticated;
grant execute on function royal_private.purge_expired_studio_bookings() to service_role;

-- A named pg_cron schedule updates the existing job for this SQL-editor user
-- when rerun. No credentials are embedded in the scheduled SQL command.
select cron.schedule(
  'royal-booking-retention',
  '0 * * * *',
  'select royal_private.purge_expired_studio_bookings();'
);

-- Apply retention immediately to existing data as well as on subsequent runs.
select royal_private.purge_expired_studio_bookings();
