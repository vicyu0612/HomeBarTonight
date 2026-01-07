-- Create table for featured banners
create table if not exists public.featured_banners (
    id uuid default gen_random_uuid() primary key,
    title_en text not null,
    title_zh text not null,
    subtitle_en text,
    subtitle_zh text,
    cover_image text,
    target_collection_id text not null,
    theme_color text, -- CSS gradient class or hex, fallback if no image
    start_time timestamptz,
    end_time timestamptz,
    is_active boolean default false,
    created_at timestamptz default now()
);

-- Enable RLS
alter table public.featured_banners enable row level security;

-- Policy: Everyone can read active banners
create policy "Public can view active banners"
on public.featured_banners
for select
to public
using (is_active = true);

-- Insert sample data (CNY Banner)
insert into public.featured_banners (title_en, title_zh, subtitle_en, subtitle_zh, cover_image, target_collection_id, theme_color, is_active)
values (
    'Winter Warmers',
    '過年暖心特輯',
    'Cozy cocktails for the festive season',
    '氣溫驟降時，沒什麼比一杯熱調酒更棒了',
    '/cocktails/cny_mahjong.png',
    'winter-warmers',
    'from-orange-600 via-red-600 to-rose-900',
    true
);
