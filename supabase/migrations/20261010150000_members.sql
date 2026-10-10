-- Construct members: one row per account, filled by a trigger when someone
-- signs up. This is the mailing list. Nothing here is readable from the
-- browser: the site reads and writes it with the secret key on the server.
create table if not exists public.members (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  mailing boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.members enable row level security;
-- No policies: anon and authenticated roles can't touch it.

create or replace function public.handle_new_member() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.members (id, email) values (new.id, lower(new.email))
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_member();

-- Free downloads by members, for Tobia's own view of who took what.
create table if not exists public.downloads (
  id bigint generated always as identity primary key,
  member_id uuid not null references public.members (id) on delete cascade,
  product text not null,
  created_at timestamptz not null default now()
);
alter table public.downloads enable row level security;
