create extension if not exists pgcrypto;

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  category text not null check (category in ('workshop', 'competition', 'talk', 'hackathon')),
  event_date timestamptz not null,
  registration_link text,
  is_published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists events_event_date_idx on public.events (event_date);
create index if not exists events_published_sort_idx on public.events (is_published, sort_order, event_date);

alter table public.events enable row level security;

drop policy if exists "Public can read published events" on public.events;
create policy "Public can read published events"
on public.events
for select
to anon, authenticated
using (is_published = true);

drop policy if exists "Authenticated users can manage events" on public.events;
create policy "Authenticated users can manage events"
on public.events
for all
to authenticated
using (true)
with check (true);

insert into public.events (
  title,
  description,
  category,
  event_date,
  registration_link,
  is_published,
  sort_order
)
values
  (
    'HackNirma 2025',
    '24-hour hackathon with prizes worth ₹1,00,000. Build innovative solutions.',
    'hackathon',
    '2025-04-15T09:00:00+05:30',
    null,
    true,
    1
  ),
  (
    'AI/ML Workshop',
    'Hands-on workshop on building machine learning models from scratch.',
    'workshop',
    '2025-04-22T10:00:00+05:30',
    null,
    true,
    2
  ),
  (
    'Tech Talk: Web3 & Blockchain',
    'Industry expert discusses the future of decentralized web.',
    'talk',
    '2025-05-05T17:00:00+05:30',
    null,
    true,
    3
  )
on conflict do nothing;

create table if not exists public.board_members (
  id uuid primary key default gen_random_uuid(),
  full_name text not null unique,
  position text not null,
  bio text not null,
  theme_variant text not null default 'primary' check (theme_variant in ('primary', 'secondary', 'inverse')),
  photo_url text,
  linkedin_url text,
  is_published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.board_members add column if not exists photo_url text;

create index if not exists board_members_published_sort_idx on public.board_members (is_published, sort_order, full_name);

alter table public.board_members enable row level security;

drop policy if exists "Public can read published board members" on public.board_members;
create policy "Public can read published board members"
on public.board_members
for select
to anon, authenticated
using (is_published = true);

drop policy if exists "Authenticated users can manage board members" on public.board_members;
create policy "Authenticated users can manage board members"
on public.board_members
for all
to authenticated
using (true)
with check (true);

insert into public.board_members (
  full_name,
  position,
  bio,
  theme_variant,
  photo_url,
  linkedin_url,
  is_published,
  sort_order
)
values
  (
    'Arjun Patel',
    'Chairperson',
    'Final year CSE student passionate about AI and community building.',
    'primary',
    null,
    null,
    true,
    1
  ),
  (
    'Priya Sharma',
    'Vice Chair',
    'Leading initiatives in cloud computing and open source advocacy.',
    'secondary',
    null,
    null,
    true,
    2
  ),
  (
    'Rahul Mehta',
    'Technical Lead',
    'Full-stack developer and competitive programmer with 1500+ on Codeforces.',
    'inverse',
    null,
    null,
    true,
    3
  ),
  (
    'Ananya Desai',
    'Design Lead',
    'UI/UX enthusiast crafting beautiful and accessible digital experiences.',
    'primary',
    null,
    null,
    true,
    4
  ),
  (
    'Karan Singh',
    'Event Lead',
    'Organized 20+ tech events and hackathons with 1000+ participants.',
    'secondary',
    null,
    null,
    true,
    5
  ),
  (
    'Neha Joshi',
    'Marketing Lead',
    'Building the IEEE CS Nirma brand across digital platforms.',
    'inverse',
    null,
    null,
    true,
    6
  )
on conflict (full_name) do nothing;