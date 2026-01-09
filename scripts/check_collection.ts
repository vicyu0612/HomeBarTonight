import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCollection() {
    const { data, error } = await supabase
        .from('collections')
        .select('*')
        .eq('id', 'party-time');

    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Collection:', JSON.stringify(data, null, 2));
    }
}

checkCollection();
