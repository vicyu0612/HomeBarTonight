import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load env
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const artifactsDir = '/Users/vic-yu/.gemini/antigravity/brain/bc7b8460-01e2-4fa4-a7cd-a512a59ec63b';

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const BUCKET_NAME = 'cocktails';

// Map of Recipe ID to Partial Image Filename (to find the file)
const recipeImageMap = {
    'kitty': 'kitty_cocktail',
    'operator': 'operator_cocktail',
    'spritzer': 'spritzer_cocktail',
    'whiskey-coke': 'whiskey_coke_cocktail',
    'soju-coffee': 'soju_coffee_cocktail',
    'cowboy': 'cowboy_cocktail'
};

async function run() {
    console.log(`🚀 Uploading generated images for ${Object.keys(recipeImageMap).length} recipes...`);

    const files = fs.readdirSync(artifactsDir);

    for (const [recipeId, partialName] of Object.entries(recipeImageMap)) {
        // Find the actual file (since timestamp is appended)
        const file = files.find(f => f.startsWith(partialName) && f.endsWith('.png'));

        if (!file) {
            console.warn(`⚠️ Could not find image file for ${recipeId} (prefix: ${partialName})`);
            continue;
        }

        const filePath = path.join(artifactsDir, file);
        const fileBuffer = fs.readFileSync(filePath);
        // Clean filename for storage: just the recipe id usually, or keep original name?
        // Let's use recipeId.png to be clean and consistent.
        const storageFileName = `${recipeId}.png`;

        console.log(`\n🔹 Processing ${recipeId}...`);
        console.log(`   Found local file: ${file}`);
        console.log(`   ⬆️ Uploading as ${storageFileName}...`);

        const { error: uploadError } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(storageFileName, fileBuffer, {
                contentType: 'image/png',
                upsert: true
            });

        if (uploadError) {
            console.error(`   ❌ Upload failed: ${uploadError.message}`);
            continue;
        }

        const { data: { publicUrl } } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(storageFileName);

        // Break cache if it existed?
        const publicUrlWithCacheBust = `${publicUrl}?t=${Date.now()}`;

        console.log(`   ✅ Image ready: ${publicUrlWithCacheBust}`);
        console.log(`   💾 Updating recipe record...`);

        const { error: updateError } = await supabase
            .from('recipes')
            .update({ image: publicUrlWithCacheBust })
            .eq('id', recipeId);

        if (updateError) {
            console.error(`   ❌ DB Update failed: ${updateError.message}`);
        } else {
            console.log(`   ✅ Recipe updated!`);
        }
    }
}

run();
