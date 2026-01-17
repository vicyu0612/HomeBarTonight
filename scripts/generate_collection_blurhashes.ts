
import { createClient } from '@supabase/supabase-js';
import { encode } from 'blurhash';
import sharp from 'sharp';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing env vars');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function generateBlurHash(imageUrl: string): Promise<string | null> {
    try {
        const response = await fetch(imageUrl);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const { data, info } = await sharp(buffer)
            .resize(32, 32, { fit: 'inside' })
            .ensureAlpha()
            .raw()
            .toBuffer({ resolveWithObject: true });

        return encode(new Uint8ClampedArray(data), info.width, info.height, 4, 4);
    } catch (error) {
        console.error(`Error generating hash for ${imageUrl}:`, error);
        return null;
    }
}

async function main() {
    console.log('--- Generating Collection BlurHashes ---');

    console.log('Fetching collections...');
    const { data: collections, error } = await supabase
        .from('collections')
        .select('id, cover_image, cover_image_en');

    if (error) {
        console.error('Error fetching collections:', error);
        return;
    }

    console.log(`Found ${collections.length} collections.`);

    for (const collection of collections) {
        console.log(`Processing [${collection.id}]...`);
        const updates: any = {};

        if (collection.cover_image) {
            const hash = await generateBlurHash(collection.cover_image);
            if (hash) {
                updates.blurhash = hash;
                console.log(`  - cover_image hash: ${hash}`);
            }
        }

        if (collection.cover_image_en) {
            const hash = await generateBlurHash(collection.cover_image_en);
            if (hash) {
                updates.blurhash_en = hash;
                console.log(`  - cover_image_en hash: ${hash}`);
            }
        }

        if (Object.keys(updates).length > 0) {
            const { error: updateError } = await supabase
                .from('collections')
                .update(updates)
                .eq('id', collection.id);

            if (updateError) {
                console.error(`  Error updating [${collection.id}]:`, updateError);
            } else {
                console.log(`  ✓ Updated DB`);
            }
        }
    }

    console.log('Done.');
}

main();
