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
    console.error('Missing Supabase Config');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const IMAGES_DIR = path.resolve(process.cwd(), 'temp_cvs_images');
const BUCKET_NAME = 'cocktails';

async function uploadImages() {
    console.log('📤 Uploading CVS cocktail images from temp_cvs_images/...\n');

    const files = fs.readdirSync(IMAGES_DIR);

    for (const file of files) {
        if (!file.endsWith('.png') && !file.endsWith('.jpg')) continue;

        const filePath = path.join(IMAGES_DIR, file);
        const fileContent = fs.readFileSync(filePath);

        console.log(`  🖼️ Uploading ${file}...`);

        const { data, error } = await supabase
            .storage
            .from(BUCKET_NAME)
            .upload(file, fileContent, {
                contentType: 'image/png',
                upsert: true
            });

        if (error) {
            console.error(`  ❌ Error uploading ${file}: ${error.message}`);
        } else {
            console.log(`  ✅ Uploaded ${file}`);
        }
    }

    console.log('\n✨ Done!');
}

uploadImages();
