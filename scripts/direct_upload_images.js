zimport { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// 1. Setup Supabase
const envFile = fs.readFileSync(path.resolve(process.cwd(), '.env.local'), 'utf-8');
const envConfig = {};
envFile.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) envConfig[key.trim()] = value.trim();
});

const supabase = createClient(envConfig.VITE_SUPABASE_URL, envConfig.SUPABASE_SERVICE_ROLE_KEY);
const BUCKET_NAME = 'cocktails';

// 2. Define Mapping (ID -> Source Path)
const imageMapping = {
    'almond-whiskey': '/Users/vic-yu/.gemini/antigravity/brain/d467568f-c033-4a50-b60f-455ab2738823/almond_whiskey_1768486783009.png',
    'chocolate-brandy': '/Users/vic-yu/.gemini/antigravity/brain/d467568f-c033-4a50-b60f-455ab2738823/chocolate_brandy_1768486800668.png',
    'tomato-tequila': '/Users/vic-yu/.gemini/antigravity/brain/d467568f-c033-4a50-b60f-455ab2738823/tomato_tequila_1768486819345.png',
    'honey-lemon-gin': '/Users/vic-yu/.gemini/antigravity/brain/d467568f-c033-4a50-b60f-455ab2738823/honey_lemon_gin_1768486845933.png',
    'gin-jin': '/Users/vic-yu/.gemini/antigravity/brain/d467568f-c033-4a50-b60f-455ab2738823/gin_jin_1768486862897.png',
    'chrysanthemum-gin': '/Users/vic-yu/.gemini/antigravity/brain/d467568f-c033-4a50-b60f-455ab2738823/chrysanthemum_gin_1768486879423.png',
    'tinto-de-verano': '/Users/vic-yu/.gemini/antigravity/brain/d467568f-c033-4a50-b60f-455ab2738823/tinto_de_verano_1768486901857.png',
    'banana-rum': '/Users/vic-yu/.gemini/antigravity/brain/d467568f-c033-4a50-b60f-455ab2738823/banana_rum_1768486918965.png',
    'sake-bomb': '/Users/vic-yu/.gemini/antigravity/brain/d467568f-c033-4a50-b60f-455ab2738823/sake_bomb_1768486942184.png',
    'coconut-rum': '/Users/vic-yu/.gemini/antigravity/brain/d467568f-c033-4a50-b60f-455ab2738823/coconut_rum_1768486977366.png'
};

async function processImages() {
    console.log('🚀 Starting direct image processing...');

    for (const [id, sourcePath] of Object.entries(imageMapping)) {
        console.log(`\n🔹 Processing ${id}...`);

        if (!fs.existsSync(sourcePath)) {
            console.error(`   ❌ Source file not found: ${sourcePath}`);
            continue;
        }

        const fileName = `${id}.png`;
        const fileContent = fs.readFileSync(sourcePath);

        // Upload to Supabase
        console.log(`   Uploading to storage...`);
        const { error: uploadError } = await supabase
            .storage
            .from(BUCKET_NAME)
            .upload(fileName, fileContent, {
                contentType: 'image/png',
                upsert: true
            });

        if (uploadError) {
            console.error(`   ❌ Upload failed: ${uploadError.message}`);
            continue;
        }

        // Get Public URL
        const { data: { publicUrl } } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(fileName);

        console.log(`   ✅ Image uploaded: ${publicUrl}`);

        // Update Database
        console.log(`   Updating recipe record...`);
        const { error: dbError } = await supabase
            .from('recipes')
            .update({ image: publicUrl })
            .eq('id', id);

        if (dbError) {
            console.error(`   ❌ DB Update failed: ${dbError.message}`);
        } else {
            console.log(`   ✅ Database updated successfully!`);
        }
    }
    console.log('\n✨ All done!');
}

processImages();
