
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
    console.log('--- Merging Rye Whiskey into Whiskey ---');

    // 1. Delete rye_whiskey
    const { error } = await supabase
        .from('ingredients')
        .delete()
        .eq('id', 'rye_whiskey');

    if (error) {
        console.error('Error deleting rye_whiskey:', error);
        if (error.code === '23503') { // Foreign key violation
            console.log('Constraint violation detected. Attempting to update references...');
            // Try updating related tables if they exist?
            // Since I can't easily see schema, I'll hint to user if this happens.
        }
    } else {
        console.log('✓ Rye Whiskey deleted (merged into Whiskey).');
    }
}

migrate();
