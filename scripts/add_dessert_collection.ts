
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

// Setup simple client
const supabase = createClient(process.env.VITE_SUPABASE_URL!, process.env.VITE_SUPABASE_ANON_KEY!);

const COVER_IMAGE_PATH = '/Users/vic-yu/.gemini/antigravity/brain/bc7b8460-01e2-4fa4-a7cd-a512a59ec63b/dessert_lover_collection_cover_1768264506005.png';
const BUCKET_NAME = 'cocktails'; // Use KNOWN good bucket

// Ingredients to filter by
const TARGET_INGREDIENTS = [
    'milk_tea', 'melon_popsicle', 'baileys', 'coffee_milk', 'chocolate_milkshake', 'yakult', 'pudding', 'papaya_milk', 'ice_cream'
];

async function main() {
    console.log('🚀 Processing "Dessert Lover" Collection Setup...');

    // 1. Fetch Recipes for ID list
    console.log('🔍 Creating Sweet Recipe List...');
    const { data: recipes, error } = await supabase.from('recipes').select('*');
    if (error) { console.error(error); return; }

    const matchedRecipeIds = recipes.filter(r => {
        if (!r.specs || r.specs.sweetness < 9) return false;
        const hasTarget = r.ingredients.en.some((i: any) => {
            const name = i.name.toLowerCase();
            return TARGET_INGREDIENTS.some(t => name.includes(t.replace('_', ' ')));
        });
        const isHack = ['soju-yakult', 'papaya-milk-rum', 'baileys-milktea'].includes(r.id);
        return hasTarget || isHack;
    }).map(r => r.id);

    console.log(`✅ Recipe IDs (${matchedRecipeIds.length}):`, matchedRecipeIds);

    // 2. Upload Image
    console.log('⬆️ Uploading cover image to "cocktails" bucket...');
    const fileBuffer = fs.readFileSync(COVER_IMAGE_PATH);
    const fileName = `dessert_lover_${Date.now()}.png`;

    const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, fileBuffer, { contentType: 'image/png', upsert: true });

    if (uploadError) {
        console.error('❌ Upload failed:', uploadError);
        return;
    }

    const { data: { publicUrl } } = supabase.storage.from(BUCKET_NAME).getPublicUrl(fileName);
    console.log('✅ Image Uploaded Successfully!');
    console.log('🔗 URL:', publicUrl);

    // 3. Output SQL
    console.log('\n⚠️  ACTION REQUIRED: Run this SQL in Supabase Dashboard to create the collection:');
    console.log('================================================================================');

    const sql = `
INSERT INTO collections (id, title, subtitle, description, type, recipe_ids, cover_image, theme_color, sort_order, is_active)
VALUES (
  'dessert-lover',
  '{"en": "Dessert Lover", "zh": "我是甜點控"}',
  '{"en": "Sweet, creamy, and indulgent treats.", "zh": "甜而不膩，專屬甜點控的微醺時刻"}',
  '{"en": "Who says you can''t drink your dessert? From creamy Baileys to fruity milk mixes, satisfy your sweet tooth with these indulgent cocktails.", "zh": "誰說甜點只能用吃的？從濃郁奶酒到水果牛乳特調，這些像甜點一樣的微醺飲品，是獻給螞蟻人的專屬享受。"}',
  'curated',
  ARRAY[${matchedRecipeIds.map(id => `'${id}'`).join(', ')}],
  '${publicUrl}',
  '#f472b6',
  2,
  true
)
ON CONFLICT (id) DO UPDATE SET
  recipe_ids = EXCLUDED.recipe_ids,
  cover_image = EXCLUDED.cover_image;
`;
    console.log(sql);
    console.log('================================================================================');
}

main();
