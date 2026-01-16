-- Refine Categorization Part 6 (Lemon/Lime -> Essential Basic)

-- Move Lemon and Lime to Essential -> Basic
UPDATE public.ingredients 
SET category = 'essential', subcategory = 'basic' 
WHERE id IN ('lemon', 'lime');
