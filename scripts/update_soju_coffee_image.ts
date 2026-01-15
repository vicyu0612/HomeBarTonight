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
const RECIPE_ID = 'soju-coffee';

async function updateSojuCoffeeImage() {
    console.log(`🚀 Updating Soju Coffee Image...`);

    // 1. Upload New Image
    const imageName = 'soju_coffee_cocktail_v4';
    const files = fs.readdirSync(artifactsDir);
    const file = files.find(f => f.startsWith(imageName) && f.endsWith('.png'));

    if (file) {
        const filePath = path.join(artifactsDir, file);
        const fileBuffer = fs.readFileSync(filePath);
        const storageFileName = `${RECIPE_ID}.png`;

        console.log(`   ⬆️ Uploading new image ${storageFileName}...`);
        const { error: uploadError } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(storageFileName, fileBuffer, {
                contentType: 'image/png',
                upsert: true
            });

        if (uploadError) {
            console.error(`   ❌ Image upload failed: ${uploadError.message}`);
        } else {
            const { data: { publicUrl } } = supabase.storage
                .from(BUCKET_NAME)
                .getPublicUrl(storageFileName);

            // Cache busting
            const publicUrlWithCacheBust = `${publicUrl}?t=${Date.now()}`;
            console.log(`   ✅ Image uploaded: ${publicUrlWithCacheBust}`);

            console.log(`   💾 Updating DB record...`);
            const { error: dbError } = await supabase
                .from('recipes')
                .update({ image: publicUrlWithCacheBust })
                .eq('id', RECIPE_ID);

            if (dbError) {
                console.error(`   ❌ DB Update failed: ${dbError.message}`);
            } else {
                console.log(`   ✅ Recipe image updated successfully!`);
            }
        }
    } else {
        console.warn(`   ⚠️ New image file not found.`);
    }
}

updateSojuCoffeeImage();
