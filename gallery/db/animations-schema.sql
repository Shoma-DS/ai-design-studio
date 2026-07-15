create table if not exists animations (
  slug text primary key,
  name text not null,
  category text not null,
  description text not null,
  css_code text not null,
  html_snippet text,
  js_code text,
  tags text[] not null default '{}',
  use_case text,
  mood_tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table animations add column if not exists mood_tags text[] not null default '{}';
