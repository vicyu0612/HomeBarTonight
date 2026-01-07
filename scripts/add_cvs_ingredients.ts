
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

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

    // Other Alcohol
    { id: 'sake', name_en: 'Sake', name_zh: '清酒', category: 'other_alc' },

    // Mixers
    { id: 'oolong-tea', name_en: 'Oolong Tea', name_zh: '烏龍茶', category: 'mixer' },
    { id: 'calpis', name_en: 'Calpis', name_zh: '可爾必思', category: 'mixer' },
    { id: 'soda-water', name_en: 'Soda Water', name_zh: '氣泡水', category: 'mixer' },
    { id: 'energy-drink', name_en: 'Energy Drink', name_zh: '能量飲料', category: 'mixer' },
    { id: 'sports-drink', name_en: 'Sports Drink', name_zh: '運動飲料', category: 'mixer' },
    { id: 'lemon-tea', name_en: 'Lemon Tea', name_zh: '檸檬紅茶', category: 'mixer' },

    // Essentials / Garnish
    { id: 'lemon', name_en: 'Lemon', name_zh: '檸檬', category: 'essential' }, // Or garnish
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
