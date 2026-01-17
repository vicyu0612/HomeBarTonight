
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// ES Module fix for __dirname
const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing env vars');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrate() {
    console.log('--- Adding Herbs & Spices Subcategory ---');

    // 1. Insert New Subcategory
    const newSubcat = {
        id: 'herbs_spices',
        category_id: 'garnish', // Placing under Garnish & Others
        name_en: 'Herbs & Spices',
        name_zh: '香料 & 藥草',
        sort_order: 2 // After 'pantry' (which is 1)
    };

    const { error: insertError } = await supabase
        .from('ingredient_subcategories')
        .upsert(newSubcat);

    if (insertError) {
        console.error('Error inserting subcategory:', insertError);
        return;
    }
    console.log(`✓ Created subcategory: [${newSubcat.id}] ${newSubcat.name_en}`);

    // 2. Update Ingredients
    const targetIngredients = ['mint', 'olive', 'celery', 'nutmeg'];

    const { error: updateError } = await supabase
        .from('ingredients')
        .update({ subcategory: 'herbs_spices' })
        .in('id', targetIngredients);

    if (updateError) {
        console.error('Error updating ingredients:', updateError);
        return;
    }

    console.log(`✓ Updated ${targetIngredients.length} ingredients to 'herbs_spices'.`);
}

migrate();
