
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env from parents
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase env vars');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function debug() {
    console.log('--- Inspecting Recipe Schema ---');

    const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .limit(1);

    if (error) {
        console.error('Error fetching recipe:', error);
    } else if (data && data.length > 0) {
        console.log('Sample Recipe Keys:', Object.keys(data[0]));
        console.log('Sample Data:', data[0]);
    } else {
        console.log('No recipes found to inspect.');
    }
}

debug();
