
-- Migration to add aliases to ingredients
ALTER TABLE ingredients ADD COLUMN IF NOT EXISTS aliases text[] DEFAULT '{}';

-- Upsert Ingredients

INSERT INTO ingredients (id, name_en, name_zh, category, aliases)
VALUES (
    'whiskey', 
    'Whiskey', 
    '威士忌', 
    'mixer', 
    ARRAY['小樣酒 (威士忌)', '小樣酒（威士忌）', '小樣酒', '波本或黑麥威士忌', '波本威士忌', '波本', '黑麥威士忌', 'bourbon or rye whiskey', 'mini whiskey bottle', 'bourbon', 'whiskey', 'rye whiskey']
)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    aliases = EXCLUDED.aliases;

INSERT INTO ingredients (id, name_en, name_zh, category, aliases)
VALUES (
    'gin', 
    'Gin', 
    '琴酒', 
    'mixer', 
    ARRAY['琴酒', 'gin']
)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    aliases = EXCLUDED.aliases;

INSERT INTO ingredients (id, name_en, name_zh, category, aliases)
VALUES (
    'vodka', 
    'Vodka', 
    '伏特加', 
    'mixer', 
    ARRAY['伏特加', '檸檬伏特加', '燒酒或伏特加', 'vodka', 'vodka citron', 'shochu or vodka']
)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    aliases = EXCLUDED.aliases;

INSERT INTO ingredients (id, name_en, name_zh, category, aliases)
VALUES (
    'rum', 
    'Rum', 
    '蘭姆酒', 
    'mixer', 
    ARRAY['白蘭姆酒', '蘭姆酒', '陳年蘭姆酒', 'white rum', 'rum', 'aged rum']
)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    aliases = EXCLUDED.aliases;

INSERT INTO ingredients (id, name_en, name_zh, category, aliases)
VALUES (
    'tequila', 
    'Tequila', 
    '龍舌蘭', 
    'mixer', 
    ARRAY['銀龍舌蘭', '龍舌蘭', '金龍舌蘭', 'tequila blanco', 'tequila']
)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    aliases = EXCLUDED.aliases;

INSERT INTO ingredients (id, name_en, name_zh, category, aliases)
VALUES (
    'brandy', 
    'Brandy', 
    '白蘭地', 
    'mixer', 
    ARRAY['干邑白蘭地', '白蘭地', '白蘭地/蘭姆酒', 'cognac', 'cognac/brandy', 'brandy']
)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    aliases = EXCLUDED.aliases;

INSERT INTO ingredients (id, name_en, name_zh, category, aliases)
VALUES (
    'kaoliang', 
    'Kaoliang', 
    '高粱酒', 
    'mixer', 
    ARRAY[]::text[]
)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    aliases = EXCLUDED.aliases;

INSERT INTO ingredients (id, name_en, name_zh, category, aliases)
VALUES (
    'white_wine', 
    'White Wine', 
    '白酒', 
    'mixer', 
    ARRAY[]::text[]
)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    aliases = EXCLUDED.aliases;

INSERT INTO ingredients (id, name_en, name_zh, category, aliases)
VALUES (
    'jagermeister', 
    'Jägermeister', 
    '野格利口酒', 
    'mixer', 
    ARRAY['野格', '野格利口酒', 'jagermeister', 'jager']
)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    aliases = EXCLUDED.aliases;

INSERT INTO ingredients (id, name_en, name_zh, category, aliases)
VALUES (
    'beer', 
    'Beer', 
    '啤酒', 
    'mixer', 
    ARRAY['拉格啤酒', 'lager beer', 'lager', 'beer']
)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    aliases = EXCLUDED.aliases;

INSERT INTO ingredients (id, name_en, name_zh, category, aliases)
VALUES (
    'wine', 
    'Red Wine', 
    '紅酒', 
    'mixer', 
    ARRAY['紅酒 (便宜的就好)', '紅酒', 'red wine (cheap is fine)', 'red wine']
)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    aliases = EXCLUDED.aliases;

INSERT INTO ingredients (id, name_en, name_zh, category, aliases)
VALUES (
    'soju', 
    'Soju', 
    '燒酒', 
    'mixer', 
    ARRAY['燒酒', '韓國燒酒', '原味燒酒', '韓國燒酒 (原味)', 'shochu']
)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    aliases = EXCLUDED.aliases;

