
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const newRecipes = [
    {
        id: 'whiskey-oolong',
        name: { en: 'Whiskey Oolong', zh: '威士忌烏龍' },
        type: 'cvs',
        baseSpirit: ['whiskey'],
        ingredients: {
            en: [{ name: 'Whiskey', amount: '45ml' }, { name: 'Oolong Tea', amount: 'Top up' }],
            zh: [{ name: '威士忌', amount: '45ml' }, { name: '烏龍茶', amount: '加滿' }]
        },
        steps: {
            en: ['Fill a highball glass with ice.', 'Add whiskey.', 'Top with Oolong tea and stir.'],
            zh: ['在海波杯中裝滿冰塊。', '倒入威士忌。', '加滿烏龍茶並攪拌均勻。']
        },
        tags: { en: ['cvs', 'easy', 'tea'], zh: ['超商', '簡單', '茶'] },
        description: {
            en: 'A classic Taiwanese favorite. The roasted notes of Oolong tea perfectly complement the whiskey.',
            zh: '台灣經典喝法。烏龍茶的焙火香氣與威士忌完美契合，清爽解膩。'
        },
        specs: { alcohol: 5, sweetness: 3, ease: 10 },
        color: '#d97706', // amber-600
        image_filename: 'whiskey-oolong.png'
    },
    {
        id: 'sake-calpis',
        name: { en: 'Sake Calpis', zh: '可爾必思清酒' },
        type: 'cvs',
        baseSpirit: ['sake'], // Might need to add 'sake' to valid spirits or use 'other'
        ingredients: {
            en: [{ name: 'Sake', amount: '60ml' }, { name: 'Calpis Water', amount: '60ml' }, { name: 'Soda Water', amount: 'Top up' }],
            zh: [{ name: '清酒', amount: '60ml' }, { name: '可爾必思', amount: '60ml' }, { name: '氣泡水', amount: '適量' }]
        },
        steps: {
            en: ['Fill glass with ice.', 'Pour sake and Calpis.', 'Top with soda water and stir gently.'],
            zh: ['杯中加入冰塊。', '倒入清酒和可爾必思。', '加入氣泡水輕輕攪拌。']
        },
        tags: { en: ['cvs', 'sweet', 'refreshing'], zh: ['超商', '甜', '清爽'] },
        description: {
            en: 'A gentle and milky cocktail. The acidity of Calpis balances the rice flavor of Sake.',
            zh: '溫柔的乳酸系調酒。可爾必思的酸甜平衡了清酒的米香，非常好入口。'
        },
        specs: { alcohol: 3, sweetness: 7, ease: 10 },
        color: '#f8fafc', // slate-50
        image_filename: 'sake-calpis.png'
    },
    {
        id: 'vodka-energy',
        name: { en: 'Vodka Energy', zh: '能量伏特加' },
        type: 'cvs',
        baseSpirit: ['vodka'],
        ingredients: {
            en: [{ name: 'Vodka', amount: '45ml' }, { name: 'Energy Drink', amount: 'Top up' }],
            zh: [{ name: '伏特加', amount: '45ml' }, { name: '能量飲料', amount: '加滿' }]
        },
        steps: {
            en: ['Fill a tall glass with ice.', 'Add vodka.', 'Top with energy drink.'],
            zh: ['高球杯裝滿冰塊。', '加入伏特加。', '倒滿能量飲料。']
        },
        tags: { en: ['cvs', 'party', 'energy'], zh: ['超商', '派對', '能量'] },
        description: {
            en: 'The fuel for your night out. electrifying and sweet.',
            zh: '夜晚的燃料。充滿電力的口感，讓你精神百倍。'
        },
        specs: { alcohol: 5, sweetness: 8, ease: 10 },
        color: '#bef264', // lime-300
        image_filename: 'vodka-energy.png'
    },
    {
        id: 'gin-sports',
        name: { en: 'Gin Sports', zh: '運動琴人' },
        type: 'cvs',
        baseSpirit: ['gin'],
        ingredients: {
            en: [{ name: 'Gin', amount: '45ml' }, { name: 'Sports Drink (Pocari)', amount: 'Top up' }, { name: 'Lemon', amount: '1 slice' }],
            zh: [{ name: '琴酒', amount: '45ml' }, { name: '運動飲料 (寶礦力)', amount: '加滿' }, { name: '檸檬', amount: '1片' }]
        },
        steps: {
            en: ['Build in a highball glass with ice.', 'Add gin and top with sports drink.', 'Garnish with lemon.'],
            zh: ['在海波杯中加入冰塊。', '加入琴酒並倒滿運動飲料。', '擠入檸檬汁並裝飾。']
        },
        tags: { en: ['cvs', 'refreshing', 'hydration'], zh: ['超商', '清爽', '補水'] },
        description: {
            en: 'Unexpectedly hydrating. The botanicals of gin mix surprisingly well with the grapefruit notes of sports drinks.',
            zh: '意外的清爽補水組合。琴酒的杜松子香氣與運動飲料的柚子味非常搭。'
        },
        specs: { alcohol: 4, sweetness: 5, ease: 10 },
        color: '#e0f2fe', // sky-100
        image_filename: 'gin-sports.png'
    },
    {
        id: 'lemon-tea-whiskey',
        name: { en: 'Lemon Tea Whiskey', zh: '檸檬茶威士忌' },
        type: 'cvs',
        baseSpirit: ['whiskey'],
        ingredients: {
            en: [{ name: 'Whiskey', amount: '45ml' }, { name: 'Lemon Tea', amount: 'Top up' }],
            zh: [{ name: '威士忌', amount: '45ml' }, { name: '檸檬紅茶', amount: '加滿' }]
        },
        steps: {
            en: ['Fill glass with ice.', 'Pour whiskey.', 'Top with sweet lemon tea.'],
            zh: ['杯中加入冰塊。', '倒入威士忌。', '加滿檸檬紅茶。']
        },
        tags: { en: ['cvs', 'sweet', 'easy'], zh: ['超商', '甜', '簡單'] },
        description: {
            en: 'Like a boozy iced tea. Sweet, tart, and dangerously drinkable.',
            zh: '就像是成人的檸檬紅茶。酸甜順口，小心喝太多。'
        },
        specs: { alcohol: 5, sweetness: 7, ease: 10 },
        color: '#a16207', // yellow-700
        image_filename: 'lemon-tea-whiskey.png'
    }
];

