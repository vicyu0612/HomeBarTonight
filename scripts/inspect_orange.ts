
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
    console.log('--- Inspecting "Orange" ---');
    const { data: orangeData, error: orangeError } = await supabase
        .from('ingredients')
        .select('*')
        .or('id.eq.orange,name_zh.ilike.%柳橙%,name_en.ilike.%Orange%');

    if (orangeError) console.error('Error finding orange:', orangeError);
    else {
        console.log(`Found ${orangeData.length} matches:`);
        console.table(orangeData);
    }
}

inspect();
