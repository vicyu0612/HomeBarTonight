
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(process.env.VITE_SUPABASE_URL!, process.env.VITE_SUPABASE_ANON_KEY!);

async function fetchRecipes() {
    const { data, error } = await supabase
        .from('recipes')
        .select('id, name, specs, ingredients, base_spirit');

    if (error) {
        console.error('Error fetching recipes:', error);
        return;
    }

    console.log('Recipe Analysis Data:');
    data.forEach(r => {
        let name = r.name;
        if (typeof name === 'object' && name !== null && 'en' in name) {
            name = `${name.en} (${name.zh || ''})`;
        }
        console.log(`ID: ${r.id} | Name: ${JSON.stringify(r.name)} | Specs: ${JSON.stringify(r.specs)}`);
    });
}

fetchRecipes();
