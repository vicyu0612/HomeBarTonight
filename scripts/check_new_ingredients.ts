
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(process.env.VITE_SUPABASE_URL!, process.env.VITE_SUPABASE_ANON_KEY!);

const NEW_RECIPE_INGREDIENTS = [
    // Cosmopolitan
    'Vodka',
    'Cointreau',
    'Lime Juice',
    'Cranberry Juice'
];

// Simple slugify function matching App logic typically (lowercase, spaces to hyphens)
const toId = (name: string) => name.toLowerCase().replace(/\s+/g, '-');

async function checkIngredients() {
    console.log('Checking ingredients:', NEW_RECIPE_INGREDIENTS);

    const { data: existingIngredients, error } = await supabase
        .from('ingredients')
        .select('id');

    if (error) {
        console.error('Error fetching ingredients:', error);
        return;
    }

    const existingIds = new Set(existingIngredients.map(i => i.id));
    const missing: string[] = [];

    NEW_RECIPE_INGREDIENTS.forEach(name => {
        const id = toId(name);
        if (!existingIds.has(id)) {
            missing.push(name);
        } else {
            console.log(`✅ ${name} (${id}) exists.`);
        }
    });

    if (missing.length > 0) {
        console.log('\n⚠️  MISSING INGREDIENTS FOUND:');
        missing.forEach(name => console.log(`- ${name} (Expected ID: ${toId(name)})`));

        console.log('\n--- SQL TO INSERT MISSING INGREDIENTS ---');
        console.log(`
INSERT INTO ingredients (id, name, category)
VALUES 
${missing.map(name => `('${toId(name)}', '{"en": "${name}", "zh": "TODO_ZH_NAME"}', 'mixer')`).join(',\n')};
        `);
    } else {
        console.log('\n🎉 All ingredients exist in the database!');
    }
}

checkIngredients();
