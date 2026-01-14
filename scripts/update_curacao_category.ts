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
    console.log('Updating Blue Curacao category...');

    const { error } = await supabase
        .from('ingredients')
        .update({ category: 'liqueur' })
        .eq('id', 'curacao');

    if (error) {
        console.error('Error updating category:', error);
    } else {
        console.log('Success: Blue Curacao category updated to liqueur.');
    }
}

run();
