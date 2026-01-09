
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Missing Supabase credentials')
    process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

const recipes = [
    {
        id: 'vitamin-c-vodka',
        name: { en: 'Vitamin C Bomb', zh: '維他命C炸彈' },
        type: 'cvs',
        base_spirit: ['vodka'],
        ingredients: {
            en: [
                { name: 'Vodka', amount: '45ml' },
                { name: 'Vitamin C Drink (C-1000)', amount: '1 bottle' },
                { name: 'Ice', amount: 'Full glass' }
            ],
            zh: [
                { name: '伏特加', amount: '45ml' },
                { name: '維他命C飲料 (C-1000)', amount: '1瓶' },
                { name: '冰塊', amount: '滿杯' }
            ]
        },
        steps: {
            en: ['Build all ingredients in a highball glass with ice.', 'Stir gently.'],
            zh: ['將所有材料直接加入裝滿冰塊的高球杯中。', '輕輕攪拌。']
        },
        tags: {
            en: ['refreshing', 'cvs', 'easy'],
            zh: ['清爽', '超商', '簡單']
        },
        description: {
            en: 'A refreshing mix of Vodka and Vitamin C drink.',
            zh: 'C-1000的酸甜氣泡，搭配伏特加的清冽。感冒好像都好了一半？(誤)，這絕對是維他命炸彈！'
        },
        specs: { alcohol: 5, sweetness: 6, ease: 10 },
        color: '#fef3c7', // Amber-100
        image: 'https://uyamflgtvqndbjpbjito.supabase.co/storage/v1/object/public/cocktails/cocktails/vitamin-c-vodka.png',
        collections: ['cvs-hacks']
    },
    {
        id: 'oolong-gin',
        name: { en: 'Oolong Gin', zh: '烏龍琴酒' },
        type: 'cvs',
        base_spirit: ['gin'],
        ingredients: {
            en: [
                { name: 'Gin', amount: '45ml' },
                { name: 'Sugar-free Oolong Tea', amount: 'Top up' }
            ],
            zh: [
                { name: '琴酒', amount: '45ml' },
                { name: '無糖烏龍茶 (茶裏王/原萃)', amount: '加滿' }
            ]
        },
        steps: {
            en: ['Build in a highball glass over ice.', 'Stir well.'],
            zh: ['在高球杯中加冰，倒入材料。', '攪拌均勻。']
        },
        tags: {
            en: ['tea', 'herbal', 'sugar-free'],
            zh: ['茶', '草本', '無糖']
        },
        description: {
            en: 'Zen in a glass. Herbal gin meets roasted oolong tea.',
            zh: '便利商店的茶裏王或原萃，加上琴酒的杜松子香。一杯充滿禪意與草本香氣的台式 Tea Martini。'
        },
        specs: { alcohol: 5, sweetness: 0, ease: 10 },
        color: '#a16207', // Amber-700
        image: '',
        collections: ['cvs-hacks']
    },
    {
        id: 'red-eye-tw',
        name: { en: 'Red Eye (Taiwan Style)', zh: '台式紅眼' },
        type: 'cvs',
        base_spirit: ['beer'],
        ingredients: {
            en: [
                { name: 'Taiwan Beer', amount: '1/2 can' },
                { name: 'Tomato Juice', amount: '1/2 can' }
            ],
            zh: [
                { name: '金牌台灣啤酒', amount: '半罐' },
                { name: '可果美番茄汁', amount: '半罐' }
            ]
        },
        steps: {
            en: ['Pour equal parts beer and tomato juice into a glass.', 'Stir lightly.'],
            zh: ['將啤酒與番茄汁以 1:1 比例倒入杯中。', '稍微攪拌即可。']
        },
        tags: {
            en: ['savory', 'low-abv', 'hangover'],
            zh: ['鹹鮮', '低酒精', '解酒']
        },
        description: {
            en: 'The classic hangover cure, Taiwan style.',
            zh: '經典的解宿醉酒譜，但用的是正港台灣金牌啤酒配上可果美番茄汁。鹹鹹甜甜，意外順口！'
        },
        specs: { alcohol: 3, sweetness: 3, ease: 10 },
        color: '#ef4444', // Red-500
        image: '',
        collections: ['cvs-hacks']
    },
    {
        id: 'plum-green-whiskey',
        name: { en: 'Plum Green Tea Whiskey', zh: '梅子綠威士忌' },
        type: 'cvs',
        base_spirit: ['whiskey'],
        ingredients: {
            en: [
                { name: 'Whiskey', amount: '45ml' },
                { name: 'Plum Green Tea', amount: 'Top up' }
            ],
            zh: [
                { name: '威士忌', amount: '45ml' },
                { name: '梅子綠茶', amount: '加滿' }
            ]
        },
        steps: {
            en: ['Build in a highball glass over ice.', 'Add a pickled plum if available.'],
            zh: ['在高球杯中加入冰塊與材料。', '如果有的話，可以加一顆話梅。']
        },
        tags: {
            en: ['sour', 'sweet', 'local'],
            zh: ['酸甜', '在地', '回憶']
        },
        description: {
            en: 'Sweet and sour plum tea balances the whiskey perfectly.',
            zh: '酸甜梅子綠茶是台灣人的共同回憶。加入威士忌後，梅子的鹹酸巧妙修飾了酒感，一不小心就乾杯。'
        },
        specs: { alcohol: 6, sweetness: 7, ease: 10 },
        color: '#d97706', // Amber-600
        image: '',
        collections: ['cvs-hacks']
    },
    {
        id: 'lemon-tea-whiskey',
        name: { en: 'Lemon Tea Whiskey', zh: '檸檬紅威士忌' },
        type: 'cvs',
        base_spirit: ['whiskey'],
        ingredients: {
            en: [
                { name: 'Whiskey', amount: '45ml' },
                { name: 'Lemon Tea', amount: 'Top up' }
            ],
            zh: [
                { name: '威士忌', amount: '45ml' },
                { name: '檸檬紅茶 (冰鎮/麥香)', amount: '加滿' }
            ]
        },
        steps: {
            en: ['Fill glass with ice.', 'Add whiskey and top with lemon tea.'],
            zh: ['杯中裝滿冰塊。', '加入威士忌，再倒滿檸檬紅茶。']
        },
        tags: {
            en: ['sweet', 'classic', 'easy'],
            zh: ['甜', '經典', '簡單']
        },
        description: {
            en: 'Childhood lemon tea with a grown-up twist.',
            zh: '小時候喝的冰鎮檸檬紅茶，長大後加了威士忌。熟悉的酸甜滋味中，帶著大人的後勁。'
        },
        specs: { alcohol: 6, sweetness: 8, ease: 10 },
        color: '#78350f', // Amber-900
        image: '',
        collections: ['cvs-hacks']
    },
    {
        id: 'soymilk-baileys',
        name: { en: 'Soy Milk Baileys', zh: '豆漿貝禮詩' },
        type: 'cvs',
        base_spirit: ['liqueur'],
        ingredients: {
            en: [
                { name: 'Baileys', amount: '45ml' },
                { name: 'Unsweetened Soy Milk', amount: '90ml' }
            ],
            zh: [
                { name: '貝禮詩奶酒', amount: '45ml' },
                { name: '無糖豆漿', amount: '90ml' }
            ]
        },
        steps: {
            en: ['Stir ingredients with ice.', 'Serve in a rocks glass.'],
            zh: ['將材料加冰攪拌均勻。', '倒入威士忌杯中飲用。']
        },
        tags: {
            en: ['creamy', 'nutty', 'local'],
            zh: ['奶香', '豆香', '台味']
        },
        description: {
            en: 'Creamy soy milk meets sweet Irish Cream.',
            zh: '光泉無糖豆漿的濃郁豆香，配上貝禮詩奶酒。比牛奶更清爽，帶有獨特的台式古早味。'
        },
        specs: { alcohol: 5, sweetness: 6, ease: 10 },
        color: '#ebd5c1', // Beige
        image: '',
        collections: ['cvs-hacks']
    },
    {
        id: 'yakult-green-vodka',
        name: { en: 'Yogurt Green Vodka', zh: '多多綠伏特加' },
        type: 'cvs',
        base_spirit: ['vodka'],
        ingredients: {
            en: [
                { name: 'Vodka', amount: '45ml' },
                { name: 'Yakult', amount: '2 bottles' },
                { name: 'Green Tea', amount: 'Splash' }
            ],
            zh: [
                { name: '伏特加', amount: '45ml' },
                { name: '養樂多', amount: '2瓶' },
                { name: '綠茶', amount: '少許' }
            ]
        },
        steps: {
            en: ['Build over ice.', 'Stir well to mix.'],
            zh: ['加冰倒入所有材料。', '攪拌均勻。']
        },
        tags: {
            en: ['sweet', 'tart', 'popular'],
            zh: ['酸甜', '人氣', '手搖風']
        },
        description: {
            en: 'A boozy version of the popular Yakult Green Tea.',
            zh: '手搖飲店必點的多多綠，加入伏特加變成派對特調。乳酸的酸甜讓人完全忘記酒精的存在。'
        },
        specs: { alcohol: 6, sweetness: 9, ease: 9 },
        color: '#fde68a', // Amber-200
        image: '',
        collections: ['cvs-hacks']
    },
    {
        id: 'pocari-soju',
        name: { en: 'Pocari Soju', zh: '寶礦力燒酒' },
        type: 'cvs',
        base_spirit: ['soju'],
        ingredients: {
            en: [
                { name: 'Soju', amount: '1 part' },
                { name: 'Pocari Sweat', amount: '2 parts' }
            ],
            zh: [
                { name: '原味燒酒', amount: '1份' },
                { name: '寶礦力水得', amount: '2份' }
            ]
        },
        steps: {
            en: ['Mix in a glass with ice.', 'Drink responsibly.'],
            zh: ['在杯中加冰混合。', '小心飲用。']
        },
        tags: {
            en: ['refreshing', 'dangerous', 'party'],
            zh: ['清爽', '補水', '危險']
        },
        description: {
            en: 'Hydration and intoxication in one.',
            zh: '韓劇常出現的喝法，但在台灣我們用寶礦力。補水又補酒精，喝起來像沒有氣的微糖運動飲料，危險易醉！'
        },
        specs: { alcohol: 5, sweetness: 4, ease: 10 },
        color: '#bfdbfe', // Blue-200
        image: '',
        collections: ['cvs-hacks']
    },
    {
        id: 'black-coffee-whiskey',
        name: { en: 'Black Coffee Whiskey', zh: '美式威士忌' },
        type: 'cvs',
        base_spirit: ['whiskey'],
        ingredients: {
            en: [
                { name: 'Whiskey', amount: '45ml' },
                { name: 'Black Coffee', amount: 'Top up' }
            ],
            zh: [
                { name: '威士忌', amount: '45ml' },
                { name: '黑咖啡 (伯朗/UCC)', amount: '加滿' }
            ]
        },
        steps: {
            en: ['Pour whiskey over ice.', 'Top with cold black coffee.'],
            zh: ['將威士忌倒入冰杯。', '加滿冰黑咖啡。']
        },
        tags: {
            en: ['bitter', 'caffeinated', 'strong'],
            zh: ['苦', '提神', '大人味']
        },
        description: {
            en: 'Coffee and whiskey. The working man\'s cocktail.',
            zh: '上班族的提神良方？伯朗咖啡或 UCC 黑咖啡，倒入威士忌。苦味與麥香的重擊，適合加班的夜晚。'
        },
        specs: { alcohol: 7, sweetness: 2, ease: 10 },
        color: '#000000',
        image: '',
        collections: ['cvs-hacks']
    },

]

async function addRecipes() {
    console.log(`Upserting ${recipes.length} CVS recipes...`)

    // We use upsert to create or update if exists
    const { error } = await supabase
        .from('recipes')
        .upsert(recipes, { onConflict: 'id' })

    if (error) {
        console.error('Error inserting recipes:', error.message)
    } else {
        console.log('Successfully added/updated recipes:')
        recipes.forEach(r => console.log(`- ${r.name.zh} (${r.id})`))
    }
}

addRecipes().catch(console.error)
