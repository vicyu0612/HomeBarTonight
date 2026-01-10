import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
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

const newIngredients = [
    { id: 'winter_melon_tea', name_en: 'Winter Melon Tea', name_zh: '冬瓜茶', category: 'mixer' },
    { id: 'pudding', name_en: 'Pudding', name_zh: '統一布丁', category: 'essential' }, // Treated as garnish/essential
    { id: 'sarsaparilla', name_en: 'Sarsaparilla', name_zh: '黑松沙士', category: 'mixer' },
    { id: 'salt', name_en: 'Salt', name_zh: '鹽', category: 'essential' }
];

async function addIngredients() {
    console.log(`🚀 Adding ${newIngredients.length} new ingredients...`);

    const { error } = await supabase
        .from('ingredients')
        .upsert(newIngredients, { onConflict: 'id' });

    if (error) {
        console.error('❌ Failed to add ingredients:', error.message);
    } else {
        console.log('✅ New ingredients added successfully!');
    }
}

addIngredients();
