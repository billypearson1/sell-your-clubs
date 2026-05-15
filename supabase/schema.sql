-- Clubs table and enum definitions
create type club_type as enum (
  'driver',
  'fairway_wood',
  'hybrid',
  'iron_set',
  'iron_individual',
  'wedge',
  'putter',
  'complete_bag'
);

create type role_type as enum ('admin', 'user');

create table if not exists clubs (
  id serial primary key,
  brand text not null,
  model text not null,
  club_type club_type not null,
  price_new numeric not null default 0,
  price_excellent numeric not null default 0,
  price_good numeric not null default 0,
  price_fair numeric not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text not null,
  collection_address text not null,
  paypal_email text not null,
  items jsonb not null,
  total_amount numeric not null,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  role role_type not null,
  created_at timestamptz not null default now()
);

-- Enable row level security for secure access control
alter table if exists clubs enable row level security;
alter table if exists orders enable row level security;
alter table if exists user_roles enable row level security;

-- Allow public browsing of clubs and admin management via role policies
create policy "Public select clubs" on clubs
  for select using (true);

create policy "Admin insert clubs" on clubs
  for insert using (exists (select 1 from user_roles ur where ur.user_id = auth.uid() and ur.role = 'admin'));

create policy "Admin update clubs" on clubs
  for update using (exists (select 1 from user_roles ur where ur.user_id = auth.uid() and ur.role = 'admin'));

create policy "Admin delete clubs" on clubs
  for delete using (exists (select 1 from user_roles ur where ur.user_id = auth.uid() and ur.role = 'admin'));

-- Orders are managed by admin users; inserts should normally be done via edge functions
create policy "Admin select orders" on orders
  for select using (exists (select 1 from user_roles ur where ur.user_id = auth.uid() and ur.role = 'admin'));

create policy "Admin update orders" on orders
  for update using (exists (select 1 from user_roles ur where ur.user_id = auth.uid() and ur.role = 'admin'));

-- Allow the Supabase service role to insert orders directly. No RLS policy is required for service role inserts.

-- User role lookups should be limited to the signed-in user's own role row
create policy "User select own role" on user_roles
  for select using (auth.uid() = user_id);

create policy "Admin insert roles" on user_roles
  for insert using (auth.role() = 'service_role');

create policy "Admin update roles" on user_roles
  for update using (auth.role() = 'service_role');
