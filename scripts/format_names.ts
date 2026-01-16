
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env from parents
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase env vars (need SERVICE_ROLE_KEY)');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrate() {
    console.log('--- Formatting Names ---');

    // 1. Cointreau
    const { error: err1 } = await supabase
        .from('ingredients')
        .update({
            name_en: 'Cointreau / Curacao',
            name_zh: '橙酒 / 柑橘酒'
        })
        .eq('id', 'cointreau');

    if (err1) console.error('Error updating cointreau:', err1);
    else console.log('✓ Cointreau updated.');

    // 2. Lemon
    const { error: err2 } = await supabase
        .from('ingredients')
        .update({
            name_en: 'Lemon / Lime',
            name_zh: '檸檬 / 萊姆'
        })
        .eq('id', 'lemon');

    if (err2) console.error('Error updating lemon:', err2);
    else console.log('✓ Lemon updated.');
}

migrate();
