-- Copycat Detective checks run on the page by signed-in members: what was
-- checked and what it found, and the count behind the daily limits.
-- Server-only, like members and downloads.
create table if not exists public.copycat_checks (
  id bigint generated always as identity primary key,
  member_id uuid not null references public.members (id) on delete cascade,
  inputs text[] not null,
  verdict text,
  created_at timestamptz not null default now()
);
alter table public.copycat_checks enable row level security;
-- No policies: anon and authenticated roles can't touch it.
create index if not exists copycat_checks_member_recent on public.copycat_checks (member_id, created_at desc);
create index if not exists copycat_checks_recent on public.copycat_checks (created_at desc);
