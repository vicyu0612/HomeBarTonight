-- Move Cream to Garnish & Others (Isolated execution)
UPDATE public.ingredients 
SET category = 'garnish', subcategory = NULL 
WHERE id = 'cream';
