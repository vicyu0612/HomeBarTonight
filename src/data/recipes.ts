export interface Ingredient {
    name: string;
    amount: string;
}

export interface Spec {
    alcohol: number;
    sweetness: number;
    ease: number;
}

export interface Recipe {
    id: string;
    name: { en: string; zh: string };
    type: 'classic' | 'cvs' | 'signature';
    baseSpirit: string[];
    ingredients: { en: Ingredient[]; zh: Ingredient[] };
    steps: { en: string[]; zh: string[] };
    tags: { en: string[]; zh: string[] };
    description: { en: string; zh: string };
    specs: Spec;
    color: string;
    image: string;
}

export const recipes: Recipe[] = [
    // Classics
    {
        id: 'old-fashioned',
        name: { en: 'Old Fashioned', zh: '古典雞尾酒' },
        type: 'classic',
        baseSpirit: ['whiskey'],
        ingredients: {
            en: [
                { name: 'Bourbon or Rye Whiskey', amount: '60ml' },
                { name: 'Angostura Bitters', amount: '2-3 dashes' },
                { name: 'Sugar Cube', amount: '1' },
            ],
            zh: [
                { name: '波本或黑麥威士忌', amount: '60ml' },
                { name: '苦精 (Angostura)', amount: '2-3滴' },
                { name: '方糖', amount: '1顆' },
            ]
        },
        steps: {
            en: [
                'Place sugar cube in glass and saturate with bitters and a splash of water.',
                'Muddle until dissolved.',
                'Add large ice cube and whiskey.',
                'Stir gently for 20-30 seconds.'
            ],
            zh: [
                '將方糖放入杯中，滴入苦精並加入少許水。',
                '搗碎直到溶解。',
                '加入大冰塊和威士忌。',
                '輕輕攪拌 20-30 秒。'
            ]
        },
        tags: {
            en: ['strong', 'bittersweet', 'classic'],
            zh: ['濃厚', '苦甜', '經典']
        },
        description: {
            en: 'The definition of a cocktail. Just whiskey, sugar, and bitters.',
            zh: '雞尾酒的定義。只有威士忌、糖和苦精。'
        },
        specs: {
            alcohol: 9,
            sweetness: 4,
            ease: 3
        },
        color: '#ea580c',
        image: '/cocktails/old-fashioned.png'
    },
    {
        id: 'gin-tonic',
        name: { en: 'Gin & Tonic', zh: '琴通寧' },
        type: 'classic',
        baseSpirit: ['gin'],
        ingredients: {
            en: [
                { name: 'Gin', amount: '45ml' },
                { name: 'Tonic Water', amount: '120ml' },
                { name: 'Lime or Cucumber', amount: 'Garnish' }
            ],
            zh: [
                { name: '琴酒', amount: '45ml' },
                { name: '通寧水', amount: '120ml' },
                { name: '檸檬或小黃瓜', amount: '裝飾' }
            ]
        },
        steps: {
            en: [
                'Fill a highball glass with ice.',
                'Pour gin over the ice.',
                'Top with tonic water.',
                'Stir gently to combine.'
            ],
            zh: [
                '在高球杯中裝滿冰塊。',
                '倒入琴酒。',
                '加滿通寧水。',
                '輕輕攪拌混合。'
            ]
        },
        tags: {
            en: ['refreshing', 'sour', 'bubbly'],
            zh: ['清爽', '酸', '氣泡']
        },
        description: {
            en: 'Simple, refreshing, and perfect for any occasion.',
            zh: '簡單、清爽，適合任何場合。'
        },
        specs: {
            alcohol: 5,
            sweetness: 5,
            ease: 9
        },
        color: '#22d3ee',
        image: '/cocktails/gin-tonic.png'
    },
    {
        id: 'margarita',
        name: { en: 'Margarita', zh: '瑪格麗特' },
        type: 'classic',
        baseSpirit: ['tequila'],
        ingredients: {
            en: [
                { name: 'Tequila Blanco', amount: '50ml' },
                { name: 'Lime Juice', amount: '25ml' },
                { name: 'Cointreau (Triple Sec)', amount: '20ml' },
                { name: 'Salt', amount: 'Rim' }
            ],
            zh: [
                { name: '銀龍舌蘭', amount: '50ml' },
                { name: '檸檬汁', amount: '25ml' },
                { name: '君度橙酒', amount: '20ml' },
                { name: '鹽', amount: '杯口鹽圈' }
            ]
        },
        steps: {
            en: [
                'Rub a lime wedge over half the rim of your coupe glass, then dip into salt.',
                'Shake tequila, lime juice, and Cointreau with ice.',
                'Strain into the prepared glass.'
            ],
            zh: [
                '用檸檬片塗抹杯口，沾上鹽圈。',
                '將龍舌蘭、檸檬汁、橙酒加冰搖盪。',
                '濾冰倒入杯中。'
            ]
        },
        tags: {
            en: ['sour', 'classic', 'party'],
            zh: ['酸', '經典', '派對']
        },
        description: {
            en: 'A perfect balance of sweet, sour, salty, and bitter.',
            zh: '酸甜鹹苦的完美平衡。'
        },
        specs: {
            alcohol: 7,
            sweetness: 4,
            ease: 6
        },
        color: '#84cc16', // Lime-500
        image: '/cocktails/margarita.png'
    },
    {
        id: 'mojito',
        name: { en: 'Mojito', zh: '莫西多' },
        type: 'classic',
        baseSpirit: ['rum'],
        ingredients: {
            en: [
                { name: 'White Rum', amount: '50ml' },
                { name: 'Fresh Lime Juice', amount: '25ml' },
                { name: 'Sugar', amount: '2 tsp' },
                { name: 'Mint Leaves', amount: 'top' },
                { name: 'Soda Water', amount: 'top' }
            ],
            zh: [
                { name: '白蘭姆酒', amount: '50ml' },
                { name: '新鮮檸檬汁', amount: '25ml' },
                { name: '糖', amount: '2茶匙' },
                { name: '薄荷葉', amount: '適量' },
                { name: '氣泡水', amount: '加滿' }
            ]
        },
        steps: {
            en: [
                'Muddle mint leaves with sugar and lime juice.',
                'Add a splash of soda water and fill the glass with cracked ice.',
                'Pour the rum and top with soda water.',
                'Garnish with mint sprig.'
            ],
            zh: [
                '將薄荷葉、糖和檸檬汁搗碎。',
                '加入少許蘇打水，並加入碎冰。',
                '倒入蘭姆酒，再加滿蘇打水。',
                '用薄荷枝裝飾。'
            ]
        },
        tags: {
            en: ['refreshing', 'minty', 'summer'],
            zh: ['清爽', '薄荷', '夏天']
        },
        description: {
            en: 'Cuba’s refreshing peppermint drink.',
            zh: '古巴最清爽的薄荷特調。'
        },
        specs: {
            alcohol: 5,
            sweetness: 6,
            ease: 9
        },
        color: '#10b981', // Emerald-500
        image: '/cocktails/mojito.png'
    },
    {
        id: 'martini',
        name: { en: 'Dry Martini', zh: '乾馬丁尼' },
        type: 'classic',
        baseSpirit: ['gin', 'vodka'],
        ingredients: {
            en: [
                { name: 'Gin', amount: '60ml' },
                { name: 'Dry Vermouth', amount: '10ml' },
                { name: 'Olive or Lemon Twist', amount: '1' }
            ],
            zh: [
                { name: '琴酒', amount: '60ml' },
                { name: '不甜香艾酒', amount: '10ml' },
                { name: '橄欖或檸檬皮', amount: '1' }
            ]
        },
        steps: {
            en: [
                'Add all ingredients into mixing glass with ice and stir.',
                'Strain into a chilled martini glass.',
                'Garnish with olive or lemon twist.'
            ],
            zh: [
                '將所有材料加入攪拌杯加冰攪拌。',
                '濾冰倒入冰鎮過的馬丁尼杯。',
                '用橄欖或檸檬皮裝飾。'
            ]
        },
        tags: {
            en: ['strong', 'dry', 'classic'],
            zh: ['烈', '不甜', '經典']
        },
        description: {
            en: 'The King of Cocktails.',
            zh: '雞尾酒之王。'
        },
        specs: {
            alcohol: 10,
            sweetness: 1,
            ease: 2
        },
        color: '#cbd5e1', // Slate-300
        image: '/cocktails/martini.png'
    },
    {
        id: 'sidecar',
        name: { en: 'Sidecar', zh: '側車' },
        type: 'classic',
        baseSpirit: ['brandy'],
        ingredients: {
            en: [
                { name: 'Cognac', amount: '50ml' },
                { name: 'Cointreau', amount: '20ml' },
                { name: 'Lemon Juice', amount: '20ml' }
            ],
            zh: [
                { name: '干邑白蘭地', amount: '50ml' },
                { name: '君度橙酒', amount: '20ml' },
                { name: '檸檬汁', amount: '20ml' }
            ]
        },
        steps: {
            en: [
                'Coat the rim of a coupe glass with sugar (optional).',
                'Shake all ingredients with ice.',
                'Strain into the prepared glass.'
            ],
            zh: [
                '杯口沾糖圈（可選）。',
                '將所有材料加冰搖盪。',
                '濾冰倒入杯中。'
            ]
        },
        tags: {
            en: ['sour', 'classic', 'elegant'],
            zh: ['酸', '經典', '優雅']
        },
        description: {
            en: 'One of the best sour cocktails ever created.',
            zh: '史上最棒的酸味調酒之一。'
        },
        specs: {
            alcohol: 7,
            sweetness: 4,
            ease: 5
        },
        color: '#d97706', // Amber-600
        image: '/cocktails/sidecar.png'
    },
    {
        id: 'paloma',
        name: { en: 'Paloma', zh: '帕洛瑪' },
        type: 'classic',
        baseSpirit: ['tequila'],
        ingredients: {
            en: [
                { name: 'Tequila', amount: '50ml' },
                { name: 'Grapefruit Soda', amount: 'Top up' },
                { name: 'Lime Juice', amount: '15ml' },
                { name: 'Salt', amount: 'Rim' }
            ],
            zh: [
                { name: '龍舌蘭', amount: '50ml' },
                { name: '葡萄柚汽水', amount: '加滿' },
                { name: '檸檬汁', amount: '15ml' },
                { name: '鹽', amount: '杯口鹽圈' }
            ]
        },
        steps: {
            en: [
                'Salt the rim of a highball glass.',
                'Fill with ice and add tequila and lime juice.',
                'Top with grapefruit soda and stir.'
            ],
            zh: [
                '將高球杯口沾鹽。',
                '加冰塊，倒入龍舌蘭和檸檬汁。',
                '加滿葡萄柚汽水並攪拌。'
            ]
        },
        tags: {
            en: ['refreshing', 'sour', 'fizzy'],
            zh: ['清爽', '酸', '氣泡']
        },
        description: {
            en: 'The most popular tequila drink in Mexico.',
            zh: '墨西哥最受歡迎的龍舌蘭調酒。'
        },
        specs: {
            alcohol: 5,
            sweetness: 5,
            ease: 8
        },
        color: '#fca5a5', // Red-300
        image: '/cocktails/paloma.png'
    },
    {
        id: 'tequila-sunrise',
        name: { en: 'Tequila Sunrise', zh: '龍舌蘭日出' },
        type: 'classic',
        baseSpirit: ['tequila'],
        ingredients: {
            en: [
                { name: 'Tequila', amount: '50ml' },
                { name: 'Orange Juice', amount: '100ml' },
                { name: 'Grenadine', amount: '15ml' }
            ],
            zh: [
                { name: '龍舌蘭', amount: '50ml' },
                { name: '柳橙汁', amount: '100ml' },
                { name: '紅石榴糖漿', amount: '15ml' }
            ]
        },
        steps: {
            en: [
                'Pour tequila and orange juice into a glass with ice.',
                'Slowly pour grenadine down the side to create the sunrise effect.',
                'Do not stir before serving.'
            ],
            zh: [
                '將龍舌蘭和柳橙汁倒入加冰的杯中。',
                '沿著杯壁緩緩倒入紅石榴糖漿，製造日出效果。',
                '飲用前不要攪拌。'
            ]
        },
        tags: {
            en: ['sweet', 'fruity', 'beautiful'],
            zh: ['甜', '果味', '顏值高']
        },
        description: {
            en: 'A cocktail that looks like a summer sunrise.',
            zh: '一杯像極了夏日日出的調酒。'
        },
        specs: {
            alcohol: 5,
            sweetness: 8,
            ease: 9
        },
        color: '#fb923c', // Orange-400
        image: '/cocktails/tequila-sunrise.png'
    },
    {
        id: 'brandy-alexander',
        name: { en: 'Brandy Alexander', zh: '白蘭地亞歷山大' },
        type: 'classic',
        baseSpirit: ['brandy'],
        ingredients: {
            en: [
                { name: 'Cognac/Brandy', amount: '30ml' },
                { name: 'Creme de Cacao', amount: '30ml' },
                { name: 'Heavy Cream', amount: '30ml' },
                { name: 'Nutmeg', amount: 'Garnish' }
            ],
            zh: [
                { name: '干邑白蘭地', amount: '30ml' },
                { name: '可可香甜酒', amount: '30ml' },
                { name: '鮮奶油', amount: '30ml' },
                { name: '豆蔻粉', amount: '裝飾' }
            ]
        },
        steps: {
            en: [
                'Shake all ingredients with ice.',
                'Strain into a chilled coupe glass.',
                'Garnish with freshly grated nutmeg.'
            ],
            zh: [
                '將所有材料加冰搖盪。',
                '濾冰倒入冰鎮的淺碟酒杯。',
                '撒上現磨豆蔻粉裝飾。'
            ]
        },
        tags: {
            en: ['creamy', 'sweet', 'dessert'],
            zh: ['奶香', '甜', '甜點酒']
        },
        description: {
            en: 'A rich, creamy, chocolatey dessert cocktail.',
            zh: '濃郁、奶香、巧克力味的甜點調酒。'
        },
        specs: {
            alcohol: 6,
            sweetness: 8,
            ease: 6
        },
        color: '#a8a29e', // Stone-400
        image: '/cocktails/brandy-alexander.png'
    },
    {
        id: 'horses-neck',
        name: { en: "Horse's Neck", zh: '馬頸' },
        type: 'classic',
        baseSpirit: ['brandy'],
        ingredients: {
            en: [
                { name: 'Brandy', amount: '50ml' },
                { name: 'Ginger Ale', amount: 'Top up' },
                { name: 'Lemon Peel', amount: 'Long Strip' },
                { name: 'Bitters', amount: 'Optional' }
            ],
            zh: [
                { name: '白蘭地', amount: '50ml' },
                { name: '薑汁汽水', amount: '加滿' },
                { name: '檸檬皮', amount: '長條' },
                { name: '苦精', amount: '選用' }
            ]
        },
        steps: {
            en: [
                'Peel a long spiral of lemon zest.',
                'Place the zest in a highball glass with one end hanging over the rim.',
                'Add ice and brandy, top with ginger ale.'
            ],
            zh: [
                '削一條長長的螺旋狀檸檬皮。',
                '將皮放入高球杯，一端掛在杯口。',
                '加冰和白蘭地，倒滿薑汁汽水。'
            ]
        },
        tags: {
            en: ['refreshing', 'spicy', 'easy'],
            zh: ['清爽', '辛香', '簡單']
        },
        description: {
            en: 'A classic highball distinguished by its long lemon garnish.',
            zh: '以超長檸檬皮裝飾聞名的經典高球酒。'
        },
        specs: {
            alcohol: 5,
            sweetness: 6,
            ease: 9
        },
        color: '#ca8a04', // Yellow-600
        image: '/cocktails/horses-neck.png'
    },
    // CVS / Home Hacks
    {
        id: 'highball-cvs',
        name: { en: 'CVS Highball', zh: '超商嗨伯' },
        type: 'cvs',
        baseSpirit: ['whiskey'],
        ingredients: {
            en: [
                { name: 'Mini Whiskey Bottle', amount: '1 bottle (50ml)' },
                { name: 'Sparkling Water', amount: 'Fill glass' },
                { name: 'Lemon Juice', amount: 'Squeeze' }
            ],
            zh: [
                { name: '小樣酒 (威士忌)', amount: '1瓶 (50ml)' },
                { name: '氣泡水', amount: '加滿' },
                { name: '檸檬汁', amount: '擠一點' }
            ]
        },
        steps: {
            en: [
                'Buy a cup of ice from the convenience store.',
                'Pour the mini whiskey (Suntory/Jack Daniels) in.',
                'Fill to the top with sparkling water.',
                'Stir with a straw.'
            ],
            zh: [
                '去超商買一杯冰塊。',
                '把小瓶威士忌倒進去。',
                '加滿氣泡水。',
                '用吸管攪拌一下。'
            ]
        },
        tags: {
            en: ['easy', 'refreshing', 'bubbly'],
            zh: ['簡單', '清爽', '氣泡']
        },
        description: {
            en: 'The ultimate convenience store refresher.',
            zh: '超商調酒的終極選擇。'
        },
        specs: {
            alcohol: 6,
            sweetness: 2,
            ease: 7
        },
        color: '#facc15',
        image: '/cocktails/highball-cvs.png'
    },
    {
        id: 'kalimotxo',
        name: { en: 'Kalimotxo', zh: '卡里莫求' },
        type: 'cvs',
        baseSpirit: ['wine'],
        ingredients: {
            en: [
                { name: 'Red Wine (Cheap is fine)', amount: '50%' },
                { name: 'Coca-Cola', amount: '50%' },
                { name: 'Ice', amount: 'Plenty' }
            ],
            zh: [
                { name: '紅酒 (便宜的就好)', amount: '50%' },
                { name: '可樂', amount: '50%' },
                { name: '冰塊', amount: '大量' }
            ]
        },
        steps: {
            en: [
                'Fill a glass with ice.',
                'Mix equal parts Red Wine and Coke.',
                'Squeeze a lemon wedge if you feel fancy.'
            ],
            zh: [
                '杯子裝滿冰塊。',
                '混合等量的紅酒和可樂。',
                '如果想高級點，擠點檸檬。'
            ]
        },
        tags: {
            en: ['sweet', 'easy', 'party'],
            zh: ['甜', '簡單', '派對']
        },
        description: {
            en: 'A Basque classic that tastes surprisingly like sangria.',
            zh: '巴斯克經典喝法，喝起來意外像桑格利亞水果酒。'
        },
        specs: {
            alcohol: 4,
            sweetness: 8,
            ease: 10
        },
        color: '#7f1d1d',
        image: '/cocktails/kalimotxo.png'
    },
    {
        id: 'screwdriver',
        name: { en: 'Screwdriver', zh: '螺絲起子' },
        type: 'cvs',
        baseSpirit: ['vodka'],
        ingredients: {
            en: [
                { name: 'Vodka', amount: '45ml' },
                { name: 'Orange Juice', amount: 'Top up' }
            ],
            zh: [
                { name: '伏特加', amount: '45ml' },
                { name: '柳橙汁', amount: '加滿' }
            ]
        },
        steps: {
            en: [
                'Fill glass with ice.',
                'Add vodka.',
                'Top with orange juice.'
            ],
            zh: [
                '杯中加冰。',
                '加入伏特加。',
                '加滿柳橙汁。'
            ]
        },
        tags: {
            en: ['sweet', 'fruity', 'brunch'],
            zh: ['甜', '果味', '早午餐']
        },
        description: {
            en: 'Vitamin C with a kick.',
            zh: '帶勁的維他命 C。'
        },
        specs: {
            alcohol: 5,
            sweetness: 7,
            ease: 9
        },
        color: '#fb923c',
        image: '/cocktails/screwdriver.png'
    },
    {
        id: 'lemon-sour',
        name: { en: 'Strong Zero Style', zh: '日式檸檬沙瓦' },
        type: 'cvs',
        baseSpirit: ['vodka', 'shochu'],
        ingredients: {
            en: [
                { name: 'Shochu or Vodka', amount: '60ml' },
                { name: 'Lemon Sparkling Water (CC Lemon etc)', amount: 'Top up' },
                { name: 'Lemon', amount: 'Wedge' }
            ],
            zh: [
                { name: '燒酒或伏特加', amount: '60ml' },
                { name: '檸檬氣泡水 (CC檸檬等)', amount: '加滿' },
                { name: '檸檬', amount: '切角' }
            ]
        },
        steps: {
            en: [
                'Ice in glass.',
                'Pour spirits.',
                'Top with lemon soda.'
            ],
            zh: [
                '杯中加冰。',
                '倒入基酒。',
                '加滿檸檬氣泡飲。'
            ]
        },
        tags: {
            en: ['sour', 'refreshing', 'strong'],
            zh: ['酸', '清爽', '烈']
        },
        description: {
            en: 'Japanese style lemon sour.',
            zh: '居酒屋風格的檸檬沙瓦。'
        },
        specs: {
            alcohol: 8,
            sweetness: 3,
            ease: 6
        },
        color: '#fef08a',
        image: '/cocktails/lemon-sour.png'
    },
    {
        id: 'rum-coke',
        name: { en: 'Rum & Coke', zh: '蘭姆可樂' },
        type: 'cvs',
        baseSpirit: ['rum'],
        ingredients: {
            en: [
                { name: 'Rum', amount: '50ml' },
                { name: 'Coca-Cola', amount: 'Top up' },
                { name: 'Lime', amount: 'Wedge' }
            ],
            zh: [
                { name: '蘭姆酒', amount: '50ml' },
                { name: '可樂', amount: '加滿' },
                { name: '檸檬', amount: '切角' }
            ]
        },
        steps: {
            en: [
                'Fill glass with ice.',
                'Pour rum.',
                'Top with coke and squeeze lime in.'
            ],
            zh: [
                '杯中加冰。',
                '倒入蘭姆酒。',
                '加滿可樂並擠入檸檬汁。'
            ]
        },
        tags: {
            en: ['sweet', 'easy', 'party'],
            zh: ['甜', '簡單', '派對']
        },
        description: {
            en: 'Simple, effective, caffeine included.',
            zh: '簡單有效，還自帶咖啡因。'
        },
        specs: {
            alcohol: 5,
            sweetness: 8,
            ease: 9
        },
        color: '#3f2c2c', // Dark cola
        image: '/cocktails/rum-coke.png'
    }
];
