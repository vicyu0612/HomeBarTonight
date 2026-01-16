
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
    console.log('--- Adding "Americano" alias to Espresso ---');

    // 1. Get current Espresso aliases
    const { data: espresso, error: fetchError } = await supabase
        .from('ingredients')
        .select('id, aliases')
        .eq('id', 'espresso')
        .single();

    if (fetchError || !espresso) {
        console.error('Error fetching espresso:', fetchError);
        return;
    }

    console.log('Current aliases:', espresso.aliases);

    // 2. Add '美式咖啡', 'Americano' if not present
    const newAliases = new Set(espresso.aliases || []);
    newAliases.add('美式咖啡');
    newAliases.add('Americano');

    const updatedAliases = Array.from(newAliases);

    const { error: updateError } = await supabase
        .from('ingredients')
        .update({ aliases: updatedAliases })
        .eq('id', 'espresso');

    if (updateError) console.error('Error updating espresso:', updateError);
    else console.log('✓ Espresso aliases updated:', updatedAliases);
}

migrate();