INSERT INTO ingredients (id, name_en, name_zh, category, aliases)
VALUES (
    'sake', 
    'Sake', 
    '清酒', 
    'mixer', 
    ARRAY[]::text[]
)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    aliases = EXCLUDED.aliases;

INSERT INTO ingredients (id, name_en, name_zh, category, aliases)
VALUES (
    'champagne', 
    'Champagne', 
    '香檳', 
    'mixer', 
    ARRAY[]::text[]
)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    aliases = EXCLUDED.aliases;

INSERT INTO ingredients (id, name_en, name_zh, category, aliases)
VALUES (
    'hard_cider', 
    'Apple Cider', 
    '蘋果酒', 
    'mixer', 
    ARRAY['蘋果酒 (somersby等)', '蘋果酒', 'tequila cider', 'cider', 'apple cider', 'somersby']
)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    aliases = EXCLUDED.aliases;

INSERT INTO ingredients (id, name_en, name_zh, category, aliases)
VALUES (
    'prosecco', 
    'Prosecco', 
    'Prosecco氣泡酒', 
    'mixer', 
    ARRAY[]::text[]
)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    aliases = EXCLUDED.aliases;

INSERT INTO ingredients (id, name_en, name_zh, category, aliases)
VALUES (
    'liqueur', 
    'Liqueur', 
    '利口酒', 
    'mixer', 
    ARRAY[]::text[]
)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    aliases = EXCLUDED.aliases;

INSERT INTO ingredients (id, name_en, name_zh, category, aliases)
VALUES (
    'vermouth', 
    'Vermouth', 
    '香艾酒', 
    'mixer', 
    ARRAY['香艾酒', '甜香艾酒', 'sweet vermouth', 'vermouth']
)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    aliases = EXCLUDED.aliases;

INSERT INTO ingredients (id, name_en, name_zh, category, aliases)
VALUES (
    'dry_vermouth', 
    'Dry Vermouth', 
    '不甜香艾酒', 
    'mixer', 
    ARRAY['不甜香艾酒', 'dry vermouth']
)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    aliases = EXCLUDED.aliases;

INSERT INTO ingredients (id, name_en, name_zh, category, aliases)
VALUES (
    'cointreau', 
    'Cointreau/Curacao', 
    '橙酒/柑橘酒', 
    'mixer', 
    ARRAY['君度橙酒', '橙酒', '白柑橘酒', '藍柑橘酒', '柑橘酒', '柑橘香甜酒', 'cointreau (triple sec)', 'cointreau', 'triple sec', 'orange curacao', 'blue curacao', 'curacao']
)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    aliases = EXCLUDED.aliases;

INSERT INTO ingredients (id, name_en, name_zh, category, aliases)
VALUES (
    'curacao', 
    'Blue Curacao', 
    '藍柑橘酒', 
    'mixer', 
    ARRAY[]::text[]
)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    aliases = EXCLUDED.aliases;

INSERT INTO ingredients (id, name_en, name_zh, category, aliases)
VALUES (
    'grand_marnier', 
    'Grand Marnier', 
    '柑曼怡', 
    'mixer', 
    ARRAY['柑曼怡', 'grand marnier']
)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    aliases = EXCLUDED.aliases;

INSERT INTO ingredients (id, name_en, name_zh, category, aliases)
VALUES (
    'amaretto', 
    'Amaretto', 
    '杏仁酒', 
    'mixer', 
    ARRAY['杏仁酒', 'amaretto']
)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    aliases = EXCLUDED.aliases;

INSERT INTO ingredients (id, name_en, name_zh, category, aliases)
VALUES (
    'coffee_liqueur', 
    'Coffee Liqueur', 
    '咖啡酒', 
    'mixer', 
    ARRAY['咖啡香甜酒', '咖啡酒', 'coffee liqueur (kahlua)', 'coffee liqueur']
)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    aliases = EXCLUDED.aliases;

INSERT INTO ingredients (id, name_en, name_zh, category, aliases)
VALUES (
    'cocoa_liqueur', 
    'Cocoa Liqueur', 
    '可可酒', 
    'mixer', 
    ARRAY['可可香甜酒', '可可酒', 'creme de cacao']
)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    aliases = EXCLUDED.aliases;

