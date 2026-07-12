create extension if not exists pgcrypto;

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  password_hash text not null,
  phone text not null default '',
  role text not null default 'customer' check (role in ('admin', 'customer')),
  status text not null default 'active' check (status in ('active', 'disabled')),
  last_login_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  client_name text not null,
  email text not null,
  phone text not null,
  event_type text not null,
  package_name text not null,
  event_date text not null,
  location text not null,
  guest_count integer not null check (guest_count >= 1),
  serving_style text not null,
  payment_option text not null,
  special_requests text not null default '',
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'completed', 'cancelled')),
  notes text not null default '',
  created_by uuid references public.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.menu_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  description text not null,
  price numeric(12, 2) not null default 0 check (price >= 0),
  status text not null default 'available' check (status in ('available', 'featured', 'seasonal', 'out-of-stock')),
  image_url text not null default '',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references public.bookings(id) on delete set null,
  booking_reference text not null,
  customer_name text not null,
  phone text not null,
  amount numeric(12, 2) not null default 0 check (amount >= 0),
  method text not null default 'M-Pesa',
  status text not null default 'completed' check (status in ('pending', 'completed', 'failed', 'refunded')),
  transaction_id text not null default '',
  paid_at timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.quotes (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  email text not null,
  phone text not null default '',
  event_type text not null,
  guest_count integer not null default 0 check (guest_count >= 0),
  event_date text not null default '',
  location text not null default '',
  budget numeric(12, 2) not null default 0 check (budget >= 0),
  notes text not null default '',
  status text not null default 'review' check (status in ('review', 'quoted', 'accepted', 'declined')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists set_users_updated_at on public.users;
create trigger set_users_updated_at
before update on public.users
for each row
execute function public.set_updated_at();

drop trigger if exists set_bookings_updated_at on public.bookings;
create trigger set_bookings_updated_at
before update on public.bookings
for each row
execute function public.set_updated_at();

drop trigger if exists set_menu_items_updated_at on public.menu_items;
create trigger set_menu_items_updated_at
before update on public.menu_items
for each row
execute function public.set_updated_at();

drop trigger if exists set_payments_updated_at on public.payments;
create trigger set_payments_updated_at
before update on public.payments
for each row
execute function public.set_updated_at();

drop trigger if exists set_quotes_updated_at on public.quotes;
create trigger set_quotes_updated_at
before update on public.quotes
for each row
execute function public.set_updated_at();
