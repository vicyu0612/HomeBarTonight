
-- Populate 'ingredients' table with CVS Cocktail ingredients for My Bar filtering
insert into public.ingredients (id, name_en, name_zh, category)
values
-- Spirits (Base)
('whiskey', 'Whiskey', '威士忌', 'base'),
('vodka', 'Vodka', '伏特加', 'base'),
('gin', 'Gin', '琴酒', 'base'),

-- Other Alcohol
('sake', 'Sake', '清酒', 'other_alc'),

-- Mixers
('oolong-tea', 'Oolong Tea', '烏龍茶', 'mixer'),
('calpis', 'Calpis', '可爾必思', 'mixer'),
('soda-water', 'Soda Water', '氣泡水', 'mixer'),
('energy-drink', 'Energy Drink', '能量飲料', 'mixer'),
('sports-drink', 'Sports Drink', '運動飲料', 'mixer'),
('lemon-tea', 'Lemon Tea', '檸檬紅茶', 'mixer'),

-- Essentials
('lemon', 'Lemon', '檸檬', 'essential'),
('ice', 'Ice', '冰塊', 'essential')

on conflict (id) do update 
set 
    name_en = excluded.name_en,
    name_zh = excluded.name_zh,
    category = excluded.category;