INSERT INTO ingredients (id, name_en, name_zh, category, aliases)
VALUES (
    'baileys', 
    'Irish Cream', 
    '奶酒', 
    'mixer', 
    ARRAY['貝禮詩奶酒', '奶酒', 'irish cream (baileys)', 'baileys']
)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    aliases = EXCLUDED.aliases;

INSERT INTO ingredients (id, name_en, name_zh, category, aliases)
VALUES (
    'campari', 
    'Campari', 
    '金巴利', 
    'mixer', 
    ARRAY[]::text[]
)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    aliases = EXCLUDED.aliases;

INSERT INTO ingredients (id, name_en, name_zh, category, aliases)
VALUES (
    'aperol', 
    'Aperol', 
    '艾佩羅', 
    'mixer', 
    ARRAY[]::text[]
)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    aliases = EXCLUDED.aliases;

INSERT INTO ingredients (id, name_en, name_zh, category, aliases)
VALUES (
    'malibu', 
    'Malibu', 
    '馬利寶', 
    'mixer', 
    ARRAY[]::text[]
)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    aliases = EXCLUDED.aliases;

INSERT INTO ingredients (id, name_en, name_zh, category, aliases)
VALUES (
    'soda', 
    'Soda Water', 
    '氣泡水', 
    'mixer', 
    ARRAY['氣泡水', '蘇打水', '檸檬氣泡水', 'club soda', 'sparkling water', 'soda water']
)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    aliases = EXCLUDED.aliases;

INSERT INTO ingredients (id, name_en, name_zh, category, aliases)
VALUES (
    'tonic', 
    'Tonic Water', 
    '通寧水', 
    'mixer', 
    ARRAY['通寧水', 'tonic water']
)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    aliases = EXCLUDED.aliases;

INSERT INTO ingredients (id, name_en, name_zh, category, aliases)
VALUES (
    'coke', 
    'Coke', 
    '可樂', 
    'mixer', 
    ARRAY['可樂', 'coca-cola', 'coke']
)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    aliases = EXCLUDED.aliases;

INSERT INTO ingredients (id, name_en, name_zh, category, aliases)
VALUES (
    'sprite', 
    'Sprite', 
    '雪碧', 
    'mixer', 
    ARRAY['7-up', 'seven up']
)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    aliases = EXCLUDED.aliases;

INSERT INTO ingredients (id, name_en, name_zh, category, aliases)
VALUES (
    'ginger_ale', 
    'Ginger Ale', 
    '薑汁汽水', 
    'mixer', 
    ARRAY['薑汁汽水', 'ginger ale']
)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    aliases = EXCLUDED.aliases;

INSERT INTO ingredients (id, name_en, name_zh, category, aliases)
VALUES (
    'grapefruit_soda', 
    'Grapefruit Soda', 
    '葡萄柚汽水', 
    'mixer', 
    ARRAY['葡萄柚汽水', '葡萄柚氣泡水', 'grapefruit soda']
)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    aliases = EXCLUDED.aliases;

INSERT INTO ingredients (id, name_en, name_zh, category, aliases)
VALUES (
    'apple_soda', 
    'Apple Sidra', 
    '蘋果西打', 
    'mixer', 
    ARRAY['蘋果西打', '西打', 'apple sidra']
)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    aliases = EXCLUDED.aliases;

INSERT INTO ingredients (id, name_en, name_zh, category, aliases)
VALUES (
    'orange_juice', 
    'Orange Juice', 
    '柳橙汁', 
    'mixer', 
    ARRAY['柳橙汁', 'orange juice']
)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    aliases = EXCLUDED.aliases;

INSERT INTO ingredients (id, name_en, name_zh, category, aliases)
VALUES (
    'cranberry_juice', 
    'Cranberry Juice', 
    '蔓越莓汁', 
    'mixer', 
    ARRAY['蔓越莓汁', 'cranberry juice']
)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    aliases = EXCLUDED.aliases;

INSERT INTO ingredients (id, name_en, name_zh, category, aliases)
VALUES (
    'tomato_juice', 
    'Tomato Juice', 
    '番茄汁', 
    'mixer', 
    ARRAY['番茄汁', 'tomato juice']
)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    aliases = EXCLUDED.aliases;

