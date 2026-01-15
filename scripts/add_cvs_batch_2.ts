import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load env
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const BASE_STORAGE_URL = `${supabaseUrl}/storage/v1/object/public/cocktails`;

const newRecipes = [
    {
        id: 'kitty',
        name: { en: 'Kitty', zh: '凱蒂' },
        type: 'cvs',
        baseSpirit: ['wine'],
        ingredients: {
            en: [{ name: 'Red Wine', amount: '1 part' }, { name: 'Ginger Ale', amount: '1 part' }, { name: 'Lime', amount: 'Slice' }],
            zh: [{ name: '紅酒', amount: '1份' }, { name: '薑汁汽水', amount: '1份' }, { name: '檸檬片', amount: '1片' }]
        },
        steps: {
            en: ['Fill wine glass with ice.', 'Pour red wine.', 'Top with ginger ale.', 'Garnish with lime.'],
            zh: ['紅酒杯裝滿冰塊。', '倒入紅酒。', '加滿薑汁汽水。', '以檸檬片裝飾。']
        },
        tags: { en: ['cvs', 'refreshing', 'low-abv'], zh: ['超商', '清爽', '低酒精'] },
        description: {
            en: 'A refreshing wine cocktail that reduces the tannins of red wine with the sweetness of ginger ale. Popular in Japan.',
            zh: '透過薑汁汽水的甜味中和紅酒的單寧，清爽易飲，在日本相當受歡迎。'
        },
        specs: { alcohol: 3, sweetness: 6, ease: 10 },
        color: '#7f1d1d',
        image: `${BASE_STORAGE_URL}/kalimotxo.png`, // Reuse Kalimotxo
        collections: ['cvs-hacks']
    },
    {
        id: 'operator',
        name: { en: 'Operator', zh: '接線生' },
        type: 'cvs',
        baseSpirit: ['white_wine'],
        ingredients: {
            en: [{ name: 'White Wine', amount: '1 part' }, { name: 'Ginger Ale', amount: '1 part' }, { name: 'Lemon', amount: 'Twist' }],
            zh: [{ name: '白酒', amount: '1份' }, { name: '薑汁汽水', amount: '1份' }, { name: '檸檬皮', amount: '1片' }]
        },
        steps: {
            en: ['Fill glass with ice.', 'Pour white wine.', 'Top with ginger ale.', 'Stir gently.'],
            zh: ['杯中加冰。', '倒入白酒。', '加滿薑汁汽水。', '輕輕攪拌。']
        },
        tags: { en: ['cvs', 'refreshing', 'bubbly'], zh: ['超商', '清爽', '氣泡'] },
        description: {
            en: 'The white wine version of the Kitty. Crisp, bubbly, and incredibly easy to drink.',
            zh: 'Kitty 的白酒版本。口感清脆氣泡感十足，非常好入口。'
        },
        specs: { alcohol: 3, sweetness: 6, ease: 10 },
        color: '#fef3c7',
        image: `${BASE_STORAGE_URL}/gin-tonic.png`, // Placeholder
        collections: ['cvs-hacks']
    },
    {
        id: 'spritzer',
        name: { en: 'Spritzer', zh: '噴氣機' },
        type: 'cvs',
        baseSpirit: ['white_wine'],
        ingredients: {
            en: [{ name: 'White Wine', amount: '1 part' }, { name: 'Soda Water', amount: '1 part' }],
            zh: [{ name: '白酒', amount: '1份' }, { name: '氣泡水', amount: '1份' }]
        },
        steps: {
            en: ['Fill wine glass with ice.', 'Pour white wine.', 'Top with soda water.'],
            zh: ['紅酒杯裝滿冰塊。', '倒入白酒。', '加滿氣泡水。']
        },
        tags: { en: ['cvs', 'dry', 'refreshing'], zh: ['超商', '不甜', '清爽'] },
        description: {
            en: 'An Austrian classic. Diluting wine with soda makes it a hydrating, long drink perfect for summer.',
            zh: '奧地利經典喝法。用氣泡水沖淡白酒，成為適合夏日的清爽解渴飲品。'
        },
        specs: { alcohol: 3, sweetness: 3, ease: 10 },
        color: '#fefce8',
        image: `${BASE_STORAGE_URL}/vodka-energy.png`, // Placeholder
        collections: ['cvs-hacks']
    },
    {
        id: 'whiskey-coke',
        name: { en: 'Whiskey Coke', zh: '威士忌可樂' },
        type: 'cvs',
        baseSpirit: ['whiskey'],
        ingredients: {
            en: [{ name: 'Whiskey', amount: '45ml' }, { name: 'Coke', amount: 'Top up' }, { name: 'Lime', amount: 'Wedge' }],
            zh: [{ name: '威士忌', amount: '45ml' }, { name: '可樂', amount: '適量' }, { name: '檸檬角', amount: '1塊' }]
        },
        steps: {
            en: ['Fill highball glass with ice.', 'Add whiskey.', 'Top with Coke.', 'Squeeze lime.'],
            zh: ['高球杯裝滿冰塊。', '加入威士忌。', '加滿可樂。', '擠入檸檬汁。']
        },
        tags: { en: ['cvs', 'classic', 'party'], zh: ['超商', '經典', '派對'] },
        description: {
            en: 'The reliable classic. Smoky whiskey meets sweet caramel soda.',
            zh: '絕對經典。煙燻威士忌遇上香甜焦糖氣泡。'
        },
        specs: { alcohol: 5, sweetness: 7, ease: 10 },
        color: '#3f1d10',
        image: `${BASE_STORAGE_URL}/rum-coke.png`, // Placeholder
        collections: ['cvs-hacks']
    },
    {
        id: 'soju-coffee',
        name: { en: 'Soju Coffee (Sojucano)', zh: '燒酒咖啡' },
        type: 'cvs',
        baseSpirit: ['soju'],
        ingredients: {
            en: [{ name: 'Soju', amount: '1 part' }, { name: 'Black Coffee', amount: '2 parts' }],
            zh: [{ name: '燒酒', amount: '1份' }, { name: '黑咖啡', amount: '2份' }]
        },
        steps: {
            en: ['Fill glass with ice.', 'Pour Soju.', 'Top with black coffee.'],
            zh: ['杯中加冰。', '倒入燒酒。', '加滿黑咖啡。']
        },
        tags: { en: ['cvs', 'bittersweet', 'pick-me-up'], zh: ['超商', '苦甜', '提神'] },
        description: {
            en: 'The bitterness of coffee masks the alcohol burn of Soju perfectly. A dangerous wake-up call.',
            zh: '咖啡的苦味完美掩蓋了燒酒的酒精味。危險的提神飲料。'
        },
        specs: { alcohol: 4, sweetness: 3, ease: 10 },
        color: '#1c1917',
        image: `${BASE_STORAGE_URL}/black-coffee-whiskey.png`, // Placeholder
        collections: ['cvs-hacks']
    },
    {
        id: 'cowboy',
        name: { en: 'Cowboy', zh: '牛仔' },
        type: 'cvs',
        baseSpirit: ['whiskey'],
        ingredients: {
            en: [{ name: 'Whiskey', amount: '45ml' }, { name: 'Milk', amount: 'Top up' }],
            zh: [{ name: '威士忌', amount: '45ml' }, { name: '牛奶', amount: '適量' }]
        },
        steps: {
            en: ['Fill glass with ice.', 'Add whiskey.', 'Top with milk.', 'Stir.'],
            zh: ['杯中加冰。', '加入威士忌。', '加滿牛奶。', '攪拌均勻。']
        },
        tags: { en: ['cvs', 'creamy', 'winter'], zh: ['超商', '濃郁', '冬季'] },
        description: {
            en: 'A simple, creamy drink. The milk mellows out the whiskey, creating a smooth sipper.',
            zh: '簡單濃郁。牛奶柔化了威士忌的線條，滑順易飲。'
        },
        specs: { alcohol: 4, sweetness: 4, ease: 10 },
        color: '#f5f5f4',
        image: `${BASE_STORAGE_URL}/white-russian.png`, // Placeholder
        collections: ['cvs-hacks']
    }
];

async function addRecipes() {
    console.log(`🚀 Starting to add ${newRecipes.length} new CVS recipes...`);

    for (const recipe of newRecipes) {
        console.log(`\n🔹 Processing: ${recipe.name.en} (${recipe.id})`);

        // Skip image upload, relying on remote placeholders.
        const imageUrl = recipe.image;

        console.log(`   🖼️ Using placeholder image: ${imageUrl}`);

        const dbRecord = {
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
            image: imageUrl,
            collections: recipe.collections
        };

        console.log(`   💾 Upserting into DB...`);
        const { error: insertError } = await supabase
            .from('recipes')
            .upsert(dbRecord, { onConflict: 'id' });

        if (insertError) {
            console.error(`   ❌ DB Insert failed: ${insertError.message}`);
        } else {
            console.log(`   ✅ Recipe saved!`);
        }
    }
    console.log('\n✨ All done!');
}

addRecipes();
