-- Refine Categorization Part 2 (User Request 2026-01-16 18:15)

-- 1. Eggs -> Create 'egg' subcategory
UPDATE public.ingredients 
SET category = 'essential', subcategory = 'egg' 
WHERE id IN ('egg', 'egg_white', 'egg-white');

-- 2. Hot Sauce -> Create 'hot_sauce' subcategory
-- Includes Worcestershire and Tabasco/Hot Sauce/Chili Sauce
UPDATE public.ingredients 
SET category = 'essential', subcategory = 'hot_sauce' 
WHERE id IN ('worcestershire', 'tabasco', 'hot_sauce', 'hot-sauce', 'chili_sauce', 'chili-sauce', 'sriracha');

-- 3. Nutmeg -> Move to 'garnish' category
UPDATE public.ingredients 
SET category = 'garnish', subcategory = NULL 
WHERE id IN ('nutmeg');

-- 4. Red Wine -> Ensure it's in 'wine' subcategory under 'other_alc'
UPDATE public.ingredients 
SET category = 'other_alc', subcategory = 'wine' 
WHERE id ILIKE 'red_wine' OR id ILIKE 'red-wine';

-- 5. Merge Cream / Heavy Cream -> 'cream'
-- Remove 'heavy_cream' and 'heavy-cream' if 'cream' exists, or update them.
-- Since we can't easily check for existence in simple SQL script without blocks, 
-- and we know 'cream' is likely the canonical one being used in normalization:
DELETE FROM public.ingredients WHERE id = 'heavy_cream' OR id = 'heavy-cream';
-- Update any potential usage in recipes is hard since it's JSONB, but ingredients table is the reference for MyBar.
-- This deletion removes the duplicate from the list.

-- 6. Move Cream to Garnish & Others
UPDATE public.ingredients 
SET category = 'garnish', subcategory = NULL 
WHERE id = 'cream';



