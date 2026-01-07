-- Create the 'cocktails' bucket if it doesn't exist
insert into storage.buckets (id, name, public)
values ('cocktails', 'cocktails', true)
on conflict (id) do nothing;

-- Allow Public Access (Read)
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'cocktails' );

-- Allow Public Uploads (For initial sync script usage - remove later if needed)
-- NOTE: In production, restrict this to authenticated users or service role
create policy "Allow Uploads"
on storage.objects for insert
with check ( bucket_id = 'cocktails' );

-- Allow Updates/Overwrites
create policy "Allow Updates"
on storage.objects for update
using ( bucket_id = 'cocktails' );
