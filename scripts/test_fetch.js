
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
const envPath = path.resolve(__dirname, '../.env.local');
dotenv.config({ path: envPath });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testFetch() {
    console.log('Testing Supabase Fetch...');

    // 1. Fetch Recipes
    console.log('\n--- Fetching Recipes (First 3) ---');
    const { data: recipes, error: rError } = await supabase.from('recipes').select('id, name, collections').range(0, 2);
    if (rError) console.error('Recipes Fetch Error:', rError);
    else console.log('Recipes result:', JSON.stringify(recipes, null, 2));

    // 2. Fetch Collections
    console.log('\n--- Fetching Collections ---');
    const { data: collections, error: cError } = await supabase.from('collections').select('*').eq('is_active', true);
    if (cError) console.error('Collections Fetch Error:', cError);
    else {
        console.log(`Found ${collections.length} collections.`);
        collections.forEach(c => {
            console.log(`- ID: ${c.id}, Type: ${c.type}, Rules: ${JSON.stringify(c.filter_rules)}`);
        });
    }

    // 3. Check "featured_banners" existence (Expect error)
    console.log('\n--- Checking featured_banners existence ---');
    const { data: banners, error: bError } = await supabase.from('featured_banners').select('*');
    if (bError) console.log('Featured Banners Error (Expected 404/400):', bError.message);
    else console.log('Featured Banners Found:', banners);
}

testFetch();
