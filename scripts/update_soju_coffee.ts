import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load env
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const artifactsDir = '/Users/vic-yu/.gemini/antigravity/brain/bc7b8460-01e2-4fa4-a7cd-a512a59ec63b';

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const BUCKET_NAME = 'cocktails';
const RECIPE_ID = 'soju-coffee';

async function updateSojuCoffee() {
    console.log(`🚀 Updating Soju Coffee...`);

    // 1. Upload New Image
    const imageName = 'soju_coffee_cocktail_v3';
    const files = fs.readdirSync(artifactsDir);
    const file = files.find(f => f.startsWith(imageName) && f.endsWith('.png'));

    let publicUrlWithCacheBust;

    if (file) {
        const filePath = path.join(artifactsDir, file);
        const fileBuffer = fs.readFileSync(filePath);
        const storageFileName = `${RECIPE_ID}.png`;

        console.log(`   ⬆️ Uploading new image ${storageFileName}...`);
        const { error: uploadError } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(storageFileName, fileBuffer, {
                contentType: 'image/png',
                upsert: true
            });

        if (uploadError) {
            console.error(`   ❌ Image upload failed: ${uploadError.message}`);
        } else {
            const { data: { publicUrl } } = supabase.storage
                .from(BUCKET_NAME)
                .getPublicUrl(storageFileName);

            publicUrlWithCacheBust = `${publicUrl}?t=${Date.now()}`;
            console.log(`   ✅ Image uploaded: ${publicUrlWithCacheBust}`);
        }
    } else {
        console.warn(`   ⚠️ New image file not found, skipping image update.`);
    }

    // 2. Update Recipe Data
    const updateData = {
        ingredients: {
            en: [
                { name: 'Soju (or Awamori)', amount: '1 part' },
                { name: 'Coffee (Cold Brew or Hot)', amount: 'Appropriate amount' },
                { name: 'Orange Juice', amount: 'Optional' }
            ],
            zh: [
                { name: '燒酒 (或泡盛)', amount: '1份' },
                { name: '咖啡 (冷萃或熱沖)', amount: '適量' },
                { name: '橙汁', amount: '可選' }
            ]
        },
        steps: {
            en: [
                'Add soju and ice to the glass.',
                'Pour in coffee (cold brew or hot coffee).',
                'Optionally add some orange juice for flavor.'
            ],
            zh: [
                '將燒酒與冰塊放入杯中。',
                '倒入適量咖啡（可用冷沖泡或熱咖啡）。',
                '若喜歡，可加入一些橙汁增加風味。'
            ]
        },
        description: {
            en: 'A modern twist on coffee cocktails. Distinct layers of flavor with a kick. Try adding Tonic water for an Espresso Tonic variation.',
            zh: '現代風格的咖啡調酒。深培咖啡的香氣與燒酒完美融合。也可以加入通寧水做成咖啡通寧調酒 (Espresso Tonic) 的變化版。'
        }
    };

    if (publicUrlWithCacheBust) {
        updateData.image = publicUrlWithCacheBust;
    }

    console.log(`   💾 Updating DB record...`);
    const { error: dbError } = await supabase
        .from('recipes')
        .update(updateData)
        .eq('id', RECIPE_ID);

    if (dbError) {
        console.error(`   ❌ DB Update failed: ${dbError.message}`);
    } else {
        console.log(`   ✅ Recipe updated successfully!`);
    }
}

updateSojuCoffee();
