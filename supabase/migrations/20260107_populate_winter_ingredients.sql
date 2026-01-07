-- Populate 'ingredients' table with Winter Warmers ingredients for My Bar filtering
-- Schema confirmed via frontend Interface: id, name_en, name_zh, category

insert into public.ingredients (id, name_en, name_zh, category)
values
-- Spirits (Base)
('whiskey', 'Whiskey', '威士忌', 'base'),
('rum', 'Rum', '蘭姆酒', 'base'),
('brandy', 'Brandy', '白蘭地', 'base'),

-- Liqueurs
('baileys', 'Baileys Irish Cream', '貝禮詩奶酒', 'liqueur'),

-- Mixers & Others
('red-wine', 'Red Wine', '紅酒', 'other_alc'),
('hot-coffee', 'Hot Coffee', '熱咖啡', 'mixer'),
('milk', 'Milk', '牛奶', 'mixer'),
('heavy-cream', 'Heavy Cream', '鮮奶油', 'mixer'),
('hot-chocolate', 'Hot Chocolate', '熱可可', 'mixer'),
('butter', 'Butter', '奶油', 'garnish'), -- Categorizing as garnish/other
('egg-yolk', 'Egg Yolk', '蛋黃', 'garnish'),
('honey', 'Honey', '蜂蜜', 'essential'), -- Essential sweetener
('sugar', 'Sugar', '糖', 'essential'),
('brown-sugar', 'Brown Sugar', '紅糖', 'essential')

on conflict (id) do update 
set 
    name_en = excluded.name_en,
    name_zh = excluded.name_zh,
    category = excluded.category;
