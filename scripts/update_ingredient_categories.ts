
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env from parents
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use Service Role Key for updates

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase env vars (need SERVICE_ROLE_KEY for updates)');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrate() {
    console.log('--- Starting Migration ---');

    // 1. Move Plum to Fruit & Dessert (subcategory: fruit)
    console.log('Moving "plum" to fruit_dessert...');
    const { error: plumError } = await supabase
        .from('ingredients')
        .update({ category: 'fruit_dessert', subcategory: 'fruit' })
        .eq('id', 'plum');

    if (plumError) {
        console.error('Error updating plum:', plumError);
    } else {
        console.log('✓ Plum updated.');
    }

    // 2. Remove subcategories from all ingredients currently in 'garnish'
    // Note: Plum is already moved, so it won't be touched here.
    console.log('Clearing subcategories for "garnish" items...');
    const { data: garnishItems, error: findError } = await supabase
        .from('ingredients')
        .select('id, name_zh')
        .eq('category', 'garnish')
        .not('subcategory', 'is', null);

    if (findError) {
        console.error('Error finding garnish items:', findError);
        return;
    }

    if (garnishItems.length > 0) {
        console.log(`Found ${garnishItems.length} items to update:`, garnishItems.map(i => i.name_zh).join(', '));

        const { error: updateError } = await supabase
            .from('ingredients')
            .update({ subcategory: null })
            .eq('category', 'garnish');

        if (updateError) {
            console.error('Error clearing garnish subcategories:', updateError);
        } else {
            console.log('✓ Garnish subcategories cleared.');
        }
    } else {
        console.log('No garnish items with subcategories found (after plum move).');
    }
}

migrate();
