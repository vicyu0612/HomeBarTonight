import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

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
    const sqlValues = {
        id: 'benedictine',
        name_en: 'Bénédictine',
        name_zh: '班尼狄克丁',
        aliases: ['dom', 'dom benedictine', 'dom 班尼狄克汀', 'benedictine', 'bénédictine', '班尼狄克丁'],
        category: 'liqueur'
    };

    console.log(`Adding ${sqlValues.id}...`);

    const { error } = await supabase
        .from('ingredients')
        .upsert(sqlValues, { onConflict: 'id' });

    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Success! Ingredient added.');
    }
}

run();
