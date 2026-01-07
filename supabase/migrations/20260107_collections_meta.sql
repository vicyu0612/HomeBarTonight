-- 1. Create 'collection_images' bucket
insert into storage.buckets (id, name, public)
values ('collection_images', 'collection_images', true)
on conflict (id) do nothing;

create policy "Public Access Collection Images"
on storage.objects for select
using ( bucket_id = 'collection_images' );

create policy "Allow Uploads Collection Images"
on storage.objects for insert
with check ( bucket_id = 'collection_images' );

create policy "Allow Updates Collection Images"
on storage.objects for update
using ( bucket_id = 'collection_images' );

-- 2. Create 'collections_meta' table
create table if not exists public.collections_meta (
    id text primary key, -- matches 'cvs-hacks', 'winter-warmers'
    cover_image text not null, -- Public URL
    title_en text, 
    title_zh text,
    description_en text,
    description_zh text,
    updated_at timestamptz default now()
);

-- RLS
alter table public.collections_meta enable row level security;

create policy "Public View Collections Meta"
on public.collections_meta for select
to public
using (true);

create policy "Service Role Manage Collections Meta"
on public.collections_meta for all
to service_role
using (true)
with check (true);
