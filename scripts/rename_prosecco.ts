import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load env
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
    console.log('Renaming Prosecco to 普羅賽克...');

    const { error } = await supabase
        .from('ingredients')
        .update({ name_zh: '普羅賽克' })
        .eq('id', 'prosecco');

    if (error) {
        console.error('Error updating Prosecco:', error);
    } else {
        console.log('Success: Prosecco renamed.');
    }
}

run();
