
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Load env
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY; // OR Service Role if needed

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const BUCKET = 'collection_images'; // New Bucket

// Mapping: Collection ID -> Filename
const COLLECTIONS_MAP = [
    { id: 'winter-warmers', file: 'cny_mahjong.png' },
    { id: 'cvs-hacks', file: 'cvs_party.png' },
    { id: 'party-time', file: 'party_starters.png' }
];

const LOCAL_DIR = path.resolve(process.cwd(), 'public/cocktails');

async function uploadImages() {
    console.log(`Starting sync for ${COLLECTIONS_MAP.length} collections...`);

    for (const item of COLLECTIONS_MAP) {
        const filePath = path.join(LOCAL_DIR, item.file);
        if (!fs.existsSync(filePath)) {
            console.warn(`⚠️ File not found: ${filePath}`);
            continue;
        }

        const fileBuffer = fs.readFileSync(filePath);

        // 1. Upload to Storage
        const { data: storageData, error: storageError } = await supabase.storage
            .from(BUCKET)
            .upload(item.file, fileBuffer, {
                contentType: 'image/png',
                upsert: true
            });

        if (storageError) {
            console.error(`❌ Storage Upload Failed for ${item.file}:`, storageError.message);
            continue;
        }

        // Get Public URL
        const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(item.file);
        console.log(`✅ Uploaded: ${item.file} -> ${publicUrl}`);

        // 2. Update Database (collections_meta)
        const { error: dbError } = await supabase
            .from('collections_meta')
            .upsert({
                id: item.id,
                cover_image: publicUrl,
                updated_at: new Date().toISOString()
            });

        if (dbError) {
            console.error(`❌ DB Upsert Failed for ${item.id}:`, dbError.message);
        } else {
            console.log(`   Database updated for ID: ${item.id}`);
        }
    }
}

uploadImages();

