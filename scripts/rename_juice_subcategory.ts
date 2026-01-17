
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

async function renameSubcategory() {
    console.log('Renaming "juice" subcategory...');

    const { data, error } = await supabase
        .from('ingredient_subcategories')
        .update({
            name_en: 'Fruit Juice / Vegetable Juice',
            name_zh: '果汁 / 蔬果汁'
        })
        .eq('id', 'juice')
        .select();

    if (error) {
        console.error('Error updating subcategory:', error);
    } else {
        console.log('Successfully updated subcategory:', data);
    }
}

renameSubcategory();