INSERT INTO ingredients (id, name_en, name_zh, category, aliases)
VALUES (
    'guava_juice', 
    'Guava Juice', 
    '芭樂汁', 
    'mixer', 
    ARRAY['芭樂汁', 'guava juice']
)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    aliases = EXCLUDED.aliases;

INSERT INTO ingredients (id, name_en, name_zh, category, aliases)
VALUES (
    'tea', 
    'Black Tea', 
    '紅茶', 
    'mixer', 
    ARRAY['麥香/阿薩姆奶茶', '麥香', '茶', 'tea', 'assam', 'black tea', 'minechine']
)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    aliases = EXCLUDED.aliases;

INSERT INTO ingredients (id, name_en, name_zh, category, aliases)
VALUES (
    'oolong_tea', 
    'Oolong Tea', 
    '烏龍茶', 
    'mixer', 
    ARRAY['烏龍茶', 'oolong tea', 'oolong']
)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    aliases = EXCLUDED.aliases;

INSERT INTO ingredients (id, name_en, name_zh, category, aliases)
VALUES (
    'green_tea', 
    'Green Tea', 
    '綠茶', 
    'mixer', 
    ARRAY['綠茶', '綠茶 (瓶裝)', 'green tea']
)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    aliases = EXCLUDED.aliases;

INSERT INTO ingredients (id, name_en, name_zh, category, aliases)
VALUES (
    'espresso', 
    'Espresso', 
    '濃縮咖啡', 
    'mixer', 
    ARRAY['濃縮咖啡 (熱)', '濃縮咖啡', '咖啡', '熱咖啡', 'espresso', 'espresso (fresh)']
)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    aliases = EXCLUDED.aliases;

INSERT INTO ingredients (id, name_en, name_zh, category, aliases)
VALUES (
    'grapefruit_juice', 
    'Grapefruit Juice', 
    '葡萄柚汁', 
    'mixer', 
    ARRAY[]::text[]
)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    aliases = EXCLUDED.aliases;

INSERT INTO ingredients (id, name_en, name_zh, category, aliases)
VALUES (
    'grapefruit', 
    'Grapefruit', 
    '葡萄柚', 
    'mixer', 
    ARRAY[]::text[]
)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    aliases = EXCLUDED.aliases;

INSERT INTO ingredients (id, name_en, name_zh, category, aliases)
VALUES (
    'milk', 
    'Milk', 
    '牛奶', 
    'mixer', 
    ARRAY[]::text[]
)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    aliases = EXCLUDED.aliases;

INSERT INTO ingredients (id, name_en, name_zh, category, aliases)
VALUES (
    'calpis', 
    'Calpis', 
    '可爾必思', 
    'mixer', 
    ARRAY[]::text[]
)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    aliases = EXCLUDED.aliases;

INSERT INTO ingredients (id, name_en, name_zh, category, aliases)
VALUES (
    'yakult', 
    'Yakult', 
    '養樂多', 
    'mixer', 
    ARRAY[]::text[]
)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    aliases = EXCLUDED.aliases;

INSERT INTO ingredients (id, name_en, name_zh, category, aliases)
VALUES (
    'milk_tea', 
    'Milk Tea', 
    '奶茶', 
    'mixer', 
    ARRAY['奶茶', '熱奶茶', 'milk tea', 'hot milk tea']
)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    aliases = EXCLUDED.aliases;

INSERT INTO ingredients (id, name_en, name_zh, category, aliases)
VALUES (
    'ginger_tea', 
    'Ginger Tea', 
    '薑茶', 
    'mixer', 
    ARRAY['熱薑茶', 'hot ginger tea']
)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    aliases = EXCLUDED.aliases;

INSERT INTO ingredients (id, name_en, name_zh, category, aliases)
VALUES (
    'ginger_beer', 
    'Ginger Beer', 
    '薑汁啤酒', 
    'mixer', 
    ARRAY['薑汁啤酒', 'ginger beer']
)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    aliases = EXCLUDED.aliases;

INSERT INTO ingredients (id, name_en, name_zh, category, aliases)
VALUES (
    'peach_juice', 
    'Peach Juice', 
    '水蜜桃汁', 
    'mixer', 
    ARRAY[]::text[]
)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    aliases = EXCLUDED.aliases;

