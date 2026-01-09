import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const ARTIFACT_DIR = '/Users/vic-yu/.gemini/antigravity/brain/c9e52b82-590f-4189-8586-0f3bae5b6f67';
const DEST_DIR = 'public/cocktails';

// Map generated filenames (partial match) to target filenames
const IMAGE_MAPPINGS = [
    { source: 'whiskey_hot_milk_tea', target: 'whiskey-hot-milk-tea.png' },
    { source: 'hot_gin_ginger', target: 'hot-gin-ginger.png' },
    { source: 'hot_plum_sake', target: 'hot-plum-sake.png' },
    { source: 'warm_apple_whiskey', target: 'warm-apple-whiskey.png' },
    { source: 'hot_white_wine_peach', target: 'hot-white-wine-peach.png' },
    { source: 'grass_jelly_jagermeister', target: 'grass-jelly-jagermeister.png' },
    { source: 'sake_barley_tea', target: 'sake-barley-tea.png' }
];

async function uploadImages() {
    // Read artifact directory
    const files = fs.readdirSync(ARTIFACT_DIR);

    for (const map of IMAGE_MAPPINGS) {
        // Find highest timestamp file matching source prefix
        const matchingFiles = files.filter(f => f.startsWith(map.source) && f.endsWith('.png'));
        if (matchingFiles.length === 0) {
            console.warn(`No image found for ${map.source}`);
            continue;
        }

        // Sort to get latest
        matchingFiles.sort().reverse();
        const bestFile = matchingFiles[0];

        const sourcePath = path.join(ARTIFACT_DIR, bestFile);
        const targetPath = path.join(process.cwd(), DEST_DIR, map.target); // Local copy

        console.log(`Processing ${bestFile} -> ${map.target}`);

        // Copy to local public folder
        fs.copyFileSync(sourcePath, targetPath);

        // Upload to Supabase
        const fileContent = fs.readFileSync(targetPath);
        const { data, error } = await supabase.storage
            .from('cocktails')
            .upload(map.target, fileContent, {
                contentType: 'image/png',
                upsert: true
            });

        if (error) {
            console.error(`Error uploading ${map.target}:`, error.message);
        } else {
            console.log(`Uploaded ${map.target} successfully`);
        }
    }
}

uploadImages();
