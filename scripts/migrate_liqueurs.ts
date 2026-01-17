
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
    console.log('--- Migrating Recipes to "Umeshu & Baileys" Base Spirit ---');

    // Define updates
    // For 'add', we append to existing.
    // For 'replace_all', we set the array exactly.
    const updates = [
        { id: 'umeshu-green-tea', spirits: ['umeshu'] }, // Was liqueur
        { id: 'baileys-hot-chocolate', spirits: ['baileys'] }, // Was liqueur
        { id: 'soy-milk-baileys', spirits: ['baileys'] }, // Was liqueur
        { id: 'baileys-milktea', spirits: ['baileys'] }, // Was liqueur
        { id: 'b52', spirits: ['liqueur', 'baileys'] }, // Keep liqueur (Kahlua+Grand Marnier)
        { id: 'mudslide', spirits: ['vodka', 'liqueur', 'baileys'] } // Keep vodka, liqueur (Kahlua)
    ];

    for (const { id, spirits } of updates) {
        const { data: recipe, error } = await supabase
            .from('recipes')
            .select('id, base_spirit')
            .eq('id', id)
            .single();

        if (!recipe) {
            console.log(`Skipping ${id} (not found)`);
            continue;
        }

        const original = recipe.base_spirit;

        const { error: updateError } = await supabase
            .from('recipes')
            .update({ base_spirit: spirits })
            .eq('id', id);

        if (updateError) console.error(`Error updating ${id}:`, updateError);
        else console.log(`✓ ${id}: ${JSON.stringify(original)} -> ${JSON.stringify(spirits)}`);
    }
}

migrate();
