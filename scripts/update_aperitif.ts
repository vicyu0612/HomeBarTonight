
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
    console.log('--- Migrating to Aperitif ---');

    // 1. Move Aperol & Campari to Other Alcohol > Aperitif
    console.log('Moving Aperol & Campari...');
    const { error: bitterError } = await supabase
        .from('ingredients')
        .update({ category: 'other_alc', subcategory: 'aperitif' })
        .in('id', ['aperol', 'campari']);

    if (bitterError) console.error('Error moving Aperol/Campari:', bitterError);
    else console.log('✓ Aperol & Campari moved.');

    // 2. Move Vermouths to Other Alcohol > Aperitif
    console.log('Moving Vermouths...');
    const { error: vermouthError } = await supabase
        .from('ingredients')
        .update({ category: 'other_alc', subcategory: 'aperitif' })
        .in('id', ['vermouth', 'dry_vermouth']);

    if (vermouthError) console.error('Error moving Vermouths:', vermouthError);
    else console.log('✓ Vermouths moved.');

    // 3. Move Lillet Blanc (existing Other Alc + Floral Liqueur) to Aperitif
    // This effectively "renames" the subcategory for items in Other Alcohol.
    console.log('Moving Lillet Blanc...');
    const { error: lilletError } = await supabase
        .from('ingredients')
        .update({ subcategory: 'aperitif' }) // category already other_alc
        .eq('id', 'lillet_blanc');

    if (lilletError) console.error('Error moving Lillet Blanc:', lilletError);
    else console.log('✓ Lillet Blanc moved.');

    // Double check
    const ids = ['aperol', 'campari', 'vermouth', 'dry_vermouth', 'lillet_blanc'];
    const { data } = await supabase.from('ingredients').select('id, category, subcategory').in('id', ids);
    console.table(data);
}

migrate();