INSERT INTO ingredients (id, name_en, name_zh, category, aliases)
VALUES (
    'grass_jelly', 
    'Grass Jelly', 
    '燒仙草', 
    'mixer', 
    ARRAY['燒仙草', '熱仙草', 'grass jelly', 'hot grass jelly']
)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    aliases = EXCLUDED.aliases;

INSERT INTO ingredients (id, name_en, name_zh, category, aliases)
VALUES (
    'lillet_blanc', 
    'Lillet Blanc', 
    '利萊白酒', 
    'mixer', 
    ARRAY['利萊白酒', '利萊', 'lillet', 'lillet blanc', 'kina lillet']
)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    aliases = EXCLUDED.aliases;

INSERT INTO ingredients (id, name_en, name_zh, category, aliases)
VALUES (
    'barley_tea', 
    'Barley Tea', 
    '麥仔茶', 
    'mixer', 
    ARRAY[]::text[]
)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    aliases = EXCLUDED.aliases;

INSERT INTO ingredients (id, name_en, name_zh, category, aliases)
VALUES (
    'pudding', 
    'Pudding', 
    '布丁', 
    'mixer', 
    ARRAY['統一布丁', '布丁', 'uni-president pudding', 'uni-president', 'pudding']
)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    aliases = EXCLUDED.aliases;

INSERT INTO ingredients (id, name_en, name_zh, category, aliases)
VALUES (
    'absinthe', 
    'Absinthe', 
    '艾碧斯', 
    'mixer', 
    ARRAY[]::text[]
)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    aliases = EXCLUDED.aliases;

INSERT INTO ingredients (id, name_en, name_zh, category, aliases)
VALUES (
    'grenadine', 
    'Grenadine', 
    '紅石榴糖漿', 
    'mixer', 
    ARRAY['紅石榴糖漿', 'grenadine']
)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    aliases = EXCLUDED.aliases;

INSERT INTO ingredients (id, name_en, name_zh, category, aliases)
VALUES (
    'orgeat', 
    'Orgeat', 
    '杏仁糖漿', 
    'mixer', 
    ARRAY['杏仁糖漿', 'orgeat syrup']
)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    aliases = EXCLUDED.aliases;

INSERT INTO ingredients (id, name_en, name_zh, category, aliases)
VALUES (
    'melon_popsicle', 
    'Melon Popsicle', 
    '哈密瓜冰棒', 
    'mixer', 
    ARRAY['哈密瓜冰棒', 'melona', '冰棒', 'honeydew melon popsicle']
)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    aliases = EXCLUDED.aliases;

INSERT INTO ingredients (id, name_en, name_zh, category, aliases)
VALUES (
    'sarsaparilla', 
    'Sarsaparilla', 
    '沙士', 
    'mixer', 
    ARRAY[]::text[]
)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    aliases = EXCLUDED.aliases;

INSERT INTO ingredients (id, name_en, name_zh, category, aliases)
VALUES (
    'grape_juice', 
    'Grape Juice', 
    '葡萄汁', 
    'mixer', 
    ARRAY[]::text[]
)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    aliases = EXCLUDED.aliases;

INSERT INTO ingredients (id, name_en, name_zh, category, aliases)
VALUES (
    'aloe', 
    'Aloe Drink', 
    '蘆薈飲', 
    'mixer', 
    ARRAY[]::text[]
)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    aliases = EXCLUDED.aliases;

INSERT INTO ingredients (id, name_en, name_zh, category, aliases)
VALUES (
    'hot_chocolate', 
    'Hot Chocolate', 
    '熱可可', 
    'mixer', 
    ARRAY['熱可可', 'hot chocolate']
)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    aliases = EXCLUDED.aliases;

INSERT INTO ingredients (id, name_en, name_zh, category, aliases)
VALUES (
    'lemon_tea', 
    'Lemon Tea', 
    '檸檬紅茶', 
    'mixer', 
    ARRAY['檸檬紅茶', 'lemon tea', 'lemon iced tea']
)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    aliases = EXCLUDED.aliases;

INSERT INTO ingredients (id, name_en, name_zh, category, aliases)
VALUES (
    'energy_drink', 
    'Energy Drink', 
    '能量飲料', 
    'mixer', 
    ARRAY['能量飲料', 'red bull', 'energy drink']
)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    aliases = EXCLUDED.aliases;

