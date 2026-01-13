
import { createClient } from '@supabase/supabase-js';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(process.env.VITE_SUPABASE_URL!, process.env.VITE_SUPABASE_ANON_KEY!);

async function check() {
    const ids = ['umeshu', 'coffee_milk', 'papaya_milk', 'soju'];
    const { data, error } = await supabase
        .from('ingredients')
        .select('*')
        .in('id', ids);

    if (error) console.error(error);
    else console.log('Found ingredients:', data);
}

check();
