
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
    'soju-yakult': '/Users/vic-yu/.gemini/antigravity/brain/bc7b8460-01e2-4fa4-a7cd-a512a59ec63b/soju_yakult_1768262655263.png',
    'umeshu-green-tea': '/Users/vic-yu/.gemini/antigravity/brain/bc7b8460-01e2-4fa4-a7cd-a512a59ec63b/umeshu_green_tea_1768262670131.png',
    'espresso-lemon-vodka': '/Users/vic-yu/.gemini/antigravity/brain/bc7b8460-01e2-4fa4-a7cd-a512a59ec63b/espresso_lemon_vodka_1768262684484.png',
    'coffee-milk-whiskey': '/Users/vic-yu/.gemini/antigravity/brain/bc7b8460-01e2-4fa4-a7cd-a512a59ec63b/coffee_milk_whiskey_1768262698868.png',
    'papaya-milk-rum': '/Users/vic-yu/.gemini/antigravity/brain/bc7b8460-01e2-4fa4-a7cd-a512a59ec63b/papaya_milk_rum_1768262713748.png'
};

const newIngredients = [
    { id: 'umeshu', name_en: 'Umeshu (Plum Wine)', name_zh: '梅酒', category: 'liqueur' },
    { id: 'coffee_milk', name_en: 'Coffee Milk', name_zh: '咖啡牛奶', category: 'mixer' },
    { id: 'papaya_milk', name_en: 'Papaya Milk', name_zh: '木瓜牛奶', category: 'mixer' }
];

const newRecipes = [
    {
        id: 'soju-yakult',
        name: { en: 'Soju Yakult', zh: '養樂多燒酒' },
        type: 'cvs',
        baseSpirit: ['soju'],
        ingredients: {
            en: [{ name: 'Soju', amount: '1 bottle' }, { name: 'Yakult', amount: '2 bottles' }, { name: 'Sprite', amount: 'Top up' }],
            zh: [{ name: '燒酒', amount: '1罐' }, { name: '養樂多', amount: '2罐' }, { name: '雪碧', amount: '加滿' }]
        },
        steps: {
            en: ['Fill a highball glass with ice.', 'Pour in Soju and Yakult.', 'Top with Sprite and stir gently.'],
            zh: ['Highball杯裝滿冰塊。', '倒入燒酒與養樂多。', '加滿雪碧並輕輕攪拌。']
        },
        tags: { en: ['cvs', 'party', 'sweet'], zh: ['超商', '乳酸', '派對'] },
        description: {
            en: 'A Korean favorite known as "Yogurt Soju". The creamy sweetness of Yakult masks the alcohol bite completely.',
            zh: '韓國國民喝法。養樂多的酸甜完美掩蓋了燒酒的酒精味，不知不覺就會喝完一整瓶。'
        },
        specs: { alcohol: 7, sweetness: 9, ease: 10 },
        color: '#fef3c7' // amber-100
    },
    {
        id: 'umeshu-green-tea',
        name: { en: 'Umeshu Green Tea', zh: '梅酒綠茶' },
        type: 'cvs',
        baseSpirit: ['liqueur'],
        ingredients: {
            en: [{ name: 'Umeshu', amount: '60ml' }, { name: 'Green Tea (Unsweetened)', amount: 'Top up' }],
            zh: [{ name: '梅酒', amount: '60ml' }, { name: '無糖綠茶', amount: '加滿' }]
        },
        steps: {
            en: ['Build in a highball glass with ice.', 'Add Umeshu.', 'Top with cold green tea.'],
            zh: ['在杯中加入冰塊。', '倒入梅酒。', '注滿無糖綠茶攪拌。']
        },
        tags: { en: ['cvs', 'refreshing', 'dinner'], zh: ['超商', '清爽', '佐餐'] },
        description: {
            en: 'Elegant and simple. The tannins in green tea balance the sweetness of plum wine.',
            zh: '清雅的日式風味。無糖綠茶的茶香與單寧感，中和了梅酒的甜膩，非常適合佐餐。'
        },
        specs: { alcohol: 5, sweetness: 6, ease: 10 },
        color: '#fbbf24' // amber-400
    },
    {
        id: 'espresso-lemon-vodka',
        name: { en: 'Espresso Lemon Vodka', zh: '西西里氣泡咖啡酒' },
        type: 'cvs',
        baseSpirit: ['vodka'],
        ingredients: {
            en: [{ name: 'Vodka', amount: '45ml' }, { name: 'Black Coffee', amount: '60ml' }, { name: 'Lemon Sparkling Water', amount: 'Top up' }],
            zh: [{ name: '伏特加', amount: '45ml' }, { name: '黑咖啡', amount: '60ml' }, { name: '檸檬氣泡水', amount: '加滿' }]
        },
        steps: {
            en: ['Fill glass with ice.', 'Add vodka and coffee.', 'Top with lemon sparkling water.', 'Garnish with a lemon slice.'],
            zh: ['杯中加滿冰塊。', '加入伏特加與黑咖啡。', '緩緩注入檸檬氣泡水。', '放上一片檸檬裝飾。']
        },
        tags: { en: ['cvs', 'coffee', 'fruity'], zh: ['超商', '咖啡', '清爽'] },
        description: {
            en: 'An alcoholic twist on the popular Espresso Romano. Tart, bubbly, and caffeinated.',
            zh: '清爽的西西里咖啡升級版。檸檬氣泡水的酸甜支撐起咖啡的苦韻，增加微醺感，是午後提神的最佳選擇。'
        },
        specs: { alcohol: 5, sweetness: 4, ease: 10 },
        color: '#451a03' // amber-950 (coffee color)
    },
    {
        id: 'coffee-milk-whiskey',
        name: { en: 'Coffee Milk Whiskey', zh: '咖啡牛奶威士忌' },
        type: 'cvs',
        baseSpirit: ['whiskey'],
        ingredients: {
            en: [{ name: 'Whiskey', amount: '45ml' }, { name: 'Coffee Milk', amount: 'Top up' }],
            zh: [{ name: '威士忌', amount: '45ml' }, { name: '咖啡牛奶', amount: '加滿' }]
        },
        steps: {
            en: ['Fill a rock glass with ice.', 'Pour whiskey.', 'Top with creamy coffee milk.'],
            zh: ['威士忌杯加入大冰塊。', '倒入威士忌。', '加滿咖啡牛奶攪拌。']
        },
        tags: { en: ['cvs', 'creamy', 'winter'], zh: ['超商', '奶香', '暖心'] },
        description: {
            en: 'The convenience store Irish Coffee. Creamy, rich, and comforting.',
            zh: '大人的早餐飲品。奶香濃郁的咖啡牛奶，讓威士忌變得順滑溫潤，適合冬天或深夜飲用。'
        },
        specs: { alcohol: 5, sweetness: 7, ease: 10 },
        color: '#a16207' // yellow-700
    },
    {
        id: 'papaya-milk-rum',
        name: { en: 'Papaya Milk Rum', zh: '木瓜牛乳蘭姆酒' },
        type: 'cvs',
        baseSpirit: ['rum'],
        ingredients: {
            en: [{ name: 'Rum (White or Gold)', amount: '45ml' }, { name: 'Papaya Milk', amount: 'Top up' }],
            zh: [{ name: '蘭姆酒', amount: '45ml' }, { name: '木瓜牛乳', amount: '加滿' }]
        },
        steps: {
            en: ['Fill glass with ice.', 'Add Rum.', 'Top with Papaya Milk.'],
            zh: ['杯中加入冰塊。', '倒入蘭姆酒。', '加滿木瓜牛乳。']
        },
        tags: { en: ['cvs', 'tropical', 'sweet'], zh: ['超商', '熱帶', '台味'] },
        description: {
            en: 'A surprising tropical match. The sugarcane notes of Rum blend perfectly with the creamy papaya milk.',
            zh: '意想不到的台式熱帶風情。瓜果的香甜與蔗糖酒體完美融合，喝起來就像是融化的熱帶冰淇淋。'
        },
        specs: { alcohol: 5, sweetness: 9, ease: 10 },
        color: '#fb923c' // orange-400
    }
];

