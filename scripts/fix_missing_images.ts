
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const BUCKET_NAME = 'cocktails';

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const missingFiles = [
    'plum-green-tea-whiskey.png',
    'pocari-soju.png',
    'red-eye-tw.png',
    'soy-milk-baileys.png',
    'vitamin-c-bomb.png',
    'yogurt-green-vodka.png',
    'oolong-gin.png',
    'black-coffee-whiskey.png'
];

// Oolong Gin exists, just needs upload
const filesToUpload = [...missingFiles];

const publicDir = path.resolve(__dirname, '../public/cocktails');
const placeholderPath = path.join(publicDir, 'highball-cvs.png');

async function fixImages() {
    console.log('🚀 Starting image fix...');

    // 1. Ensure placeholders exist locally
    if (!fs.existsSync(placeholderPath)) {
        console.error('❌ Placeholder image highball-cvs.png not found!');
        return;
    }

    for (const file of missingFiles) {
        const filePath = path.join(publicDir, file);
        if (!fs.existsSync(filePath)) {
            console.log(`Creating placeholder for ${file}...`);
            fs.copyFileSync(placeholderPath, filePath);
        }
    }

    // 2. Upload all to Supabase
    for (const fileName of filesToUpload) {
        const filePath = path.join(publicDir, fileName);
        const fileBuffer = fs.readFileSync(filePath);

        console.log(`Uploading ${fileName}...`);
        const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(`cocktails/${fileName}`, fileBuffer, {
                contentType: 'image/png',
                upsert: true
            });

        if (error) {
            console.error(`❌ Failed to upload ${fileName}:`, error.message);
        } else {
            console.log(`✅ Uploaded ${fileName}`);
        }
    }

    console.log('✨ All fixes applied.');
}

fixImages();
