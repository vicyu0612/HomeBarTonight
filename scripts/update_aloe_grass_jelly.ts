
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env from parents
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase env vars (need SERVICE_ROLE_KEY)');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrate() {
    console.log('--- Reclassifying Aloe and Grass Jelly ---');

    // 1. Move Aloe to Vegetable & Fruit Juice
    // Target: category='mixer', subcategory='juice' OR category='fruit_dessert' -> 'juice'? 
    // User asked for "蔬果汁底下" which corresponds to category='mixer', subcategory='juice' (see MyBarModal labels).
    // Current 'aloe' is category='mixer', subcategory='dairy'.
    console.log('Moving "aloe" to Mixer > Juice...');
    const { error: aloeError } = await supabase
        .from('ingredients')
        .update({ category: 'mixer', subcategory: 'juice' })
        .eq('id', 'aloe');

    if (aloeError) console.error('Error updating aloe:', aloeError);
    else console.log('✓ Aloe Drink updated.');

    // 2. Move Grass Jelly to Dessert
    // Target: category='fruit_dessert', subcategory='dessert'
    console.log('Moving "grass_jelly" to Fruit & Dessert > Dessert...');
    const { error: grassError } = await supabase
        .from('ingredients')
        .update({ category: 'fruit_dessert', subcategory: 'dessert' })
        .eq('id', 'grass_jelly');

    if (grassError) console.error('Error updating grass jelly:', grassError);
    else console.log('✓ Grass Jelly updated.');

    // Double check
    const { data } = await supabase.from('ingredients').select('id, category, subcategory').in('id', ['aloe', 'grass_jelly']);
    console.table(data);
}

migrate();
