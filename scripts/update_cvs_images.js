import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Manual env parsing because we are running with node
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
    console.error('Missing Supabase Config');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const IMAGES_DIR = path.resolve(process.cwd(), 'temp_cvs_images');
const BUCKET_NAME = 'cocktails';

async function updateImages() {
    console.log('🚀 Starting to upload and update CVS recipe images...');

    const files = fs.readdirSync(IMAGES_DIR);

    for (const file of files) {
        if (!file.endsWith('.png') && !file.endsWith('.jpg')) continue;

        const recipeId = path.parse(file).name;
        const filePath = path.join(IMAGES_DIR, file);
        const fileContent = fs.readFileSync(filePath);

        console.log(`\n🔹 Processing ${recipeId}...`);

        // 1. Upload
        console.log(`   Uploading image...`);
        const { data: uploadData, error: uploadError } = await supabase
            .storage
            .from(BUCKET_NAME)
            .upload(file, fileContent, {
                contentType: 'image/png',
                upsert: true
            });

        if (uploadError) {
            console.error(`   ❌ Upload failed: ${uploadError.message}`);
            continue;
        }

        // 2. Get URL
        const { data: { publicUrl } } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(file);

        console.log(`   ✅ Image uploaded: ${publicUrl}`);

        // 3. Update DB
        console.log(`   Updating database record...`);
        const { error: dbError } = await supabase
            .from('recipes')
            .update({ image: publicUrl })
            .eq('id', recipeId);

        if (dbError) {
            console.error(`   ❌ DB Update failed: ${dbError.message}`);
        } else {
            console.log(`   ✅ Database updated for ${recipeId}`);
        }
    }

    console.log('\n✨ All operations completed!');
}

updateImages();
