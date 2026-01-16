
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

async function inspect() {
    console.log('--- Inspecting "Aloe" ---');
    const { data: aloeData, error: aloeError } = await supabase
        .from('ingredients')
        .select('*')
        .ilike('name_zh', '%蘆薈%');

    if (aloeError) console.error('Error finding aloe:', aloeError);
    else console.table(aloeData);

    console.log('--- Inspecting "Grass Jelly" ---');
    const { data: grassData, error: grassError } = await supabase
        .from('ingredients')
        .select('*')
        .ilike('name_zh', '%仙草%');

    if (grassError) console.error('Error finding grass jelly:', grassError);
    else console.table(grassData);
}

inspect();
