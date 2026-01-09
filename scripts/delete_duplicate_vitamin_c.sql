-- Delete duplicate Vitamin C recipe from database
-- This recipe has description: "C-1000的酸甜氣泡，搭配伏特加的清冽。感冒好像都好了一半？(誤)，這絕對是維他命炸彈！"

DELETE FROM recipes 
WHERE description->>'zh' LIKE '%C-1000的酸甜氣泡%'
  AND description->>'zh' LIKE '%維他命炸彈%';

-- Verify deletion
SELECT id, name, description->>'zh' as description_zh 
FROM recipes 
WHERE name->>'zh' LIKE '%維他命%';
