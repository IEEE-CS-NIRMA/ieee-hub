create extension if not exists pgcrypto;

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  category text not null check (category in ('workshop', 'competition', 'talk', 'hackathon')),
  event_date timestamptz not null,
  poster_url text,
  registration_mode text not null default 'external' check (registration_mode in ('external', 'internal')),
  registration_link text,
  is_published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.events add column if not exists poster_url text;
alter table public.events add column if not exists registration_mode text;
update public.events set registration_mode = 'external' where registration_mode is null;
alter table public.events alter column registration_mode set default 'external';
alter table public.events alter column registration_mode set not null;

alter table public.events drop constraint if exists events_registration_mode_check;
alter table public.events
add constraint events_registration_mode_check
check (registration_mode in ('external', 'internal'));

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
  poster_url,
  registration_mode,
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
    'external',
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
    'external',
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
    'external',
    null,
    true,
    3
  )
on conflict do nothing;

create table if not exists public.event_registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text,
  college text,
  year text,
  branch text,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists event_registrations_event_idx on public.event_registrations (event_id, created_at desc);
create unique index if not exists event_registrations_unique_event_email_idx on public.event_registrations (event_id, lower(email));

alter table public.event_registrations enable row level security;

drop policy if exists "Anyone can submit event registration" on public.event_registrations;
create policy "Anyone can submit event registration"
on public.event_registrations
for insert
to anon, authenticated
with check (true);

drop policy if exists "Authenticated users can view event registrations" on public.event_registrations;
create policy "Authenticated users can view event registrations"
on public.event_registrations
for select
to authenticated
using (true);

create table if not exists public.board_members (
  id uuid primary key default gen_random_uuid(),
  full_name text not null unique,
  position text not null,
  bio text not null,
  theme_variant text not null default 'primary' check (theme_variant in ('primary', 'secondary', 'inverse')),
  photo_url text,
  photo_position_x integer not null default 50 check (photo_position_x between 0 and 100),
  photo_position_y integer not null default 50 check (photo_position_y between 0 and 100),
  linkedin_url text,
  is_published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.board_members add column if not exists photo_url text;
alter table public.board_members add column if not exists photo_position_x integer;
alter table public.board_members add column if not exists photo_position_y integer;
update public.board_members set photo_position_x = 50 where photo_position_x is null;
update public.board_members set photo_position_y = 50 where photo_position_y is null;
alter table public.board_members alter column photo_position_x set default 50;
alter table public.board_members alter column photo_position_y set default 50;
alter table public.board_members alter column photo_position_x set not null;
alter table public.board_members alter column photo_position_y set not null;

alter table public.board_members drop constraint if exists board_members_photo_position_x_check;
alter table public.board_members
add constraint board_members_photo_position_x_check
check (photo_position_x between 0 and 100);

alter table public.board_members drop constraint if exists board_members_photo_position_y_check;
alter table public.board_members
add constraint board_members_photo_position_y_check
check (photo_position_y between 0 and 100);

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
  photo_position_x,
  photo_position_y,
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
    50,
    50,
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
    50,
    50,
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
    50,
    50,
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
    50,
    50,
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
    50,
    50,
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
    50,
    50,
    null,
    true,
    6
  )
on conflict (full_name) do nothing;

create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  caption text,
  image_url text not null,
  alt_text text,
  category text,
  event_id uuid references public.events(id) on delete set null,
  taken_at timestamptz,
  is_published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists gallery_items_published_sort_idx
on public.gallery_items (is_published, sort_order, taken_at desc);

create index if not exists gallery_items_event_idx
on public.gallery_items (event_id);

alter table public.gallery_items enable row level security;

drop policy if exists "Public can read published gallery items" on public.gallery_items;
create policy "Public can read published gallery items"
on public.gallery_items
for select
to anon, authenticated
using (is_published = true);

drop policy if exists "Authenticated users can manage gallery items" on public.gallery_items;
create policy "Authenticated users can manage gallery items"
on public.gallery_items
for all
to authenticated
using (true)
with check (true);

insert into public.gallery_items (
  title,
  caption,
  image_url,
  alt_text,
  category,
  taken_at,
  is_published,
  sort_order
)
values
  (
    'Workshop Coding Session',
    'Hands-on workshop session with active coding.',
    'https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=900&q=80',
    'Students coding in a workshop',
    'workshop',
    '2025-06-05T10:00:00+05:30',
    true,
    1
  ),
  (
    'Team Collaboration',
    'Participants collaborating during a chapter event.',
    'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80',
    'Team collaboration during event',
    'event',
    '2025-06-12T12:30:00+05:30',
    true,
    2
  ),
  (
    'Speaker Session',
    'Industry expert session in the auditorium.',
    'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=900&q=80',
    'Speaker session in auditorium',
    'talk',
    '2025-06-20T16:00:00+05:30',
    true,
    3
  ),
  (
    'Hackathon Night',
    'Late-night build energy at the hackathon.',
    'https://images.unsplash.com/photo-1526378722484-bd91ca387e72?auto=format&fit=crop&w=900&q=80',
    'Night hackathon desk setup',
    'hackathon',
    '2025-07-01T22:00:00+05:30',
    true,
    4
  ),
  (
    'Winner Moments',
    'Winners celebrating after the final round.',
    'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=900&q=80',
    'Winners with medals',
    'competition',
    '2025-07-02T19:00:00+05:30',
    true,
    5
  ),
  (
    'Community Photo',
    'Group photo with students and organizers.',
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80',
    'Group photo at tech event',
    'community',
    '2025-07-05T18:30:00+05:30',
    true,
    6
  )
on conflict do nothing;