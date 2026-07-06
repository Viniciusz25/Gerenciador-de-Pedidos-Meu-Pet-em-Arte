-- Estrutura inicial para escalar o painel Meu Pet em Arte em Supabase/PostgreSQL.
-- Os nomes seguem o sistema atual e podem receber RLS conforme os papeis do painel admin.

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  whatsapp text,
  address text,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id text primary key,
  client_id uuid references public.clients(id) on delete set null,
  client_name text not null,
  product text not null,
  quantity integer not null default 1,
  unit_value numeric(12, 2) not null default 0,
  total_sale numeric(12, 2) not null default 0,
  shipping_sp numeric(12, 2) not null default 0,
  total_with_shipping numeric(12, 2) not null default 0,
  payment_method text,
  order_date date not null default current_date,
  delivery_date date,
  tracking_code text,
  status text not null default 'Novo Pedido',
  production_time numeric(8, 2) not null default 0,
  material_used_grams numeric(10, 2) not null default 0,
  notes text,
  pet_photo_url text,
  generated_art_url text,
  keychain_mockup_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_events (
  id uuid primary key default gen_random_uuid(),
  order_id text not null references public.orders(id) on delete cascade,
  actor_id uuid,
  action text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.import_batches (
  id uuid primary key default gen_random_uuid(),
  file_name text not null,
  detected_columns text[] not null default '{}',
  mapped_columns jsonb not null default '{}'::jsonb,
  imported_count integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists orders_status_idx on public.orders(status);
create index if not exists orders_delivery_date_idx on public.orders(delivery_date);
create index if not exists orders_tracking_code_idx on public.orders(tracking_code);
