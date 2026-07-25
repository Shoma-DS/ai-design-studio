create table if not exists banners (
  slug text primary key,
  title text not null,
  heading text not null,
  category text not null,
  mood_tags text[] not null default '{}',
  product_tags text[] not null default '{}',
  feature_tags text[] not null default '{}',
  url text not null,
  thumbnail text not null,
  width integer not null check (width > 0),
  height integer not null check (height > 0),
  format text not null default 'png'
    check (format in ('png', 'jpg', 'jpeg', 'webp')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
