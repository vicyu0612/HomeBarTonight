
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing env vars (need SERVICE_ROLE_KEY)');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const targets = [
    'gin_fizz',
    'mocktail_arnold_palmer',
    'mocktail_cinderella',
    'mocktail_coffee_tonic',
    'mocktail_cranberry_cutie',
    'mocktail_gunner',
    'mocktail_lemon_lime_bitters',
    'mocktail_roy_rogers',
    'mocktail_shirley_temple',
    'mocktail_virgin_mary',
    'mocktail_virgin_mojito'
];

async function migrate() {
    console.log('--- Migrating Recipe IDs to Kebab-Case ---');

    for (const oldId of targets) {
        const newId = oldId.replace(/_/g, '-');
        console.log(`Processing ${oldId} -> ${newId}...`);

        // 1. Check if old exists
        const { data: oldRecipe } = await supabase.from('recipes').select('*').eq('id', oldId).single();
        if (!oldRecipe) {
            console.log(`  Skipping: ${oldId} not found.`);
            continue;
        }

        // 2. Check if new already exists (safety)
        const { data: newRecipe } = await supabase.from('recipes').select('id').eq('id', newId).single();
        if (newRecipe) {
            console.log(`  Skipping: ${newId} already exists.`);
            // If needed, we could delete old here if it's a duplicate? 
            // But safer to manually intervene.
            continue;
        }

        // 3. Try Update (Renaming PK)
        const { error: updateError } = await supabase
            .from('recipes')
            .update({ id: newId })
            .eq('id', oldId);

        if (updateError) {
            console.error(`  Update failed for ${oldId}: ${updateError.message}`);

            // Fallback: Clone and Delete (This WILL break favorites)
            console.log(`  Attempting Clone & Delete for ${oldId}...`);
            const { id: _, ...rest } = oldRecipe;
            const { error: insertError } = await supabase.from('recipes').insert([{ ...rest, id: newId }]);

            if (insertError) {
                console.error(`  Insert failed: ${insertError.message}`);
            } else {
                const { error: deleteError } = await supabase.from('recipes').delete().eq('id', oldId);
                if (deleteError) console.error(`  Delete failed: ${deleteError.message}`);
                else console.log(`  ✓ Cloned to ${newId} and deleted ${oldId}`);
            }
        } else {
            console.log(`  ✓ Renamed ${oldId} to ${newId}`);
        }
    }
}

migrate();
