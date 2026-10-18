-- Run in the existing project's Supabase SQL editor as its database owner.
-- Prerequisite: database/bookings.sql has already created studio_bookings.
-- This permanently deletes every request/status 72 hours after appointment
-- END in India time. The hourly job removes eligible rows within one hour.
-- Rerunning this migration safely updates the same named scheduled job.

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

-- Optional read-only checks. Run these separately in the SQL editor to confirm
-- the hourly job is active and inspect its five most recent scheduled runs.
-- select jobid, jobname, schedule, active
-- from cron.job
-- where jobname = 'royal-booking-retention';
--
-- select status, start_time, end_time, return_message
-- from cron.job_run_details
-- where jobid in (
--   select jobid from cron.job where jobname = 'royal-booking-retention'
-- )
-- order by start_time desc
-- limit 5;
