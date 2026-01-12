
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

async function checkIngredients() {
    console.log('🔍 Checking Ingredients...');

    const { data: ingredients, error } = await supabase
        .from('ingredients')
        .select('*');

    if (error) {
        console.error('Error fetching ingredients:', error);
        return;
    }

    const targets = [
        'ginger_beer', 'sarsaparilla', 'grape_juice', 'aloe', 'hot_chocolate', 'lemon_tea',
        'energy_drink', 'sports_drink', 'soy_milk', 'plum_green_tea', 'black_coffee', 'plum',
        'celery', 'pudding'
    ];

    const foundIDs = ingredients.map(i => i.id);
    const missing = targets.filter(t => !foundIDs.includes(t));

    console.log('\n--- Missing Ingredients (Not in DB) ---');
    console.log(missing);

    const found = ingredients.filter(i => targets.includes(i.id));

    console.log('\n--- Found Ingredients ---');
    found.forEach(i => {
        console.log(`[${i.id}] ${i.name_en} / ${i.name_zh} (Category: ${i.category})`);
    });

    // Special check for user question about "香甜酒"
    const sweetLiq = ingredients.find(i => i.name_zh === '香甜酒' || i.name_en === 'Sweet Liqueur');
    if (sweetLiq) {
        console.log('\n!!! Found specific "香甜酒" item:', sweetLiq);
    } else {
        console.log('\n--- "香甜酒" exact match not found ---');
    }
}

checkIngredients();
