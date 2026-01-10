
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import 'dotenv/config'; // Requires dotenv to read .env.local if running via ts-node directly, but we can hardcode for this runner

// Hardcoded for this script execution to avoid env issues in simple runner
const SUPABASE_URL = 'https://uyamflgtvqndbjpbjito.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5YW1mbGd0dnFuZGJqcGJqaXRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjczNDQ5ODcsImV4cCI6MjA4MjkyMDk4N30.HWSz6ZljOyVCjvAACQ5MIPSUsG7nEVaBzrhv3cWh7Ao';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const IMAGES = [
    {
        collectionId: 'winter-warmers',
        filePath: '/Users/vic-yu/.gemini/antigravity/brain/bc7b8460-01e2-4fa4-a7cd-a512a59ec63b/winter_warmers_western_1768021262381.png',
        fileName: 'winter_warmers_en.png'
    },
    {
        collectionId: 'cvs-hacks',
        filePath: '/Users/vic-yu/.gemini/antigravity/brain/bc7b8460-01e2-4fa4-a7cd-a512a59ec63b/cvs_mixology_western_1768021277674.png',
        fileName: 'cvs_mixology_en.png'
    }
];

async function uploadImages() {
    for (const item of IMAGES) {
        try {
            console.log(`Processing ${item.collectionId}...`);
            const fileContent = fs.readFileSync(item.filePath);

            // Upload to 'cocktails' bucket (or 'collections' if exists, assuming 'cocktails' based on existing data)
            // The existing data used '/cocktails/...' so likely the bucket is 'cocktails'
            const { data, error } = await supabase.storage
                .from('cocktails')
                .upload(item.fileName, fileContent, {
                    contentType: 'image/png',
                    upsert: true
                });

            if (error) {
                console.error(`Error uploading ${item.fileName}:`, error);
                continue;
            }

            const publicUrl = supabase.storage.from('cocktails').getPublicUrl(item.fileName).data.publicUrl;
            console.log(`Uploaded to: ${publicUrl}`);

            // Update Database
            const { error: dbError } = await supabase
                .from('collections')
                .update({ cover_image_en: publicUrl })
                .eq('id', item.collectionId);

            if (dbError) {
                console.error(`Error updating DB for ${item.collectionId}:`, dbError);
            } else {
                console.log(`Snapshot updated for ${item.collectionId}`);
            }

        } catch (err) {
            console.error(`Unexpected error for ${item.collectionId}:`, err);
        }
    }
}

uploadImages();
