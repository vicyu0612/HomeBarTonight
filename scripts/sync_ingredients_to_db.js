import { createClient } from '@supabase/supabase-js';
import 'dotenv/config'; // Loads .env automatically (check if .env or .env.local needs specific handling)
import fs from 'fs';
import path from 'path';

// Load env vars manually if dotenv doesn't pick up .env.local by default
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error('Error: VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

// --- Data (Ported from normalization.ts) ---
const INGREDIENT_DB = {
    // Base Spirits
    'whiskey': { en: 'Whiskey', zh: '威士忌' },
    'gin': { en: 'Gin', zh: '琴酒' },
    'vodka': { en: 'Vodka', zh: '伏特加' },
    'rum': { en: 'Rum', zh: '蘭姆酒' },
    'tequila': { en: 'Tequila', zh: '龍舌蘭' },
    'brandy': { en: 'Brandy', zh: '白蘭地' },
    'kaoliang': { en: 'Kaoliang', zh: '高粱酒' },
    'white_wine': { en: 'White Wine', zh: '白酒' },
    'jagermeister': { en: 'Jägermeister', zh: '野格利口酒' },
    'beer': { en: 'Beer', zh: '啤酒' },
    'wine': { en: 'Red Wine', zh: '紅酒' },
    'soju': { en: 'Soju', zh: '燒酒' },
    'sake': { en: 'Sake', zh: '清酒' },
    'champagne': { en: 'Champagne', zh: '香檳' },
    'hard_cider': { en: 'Apple Cider', zh: '蘋果酒' },
    'prosecco': { en: 'Prosecco', zh: 'Prosecco氣泡酒' },

    // Liqueurs
    'liqueur': { en: 'Liqueur', zh: '利口酒' },
    'vermouth': { en: 'Vermouth', zh: '香艾酒' },
    'dry_vermouth': { en: 'Dry Vermouth', zh: '不甜香艾酒' },
    'cointreau': { en: 'Cointreau/Curacao', zh: '橙酒/柑橘酒' },
    'curacao': { en: 'Blue Curacao', zh: '藍柑橘酒' },
    'grand_marnier': { en: 'Grand Marnier', zh: '柑曼怡' },
    'amaretto': { en: 'Amaretto', zh: '杏仁酒' },
    'coffee_liqueur': { en: 'Coffee Liqueur', zh: '咖啡酒' },
    'cocoa_liqueur': { en: 'Cocoa Liqueur', zh: '可可酒' },
    'baileys': { en: 'Irish Cream', zh: '奶酒' },
    'campari': { en: 'Campari', zh: '金巴利' },
    'aperol': { en: 'Aperol', zh: '艾佩羅' },
    'malibu': { en: 'Malibu', zh: '馬利寶' },

    // Mixers & Others
    'soda': { en: 'Soda Water', zh: '氣泡水' },
    'tonic': { en: 'Tonic Water', zh: '通寧水' },
    'coke': { en: 'Coke', zh: '可樂' },
    'sprite': { en: 'Sprite', zh: '雪碧' },
    'ginger_ale': { en: 'Ginger Ale', zh: '薑汁汽水' },
    'grapefruit_soda': { en: 'Grapefruit Soda', zh: '葡萄柚汽水' },
    'apple_soda': { en: 'Apple Sidra', zh: '蘋果西打' },
    'orange_juice': { en: 'Orange Juice', zh: '柳橙汁' },
    'cranberry_juice': { en: 'Cranberry Juice', zh: '蔓越莓汁' },
    'tomato_juice': { en: 'Tomato Juice', zh: '番茄汁' },
    'guava_juice': { en: 'Guava Juice', zh: '芭樂汁' },
    'tea': { en: 'Black Tea', zh: '紅茶' },
    'oolong_tea': { en: 'Oolong Tea', zh: '烏龍茶' },
    'green_tea': { en: 'Green Tea', zh: '綠茶' },
    'espresso': { en: 'Espresso', zh: '濃縮咖啡' },
    'grapefruit_juice': { en: 'Grapefruit Juice', zh: '葡萄柚汁' },
    'grapefruit': { en: 'Grapefruit', zh: '葡萄柚' },
    'milk': { en: 'Milk', zh: '牛奶' },
    'calpis': { en: 'Calpis', zh: '可爾必思' },
    'yakult': { en: 'Yakult', zh: '養樂多' },
    'milk_tea': { en: 'Milk Tea', zh: '奶茶' },
    'ginger_tea': { en: 'Ginger Tea', zh: '薑茶' },
    'ginger_beer': { en: 'Ginger Beer', zh: '薑汁啤酒' },
    'peach_juice': { en: 'Peach Juice', zh: '水蜜桃汁' },
    'grass_jelly': { en: 'Grass Jelly', zh: '燒仙草' },
    'lillet_blanc': { en: 'Lillet Blanc', zh: '利萊白酒' },
    'barley_tea': { en: 'Barley Tea', zh: '麥仔茶' },
    'pudding': { en: 'Pudding', zh: '布丁' },
    'absinthe': { en: 'Absinthe', zh: '艾碧斯' },
    'grenadine': { en: 'Grenadine', zh: '紅石榴糖漿' },
    'orgeat': { en: 'Orgeat', zh: '杏仁糖漿' },
    'melon_popsicle': { en: 'Melon Popsicle', zh: '哈密瓜冰棒' },
    'sarsaparilla': { en: 'Sarsaparilla', zh: '沙士' },
    'grape_juice': { en: 'Grape Juice', zh: '葡萄汁' },
    'aloe': { en: 'Aloe Drink', zh: '蘆薈飲' },
    'hot_chocolate': { en: 'Hot Chocolate', zh: '熱可可' },
    'lemon_tea': { en: 'Lemon Tea', zh: '檸檬紅茶' },
    'energy_drink': { en: 'Energy Drink', zh: '能量飲料' },
    'sports_drink': { en: 'Sports Drink', zh: '運動飲料' },
    'soy_milk': { en: 'Soy Milk', zh: '豆漿' },
    'plum_green_tea': { en: 'Plum Green Tea', zh: '梅子綠茶' },
    'black_coffee': { en: 'Black Coffee', zh: '黑咖啡' },
    'plum': { en: 'Sour Plum', zh: '梅子 (話梅)' },
    'umeshu': { en: 'Umeshu (Plum Wine)', zh: '梅酒' },
    'coffee_milk': { en: 'Coffee Milk', zh: '咖啡牛奶' },
    'papaya_milk': { en: 'Papaya Milk', zh: '木瓜牛奶' },

    // Essentials
    'ice': { en: 'Ice', zh: '冰塊' },
    'sugar': { en: 'Sugar', zh: '糖' },
    'salt': { en: 'Salt', zh: '鹽' },
    'bitters': { en: 'Bitters', zh: '苦精' },
    'worcestershire': { en: 'Worcestershire', zh: '伍斯特醬' },
    'hot_sauce': { en: 'Tabasco', zh: '辣椒醬' },
    'lemon': { en: 'Lemon/Lime', zh: '檸檬/萊姆' },
    'mint': { en: 'Mint', zh: '薄荷' },
    'cucumber': { en: 'Cucumber', zh: '小黃瓜' },
    'celery': { en: 'Celery', zh: '芹菜' },
    'cream': { en: 'Heavy Cream', zh: '鮮奶油' },
    'butter': { en: 'Butter', zh: '奶油(Butter)' },
    'honey': { en: 'Honey', zh: '蜂蜜' },
    'egg': { en: 'Egg', zh: '蛋' },
    'olive': { en: 'Olive', zh: '橄欖' },
    'nutmeg': { en: 'Nutmeg', zh: '豆蔻' },
    'marshmallow': { en: 'Marshmallow', zh: '棉花糖' },
    'peach_puree': { en: 'Peach Puree', zh: '白桃果泥' }
};

const ALIAS_MAP_ZH = {
    "小樣酒 (威士忌)": "whiskey", "小樣酒（威士忌）": "whiskey", "小樣酒": "whiskey", "波本或黑麥威士忌": "whiskey", "波本威士忌": "whiskey", "波本": "whiskey", "黑麥威士忌": "whiskey", "琴酒": "gin", "伏特加": "vodka", "檸檬伏特加": "vodka", "燒酒": "soju", "韓國燒酒": "soju", "原味燒酒": "soju", "韓國燒酒 (原味)": "soju", "燒酒或伏特加": "vodka", "銀龍舌蘭": "tequila", "龍舌蘭": "tequila", "金龍舌蘭": "tequila", "白蘭姆酒": "rum", "蘭姆酒": "rum", "陳年蘭姆酒": "rum", "干邑白蘭地": "brandy", "白蘭地": "brandy", "白蘭地/蘭姆酒": "brandy", "紅酒 (便宜的就好)": "wine", "紅酒": "wine", "拉格啤酒": "beer", "蘋果酒 (Somersby等)": "hard_cider", "蘋果酒": "hard_cider", "野格": "jagermeister", "野格利口酒": "jagermeister", "熱可可": "hot_chocolate", "檸檬紅茶": "lemon_tea", "熱薑茶": "ginger_tea", "薑汁啤酒": "ginger_beer", "能量飲料": "energy_drink", "白桃果泥": "peach_puree", "棉花糖": "marshmallow", "運動飲料": "sports_drink", "寶礦力": "sports_drink", "舒跑": "sports_drink", "豆漿": "soy_milk", "無糖豆漿": "soy_milk", "梅子綠": "plum_green_tea", "梅子綠茶": "plum_green_tea", "梅子": "plum", "話梅": "plum", "黑咖啡": "black_coffee", "美式咖啡": "black_coffee", "冰美式": "black_coffee", "梅酒": "umeshu", "choya梅酒": "umeshu", "choya": "umeshu", "咖啡牛奶": "coffee_milk", "輕鬆小品": "coffee_milk", "貝納頌": "coffee_milk", "木瓜牛奶": "papaya_milk", "木瓜牛乳": "papaya_milk", "統一木瓜牛乳": "papaya_milk", "蛋黃": "egg", "不甜香艾酒": "dry_vermouth", "香艾酒": "vermouth", "甜香艾酒": "vermouth", "君度橙酒": "cointreau", "橙酒": "cointreau", "白柑橘酒": "cointreau", "藍柑橘酒": "cointreau", "柑橘酒": "cointreau", "柑橘香甜酒": "cointreau", "柑曼怡": "grand_marnier", "杏仁酒": "amaretto", "咖啡香甜酒": "coffee_liqueur", "咖啡酒": "coffee_liqueur", "可可香甜酒": "cocoa_liqueur", "可可酒": "cocoa_liqueur", "貝禮詩奶酒": "baileys", "奶酒": "baileys", "檸檬氣泡水 (CC檸檬等)": "lemon_soda", "檸檬汽水": "lemon_soda", "CC檸檬": "lemon_soda", "葡萄柚汽水": "grapefruit_soda", "蘋果西打": "apple_soda", "西打": "apple_soda", "哈密瓜冰棒": "melon_popsicle", "Melona": "melon_popsicle", "冰棒": "melon_popsicle", "氣泡水": "soda", "蘇打水": "soda", "通寧水": "tonic", "薑汁汽水": "ginger_ale", "可樂": "coke", "檸檬氣泡水": "soda", "葡萄柚氣泡水": "grapefruit_soda", "柳橙汁": "orange_juice", "蔓越莓汁": "cranberry_juice", "番茄汁": "tomato_juice", "芭樂汁": "guava_juice", "檸檬汁": "lemon", "新鮮檸檬汁": "lemon", "萊姆汁": "lemon", "莱姆汁": "lemon", "檸檬": "lemon", "萊姆": "lemon", "黃檸檬": "lemon", "小黃瓜": "cucumber", "芹菜": "celery", "芹菜棒": "celery", "檸檬皮": "lemon", "薄荷葉": "mint", "薄荷": "mint", "方糖": "sugar", "半糖": "sugar", "糖水": "sugar", "糖漿": "sugar", "砂糖": "sugar", "糖": "sugar", "杏仁糖漿": "orgeat", "鹽": "salt", "鮮奶油": "cream", "苦精 (Angostura)": "bitters", "苦精": "bitters", "伍斯特醬": "worcestershire", "辣椒醬": "hot_sauce", "紅石榴糖漿": "grenadine", "麥香/阿薩姆奶茶": "tea", "麥香": "tea", "茶": "tea", "奶茶": "milk_tea", "熱奶茶": "milk_tea", "烏龍茶": "oolong_tea", "綠茶": "green_tea", "綠茶 (瓶裝)": "green_tea", "濃縮咖啡 (熱)": "espresso", "濃縮咖啡": "espresso", "咖啡": "espresso", "熱咖啡": "espresso", "蛋白": "egg", "統一布丁": "pudding", "布丁": "pudding", "uni-president pudding": "pudding", "uni-president": "pudding", "燒仙草": "grass_jelly", "熱仙草": "grass_jelly", "利萊白酒": "lillet_blanc", "利萊": "lillet_blanc", "Lillet": "lillet_blanc"
};

const ALIAS_MAP_EN = {
    "bourbon or rye whiskey": "whiskey", "mini whiskey bottle": "whiskey", "bourbon": "whiskey", "whiskey": "whiskey", "rye whiskey": "whiskey", "gin": "gin", "vodka": "vodka", "vodka citron": "vodka", "shochu or vodka": "vodka", "tequila blanco": "tequila", "tequila": "tequila", "white rum": "rum", "rum": "rum", "aged rum": "rum", "cognac": "brandy", "cognac/brandy": "brandy", "brandy": "brandy", "red wine (cheap is fine)": "wine", "red wine": "wine", "lager beer": "beer", "lager": "beer", "ginger beer": "ginger_beer", "beer": "beer", "tequila cider": "hard_cider", "cider": "hard_cider", "apple cider": "hard_cider", "somersby": "hard_cider", "jagermeister": "jagermeister", "jager": "jagermeister", "red bull": "energy_drink", "energy drink": "energy_drink", "hot chocolate": "hot_chocolate", "lemon tea": "lemon_tea", "lemon iced tea": "lemon_tea", "peach puree": "peach_puree", "marshmallows": "marshmallow", "marshmallow": "marshmallow", "sports drink": "sports_drink", "pocari": "sports_drink", "pocari sweat": "sports_drink", "soy milk": "soy_milk", "soymilk": "soy_milk", "plum green tea": "plum_green_tea", "plum": "plum", "sour plum": "plum", "black coffee": "black_coffee", "americano": "black_coffee", "egg yolk": "egg", "pudding": "pudding", "uni-president pudding": "pudding", "grass jelly": "grass_jelly", "umeshu": "umeshu", "plum wine": "umeshu", "choya": "umeshu", "coffee milk": "coffee_milk", "papaya milk": "papaya_milk", "uni-president papaya milk": "papaya_milk", "hot grass jelly": "grass_jelly", "lillet blanc": "lillet_blanc", "lillet": "lillet_blanc", "kina lillet": "lillet_blanc", "dry vermouth": "dry_vermouth", "sweet vermouth": "vermouth", "vermouth": "vermouth", "cointreau (triple sec)": "cointreau", "cointreau": "cointreau", "triple sec": "cointreau", "orange curacao": "cointreau", "blue curacao": "cointreau", "curacao": "cointreau", "grand marnier": "grand_marnier", "amaretto": "amaretto", "coffee liqueur (kahlua)": "coffee_liqueur", "coffee liqueur": "coffee_liqueur", "creme de cacao": "cocoa_liqueur", "irish cream (baileys)": "baileys", "baileys": "baileys", "heavy cream": "cream", "cream": "cream", "lemon sparkling water (cc lemon etc)": "lemon_soda", "lemon sparkling water": "lemon_soda", "lemon soda": "lemon_soda", "cc lemon": "lemon_soda", "cc lemon / lemon soda": "lemon_soda", "grapefruit soda": "grapefruit_soda", "apple sidra": "apple_soda", "melona": "melon_popsicle", "honeydew melon popsicle": "melon_popsicle", "club soda": "soda", "sparkling water": "soda", "soda water": "soda", "tonic water": "tonic", "ginger ale": "ginger_ale", "7-up": "sprite", "seven up": "sprite", "coca-cola": "coke", "coke": "coke", "tea": "tea", "milk tea": "milk_tea", "hot milk tea": "milk_tea", "assam": "tea", "black tea": "tea", "minechine": "tea", "hot ginger tea": "ginger_tea", "apple juice": "juice", "orange juice": "orange_juice", "cranberry juice": "cranberry_juice", "tomato juice": "tomato_juice", "guava juice": "guava_juice", "oolong tea": "oolong_tea", "oolong": "oolong_tea", "green tea": "green_tea", "espresso": "espresso", "espresso (fresh)": "espresso", "coffee": "black_coffee", "hot coffee": "black_coffee", "lime juice": "lemon", "fresh lime juice": "lemon", "lemon juice": "lemon", "lime": "lemon", "lemon": "lemon", "lime cordial": "lemon", "lemon twist": "lemon_peel", "lemon peel": "lemon_peel", "cucumber": "cucumber", "celery": "celery", "celery stalk": "celery", "mint leaves": "mint", "mint": "mint", "sugar cube": "sugar", "simple syrup": "sugar", "sugar syrup": "sugar", "rich syrup": "sugar", "orgeat syrup": "orgeat", "syrup": "sugar", "sugar": "sugar", "salt": "salt", "olive": "olive", "nutmeg": "nutmeg", "shochu": "soju", "water": "water", "hot water": "water", "cold water": "water", "angostura bitters": "bitters", "bitters": "bitters", "worcestershire": "worcestershire", "tabasco": "hot_sauce", "grenadine": "grenadine", "egg white": "egg"
};

// --- Sync Logic ---

const aliasesById = {};

function addAlias(id, alias) {
    if (!aliasesById[id]) aliasesById[id] = new Set();
    aliasesById[id].add(alias.toLowerCase());
}

Object.entries(ALIAS_MAP_ZH).forEach(([alias, id]) => addAlias(id, alias));
Object.entries(ALIAS_MAP_EN).forEach(([alias, id]) => addAlias(id, alias));

async function syncIngredients() {
    console.log('Syncing ingredients to Supabase...');

    const upsertBuffer = [];

    Object.entries(INGREDIENT_DB).forEach(([id, names]) => {
        const aliases = aliasesById[id] ? Array.from(aliasesById[id]) : [];

        upsertBuffer.push({
            id: id,
            name_en: names.en,
            name_zh: names.zh,
            category: 'mixer', // We default to mixer for now, updating rows usually keeps category if incomplete? No, upsert replaces.
            // Wait, we don't want to overwrite category if it exists and we're not sure.
            // But we can't do partial upsert easily without correct category.
            // The DB has categories. If we overwrite with 'mixer', we might break things.
            // Solution: We should NOT overwrite category if possible.
            // But `upsert` overwrites the specified columns.
            // Supabase/Postgres `ON CONFLICT DO UPDATE` allows `EXCLUDE.aliases`.
            // With `supabase-js`, we pass the object.
            // If we omit `category` in the object, will it set it to null or default?
            // If it's an UPDATE (conflict), omitting it keeps the old value (if using `ignoreDuplicates: false`? No).
            // `upsert` in supabase-js updates ALL columns provided in the object. If a column is omitted, it's NOT touched in the UPDATE?
            // Actually, for `INSERT`, omitted columns get default values. For `UPDATE`, omitted columns are NOT updated if utilizing the `upsert` vs `update` semantics?
            // "The `upsert` method performs an `INSERT ... ON CONFLICT ... UPDATE`."
            // If we omit `category`, and it's a new row, it acts as INSERT (must have default or allowed null).
            // If it's an existing row, it updates the row. Does it set omitted columns to null or keep them?
            // It only updates columns present in the payload.
            // So if we omit `category`, it should be safe for UPDATE.
            // But for INSERT, it needs a valid value. Most ingredients exist.
            // Let's assume most exist.
            // Or we just provide `category: 'mixer'` as a fallback?
            // No, 'whiskey' is 'base_spirit' or similar in DB (actually `liqueur` or `other_alc` based on my read of SQL output: "category":"liqueur" for Cointreau).
            // I should check if I can fetch existing categories first?

            // To be safe and since this is a migration, let's fetch all ingredients first, map their categories, and use that.
            aliases: aliases
        });
    });

    // Fetch existing ingredients to preserve categories
    const { data: existingIngredients, error: fetchError } = await supabase
        .from('ingredients')
        .select('id, category');

    if (fetchError) {
        console.error('Error fetching existing ingredients:', fetchError);
        return;
    }

    const categoryMap = {};
    existingIngredients.forEach(ing => {
        categoryMap[ing.id] = ing.category;
    });

    // Prepare final payload
    const finalBuffer = upsertBuffer.map(item => {
        return {
            ...item,
            category: categoryMap[item.id] || 'mixer' // Preserve or default
        };
    });

    // Batch upsert (Supabase handles batch nicely, but let's do chunks of 50 just in case)
    const chunkSize = 50;
    for (let i = 0; i < finalBuffer.length; i += chunkSize) {
        const chunk = finalBuffer.slice(i, i + chunkSize);
        const { error } = await supabase
            .from('ingredients')
            .upsert(chunk, { onConflict: 'id' });

        if (error) {
            console.error('Error syncing chunk:', error);
        } else {
            console.log(`Synced chunk ${i / chunkSize + 1}`);
        }
    }
    console.log('Sync complete.');
}

syncIngredients();
