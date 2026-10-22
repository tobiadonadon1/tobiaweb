-- A plan Tobia gives by hand (himself, a friend, a tester): no Stripe, no
-- invoice. lib/membership reads it beside the subscriptions and the higher
-- of the two wins, so a grant never takes away what someone pays for.
-- Set it with: node scripts/grant-tier.mjs <email> <tier|none>
alter table public.members add column if not exists granted_tier text
  check (granted_tier in ('pro', 'ultimate', 'universal'));

-- Training rows now say which shelf they belong to, so the Masterclass and
-- Design shelves are rows too (a lesson, a template) and are handed out by
-- the same plan check as the training.
alter table public.training add column if not exists shelf text not null default 'training'
  check (shelf in ('training', 'masterclass', 'design'));
alter table public.training drop constraint if exists training_kind_check;
alter table public.training add constraint training_kind_check
  check (kind in ('video', 'file', 'link', 'template'));
