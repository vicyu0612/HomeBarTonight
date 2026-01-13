
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(process.env.VITE_SUPABASE_URL!, process.env.VITE_SUPABASE_ANON_KEY!);

async function main() {
    const { data: recipes, error } = await supabase.from('recipes').select('*');
    if (error) {
        console.error(error);
        return;
    }

    console.log(JSON.stringify(recipes.map(r => ({
        id: r.id,
        name: r.name,
        ingredients: r.ingredients.en.map((i: any) => i.name.toLowerCase()).sort()
    })), null, 2));
}

main();
