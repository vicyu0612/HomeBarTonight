
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// 1. Config & Setup
// Resolve .env.local from the current working directory
const envPath = path.resolve(process.cwd(), '.env.local');
console.log(`Loading env from: ${envPath}`);

if (!fs.existsSync(envPath)) {
    console.error(`❌ .env.local file not found at ${envPath}`);
    process.exit(1);
}

const envFile = fs.readFileSync(envPath, 'utf-8');
const envConfig = {};
envFile.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) envConfig[key.trim()] = value.trim();
});

const supabaseUrl = envConfig.VITE_SUPABASE_URL;
const supabaseServiceKey = envConfig.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const BUCKET_NAME = 'cocktails';

// 2. Image Mapping
// Maps Recipe ID -> Absolute Local Path
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

async function main() {
    console.log('🚀 Starting final image upload...');

    for (const [id, sourcePath] of Object.entries(imageMapping)) {
        console.log(`\n🔹 Processing ${id}...`);

        // Check if file exists
        if (!fs.existsSync(sourcePath)) {
            console.error(`   ❌ File not found at path: ${sourcePath}`);
            continue;
        }

        const fileBuffer = fs.readFileSync(sourcePath);
        const fileName = `${id}.png`;

        // 1. Upload to Supabase Storage
        console.log(`   Uploading ${fileName} to ${BUCKET_NAME}...`);
        const { data: uploadData, error: uploadError } = await supabase
            .storage
            .from(BUCKET_NAME)
            .upload(fileName, fileBuffer, {
                contentType: 'image/png',
                upsert: true
            });

        if (uploadError) {
            console.error(`   ❌ Upload Error: ${uploadError.message}`);
            continue;
        }

        // 2. Get Public URL
        const { data: { publicUrl } } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(fileName);

        console.log(`   ✅ Image uploaded. URL: ${publicUrl}`);

        // 3. Update Recipes Table
        console.log(`   Updating recipes table for id=${id}...`);
        const { error: dbError } = await supabase
            .from('recipes')
            .update({ image: publicUrl })
            .eq('id', id);

        if (dbError) {
            console.error(`   ❌ DB Update Error: ${dbError.message}`);
        } else {
            console.log(`   ✅ Database record updated!`);
        }
    }

    console.log('\n✨ All Done! You can check the app now.');
}

main();
