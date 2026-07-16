create table if not exists reference_sites (
  slug text primary key,
  name text not null,
  url text not null,
  categories text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
