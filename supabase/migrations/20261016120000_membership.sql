-- Construct membership: Pro and Ultimate are Stripe subscriptions, kept here
-- as a fast copy of what Stripe says (the webhook writes it, lib/membership
-- reads it). Stripe stays the truth: a row is only ever written from a
-- subscription fetched from Stripe. Server-only, like members: RLS on, no
-- policies, read and written with the secret key.

-- The member's Stripe customer, one per Stripe mode (test ids are not live ids).
alter table public.members add column if not exists stripe_customer_id text unique;
alter table public.members add column if not exists stripe_test_customer_id text unique;

create table if not exists public.subscriptions (
  id text primary key,                      -- Stripe subscription id, sub_…
  member_id uuid not null references public.members (id) on delete cascade,
  customer_id text not null,
  tier text not null check (tier in ('pro', 'ultimate', 'universal')),
  status text not null,                     -- Stripe's: active, trialing, past_due, canceled, …
  price_id text,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  livemode boolean not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.subscriptions enable row level security;
create index if not exists subscriptions_member on public.subscriptions (member_id);

-- One-time purchases (premium and unique skills), so a member's library can
-- find what they bought. The Stripe session is the receipt; this is its index.
create table if not exists public.purchases (
  session_id text primary key,              -- cs_…
  member_id uuid references public.members (id) on delete set null,
  email text,
  product text not null,
  amount integer not null,                  -- minor units actually charged
  currency text not null,
  livemode boolean not null,
  created_at timestamptz not null default now()
);
alter table public.purchases enable row level security;
create index if not exists purchases_member on public.purchases (member_id);
create index if not exists purchases_email on public.purchases (lower(email));

-- Training: videos and files for members. The url is only ever handed to a
-- member whose tier reaches the row's tier, so it can be an unlisted link.
create table if not exists public.training (
  id text primary key,
  title text not null,
  summary text,
  tier text not null check (tier in ('pro', 'ultimate')),
  kind text not null default 'video' check (kind in ('video', 'file', 'link')),
  url text not null,
  sort integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.training enable row level security;

-- Ultimate members ask for skills and vote on what gets built next.
create table if not exists public.skill_requests (
  id bigint generated always as identity primary key,
  member_id uuid not null references public.members (id) on delete cascade,
  title text not null check (char_length(title) between 3 and 120),
  details text check (char_length(details) <= 2000),
  status text not null default 'open' check (status in ('open', 'planned', 'building', 'shipped', 'declined')),
  created_at timestamptz not null default now()
);
alter table public.skill_requests enable row level security;

create table if not exists public.skill_votes (
  request_id bigint not null references public.skill_requests (id) on delete cascade,
  member_id uuid not null references public.members (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (request_id, member_id)
);
alter table public.skill_votes enable row level security;

-- Commissions (Ultimate: a skill built for them) and Universal enquiries
-- (anyone: "let's talk"). Tobia also gets each one by email.
create table if not exists public.inquiries (
  id bigint generated always as identity primary key,
  kind text not null check (kind in ('commission', 'universal')),
  member_id uuid references public.members (id) on delete set null,
  email text not null,
  name text,
  body text not null check (char_length(body) between 10 and 4000),
  budget text,
  status text not null default 'new',
  created_at timestamptz not null default now()
);
alter table public.inquiries enable row level security;
