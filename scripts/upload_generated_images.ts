
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
// IMPORTANT: For Storage upload (upsert), often need Policy permissions.
// If RLS allows Authenticated/Anon uploads, fine. If not, might need Service Role.
// I'll try with ANON first, if fail, I assume user has set proper policies or I need to use another way.
// Wait, previous scripts used MCP SQL to verify. 
// "fixed_missing_images.ts" used Supabase Client. If that worked (or was planned to work), then this should work.
// Actually, earlier `scripts/fix_missing_images.ts` was created. Let's assume generic write access or public bucket?
// "cocktails" bucket is usually public.

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const FILES_TO_UPLOAD = [
    'mint-julep.png',
    'pocari-soju.png',
    'black-coffee-whiskey.png',
    'oolong-gin.png',
    'soy-milk-baileys.png',
    'red-eye-tw.png',
    'vitamin-c-bomb.png'
];

async function uploadImages() {
    console.log('Starting upload...');

    for (const filename of FILES_TO_UPLOAD) {
        const filePath = path.resolve(__dirname, '../public/cocktails', filename);
        if (!fs.existsSync(filePath)) {
            console.warn(`File not found: ${filePath}`);
            continue;
        }

        const fileBuffer = fs.readFileSync(filePath);

        console.log(`Uploading ${filename}...`);
        const { data, error } = await supabase
            .storage
            .from('cocktails')
            .upload(filename, fileBuffer, {
                contentType: 'image/png',
                upsert: true
            });

        if (error) {
            console.error(`Failed to upload ${filename}:`, error.message);
        } else {
            console.log(`Successfully uploaded ${filename}`);
            // Get Public URL
            const { data: { publicUrl } } = supabase.storage.from('cocktails').getPublicUrl(filename);
            console.log(`URL: ${publicUrl}`);
        }
    }
}

uploadImages();
