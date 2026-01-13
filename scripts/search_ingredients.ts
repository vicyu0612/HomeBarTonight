
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(process.env.VITE_SUPABASE_URL!, process.env.VITE_SUPABASE_ANON_KEY!);

async function searchIngredients() {
    const term1 = 'cranberry';
    const term2 = 'lime';
    const term3 = 'lemon';

    console.log(`Searching for "${term1}", "${term2}", "${term3}"...`);

    const { data: allIngs, error } = await supabase
        .from('ingredients')
        .select('*');

    if (error) {
        console.error('Error:', error);
        return;
    }

    const data = allIngs.filter(i => {
        const str = JSON.stringify(i);
        return str.toLowerCase().includes(term1) || str.toLowerCase().includes(term2) || str.toLowerCase().includes(term3);
    });

    if (error) {
        console.error('Error:', error);
        return;
    }

    console.log('Found matches:');
    data.forEach(i => {
        console.log(`- ID: ${i.id}, Name: ${JSON.stringify(i.name)}`);
    });
}

searchIngredients();
