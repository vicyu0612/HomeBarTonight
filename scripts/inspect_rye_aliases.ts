
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env from parents
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase env vars');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspect() {
    console.log('--- Inspecting Rye Whiskey Aliases ---');

    const { data: rye } = await supabase
        .from('ingredients')
        .select('id, name_zh, name_en, aliases')
        .eq('id', 'rye_whiskey')
        .single();

    const { data: whiskey } = await supabase
        .from('ingredients')
        .select('id, aliases')
        .eq('id', 'whiskey')
        .single();

    if (rye) console.log('Rye Whiskey:', rye);
    else console.log('Rye Whiskey not found.');

    if (whiskey) {
        console.log('Generic Whiskey Aliases:', whiskey.aliases);
    }
}

inspect();
