create table if not exists portfolio_items (
  slug text primary key,
  type text not null check (type in ('lp', 'hp', 'moving-lp', 'swipe-lp', 'banner', 'thumbnail', 'sns-post', 'flyer')),
  title text not null,
  heading text,
  category text not null,
  mood_tags text[] not null default '{}',
  product_tags text[] not null default '{}',
  feature_tags text[] not null default '{}',
  link_type text not null default 'external' check (link_type in ('external', 'image')),
  url text not null,
  thumbnail text not null,
  -- 誰が作った作品かを残す欄。登録時に指定が無ければ git config user.name が自動で入る。
  -- 既存slugの更新では上書きせず、最初に記録した制作者を保持する。
  author text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 既存DBへの追加用マイグレーション（2026-08-04）
alter table portfolio_items add column if not exists author text;

-- 旧テーブル(landing_pages/websites)からの移行元データ。type='lp'/'hp'として統合済み。
-- 旧テーブル自体は削除せずそのまま残す（他スクリプトからの参照・ロールバック用）。