INSERT INTO ingredients (id, name_en, name_zh, category, aliases)
VALUES (
    'sports_drink', 
    'Sports Drink', 
    '運動飲料', 
    'mixer', 
    ARRAY['運動飲料', '寶礦力', '舒跑', 'sports drink', 'pocari', 'pocari sweat']
)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    aliases = EXCLUDED.aliases;

INSERT INTO ingredients (id, name_en, name_zh, category, aliases)
VALUES (
    'soy_milk', 
    'Soy Milk', 
    '豆漿', 
    'mixer', 
    ARRAY['豆漿', '無糖豆漿', 'soy milk', 'soymilk']
)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    aliases = EXCLUDED.aliases;

INSERT INTO ingredients (id, name_en, name_zh, category, aliases)
VALUES (
    'plum_green_tea', 
    'Plum Green Tea', 
    '梅子綠茶', 
    'mixer', 
    ARRAY['梅子綠', '梅子綠茶', 'plum green tea']
)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    aliases = EXCLUDED.aliases;

INSERT INTO ingredients (id, name_en, name_zh, category, aliases)
VALUES (
    'black_coffee', 
    'Black Coffee', 
    '黑咖啡', 
    'mixer', 
    ARRAY['黑咖啡', '美式咖啡', '冰美式', 'black coffee', 'americano', 'coffee', 'hot coffee']
)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    aliases = EXCLUDED.aliases;

INSERT INTO ingredients (id, name_en, name_zh, category, aliases)
VALUES (
    'plum', 
    'Sour Plum', 
    '梅子 (話梅)', 
    'mixer', 
    ARRAY['梅子', '話梅', 'plum', 'sour plum']
)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    aliases = EXCLUDED.aliases;

INSERT INTO ingredients (id, name_en, name_zh, category, aliases)
VALUES (
    'umeshu', 
    'Umeshu (Plum Wine)', 
    '梅酒', 
    'mixer', 
    ARRAY['梅酒', 'choya梅酒', 'choya', 'umeshu', 'plum wine']
)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    aliases = EXCLUDED.aliases;

INSERT INTO ingredients (id, name_en, name_zh, category, aliases)
VALUES (
    'coffee_milk', 
    'Coffee Milk', 
    '咖啡牛奶', 
    'mixer', 
    ARRAY['咖啡牛奶', '輕鬆小品', '貝納頌', 'coffee milk']
)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    aliases = EXCLUDED.aliases;

INSERT INTO ingredients (id, name_en, name_zh, category, aliases)
VALUES (
    'papaya_milk', 
    'Papaya Milk', 
    '木瓜牛奶', 
    'mixer', 
    ARRAY['木瓜牛奶', '木瓜牛乳', '統一木瓜牛乳', 'papaya milk', 'uni-president papaya milk']
)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    aliases = EXCLUDED.aliases;

INSERT INTO ingredients (id, name_en, name_zh, category, aliases)
VALUES (
    'ice', 
    'Ice', 
    '冰塊', 
    'mixer', 
    ARRAY[]::text[]
)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    aliases = EXCLUDED.aliases;

INSERT INTO ingredients (id, name_en, name_zh, category, aliases)
VALUES (
    'sugar', 
    'Sugar', 
    '糖', 
    'mixer', 
    ARRAY['方糖', '半糖', '糖水', '糖漿', '砂糖', '糖', 'sugar cube', 'simple syrup', 'sugar syrup', 'rich syrup', 'syrup', 'sugar']
)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    aliases = EXCLUDED.aliases;

INSERT INTO ingredients (id, name_en, name_zh, category, aliases)
VALUES (
    'salt', 
    'Salt', 
    '鹽', 
    'mixer', 
    ARRAY['鹽', 'salt']
)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    aliases = EXCLUDED.aliases;

INSERT INTO ingredients (id, name_en, name_zh, category, aliases)
VALUES (
    'bitters', 
    'Bitters', 
    '苦精', 
    'mixer', 
    ARRAY['苦精 (angostura)', '苦精', 'angostura bitters', 'bitters']
)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    aliases = EXCLUDED.aliases;

