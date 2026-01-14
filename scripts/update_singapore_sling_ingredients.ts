import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

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
    console.log('Starting Singapore Sling ingredients update...');

    // 1. Add Pineapple Juice
    const pineapple = {
        id: 'pineapple_juice',
        name_en: 'Pineapple Juice',
        name_zh: '鳳梨汁',
        aliases: ['pineapple juice', '鳳梨汁'],
        category: 'mixer'
    };

    const { error: pineappleError } = await supabase
        .from('ingredients')
        .upsert(pineapple, { onConflict: 'id' });

    if (pineappleError) console.error('Error adding Pineapple Juice:', pineappleError);
    else console.log('Added Pineapple Juice.');

    // 2. Update Brandy aliases
    const { data: brandy, error: fetchError } = await supabase
        .from('ingredients')
        .select('*')
        .eq('id', 'brandy')
        .single();

    if (fetchError || !brandy) {
        console.error('Error fetching Brandy:', fetchError);
        return;
    }

    const newAliases = ['cherry brandy', '櫻桃白蘭地'];
    const currentAliases = brandy.aliases || [];

    const updatedAliases = [...new Set([...currentAliases, ...newAliases])];

    const { error: updateError } = await supabase
        .from('ingredients')
        .update({ aliases: updatedAliases })
        .eq('id', 'brandy');

    if (updateError) console.error('Error updating Brandy aliases:', updateError);
    else console.log('Updated Brandy aliases.');
}

run();
