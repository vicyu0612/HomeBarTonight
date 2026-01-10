import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Map recipe IDs to local generated image paths
const IMAGE_PATHS = {
    'wintermelon-whiskey': '/Users/vic-yu/.gemini/antigravity/brain/a2cfd921-02ab-4398-881b-d4017df629cc/wintermelon_whiskey_1768009779061.png',
    'wintermelon-lemon-beer': '/Users/vic-yu/.gemini/antigravity/brain/a2cfd921-02ab-4398-881b-d4017df629cc/wintermelon_lemon_beer_1768009793772.png',
    'pudding-whiskey': '/Users/vic-yu/.gemini/antigravity/brain/a2cfd921-02ab-4398-881b-d4017df629cc/pudding_whiskey_1768009808386.png',
    'sarsaparilla-rum': '/Users/vic-yu/.gemini/antigravity/brain/a2cfd921-02ab-4398-881b-d4017df629cc/sarsaparilla_rum_1768009823165.png'
};

const newRecipes = [
    {
        id: 'wintermelon-whiskey',
        name: { en: 'Winter Melon Whiskey', zh: '冬瓜威士忌' },
        type: 'cvs',
        baseSpirit: ['whiskey'],
        ingredients: {
            en: [{ name: 'Whiskey', amount: '45ml' }, { name: 'Winter Melon Tea', amount: 'Top up' }, { name: 'Lemon', amount: '1 wedge' }],
            zh: [{ name: '威士忌', amount: '45ml' }, { name: '冬瓜茶', amount: '加滿' }, { name: '檸檬', amount: '1角' }]
        },
        steps: {
            en: ['Fill highball glass with ice.', 'Add whiskey.', 'Top with winter melon tea.', 'Squeeze in lemon juice to balance the sweetness.'],
            zh: ['Highball杯裝滿冰塊。', '倒入威士忌。', '加滿冬瓜茶。', '擠入檸檬汁平衡甜度。']
        },
        tags: { en: ['cvs', 'sweet', 'local-fav'], zh: ['超商', '冬瓜茶', '台式'] },
        description: {
            en: 'Known as the "Taiwanese Jack & Coke". The toasted brown sugar flavor of winter melon tea amplifies the oak notes in whiskey.',
            zh: '被稱為「台版傑克可樂」。冬瓜茶的黑糖焦香能完美襯托威士忌的桶味，加點檸檬更是神來一筆。'
        },
        specs: { alcohol: 5, sweetness: 8, ease: 10 },
        color: '#78350f' // amber-900
    },
    {
        id: 'wintermelon-lemon-beer',
        name: { en: 'Winter Melon Lemon Beer', zh: '冬瓜檸檬啤酒' },
        type: 'cvs',
        baseSpirit: ['beer'],
        ingredients: {
            en: [{ name: 'Light Beer (Lager)', amount: '1 can' }, { name: 'Winter Melon Tea', amount: '100ml' }, { name: 'Lemon Juice', amount: '15ml' }],
            zh: [{ name: '淡啤酒 (Lager)', amount: '1罐' }, { name: '冬瓜茶', amount: '100ml' }, { name: '檸檬汁', amount: '15ml' }]
        },
        steps: {
            en: ['Pour winter melon tea and lemon juice into a beer mug.', 'Top with cold beer.', 'Stir gently.'],
            zh: ['將冬瓜茶與檸檬汁倒入啤酒杯。', '緩緩倒入冰啤酒。', '輕輕攪拌。']
        },
        tags: { en: ['cvs', 'refreshing', 'low-abv'], zh: ['超商', '啤酒', '清爽'] },
        description: {
            en: 'A twist on the classic "Winter Melon Lemon". The beer adds carbonation and a bitter hoppiness that cuts through the sugar.',
            zh: '經典「冬瓜檸檬」的微醺版。啤酒的氣泡與苦韻正好中和了冬瓜茶的死甜，清爽度爆表。'
        },
        specs: { alcohol: 3, sweetness: 6, ease: 10 },
        color: '#eab308' // yellow-500
    },
    {
        id: 'pudding-whiskey',
        name: { en: 'Pudding Whiskey', zh: '布丁威士忌' },
        type: 'cvs',
        baseSpirit: ['whiskey'],
        ingredients: {
            en: [{ name: 'Uni-President Pudding', amount: '1 whole' }, { name: 'Whiskey', amount: '30-45ml' }],
            zh: [{ name: '統一布丁', amount: '1顆' }, { name: '威士忌', amount: '30-45ml' }]
        },
        steps: {
            en: ['Put the whole pudding into a glass.', 'Pour whiskey over it.', 'Mash the pudding slightly and eat/drink with a spoon.'],
            zh: ['將整顆布丁倒入杯中。', '淋上威士忌。', '稍微搗碎布丁，用湯匙邊吃邊喝。']
        },
        tags: { en: ['cvs', 'dessert', 'fun'], zh: ['超商', '甜點', '有趣'] },
        description: {
            en: 'Don\'t knock it until you try it. The caramel sauce of the pudding mixes with the whiskey to create a creamy, custard-flavored treat.',
            zh: '別懷疑，這真的很好吃。布丁的焦糖層融化在威士忌裡，每一口都是大人味的卡士達甜點。'
        },
        specs: { alcohol: 6, sweetness: 9, ease: 10 },
        color: '#fed7aa' // orange-200
    },
    {
        id: 'sarsaparilla-rum',
        name: { en: 'Sarsaparilla Rum', zh: '黑松沙士 Rum' },
        type: 'cvs',
        baseSpirit: ['rum'],
        ingredients: {
            en: [{ name: 'White/Dark Rum', amount: '45ml' }, { name: 'HeySong Sarsaparilla', amount: 'Top up' }, { name: 'Salt', amount: 'Pinch' }],
            zh: [{ name: '蘭姆酒', amount: '45ml' }, { name: '黑松沙士', amount: '加滿' }, { name: '鹽', amount: '少許' }]
        },
        steps: {
            en: ['Fill glass with ice.', 'Add rum.', 'Top with Sarsaparilla.', 'Add a pinch of salt to enhance flavors.'],
            zh: ['杯中加冰。', '加入蘭姆酒。', '加滿黑松沙士。', '加一點點鹽巴提味（像加鹽沙士那樣）。']
        },
        tags: { en: ['cvs', 'fissy', 'local-fav'], zh: ['超商', '氣泡', '台味'] },
        description: {
            en: 'Taiwan\'s answer to the Cuba Libre. The unique herbal root beer flavor of Sarsaparilla is elevated by the sweet rum.',
            zh: '台灣版的「自由古巴」。黑松沙士獨特的草本氣味與蘭姆酒的甘蔗甜味意外合拍，加鹽更是內行喝法。'
        },
        specs: { alcohol: 5, sweetness: 7, ease: 10 },
        color: '#9f1239' // rose-900
    }
];

