-- Refine Categorization Part 5 (Essentials -> Basic)

-- Move all 'essential' ingredients with no subcategory to new 'basic' subcategory
UPDATE public.ingredients 
SET subcategory = 'basic' 
WHERE category = 'essential' AND subcategory IS NULL;
