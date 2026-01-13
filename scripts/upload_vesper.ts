
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(process.env.VITE_SUPABASE_URL!, process.env.VITE_SUPABASE_ANON_KEY!);

async function uploadImage() {
    // Hardcoded path from the generation step output
    const imagePath = '/Users/vic-yu/.gemini/antigravity/brain/bc7b8460-01e2-4fa4-a7cd-a512a59ec63b/vesper_martini_cocktail_1768303044527.png';

    if (!fs.existsSync(imagePath)) {
        console.error(`Image not found at ${imagePath}`);
        return;
    }

    const fileBuffer = fs.readFileSync(imagePath);
    const fileName = 'vesper_martini.png'; // Clean name for storage
    const bucket = 'cocktails';

    // Upload to Supabase
    const { data, error } = await supabase
        .storage
        .from(bucket)
        .upload(fileName, fileBuffer, {
            contentType: 'image/png',
            upsert: true
        });

    if (error) {
        console.error('Error uploading image:', error);
        return;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase
        .storage
        .from(bucket)
        .getPublicUrl(fileName);

    console.log(`Successfully uploaded ${fileName}!`);
    console.log(`Public URL: ${publicUrl}`);
}

uploadImage();
