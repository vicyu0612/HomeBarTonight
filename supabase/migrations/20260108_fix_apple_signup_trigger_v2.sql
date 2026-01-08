
-- Fix for "column does not exist" error
-- This script safely adds missing columns to the profiles table

-- 1. Add columns if they don't exist
alter table public.profiles add column if not exists avatar_url text;
alter table public.profiles add column if not exists full_name text;
alter table public.profiles add column if not exists username text;

-- 2. Make them nullable (just in case)
alter table public.profiles alter column avatar_url drop not null;
alter table public.profiles alter column full_name drop not null;
alter table public.profiles alter column username drop not null;

-- 3. Update the Trigger Function
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url, username)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'New User'),
    coalesce(new.raw_user_meta_data->>'avatar_url', ''),
    coalesce(new.raw_user_meta_data->>'user_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do update set
    full_name = excluded.full_name,
    avatar_url = excluded.avatar_url,
    updated_at = now();
  return new;
end;
$$;
