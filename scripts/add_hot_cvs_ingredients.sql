-- Add new ingredients for CVS Hot Cocktails
-- Run this in Supabase SQL Editor

INSERT INTO ingredients (id, name_en, name_zh, category)
VALUES 
  ('white_wine', 'White Wine', '白葡萄酒', 'other_alc'),
  ('jagermeister', 'Jagermeister', '野格', 'other_alc'),
  ('milk_tea', 'Milk Tea', '奶茶', 'mixer'),
  ('ginger_tea', 'Ginger Tea', '薑茶', 'mixer'),
  ('peach_juice', 'Peach Juice', '水蜜桃汁', 'mixer'),
  ('grass_jelly', 'Grass Jelly', '燒仙草', 'mixer'),
  ('barley_tea', 'Barley Tea', '麥仔茶', 'mixer')
ON CONFLICT (id) DO UPDATE 
SET category = EXCLUDED.category, name_en = EXCLUDED.name_en, name_zh = EXCLUDED.name_zh;
