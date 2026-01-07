-- Add MORE Winter Warmers Recipes to 'recipes' table

insert into public.recipes (id, name, type, base_spirit, ingredients, steps, tags, description, specs, color, image)
values
(
    'hot-buttered-rum',
    '{"en": "Hot Buttered Rum", "zh": "熱奶油蘭姆酒"}'::jsonb,
    'classic',
    '{"rum"}',
    '{"en": [{"name": "Aged Rum", "amount": "60ml"}, {"name": "Butter", "amount": "1 tbsp"}, {"name": "Brown Sugar", "amount": "1 tsp"}, {"name": "Hot Water", "amount": "Top up"}, {"name": "Spices (Cinnamon, Nutmeg)", "amount": "Pinch"}], "zh": [{"name": "陳年蘭姆酒", "amount": "60ml"}, {"name": "奶油", "amount": "1大匙"}, {"name": "紅糖", "amount": "1茶匙"}, {"name": "熱水", "amount": "加滿"}, {"name": "香料 (肉桂, 豆蔻)", "amount": "少許"}]}'::jsonb,
    '{"en": ["Muddle butter, sugar, and spices in a mug.", "Add rum and top with hot water.", "Stir until butter is melted and incorporated.", "Garnish with a cinnamon stick."], "zh": ["在馬克杯中混合奶油、糖和香料。", "加入蘭姆酒並注入熱水。", "攪拌至奶油融化並融合。", "用肉桂棒裝飾。"]}'::jsonb,
    '{"en": ["hot", "creamy", "winter", "savory"], "zh": ["熱", "綿密", "冬天", "鹹甜"]}'::jsonb,
    '{"en": "Rich, buttery, and comforting. A hug in a mug.", "zh": "濃郁奶油香，喝一口就像被擁抱的溫暖。"}'::jsonb,
    '{"alcohol": 5, "sweetness": 7, "ease": 8}'::jsonb,
    '#d97706',
    '/cocktails/hot-buttered-rum.png'
),
(
    'eggnog',
    '{"en": "Eggnog", "zh": "蛋酒"}'::jsonb,
    'classic',
    '{"brandy", "rum"}',
    '{"en": [{"name": "Brandy/Rum", "amount": "60ml"}, {"name": "Milk", "amount": "60ml"}, {"name": "Heavy Cream", "amount": "30ml"}, {"name": "Egg Yolk", "amount": "1"}, {"name": "Sugar", "amount": "1 tbsp"}], "zh": [{"name": "白蘭地/蘭姆酒", "amount": "60ml"}, {"name": "牛奶", "amount": "60ml"}, {"name": "鮮奶油", "amount": "30ml"}, {"name": "蛋黃", "amount": "1顆"}, {"name": "糖", "amount": "1大匙"}]}'::jsonb,
    '{"en": ["Shake egg yolk, sugar, milk, and cream with ice.", "Add spirit and shake again.", "Strain into a glass.", "Dust with freshly grated nutmeg."], "zh": ["將蛋黃、糖、牛奶和鮮奶油加冰搖盪。", "加入烈酒再次搖盪。", "濾入杯中。", "撒上現磨豆蔻粉。"]}'::jsonb,
    '{"en": ["creamy", "christmas", "rich"], "zh": ["濃郁", "聖誕", "奶香"]}'::jsonb,
    '{"en": "The quintessential Christmas drink.", "zh": "聖誕節的代名詞，濃郁香甜。"}'::jsonb,
    '{"alcohol": 6, "sweetness": 8, "ease": 6}'::jsonb,
    '#fef3c7',
    '/cocktails/eggnog.png'
),
(
    'baileys-hot-chocolate',
    '{"en": "Baileys Hot Chocolate", "zh": "貝禮詩熱可可"}'::jsonb,
    'classic',
    '{"liqueur"}',
    '{"en": [{"name": "Baileys Irish Cream", "amount": "50ml"}, {"name": "Hot Chocolate", "amount": "150ml"}, {"name": "Whipped Cream", "amount": "Top"}, {"name": "Marshmallows", "amount": "Optional"}], "zh": [{"name": "貝禮詩奶酒", "amount": "50ml"}, {"name": "熱可可", "amount": "150ml"}, {"name": "鮮奶油", "amount": "適量"}, {"name": "棉花糖", "amount": "選用"}]}'::jsonb,
    '{"en": ["Prepare your favorite hot chocolate.", "Stir in Baileys.", "Top generously with whipped cream and marshmallows.", "Drizzle with chocolate sauce if desired."], "zh": ["準備一杯熱可可。", "加入貝禮詩奶酒攪拌。", "擠上大量鮮奶油並放上棉花糖。", "可淋上巧克力醬。"]}'::jsonb,
    '{"en": ["hot", "sweet", "chocolaty", "dessert"], "zh": ["熱", "甜", "巧克力", "甜點"]}'::jsonb,
    '{"en": "Indulgent, sweet, and warming. The ultimate winter treat.", "zh": "極致的甜蜜與溫暖，冬日最棒的享受。"}'::jsonb,
    '{"alcohol": 3, "sweetness": 10, "ease": 10}'::jsonb,
    '#3f2c22',
    '/cocktails/baileys-hot-chocolate.png'
)
on conflict (id) do update 
set 
    name = excluded.name,
    ingredients = excluded.ingredients,
    steps = excluded.steps,
    tags = excluded.tags,
    description = excluded.description,
    specs = excluded.specs,
    color = excluded.color,
    image = excluded.image;
