
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

async function debug() {
    console.log('--- Searching for Recipe "美式威士忌" ---');

    // 1. Find Recipe
    const { data: recipes, error } = await supabase
        .from('recipes')
        .select('id, name_zh, name_en')
        .ilike('name_zh', '%美式威士忌%');

    if (error) {
        console.error('Error finding recipe:', error);
        return;
    }

    if (!recipes || recipes.length === 0) {
        console.log('No recipe named 美式威士忌 found.');
        return;
    }

    console.log(`Found ${recipes.length} match(es):`);

    for (const r of recipes) {
        console.log(`\nRecipe: ${r.name_zh} (${r.name_en}) [ID: ${r.id}]`);

        // 2. Find Ingredients for this recipe
        const { data: relations } = await supabase
            .from('recipe_ingredients')
            .select('ingredient_id')
            .eq('recipe_id', r.id);

        if (!relations || relations.length === 0) {
            console.log('  No ingredients linked.');
            continue;
        }

        const ingIds = relations.map(rel => rel.ingredient_id);

        // 3. Get Ingredient Details
        const { data: ingredients } = await supabase
            .from('ingredients')
            .select('id, name_zh, name_en, category, subcategory, aliases')
            .in('id', ingIds);

        if (ingredients) {
            console.table(ingredients);
        }
    }
}

debug();
