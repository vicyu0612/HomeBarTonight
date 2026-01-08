
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Helper to get __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
const envPath = path.resolve(__dirname, '../.env.local');
dotenv.config({ path: envPath });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
// Ideally use SERVICE_ROLE_KEY for bulk upserts to bypass RLS, but ANON might work if policies allow.
// Checking previous scripts, we rely on existing keys. If ANON fails for updates, we might need manual policy check.

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function syncRecipes() {
    console.log('Starting recipe sync...');

    try {
        // 1. Read the recipes.ts file
        const recipesPath = path.resolve(__dirname, '../src/data/recipes.ts');
        const fileContent = fs.readFileSync(recipesPath, 'utf-8');

        // 2. Extract the recipes array using Regex (since we can't easily import TS in Node without setup)
        // Looking for: export const recipes: Recipe[] = [ ... ];
        // We'll capture the content inside the array brackets.
        // Note: This is a hacky way to parse TS/JS objects. Ideally we use a parser.
        // Given the file structure is clean, we can try to extract the array content.

        // Strategy: Evaluate the file content as loose JS after stripping TS types.
        // Or simpler: Use a temporary file approach if we had a complier.
        // Let's try to match the array.
        const match = fileContent.match(/export const recipes: Recipe\[\] = (\[[\s\S]*?\]);\s*$/m);

        if (!match) {
            // Fallback: the array usually ends before the end of file or creates a block.
            // Let's rely on the fact that duplicate finding tools read the file.
            // Actually, creating a valid JSON from the file is safer.
            console.error('Could not extract recipes array via regex. Trying safer parsing...');
            throw new Error('Regex extraction failed');
        }

        // The match[1] contains the array string like "[ { ... }, { ... } ]"
        // However, the keys are not quoted (e.g. name: ... instead of "name": ...).
        // JSON.parse wont work. eval() is dangerous but effective for this local script.

        // We need to strip specific TS syntax if any exist inside the array? 
        // The recipes.ts seems to contain standard JS objects mostly, but might have comments.

        let arrayString = match[1];

        // Simple Eval context
        const recipes = eval(arrayString);

        if (!Array.isArray(recipes)) {
            throw new Error('Parsed content is not an array');
        }

        console.log(`Found ${recipes.length} recipes locally.`);

        // 3. Upsert to Supabase
        // We map the object to snake_case column names if DB differs, but our DB seems to use JSONB for some fields?
        // Checking schema from previous knowledge: 
        // id (text), name (jsonb), type (text), ingredients (jsonb), steps (jsonb), 
        // description (jsonb), tags (jsonb), specs (jsonb), color (text), image (text)

        let successCount = 0;
        let failCount = 0;

        for (const r of recipes) {
            // Prepare payload that matches DB schema
            const payload = {
                id: r.id,
                name: r.name,
                type: r.type,
                base_spirit: r.baseSpirit || [], // DB column likely snake_case 'base_spirit' or handled via JS props?
                // Need to check specific column names. 
                // In upload_new_images.js we updated 'image' only.
                // Let's assume standard mapping or check definitions. 
                // Usually Supabase JS client handles camelCase -> snake_case if configured, but default is direct mapping.
                // Safe bet: verify recipe table columns. From standard practice:
                // likely: id, name, type, base_spirit, ingredients, steps, tags, description, specs, color, image.

                // Map camelCase to snake_case manually to be safe
                base_spirit: r.baseSpirit,
                ingredients: r.ingredients,
                steps: r.steps,
                tags: r.tags,
                description: r.description,
                specs: r.specs,
                color: r.color,
                image: r.image,
                collections: r.collections || []
            };

            const { error } = await supabase
                .from('recipes')
                .upsert(payload, { onConflict: 'id' });

            if (error) {
                console.error(`Error updating ${r.id}:`, error.message);
                failCount++;
            } else {
                // console.log(`Synced ${r.id}`);
                successCount++;
            }
        }

        console.log(`Sync complete. Success: ${successCount}, Failed: ${failCount}`);

    } catch (err) {
        console.error('Script failed:', err);
    }
}

syncRecipes();
