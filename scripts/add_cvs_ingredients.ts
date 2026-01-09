
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Fix env loading
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const ingredients = [
    // Spirits / Base
    { id: 'whiskey', name_en: 'Whiskey', name_zh: '威士忌', category: 'base' },
    { id: 'vodka', name_en: 'Vodka', name_zh: '伏特加', category: 'base' },
    { id: 'gin', name_en: 'Gin', name_zh: '琴酒', category: 'base' },
    { id: 'tequila', name_en: 'Tequila', name_zh: '龍舌蘭', category: 'base' },
    { id: 'rum', name_en: 'Rum', name_zh: '蘭姆酒', category: 'base' },
    { id: 'brandy', name_en: 'Brandy', name_zh: '白蘭地', category: 'base' },
    { id: 'kaoliang', name_en: 'Kaoliang', name_zh: '高粱酒', category: 'base' }, // Added
    { id: 'beer', name_en: 'Beer', name_zh: '啤酒', category: 'base' }, // Red Eye

    // Other Alcohol
    { id: 'sake', name_en: 'Sake', name_zh: '清酒', category: 'other_alc' },
    { id: 'soju', name_en: 'Soju', name_zh: '燒酒', category: 'other_alc' }, // Pocari Soju
    { id: 'liqueur', name_en: 'Liqueur', name_zh: '香甜酒', category: 'other_alc' }, // Baileys

    // Mixers
    { id: 'oolong_tea', name_en: 'Oolong Tea', name_zh: '烏龍茶', category: 'mixer' },
    { id: 'green_tea', name_en: 'Green Tea', name_zh: '綠茶', category: 'mixer' }, // Added
    { id: 'calpis', name_en: 'Calpis', name_zh: '可爾必思', category: 'mixer' },
    { id: 'soda', name_en: 'Soda Water', name_zh: '氣泡水', category: 'mixer' },
    { id: 'energy_drink', name_en: 'Energy Drink', name_zh: '能量飲料', category: 'mixer' },
    { id: 'sports_drink', name_en: 'Sports Drink', name_zh: '運動飲料', category: 'mixer' },
    { id: 'lemon_tea', name_en: 'Lemon Tea', name_zh: '檸檬紅茶', category: 'mixer' },
    { id: 'soy_milk', name_en: 'Soy Milk', name_zh: '豆漿', category: 'mixer' }, // New
    { id: 'plum_green_tea', name_en: 'Plum Green Tea', name_zh: '梅子綠茶', category: 'mixer' }, // New
    { id: 'black_coffee', name_en: 'Black Coffee', name_zh: '黑咖啡', category: 'mixer' }, // New
    { id: 'yakult', name_en: 'Yakult', name_zh: '養樂多', category: 'mixer' }, // New
    { id: 'tomato_juice', name_en: 'Tomato Juice', name_zh: '番茄汁', category: 'mixer' }, // New
    { id: 'guava_juice', name_en: 'Guava Juice', name_zh: '芭樂汁', category: 'mixer' }, // New
    { id: 'lemon_soda', name_en: 'Lemon Soda (CC)', name_zh: '檸檬氣泡 (CC)', category: 'mixer' }, // Vitamin C Bomb
    { id: 'apple_soda', name_en: 'Apple Soda', name_zh: '蘋果西打', category: 'mixer' }, // Brandy Sidra

    // Essentials / Garnish
    { id: 'lemon', name_en: 'Lemon', name_zh: '檸檬', category: 'essential' },
    { id: 'plum', name_en: 'Sour Plum', name_zh: '話梅', category: 'essential' }, // New
    { id: 'ice', name_en: 'Ice', name_zh: '冰塊', category: 'essential' }
];

async function addIngredients() {
    console.log(`🚀 Adding ${ingredients.length} ingredients to DB...`);

    const { error } = await supabase
        .from('ingredients')
        .upsert(ingredients, { onConflict: 'id' });

    if (error) {
        console.error('❌ Failed to add ingredients:', error.message);
    } else {
        console.log('✅ Ingredients added successfully!');
    }
}

addIngredients();
