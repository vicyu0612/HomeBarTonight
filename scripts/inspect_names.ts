
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
    console.log('--- Inspecting Names ---');

    const { data: ingredients, error } = await supabase
        .from('ingredients')
        .select('id, name_en, name_zh')
        .or('name_en.ilike.%Cointreau%,name_en.ilike.%Lemon%');

    if (error) {
        console.error(error);
        return;
    }

    if (ingredients) {
        console.table(ingredients);
    }
}

inspect();
