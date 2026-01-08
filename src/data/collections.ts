import type { Recipe } from './recipes';

export interface Collection {
    id: string;
    title: { en: string; zh: string };
    subtitle: { en: string; zh: string };
    type: 'curated' | 'filter';
    recipeIds?: string[]; // For curated
    filterRules?: any; // JSONB from DB: { type: 'cvs' } or { tag: 'party' }
    filter?: (recipe: Recipe) => boolean; // Legacy/Fallback local function
    coverImage?: string;
    themeColor?: string; // CSS gradient classes
    description?: { en: string; zh: string };
    sortOrder?: number;
    isActive?: boolean;
}

export const collections: Collection[] = [
    {
        id: 'winter-warmers',
        title: { en: 'Winter Warmers', zh: '過年暖心特輯' },
        subtitle: { en: 'Cozy up with these hot cocktails', zh: '寒流來襲？來杯熱酒暖暖身' },
        type: 'curated',
        recipeIds: ['hot-toddy', 'mulled-wine', 'irish-coffee', 'hot-buttered-rum', 'eggnog', 'baileys-hot-chocolate'], // IDs we just added
        themeColor: 'from-orange-600 via-red-600 to-rose-900',
        coverImage: '/cocktails/cny_mahjong.png',
        description: {
            en: 'When the temperature drops, nothing beats a hot cocktail. From the medicinal Hot Toddy to the festive Mulled Wine, these recipes are designed to keep you warm from the inside out.',
            zh: '氣溫驟降時，沒什麼比一杯熱調酒更棒了。從具有療效感的熱托迪到節慶必備的熱紅酒，這些酒譜將由內而外溫暖你的心。'
        }
    },
    {
        id: 'cvs-hacks',
        title: { en: 'Convenience Store Mixology', zh: '超商創意特調' },
        subtitle: { en: 'Creative drinks from the corner store', zh: '便利商店就能買齊材料' },
        type: 'filter',
        filter: (r) => r.type === 'cvs',
        themeColor: 'from-blue-600 to-indigo-900',
        coverImage: '/cocktails/cvs_party.png',
        description: {
            en: 'Quickly grab ingredients from your local store and craft creative cocktails. No professional bar gear needed.',
            zh: '不需專業酒吧設備，用巷口超商買得到的材料，也能輕鬆調出好喝的酒。'
        }
    },
    {
        id: 'party-time',
        title: { en: 'Party Starters', zh: '派對必備' },
        subtitle: { en: 'Crowd pleaders for any gathering', zh: '炒熱氣氛的最佳選擇' },
        type: 'filter',
        filter: (r) => r.tags.en.includes('party') || r.specs.ease >= 8,
        themeColor: 'from-purple-600 to-pink-900',
        coverImage: '/cocktails/party_starters.png',
        description: {
            en: 'Fun, fruity, and easy to make in batches.',
            zh: '好喝、易飲，而且適合大量製作分享的派對酒譜。'
        }
    }
];
