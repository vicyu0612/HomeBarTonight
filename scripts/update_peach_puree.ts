
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
    console.log('--- Moving "peach_puree" to Fruit & Dessert (Dessert) ---');

    const { error } = await supabase
        .from('ingredients')
        .update({ category: 'fruit_dessert', subcategory: 'dessert' })
        .eq('id', 'peach_puree');

    if (error) {
        console.error('Error updating peach_puree:', error);
    } else {
        console.log('✓ White Peach Puree updated successfully.');
    }

    // Double check
    const { data } = await supabase.from('ingredients').select('*').eq('id', 'peach_puree');
    console.table(data);
}

migrate();
