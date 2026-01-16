
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
    console.log('--- Inspecting "Coffee" Ingredients ---');
    // Search for Espresso, Hot Coffee, Americano
    const { data: coffeeData, error: coffeeError } = await supabase
        .from('ingredients')
        .select('*')
        .or('name_en.ilike.%Espresso%,name_zh.ilike.%濃縮咖啡%,name_en.ilike.%Coffee%,name_zh.ilike.%咖啡%');

    if (coffeeError) console.error('Error finding coffee:', coffeeError);
    else {
        console.log(`Found ${coffeeData.length} matches:`);
        console.table(coffeeData.map(i => ({ id: i.id, name_zh: i.name_zh, name_en: i.name_en, aliases: i.aliases })));
    }
}

inspect();
