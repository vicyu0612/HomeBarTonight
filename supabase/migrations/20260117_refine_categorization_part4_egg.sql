-- Refine Categorization Part 4 (Merge Eggs)

-- 1. Update 'egg' to be the canonical ingredient
-- Rename it to "Egg / Egg White" and move to Essential -> Other (subcategory NULL)
UPDATE public.ingredients 
SET 
  name_en = 'Egg / Egg White',
  name_zh = '蛋 / 蛋白',
  category = 'essential', 
  subcategory = NULL 
WHERE id = 'egg';

-- 2. Remove 'egg_white' (Merge into 'egg')
DELETE FROM public.ingredients 
WHERE id = 'egg_white' OR id = 'egg-white';
