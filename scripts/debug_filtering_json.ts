
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
    console.log('--- Searching for Recipe "美式威士忌" in JSON ---');

    // 1. Find Recipe by JSON name
    // Note: supabase-js/postgrest syntax for JSON text search
    const { data: recipes, error } = await supabase
        .from('recipes')
        .select('*') // Select all to see ingredients JSON too
        // Filter where name->>zh ilike ...
        .ilike('name->>zh', '%美式威士忌%');

    if (error) {
        console.error('Error finding recipe:', error);
        return;
    }

    if (!recipes || recipes.length === 0) {
        console.log('No recipe named 美式威士忌 found.');
        // Try searching for "American" in ZH
        const { data: amRecipes } = await supabase
            .from('recipes')
            .select('*')
            .ilike('name->>zh', '%美式%');
        console.log('Found these "American" recipes instead:', amRecipes?.map(r => r.name));
        return;
    }

    console.log(`Found ${recipes.length} match(es):`);

    for (const r of recipes) {
        console.log(`\nRecipe: ${r.name.zh} (${r.name.en}) [ID: ${r.id}]`);
        console.log('Base Spirit:', r.base_spirit);

        // Check ingredients JSON
        console.log('Ingredients JSON (ZH):', r.ingredients.zh);
        console.log('Ingredients JSON (EN):', r.ingredients.en);

        // 2. Check Relational Ingredients if table exists
        console.log('Checking relational recipe_ingredients...');
        const { data: relations, error: relError } = await supabase
            .from('recipe_ingredients')
            .select('ingredient_id')
            .eq('recipe_id', r.id);

        if (relError) {
            console.log('  table recipe_ingredients error:', relError.message);
        } else if (!relations || relations.length === 0) {
            console.log('  No relational ingredients linked.');
        } else {
            const ingIds = relations.map(rel => rel.ingredient_id);
            console.log('  Relational IDs:', ingIds);

            // 3. Get Ingredient Details
            const { data: ingredients } = await supabase
                .from('ingredients')
                .select('id, name_zh, name_en, category, subcategory, aliases')
                .in('id', ingIds);

            if (ingredients) {
                console.table(ingredients.map(i => ({
                    id: i.id,
                    name_zh: i.name_zh,
                    aliases: i.aliases
                })));
            }
        }
    }
}

debug();
