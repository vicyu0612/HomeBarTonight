
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing env vars');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspect() {
    console.log('--- Inspecting Plum Wine & Cream Liqueur ---');

    const { data: ingredients } = await supabase
        .from('ingredients')
        .select('*')
        .or('name_zh.ilike.%梅酒%,name_zh.ilike.%奶酒%,name_en.ilike.%Cream%,name_en.ilike.%Plum%');

    if (ingredients) console.table(ingredients);

    // Also check recipes to see what they use currently
    const { data: recipes } = await supabase
        .from('recipes')
        .select('id, name, ingredients, base_spirit')
        .or('ingredients->zh->0->>name.ilike.%梅酒%,ingredients->zh->0->>name.ilike.%奶酒%'); // simplistic check, meaningful check needs full scan or careful query

    // Better: fetch all and filter in JS for "uses these ingredients"
    const { data: allRecipes } = await supabase
        .from('recipes')
        .select('id, name, ingredients, base_spirit');

    if (allRecipes) {
        console.log('\n--- Recipes using Plum Wine or Cream Liqueur ---');
        const targets = allRecipes.filter(r => {
            const zhIngs = r.ingredients?.zh || [];
            const enIngs = r.ingredients?.en || [];
            const combined = [...zhIngs, ...enIngs];
            return combined.some((i: any) =>
                i.name.includes('梅酒') ||
                i.name.includes('奶酒') ||
                i.name.toLowerCase().includes('baileys') ||
                i.name.toLowerCase().includes('plum wine')
            );
        });

        targets.forEach(r => {
            console.log(`[${r.id}] ${r.name.zh} - Spirit: ${r.base_spirit} - Ings: ${r.ingredients.en.map((i: any) => i.name).join(', ')}`);
        });
    }
}

inspect();
