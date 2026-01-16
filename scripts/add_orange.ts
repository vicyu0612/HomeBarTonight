
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
    console.log('--- Adding "Orange" Ingredient ---');

    const orange = {
        id: 'orange',
        name_zh: '柳橙',
        name_en: 'Orange',
        category: 'fruit_dessert',
        subcategory: 'fruit',
        aliases: ['柳橙', '柳橙片', 'orange', 'orange slice']
    };

    // Check if exists first to avoid PK error
    const { data: existing } = await supabase.from('ingredients').select('id').eq('id', 'orange').single();

    if (existing) {
        console.log('Orange already exists, updating aliases/category...');
        const { error } = await supabase
            .from('ingredients')
            .update({
                category: 'fruit_dessert',
                subcategory: 'fruit',
                aliases: orange.aliases
            })
            .eq('id', 'orange');

        if (error) console.error('Error updating orange:', error);
        else console.log('✓ Orange updated.');

    } else {
        console.log('Creating new Orange ingredient...');
        const { error } = await supabase
            .from('ingredients')
            .insert([orange]);

        if (error) console.error('Error creating orange:', error);
        else console.log('✓ Orange created.');
    }
}

migrate();
