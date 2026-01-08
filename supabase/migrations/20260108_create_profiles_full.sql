
-- Remove strict constraint that might be causing "Sign up not completed"
-- (If email prefix < 3 chars, this constraint fails trigger)
alter table public.profiles drop constraint if exists username_length;


-- 1. Create table if it doesn't exist
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  username text,
  full_name text,
  avatar_url text,
  website text,
  constraint username_length check (char_length(username) >= 3)
);

-- 2. Enable RLS
alter table public.profiles enable row level security;

-- 3. Create policies (Public Read, Self Update)
create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- 4. Update the Trigger Function
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

-- 5. Helper: Re-bind trigger (Safe to run multiple times)
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
