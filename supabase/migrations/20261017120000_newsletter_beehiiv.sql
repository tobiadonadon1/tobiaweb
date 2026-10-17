-- The newsletter list, connected to beehiiv ("Notes from Tobi").
-- lib/newsletter.ts keeps one row per address that ticked a box on the site;
-- lib/beehiiv.ts sends it to beehiiv, and beehiiv's unsubscribe webhook
-- (app/api/newsletter/beehiiv) comes back here.
--
-- Safe to run more than once, and on its own: the table is created here too
-- in case 20261016220000_newsletter.sql was never applied.

create table if not exists public.newsletter (
  email text primary key,
  source text,
  consented_at timestamptz not null default now()
);

alter table public.newsletter
  -- Which box: account_signup, free_skill or login_prompt (beehiiv's utm_campaign).
  add column if not exists campaign text,
  -- subscribed, or unsubscribed (in beehiiv, or beehiiv already had them as
  -- unsubscribed). An unsubscribed row is never turned back on by the site.
  add column if not exists status text not null default 'subscribed',
  add column if not exists unsubscribed_at timestamptz,
  -- beehiiv's side: its subscription id and status, and when it accepted the
  -- address. synced_at null on a subscribed row = still owed to beehiiv
  -- (it was down); the daily sweep (app/api/newsletter/sync) sends it.
  add column if not exists beehiiv_id text,
  add column if not exists beehiiv_status text,
  add column if not exists synced_at timestamptz,
  add column if not exists sync_attempts integer not null default 0,
  add column if not exists sync_error text,
  add column if not exists updated_at timestamptz not null default now();

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'newsletter_status_check') then
    alter table public.newsletter
      add constraint newsletter_status_check check (status in ('subscribed', 'unsubscribed'));
  end if;
end $$;

create index if not exists newsletter_owed
  on public.newsletter (consented_at)
  where status = 'subscribed' and synced_at is null;

-- Server-only, like members: RLS on, no policies.
alter table public.newsletter enable row level security;

-- Consent is a box nobody finds ticked: a new account is off the list until
-- it says yes.
alter table public.members alter column mailing set default false;
