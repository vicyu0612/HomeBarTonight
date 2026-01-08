
-- Allow users to delete their own account
-- This is required for App Store Guideline 5.1.1

create or replace function public.delete_own_account()
returns void
language plpgsql
security definer
as $$
begin
  -- Delete the user from auth.users
  -- This will cascade to profiles, favorites, inventory etc.
  delete from auth.users where id = auth.uid();
end;
$$;
