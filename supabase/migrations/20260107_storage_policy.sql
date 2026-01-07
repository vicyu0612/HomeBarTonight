-- Create the 'cocktails' bucket if it doesn't exist
insert into storage.buckets (id, name, public)
values ('cocktails', 'cocktails', true)
on conflict (id) do nothing;

-- 1. DROP Existing Policies to avoid conflicts
drop policy if exists "Public Access" on storage.objects;
drop policy if exists "Allow Public Access" on storage.objects; -- Handle alternate name
drop policy if exists "Allow Uploads" on storage.objects;
drop policy if exists "Allow Public Uploads" on storage.objects;
drop policy if exists "Allow Updates" on storage.objects;
drop policy if exists "Allow Public Updates" on storage.objects;

-- 2. Re-create Permissive Policies

-- Allow Public Access (Read)
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'cocktails' );

-- Allow Public Uploads (For migration)
create policy "Allow Uploads"
on storage.objects for insert
with check ( bucket_id = 'cocktails' );

-- Allow Updates/Overwrites
create policy "Allow Updates"
on storage.objects for update
using ( bucket_id = 'cocktails' );
