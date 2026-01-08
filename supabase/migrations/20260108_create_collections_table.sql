-- Create collections table
create table if not exists public.collections (
    id text primary key,
    title jsonb not null, -- {"en": "...", "zh": "..."}
    subtitle jsonb not null, -- {"en": "...", "zh": "..."}
    type text not null check (type in ('curated', 'filter')),
    recipe_ids text[], -- Array of strings for curated collections
    filter_rules jsonb, -- {"type": "cvs"} or {"tag": "party", "logic": "OR", "min_ease": 8}
    cover_image text,
    theme_color text,
    description jsonb,
    sort_order integer default 0,
    is_active boolean default true,
    created_at timestamptz default now()
);

-- Enable RLS
alter table public.collections enable row level security;

-- Policies
create policy "Public full access to collections"
    on public.collections for select
    using (true);

create policy "Admins can insert/update collections"
    on public.collections for all
    using (auth.role() = 'service_role')
    with check (auth.role() = 'service_role');

-- Seed Initial Data
insert into public.collections (id, title, subtitle, type, recipe_ids, filter_rules, cover_image, theme_color, description, sort_order)
values
(
    'winter-warmers',
    '{"en": "Winter Warmers", "zh": "過年暖心特輯"}'::jsonb,
    '{"en": "Cozy up with these hot cocktails", "zh": "寒流來襲？來杯熱酒暖暖身"}'::jsonb,
    'curated',
    array['hot-toddy', 'mulled-wine', 'irish-coffee', 'hot-buttered-rum', 'eggnog', 'baileys-hot-chocolate'],
    null,
    '/cocktails/cny_mahjong.png',
    'from-orange-600 via-red-600 to-rose-900',
    '{"en": "When the temperature drops, nothing beats a hot cocktail. From the medicinal Hot Toddy to the festive Mulled Wine, these recipes are designed to keep you warm from the inside out.", "zh": "氣溫驟降時，沒什麼比一杯熱調酒更棒了。從具有療效感的熱托迪到節慶必備的熱紅酒，這些酒譜將由內而外溫暖你的心。"}'::jsonb,
    1
),
(
    'cvs-hacks',
    '{"en": "Convenience Store Mixology", "zh": "超商創意特調"}'::jsonb,
    '{"en": "Creative drinks from the corner store", "zh": "便利商店就能買齊材料"}'::jsonb,
    'filter',
    null,
    '{"type": "cvs"}'::jsonb,
    '/cocktails/cvs_party.png',
    'from-blue-600 to-indigo-900',
    '{"en": "Quickly grab ingredients from your local store and craft creative cocktails. No professional bar gear needed.", "zh": "不需專業酒吧設備，用巷口超商買得到的材料，也能輕鬆調出好喝的酒。"}'::jsonb,
    2
),
(
    'party-time',
    '{"en": "Party Starters", "zh": "派對必備"}'::jsonb,
    '{"en": "Crowd pleaders for any gathering", "zh": "炒熱氣氛的最佳選擇"}'::jsonb,
    'filter',
    null,
    '{"tag": "party", "logic": "OR", "min_ease": 8}'::jsonb,
    '/cocktails/party_starters.png',
    'from-purple-600 to-pink-900',
    '{"en": "Crowd-pleasing recipes that are easy to make in big batches or quick to serve. Perfect for hosting.", "zh": "適合多人聚會的簡單酒譜，製作快速或適合大量調製。成為派對主人的最佳幫手。"}'::jsonb,
    3
)
on conflict (id) do update set
    title = excluded.title,
    subtitle = excluded.subtitle,
    type = excluded.type,
    recipe_ids = excluded.recipe_ids,
    filter_rules = excluded.filter_rules,
    cover_image = excluded.cover_image,
    theme_color = excluded.theme_color,
    description = excluded.description,
    sort_order = excluded.sort_order;
