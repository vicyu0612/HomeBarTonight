
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateInventory() {
    console.log('🚀 Updating Inventory Categories...');

    const updates = [
        // 1. Move Almond Syrup (Orgeat) to Essentials (Basic Ingredients)
        { id: 'orgeat', category: 'essential' },
        // 2. Move Grenadine to Essentials
        { id: 'grenadine', category: 'essential' },
        // 3. Move Pudding to Mixers (Common Drinks & Desserts)
        { id: 'pudding', category: 'mixer' },
        // 4. Move Generic Liqueur to Liqueur Category and Rename
        { id: 'liqueur', category: 'liqueur', name_zh: '各式香甜酒 (通用)', name_en: 'Other Liqueur' }
    ];

    for (const update of updates) {
        console.log(`Updating ${update.id}...`);
        const { error } = await supabase
            .from('ingredients')
            .update(update)
            .eq('id', update.id);

        if (error) {
            console.error(`❌ Failed to update ${update.id}:`, error.message);
        } else {
            console.log(`✅ Updated ${update.id}`);
        }
    }
}

updateInventory();