const COCKTAILS_DIR = path.join(process.cwd(), 'public/cocktails');
const BUCKET_NAME = 'cocktails';

async function addRecipes() {
    console.log(`🚀 Starting to add ${newRecipes.length} new recipes...`);

    for (const recipe of newRecipes) {
        console.log(`\n🔹 Processing: ${recipe.name.en} (${recipe.id})`);

        // 1. Upload Image
        const fileName = recipe.image_filename;
        const filePath = path.join(COCKTAILS_DIR, fileName);

        if (!fs.existsSync(filePath)) {
            console.error(`❌ Image file not found: ${filePath}`);
            continue;
        }

        const fileBuffer = fs.readFileSync(filePath);
        console.log(`   ⬆️ Uploading image ${fileName}...`);

        const { error: uploadError } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(fileName, fileBuffer, {
                contentType: 'image/png',
                upsert: true
            });

        if (uploadError) {
            console.error(`   ❌ Upload failed: ${uploadError.message}`);
            // Continue anyway if image upload fails? Maybe recipe insert will fail without image URL?
            // But we can construct the URL manually.
        }

        const { data: { publicUrl } } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(fileName);

        console.log(`   ✅ Image ready: ${publicUrl}`);

        // 2. Prepare Recipe Data
        const dbRecord = {
            id: recipe.id,
            name: recipe.name, // JSONB
            type: recipe.type,
            base_spirit: recipe.baseSpirit, // Column might be snake_case in DB? recipes.ts uses camelCase.
            // Wait, need to check DB schema for column names.
            // recipes.ts: baseSpirit. DB: base_spirit?
            // Usually Supabase uses snake_case.
            // I should check schema. I'll guess 'base_spirit'.
            ingredients: recipe.ingredients,
            steps: recipe.steps,
            tags: recipe.tags,
            description: recipe.description,
            specs: recipe.specs,
            color: recipe.color,
            image: publicUrl
        };

        // Mapping camelCase to snake_case if needed
        // I will assume the DB columns are: id, name, type, base_spirit, ingredients, steps, tags, description, specs, color, image
        // Let's verify commonly used column names in Supabase.

        console.log(`   💾 Upserting into DB...`);
        const { error: insertError } = await supabase
            .from('recipes')
            .upsert({
                id: recipe.id,
                name: recipe.name,
                type: recipe.type,
                base_spirit: recipe.baseSpirit, // I'll trust the JS client to map or hope column is camelCase? 
                // Actually JS client does NOT auto-map.
                // Looking at recipes.ts, it downloads from 'recipes'.
                // I suspect the column is `base_spirit`.
                // I'll try `base_spirit: recipe.baseSpirit`.
                ingredients: recipe.ingredients,
                steps: recipe.steps,
                tags: recipe.tags,
                description: recipe.description,
                specs: recipe.specs,
                color: recipe.color,
                image: publicUrl
            }, { onConflict: 'id' });

        if (insertError) {
            // If error says column "base_spirit" does not exist, I'll try "baseSpirit".
            if (insertError.message.includes('base_spirit')) {
                console.warn('   ⚠️ Column base_spirit not found, trying baseSpirit...');
                await supabase.from('recipes').upsert({
                    ...dbRecord,
                    baseSpirit: recipe.baseSpirit
                }, { onConflict: 'id' });
            } else {
                console.error(`   ❌ DB Insert failed: ${insertError.message}`);
            }
        } else {
            console.log(`   ✅ Recipe saved!`);
        }
    }
    console.log('\n✨ All done!');
}

addRecipes();
