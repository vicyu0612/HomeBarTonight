
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
    console.log('--- Migrating Recipes to "Champagne" Base Spirit ---');

    const targetIds = [
        'mimosa',
        'french-75',
        'aperol-spritz',
        'bellini',
        'kir-royale',
        'hugo',
        'champagne-cocktail'
    ];

    for (const id of targetIds) {
        const { data: recipe, error } = await supabase
            .from('recipes')
            .select('id, base_spirit')
            .eq('id', id)
            .single();

        if (!recipe) {
            console.log(`Skipping ${id} (not found)`);
            continue;
        }

        let spirits: string[] = recipe.base_spirit || [];
        const original = [...spirits];

        // Remove 'wine' if present
        spirits = spirits.filter(s => s !== 'wine');

        // Add 'champagne'
        if (!spirits.includes('champagne')) {
            spirits.push('champagne');
        }

        // Update
        const { error: updateError } = await supabase
            .from('recipes')
            .update({ base_spirit: spirits })
            .eq('id', id);

        if (updateError) console.error(`Error updating ${id}:`, updateError);
        else console.log(`✓ ${id}: ${JSON.stringify(original)} -> ${JSON.stringify(spirits)}`);
    }
}

migrate();
