
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
    console.log('--- Adding "Iced Americano" alias to Coffee Ingredients ---');

    const targets = ['black_coffee', 'espresso'];

    for (const id of targets) {
        const { data: ing, error } = await supabase
            .from('ingredients')
            .select('id, aliases')
            .eq('id', id)
            .single();

        if (error || !ing) {
            console.error(`Error fetching ${id}:`, error);
            continue;
        }

        console.log(`${id} current aliases:`, ing.aliases);

        const newAliases = new Set(ing.aliases || []);
        // Add variants
        newAliases.add('Iced Americano');
        newAliases.add('iced americano');
        // Ensure Americano is there too
        newAliases.add('Americano');

        const updated = Array.from(newAliases);

        const { error: updateError } = await supabase
            .from('ingredients')
            .update({ aliases: updated })
            .eq('id', id);

        if (updateError) console.error(`Error updating ${id}:`, updateError);
        else console.log(`✓ ${id} updated with "Iced Americano".`);
    }
}

migrate();
