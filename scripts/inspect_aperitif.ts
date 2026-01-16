
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
    console.log('--- Inspecting Targets for Aperitif ---');
    const targets = ['%艾佩羅%', '%金巴利%', '%香艾酒%']; // Covers Dry Vermouth too

    for (const t of targets) {
        const { data, error } = await supabase
            .from('ingredients')
            .select('*')
            .ilike('name_zh', t);
        if (error) console.error(`Error finding ${t}:`, error);
        else {
            console.log(`Results for ${t}:`);
            console.table(data.map(i => ({ id: i.id, name_zh: i.name_zh, category: i.category, subcategory: i.subcategory })));
        }
    }

    console.log('\n--- Inspecting current "floral_liqueur" subcategory ---');
    const { data: floralData, error: floralError } = await supabase
        .from('ingredients')
        .select('*')
        .eq('subcategory', 'floral_liqueur');

    if (floralError) console.error('Error finding floral_liqueur:', floralError);
    else {
        console.log(`Found ${floralData.length} floral_liqueur items:`);
        console.table(floralData.map(i => ({ id: i.id, name_zh: i.name_zh, category: i.category })));
    }
}

inspect();
