-- The newsletter: every address that ticked "Get my latest free skills,
-- experiments and projects by email" (lib/newsletter.ts), on Create account,
-- Sign in or under a free claim button. One row per address, the first time
-- and place it was ticked. Server-only, like members: RLS on, no policies.
create table if not exists public.newsletter (
  email text primary key,
  source text,
  consented_at timestamptz not null default now()
);
alter table public.newsletter enable row level security;
-- No policies: anon and authenticated roles can't touch it.

-- Consent is now a box nobody finds ticked: a new account is off the list
-- until it says yes (the sign-up route writes the answer explicitly). Rows
-- that already exist keep their value.
alter table public.members alter column mailing set default false;
