
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing env vars');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const categories = [
    { id: 'base', name_en: 'Base Spirits', name_zh: '基酒', color: 'bg-amber-500', sort_order: 1 },
    { id: 'liqueur', name_en: 'Liqueurs', name_zh: '利口酒', color: 'bg-orange-500', sort_order: 2 },
    { id: 'other_alc', name_en: 'Other Alcohol', name_zh: '其他酒類', color: 'bg-red-500', sort_order: 3 },
    { id: 'essential', name_en: 'Essentials', name_zh: '基本材料', color: 'bg-zinc-400', sort_order: 4 },
    { id: 'mixer', name_en: 'Mixers', name_zh: '常見飲料', color: 'bg-blue-400', sort_order: 5 },
    { id: 'fruit_dessert', name_en: 'Fruit & Dessert', name_zh: '水果 & 甜品', color: 'bg-pink-400', sort_order: 6 },
    { id: 'garnish', name_en: 'Garnishes & Others', name_zh: '裝飾 & 其他', color: 'bg-green-500', sort_order: 7 },
];

const subcategories = [
    // Base
    { id: 'whiskey', category_id: 'base', name_en: 'Whiskey', name_zh: '威士忌', sort_order: 1 },
    { id: 'gin', category_id: 'base', name_en: 'Gin', name_zh: '琴酒', sort_order: 2 },
    { id: 'rum', category_id: 'base', name_en: 'Rum', name_zh: '蘭姆酒', sort_order: 3 },
    { id: 'vodka', category_id: 'base', name_en: 'Vodka', name_zh: '伏特加', sort_order: 4 },
    { id: 'tequila', category_id: 'base', name_en: 'Tequila / Mezcal', name_zh: '龍舌蘭 / 梅斯卡爾', sort_order: 5 },
    { id: 'brandy', category_id: 'base', name_en: 'Brandy / Cognac', name_zh: '白蘭地', sort_order: 6 },
    { id: 'chinese_spirit', category_id: 'base', name_en: 'Chinese Spirits', name_zh: '中式烈酒', sort_order: 7 },
    { id: 'rice_spirit', category_id: 'base', name_en: 'Rice Spirits (Sake / Soju)', name_zh: '清酒 / 燒酒', sort_order: 8 },

    // Liqueur
    { id: 'fruit_liqueur', category_id: 'liqueur', name_en: 'Fruit Liqueurs', name_zh: '水果利口酒', sort_order: 1 },
    { id: 'herbal_liqueur', category_id: 'liqueur', name_en: 'Herbal Liqueurs', name_zh: '草本利口酒', sort_order: 2 },
    { id: 'nut_cream_liqueur', category_id: 'liqueur', name_en: 'Nut & Cream', name_zh: '堅果 & 奶類利口酒', sort_order: 3 },
    { id: 'floral_liqueur', category_id: 'liqueur', name_en: 'Floral Liqueurs', name_zh: '花香利口酒', sort_order: 4 },
    { id: 'other_liqueur', category_id: 'liqueur', name_en: 'Other Liqueurs', name_zh: '其他利口酒', sort_order: 5 },
    { id: 'vermouth', category_id: 'liqueur', name_en: 'Vermouth', name_zh: '香艾酒', sort_order: 6 },

    // Other Alc
    { id: 'wine', category_id: 'other_alc', name_en: 'Wine', name_zh: '葡萄酒', sort_order: 1 },
    { id: 'sparkling_alc', category_id: 'other_alc', name_en: 'Sparkling Alcohol', name_zh: '氣泡類酒', sort_order: 2 },
    { id: 'aperitif', category_id: 'other_alc', name_en: 'Aperitivo / Aperitif', name_zh: '開胃酒', sort_order: 3 },

    // Mixer
    { id: 'soda', category_id: 'mixer', name_en: 'Sparkling Drinks', name_zh: '氣泡飲品', sort_order: 1 },
    { id: 'juice', category_id: 'mixer', name_en: 'Vegetable & Fruit Juice', name_zh: '蔬果汁', sort_order: 2 },
    { id: 'tea_coffee', category_id: 'mixer', name_en: 'Tea / Coffee / Cocoa', name_zh: '茶 / 咖啡 / 可可', sort_order: 3 },
    { id: 'dairy', category_id: 'mixer', name_en: 'Dairy & Alternatives', name_zh: '乳製品 & 替代品', sort_order: 4 },

    // Essential
    { id: 'basic', category_id: 'essential', name_en: 'Basic', name_zh: '基本', sort_order: 0 }, // 0 to ensure top
    { id: 'syrup', category_id: 'essential', name_en: 'Syrup / Sweetener', name_zh: '糖漿 / 甜味劑', sort_order: 2 },
    { id: 'bitters', category_id: 'essential', name_en: 'Bitters', name_zh: '苦精', sort_order: 3 },
    { id: 'egg', category_id: 'essential', name_en: 'Egg / Egg White', name_zh: '蛋/蛋白', sort_order: 4 },
    { id: 'hot_sauce', category_id: 'essential', name_en: 'Hot Sauce', name_zh: '辣醬', sort_order: 5 },

    // Fruit & Dessert
    { id: 'fruit', category_id: 'fruit_dessert', name_en: 'Fruit', name_zh: '水果', sort_order: 1 },
    { id: 'dessert', category_id: 'fruit_dessert', name_en: 'Dessert', name_zh: '甜品', sort_order: 2 },

    // Garnish
    { id: 'pantry', category_id: 'garnish', name_en: 'Pantry', name_zh: '家中常備', sort_order: 1 },
    { id: 'herbs_spices', category_id: 'garnish', name_en: 'Herbs & Spices', name_zh: '香料 & 藥草', sort_order: 2 },
];

async function setup() {
    console.log('--- Setting up Dynamic Categories ---');

    // Upsert Categories
    const { error: catError } = await supabase
        .from('ingredient_categories')
        .upsert(categories);

    if (catError) {
        console.error('Error inserting categories:', catError);
        return;
    }
    console.log(`✓ Inserted ${categories.length} categories`);

    // Upsert Subcategories
    const { error: subError } = await supabase
        .from('ingredient_subcategories')
        .upsert(subcategories);

    if (subError) {
        console.error('Error inserting subcategories:', subError);
        return;
    }
    console.log(`✓ Inserted ${subcategories.length} subcategories`);
}

setup();
