INSERT INTO ingredients (id, name_en, name_zh, category)
VALUES 
  ('ginger_beer', 'Ginger Beer', '薑汁啤酒', 'mixer')
ON CONFLICT (id) DO UPDATE 
SET category = EXCLUDED.category, name_en = EXCLUDED.name_en, name_zh = EXCLUDED.name_zh;
