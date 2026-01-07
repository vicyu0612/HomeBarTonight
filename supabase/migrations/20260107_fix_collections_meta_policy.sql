-- Allow Public/Anon Insert & Update on collections_meta
-- CAUTION: This is for development/seeding. In production, protect this or use Service Role.

create policy "Allow Public Insert"
on public.collections_meta for insert
with check (true);

create policy "Allow Public Update"
on public.collections_meta for update
using (true);
