
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const COCKTAILS_DIR = path.join(process.cwd(), 'public/cocktails');
const BUCKET_NAME = 'cocktails';

async function uploadImages() {
    console.log(`📂 Scanning directory: ${COCKTAILS_DIR}`);

    if (!fs.existsSync(COCKTAILS_DIR)) {
        console.error(`❌ Directory not found: ${COCKTAILS_DIR}`);
        return;
    }

    const files = fs.readdirSync(COCKTAILS_DIR).filter(file => file.endsWith('.png') || file.endsWith('.jpg'));
    console.log(`found ${files.length} images.`);

    for (const file of files) {
        const filePath = path.join(COCKTAILS_DIR, file);
        const fileBuffer = fs.readFileSync(filePath);
        const fileName = file; // e.g. "hot-toddy.png"

        // 1. Upload to Supabase Storage
        console.log(`⬆️ Uploading ${fileName}...`);
        const { error: uploadError } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(fileName, fileBuffer, {
                contentType: 'image/png',
                upsert: true
            });

        if (uploadError) {
            console.error(`❌ Failed to upload ${fileName}:`, uploadError.message);
            continue;
        }

        // 2. Get Public URL
        const { data: { publicUrl } } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(fileName);

        console.log(`✅ Uploaded. URL: ${publicUrl}`);

        // 3. Update Recipes Table
        const localPath = `/cocktails/${fileName}`;
        const id = fileName.replace(/\.[^/.]+$/, ""); // remove extension

        // DEBUG: Check if record exists via SELECT
        const { data: existing, error: checkError } = await supabase
            .from('recipes')
            .select('id, image, name')
            .eq('id', id)
            .maybeSingle();

        if (checkError) {
            console.error(`🚩 SELECT Error for ID '${id}': ${checkError.message}`);
        } else if (!existing) {
            console.warn(`🚩 Record with ID '${id}' NOT FOUND in DB. (Is the table empty or RLS blocking SELECT?)`);
        } else {
            console.log(`🔍 Found record '${id}'. Current Image: ${existing.image}`);
        }

        // Use upsert or update. Since DB records exist, update.
        // Try to update by Path match first (for records that still have local path)
        const { error: updateError, count: pathCount } = await supabase
            .from('recipes')
            .update({ image: publicUrl })
            .eq('image', localPath)
            .select('*', { count: 'exact' });

        if (updateError) {
            console.error(`❌ DB Update failed for ${fileName}:`, updateError.message);
        } else {
            const matchCount = pathCount || 0;

            if (matchCount > 0) {
                console.log(`✅ Updated ${matchCount} records by matching local path.`);
            } else {
                // Fallback: Match by ID
                console.log(`⚠️ No path match for '${localPath}'. Trying ID '${id}'...`);

                const { error: idUpdateError, count: idCount } = await supabase
                    .from('recipes')
                    .update({ image: publicUrl })
                    .eq('id', id)
                    .select('*', { count: 'exact' });

                if (idUpdateError) {
                    console.error(`❌ DB Update by ID failed: ${idUpdateError.message}`);
                } else {
                    const finalCount = idCount || 0;
                    if (finalCount > 0) console.log(`✅ Updated ${finalCount} records by ID.`);
                    else console.log(`ℹ️ No records found matching ID '${id}' either (or RLS Blocked Update).`);
                }
            }
        }
    }
}

uploadImages();
