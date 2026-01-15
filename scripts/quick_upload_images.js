/**
 * Quick Upload Images to Supabase
 * 
 * This script uploads generated cocktail images to Supabase storage
 * and updates the recipes table with the public URLs.
 * 
 * Usage:
 *   1. Update the imageMappings array with your recipe IDs and image paths
 *   2. Run: node scripts/quick_upload_images.js
 * 
 * See: .agent/workflows/upload-recipe-images.md for full workflow
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Manual env parsing
const envFile = fs.readFileSync(path.resolve(process.cwd(), '.env.local'), 'utf-8');
const envConfig = {};
envFile.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
        envConfig[key.trim()] = value.trim();
    }
});

const supabaseUrl = envConfig.VITE_SUPABASE_URL;
const supabaseServiceKey = envConfig.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase Config in .env.local');
    console.error('   Required: VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const BUCKET_NAME = 'cocktails';

// ========================================
// UPDATE THIS ARRAY WITH YOUR IMAGE PATHS
// ========================================
const imageMappings = [
    { id: 'almond-whiskey', path: '/Users/vic-yu/.gemini/antigravity/brain/d467568f-c033-4a50-b60f-455ab2738823/almond_whiskey_1768486783009.png' },
    { id: 'chocolate-brandy', path: '/Users/vic-yu/.gemini/antigravity/brain/d467568f-c033-4a50-b60f-455ab2738823/chocolate_brandy_1768486800668.png' },
    { id: 'tomato-tequila', path: '/Users/vic-yu/.gemini/antigravity/brain/d467568f-c033-4a50-b60f-455ab2738823/tomato_tequila_1768486819345.png' },
    { id: 'honey-lemon-gin', path: '/Users/vic-yu/.gemini/antigravity/brain/d467568f-c033-4a50-b60f-455ab2738823/honey_lemon_gin_1768486845933.png' },
    { id: 'gin-jin', path: '/Users/vic-yu/.gemini/antigravity/brain/d467568f-c033-4a50-b60f-455ab2738823/gin_jin_1768486862897.png' },
    { id: 'chrysanthemum-gin', path: '/Users/vic-yu/.gemini/antigravity/brain/d467568f-c033-4a50-b60f-455ab2738823/chrysanthemum_gin_1768486879423.png' },
    { id: 'tinto-de-verano', path: '/Users/vic-yu/.gemini/antigravity/brain/d467568f-c033-4a50-b60f-455ab2738823/tinto_de_verano_1768486901857.png' },
    { id: 'banana-rum', path: '/Users/vic-yu/.gemini/antigravity/brain/d467568f-c033-4a50-b60f-455ab2738823/banana_rum_1768486918965.png' },
    { id: 'sake-bomb', path: '/Users/vic-yu/.gemini/antigravity/brain/d467568f-c033-4a50-b60f-455ab2738823/sake_bomb_1768486942184.png' },
    { id: 'coconut-rum', path: '/Users/vic-yu/.gemini/antigravity/brain/d467568f-c033-4a50-b60f-455ab2738823/coconut_rum_1768486977366.png' }
];

async function uploadAndUpdate() {
    console.log('🚀 Starting upload process...\n');
    console.log(`📊 Total images to upload: ${imageMappings.length}\n`);

    let successCount = 0;
    let failCount = 0;

    for (const { id, path: imagePath } of imageMappings) {
        console.log(`📸 Processing: ${id}`);

        // Check if image exists
        if (!fs.existsSync(imagePath)) {
            console.error(`   ❌ Image not found: ${imagePath}\n`);
            failCount++;
            continue;
        }

        const fileName = `${id}.png`;
        const fileContent = fs.readFileSync(imagePath);

        // 1. Upload to Supabase Storage
        console.log(`   ⬆️  Uploading to storage...`);
        const { error: uploadError } = await supabase
            .storage
            .from(BUCKET_NAME)
            .upload(fileName, fileContent, {
                contentType: 'image/png',
                upsert: true
            });

        if (uploadError) {
            console.error(`   ❌ Upload failed: ${uploadError.message}\n`);
            failCount++;
            continue;
        }

        // 2. Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(fileName);

        console.log(`   🔗 URL: ${publicUrl}`);

        // 3. Update database
        console.log(`   💾 Updating database...`);
        const { error: dbError } = await supabase
            .from('recipes')
            .update({ image: publicUrl })
            .eq('id', id);

        if (dbError) {
            console.error(`   ❌ DB update failed: ${dbError.message}\n`);
            failCount++;
        } else {
            console.log(`   ✅ Success!\n`);
            successCount++;
        }
    }

    console.log('========================================');
    console.log(`✨ Upload complete!`);
    console.log(`   ✅ Success: ${successCount}`);
    console.log(`   ❌ Failed: ${failCount}`);
    console.log('========================================');
}

uploadAndUpdate();
