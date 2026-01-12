
export const INGREDIENT_DB: Record<string, { en: string; zh: string }> = {
    // Base Spirits
    'whiskey': { en: 'Whiskey', zh: '威士忌' },
    'gin': { en: 'Gin', zh: '琴酒' },
    'vodka': { en: 'Vodka', zh: '伏特加' },
    'rum': { en: 'Rum', zh: '蘭姆酒' },
    'tequila': { en: 'Tequila', zh: '龍舌蘭' },
    'brandy': { en: 'Brandy', zh: '白蘭地' },

    'kaoliang': { en: 'Kaoliang', zh: '高粱酒' }, // Added
    'white_wine': { en: 'White Wine', zh: '白酒' },
    'jagermeister': { en: 'Jägermeister', zh: '野格利口酒' },
    'beer': { en: 'Beer', zh: '啤酒' },
    // 'lager': { en: 'Lager', zh: '拉格啤酒' }, // Removed: merged to beer
    'wine': { en: 'Red Wine', zh: '紅酒' },
    // 'red-wine': Removed, merged to 'wine'
    'soju': { en: 'Soju', zh: '燒酒' },
    'sake': { en: 'Sake', zh: '清酒' },
    'champagne': { en: 'Champagne', zh: '香檳' },
    // 'cider': Merged to 'hard_cider'
    'hard_cider': { en: 'Apple Cider', zh: '蘋果酒' }, // Maps "西打" here too as requested
    'prosecco': { en: 'Prosecco', zh: 'Prosecco氣泡酒' },

    // Liqueurs
    'liqueur': { en: 'Liqueur', zh: '利口酒' },
    'vermouth': { en: 'Vermouth', zh: '香艾酒' },
    'dry_vermouth': { en: 'Dry Vermouth', zh: '不甜香艾酒' },
    'cointreau': { en: 'Cointreau/Curacao', zh: '橙酒/柑橘酒' },
    'curacao': { en: 'Blue Curacao', zh: '藍柑橘酒' }, // Kept for DB completeness, but aliases map to cointreau
    'grand_marnier': { en: 'Grand Marnier', zh: '柑曼怡' },
    'amaretto': { en: 'Amaretto', zh: '杏仁酒' },
    'coffee_liqueur': { en: 'Coffee Liqueur', zh: '咖啡酒' },
    'cocoa_liqueur': { en: 'Cocoa Liqueur', zh: '可可酒' },
    'baileys': { en: 'Irish Cream', zh: '奶酒' },
    'campari': { en: 'Campari', zh: '金巴利' },
    'aperol': { en: 'Aperol', zh: '艾佩羅' },
    'malibu': { en: 'Malibu', zh: '馬利寶' },

    // Mixers & Others
    // Mixers & Others
    'soda': { en: 'Soda Water', zh: '氣泡水' }, // Merged Lemon Soda here
    'tonic': { en: 'Tonic Water', zh: '通寧水' },
    'coke': { en: 'Coke', zh: '可樂' },
    'sprite': { en: 'Sprite', zh: '雪碧' },
    'ginger_ale': { en: 'Ginger Ale', zh: '薑汁汽水' },
    // 'lemon_soda': { en: 'Lemon Soda', zh: '檸檬氣泡水' }, // Merged to soda
    'grapefruit_soda': { en: 'Grapefruit Soda', zh: '葡萄柚汽水' },
    'apple_soda': { en: 'Apple Sidra', zh: '蘋果西打' },
    // 'juice': { en: 'Juice', zh: '果汁' }, // Removed as requested
    'orange_juice': { en: 'Orange Juice', zh: '柳橙汁' },
    'cranberry_juice': { en: 'Cranberry Juice', zh: '蔓越莓汁' }, // Added
    'tomato_juice': { en: 'Tomato Juice', zh: '番茄汁' },
    'guava_juice': { en: 'Guava Juice', zh: '芭樂汁' },
    'tea': { en: 'Black Tea', zh: '紅茶' },
    'oolong_tea': { en: 'Oolong Tea', zh: '烏龍茶' }, // Reverted split
    'green_tea': { en: 'Green Tea', zh: '綠茶' }, // Added split
    // 'coffee': { en: 'Coffee', zh: '咖啡' }, // Merged to Espresso
    'espresso': { en: 'Espresso', zh: '濃縮咖啡' },
    'milk': { en: 'Milk', zh: '牛奶' },
    'calpis': { en: 'Calpis', zh: '可爾必思' },
    'yakult': { en: 'Yakult', zh: '養樂多' },
    'milk_tea': { en: 'Milk Tea', zh: '奶茶' },
    'ginger_tea': { en: 'Ginger Tea', zh: '薑茶' },
    'ginger_beer': { en: 'Ginger Beer', zh: '薑汁啤酒' },
    'peach_juice': { en: 'Peach Juice', zh: '水蜜桃汁' },
    'grass_jelly': { en: 'Grass Jelly', zh: '燒仙草' },
    'barley_tea': { en: 'Barley Tea', zh: '麥仔茶' },
    'pudding': { en: 'Pudding', zh: '布丁' }, // Added explicit mapping

    'grenadine': { en: 'Grenadine', zh: '紅石榴糖漿' },
    'orgeat': { en: 'Orgeat', zh: '杏仁糖漿' }, // Added
    // 'lime_cordial': { en: 'Lime Cordial', zh: '莱姆汁 (Cordial)' }, // Removed, covered by Lemon/Lime
    'melon_popsicle': { en: 'Melon Popsicle', zh: '哈密瓜冰棒' },
    'sarsaparilla': { en: 'Sarsaparilla', zh: '沙士' }, // Added
    'grape_juice': { en: 'Grape Juice', zh: '葡萄汁' }, // Added
    'aloe': { en: 'Aloe Drink', zh: '蘆薈飲' }, // Added
    // 'water': { en: 'Water', zh: '水' }, // Removed as requested
    'hot_chocolate': { en: 'Hot Chocolate', zh: '熱可可' }, // Added
    'lemon_tea': { en: 'Lemon Tea', zh: '檸檬紅茶' }, // Added

    'energy_drink': { en: 'Energy Drink', zh: '能量飲料' }, // Added
    'sports_drink': { en: 'Sports Drink', zh: '運動飲料' }, // Added
    'soy_milk': { en: 'Soy Milk', zh: '豆漿' }, // Added
    'plum_green_tea': { en: 'Plum Green Tea', zh: '梅子綠茶' }, // Added
    'black_coffee': { en: 'Black Coffee', zh: '黑咖啡' }, // Added
    'plum': { en: 'Sour Plum', zh: '梅子 (話梅)' }, // Added

    // Essentials
    'ice': { en: 'Ice', zh: '冰塊' },
    'sugar': { en: 'Sugar', zh: '糖' },
    'salt': { en: 'Salt', zh: '鹽' },
    'bitters': { en: 'Bitters', zh: '苦精' },
    'worcestershire': { en: 'Worcestershire', zh: '伍斯特醬' },
    'hot_sauce': { en: 'Tabasco', zh: '辣椒醬' },
    'lemon': { en: 'Lemon/Lime', zh: '檸檬/萊姆' }, // Renamed
    // 'lemon_peel': Merged to 'lemon'
    // 'lime': Merged to 'lemon'
    // 'lime': { en: 'Lime', zh: '萊姆' }, 
    'mint': { en: 'Mint', zh: '薄荷' },
    'cucumber': { en: 'Cucumber', zh: '小黃瓜' },
    'celery': { en: 'Celery', zh: '芹菜' }, // Added
    'cream': { en: 'Heavy Cream', zh: '鮮奶油' }, // Already essential
    'butter': { en: 'Butter', zh: '奶油(Butter)' }, // Added if needed, or check if user meant this?
    'honey': { en: 'Honey', zh: '蜂蜜' },
    'egg': { en: 'Egg', zh: '蛋' }, // Covers egg yolk
    'olive': { en: 'Olive', zh: '橄欖' },
    'nutmeg': { en: 'Nutmeg', zh: '豆蔻' },
    'marshmallow': { en: 'Marshmallow', zh: '棉花糖' },
    'peach_puree': { en: 'Peach Puree', zh: '白桃果泥' },
};