const BUCKET_NAME = 'cocktails';

async function uploadAndAdd() {
    console.log(`🚀 Processing ${newRecipes.length} interesting recipes...`);

    for (const recipe of newRecipes) {
        console.log(`\n🔹 Processing: ${recipe.name.en} (${recipe.id})`);

        // 1. Upload Image
        const localPath = IMAGE_PATHS[recipe.id];
        const fileName = `${recipe.id}.png`;

        if (fs.existsSync(localPath)) {
            const fileBuffer = fs.readFileSync(localPath);
            console.log(`   ⬆️ Uploading image...`);

            const { error: uploadError } = await supabase.storage
                .from(BUCKET_NAME)
                .upload(fileName, fileBuffer, {
                    contentType: 'image/png',
                    upsert: true
                });

            if (uploadError) {
                console.error(`   ❌ Upload failed: ${uploadError.message}`);
                continue;
            }
        } else {
            console.error(`   ❌ Local image not found: ${localPath}`);
            continue;
        }

        const { data: { publicUrl } } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(fileName);

        console.log(`   ✅ Image public URL: ${publicUrl}`);

        // 2. Upsert Recipe
        console.log(`   💾 Upserting recipe to DB...`);
        const { error: insertError } = await supabase
            .from('recipes')
            .upsert({
                id: recipe.id,
                name: recipe.name,
                type: recipe.type,
                base_spirit: recipe.baseSpirit,
                ingredients: recipe.ingredients,
                steps: recipe.steps,
                tags: recipe.tags,
                description: recipe.description,
                specs: recipe.specs,
                color: recipe.color,
                image: publicUrl
            }, { onConflict: 'id' });

        if (insertError) {
            // Handle potential column name mismatch (base_spirit vs baseSpirit) just in case
            if (insertError.message.includes('base_spirit')) {
                console.warn('   ⚠️ Column base_spirit not found, trying baseSpirit...');
                await supabase.from('recipes').upsert({
                    id: recipe.id,
                    name: recipe.name,
                    type: recipe.type,
                    baseSpirit: recipe.baseSpirit, // CamelCase fallback
                    ingredients: recipe.ingredients,
                    steps: recipe.steps,
                    tags: recipe.tags,
                    description: recipe.description,
                    specs: recipe.specs,
                    color: recipe.color,
                    image: publicUrl
                }, { onConflict: 'id' });
            } else {
                console.error(`   ❌ DB Insert failed: ${insertError.message}`);
            }
        } else {
            console.log(`   ✅ Recipe saved successfully!`);
        }
    }
    console.log('\n✨ All operations completed!');
}

uploadAndAdd();
