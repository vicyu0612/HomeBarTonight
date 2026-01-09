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
    collections?: string[];
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
        image: 'https://uyamflgtvqndbjpbjito.supabase.co/storage/v1/object/public/cocktails/old-fashioned.png'
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
        image: 'https://uyamflgtvqndbjpbjito.supabase.co/storage/v1/object/public/cocktails/gin-tonic.png'
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
        image: 'https://uyamflgtvqndbjpbjito.supabase.co/storage/v1/object/public/cocktails/margarita.png'
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
        image: 'https://uyamflgtvqndbjpbjito.supabase.co/storage/v1/object/public/cocktails/mojito.png'
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
        image: 'https://uyamflgtvqndbjpbjito.supabase.co/storage/v1/object/public/cocktails/martini.png'
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
        image: 'https://uyamflgtvqndbjpbjito.supabase.co/storage/v1/object/public/cocktails/sidecar.png'
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
        image: 'https://uyamflgtvqndbjpbjito.supabase.co/storage/v1/object/public/cocktails/paloma.png'
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
        image: 'https://uyamflgtvqndbjpbjito.supabase.co/storage/v1/object/public/cocktails/tequila-sunrise.png'
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
        image: 'https://uyamflgtvqndbjpbjito.supabase.co/storage/v1/object/public/cocktails/brandy-alexander.png'
    },
    {
        id: 'daiquiri',
        name: { en: 'Daiquiri', zh: '戴吉利' },
        type: 'classic',
        baseSpirit: ['rum'],
        ingredients: {
            en: [
                { name: 'White Rum', amount: '60ml' },
                { name: 'Lime Juice', amount: '30ml' },
                { name: 'Sugar Syrup', amount: '15ml' }
            ],
            zh: [
                { name: '白蘭姆酒', amount: '60ml' },
                { name: '檸檬汁', amount: '30ml' },
                { name: '糖漿', amount: '15ml' }
            ]
        },
        steps: {
            en: [
                'Shake all ingredients with ice.',
                'Double strain into a chilled coupe glass.',
                'Garnish with a lime wheel (optional).'
            ],
            zh: [
                '將所有材料加冰搖盪。',
                '雙重過濾倒入冰鎮淺碟酒杯。',
                '可用檸檬片裝飾（選用）。'
            ]
        },
        tags: {
            en: ['sour', 'refreshing', 'classic'],
            zh: ['酸', '清爽', '經典']
        },
        description: {
            en: 'A perfect balance of rum, sweetness, and citrus.',
            zh: '蘭姆酒、甜味與柑橘的完美平衡。'
        },
        specs: {
            alcohol: 7,
            sweetness: 5,
            ease: 6
        },
        color: '#f0fdf4',
        image: 'https://uyamflgtvqndbjpbjito.supabase.co/storage/v1/object/public/cocktails/daiquiri.png'
    },
    {
        id: 'whiskey-sour',
        name: { en: 'Whiskey Sour', zh: '威士忌酸酒' },
        type: 'classic',
        baseSpirit: ['whiskey'],
        ingredients: {
            en: [
                { name: 'Bourbon', amount: '60ml' },
                { name: 'Lemon Juice', amount: '30ml' },
                { name: 'Sugar Syrup', amount: '15ml' },
                { name: 'Egg White', amount: '1 (Optional)' },
                { name: 'Bitters', amount: 'Dash' }
            ],
            zh: [
                { name: '波本威士忌', amount: '60ml' },
                { name: '檸檬汁', amount: '30ml' },
                { name: '糖漿', amount: '15ml' },
                { name: '蛋白', amount: '1顆 (選用)' },
                { name: '苦精', amount: '少許' }
            ]
        },
        steps: {
            en: [
                'Dry shake (no ice) all ingredients to emulsify egg white.',
                'Add ice and shake again vigorously.',
                'Strain into a rocks glass over fresh ice.',
                'Garnish with orange slice and cherry.'
            ],
            zh: [
                '將所有材料不加冰乾搖以乳化蛋白。',
                '加入冰塊再次劇烈搖盪。',
                '濾入裝有新冰的威士忌杯。',
                '裝飾柳橙片和櫻桃。'
            ]
        },
        tags: {
            en: ['sour', 'creamy', 'classic'],
            zh: ['酸', '綿密', '經典']
        },
        description: {
            en: 'Silky texture with a sour punch.',
            zh: '口感綿密，酸度帶勁。'
        },
        specs: {
            alcohol: 6,
            sweetness: 5,
            ease: 6
        },
        color: '#fde047',
        image: 'https://uyamflgtvqndbjpbjito.supabase.co/storage/v1/object/public/cocktails/whiskey-sour.png'
    },
    {
        id: 'negroni',
        name: { en: 'Negroni', zh: '內格羅尼' },
        type: 'classic',
        baseSpirit: ['gin'],
        ingredients: {
            en: [
                { name: 'Gin', amount: '30ml' },
                { name: 'Campari', amount: '30ml' },
                { name: 'Sweet Vermouth', amount: '30ml' }
            ],
            zh: [
                { name: '琴酒', amount: '30ml' },
                { name: '金巴利', amount: '30ml' },
                { name: '甜香艾酒', amount: '30ml' }
            ]
        },
        steps: {
            en: [
                'Stir all ingredients with ice.',
                'Strain into a rocks glass over a large ice cube.',
                'Garnish with an orange peel.'
            ],
            zh: [
                '將所有材料加冰攪拌。',
                '濾入裝有大冰塊的威士忌杯。',
                '裝飾柳橙皮。'
            ]
        },
        tags: {
            en: ['bitter', 'strong', 'aperitif'],
            zh: ['苦', '烈', '開胃酒']
        },
        description: {
            en: 'The ultimate Italian aperitif.',
            zh: '義大利開胃酒的極致。'
        },
        specs: {
            alcohol: 8,
            sweetness: 4,
            ease: 9
        },
        color: '#ef4444',
        image: 'https://uyamflgtvqndbjpbjito.supabase.co/storage/v1/object/public/cocktails/negroni.png'
    },
    {
        id: 'manhattan',
        name: { en: 'Manhattan', zh: '曼哈頓' },
        type: 'classic',
        baseSpirit: ['whiskey'],
        ingredients: {
            en: [
                { name: 'Rye Whiskey', amount: '60ml' },
                { name: 'Sweet Vermouth', amount: '30ml' },
                { name: 'Angostura Bitters', amount: '2 dashes' }
            ],
            zh: [
                { name: '黑麥威士忌', amount: '60ml' },
                { name: '甜香艾酒', amount: '30ml' },
                { name: '苦精', amount: '2配' }
            ]
        },
        steps: {
            en: [
                'Stir all ingredients with ice.',
                'Strain into a chilled coupe glass.',
                'Garnish with a brandied cherry.'
            ],
            zh: [
                '將所有材料加冰攪拌。',
                '濾入冰鎮淺碟酒杯。',
                '裝飾酒漬櫻桃。'
            ]
        },
        tags: {
            en: ['strong', 'sophisticated', 'classic'],
            zh: ['烈', '成熟', '經典']
        },
        description: {
            en: 'Sophisticated and complex, the queen of cocktails.',
            zh: '複雜成熟，雞尾酒之后。'
        },
        specs: {
            alcohol: 9,
            sweetness: 3,
            ease: 8
        },
        color: '#b91c1c',
        image: 'https://uyamflgtvqndbjpbjito.supabase.co/storage/v1/object/public/cocktails/manhattan.png'
    },
    {
        id: 'espresso-martini',
        name: { en: 'Espresso Martini', zh: '濃縮咖啡馬丁尼' },
        type: 'classic',
        baseSpirit: ['vodka', 'liqueur'],
        ingredients: {
            en: [
                { name: 'Vodka', amount: '40ml' },
                { name: 'Coffee Liqueur', amount: '20ml' },
                { name: 'Espresso', amount: '30ml' },
                { name: 'Sugar Syrup', amount: '5ml (Optional)' }
            ],
            zh: [
                { name: '伏特加', amount: '40ml' },
                { name: '咖啡香甜酒', amount: '20ml' },
                { name: '濃縮咖啡', amount: '30ml' },
                { name: '糖漿', amount: '5ml (選用)' }
            ]
        },
        steps: {
            en: [
                'Shake vigorously with ice to create foam.',
                'Strain into a chilled martini glass.',
                'Garnish with 3 coffee beans.'
            ],
            zh: [
                '加冰劇烈搖盪以產生泡沫。',
                '濾入冰鎮馬丁尼杯。',
                '裝飾三顆咖啡豆。'
            ]
        },
        tags: {
            en: ['coffee', 'energizing', 'sweet'],
            zh: ['咖啡', '提神', '甜']
        },
        description: {
            en: 'Wake me up, and then fuck me up.',
            zh: '讓我清醒，再讓我醉。'
        },
        specs: {
            alcohol: 6,
            sweetness: 6,
            ease: 5
        },
        color: '#451a03',
        image: 'https://uyamflgtvqndbjpbjito.supabase.co/storage/v1/object/public/cocktails/espresso-martini.png'
    },
    {
        id: 'cosmopolitan',
        name: { en: 'Cosmopolitan', zh: '柯夢波丹' },
        type: 'classic',
        baseSpirit: ['vodka'],
        ingredients: {
            en: [
                { name: 'Vodka Citron', amount: '45ml' },
                { name: 'Cointreau', amount: '15ml' },
                { name: 'Cranberry Juice', amount: '30ml' },
                { name: 'Lime Juice', amount: '10ml' }
            ],
            zh: [
                { name: '檸檬伏特加', amount: '45ml' },
                { name: '君度橙酒', amount: '15ml' },
                { name: '蔓越莓汁', amount: '30ml' },
                { name: '檸檬汁', amount: '10ml' }
            ]
        },
        steps: {
            en: [
                'Shake all ingredients with ice.',
                'Strain into a chilled martini glass.',
                'Garnish with a lime wheel or zest.'
            ],
            zh: [
                '將所有材料加冰搖盪。',
                '濾入冰鎮馬丁尼杯。',
                '裝飾檸檬片或皮。'
            ]
        },
        tags: {
            en: ['fruity', 'sour', 'popular'],
            zh: ['果味', '酸', '流行']
        },
        description: {
            en: 'A modern classic made famous by Sex and the City.',
            zh: '因《慾望城市》而聞名的現代經典。'
        },
        specs: {
            alcohol: 6,
            sweetness: 5,
            ease: 7
        },
        color: '#db2777',
        image: 'https://uyamflgtvqndbjpbjito.supabase.co/storage/v1/object/public/cocktails/cosmopolitan.png'
    },
    {
        id: 'mai-tai',
        name: { en: 'Mai Tai', zh: '包含泰' },
        type: 'classic',
        baseSpirit: ['rum'],
        ingredients: {
            en: [
                { name: 'Aged Rum', amount: '45ml' },
                { name: 'Orange Curacao', amount: '15ml' },
                { name: 'Orgeat Syrup', amount: '15ml' },
                { name: 'Lime Juice', amount: '30ml' }
            ],
            zh: [
                { name: '陳年蘭姆酒', amount: '45ml' },
                { name: '柑橘香甜酒', amount: '15ml' },
                { name: '杏仁糖漿', amount: '15ml' },
                { name: '檸檬汁', amount: '30ml' }
            ]
        },
        steps: {
            en: [
                'Shake all ingredients with ice.',
                'Strain into a double rocks glass over crushed ice.',
                'Garnish with mint sprig and lime shell.'
            ],
            zh: [
                '將所有材料加冰搖盪。',
                '濾入裝有碎冰的雙份威士忌杯。',
                '裝飾薄荷枝和檸檬皮。'
            ]
        },
        tags: {
            en: ['tiki', 'complex', 'tropical'],
            zh: ['提基', '層次', '熱帶']
        },
        description: {
            en: 'Out of this world! The quintessential Tiki drink.',
            zh: '好喝到上天！提基調酒的代表作。'
        },
        specs: {
            alcohol: 8,
            sweetness: 6,
            ease: 5
        },
        color: '#b45309',
        image: 'https://uyamflgtvqndbjpbjito.supabase.co/storage/v1/object/public/cocktails/mai-tai.png'
    },
    {
        id: 'bloody-mary',
        name: { en: 'Bloody Mary', zh: '血腥瑪麗' },
        type: 'classic',
        baseSpirit: ['vodka'],
        ingredients: {
            en: [
                { name: 'Vodka', amount: '45ml' },
                { name: 'Tomato Juice', amount: '90ml' },
                { name: 'Lemon Juice', amount: '15ml' },
                { name: 'Worcestershire', amount: '2 dashes' },
                { name: 'Tabasco', amount: 'Top taste' }
            ],
            zh: [
                { name: '伏特加', amount: '45ml' },
                { name: '番茄汁', amount: '90ml' },
                { name: '檸檬汁', amount: '15ml' },
                { name: '伍斯特醬', amount: '2滴' },
                { name: '辣椒醬', amount: '適量' }
            ]
        },
        steps: {
            en: [
                'Roll ingredients back and forth with ice (do not shake).',
                'Strain into a highball glass over fresh ice.',
                'Garnish with celery stalk and lemon wedge.'
            ],
            zh: [
                '將材料加冰來回倒換（不要搖盪）。',
                '濾入裝有新冰的高球杯。',
                '裝飾芹菜棒和檸檬角。'
            ]
        },
        tags: {
            en: ['savory', 'spicy', 'brunch'],
            zh: ['鹹', '辣', '早午餐']
        },
        description: {
            en: 'A savory meal in a glass. The only socially acceptable way to drink vodka for breakfast.',
            zh: '喝得飽的調酒。唯一社會公認可以當早餐喝的伏特加特調。'
        },
        specs: {
            alcohol: 4,
            sweetness: 1,
            ease: 6
        },
        color: '#dc2626',
        image: 'https://uyamflgtvqndbjpbjito.supabase.co/storage/v1/object/public/cocktails/bloody-mary.png'
    },
    {
        id: 'gimlet',
        name: { en: 'Gimlet', zh: '吉姆雷特' },
        type: 'classic',
        baseSpirit: ['gin'],
        ingredients: {
            en: [
                { name: 'Gin', amount: '60ml' },
                { name: 'Lime Cordial', amount: '30ml' }
            ],
            zh: [
                { name: '琴酒', amount: '60ml' },
                { name: '莱姆汁', amount: '30ml' }
            ]
        },
        steps: {
            en: [
                'Stir ingredients with ice.',
                'Strain into a coupe glass.',
                'Garnish with a lime wheel.'
            ],
            zh: [
                '將材料加冰攪拌。',
                '濾入淺碟酒杯。',
                '裝飾檸檬片。'
            ]
        },
        tags: {
            en: ['sour', 'strong', 'classic'],
            zh: ['酸', '烈', '經典']
        },
        description: {
            en: 'Sharp, biting, and refreshing. A true test of balance.',
            zh: '銳利、咬舌、清爽。考驗調酒師平衡功力的試金石。'
        },
        specs: {
            alcohol: 8,
            sweetness: 4,
            ease: 8
        },
        color: '#bef264',
        image: 'https://uyamflgtvqndbjpbjito.supabase.co/storage/v1/object/public/cocktails/gimlet.png'
    },
    {
        id: 'tom-collins',
        name: { en: 'Tom Collins', zh: '湯姆柯林斯' },
        type: 'classic',
        baseSpirit: ['gin'],
        ingredients: {
            en: [
                { name: 'Gin', amount: '45ml' },
                { name: 'Lemon Juice', amount: '30ml' },
                { name: 'Sugar Syrup', amount: '15ml' },
                { name: 'Soda Water', amount: 'Top up' }
            ],
            zh: [
                { name: '琴酒', amount: '45ml' },
                { name: '檸檬汁', amount: '30ml' },
                { name: '糖漿', amount: '15ml' },
                { name: '氣泡水', amount: '加滿' }
            ]
        },
        steps: {
            en: [
                'Build in a highball glass with ice.',
                'Stir gin, lemon, and sugar.',
                'Top with soda and garnish with lemon slice.'
            ],
            zh: [
                '在高球杯中加冰直調。',
                '攪拌琴酒、檸檬汁和糖。',
                '加滿氣泡水，裝飾檸檬片。'
            ]
        },
        tags: {
            en: ['refreshing', 'fizzy', 'summer'],
            zh: ['清爽', '氣泡', '夏天']
        },
        description: {
            en: 'Lemonade for grown-ups. Tall, fizzy, and dangerously easy to down.',
            zh: '大人的檸檬氣泡水。酸甜氣泡感，危險地順口。'
        },
        specs: {
            alcohol: 5,
            sweetness: 5,
            ease: 9
        },
        color: '#fef9c3', // Lemonade
        image: 'https://uyamflgtvqndbjpbjito.supabase.co/storage/v1/object/public/cocktails/tom-collins.png'
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
            en: 'The absolute savior of a hot day. Cheap whisky, lots of ice, and zero judgement.',
            zh: '夏日的救贖。便宜威士忌、大量冰塊，沒有人會評判你。'
        },
        specs: {
            alcohol: 6,
            sweetness: 2,
            ease: 7
        },
        color: '#facc15',
        image: 'https://uyamflgtvqndbjpbjito.supabase.co/storage/v1/object/public/cocktails/highball-cvs.png',
        collections: ['cvs-hacks']
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
            en: 'Sounds illegal, tastes amazing. The Basque people knew what they were doing when they mixed red wine with Coke.',
            zh: '聽起來很母湯，喝起來很驚艷。巴斯克人懂喝，紅酒加可樂是天才的發明。'
        },
        specs: {
            alcohol: 4,
            sweetness: 8,
            ease: 10
        },
        color: '#7f1d1d',
        image: 'https://uyamflgtvqndbjpbjito.supabase.co/storage/v1/object/public/cocktails/kalimotxo.png',
        collections: ['cvs-hacks']
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
            en: 'Your daily dose of Vitamin C, now with 40% more bad decisions. The easiest cocktail known to man.',
            zh: '每日維他命C補充來源，外加40%的錯誤決定。世上最簡單的調酒。'
        },
        specs: {
            alcohol: 5,
            sweetness: 7,
            ease: 9
        },
        color: '#fb923c',
        image: 'https://uyamflgtvqndbjpbjito.supabase.co/storage/v1/object/public/cocktails/screwdriver.png',
        collections: ['cvs-hacks']
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
            en: 'The salaryman\'s fuel. Crisp, dry, and strong enough to wash away a long day of work.',
            zh: '社畜的燃料。乾爽、清脆，烈到足夠洗去一整天的疲憊。'
        },
        specs: {
            alcohol: 8,
            sweetness: 3,
            ease: 6
        },
        color: '#fef08a',
        image: 'https://uyamflgtvqndbjpbjito.supabase.co/storage/v1/object/public/cocktails/lemon-sour.png',
        collections: ['cvs-hacks']
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
            en: 'The universal language of "I want a drink and I want it now". Sweet, fizzy, and dependable.',
            zh: '「我現在就要喝一杯」的國際通用語言。甜、氣泡、絕對不雷。'
        },
        specs: {
            alcohol: 5,
            sweetness: 8,
            ease: 9
        },
        color: '#3f2c2c', // Dark cola
        image: 'https://uyamflgtvqndbjpbjito.supabase.co/storage/v1/object/public/cocktails/rum-coke.png',
        collections: ['cvs-hacks']
    },
    {
        id: 'white-russian',
        name: { en: 'White Russian', zh: '白色俄羅斯' },
        type: 'classic',
        baseSpirit: ['vodka', 'liqueur'],
        ingredients: {
            en: [
                { name: 'Vodka', amount: '50ml' },
                { name: 'Coffee Liqueur (Kahlua)', amount: '20ml' },
                { name: 'Heavy Cream', amount: '30ml' }
            ],
            zh: [
                { name: '伏特加', amount: '50ml' },
                { name: '咖啡香甜酒', amount: '20ml' },
                { name: '鮮奶油', amount: '30ml' }
            ]
        },
        steps: {
            en: [
                'Add vodka and coffee liqueur into a glass with ice.',
                'Float fresh cream on top.',
                'Stir slowly to create a swirl effect.'
            ],
            zh: [
                '將伏特加和咖啡酒倒入裝滿冰的杯中。',
                '在上層緩緩倒入鮮奶油。',
                '輕輕攪拌製造出美麗的雲霧紋路。'
            ]
        },
        tags: {
            en: ['creamy', 'sweet', 'classic'],
            zh: ['奶香', '甜', '經典']
        },
        description: {
            en: 'The Dude abides. A rich, creamy dessert that gets you drunk. Goes down like chocolate milk.',
            zh: '針對大人的咖啡牛奶。濃郁奶香讓你忘記它其實很烈。'
        },
        specs: {
            alcohol: 6,
            sweetness: 7,
            ease: 8
        },
        color: '#e7e5e4', // Warm stone/Cream
        image: 'https://uyamflgtvqndbjpbjito.supabase.co/storage/v1/object/public/cocktails/white-russian.png'
    },
    {
        id: 'mudslide',
        name: { en: 'Mudslide', zh: '土石流' },
        type: 'classic',
        baseSpirit: ['vodka', 'liqueur'],
        ingredients: {
            en: [
                { name: 'Vodka', amount: '30ml' },
                { name: 'Coffee Liqueur', amount: '30ml' },
                { name: 'Irish Cream (Baileys)', amount: '30ml' },
                { name: 'Heavy Cream', amount: '30ml' }
            ],
            zh: [
                { name: '伏特加', amount: '30ml' },
                { name: '咖啡香甜酒', amount: '30ml' },
                { name: '貝禮詩奶酒', amount: '30ml' },
                { name: '鮮奶油', amount: '30ml' }
            ]
        },
        steps: {
            en: [
                'Shake all ingredients with ice.',
                'Strain into a glass with fresh ice.',
                'Optional: Drizzle chocolate syrup inside the glass.'
            ],
            zh: [
                '將所有材料加冰搖盪均勻。',
                '濾冰倒入裝滿新冰的杯中。',
                '可選：在杯壁淋上巧克力醬裝飾。'
            ]
        },
        tags: {
            en: ['dessert', 'rich', 'sweet'],
            zh: ['甜點', '濃郁', '甜']
        },
        description: {
            en: 'Basically a boozy chocolate milkshake. If you like dessert and getting tipsy, this is your jam.',
            zh: '根本就是加了酒精的巧克力奶昔。甜點控的買醉首選。'
        },
        specs: {
            alcohol: 6,
            sweetness: 9,
            ease: 6
        },
        color: '#78350f', // Amber-900 (Chocolatey)
        image: 'https://uyamflgtvqndbjpbjito.supabase.co/storage/v1/object/public/cocktails/mudslide.png'
    },
    {
        id: 'b52',
        name: { en: 'B-52', zh: 'B-52 轟炸機' },
        type: 'classic',
        baseSpirit: ['liqueur'],
        ingredients: {
            en: [
                { name: 'Coffee Liqueur', amount: '1/3 part' },
                { name: 'Irish Cream', amount: '1/3 part' },
                { name: 'Grand Marnier', amount: '1/3 part' }
            ],
            zh: [
                { name: '咖啡香甜酒', amount: '1/3 等份' },
                { name: '貝禮詩奶酒', amount: '1/3 等份' },
                { name: '柑橘酒 (Grand Marnier)', amount: '1/3 等份' }
            ]
        },
        steps: {
            en: [
                'Layer ingredients carefully into a shot glass.',
                'Order: Coffee Liqueur -> Irish Cream -> Grand Marnier.',
                'Pour slowly over the back of a spoon.'
            ],
            zh: [
                '將材料小心分層倒入 Shot 杯。',
                '順序：咖啡酒 -> 奶酒 -> 柑橘酒。',
                '使用吧叉匙背面緩衝，慢慢倒入。'
            ]
        },
        tags: {
            en: ['shot', 'layer', 'party'],
            zh: ['一口酒', '分層', '派對']
        },
        description: {
            en: 'A tri-colored jet fuel shot. Sweet, creamy, and guaranteed to start (or end) the party.',
            zh: '三色分層的液體燃料。甜、奶、烈，派對的開始（或結束）都靠它。'
        },
        specs: {
            alcohol: 7,
            sweetness: 9,
            ease: 4
        },
        color: '#f59e0b', // Amber-500
        image: 'https://uyamflgtvqndbjpbjito.supabase.co/storage/v1/object/public/cocktails/b52.png'
    },

    // CVS Beer Series
    {
        id: 'shandy',
        name: { en: 'Shandy / Radler', zh: '雪碧啤酒 (Radler)' },
        type: 'cvs',
        baseSpirit: ['beer'],
        ingredients: {
            en: [
                { name: 'Lager Beer', amount: '50%' },
                { name: 'Sprite / 7-Up', amount: '50%' },
                { name: 'Lemon', amount: 'Garnish' }
            ],
            zh: [
                { name: '拉格啤酒', amount: '50%' },
                { name: '雪碧', amount: '50%' },
                { name: '檸檬', amount: '裝飾' }
            ]
        },
        steps: {
            en: [
                'Fill a chilled glass halfway with beer.',
                'Top with Sprite.',
                'Garnish with a lemon slice for freshness.'
            ],
            zh: [
                '將冰鎮的杯子倒一半啤酒。',
                '加滿雪碧。',
                '放上一片檸檬增加清爽感。'
            ]
        },
        tags: {
            en: ['refreshing', 'light', 'summer'],
            zh: ['清爽', '低酒精', '夏天']
        },
        description: {
            en: 'The ultimate thirst quencher. Lower alcohol, maximum refreshment.',
            zh: '終極解渴聖品。低酒精，最大程度的清爽。'
        },
        specs: {
            alcohol: 3,
            sweetness: 6,
            ease: 10
        },
        color: '#facc15', // Yellow-400
        image: 'https://uyamflgtvqndbjpbjito.supabase.co/storage/v1/object/public/cocktails/shandy.png',
        collections: ['cvs-hacks']
    },
    {
        id: 'somaek',
        name: { en: 'Somaek (Soju Bomb)', zh: '燒啤 (燒酒炸彈)' },
        type: 'cvs',
        baseSpirit: ['beer'],
        ingredients: {
            en: [
                { name: 'Lager Beer', amount: '70%' },
                { name: 'Soju', amount: '30%' }
            ],
            zh: [
                { name: '啤酒', amount: '70%' },
                { name: '韓國燒酒', amount: '30%' }
            ]
        },
        steps: {
            en: [
                'Pour beer into a glass until 70% full.',
                'Drop a shot glass of soju into the beer.',
                'Or just mix them. Tap the bottom with a spoon to make it fizz.'
            ],
            zh: [
                '將啤酒倒入杯中至七分滿。',
                '將一小杯燒酒丟入啤酒中 (炸彈)。',
                '或者直接混合。用湯匙敲擊杯底讓氣泡噴發。'
            ]
        },
        tags: {
            en: ['party', 'strong', 'korean'],
            zh: ['派對', '混酒', '韓式']
        },
        description: {
            en: 'The legendary Korean party starter. "One shot!"',
            zh: '韓國派對傳奇開場酒。「乾杯！」'
        },
        specs: {
            alcohol: 8,
            sweetness: 3,
            ease: 8
        },
        color: '#fbbf24', // Amber-400
        image: 'https://uyamflgtvqndbjpbjito.supabase.co/storage/v1/object/public/cocktails/somaek.png',
        collections: ['cvs-hacks']
    },
    {
        id: 'red-eye',
        name: { en: 'Red Eye', zh: '紅眼' },
        type: 'cvs',
        baseSpirit: ['beer'],
        ingredients: {
            en: [
                { name: 'Lager Beer', amount: '50%' },
                { name: 'Tomato Juice', amount: '50%' },
                { name: 'Lemon Juice', amount: 'Dash' }
            ],
            zh: [
                { name: '啤酒', amount: '50%' },
                { name: '番茄汁 (可果美)', amount: '50%' },
                { name: '檸檬汁', amount: '少許' }
            ]
        },
        steps: {
            en: [
                'Fill a glass with ice.',
                'Pour tomato juice and beer simultaneously.',
                'Add a dash of lemon juice or Tabasco if you dare.'
            ],
            zh: [
                '杯中加冰。',
                '同時倒入番茄汁和啤酒。',
                '加點檸檬汁，膽子大的可以加 Tabasco。'
            ]
        },
        tags: {
            en: ['savory', 'hangover', 'unique'],
            zh: ['鹹', '解宿醉', '獨特']
        },
        description: {
            en: 'A classic hangover cure. Sounds weird, tastes good.',
            zh: '經典解宿醉良方。聽起來很怪，但意外好喝。'
        },
        specs: {
            alcohol: 4,
            sweetness: 2,
            ease: 9
        },
        color: '#ef4444', // Red-500
        image: 'https://uyamflgtvqndbjpbjito.supabase.co/storage/v1/object/public/cocktails/kalimotxo.png' // Placeholder reused
    },
    {
        id: 'calpis-beer',
        name: { en: 'Calpis Beer', zh: '可爾必思啤酒' },
        type: 'cvs',
        baseSpirit: ['beer'],
        ingredients: {
            en: [
                { name: 'Lager Beer', amount: '80%' },
                { name: 'Calpis Water/Concentrate', amount: '20%' }
            ],
            zh: [
                { name: '啤酒', amount: '80%' },
                { name: '可爾必思', amount: '20%' }
            ]
        },
        steps: {
            en: [
                'Pour cold beer into a glass.',
                'Add Calpis slowly and stir.',
                'Enjoy the creamy foam.'
            ],
            zh: [
                '將冰啤酒倒入杯中。',
                '緩緩加入可爾必思並攪拌。',
                '享受綿密的泡沫。'
            ]
        },
        tags: {
            en: ['sweet', 'creamy', 'easy'],
            zh: ['甜', '綿密', '簡單']
        },
        description: {
            en: 'Double cultured delight. Sweet and sour perfection.',
            zh: '雙重發酵的美味。酸甜適中的完美組合。'
        },
        specs: {
            alcohol: 4,
            sweetness: 7,
            ease: 10
        },
        color: '#fef9c3', // Yellow-100 (Pale creamy)
        image: 'https://uyamflgtvqndbjpbjito.supabase.co/storage/v1/object/public/cocktails/shandy.png' // Placeholder reused
    }
    ,
    // CVS Gin & Tequila
    {
        id: 'gin-tea',
        name: { en: 'Gin & Tea', zh: '茶琴 (Tea Gin)' },
        type: 'cvs',
        baseSpirit: ['gin'],
        ingredients: {
            en: [
                { name: 'Gin', amount: '45ml' },
                { name: 'Oolong/Green Tea (Bottled)', amount: 'Top up' }
            ],
            zh: [
                { name: '琴酒', amount: '45ml' },
                { name: '烏龍茶或綠茶 (瓶裝)', amount: '加滿' }
            ]
        },
        steps: {
            en: [
                'Fill glass with ice.',
                'Pour gin.',
                'Top with cold tea. No sugar needed.'
            ],
            zh: [
                '杯中裝滿冰塊。',
                '倒入琴酒。',
                '加滿冰茶。推薦無糖茶。'
            ]
        },
        tags: {
            en: ['tea', 'refreshing', 'easy'],
            zh: ['茶香', '清爽', '簡單']
        },
        description: {
            en: 'Who said convenience store drinks can\'t be classy? The botanicals in gin actually love tea.',
            zh: '誰說超商調酒不能很優雅？琴酒的草本香氣跟茶根本是天生一對。'
        },
        specs: {
            alcohol: 6,
            sweetness: 1,
            ease: 10
        },
        color: '#d97706', // Amber-600
        image: 'https://uyamflgtvqndbjpbjito.supabase.co/storage/v1/object/public/cocktails/gin-tea.png',
        collections: ['cvs-hacks']
    },
    {
        id: 'gin-cc',
        name: { en: 'Gin & CC Lemon', zh: '琴酒檸檬氣泡' },
        type: 'cvs',
        baseSpirit: ['gin'],
        ingredients: {
            en: [
                { name: 'Gin', amount: '45ml' },
                { name: 'CC Lemon / Lemon Soda', amount: 'Top up' }
            ],
            zh: [
                { name: '琴酒', amount: '45ml' },
                { name: 'CC檸檬 / 檸檬汽水', amount: '加滿' }
            ]
        },
        steps: {
            en: [
                'Ice in glass.',
                'Gin in glass.',
                'CC Lemon in glass. Done.'
            ],
            zh: [
                '冰塊進杯子。',
                '琴酒進杯子。',
                'CC檸檬倒滿。搞定。'
            ]
        },
        tags: {
            en: ['sweet', 'sour', 'fizzy'],
            zh: ['酸甜', '氣泡', '維他命C']
        },
        description: {
            en: 'Budget Gin Fizz. It shouldn\'t work this well, but it does. Sweet, citrusy, and dangerously chuggable.',
            zh: '低配版 Gin Fizz。好喝到不科學。酸甜氣泡感，小心喝太快。'
        },
        specs: {
            alcohol: 5,
            sweetness: 8,
            ease: 10
        },
        color: '#facc15', // Yellow-400
        image: 'https://uyamflgtvqndbjpbjito.supabase.co/storage/v1/object/public/cocktails/gin-cc.png',
        collections: ['cvs-hacks']
    },
    {
        id: 'tequila-coke',
        name: { en: 'Batanga (Tequila Coke)', zh: '巴坦加 (龍舌蘭可樂)' },
        type: 'cvs',
        baseSpirit: ['tequila'],
        ingredients: {
            en: [
                { name: 'Tequila', amount: '50ml' },
                { name: 'Coca-Cola', amount: 'Top up' },
                { name: 'Lime Juice', amount: '15ml' }
            ],
            zh: [
                { name: '龍舌蘭', amount: '50ml' },
                { name: '可樂', amount: '加滿' },
                { name: '檸檬汁', amount: '15ml' }
            ]
        },
        steps: {
            en: [
                'Salt the rim if you feel fancy.',
                'Ice, Tequila, Lime Juice.',
                'Top with Coke and stir with a knife (tradition).'
            ],
            zh: [
                '杯口抹鹽 (如果想講究一點)。',
                '加冰、龍舌蘭、檸檬汁。',
                '加滿可樂。據傳統要用餐刀攪拌。'
            ]
        },
        tags: {
            en: ['party', 'sweet', 'classic'],
            zh: ['派對', '甜', '經典']
        },
        description: {
            en: 'The Batanga. Mexico\'s answer to the Rum & Coke, but with more attitude. Stir with a knife for authenticity.',
            zh: '墨西哥版可樂調酒 (Batanga)。比蘭姆可樂更有個性。想道地一點，請用牛排刀攪拌。'
        },
        specs: {
            alcohol: 6,
            sweetness: 8,
            ease: 9
        },
        color: '#3f2c2c', // Dark cola
        image: 'https://uyamflgtvqndbjpbjito.supabase.co/storage/v1/object/public/cocktails/tequila-coke.png',
        collections: ['cvs-hacks']
    },
    {
        id: 'tequila-cider',
        name: { en: 'Tequila Cider', zh: '龍舌蘭蘋果酒' },
        type: 'cvs',
        baseSpirit: ['tequila'],
        ingredients: {
            en: [
                { name: 'Tequila', amount: '45ml' },
                { name: 'Apple Cider (Somersby etc)', amount: 'Top up' }
            ],
            zh: [
                { name: '龍舌蘭', amount: '45ml' },
                { name: '蘋果酒 (Somersby等)', amount: '加滿' }
            ]
        },
        steps: {
            en: [
                'Fill a glass with ice.',
                'Pour tequila.',
                'Top with apple cider.'
            ],
            zh: [
                '杯中裝滿冰塊。',
                '倒入龍舌蘭。',
                '加滿蘋果酒。'
            ]
        },
        tags: {
            en: ['fruity', 'sweet', 'autumn'],
            zh: ['果味', '甜', '妹酒']
        },
        description: {
            en: 'A fruity trap. Tastes like apple juice, hits like a truck. You have been warned.',
            zh: '妹酒陷阱。喝起來像蘋果汁，尻下去像被卡車撞。後勁請小心。'
        },
        specs: {
            alcohol: 7,
            sweetness: 8,
            ease: 10
        },
        color: '#fcd34d', // Amber-300
        image: 'https://uyamflgtvqndbjpbjito.supabase.co/storage/v1/object/public/cocktails/tequila-cider.png',
        collections: ['cvs-hacks']
    }
    ,
    // CVS Brandy & Liqueur & others
    {
        id: 'brandy-sidra',
        name: { en: 'Brandy Sidra', zh: '白蘭地蘋果西打' },
        type: 'cvs',
        baseSpirit: ['brandy'],
        ingredients: {
            en: [
                { name: 'Brandy', amount: '45ml' },
                { name: 'Apple Sidra (Taiwanese Soda)', amount: 'Top up' }
            ],
            zh: [
                { name: '白蘭地', amount: '45ml' },
                { name: '蘋果西打', amount: '加滿' }
            ]
        },
        steps: {
            en: [
                'Fill a glass with ice.',
                'Pour brandy.',
                'Top with Apple Sidra.',
                'The "Champagne of Taiwan".'
            ],
            zh: [
                '杯中裝滿冰塊。',
                '倒入白蘭地。',
                '加滿蘋果西打。',
                '這就是台灣人的香檳。'
            ]
        },
        tags: {
            en: ['sweet', 'sparkling', 'taiwanese'],
            zh: ['甜', '氣泡', '台式經典']
        },
        description: {
            en: 'Taiwanese uncle style. The "Champagne of Taiwan" (Apple Sidra) makes brandy surprisingly drinkable.',
            zh: '台式叔叔風格。「台灣香檳」(蘋果西打) 讓白蘭地變得意外順口。'
        },
        specs: {
            alcohol: 5,
            sweetness: 8,
            ease: 10
        },
        color: '#ca8a04', // Yellow-600
        image: 'https://uyamflgtvqndbjpbjito.supabase.co/storage/v1/object/public/cocktails/brandy-sidra.png',
        collections: ['cvs-hacks']
    },
    {
        id: 'baileys-milktea',
        name: { en: 'Baileys Milk Tea', zh: '貝禮詩奶茶' },
        type: 'cvs',
        baseSpirit: ['liqueur'],
        ingredients: {
            en: [
                { name: 'Baileys', amount: '50ml' },
                { name: 'Milk Tea (Minechine/Assam)', amount: 'Top up' }
            ],
            zh: [
                { name: '貝禮詩奶酒', amount: '50ml' },
                { name: '麥香/阿薩姆奶茶', amount: '加滿' }
            ]
        },
        steps: {
            en: [
                'Ice in glass.',
                'Pour Baileys.',
                'Add convenience store milk tea.',
                'Hot or cold both work wonders.'
            ],
            zh: [
                '加冰塊 (熱喝也可以)。',
                '倒入奶酒。',
                '加入超商奶茶。',
                '冬天微波加熱喝更是極品。'
            ]
        },
        tags: {
            en: ['sweet', 'creamy', 'comfort'],
            zh: ['甜', '奶香', '療癒']
        },
        description: {
            en: 'Bubble tea for the broken-hearted. Or just for a cozy night in. Sweet, creamy, and comforting.',
            zh: '給傷心人的珍珠奶茶（雖然沒有珍珠）。甜、奶、療癒，在家買醉首選。'
        },
        specs: {
            alcohol: 4,
            sweetness: 10,
            ease: 10
        },
        color: '#a16207', // Brown
        image: 'https://uyamflgtvqndbjpbjito.supabase.co/storage/v1/object/public/cocktails/baileys-milktea.png',
        collections: ['cvs-hacks']
    },

    {
        id: 'hot-toddy',
        name: { en: 'Hot Toddy', zh: '熱托迪' },
        type: 'classic',
        baseSpirit: ['whiskey'],
        ingredients: {
            en: [
                { name: 'Whiskey', amount: '60ml' },
                { name: 'Honey', amount: '20ml' },
                { name: 'Lemon Juice', amount: '15ml' },
                { name: 'Hot Water', amount: 'Top up' }
            ],
            zh: [
                { name: '威士忌', amount: '60ml' },
                { name: '蜂蜜', amount: '20ml' },
                { name: '檸檬汁', amount: '15ml' },
                { name: '熱水', amount: '加滿' }
            ]
        },
        steps: {
            en: [
                'Combine spirits, honey, and lemon juice in a mug.',
                'Top with hot water and stir until honey is dissolved.',
                'Garnish with a lemon wheel or cinnamon stick.'
            ],
            zh: [
                '將烈酒、蜂蜜和檸檬汁加入馬克杯中。',
                '注入熱水並攪拌至蜂蜜溶解。',
                '以檸檬片或肉桂棒裝飾。'
            ]
        },
        tags: {
            en: ['hot', 'soothing', 'winter'],
            zh: ['熱', '暖身', '冬天']
        },
        description: {
            en: 'A soothing hot drink perfect for cold nights.',
            zh: '寒冷夜晚的最佳暖身飲品。'
        },
        specs: {
            alcohol: 5,
            sweetness: 6,
            ease: 10
        },
        color: '#f59e0b', // Amber-500
        image: 'https://uyamflgtvqndbjpbjito.supabase.co/storage/v1/object/public/cocktails/hot-toddy.png',
        collections: ['winter-warmers']
    },
    {
        id: 'mulled-wine',
        name: { en: 'Mulled Wine', zh: '熱紅酒' },
        type: 'classic',
        baseSpirit: ['wine'],
        ingredients: {
            en: [
                { name: 'Red Wine', amount: '150ml' },
                { name: 'Spices (Cinnamon, Clove)', amount: '1 stick/3 pc' },
                { name: 'Orange Slices', amount: '2' },
                { name: 'Sugar/Honey', amount: '1 tsp' }
            ],
            zh: [
                { name: '紅酒', amount: '150ml' },
                { name: '香料 (肉桂, 丁香)', amount: '1根/3顆' },
                { name: '柳橙片', amount: '2片' },
                { name: '糖/蜂蜜', amount: '1茶匙' }
            ]
        },
        steps: {
            en: [
                'Combine all ingredients in a saucepan.',
                'Simmer gently on low heat (do not boil) for 10-15 mins.',
                'Serve warm in a mug.'
            ],
            zh: [
                '將所有材料放入鍋中。',
                '小火慢煮（不要煮沸）10-15分鐘。',
                '倒入馬克杯中趁熱享用。'
            ]
        },
        tags: {
            en: ['hot', 'spicy', 'wine', 'cny'],
            zh: ['熱', '香料', '紅酒', '過年']
        },
        description: {
            en: 'Warm, spiced wine, traditionally served during holidays.',
            zh: '溫暖的香料紅酒，節日必備。'
        },
        specs: {
            alcohol: 4,
            sweetness: 6,
            ease: 7
        },
        color: '#be123c', // Rose-700
        image: 'https://uyamflgtvqndbjpbjito.supabase.co/storage/v1/object/public/cocktails/mulled-wine.png',
        collections: ['winter-warmers']
    },
    {
        id: 'irish-coffee',
        name: { en: 'Irish Coffee', zh: '愛爾蘭咖啡' },
        type: 'classic',
        baseSpirit: ['whiskey'],
        ingredients: {
            en: [
                { name: 'Irish Whiskey', amount: '50ml' },
                { name: 'Hot Coffee', amount: '120ml' },
                { name: 'Brown Sugar', amount: '1-2 tsp' },
                { name: 'Heavy Cream', amount: 'Top' }
            ],
            zh: [
                { name: '愛爾蘭威士忌', amount: '50ml' },
                { name: '熱咖啡', amount: '120ml' },
                { name: '紅糖', amount: '1-2茶匙' },
                { name: '鮮奶油', amount: '適量' }
            ]
        },
        steps: {
            en: [
                'Fill mug with hot water to preheat, then empty.',
                'Pour hot coffee and dissolved sugar into the mug.',
                'Stir in whiskey.',
                'Float whipped cream on top.'
            ],
            zh: [
                '先用熱水溫杯，然後倒掉。',
                '在杯中加入熱咖啡和糖攪拌溶解。',
                '加入威士忌。',
                '在上方輕輕鋪上一層鮮奶油。'
            ]
        },
        tags: {
            en: ['hot', 'coffee', 'rich'],
            zh: ['熱', '咖啡', '濃郁']
        },
        description: {
            en: 'The classic combination of coffee and whiskey.',
            zh: '咖啡與威士忌的經典結合。'
        },
        specs: {
            alcohol: 6,
            sweetness: 5,
            ease: 6
        },
        color: '#451a03', // Amber-950
        image: 'https://uyamflgtvqndbjpbjito.supabase.co/storage/v1/object/public/cocktails/irish-coffee.png',
        collections: ['winter-warmers']
    },
    {
        id: 'hot-buttered-rum',
        name: { en: 'Hot Buttered Rum', zh: '熱奶油蘭姆酒' },
        type: 'classic',
        baseSpirit: ['rum'],
        ingredients: {
            en: [
                { name: 'Aged Rum', amount: '60ml' },
                { name: 'Butter', amount: '1 tbsp' },
                { name: 'Brown Sugar', amount: '1 tsp' },
                { name: 'Hot Water', amount: 'Top up' },
                { name: 'Spices (Cinnamon, Nutmeg)', amount: 'Pinch' }
            ],
            zh: [
                { name: '陳年蘭姆酒', amount: '60ml' },
                { name: '奶油', amount: '1大匙' },
                { name: '紅糖', amount: '1茶匙' },
                { name: '熱水', amount: '加滿' },
                { name: '香料 (肉桂, 豆蔻)', amount: '少許' }
            ]
        },
        steps: {
            en: [
                'Muddle butter, sugar, and spices in a mug.',
                'Add rum and top with hot water.',
                'Stir until butter is melted and incorporated.',
                'Garnish with a cinnamon stick.'
            ],
            zh: [
                '在馬克杯中混合奶油、糖和香料。',
                '加入蘭姆酒並注入熱水。',
                '攪拌至奶油融化並融合。',
                '用肉桂棒裝飾。'
            ]
        },
        tags: {
            en: ['hot', 'creamy', 'winter', 'savory'],
            zh: ['熱', '綿密', '冬天', '鹹甜']
        },
        description: {
            en: 'Rich, buttery, and comforting. A hug in a mug.',
            zh: '濃郁奶油香，喝一口就像被擁抱的溫暖。'
        },
        specs: {
            alcohol: 5,
            sweetness: 7,
            ease: 8
        },
        color: '#d97706', // Amber-600
        image: 'https://uyamflgtvqndbjpbjito.supabase.co/storage/v1/object/public/cocktails/hot-buttered-rum.png',
        collections: ['winter-warmers']
    },
    {
        id: 'eggnog',
        name: { en: 'Eggnog', zh: '蛋酒' },
        type: 'classic',
        baseSpirit: ['brandy', 'rum'],
        ingredients: {
            en: [
                { name: 'Brandy/Rum', amount: '60ml' },
                { name: 'Milk', amount: '60ml' },
                { name: 'Heavy Cream', amount: '30ml' },
                { name: 'Egg Yolk', amount: '1' },
                { name: 'Sugar', amount: '1 tbsp' }
            ],
            zh: [
                { name: '白蘭地/蘭姆酒', amount: '60ml' },
                { name: '牛奶', amount: '60ml' },
                { name: '鮮奶油', amount: '30ml' },
                { name: '蛋黃', amount: '1顆' },
                { name: '糖', amount: '1大匙' }
            ]
        },
        steps: {
            en: [
                'Shake egg yolk, sugar, milk, and cream with ice.',
                'Add spirit and shake again.',
                'Strain into a glass.',
                'Dust with freshly grated nutmeg.'
            ],
            zh: [
                '將蛋黃、糖、牛奶和鮮奶油加冰搖盪。',
                '加入烈酒再次搖盪。',
                '濾入杯中。',
                '撒上現磨豆蔻粉。'
            ]
        },
        tags: {
            en: ['creamy', 'christmas', 'rich'],
            zh: ['濃郁', '聖誕', '奶香']
        },
        description: {
            en: 'The quintessential Christmas drink.',
            zh: '聖誕節的代名詞，濃郁香甜。'
        },
        specs: {
            alcohol: 6,
            sweetness: 8,
            ease: 6
        },
        color: '#fef3c7', // Amber-100
        image: 'https://uyamflgtvqndbjpbjito.supabase.co/storage/v1/object/public/cocktails/eggnog.png',
        collections: ['winter-warmers']
    },
    {
        id: 'baileys-hot-chocolate',
        name: { en: 'Baileys Hot Chocolate', zh: '貝禮詩熱可可' },
        type: 'classic',
        baseSpirit: ['liqueur'],
        ingredients: {
            en: [
                { name: 'Baileys Irish Cream', amount: '50ml' },
                { name: 'Hot Chocolate', amount: '150ml' },
                { name: 'Whipped Cream', amount: 'Top' },
                { name: 'Marshmallows', amount: 'Optional' }
            ],
            zh: [
                { name: '貝禮詩奶酒', amount: '50ml' },
                { name: '熱可可', amount: '150ml' },
                { name: '鮮奶油', amount: '適量' },
                { name: '棉花糖', amount: '選用' }
            ]
        },
        steps: {
            en: [
                'Prepare your favorite hot chocolate.',
                'Stir in Baileys.',
                'Top generously with whipped cream and marshmallows.',
                'Drizzle with chocolate sauce if desired.'
            ],
            zh: [
                '準備一杯熱可可。',
                '加入貝禮詩奶酒攪拌。',
                '擠上大量鮮奶油並放上棉花糖。',
                '可淋上巧克力醬。'
            ]
        },
        tags: {
            en: ['hot', 'sweet', 'chocolaty', 'dessert'],
            zh: ['熱', '甜', '巧克力', '甜點']
        },
        description: {
            en: 'Indulgent, sweet, and warming. The ultimate winter treat.',
            zh: '極致的甜蜜與溫暖，冬日最棒的享受。'
        },
        specs: {
            alcohol: 3,
            sweetness: 10,
            ease: 10
        },
        color: '#3f2c22', // Chocolate
        image: 'https://uyamflgtvqndbjpbjito.supabase.co/storage/v1/object/public/cocktails/baileys-hot-chocolate.png',
        collections: ['winter-warmers']
    },
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
        image: 'https://uyamflgtvqndbjpbjito.supabase.co/storage/v1/object/public/cocktails/whiskey-oolong.png',
        collections: ['cvs-hacks']
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
            en: 'The fuel for your night out. Electrifying and sweet.',
            zh: '夜晚的燃料。充滿電力的口感，讓你精神百倍。'
        },
        specs: { alcohol: 5, sweetness: 8, ease: 10 },
        color: '#bef264', // lime-300
        image: 'https://uyamflgtvqndbjpbjito.supabase.co/storage/v1/object/public/cocktails/vodka-energy.png',
        collections: ['cvs-hacks']
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
            en: 'The "Sportsman\'s" drink. Gin botanicals meet grapefruit ions. Surprisingly refreshing after a workout (or before one).',
            zh: '「運動員」專屬。琴酒草本香遇上寶礦力柚子味。運動完（或運動前）喝，意外清爽。'
        },
        specs: { alcohol: 4, sweetness: 5, ease: 10 },
        color: '#e0f2fe', // sky-100
        image: 'https://uyamflgtvqndbjpbjito.supabase.co/storage/v1/object/public/cocktails/gin-sports.png',
        collections: ['cvs-hacks']
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
        image: 'https://uyamflgtvqndbjpbjito.supabase.co/storage/v1/object/public/cocktails/lemon-tea-whiskey.png',
        collections: ['cvs-hacks']
    },
    {
        id: 'kaoliang-yakult',
        name: { en: 'Kaoliang & Yakult', zh: '高粱養樂多' },
        type: 'cvs',
        baseSpirit: ['kaoliang'],
        ingredients: {
            en: [{ name: 'Kaoliang Liquor (58%)', amount: '1 part' }, { name: 'Yakult', amount: '4 parts' }, { name: 'Lemon Juice', amount: 'Splash (Optional)' }],
            zh: [{ name: '58度高粱酒', amount: '1份' }, { name: '養樂多', amount: '4份' }, { name: '檸檬汁', amount: '少許 (選填)' }]
        },
        steps: {
            en: ['Fill a glass with ice.', 'Pour Kaoliang liquor.', 'Top with Yakult.', 'Stir well.'],
            zh: ['杯中裝滿冰塊。', '倒入高粱酒。', '加滿養樂多。', '攪拌均勻。']
        },
        tags: { en: ['cvs', 'local', 'creamy'], zh: ['超商', '台式', '濃郁'] },
        description: { en: 'The legendary "White Water" mix. Yakult miraculously tames the Kaoliang fire. A right of passage.', zh: '傳說中的「白水」。養樂多奇蹟般地馴服了高粱的嗆辣。台灣人的成年禮。' },
        specs: { alcohol: 7, sweetness: 8, ease: 10 },
        color: '#fefce8',
        image: 'https://uyamflgtvqndbjpbjito.supabase.co/storage/v1/object/public/cocktails/kaoliang-yakult.png',
        collections: ['cvs-hacks']
    },
    {
        id: 'guava-gin',
        name: { en: 'Gin & Guava', zh: '芭樂琴酒' },
        type: 'cvs',
        baseSpirit: ['gin'],
        ingredients: {
            en: [{ name: 'Gin', amount: '45ml' }, { name: 'Guava Juice', amount: 'Top up' }],
            zh: [{ name: '琴酒', amount: '45ml' }, { name: '芭樂汁', amount: '加滿' }]
        },
        steps: {
            en: ['Fill glass with ice.', 'Add Gin.', 'Top with sweet Guava juice.', 'Stir.'],
            zh: ['杯中加冰。', '加入琴酒。', '倒滿芭樂汁', '攪拌。']
        },
        tags: { en: ['cvs', 'fruity', 'sweet'], zh: ['超商', '果香', '甜'] },
        description: { en: 'The herbal notes of Gin pair surprisingly well with the tropical sweetness of Guava.', zh: '琴酒的草本香氣與芭樂的熱帶甜味意外地搭。' },
        specs: { alcohol: 5, sweetness: 7, ease: 10 },
        color: '#bef264',
        image: 'https://uyamflgtvqndbjpbjito.supabase.co/storage/v1/object/public/cocktails/guava-gin.png',
        collections: ['cvs-hacks']
    },
    {
        id: 'rum-guava',
        name: { en: 'Rum & Guava', zh: '蘭姆芭樂' },
        type: 'cvs',
        baseSpirit: ['rum'],
        ingredients: {
            en: [{ name: 'White Rum', amount: '45ml' }, { name: 'Guava Juice', amount: 'Top up' }, { name: 'Lemon', amount: 'Wedge' }],
            zh: [{ name: '白蘭姆酒', amount: '45ml' }, { name: '芭樂汁', amount: '加滿' }, { name: '檸檬', amount: '切角' }]
        },
        steps: {
            en: ['Ice in glass.', 'Pour Rum.', 'Fill with Guava juice.', 'Squeeze lemon.'],
            zh: ['杯中加冰。', '倒入蘭姆酒。', '加滿芭樂汁。', '擠入檸檬汁。']
        },
        tags: { en: ['cvs', 'tropical', 'sweet'], zh: ['超商', '熱帶', '甜'] },
        description: { en: 'Taiwanese banquet style. The lemon makes it pop.', zh: '台式辦桌風味。加了檸檬之後層次完全不同。' },
        specs: { alcohol: 5, sweetness: 7, ease: 10 },
        color: '#bef264',
        image: 'https://uyamflgtvqndbjpbjito.supabase.co/storage/v1/object/public/cocktails/rum-guava.png',
        collections: ['cvs-hacks']
    },
    {
        id: 'sake-calpis',
        name: { en: 'Sake Calpis', zh: '可爾必思清酒' },
        type: 'cvs',
        baseSpirit: ['sake'],
        ingredients: {
            en: [{ name: 'Sake', amount: '1 part' }, { name: 'Calpis Water', amount: '1 part' }],
            zh: [{ name: '清酒', amount: '1份' }, { name: '可爾必思水', amount: '1份' }]
        },
        steps: {
            en: ['Mix equal parts Sake and Calpis in a glass with ice.'],
            zh: ['在裝冰的杯中混合等量的清酒和可爾必思。']
        },
        tags: { en: ['cvs', 'milky', 'low-abv'], zh: ['超商', '乳酸', '低酒精'] },
        description: { en: 'Calpis makes everything better. A smooth, milky delight that goes down way too easy.', zh: '可爾必思救贖一切。綿密順口的乳酸滋味，不小心就會喝太快。' },
        specs: { alcohol: 4, sweetness: 8, ease: 10 },
        color: '#ffffff',
        image: 'https://uyamflgtvqndbjpbjito.supabase.co/storage/v1/object/public/cocktails/sake-calpis.png',
        collections: ['cvs-hacks']
    },
    {
        id: 'sarsaparilla-whiskey',
        name: { en: 'Sarsaparilla Highball', zh: '沙士威士忌' },
        type: 'cvs',
        baseSpirit: ['whiskey'],
        ingredients: {
            en: [{ name: 'Whiskey', amount: '45ml' }, { name: 'Sarsaparilla (Root Beer)', amount: 'Top up' }],
            zh: [{ name: '威士忌', amount: '45ml' }, { name: '黑松沙士', amount: '加滿' }]
        },
        steps: {
            en: ['Ice in glass.', 'Add whisky.', 'Fill with Sarsaparilla.', 'Briefly stir.'],
            zh: ['杯中加冰。', '加入威士忌。', '加滿沙士。', '稍微攪拌。']
        },
        tags: { en: ['cvs', 'bubbly', 'classic'], zh: ['超商', '氣泡', '經典'] },
        description: { en: 'A Taiwanese staple. The herbal root beer notes merge with whisky barrel spices. Trust us, it works.', zh: '台灣特有人情味。沙士的草本香與威士忌的木桶味完美融合。相信我，這真的很搭。' },
        specs: { alcohol: 5, sweetness: 6, ease: 10 },
        color: '#713f12',
        image: 'https://uyamflgtvqndbjpbjito.supabase.co/storage/v1/object/public/cocktails/sarsaparilla-whiskey.png',
        collections: ['cvs-hacks']
    },
    {
        id: 'soju-melona',
        name: { en: 'Soju Melona', zh: '燒酒哈密瓜冰棒' },
        type: 'cvs',
        baseSpirit: ['soju'],
        ingredients: {
            en: [{ name: 'Soju (Original)', amount: '60ml' }, { name: 'Sprite/Cider', amount: '60ml' }, { name: 'Melona Ice Bar', amount: '1 whole' }],
            zh: [{ name: '原味燒酒', amount: '60ml' }, { name: '雪碧/七喜', amount: '60ml' }, { name: '哈密瓜冰棒', amount: '1支' }]
        },
        steps: {
            en: ['Put the ice bar into a large glass.', 'Pour Soju and Sprite over it.', 'Use the stick to stir as it melts.'],
            zh: ['將冰棒放入大杯中。', '倒入燒酒和雪碧。', '用冰棒棍攪拌讓其融化。']
        },
        tags: { en: ['cvs', 'fun', 'creamy'], zh: ['超商', '好玩', '濃郁'] },
        description: { en: 'A popular Korean party drink. The melting creamsicle makes it rich and sweet.', zh: '韓國流行的派對喝法。融化的冰棒讓口感變得濃郁香甜。' },
        specs: { alcohol: 6, sweetness: 9, ease: 8 },
        color: '#86efac',
        image: 'https://uyamflgtvqndbjpbjito.supabase.co/storage/v1/object/public/cocktails/soju-melona.png',
        collections: ['cvs-hacks']
    },
    {
        id: 'vodka-yakult',
        name: { en: 'Vodka Yakult', zh: '伏特加養樂多' },
        type: 'cvs',
        baseSpirit: ['vodka'],
        ingredients: {
            en: [{ name: 'Vodka', amount: '45ml' }, { name: 'Yakult', amount: '2-3 bottles' }],
            zh: [{ name: '伏特加', amount: '45ml' }, { name: '養樂多', amount: '2-3瓶' }]
        },
        steps: {
            en: ['Fill glass with ice.', 'Add Vodka.', 'Top with Yakult.', 'Shake or Stir.'],
            zh: ['杯中加冰。', '加入伏特加。', '倒滿養樂多。', '搖盪或攪拌。']
        },
        tags: { en: ['cvs', 'sweet', 'party'], zh: ['超商', '甜', '派對'] },
        description: { en: 'The "Adult Yakult". Tastes exactly like your childhood, if your childhood involved getting hammered.', zh: '大人的養樂多。喝起來像童年回憶，如果你的童年包含喝掛的話。' },
        specs: { alcohol: 8, sweetness: 8, ease: 10 },
        color: '#fefce8',
        image: 'https://uyamflgtvqndbjpbjito.supabase.co/storage/v1/object/public/cocktails/vodka-yakult.png',
        collections: ['cvs-hacks']
    },
    {
        id: 'french-75',
        name: { en: 'French 75', zh: '法式75' },
        type: 'classic',
        baseSpirit: ['gin', 'wine'],
        ingredients: {
            en: [{ name: 'Gin', amount: '30ml' }, { name: 'Lemon Juice', amount: '15ml' }, { name: 'Simple Syrup', amount: '15ml' }, { name: 'Champagne', amount: 'Top up' }],
            zh: [{ name: '琴酒', amount: '30ml' }, { name: '檸檬汁', amount: '15ml' }, { name: '糖漿', amount: '15ml' }, { name: '香檳', amount: '加滿' }]
        },
        steps: {
            en: ['Shake gin, juice, and syrup with ice.', 'Strain into a champagne flute.', 'Top with champagne.'],
            zh: ['將琴酒、檸檬汁和糖漿加冰搖盪。', '濾入香檳杯。', '加滿香檳。']
        },
        tags: { en: ['bubbly', 'celebration', 'sour'], zh: ['氣泡', '慶祝', '酸'] },
        description: { en: 'A sophisticated combination of gin and champagne.', zh: '琴酒與香檳的優雅結合，威力如75毫米野戰砲。' },
        specs: { alcohol: 6, sweetness: 5, ease: 7 },
        color: '#fefce8',
        image: 'https://uyamflgtvqndbjpbjito.supabase.co/storage/v1/object/public/cocktails/french-75.png',
        collections: ['classic']
    },
    {
        id: 'aperol-spritz',
        name: { en: 'Aperol Spritz', zh: '艾普羅氣泡酒' },
        type: 'classic',
        baseSpirit: ['wine'],
        ingredients: {
            en: [{ name: 'Prosecco', amount: '90ml' }, { name: 'Aperol', amount: '60ml' }, { name: 'Soda Water', amount: '30ml' }],
            zh: [{ name: 'Prosecco氣泡酒', amount: '90ml' }, { name: 'Aperol開胃酒', amount: '60ml' }, { name: '蘇打水', amount: '30ml' }]
        },
        steps: {
            en: ['Fill wine glass with ice.', 'Add Prosecco, then Aperol, then Soda.', 'Garnish with orange slice.'],
            zh: ['酒杯裝滿冰塊。', '依序加入氣泡酒、Aperol、蘇打水。', '以柳橙片裝飾。']
        },
        tags: { en: ['bubbly', 'bittersweet', 'refreshing', 'party'], zh: ['氣泡', '苦甜', '清爽', '派對'] },
        description: { en: 'The ultimate Italian aperitif.', zh: '義大利國民餐前酒，清爽開胃。' },
        specs: { alcohol: 4, sweetness: 6, ease: 10 },
        color: '#fb923c',
        image: 'https://uyamflgtvqndbjpbjito.supabase.co/storage/v1/object/public/cocktails/aperol-spritz.png',
        collections: ['classic', 'party-time']
    },
    {
        id: 'moscow-mule',
        name: { en: 'Moscow Mule', zh: '莫斯科以此' },
        type: 'classic',
        baseSpirit: ['vodka'],
        ingredients: {
            en: [{ name: 'Vodka', amount: '45ml' }, { name: 'Lime Juice', amount: '15ml' }, { name: 'Ginger Beer', amount: 'Top up' }],
            zh: [{ name: '伏特加', amount: '45ml' }, { name: '萊姆汁', amount: '15ml' }, { name: '薑汁啤酒', amount: '加滿' }]
        },
        steps: {
            en: ['Fill copper mug with ice.', 'Add vodka and lime juice.', 'Top with ginger beer.', 'Stir.'],
            zh: ['銅杯加冰。', '加入伏特加和萊姆汁。', '倒滿薑汁啤酒。', '攪拌。']
        },
        tags: { en: ['refreshing', 'spicy', 'party'], zh: ['清爽', '辛辣', '派對'] },
        description: { en: 'Spicy ginger and lime make this a refreshing classic.', zh: '薑味與萊姆的完美結合，清爽辛辣。' },
        specs: { alcohol: 5, sweetness: 5, ease: 9 },
        color: '#fef3c7',
        image: 'https://uyamflgtvqndbjpbjito.supabase.co/storage/v1/object/public/cocktails/moscow-mule.png',
        collections: ['classic', 'party-time']
    },
    {
        id: 'pina-colada',
        name: { en: 'Piña Colada', zh: '鳳梨可樂達' },
        type: 'classic',
        baseSpirit: ['rum'],
        ingredients: {
            en: [{ name: 'White Rum', amount: '60ml' }, { name: 'Coconut Cream', amount: '30ml' }, { name: 'Pineapple Juice', amount: '90ml' }],
            zh: [{ name: '白蘭姆酒', amount: '60ml' }, { name: '椰漿', amount: '30ml' }, { name: '鳳梨汁', amount: '90ml' }]
        },
        steps: {
            en: ['Blend all ingredients with crushed ice until smooth.', 'Pour into tall glass.'],
            zh: ['將所有材料與碎冰放入果汁機打勻。', '倒入長杯。']
        },
        tags: { en: ['tropical', 'fruity', 'creamy', 'party'], zh: ['熱帶', '果味', '濃郁', '派對'] },
        description: { en: 'The quintessential tropical cocktail.', zh: '最經典的熱帶調酒，充滿鳳梨與椰子香氣。' },
        specs: { alcohol: 5, sweetness: 9, ease: 6 },
        color: '#ffffff',
        image: 'https://uyamflgtvqndbjpbjito.supabase.co/storage/v1/object/public/cocktails/pina-colada.png',
        collections: ['classic', 'party-time']
    },
    {
        id: 'long-island',
        name: { en: 'Long Island Iced Tea', zh: '長島冰茶' },
        type: 'classic',
        baseSpirit: ['vodka', 'rum', 'gin', 'tequila'],
        ingredients: {
            en: [{ name: 'Vodka', amount: '15ml' }, { name: 'Rum', amount: '15ml' }, { name: 'Gin', amount: '15ml' }, { name: 'Tequila', amount: '15ml' }, { name: 'Triple Sec', amount: '15ml' }, { name: 'Lemon Juice', amount: '25ml' }, { name: 'Cola', amount: 'Splash' }],
            zh: [{ name: '伏特加', amount: '15ml' }, { name: '蘭姆酒', amount: '15ml' }, { name: '琴酒', amount: '15ml' }, { name: '龍舌蘭', amount: '15ml' }, { name: '君度橙酒', amount: '15ml' }, { name: '檸檬汁', amount: '25ml' }, { name: '可樂', amount: '少許' }]
        },
        steps: {
            en: ['Add all spirits and lemon juice to highball glass with ice.', 'Top with cola.', 'Stir.'],
            zh: ['所有烈酒與檸檬汁加入裝滿冰的長杯。', '注入可樂。', '攪拌。']
        },
        tags: { en: ['strong', 'party', 'classic'], zh: ['烈', '派對', '經典'] },
        description: { en: 'Looks like tea, hits like a truck.', zh: '看起來像茶，喝起來像被卡車撞。' },
        specs: { alcohol: 9, sweetness: 6, ease: 8 },
        color: '#a16207',
        image: 'https://uyamflgtvqndbjpbjito.supabase.co/storage/v1/object/public/cocktails/long-island.png',
        collections: ['classic', 'party-time']
    },
    {
        id: 'sex-on-the-beach',
        name: { en: 'Sex on the Beach', zh: '性慾海灘' },
        type: 'classic',
        baseSpirit: ['vodka'],
        ingredients: {
            en: [{ name: 'Vodka', amount: '45ml' }, { name: 'Peach Schnapps', amount: '15ml' }, { name: 'Orange Juice', amount: '45ml' }, { name: 'Cranberry Juice', amount: '45ml' }],
            zh: [{ name: '伏特加', amount: '45ml' }, { name: '水蜜桃酒', amount: '15ml' }, { name: '柳橙汁', amount: '45ml' }, { name: '蔓越莓汁', amount: '45ml' }]
        },
        steps: {
            en: ['Shake all ingredients with ice.', 'Strain into highball glass filled with ice.'],
            zh: ['所有材料加冰搖盪。', '濾入裝滿冰的長杯。']
        },
        tags: { en: ['fruity', 'sweet', 'party'], zh: ['果味', '甜', '派對'] },
        description: { en: 'Fruity, refreshing, and popular.', zh: '果香濃郁，清爽受歡迎的夏季調酒。' },
        specs: { alcohol: 5, sweetness: 8, ease: 8 },
        color: '#fb7185',
        image: 'https://uyamflgtvqndbjpbjito.supabase.co/storage/v1/object/public/cocktails/sex-on-the-beach.png',
        collections: ['classic', 'party-time']
    },
    {
        id: 'singapore-sling',
        name: { en: 'Singapore Sling', zh: '新加坡司令' },
        type: 'classic',
        baseSpirit: ['gin', 'brandy'],
        ingredients: {
            en: [{ name: 'Gin', amount: '30ml' }, { name: 'Cherry Brandy', amount: '15ml' }, { name: 'Cointreau', amount: '7.5ml' }, { name: 'DOM Benedictine', amount: '7.5ml' }, { name: 'Pineapple Juice', amount: '120ml' }, { name: 'Lime Juice', amount: '15ml' }, { name: 'Grenadine', amount: '10ml' }],
            zh: [{ name: '琴酒', amount: '30ml' }, { name: '櫻桃白蘭地', amount: '15ml' }, { name: '君度橙酒', amount: '7.5ml' }, { name: 'DOM 班尼狄克汀', amount: '7.5ml' }, { name: '鳳梨汁', amount: '120ml' }, { name: '萊姆汁', amount: '15ml' }, { name: '紅石榴糖漿', amount: '10ml' }]
        },
        steps: {
            en: ['Shake all ingredients with ice.', 'Strain into tall glass.'],
            zh: ['所有材料加冰搖盪。', '濾入長杯。']
        },
        tags: { en: ['complex', 'fruity', 'tropical'], zh: ['複雜', '果味', '熱帶'] },
        description: { en: 'A complex, fruity cocktail created at the Raffles Hotel.', zh: '萊佛士酒店創製的複雜果味調酒。' },
        specs: { alcohol: 6, sweetness: 7, ease: 4 },
        color: '#ef4444',
        image: 'https://uyamflgtvqndbjpbjito.supabase.co/storage/v1/object/public/cocktails/singapore-sling.png',
        collections: ['classic']
    },
    {
        id: 'caipirinha',
        name: { en: 'Caipirinha', zh: '卡琵莉亞' },
        type: 'classic',
        baseSpirit: ['rum'],
        ingredients: {
            en: [{ name: 'Cachaça', amount: '60ml' }, { name: 'Lime', amount: '1/2 cut into wedges' }, { name: 'Sugar', amount: '2 tsp' }],
            zh: [{ name: '卡夏莎 (巴西甘蔗酒)', amount: '60ml' }, { name: '萊姆', amount: '半顆切塊' }, { name: '糖', amount: '2茶匙' }]
        },
        steps: {
            en: ['Muddle lime and sugar in glass.', 'Add Cachaça and ice.', 'Stir.'],
            zh: ['在杯中搗碎萊姆與糖。', '加入卡夏莎與冰塊。', '攪拌。']
        },
        tags: { en: ['sour', 'refreshing', 'classic'], zh: ['酸', '清爽', '經典'] },
        description: { en: 'Brazil’s national cocktail. Rustic and strong.', zh: '巴西國酒。粗獷有力，充滿甘蔗香氣。' },
        specs: { alcohol: 8, sweetness: 6, ease: 8 },
        color: '#f0fdf4',
        image: 'https://uyamflgtvqndbjpbjito.supabase.co/storage/v1/object/public/cocktails/caipirinha.png',
        collections: ['classic']
    },
    {
        id: 'pisco-sour',
        name: { en: 'Pisco Sour', zh: '皮斯科沙瓦' },
        type: 'classic',
        baseSpirit: ['brandy'],
        ingredients: {
            en: [{ name: 'Pisco', amount: '60ml' }, { name: 'Lime Juice', amount: '30ml' }, { name: 'Simple Syrup', amount: '20ml' }, { name: 'Egg White', amount: '1' }, { name: 'Angostura Bitters', amount: '3 drops' }],
            zh: [{ name: '皮斯科 (葡萄蒸餾酒)', amount: '60ml' }, { name: '萊姆汁', amount: '30ml' }, { name: '糖漿', amount: '20ml' }, { name: '蛋白', amount: '1顆' }, { name: '安格氏苦精', amount: '3滴' }]
        },
        steps: {
            en: ['Dry shake ingredients without ice.', 'Add ice and shake rigorously.', 'Strain into glass.', 'Top with bitters.'],
            zh: ['不加冰乾搖所有材料。', '加冰劇烈搖盪。', '濾入杯中。', '滴上苦精。']
        },
        tags: { en: ['sour', 'creamy', 'classic'], zh: ['酸', '綿密', '經典'] },
        description: { en: 'The national drink of Peru and Chile. Creamy and tart.', zh: '秘魯與智利的國飲。綿密酸甜。' },
        specs: { alcohol: 6, sweetness: 5, ease: 6 },
        color: '#d1d5db',
        image: 'https://uyamflgtvqndbjpbjito.supabase.co/storage/v1/object/public/cocktails/pisco-sour.png',
        collections: ['classic']
    },
    {
        id: 'boulevardier',
        name: { en: 'Boulevardier', zh: '花花公子' },
        type: 'classic',
        baseSpirit: ['whiskey'],
        ingredients: {
            en: [{ name: 'Bourbon or Rye Whiskey', amount: '45ml' }, { name: 'Campari', amount: '30ml' }, { name: 'Sweet Vermouth', amount: '30ml' }],
            zh: [{ name: '波本或裸麥威士忌', amount: '45ml' }, { name: 'Campari', amount: '30ml' }, { name: '甜香艾酒', amount: '30ml' }]
        },
        steps: {
            en: ['Stir all ingredients with ice.', 'Strain into chilled glass.', 'Garnish with orange peel.'],
            zh: ['所有材料加冰攪拌。', '濾入冰鎮過的杯子。', '以橙皮裝飾。']
        },
        tags: { en: ['bitter', 'strong', 'classic'], zh: ['苦', '烈', '經典'] },
        description: { en: 'A Negroni made with whiskey.', zh: '用威士忌做的內格羅尼。' },
        specs: { alcohol: 8, sweetness: 4, ease: 9 },
        color: '#b91c1c',
        image: 'https://uyamflgtvqndbjpbjito.supabase.co/storage/v1/object/public/cocktails/boulevardier.png',
        collections: ['classic']
    },
    {
        id: 'mint-julep',
        name: { en: 'Mint Julep', zh: '薄荷茱莉普' },
        type: 'classic',
        baseSpirit: ['whiskey'],
        ingredients: {
            en: [{ name: 'Bourbon', amount: '60ml' }, { name: 'Mint Leaves', amount: '4-5' }, { name: 'Simple Syrup', amount: '10ml' }],
            zh: [{ name: '波本威士忌', amount: '60ml' }, { name: '薄荷葉', amount: '4-5片' }, { name: '糖漿', amount: '10ml' }]
        },
        steps: {
            en: ['Gently muddle mint and syrup.', 'Add bourbon and crushed ice.', 'Stir until cup is frosted.', 'Garnish with more mint.'],
            zh: ['輕輕搗碎薄荷與糖漿。', '加入波本與碎冰。', '攪拌至杯壁結霜。', '以薄荷裝飾。']
        },
        tags: { en: ['refreshing', 'classic', 'strong'], zh: ['清爽', '經典', '烈'] },
        description: { en: 'The signature drink of the Kentucky Derby.', zh: '肯塔基賽馬會的標誌性調酒。' },
        specs: { alcohol: 8, sweetness: 4, ease: 7 },
        color: '#d1fae5',
        image: 'https://uyamflgtvqndbjpbjito.supabase.co/storage/v1/object/public/cocktails/mint-julep.png',
        collections: ['classic']
    },
    {
        id: 'sazerac',
        name: { en: 'Sazerac', zh: '薩澤拉克' },
        type: 'classic',
        baseSpirit: ['whiskey'],
        ingredients: {
            en: [{ name: 'Rye Whiskey', amount: '60ml' }, { name: 'Absinthe', amount: 'Rinse' }, { name: 'Sugar Cube', amount: '1' }, { name: 'Peychaud\'s Bitters', amount: '3 dashes' }],
            zh: [{ name: '裸麥威士忌', amount: '60ml' }, { name: '艾碧斯', amount: '涮洗杯壁' }, { name: '方糖', amount: '1顆' }, { name: '佩修苦精', amount: '3 dash' }]
        },
        steps: {
            en: ['Rinse chilled glass with absinthe.', 'Muddle sugar and bitters.', 'Add whiskey and ice, stir.', 'Strain into rinsed glass.'],
            zh: ['冰鎮杯子用艾碧斯涮過。', '搗碎糖與苦精。', '加入威士忌與冰攪拌。', '濾入杯中。']
        },
        tags: { en: ['strong', 'aromatic', 'classic'], zh: ['烈', '香氣', '經典'] },
        description: { en: 'New Orleans classic. Aromatic and potent.', zh: '紐奧良經典。香氣馥郁且濃烈。' },
        specs: { alcohol: 9, sweetness: 3, ease: 6 },
        color: '#c2410c',
        image: 'https://uyamflgtvqndbjpbjito.supabase.co/storage/v1/object/public/cocktails/sazerac.png',
        collections: ['classic']
    },
    {
        id: 'dark-n-stormy',
        name: { en: 'Dark \'n\' Stormy', zh: '月黑風高' },
        type: 'classic',
        baseSpirit: ['rum'],
        ingredients: {
            en: [{ name: 'Dark Rum', amount: '60ml' }, { name: 'Ginger Beer', amount: '100ml' }, { name: 'Lime', amount: 'Wedge' }],
            zh: [{ name: '黑蘭姆酒', amount: '60ml' }, { name: '薑汁啤酒', amount: '100ml' }, { name: '萊姆', amount: '切角' }]
        },
        steps: {
            en: ['Fill glass with ice.', 'Pour ginger beer.', 'Float dark rum on top.', 'Garnish with lime.'],
            zh: ['杯中加冰。', '倒入薑汁啤酒。', '將黑蘭姆酒漂浮在上方。', '以萊姆裝飾。']
        },
        tags: { en: ['spicy', 'refreshing', 'classic'], zh: ['辛辣', '清爽', '經典'] },
        description: { en: 'Bermuda\'s national drink. Spicy and refreshing.', zh: '百慕達國酒。辛辣清爽。' },
        specs: { alcohol: 6, sweetness: 5, ease: 10 },
        color: '#713f12',
        image: 'https://uyamflgtvqndbjpbjito.supabase.co/storage/v1/object/public/cocktails/dark-n-stormy.png',
        collections: ['classic']
    },
    {
        id: 'amaretto-sour',
        name: { en: 'Amaretto Sour', zh: '杏仁酸酒' },
        type: 'classic',
        baseSpirit: ['liqueur'],
        ingredients: {
            en: [{ name: 'Amaretto', amount: '60ml' }, { name: 'Lemon Juice', amount: '30ml' }, { name: 'Simple Syrup', amount: '10ml' }, { name: 'Egg White', amount: '1 (Optional)' }],
            zh: [{ name: '杏仁酒', amount: '60ml' }, { name: '檸檬汁', amount: '30ml' }, { name: '糖漿', amount: '10ml' }, { name: '蛋白', amount: '1顆 (選填)' }]
        },
        steps: {
            en: ['Shake all ingredients with ice.', 'Strain into glass with ice.'],
            zh: ['所有材料加冰搖盪。', '濾入裝滿冰的杯子。']
        },
        tags: { en: ['sweet', 'sour', 'classic'], zh: ['甜', '酸', '經典'] },
        description: { en: 'Sweet almond flavor balanced by tart lemon.', zh: '香甜杏仁味與酸檸檬的平衡。' },
        specs: { alcohol: 4, sweetness: 8, ease: 9 },
        color: '#fde047',
        image: 'https://uyamflgtvqndbjpbjito.supabase.co/storage/v1/object/public/cocktails/amaretto-sour.png',
        collections: ['classic']
    },
    {
        id: 'bellini',
        name: { en: 'Bellini', zh: '貝里尼' },
        type: 'classic',
        baseSpirit: ['wine'],
        ingredients: {
            en: [{ name: 'Prosecco', amount: '100ml' }, { name: 'Peach Puree', amount: '50ml' }],
            zh: [{ name: 'Prosecco氣泡酒', amount: '100ml' }, { name: '白桃果泥', amount: '50ml' }]
        },
        steps: {
            en: ['Put fruit puree in flute.', 'Top with Prosecco.', 'Stir gently.'],
            zh: ['將果泥放入香檳杯。', '倒入氣泡酒。', '輕輕攪拌。']
        },
        tags: { en: ['fruity', 'brunch', 'classic'], zh: ['果味', '早午餐', '經典'] },
        description: { en: 'Venetian classic created at Harry\'s Bar.', zh: '威尼斯 Harry\'s Bar 創製的經典。' },
        specs: { alcohol: 4, sweetness: 7, ease: 9 },
        color: '#fed7aa',
        image: 'https://uyamflgtvqndbjpbjito.supabase.co/storage/v1/object/public/cocktails/bellini.png',
        collections: ['classic']
    },
    {
        id: 'mimosa',
        name: { en: 'Mimosa', zh: '摩摩喳' },
        type: 'classic',
        baseSpirit: ['wine'],
        ingredients: {
            en: [{ name: 'Champagne', amount: '75ml' }, { name: 'Orange Juice', amount: '75ml' }],
            zh: [{ name: '香檳', amount: '75ml' }, { name: '柳橙汁', amount: '75ml' }]
        },
        steps: {
            en: ['Pour orange juice into flute.', 'Top with Champagne.'],
            zh: ['將柳橙汁倒入香檳杯。', '倒滿香檳。']
        },
        tags: { en: ['brunch', 'fruity', 'classic'], zh: ['早午餐', '果味', '經典'] },
        description: { en: 'The quintessential brunch cocktail.', zh: '早午餐的代名詞。' },
        specs: { alcohol: 4, sweetness: 7, ease: 10 },
        color: '#facc15',
        image: 'https://uyamflgtvqndbjpbjito.supabase.co/storage/v1/object/public/cocktails/mimosa.png',
        collections: ['classic']
    },
    {
        id: 'clover-club',
        name: { en: 'Clover Club', zh: '幸運草俱樂部' },
        type: 'classic',
        baseSpirit: ['gin'],
        ingredients: {
            en: [{ name: 'Gin', amount: '45ml' }, { name: 'Lemon Juice', amount: '15ml' }, { name: 'Raspberry Syrup', amount: '15ml' }, { name: 'Egg White', amount: '1' }],
            zh: [{ name: '琴酒', amount: '45ml' }, { name: '檸檬汁', amount: '15ml' }, { name: '覆盆子糖漿', amount: '15ml' }, { name: '蛋白', amount: '1顆' }]
        },
        steps: {
            en: ['Dry shake all ingredients.', 'Add ice and shake again.', 'Double strain into coupe.'],
            zh: ['乾搖所有材料。', '加冰再次搖盪。', '雙重過濾入淺碟香檳杯。']
        },
        tags: { en: ['fruity', 'classic', 'sour'], zh: ['果味', '經典', '酸'] },
        description: { en: 'A pre-prohibition classic. Silky and fruity.', zh: '禁酒令前的經典。口感絲滑帶有果香。' },
        specs: { alcohol: 6, sweetness: 6, ease: 7 },
        color: '#f472b6',
        image: 'https://uyamflgtvqndbjpbjito.supabase.co/storage/v1/object/public/cocktails/clover-club.png',
        collections: ['classic']
    },
    {
        id: 'last-word',
        name: { en: 'The Last Word', zh: '最後一語' },
        type: 'classic',
        baseSpirit: ['gin'],
        ingredients: {
            en: [{ name: 'Gin', amount: '20ml' }, { name: 'Green Chartreuse', amount: '20ml' }, { name: 'Maraschino Liqueur', amount: '20ml' }, { name: 'Lime Juice', amount: '20ml' }],
            zh: [{ name: '琴酒', amount: '20ml' }, { name: '綠色夏翠絲', amount: '20ml' }, { name: '黑櫻桃酒', amount: '20ml' }, { name: '萊姆汁', amount: '20ml' }]
        },
        steps: {
            en: ['Shake all ingredients with ice.', 'Strain into chilled glass.'],
            zh: ['所有材料加冰搖盪。', '濾入冰鎮杯中。']
        },
        tags: { en: ['herbal', 'sour', 'complex'], zh: ['草本', '酸', '複雜'] },
        description: { en: 'Equal parts. Perfectly balanced.', zh: '等量配方。完美平衡。' },
        specs: { alcohol: 8, sweetness: 5, ease: 8 },
        color: '#86efac',
        image: 'https://uyamflgtvqndbjpbjito.supabase.co/storage/v1/object/public/cocktails/last-word.png',
        collections: ['classic']
    },
    {
        id: 'bees-knees',
        name: { en: 'Bee\'s Knees', zh: '蜜蜂之膝' },
        type: 'classic',
        baseSpirit: ['gin'],
        ingredients: {
            en: [{ name: 'Gin', amount: '60ml' }, { name: 'Lemon Juice', amount: '22ml' }, { name: 'Honey Syrup', amount: '22ml' }],
            zh: [{ name: '琴酒', amount: '60ml' }, { name: '檸檬汁', amount: '22ml' }, { name: '蜂蜜糖漿', amount: '22ml' }]
        },
        steps: {
            en: ['Shake ingredients with ice.', 'Strain into chilled glass.'],
            zh: ['材料加冰搖盪。', '濾入冰鎮杯中。']
        },
        tags: { en: ['classic', 'sour', 'sweet'], zh: ['經典', '酸', '甜'] },
        description: { en: 'A prohibition era cocktail to hide the taste of bathtub gin.', zh: '禁酒令時期的經典，用蜂蜜掩蓋劣質琴酒的味道。' },
        specs: { alcohol: 6, sweetness: 6, ease: 8 },
        color: '#fefcb8',
        image: 'https://uyamflgtvqndbjpbjito.supabase.co/storage/v1/object/public/cocktails/bees-knees.png',
        collections: ['classic']
    },
    {
        id: 'southside',
        name: { en: 'Southside', zh: '南區' },
        type: 'classic',
        baseSpirit: ['gin'],
        ingredients: {
            en: [{ name: 'Gin', amount: '60ml' }, { name: 'Lime Juice', amount: '30ml' }, { name: 'Simple Syrup', amount: '15ml' }, { name: 'Mint Leaves', amount: '6-8' }],
            zh: [{ name: '琴酒', amount: '60ml' }, { name: '萊姆汁', amount: '30ml' }, { name: '糖漿', amount: '15ml' }, { name: '薄荷葉', amount: '6-8片' }]
        },
        steps: {
            en: ['Shake all ingredients with ice.', 'Double strain into chilled glass.'],
            zh: ['材料加冰搖盪。', '雙重濾入冰鎮杯中。']
        },
        tags: { en: ['refreshing', 'classic', 'sour'], zh: ['清爽', '經典', '酸'] },
        description: { en: 'Like a Mojito but with Gin, or a Gimlet with Mint.', zh: '像琴酒版的Mojito，或加了薄荷的Gimlet。' },
        specs: { alcohol: 6, sweetness: 5, ease: 8 },
        color: '#d1fae5',
        image: 'https://uyamflgtvqndbjpbjito.supabase.co/storage/v1/object/public/cocktails/southside.png',
        collections: ['classic']
    },
    {
        id: 'vitamin-c-bomb',
        name: { en: 'Vitamin C Bomb', zh: '維他命C炸彈' },
        type: 'cvs',
        baseSpirit: ['gin', 'tequila'],
        ingredients: {
            en: [{ name: 'Gin or Tequila', amount: '45ml' }, { name: 'CC Lemon', amount: 'Top up' }],
            zh: [{ name: '琴酒或龍舌蘭', amount: '45ml' }, { name: 'CC檸檬', amount: '加滿' }]
        },
        steps: {
            en: ['Fill glass with ice.', 'Add spirit.', 'Top with CC Lemon.'],
            zh: ['杯中加冰。', '加入烈酒。', '加滿CC檸檬。']
        },
        tags: { en: ['cvs', 'fizzy', 'sour'], zh: ['超商', '氣泡', '酸'] },
        description: { en: 'An explosion of citrus freshness. Perfect for a hot day.', zh: '滿滿的維他命C與氣泡感，像在嘴裡爆炸一樣清爽。' },
        specs: { alcohol: 5, sweetness: 7, ease: 10 },
        color: '#facc15',
        image: 'https://uyamflgtvqndbjpbjito.supabase.co/storage/v1/object/public/cocktails/vitamin-c-bomb.png',
        collections: ['cvs-hacks']
    },
    {
        id: 'oolong-gin',
        name: { en: 'Oolong Gin', zh: '烏龍琴酒' },
        type: 'cvs',
        baseSpirit: ['gin'],
        ingredients: {
            en: [{ name: 'Gin', amount: '45ml' }, { name: 'Oolong Tea', amount: 'Top up' }],
            zh: [{ name: '琴酒', amount: '45ml' }, { name: '烏龍茶', amount: '加滿' }]
        },
        steps: {
            en: ['Ice in glass.', 'Pour Gin.', 'Top with Oolong Tea.'],
            zh: ['杯中加冰。', '倒入琴酒。', '加滿烏龍茶。']
        },
        tags: { en: ['cvs', 'tea', 'refreshing'], zh: ['超商', '茶香', '清爽'] },
        description: { en: 'The herbal notes of gin blend seamlessly with roasted oolong.', zh: '琴酒的草本味與烏龍茶的焙火香完美融合，優雅又簡單。' },
        specs: { alcohol: 5, sweetness: 2, ease: 10 },
        color: '#d97706',
        image: 'https://uyamflgtvqndbjpbjito.supabase.co/storage/v1/object/public/cocktails/oolong-gin.png',
        collections: ['cvs-hacks']
    },
    {
        id: 'red-eye-tw',
        name: { en: 'Red Eye (TW Style)', zh: '台式紅眼' },
        type: 'cvs',
        baseSpirit: ['beer'],
        ingredients: {
            en: [{ name: 'Beer', amount: '1/2' }, { name: 'Tomato Juice', amount: '1/2' }, { name: 'Sour Plum', amount: '1' }],
            zh: [{ name: '啤酒', amount: '一半' }, { name: '番茄汁', amount: '一半' }, { name: '話梅', amount: '1顆' }]
        },
        steps: {
            en: ['Pour tomato juice and beer into a glass.', 'Drop in a sour plum.', 'Let it sit for a minute.'],
            zh: ['將番茄汁與啤酒倒入杯中。', '丟入一顆話梅。', '靜置一分鐘讓風味釋放。']
        },
        tags: { en: ['cvs', 'savory', 'local'], zh: ['超商', '鹹甜', '台式'] },
        description: { en: 'The classic cure with a Taiwanese twist. The plum adds a sweet-salty depth.', zh: '經典解酒酒的台式變奏。話梅的鹹甜甘味讓整杯酒更有層次。' },
        specs: { alcohol: 3, sweetness: 4, ease: 10 },
        color: '#ef4444',
        image: 'https://uyamflgtvqndbjpbjito.supabase.co/storage/v1/object/public/cocktails/red-eye-tw.png',
        collections: ['cvs-hacks']
    },
    {
        id: 'plum-green-tea-whiskey',
        name: { en: 'Plum Green Tea Whiskey', zh: '梅子綠威士忌' },
        type: 'cvs',
        baseSpirit: ['whiskey'],
        ingredients: {
            en: [{ name: 'Whiskey', amount: '45ml' }, { name: 'Plum Green Tea', amount: 'Top up' }],
            zh: [{ name: '威士忌', amount: '45ml' }, { name: '梅子綠茶', amount: '加滿' }]
        },
        steps: {
            en: ['Fill glass with ice.', 'Add Whiskey.', 'Top with Plum Green Tea.'],
            zh: ['杯中加冰。', '加入威士忌。', '加滿梅子綠茶。']
        },
        tags: { en: ['cvs', 'sweet', 'sour'], zh: ['超商', '酸甜', '茶'] },
        description: { en: 'Sweet, sour, and boozy. A dangerous combination.', zh: '酸酸甜甜的梅子綠配上威士忌，不知不覺就會喝醉。' },
        specs: { alcohol: 5, sweetness: 7, ease: 10 },
        color: '#ca8a04',
        image: 'https://uyamflgtvqndbjpbjito.supabase.co/storage/v1/object/public/cocktails/plum-green-tea-whiskey.png',
        collections: ['cvs-hacks']
    },
    {
        id: 'soy-milk-baileys',
        name: { en: 'Soy Milk Baileys', zh: '豆漿貝禮詩' },
        type: 'cvs',
        baseSpirit: ['liqueur'],
        ingredients: {
            en: [{ name: 'Baileys', amount: '50ml' }, { name: 'Soy Milk (No Sugar)', amount: 'Top up' }],
            zh: [{ name: '貝禮詩奶酒', amount: '50ml' }, { name: '無糖豆漿', amount: '加滿' }]
        },
        steps: {
            en: ['Ice in glass.', 'Pour Baileys.', 'Top with Soy Milk.'],
            zh: ['杯中加冰。', '倒入奶酒。', '加滿豆漿。']
        },
        tags: { en: ['cvs', 'creamy', 'vegan-option'], zh: ['超商', '濃郁', '豆乳'] },
        description: { en: 'Lighter than using milk, with a nutty soy profile.', zh: '比牛奶更清爽，帶有豆乳的香氣，意外合拍。' },
        specs: { alcohol: 4, sweetness: 6, ease: 10 },
        color: '#fefce8',
        image: 'https://uyamflgtvqndbjpbjito.supabase.co/storage/v1/object/public/cocktails/soy-milk-baileys.png',
        collections: ['cvs-hacks']
    },
    {
        id: 'yogurt-green-vodka',
        name: { en: 'Yogurt Green Tea Vodka', zh: '多多綠伏特加' },
        type: 'cvs',
        baseSpirit: ['vodka'],
        ingredients: {
            en: [{ name: 'Vodka', amount: '45ml' }, { name: 'Yakult', amount: '2 bottles' }, { name: 'Green Tea', amount: 'Top up' }],
            zh: [{ name: '伏特加', amount: '45ml' }, { name: '養樂多', amount: '2瓶' }, { name: '無糖綠茶', amount: '適量' }]
        },
        steps: {
            en: ['Combine Vodka and Yakult with limited ice.', 'Top with Green Tea.', 'Stir.'],
            zh: ['混合伏特加與養樂多。', '加入綠茶調整甜度。', '攪拌均勻。']
        },
        tags: { en: ['cvs', 'sweet', 'refreshing'], zh: ['超商', '酸甜', '清爽'] },
        description: { en: 'The adult version of a popular hand-shaken drink.', zh: '手搖飲店人氣王「多多綠」的大人版。' },
        specs: { alcohol: 5, sweetness: 7, ease: 9 },
        color: '#fde047',
        image: 'https://uyamflgtvqndbjpbjito.supabase.co/storage/v1/object/public/cocktails/yogurt-green-vodka.png',
        collections: ['cvs-hacks']
    },
    {
        id: 'pocari-soju',
        name: { en: 'Pocari Soju', zh: '寶礦力燒酒' },
        type: 'cvs',
        baseSpirit: ['soju'],
        ingredients: {
            en: [{ name: 'Soju', amount: '1 part' }, { name: 'Pocari Sweat', amount: '1 part' }],
            zh: [{ name: '燒酒', amount: '1份' }, { name: '寶礦力水得', amount: '1份' }]
        },
        steps: {
            en: ['Fill glass with ice.', 'Mix equal parts Soju and Pocari.'],
            zh: ['杯中加冰。', '混合等量的燒酒與寶礦力。']
        },
        tags: { en: ['cvs', 'hydration', 'smooth'], zh: ['超商', '補水', '順口'] },
        description: { en: 'Dangerous. You can\'t taste the alcohol, and you stay hydrated (sort of).', zh: '危險。完全喝不出酒味，而且還順便補水（大概吧）。' },
        specs: { alcohol: 6, sweetness: 5, ease: 10 },
        color: '#bae6fd',
        image: 'https://uyamflgtvqndbjpbjito.supabase.co/storage/v1/object/public/cocktails/pocari-soju.png',
        collections: ['cvs-hacks']
    },
    {
        id: 'black-coffee-whiskey',
        name: { en: 'Black Coffee Whiskey', zh: '美式威士忌' },
        type: 'cvs',
        baseSpirit: ['whiskey'],
        ingredients: {
            en: [{ name: 'Whiskey', amount: '45ml' }, { name: 'Iced Americano', amount: 'Top up' }],
            zh: [{ name: '威士忌', amount: '45ml' }, { name: '冰美式咖啡', amount: '加滿' }]
        },
        steps: {
            en: ['Ice in glass.', 'Pour Whiskey.', 'Top with Black Coffee.'],
            zh: ['杯中加冰。', '倒入威士忌。', '加滿冰美式。']
        },
        tags: { en: ['cvs', 'bitter', 'caffeine'], zh: ['超商', '苦', '提神'] },
        description: { en: 'Caffeine and alcohol. For when you need to be awake and buzzed.', zh: '咖啡因與酒精的雙重奏。給需要清醒又想微醺的你。' },
        specs: { alcohol: 5, sweetness: 1, ease: 10 },
        color: '#451a03',
        image: 'https://uyamflgtvqndbjpbjito.supabase.co/storage/v1/object/public/cocktails/black-coffee-whiskey.png?v=2',
        collections: ['cvs-hacks']
    }
];
