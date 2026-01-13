
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(process.env.VITE_SUPABASE_URL!, process.env.VITE_SUPABASE_ANON_KEY!);

async function main() {
    const targetIds = ['white-russian', 'french-75', 'mint-julep', 'old-fashioned', 'mojito', 'dry-martini', 'martini', 'cosmopolitan'];

    // Fetch raw data
    const { data: recipes, error } = await supabase
        .from('recipes')
        .select('*')
        .in('id', targetIds);

    if (error) {
        console.error('Supabase Error:', error);
        return;
    }

    console.log('--- DATA INSPECTION ---');
    recipes.forEach(r => {
        console.log(`\nID: ${r.id}`);
        console.log(`Tags (${typeof r.tags}):`, JSON.stringify(r.tags));
        console.log(`Description (${typeof r.description}):`, JSON.stringify(r.description));
        // Check if description is double-stringified or weird structure
        if (typeof r.description === 'string') {
            console.log('WARNING: Description is a STRING, should be OBJECT/JSON');
        }
    });
}

main();
