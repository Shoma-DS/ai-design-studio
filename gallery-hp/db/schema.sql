create table if not exists websites (
  slug text primary key,
  title text not null,
  heading text not null,
  category text not null,
  mood_tags text[] not null default '{}',
  product_tags text[] not null default '{}',
  feature_tags text[] not null default '{}',
  url text not null,
  thumbnail text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
