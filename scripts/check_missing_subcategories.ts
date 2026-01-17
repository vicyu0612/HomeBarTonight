
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

async function check() {
    console.log('--- Checking for Ingredients with Missing Subcategories ---');

    // 1. Fetch all Valid Subcategory IDs
    const { data: subcats, error: subError } = await supabase
        .from('ingredient_subcategories')
        .select('id');

    if (subError) {
        console.error('Error fetching subcategories:', subError);
        return;
    }

    const validSubcatIds = new Set(subcats.map(s => s.id));
    console.log(`Found ${validSubcatIds.size} valid subcategories.`);

    // 2. Fetch all Ingredients
    const { data: ingredients, error: ingError } = await supabase
        .from('ingredients')
        .select('id, name_en, name_zh, subcategory');

    if (ingError) {
        console.error('Error fetching ingredients:', ingError);
        return;
    }

    console.log(`Scanned ${ingredients.length} ingredients.`);

    // 3. Find Missing or Invalid
    const missing = [];
    const invalid = [];

    for (const ing of ingredients) {
        if (!ing.subcategory) {
            missing.push(ing);
        } else if (!validSubcatIds.has(ing.subcategory)) {
            invalid.push(ing);
        }
    }

    // 4. Report
    if (missing.length > 0) {
        console.log(`\n⚠️  Found ${missing.length} ingredients with NO subcategory:`);
        missing.forEach(ing => {
            console.log(` - [${ing.id}] ${ing.name_en} (${ing.name_zh})`);
        });
    } else {
        console.log('\n✅ No ingredients with missing subcategory.');
    }

    if (invalid.length > 0) {
        console.log(`\n🚫 Found ${invalid.length} ingredients with INVALID subcategory ID:`);
        invalid.forEach(ing => {
            console.log(` - [${ing.id}] ${ing.name_en} (${ing.name_zh}) -> '${ing.subcategory}'`);
        });
    } else {
        console.log('\n✅ No ingredients with invalid subcategory IDs.');
    }
}

check();
