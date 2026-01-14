import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ESM dirname workaround
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
    console.error('Missing env vars: VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

// Usage: node deploy_recipe_image.js <recipe_id> <local_image_path>
// Example: node deploy_recipe_image.js black-russian ./black-russian.png

const recipeId = process.argv[2];
const localFilePath = process.argv[3];

if (!recipeId || !localFilePath) {
    console.error('Usage: node scripts/deploy_recipe_image.js <recipe_id> <local_image_path>');
    process.exit(1);
}

async function deploy() {
    try {
        // 1. Resolve file path
        const absolutePath = path.resolve(process.cwd(), localFilePath);
        if (!fs.existsSync(absolutePath)) {
            console.error(`File not found: ${absolutePath}`);
            process.exit(1);
        }

        const fileBuffer = fs.readFileSync(absolutePath);
        const fileExt = path.extname(localFilePath);
        // Standardize filename: recipeId.png or recipeId.jpg
        const fileName = `${recipeId}${fileExt}`;
        const storagePath = fileName;

        // 2. Upload Image
        console.log(`[1/3] Uploading ${fileName} to Supabase Storage...`);
        // Check if bucket exists, optional but safer
        // const { data: buckets } = await supabase.storage.listBuckets();
        // ...

        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('cocktails')
            .upload(storagePath, fileBuffer, {
                contentType: fileExt === '.jpg' || fileExt === '.jpeg' ? 'image/jpeg' : 'image/png',
                upsert: true
            });

        if (uploadError) {
            console.error('Upload error:', uploadError);
            process.exit(1);
        }
        console.log(`Upload success: ${storagePath}`);

        // 3. Get Public URL
        const { data: { publicUrl } } = supabase.storage
            .from('cocktails')
            .getPublicUrl(storagePath);

        console.log(`[2/3] Public URL generated: ${publicUrl}`);

        // 4. Update Recipe Record
        console.log(`[3/3] Updating recipe '${recipeId}' with image URL...`);

        const { data: updateData, error: updateError } = await supabase
            .from('recipes')
            .update({ image: publicUrl })
            .eq('id', recipeId)
            .select();

        if (updateError) {
            console.error('Database update error:', updateError);
            process.exit(1);
        }

        if (!updateData || updateData.length === 0) {
            console.warn(`Warning: No recipe found with id '${recipeId}'. Image uploaded but DB not updated. Check if the recipe exists.`);
        } else {
            console.log(`Database update success for: ${updateData[0].name.en || updateData[0].name}`);
        }

        console.log('Deployment complete!');

    } catch (e) {
        console.error('Script error:', e);
        process.exit(1);
    }
}

deploy();