INSERT INTO ingredients (id, name_en, name_zh, category, aliases)
VALUES (
    'worcestershire', 
    'Worcestershire', 
    '伍斯特醬', 
    'mixer', 
    ARRAY['伍斯特醬', 'worcestershire']
)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    aliases = EXCLUDED.aliases;

INSERT INTO ingredients (id, name_en, name_zh, category, aliases)
VALUES (
    'hot_sauce', 
    'Tabasco', 
    '辣椒醬', 
    'mixer', 
    ARRAY['辣椒醬', 'tabasco']
)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    aliases = EXCLUDED.aliases;

INSERT INTO ingredients (id, name_en, name_zh, category, aliases)
VALUES (
    'lemon', 
    'Lemon/Lime', 
    '檸檬/萊姆', 
    'mixer', 
    ARRAY['檸檬汁', '新鮮檸檬汁', '萊姆汁', '莱姆汁', '檸檬', '萊姆', '黃檸檬', '檸檬皮', 'lime juice', 'fresh lime juice', 'lemon juice', 'lime', 'lemon', 'lime cordial']
)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    aliases = EXCLUDED.aliases;

INSERT INTO ingredients (id, name_en, name_zh, category, aliases)
VALUES (
    'mint', 
    'Mint', 
    '薄荷', 
    'mixer', 
    ARRAY['薄荷葉', '薄荷', 'mint leaves', 'mint']
)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    aliases = EXCLUDED.aliases;

INSERT INTO ingredients (id, name_en, name_zh, category, aliases)
VALUES (
    'cucumber', 
    'Cucumber', 
    '小黃瓜', 
    'mixer', 
    ARRAY['小黃瓜', 'cucumber']
)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    aliases = EXCLUDED.aliases;

INSERT INTO ingredients (id, name_en, name_zh, category, aliases)
VALUES (
    'celery', 
    'Celery', 
    '芹菜', 
    'mixer', 
    ARRAY['芹菜', '芹菜棒', 'celery', 'celery stalk']
)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    aliases = EXCLUDED.aliases;

INSERT INTO ingredients (id, name_en, name_zh, category, aliases)
VALUES (
    'cream', 
    'Heavy Cream', 
    '鮮奶油', 
    'mixer', 
    ARRAY['鮮奶油', 'heavy cream', 'cream']
)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    aliases = EXCLUDED.aliases;

INSERT INTO ingredients (id, name_en, name_zh, category, aliases)
VALUES (
    'butter', 
    'Butter', 
    '奶油(Butter)', 
    'mixer', 
    ARRAY[]::text[]
)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    aliases = EXCLUDED.aliases;

INSERT INTO ingredients (id, name_en, name_zh, category, aliases)
VALUES (
    'honey', 
    'Honey', 
    '蜂蜜', 
    'mixer', 
    ARRAY[]::text[]
)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    aliases = EXCLUDED.aliases;

INSERT INTO ingredients (id, name_en, name_zh, category, aliases)
VALUES (
    'egg', 
    'Egg', 
    '蛋', 
    'mixer', 
    ARRAY['蛋黃', '蛋白', 'egg yolk', 'egg white']
)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    aliases = EXCLUDED.aliases;

INSERT INTO ingredients (id, name_en, name_zh, category, aliases)
VALUES (
    'olive', 
    'Olive', 
    '橄欖', 
    'mixer', 
    ARRAY['olive']
)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    aliases = EXCLUDED.aliases;

INSERT INTO ingredients (id, name_en, name_zh, category, aliases)
VALUES (
    'nutmeg', 
    'Nutmeg', 
    '豆蔻', 
    'mixer', 
    ARRAY['nutmeg']
)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    aliases = EXCLUDED.aliases;

INSERT INTO ingredients (id, name_en, name_zh, category, aliases)
VALUES (
    'marshmallow', 
    'Marshmallow', 
    '棉花糖', 
    'mixer', 
    ARRAY['棉花糖', 'marshmallows', 'marshmallow']
)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    aliases = EXCLUDED.aliases;

INSERT INTO ingredients (id, name_en, name_zh, category, aliases)
VALUES (
    'peach_puree', 
    'Peach Puree', 
    '白桃果泥', 
    'mixer', 
    ARRAY['白桃果泥', 'peach puree']
)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    aliases = EXCLUDED.aliases;
