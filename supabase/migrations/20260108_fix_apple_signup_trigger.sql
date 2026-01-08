
-- Fix for Apple Sign In "Sign up not completed" error
-- This script ensures the 'handle_new_user' trigger function allows missing metadata (like avatar_url)

-- 1. Ensure profiles table exists and is flexible (Create if not exists)
create table if not exists public.profiles (
  id uuid references auth.users not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  website text,
  constraint username_length check (char_length(username) >= 3)
);

alter table public.profiles enable row level security;

-- 2. Make critical columns nullable to prevent Insert Errors
alter table public.profiles alter column username drop not null;
alter table public.profiles alter column avatar_url drop not null;
alter table public.profiles alter column full_name drop not null;

-- 3. Redefine the handler function to be ROBUST (Safe for Apple Sign In)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url, username)
  values (
    new.id,
    -- Try multiple fields for name, fallback to 'New User'
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'New User'),
    -- Avatar might be missing from Apple, default to empty
    coalesce(new.raw_user_meta_data->>'avatar_url', ''),
    -- Username might be missing, try to use email prefix
    coalesce(new.raw_user_meta_data->>'user_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do update set
    full_name = excluded.full_name,
    avatar_url = excluded.avatar_url,
    updated_at = now();
  return new;
end;
$$;

-- 4. Re-create the Trigger on auth.users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
