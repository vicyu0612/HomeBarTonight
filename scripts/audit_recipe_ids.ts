
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing env vars');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspect() {
    console.log('--- Inspecting Recipe IDs ---');

    const { data: recipes } = await supabase
        .from('recipes')
        .select('id');

    if (recipes) {
        const nonKebab = recipes.filter(r => !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(r.id));
        console.log(`Total Recipes: ${recipes.length}`);
        console.log(`Non-Kebab IDs: ${nonKebab.length}`);

        if (nonKebab.length > 0) {
            console.table(nonKebab);
            console.log('\nSuggested Renames:');
            nonKebab.forEach(r => {
                const newId = r.id.toLowerCase().replace(/_/g, '-').replace(/\s+/g, '-');
                console.log(`${r.id} -> ${newId}`);
            });
        }
    }
}

inspect();