// Reverse maps for lookup
const NAME_TO_ID_ZH: Record<string, string> = {};
const NAME_TO_ID_EN: Record<string, string> = {};

// Initialize reverse maps
Object.entries(INGREDIENT_DB).forEach(([id, { en, zh }]) => {
    NAME_TO_ID_EN[en.toLowerCase()] = id;
    NAME_TO_ID_ZH[zh] = id;
});

// Alias Map (Synonyms -> ID)
const ALIAS_MAP_ZH: Record<string, string> = {
    "小樣酒 (威士忌)": "whiskey",
    "小樣酒（威士忌）": "whiskey",
    "小樣酒": "whiskey",
    "波本或黑麥威士忌": "whiskey",
    "波本威士忌": "whiskey",
    "波本": "whiskey",
    "黑麥威士忌": "whiskey",
    "琴酒": "gin",
    "伏特加": "vodka",
    "檸檬伏特加": "vodka", // Added
    "燒酒": "soju",
    "韓國燒酒": "soju",
    "原味燒酒": "soju", // Added
    "韓國燒酒 (原味)": "soju",
    "燒酒或伏特加": "vodka",
    "銀龍舌蘭": "tequila",
    "龍舌蘭": "tequila",
    "金龍舌蘭": "tequila",
    "白蘭姆酒": "rum",
    "蘭姆酒": "rum",
    "陳年蘭姆酒": "rum",
    "干邑白蘭地": "brandy",
    "白蘭地": "brandy",
    "白蘭地/蘭姆酒": "brandy", // Added
    "紅酒 (便宜的就好)": "wine",
    "紅酒": "wine",
    "拉格啤酒": "beer", // Updated
    // "西打": "hard_cider", // Removed duplicate, mapped to apple_soda below
    "蘋果酒 (Somersby等)": "hard_cider",
    "蘋果酒": "hard_cider",

    // New mappings
    "野格": "jagermeister",
    "野格利口酒": "jagermeister",
    "熱可可": "hot_chocolate",
    "檸檬紅茶": "lemon_tea",
    "熱薑茶": "ginger_tea",
    "薑汁啤酒": "ginger_beer",
    "能量飲料": "energy_drink",
    "白桃果泥": "peach_puree",
    "棉花糖": "marshmallow",
    "運動飲料": "sports_drink",
    "寶礦力": "sports_drink",
    "舒跑": "sports_drink",
    "豆漿": "soy_milk",
    "無糖豆漿": "soy_milk",
    "梅子綠": "plum_green_tea",
    "梅子綠茶": "plum_green_tea",
    "梅子": "plum",
    "話梅": "plum",
    "黑咖啡": "black_coffee",
    "美式咖啡": "black_coffee",
    "冰美式": "black_coffee",
    "蛋黃": "egg", // Added for Egg Yolk mapping

    "不甜香艾酒": "dry_vermouth",
    "香艾酒": "vermouth",
    "甜香艾酒": "vermouth", // Added

    // Updated Liqueur Maps
    "君度橙酒": "cointreau",
    "橙酒": "cointreau",
    "白柑橘酒": "cointreau",
    "藍柑橘酒": "cointreau",
    "柑橘酒": "cointreau",
    "柑橘香甜酒": "cointreau", // Added
    "柑曼怡": "grand_marnier",
    "杏仁酒": "amaretto",

    "咖啡香甜酒": "coffee_liqueur",
    "咖啡酒": "coffee_liqueur",
    "可可香甜酒": "cocoa_liqueur",
    "可可酒": "cocoa_liqueur",
    "貝禮詩奶酒": "baileys",
    "奶酒": "baileys",
    "檸檬氣泡水 (CC檸檬等)": "lemon_soda",
    "檸檬汽水": "lemon_soda",
    "CC檸檬": "lemon_soda",
    "葡萄柚汽水": "grapefruit_soda",
    "蘋果西打": "apple_soda",
    "西打": "apple_soda",
    "哈密瓜冰棒": "melon_popsicle",
    "Melona": "melon_popsicle",
    "冰棒": "melon_popsicle",
    "氣泡水": "soda",
    "蘇打水": "soda",
    "通寧水": "tonic",
    "薑汁汽水": "ginger_ale",
    "可樂": "coke",
    "檸檬氣泡水": "soda",
    "葡萄柚氣泡水": "grapefruit_soda",
    "柳橙汁": "orange_juice",
    "蔓越莓汁": "cranberry_juice",
    "番茄汁": "tomato_juice",
    "芭樂汁": "guava_juice",
    "檸檬汁": "lemon",
    "新鮮檸檬汁": "lemon",
    "萊姆汁": "lemon",
    "莱姆汁": "lemon",
    "檸檬": "lemon",
    "萊姆": "lemon",
    "黃檸檬": "lemon",
    "小黃瓜": "cucumber",
    "芹菜": "celery",
    "芹菜棒": "celery",
    "檸檬皮": "lemon",
    "薄荷葉": "mint",
    "薄荷": "mint",
    "方糖": "sugar",
    "半糖": "sugar",
    "糖水": "sugar",
    "糖漿": "sugar",
    "砂糖": "sugar",
    "糖": "sugar",
    "杏仁糖漿": "orgeat",
    "鹽": "salt",
    "鮮奶油": "cream",
    "苦精 (Angostura)": "bitters",
    "苦精": "bitters",
    "伍斯特醬": "worcestershire",
    "辣椒醬": "hot_sauce",
    "紅石榴糖漿": "grenadine",
    "麥香/阿薩姆奶茶": "tea",
    "麥香": "tea",
    "茶": "tea",
    "奶茶": "milk_tea",
    "熱奶茶": "milk_tea",
    "烏龍茶": "oolong_tea",
    "綠茶": "green_tea",
    "綠茶 (瓶裝)": "green_tea",
    "濃縮咖啡 (熱)": "espresso",
    "濃縮咖啡": "espresso",
    "咖啡": "espresso",
    "熱咖啡": "espresso",
    "蛋白": "egg",
    "統一布丁": "pudding",
    "布丁": "pudding",
    "uni-president pudding": "pudding",
    "uni-president": "pudding"
};

