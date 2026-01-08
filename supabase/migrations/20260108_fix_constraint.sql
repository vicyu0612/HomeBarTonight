
-- Fix for "Sign up not completed" caused by constraint violation
-- Dropping the username length check which fails for short email prefixes

alter table public.profiles drop constraint if exists username_length;
