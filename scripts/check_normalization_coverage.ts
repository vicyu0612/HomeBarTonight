
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { normalizeIngredient } from '../src/utils/normalization.js'; // Note: I might need to make sure normalization.ts is runnable in node or mock it.
// normalization.ts imports things? check viewed file.
// viewed file content: export const INGREDIENT_DB ... export function normalizeIngredient ... 
// It seems pure JS/TS. But it might be TS. I'm using tsx so it should handle it.
// However, I need to check if normalization.ts uses any browser specific things. 
// It uses `Set` and basic string manipulation. Should be fine.
// I will just copy the logic or import it. Importing is better if possible. 
// But importing from src/ in scripts/ might be tricky with module resolution. 
// I will try to read the file and define the function locally to be safe and self-contained, 
// OR I will trust tsx to handle the import if I point to it correctly.
// Let's try importing first. If it fails, I'll inline the logic.

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(process.env.VITE_SUPABASE_URL!, process.env.VITE_SUPABASE_ANON_KEY!);

// We need the ingredients from DB to check if the normalized ID actually exists there.
async function checkCoverage() {
    console.log("Fetching recipes and ingredients...");
    const { data: recipes, error: rError } = await supabase.from('recipes').select('id, name, ingredients');
    const { data: ingredients, error: iError } = await supabase.from('ingredients').select('id');

    if (rError || iError) {
        console.error("Error fetching data:", rError || iError);
        return;
    }

    const validIds = new Set(ingredients.map(i => i.id));
    const missingMappings = new Set();
    const recipeIssues = [];

    // Simple normalization mock if import fails (but we really want the actual logic).
    // Let's assume we can import. If not, I'll have to inline the `INGREDIENT_DB` and `alias` logic.
    // For now, I will perform a looser check:
    // Does the ingredient name exist in our DB (as ID or name)? 
    // Or simpler: List all distinct ingredient names in recipes and see which ones don't match logical IDs.

    // Actually, the app logic relies on `normalizeIngredient`. I MUST use that.
    // I will use dynamic import or just assume I can import.
    // Since I can't guarantee `normalization.ts` is module-compliant for Node without `package.json` "type": "module" changes sometimes,
    // I will read `normalization.ts` content and extract the DB/logic if needed.
    // OR, I can just use a simplified check: 
    // For every ingredient in recipes, is there an entry in 'ingredients' table matching it (fuzzy)?

    // Better: output a list of ALL raw ingredient names from recipes.
    // User can manually verify if any look suspicious.

    const rawNames = new Set();
    recipes.forEach(r => {
        ['en', 'zh'].forEach(lang => {
            const ings = r.ingredients?.[lang] || [];
            ings.forEach(i => rawNames.add(i.name.trim().toLowerCase()));
        });
    });

    console.log(`Found ${rawNames.size} distinct raw ingredient names.`);

    // Check against DB IDs
    const unknown = [];
    for (const name of rawNames) {
        // Very basic "is this an ID?" check
        if (!validIds.has(name) && !validIds.has(name.replace(/ /g, '_'))) {
            unknown.push(name);
        }
    }

    console.log(`\nPotential missing mappings (${unknown.length}):`);
    unknown.sort().forEach(u => console.log(`- ${u}`));

    console.log("\nNote: Some of these are valid aliases handled by normalization.ts. Check strictly if any look completely wrong (e.g., typos).");
}

checkCoverage();
