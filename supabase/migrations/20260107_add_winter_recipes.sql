-- Add Winter Warmers Recipes to 'recipes' table

insert into public.recipes (id, name, type, base_spirit, ingredients, steps, tags, description, specs, color, image)
values
(
    'hot-toddy',
    '{"en": "Hot Toddy", "zh": "熱托迪"}'::jsonb,
    'classic',
    '{"whiskey"}',
    '{"en": [{"name": "Whiskey", "amount": "60ml"}, {"name": "Honey", "amount": "20ml"}, {"name": "Lemon Juice", "amount": "15ml"}, {"name": "Hot Water", "amount": "Top up"}], "zh": [{"name": "威士忌", "amount": "60ml"}, {"name": "蜂蜜", "amount": "20ml"}, {"name": "檸檬汁", "amount": "15ml"}, {"name": "熱水", "amount": "加滿"}]}'::jsonb,
    '{"en": ["Combine spirits, honey, and lemon juice in a mug.", "Top with hot water and stir until honey is dissolved.", "Garnish with a lemon wheel or cinnamon stick."], "zh": ["將烈酒、蜂蜜和檸檬汁加入馬克杯中。", "注入熱水並攪拌至蜂蜜溶解。", "以檸檬片或肉桂棒裝飾。"]}'::jsonb,
    '{"en": ["hot", "soothing", "winter"], "zh": ["熱", "暖身", "冬天"]}'::jsonb,
    '{"en": "A soothing hot drink perfect for cold nights.", "zh": "寒冷夜晚的最佳暖身飲品。"}'::jsonb,
    '{"alcohol": 5, "sweetness": 6, "ease": 10}'::jsonb,
    '#f59e0b',
    '/cocktails/hot-toddy.png'
),
(
    'mulled-wine',
    '{"en": "Mulled Wine", "zh": "熱紅酒"}'::jsonb,
    'classic',
    '{"wine"}',
    '{"en": [{"name": "Red Wine", "amount": "150ml"}, {"name": "Spices (Cinnamon, Clove)", "amount": "1 stick/3 pc"}, {"name": "Orange Slices", "amount": "2"}, {"name": "Sugar/Honey", "amount": "1 tsp"}], "zh": [{"name": "紅酒", "amount": "150ml"}, {"name": "香料 (肉桂, 丁香)", "amount": "1根/3顆"}, {"name": "柳橙片", "amount": "2片"}, {"name": "糖/蜂蜜", "amount": "1茶匙"}]}'::jsonb,
    '{"en": ["Combine all ingredients in a saucepan.", "Simmer gently on low heat (do not boil) for 10-15 mins.", "Serve warm in a mug."], "zh": ["將所有材料放入鍋中。", "小火慢煮（不要煮沸）10-15分鐘。", "倒入馬克杯中趁熱享用。"]}'::jsonb,
    '{"en": ["hot", "spicy", "wine", "cny"], "zh": ["熱", "香料", "紅酒", "過年"]}'::jsonb,
    '{"en": "Warm, spiced wine, traditionally served during holidays.", "zh": "溫暖的香料紅酒，節日必備。"}'::jsonb,
    '{"alcohol": 4, "sweetness": 6, "ease": 7}'::jsonb,
    '#be123c',
    '/cocktails/mulled-wine.png'
),
(
    'irish-coffee',
    '{"en": "Irish Coffee", "zh": "愛爾蘭咖啡"}'::jsonb,
    'classic',
    '{"whiskey"}',
    '{"en": [{"name": "Irish Whiskey", "amount": "50ml"}, {"name": "Hot Coffee", "amount": "120ml"}, {"name": "Brown Sugar", "amount": "1-2 tsp"}, {"name": "Heavy Cream", "amount": "Top"}], "zh": [{"name": "愛爾蘭威士忌", "amount": "50ml"}, {"name": "熱咖啡", "amount": "120ml"}, {"name": "紅糖", "amount": "1-2茶匙"}, {"name": "鮮奶油", "amount": "適量"}]}'::jsonb,
    '{"en": ["Fill mug with hot water to preheat, then empty.", "Pour hot coffee and dissolved sugar into the mug.", "Stir in whiskey.", "Float whipped cream on top."], "zh": ["先用熱水溫杯，然後倒掉。", "在杯中加入熱咖啡和糖攪拌溶解。", "加入威士忌。", "在上方輕輕鋪上一層鮮奶油。"]}'::jsonb,
    '{"en": ["hot", "coffee", "rich"], "zh": ["熱", "咖啡", "濃郁"]}'::jsonb,
    '{"en": "The classic combination of coffee and whiskey.", "zh": "咖啡與威士忌的經典結合。"}'::jsonb,
    '{"alcohol": 6, "sweetness": 5, "ease": 6}'::jsonb,
    '#451a03',
    '/cocktails/irish-coffee.png'
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
