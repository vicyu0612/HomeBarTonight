
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(process.env.VITE_SUPABASE_URL!, process.env.VITE_SUPABASE_ANON_KEY!);

const ARTIFACT_PATH = '/Users/vic-yu/.gemini/antigravity/brain/bc7b8460-01e2-4fa4-a7cd-a512a59ec63b/cosmopolitan_cocktail_1768291455794.png';
const BUCKET_NAME = 'cocktails';
const DEST_PATH = 'cosmopolitan.png';

async function uploadImage() {
    try {
        if (!fs.existsSync(ARTIFACT_PATH)) {
            console.error('Artifact file not found:', ARTIFACT_PATH);
            process.exit(1);
        }

        const fileBuffer = fs.readFileSync(ARTIFACT_PATH);

        const { data, error } = await supabase
            .storage
            .from(BUCKET_NAME)
            .upload(DEST_PATH, fileBuffer, {
                contentType: 'image/png',
                upsert: true
            });

        if (error) {
            console.error('Upload Error:', error);
            process.exit(1);
        }

        const { data: { publicUrl } } = supabase
            .storage
            .from(BUCKET_NAME)
            .getPublicUrl(DEST_PATH);

        console.log('Upload Successful!');
        console.log('Public URL:', publicUrl);

    } catch (err) {
        console.error('Script Error:', err);
        process.exit(1);
    }
}

uploadImage();
