create extension if not exists "pgcrypto";

insert into storage.buckets (id, name, public)
values ('dearly-media', 'dearly-media', true)
on conflict (id) do update set public = true;

drop policy if exists "Public can read dearly media" on storage.objects;
create policy "Public can read dearly media"
on storage.objects
for select
to anon
using (bucket_id = 'dearly-media');

create table if not exists public.people (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  nickname text not null,
  relationship text not null default 'Other',
  status text not null default 'Active',
  birthday text,
  location text,
  description text,
  photo_url text,
  tags text[] default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.diary_entries (
  id uuid primary key default gen_random_uuid(),
  person_id uuid not null references public.people(id) on delete cascade,
  date date not null,
  title text not null,
  content text not null,
  mood text,
  tags text[] default '{}',
  is_public boolean not null default false,
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.favorite_items (
  id uuid primary key default gen_random_uuid(),
  person_id uuid not null references public.people(id) on delete cascade,
  category text not null,
  label text not null,
  value text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.wishlist_items (
  id uuid primary key default gen_random_uuid(),
  person_id uuid not null references public.people(id) on delete cascade,
  title text not null,
  category text not null,
  priority text not null default 'Medium',
  status text not null default 'Planned',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.timeline_events (
  id uuid primary key default gen_random_uuid(),
  person_id uuid not null references public.people(id) on delete cascade,
  date date not null,
  title text not null,
  description text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.little_things (
  id uuid primary key default gen_random_uuid(),
  person_id uuid not null references public.people(id) on delete cascade,
  text text not null,
  category text not null default 'Other',
  created_at timestamptz not null default now()
);

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  person_id uuid references public.people(id) on delete cascade,
  diary_entry_id uuid references public.diary_entries(id) on delete cascade,
  source_type text not null default 'profile',
  url text not null,
  storage_path text,
  alt_text text,
  created_at timestamptz not null default now()
);

alter table public.people enable row level security;
alter table public.diary_entries enable row level security;
alter table public.favorite_items enable row level security;
alter table public.wishlist_items enable row level security;
alter table public.timeline_events enable row level security;
alter table public.little_things enable row level security;
alter table public.media_assets enable row level security;

drop policy if exists "Public can read active people" on public.people;
create policy "Public can read active people"
on public.people
for select
to anon
using (status = 'Active');

drop policy if exists "Public can read public diary entries" on public.diary_entries;
create policy "Public can read public diary entries"
on public.diary_entries
for select
to anon
using (is_public = true);

drop policy if exists "Public can read favorite items for active people" on public.favorite_items;
create policy "Public can read favorite items for active people"
on public.favorite_items
for select
to anon
using (
  exists (
    select 1
    from public.people
    where people.id = favorite_items.person_id
    and people.status = 'Active'
  )
);

drop policy if exists "Public can read wishlist items for active people" on public.wishlist_items;
create policy "Public can read wishlist items for active people"
on public.wishlist_items
for select
to anon
using (
  exists (
    select 1
    from public.people
    where people.id = wishlist_items.person_id
    and people.status = 'Active'
  )
);

drop policy if exists "Public can read timeline events for active people" on public.timeline_events;
create policy "Public can read timeline events for active people"
on public.timeline_events
for select
to anon
using (
  exists (
    select 1
    from public.people
    where people.id = timeline_events.person_id
    and people.status = 'Active'
  )
);

drop policy if exists "Public can read little things for active people" on public.little_things;
create policy "Public can read little things for active people"
on public.little_things
for select
to anon
using (
  exists (
    select 1
    from public.people
    where people.id = little_things.person_id
    and people.status = 'Active'
  )
);

drop policy if exists "Public can read media for active people" on public.media_assets;
create policy "Public can read media for active people"
on public.media_assets
for select
to anon
using (
  person_id is null
  or exists (
    select 1
    from public.people
    where people.id = media_assets.person_id
    and people.status = 'Active'
  )
);
