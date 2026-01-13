
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(process.env.VITE_SUPABASE_URL!, process.env.VITE_SUPABASE_ANON_KEY!);

async function dumpStats() {
    const { data, error } = await supabase
        .from('recipes')
        .select('id, name, specs');

    if (error) {
        console.error('Error fetching recipes:', error);
        return;
    }

    const output = data.map(r => ({
        id: r.id,
        name_en: r.name?.en || r.id,
        ease: r.specs?.ease
    }));

    fs.writeFileSync(path.resolve(__dirname, 'all_recipe_stats.json'), JSON.stringify(output, null, 2));
    console.log(`Dumped ${data.length} recipes to scripts/all_recipe_stats.json`);
}

dumpStats();
