
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase URL or Service Role Key');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateIngredients() {
    console.log('Updating ingredient sorting and names...');

    // 1. Rename Malibu
    const renameRes = await supabase
        .from('ingredients')
        .update({ name_zh: '馬力寶椰子蘭姆酒' })
        .eq('id', 'malibu');

    if (renameRes.error) console.error('Error renaming Malibu:', renameRes.error);
    else console.log('Renamed Malibu.');

    // 2. Update Sort Orders
    // Default is 100 via migration.

    const updates = [
        { id: 'rum', sort_order: 10 },
        { id: 'malibu', sort_order: 11 },
        { id: 'whiskey', sort_order: 10 },
        { id: 'islay_scotch', sort_order: 11 },
        { id: 'brandy', sort_order: 10 },
        { id: 'cognac', sort_order: 11 },
        { id: 'vermouth', sort_order: 10 }, // Vermouth
        { id: 'dry_vermouth', sort_order: 11 } // Dry Vermouth after Vermouth
    ];

    for (const update of updates) {
        const { error } = await supabase
            .from('ingredients')
            .update({ sort_order: update.sort_order })
            .eq('id', update.id);

        if (error) console.error(`Error updating sort for ${update.id}:`, error);
        else console.log(`Updated sort for ${update.id} to ${update.sort_order}`);
    }
}

updateIngredients();
