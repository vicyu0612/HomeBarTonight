
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
    console.log('--- Inspecting "Whiskey" Definition ---');

    // 1. Get the generic 'whiskey' item
    const { data: whiskey } = await supabase
        .from('ingredients')
        .select('*')
        .eq('id', 'whiskey')
        .single();

    if (whiskey) {
        console.log('Generic Whiskey Item:');
        console.log(whiskey);
    } else {
        console.log('No ID "whiskey" found.');
    }

    // 2. See what other whiskeys exist
    console.log('\n--- Other Whiskey Ingredients ---');
    const { data: others } = await supabase
        .from('ingredients')
        .select('id, name_zh, name_en, subcategory')
        .ilike('id', '%whiskey%') // or generic search
        .neq('id', 'whiskey');

    if (others) console.table(others);

    // 3. Search by category 'base' and subcategory 'whiskey' if exists
    const { data: catWhiskeys } = await supabase
        .from('ingredients')
        .select('id, name_zh, name_en')
        .eq('subcategory', 'whiskey');

    console.log('\n--- Ingredients in subcategory "whiskey" ---');
    if (catWhiskeys) console.table(catWhiskeys);
}

inspect();
