
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(process.env.VITE_SUPABASE_URL!, process.env.VITE_SUPABASE_ANON_KEY!);

async function checkSchema() {
    console.log('Fetching one recipe to check schema...');
    // Select all columns to see what's available
    const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .limit(1);

    if (error) {
        console.error('Error fetching data:', error);
        return;
    }

    if (data && data.length > 0) {
        console.log('Recipe Schema Keys:', Object.keys(data[0]));
        // Optional: print columns related to instructions
        const instructionsKeys = Object.keys(data[0]).filter(k => k.includes('instruction') || k.includes('step'));
        console.log('Possible instruction columns:', instructionsKeys);
    } else {
        console.log('No recipes found.');
    }
}

checkSchema();