const ALIAS_MAP_EN: Record<string, string> = {
    "bourbon or rye whiskey": "whiskey",
    "mini whiskey bottle": "whiskey",
    "bourbon": "whiskey",
    "whiskey": "whiskey",
    "rye whiskey": "whiskey",
    "gin": "gin",
    "vodka": "vodka",
    "vodka citron": "vodka", // Added
    "shochu or vodka": "vodka",
    "tequila blanco": "tequila",
    "tequila": "tequila",
    "white rum": "rum",
    "rum": "rum",
    "aged rum": "rum", // Added
    "cognac": "brandy",
    "cognac/brandy": "brandy",
    "brandy": "brandy",
    "red wine (cheap is fine)": "wine",
    "red wine": "wine",
    "lager beer": "beer", // Updated
    "lager": "beer", // Updated
    "ginger beer": "ginger_beer",
    "beer": "beer",
    "tequila cider": "hard_cider",
    "cider": "hard_cider", // Consolidating
    "apple cider": "hard_cider",
    "somersby": "hard_cider",
    "jagermeister": "jagermeister",
    "jager": "jagermeister",
    "red bull": "energy_drink",
    "energy drink": "energy_drink",
    "hot chocolate": "hot_chocolate",
    "lemon tea": "lemon_tea",
    "lemon iced tea": "lemon_tea",
    "peach puree": "peach_puree",
    "marshmallows": "marshmallow",
    "marshmallow": "marshmallow",
    "sports drink": "sports_drink",
    "pocari": "sports_drink",
    "pocari sweat": "sports_drink",
    "soy milk": "soy_milk",
    "soymilk": "soy_milk",
    "plum green tea": "plum_green_tea",
    "plum": "plum",
    "sour plum": "plum",
    "black coffee": "black_coffee",
    "americano": "black_coffee",
    "egg yolk": "egg", // Added for Egg Yolk mapping
    "pudding": "pudding",
    "uni-president pudding": "pudding",
    "grass jelly": "grass_jelly",
    "hot grass jelly": "grass_jelly",

    "dry vermouth": "dry_vermouth",
    "sweet vermouth": "vermouth", // Added
    "vermouth": "vermouth",
    "cointreau (triple sec)": "cointreau",
    "cointreau": "cointreau",
    "triple sec": "cointreau",
    "orange curacao": "cointreau", // Added
    "blue curacao": "cointreau",
    "curacao": "cointreau",
    "grand marnier": "grand_marnier",
    "amaretto": "amaretto",
    "coffee liqueur (kahlua)": "coffee_liqueur",
    "coffee liqueur": "coffee_liqueur",
    "creme de cacao": "cocoa_liqueur",
    "irish cream (baileys)": "baileys",
    "baileys": "baileys",
    "heavy cream": "cream",
    "cream": "cream",
    "lemon sparkling water (cc lemon etc)": "lemon_soda",
    "lemon sparkling water": "lemon_soda",
    "lemon soda": "lemon_soda",
    "cc lemon": "lemon_soda",
    "cc lemon / lemon soda": "lemon_soda",
    "grapefruit soda": "grapefruit_soda",
    "apple sidra": "apple_soda",
    "melona": "melon_popsicle",
    "honeydew melon popsicle": "melon_popsicle",
    "club soda": "soda",
    "sparkling water": "soda",
    "soda water": "soda",
    "tonic water": "tonic",
    "ginger ale": "ginger_ale",
    "7-up": "sprite",
    "seven up": "sprite",
    "coca-cola": "coke",
    "coke": "coke",
    "tea": "tea",
    "milk tea": "milk_tea",
    "hot milk tea": "milk_tea",
    "assam": "tea",
    "black tea": "tea",
    "minechine": "tea",
    "hot ginger tea": "ginger_tea",
    "apple juice": "juice",
    "orange juice": "orange_juice",
    "cranberry juice": "cranberry_juice", // Added
    "tomato juice": "tomato_juice",
    "guava juice": "guava_juice",
    "oolong tea": "oolong_tea",
    "oolong": "oolong_tea",
    "green tea": "green_tea", // Split
    "espresso": "espresso",
    "espresso (fresh)": "espresso", // Added
    "coffee": "espresso", // Merged
    "hot coffee": "espresso", // Merged

    "lime juice": "lemon", // Standard mapping
    "fresh lime juice": "lemon",
    "lemon juice": "lemon",
    "lime": "lemon", // Merged
    "lemon": "lemon",
    "lime cordial": "lemon", // Merged to lemon/lime tag
    "lemon twist": "lemon_peel",
    "lemon peel": "lemon_peel",
    "cucumber": "cucumber",
    "celery": "celery", // Added
    "celery stalk": "celery", // Added
    "mint leaves": "mint",
    "mint": "mint",
    "sugar cube": "sugar",
    "simple syrup": "sugar",
    "sugar syrup": "sugar",
    "rich syrup": "sugar",
    "orgeat syrup": "orgeat", // Added
    "syrup": "sugar",
    "sugar": "sugar",
    "salt": "salt",
    "olive": "olive",
    "nutmeg": "nutmeg",
    "shochu": "soju",
    "water": "water",
    "hot water": "water",
    "cold water": "water",
    "angostura bitters": "bitters",
    "bitters": "bitters",
    "worcestershire": "worcestershire", // Added
    "tabasco": "hot_sauce", // Added
    "grenadine": "grenadine",
    "egg white": "egg", // Added
};

