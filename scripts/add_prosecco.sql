-- Add Prosecco to ingredients table
INSERT INTO ingredients (id, name_en, name_zh, category)
VALUES 
  ('prosecco', 'Prosecco', 'Prosecco氣泡酒', 'other_alc')
ON CONFLICT (id) DO UPDATE 
SET category = EXCLUDED.category, name_en = EXCLUDED.name_en, name_zh = EXCLUDED.name_zh;
