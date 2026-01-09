import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateCollection() {
    const newIds = [
        'whiskey-hot-milk-tea',
        'hot-gin-ginger',
        'hot-plum-sake',
        'warm-apple-whiskey',
        'hot-white-wine-peach',
        'grass-jelly-jagermeister',
        'sake-barley-tea'
    ];

    console.log('Updating winter-warmers collection IDs...');

    // Supabase stores arrays as JSONB or Array depending on column. 
    // 'recipe_ids' usually text[] or jsonb. from 'collections.ts' it is string[].
    // Sending as array should work.

    const { data, error } = await supabase
        .from('collections')
        .update({ recipe_ids: newIds })
        .eq('id', 'winter-warmers')
        .select();

    if (error) {
        console.error('Error updating collection:', error);
    } else {
        console.log('Success! Updated collection:', data);
    }
}

updateCollection();
