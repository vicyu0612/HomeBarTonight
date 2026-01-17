
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env from parents
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase env vars');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function audit() {
    console.log('--- Auditing Recipe Base Spirits & Ingredients ---');

    const { data: recipes, error } = await supabase
        .from('recipes')
        .select('id, name, base_spirit, ingredients');

    if (error) {
        console.error(error);
        return;
    }

    // 1. Check Wine/Champagne
    console.log('\n--- Reviewing "Wine" Base Spirit ---');
    const wineRecipes = recipes.filter(r => r.base_spirit && r.base_spirit.includes('wine'));

    if (wineRecipes.length === 0) console.log('No recipes with base_spirit "wine".');
    else {
        wineRecipes.forEach(r => {
            console.log(`[${r.id}] ${r.name.zh} (${r.name.en})`);
            console.log(`  Base Spirits: ${r.base_spirit}`);
            // Inspect ingredients to see if it's Champagne or Red/White wine
            // Assuming structure is ingredients: { en: [{name: 'Champagne', amount: '...'}], ... }
            const ingNames = r.ingredients.en.map((i: any) => i.name).join(', ');
            console.log(`  Ingredients: ${ingNames}`);
        });
    }
}

audit();