const BUCKET_NAME = 'cocktails';

async function main() {
    console.log(`🚀 Starting Batch 2 CVS Update...`);

    // 1. Add New Ingredients
    console.log(`\n📦 Adding ${newIngredients.length} new ingredients...`);
    const { error: ingError } = await supabase
        .from('ingredients')
        .upsert(newIngredients, { onConflict: 'id' });

    if (ingError) {
        console.error(`❌ Failed to add ingredients: ${ingError.message}`);
    } else {
        console.log(`✅ Ingredients added successfully.`);
    }

    // 2. Process Recipes
    for (const recipe of newRecipes) {
        console.log(`\n🔹 Processing: ${recipe.name.en} (${recipe.id})`);

        // Upload Image
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
                // Continue, publicUrl might still work if previously uploaded
            }
        } else {
            console.error(`   ❌ Local image not found: ${localPath}`);
        }

        const { data: { publicUrl } } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(fileName);

        // Upsert Recipe
        console.log(`   💾 Upserting recipe...`);
        const { error: insertError } = await supabase
            .from('recipes')
            .upsert({
                id: recipe.id,
                name: recipe.name,
                type: recipe.type,
                base_spirit: recipe.baseSpirit, // Ensure column name matches DB schema
                ingredients: recipe.ingredients,
                steps: recipe.steps,
                tags: recipe.tags,
                description: recipe.description,
                specs: recipe.specs,
                color: recipe.color,
                image: publicUrl
            }, { onConflict: 'id' });

        if (insertError) {
            if (insertError.message.includes('base_spirit')) {
                console.warn('   ⚠️ Column base_spirit not found, trying baseSpirit...');
                await supabase.from('recipes').upsert({
                    id: recipe.id,
                    name: recipe.name,
                    type: recipe.type,
                    ingredients: recipe.ingredients,
                    steps: recipe.steps,
                    tags: recipe.tags,
                    description: recipe.description,
                    specs: recipe.specs,
                    color: recipe.color,
                    image: publicUrl,
                    baseSpirit: recipe.baseSpirit
                }, { onConflict: 'id' });
            } else {
                console.error(`   ❌ Insert failed: ${insertError.message}`);
            }
        } else {
            console.log(`   ✅ Success!`);
        }
    }
    console.log('\n✨ All operations completed!');
}

main();
