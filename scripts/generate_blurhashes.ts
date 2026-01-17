
import { createClient } from '@supabase/supabase-js';
import { encode } from 'blurhash';
import sharp from 'sharp';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY; // Use Anon Key for Reading

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function getImageData(url: string) {
    try {
        const response = await fetch(url);
        const buffer = await response.arrayBuffer();
        const image = sharp(Buffer.from(buffer));

        // Resize for faster processing and smaller hash (standard is usually 32x32 for hash generation)
        const { data, info } = await image
            .resize(32, 32, { fit: 'inside' })
            .ensureAlpha()
            .raw()
            .toBuffer({ resolveWithObject: true });

        return { data, width: info.width, height: info.height };
    } catch (e) {
        console.error(`Error processing image ${url}:`, e);
        return null;
    }
}

async function main() {
    console.log('Fetching recipes...');
    const { data: recipes, error } = await supabase
        .from('recipes')
        .select('id, name, image, blurhash');

    if (error || !recipes) {
        console.error('Error fetching recipes:', error);
        return;
    }

    console.log(`Found ${recipes.length} recipes.`);

    // Generate Updates Map
    const updates: Record<string, string> = {};

    for (const recipe of recipes) {
        if (recipe.blurhash) {
            continue;
        }

        if (!recipe.image) {
            continue;
        }

        console.error(`Processing ${recipe.name.en}...`); // Use stderr for logs
        const imageData = await getImageData(recipe.image);

        if (imageData) {
            const hash = encode(new Uint8ClampedArray(imageData.data), imageData.width, imageData.height, 4, 3);
            updates[recipe.id] = hash;
        }
    }

    // Output strictly JSON to stdout
    console.log(JSON.stringify(updates));
}

main();