/**
 * Gets the current display name for an ingredient ID.
 */
export function getIngredientLabel(id: string, lang: 'en' | 'zh'): string {
    const entry = INGREDIENT_DB[id];
    if (!entry) return id; // Fallback to ID if not found
    return entry[lang];
}

/**
 * Normalizes an ingredient name into one or more canonical IDs.
 * Returns IDs, NOT display names.
 */
export function normalizeIngredient(name: string, lang: 'en' | 'zh'): string[] {
    // 0. Remove content in parentheses to handle "Green Tea (Bottled)", "Soju (Plain)"
    let cleanName = name.replace(/\s*\(.*?\)/g, '').trim();

    // 1. Split compound ingredients
    const splitters = lang === 'en' ? [/ or /i, /\//] : [/或/, /、/, /\//, /／/];

    let parts = [cleanName];
    // Also consider original name if it had important info in parens? 
    // Usually no, but let's keep it robust. If stripped name is empty, revert?
    if (!cleanName) cleanName = name.trim();

    for (const splitter of splitters) {
        let newParts: string[] = [];
        parts.forEach(p => {
            newParts = newParts.concat(p.split(splitter));
        });
        parts = newParts;
    }

    // 2. Normalize each part to ID
    const normalizedIds = new Set<string>();

    parts.forEach(part => {
        const p = part.trim();
        if (!p) return;

        const lowerP = p.toLowerCase();
        let id: string | undefined;

        if (lang === 'zh') {
            // 0. Exact name lookup (reverse DB lookup)
            id = NAME_TO_ID_ZH[p];
            // 1. Direct alias lookup
            if (!id) id = ALIAS_MAP_ZH[p];
            // 2. Fuzzy match fallback
            if (!id) {
                if (p.includes('威士忌')) id = 'whiskey';
                else if (p.includes('伏特加')) id = 'vodka';
                else if (p.includes('琴酒')) id = 'gin';
                else if (p.includes('蘭姆酒')) id = 'rum';
                else if (p.includes('龍舌蘭')) id = 'tequila';
                else if (p.includes('高粱')) id = 'kaoliang'; // Added
                else if (p.includes('白蘭地')) id = 'brandy';
                else if (p.includes('香艾酒')) id = 'vermouth';
                else if (p.includes('燒酒')) id = 'soju';
                else if (p.includes('可可')) id = 'cocoa_liqueur';
                else if (p.includes('薑茶')) id = 'ginger_tea';
                else if (p.includes('薑汁啤酒')) id = 'ginger_beer';
                else if (p.includes('薑汁啤酒')) id = 'ginger_beer';
                else if (p.includes('奶茶')) id = 'milk_tea';
                else if (p.includes('麥香') || p.includes('紅茶') || p.includes('茶')) id = 'tea';
                else if (p.includes('綠茶')) id = 'green_tea'; // Split
                else if (p.includes('烏龍')) id = 'oolong_tea';
                else if (p.includes('咖啡') || p.includes('濃縮')) id = 'espresso'; // Merged
                else if (p.includes('養樂多')) id = 'yakult';
                else if (p.includes('沙士')) id = 'sarsaparilla'; // Added
                else if (p.includes('雪碧')) id = 'sprite';
                else if (p.includes('七喜')) id = 'sprite';
                else if (p.includes('拉格啤酒')) id = 'beer';
                else if (p.includes('啤酒')) id = 'beer';
                else if (p.includes('氣泡水')) id = 'soda';
                else if (p.includes('糖水') || p.includes('糖漿')) id = 'sugar';
                else if (p.includes('糖')) id = 'sugar';

                // Specific CC fix
                if (p.toLowerCase().includes('cc')) id = 'lemon_soda';
                if (p.includes('哈密瓜') || p.toLowerCase().includes('melona')) id = 'melon_popsicle';
                if (p.includes('番茄汁')) id = 'tomato_juice';
                if (p.includes('芭樂汁')) id = 'guava_juice';
                if (p.includes('葡萄汁')) id = 'grape_juice'; // Added
                if (p.includes('寶礦力') || p.includes('運動飲料')) id = 'sports_drink';
                if (p.includes('豆漿')) id = 'soy_milk';
                if (p.includes('梅子綠')) id = 'plum_green_tea';
                if (p.includes('話梅') || (p.includes('梅子') && !p.includes('綠'))) id = 'plum';
                if (p.includes('黑咖啡') || p.includes('美式')) id = 'black_coffee';
                if (p.includes('蘆薈')) id = 'aloe'; // Added
                if (p.includes('蘋果西打') || p.includes('西打')) id = 'apple_soda';
                if (p.includes('橄欖')) id = 'olive';
                if (p.includes('豆蔻')) id = 'nutmeg';
                if (p.includes('小樣酒')) id = 'whiskey';
            }
        } else {
            // 0. Exact name lookup (reverse DB lookup)
            id = NAME_TO_ID_EN[lowerP];
            // 1. Direct alias lookup
            if (!id) id = ALIAS_MAP_EN[lowerP];
            // 2. Fuzzy match fallback
            if (!id) {
                if (lowerP.includes('whiskey') || lowerP.includes('whisky')) id = 'whiskey';
                else if (lowerP.includes('vodka')) id = 'vodka';
                else if (lowerP.includes('gin')) id = 'gin';
                else if (lowerP.includes('rum')) id = 'rum';
                else if (lowerP.includes('tequila')) id = 'tequila';
                else if (lowerP.includes('kaoliang') || lowerP.includes('sorghum')) id = 'kaoliang'; // Added
                else if (lowerP.includes('brandy') || lowerP.includes('cognac')) id = 'brandy';
                else if (lowerP.includes('lemon') && (lowerP.includes('sparkling') || lowerP.includes('soda'))) id = 'lemon_soda';
                else if ((lowerP.includes('sparkling') || lowerP.includes('soda')) && !lowerP.includes('apple')) id = 'soda';
                else if (lowerP.includes('sugar') || lowerP.includes('syrup')) id = 'sugar';
                else if (lowerP.includes('calpis')) id = 'calpis';
                else if (lowerP.includes('yakult')) id = 'yakult';
                else if (lowerP.includes('sarsaparilla') || lowerP.includes('root beer')) id = 'sarsaparilla'; // Added
                else if (lowerP.includes('sprite') || lowerP.includes('7-up')) id = 'sprite';
                else if (lowerP.includes('ginger beer')) id = 'ginger_beer';
                else if (lowerP.includes('lager')) id = 'beer';
                else if (lowerP.includes('beer')) id = 'beer';
                else if (lowerP.includes('shochu') || lowerP.includes('soju')) id = 'soju';
                else if (lowerP.includes('ginger tea')) id = 'ginger_tea';
                else if (lowerP.includes('ginger tea')) id = 'ginger_tea';
                else if (lowerP.includes('milk tea')) id = 'milk_tea';
                else if (lowerP.includes('black tea') || lowerP.includes('tea')) id = 'tea';
                else if (lowerP.includes('oolong')) id = 'oolong_tea';
                else if (lowerP.includes('green tea')) id = 'green_tea'; // Split
                else if (lowerP.includes('cider')) id = 'hard_cider';

                // Specific CC fix for EN
                if (lowerP.includes('cc lemon') || lowerP.includes('lemon soda')) id = 'lemon_soda';
                if (lowerP.includes('melona') || lowerP.includes('melon popsicle')) id = 'melon_popsicle';
                if (lowerP.includes('twist')) id = 'lemon'; // Merged
                if (lowerP.includes('peel')) id = 'lemon'; // Merged
                if (lowerP.includes('assam') || lowerP.includes('black tea')) id = 'tea';
                if (lowerP.includes('concentrate')) id = 'calpis';
                if (lowerP.includes('grape juice')) id = 'grape_juice'; // Added
                if (lowerP.includes('aloe')) id = 'aloe'; // Added
                if (lowerP.includes('pocari') || lowerP.includes('sports drink')) id = 'sports_drink';
                if (lowerP.includes('soy milk')) id = 'soy_milk';
                if (lowerP.includes('plum green tea')) id = 'plum_green_tea';
                if (lowerP.includes('plum') && !lowerP.includes('tea')) id = 'plum';
                if (lowerP.includes('black coffee') || lowerP.includes('americano')) id = 'black_coffee';
                if (lowerP.includes('olive')) id = 'olive';
                if (lowerP.includes('nutmeg')) id = 'nutmeg';
            }
        }

        // If still no ID, use the raw trimmed name as ID (fallback) to allow custom ingredients to pass through
        // But for reliable filtering, everything should ideally have an ID.
        normalizedIds.add(id || p);
    });

    return Array.from(normalizedIds).filter(Boolean);
}
