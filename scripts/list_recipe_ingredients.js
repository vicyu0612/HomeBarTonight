
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function listIngredients() {
    try {
        const recipesPath = path.resolve(__dirname, '../src/data/recipes.ts');
        const fileContent = fs.readFileSync(recipesPath, 'utf-8');

        // Regex to match the recipes array
        const match = fileContent.match(/export const recipes: Recipe\[\] = (\[[\s\S]*?\]);\s*$/m);
        if (!match) {
            console.error('Could not extract recipes array');
            return;
        }

        // Evaluate the object (dangerous but effective for this simple file)
        // We need to mock the types just in case
        const Recipe = {};
        const recipes = eval(match[1]);

        const enIngredients = new Set();
        const zhIngredients = new Set();

        recipes.forEach(r => {
            if (r.ingredients) {
                if (r.ingredients.en) {
                    r.ingredients.en.forEach(i => enIngredients.add(i.name));
                }
                if (r.ingredients.zh) {
                    r.ingredients.zh.forEach(i => zhIngredients.add(i.name));
                }
            }
        });

        console.log('--- English Ingredients ---');
        console.log([...enIngredients].sort());

        console.log('\n--- Chinese Ingredients ---');
        console.log([...zhIngredients].sort());

    } catch (err) {
        console.error('Error:', err);
    }
}

listIngredients();
