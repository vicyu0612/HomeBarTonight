
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
const envPath = path.resolve(__dirname, '../.env.local');
dotenv.config({ path: envPath });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkIngredients() {
    console.log('Checking for missing ingredients...');

    try {
        // 1. Read recipes.ts
        const recipesPath = path.resolve(__dirname, '../src/data/recipes.ts');
        const fileContent = fs.readFileSync(recipesPath, 'utf-8');

        const match = fileContent.match(/export const recipes: Recipe\[\] = (\[[\s\S]*?\]);\s*$/m);
        if (!match) throw new Error('Could not extract recipes');

        const recipes = eval(match[1]);

        // 2. Extract all unique ingredient IDs from recipes
        const usedIngredients = new Set();
        recipes.forEach((r, idx) => {
            if (!Array.isArray(r.ingredients)) {
                console.warn(`Warning: Recipe [${r.id || idx}] has invalid ingredients:`, r.ingredients);
                return;
            }
            r.ingredients.forEach(i => usedIngredients.add(i.id));
        });

        console.log(`Found ${usedIngredients.size} unique ingredients used in ${recipes.length} recipes.`);

        // 3. Fetch existing ingredients from Supabase
        const { data: existingIngredients, error } = await supabase
            .from('ingredients')
            .select('id');

        if (error) throw error;

        const existingIds = new Set(existingIngredients.map(i => i.id));
        console.log(`Found ${existingIds.size} ingredients in database.`);

        // 4. Find missing
        const missing = [...usedIngredients].filter(id => !existingIds.has(id));

        if (missing.length === 0) {
            console.log('All ingredients are present in the database! ✅');
        } else {
            console.log(`Found ${missing.length} MISSING ingredients:`);
            console.log(missing);

            // Generate SQL template for missing items
            console.log('\n--- SQL Insert Template ---');
            console.log(`INSERT INTO ingredients (id, name_en, name_zh, category) VALUES`);
            missing.forEach((id, index) => {
                const separator = index === missing.length - 1 ? ';' : ',';
                console.log(`('${id}', 'Name EN', 'Name ZH', 'other_alc')${separator}`); // Placeholder values
            });
        }

    } catch (err) {
        console.error('Script failed:', err);
    }
}

checkIngredients();
