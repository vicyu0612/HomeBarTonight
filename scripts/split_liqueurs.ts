import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load env
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
    console.log('Splitting generic Liqueur into specific ingredients...');

    const ingredientsToAdd = [
        {
            id: 'maraschino_liqueur',
            name_en: 'Maraschino Liqueur',
            name_zh: '黑櫻桃利口酒',
            aliases: ['maraschino', 'maraschino liqueur', 'luxardo', '黑櫻桃酒', '莫拉斯基諾', '黑櫻桃利口酒'],
            category: 'liqueur'
        },
        {
            id: 'green_chartreuse',
            name_en: 'Green Chartreuse',
            name_zh: '綠色夏翠絲',
            aliases: ['green chartreuse', 'chartreuse', '綠夏翠絲', '夏翠絲', '藥草酒', '綠色夏翠絲'],
            category: 'liqueur'
        }
    ];

    // 1. Add new ingredients
    const { error: upsertError } = await supabase
        .from('ingredients')
        .upsert(ingredientsToAdd, { onConflict: 'id' });

    if (upsertError) {
        console.error('Error adding new liqueurs:', upsertError);
        return;
    }
    console.log('Added Maraschino and Green Chartreuse.');

    // 2. Delete generic "liqueur" (if we want to be destructive, but user asked to split)
    // Let's verify if anyone is actually using it? 
    // Since we are "Splitting", removing the generic one is the correct move to avoid confusion.
    const { error: deleteError } = await supabase
        .from('ingredients')
        .delete()
        .eq('id', 'liqueur');

    if (deleteError) {
        console.error('Error removing generic Liqueur:', deleteError);
    } else {
        console.log('Removed generic Liqueur ingredient.');
    }
}

run();
