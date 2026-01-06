import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Martini, Store, Heart, LayoutGrid, SlidersHorizontal } from 'lucide-react';
import type { Recipe } from '../data/recipes';
import clsx from 'clsx';

// Shaker Icon Component
import { ShakerIcon } from '../components/ShakerIcon';

interface CocktailsPageProps {
    allRecipes: Recipe[];
    favorites: Set<string>;
    toggleFavorite: (id: string, e?: React.MouseEvent) => void;
    onSelectRecipe: (recipe: Recipe) => void;
    lang: 'en' | 'zh';
    onShake: () => void;
}

export function CocktailsPage({ allRecipes, favorites, toggleFavorite, onSelectRecipe, lang, onShake }: CocktailsPageProps) {
    const [activeSubTab, setActiveSubTab] = useState<'all' | 'classic' | 'cvs'>('all');
    const [activeSpirit, setActiveSpirit] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilter, setShowFilter] = useState(false);

    const t = {
        title: lang === 'zh' ? '酒譜' : 'Cocktails',
        searchPlaceholder: lang === 'zh' ? '搜尋調酒或材料...' : 'Search cocktails or ingredients...',
        tabs: {
            all: lang === 'zh' ? '全部' : 'All',
            classic: lang === 'zh' ? '經典' : 'Classic',
            cvs: lang === 'zh' ? '超商' : 'CVS'
        },
        spirits: {
            all: lang === 'zh' ? '所有基酒' : 'All Spirits',
            gin: 'Gin', vodka: 'Vodka', rum: 'Rum', tequila: 'Tequila', whiskey: 'Whiskey',
            brandy: 'Brandy', wine: 'Wine', liqueur: 'Liqueur', beer: 'Beer'
        },
        noResults: lang === 'zh' ? '找不到相關酒譜' : 'No drinks found.',
        clear: lang === 'zh' ? '清除篩選' : 'Clear filters'
    };

    const spirits = [
        { id: 'all', label: t.spirits.all },
        { id: 'gin', label: lang === 'zh' ? '琴酒' : 'Gin' },
        { id: 'vodka', label: lang === 'zh' ? '伏特加' : 'Vodka' },
        { id: 'rum', label: lang === 'zh' ? '蘭姆酒' : 'Rum' },
        { id: 'tequila', label: lang === 'zh' ? '龍舌蘭' : 'Tequila' },
        { id: 'whiskey', label: lang === 'zh' ? '威士忌' : 'Whiskey' },
        { id: 'brandy', label: lang === 'zh' ? '白蘭地' : 'Brandy' },
        { id: 'liqueur', label: lang === 'zh' ? '利口酒' : 'Liqueur' },
        { id: 'wine', label: lang === 'zh' ? '葡萄酒' : 'Wine' },
        { id: 'beer', label: lang === 'zh' ? '啤酒' : 'Beer' },
    ];

    const filteredRecipes = useMemo(() => {
        return allRecipes.filter(recipe => {
            if (activeSubTab === 'classic' && recipe.type !== 'classic') return false;
            if (activeSubTab === 'cvs' && recipe.type !== 'cvs') return false;
            if (activeSpirit !== 'all' && !recipe.baseSpirit.includes(activeSpirit)) return false;
            if (!searchQuery) return true;
            const q = searchQuery.toLowerCase();
            const matchName = recipe.name.en.toLowerCase().includes(q) || recipe.name.zh.toLowerCase().includes(q);
            const matchIng = recipe.ingredients.en.some(i => i.name.toLowerCase().includes(q)) ||
                recipe.ingredients.zh.some(i => i.name.toLowerCase().includes(q));
            return matchName || matchIng;
        });
    }, [allRecipes, activeSubTab, activeSpirit, searchQuery]);

    return (
        <div className="min-h-full flex flex-col pt-12">
            {/* Header (Scrolls away) */}
            <div className="px-6 pb-4 flex justify-between items-center bg-transparent">
                <h1 className="text-3xl font-bold text-white">{t.title}</h1>
                <button
                    onClick={onShake}
                    className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30 text-indigo-400 active:scale-95 transition-transform"
                >
                    <ShakerIcon />
                </button>
            </div>

            {/* Sticky Header Group: Search & Tabs */}
            <div className="sticky top-0 z-40 px-6 pb-2 pt-2 -mx-0 bg-gradient-to-b from-black via-black to-transparent">
                <div className="absolute inset-0 bg-black/80 backdrop-blur-md -z-10 masking-effect" />

                {/* Search Bar & Filter Button */}
                <div className="flex gap-3 mb-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-3.5 text-white z-10" size={20} />
                        <input
                            type="text"
                            placeholder={t.searchPlaceholder}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-zinc-800/40 backdrop-blur-xl border border-white/10 rounded-full py-3 pl-12 pr-10 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 h-[50px]"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-3.5 p-1 text-zinc-500 hover:text-white"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>
                    <button
                        onClick={() => setShowFilter(true)}
                        className={clsx(
                            "w-[50px] h-[50px] rounded-full flex items-center justify-center border transition-colors shrink-0",
                            (activeSpirit !== 'all')
                                ? "bg-indigo-500 border-indigo-500 text-white"
                                : "bg-zinc-800/40 border-white/10 text-white hover:bg-zinc-700"
                        )}
                    >
                        <SlidersHorizontal size={20} />
                    </button>
                </div>

                {/* Category Tabs (Restored here) */}
                <div className="bg-zinc-800/40 backdrop-blur-xl border border-white/10 p-1 rounded-full flex items-center">
                    <button
                        onClick={() => setActiveSubTab('all')}
                        className={clsx(
                            "flex-1 py-2.5 rounded-full text-sm font-medium transition-all flex items-center justify-center gap-2",
                            activeSubTab === 'all' ? "bg-white/10 backdrop-blur-md text-white shadow-lg border border-white/10" : "text-zinc-500 hover:text-zinc-300"
                        )}
                    >
                        <LayoutGrid size={16} />
                        {t.tabs.all}
                    </button>
                    <button
                        onClick={() => setActiveSubTab('cvs')}
                        className={clsx(
                            "flex-1 py-2.5 rounded-full text-sm font-medium transition-all flex items-center justify-center gap-2",
                            activeSubTab === 'cvs' ? "bg-white/10 backdrop-blur-md text-white shadow-lg border border-white/10" : "text-zinc-500 hover:text-zinc-300"
                        )}
                    >
                        <Store size={16} />
                        {t.tabs.cvs}
                    </button>
                    <button
                        onClick={() => setActiveSubTab('classic')}
                        className={clsx(
                            "flex-1 py-2.5 rounded-full text-sm font-medium transition-all flex items-center justify-center gap-2",
                            activeSubTab === 'classic' ? "bg-white/10 backdrop-blur-md text-white shadow-lg border border-white/10" : "text-zinc-500 hover:text-zinc-300"
                        )}
                    >
                        <Martini size={16} />
                        {t.tabs.classic}
                    </button>
                </div>
            </div>

            {/* Filter Sheet */}
            <AnimatePresence>
                {showFilter && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowFilter(false)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
                        />
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed bottom-0 left-0 right-0 z-[101] bg-zinc-900 rounded-t-3xl border-t border-white/10 p-6 pb-12 ring-1 ring-white/10 mx-auto max-w-[1024px]"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-white">{lang === 'zh' ? '篩選' : 'Filters'}</h3>
                                <div className="flex gap-2">
                                    {(activeSpirit !== 'all') && (
                                        <button
                                            onClick={() => { setActiveSpirit('all'); }}
                                            className="text-sm text-zinc-400 font-medium px-3 py-1.5 rounded-full hover:bg-white/5 transition-colors"
                                        >
                                            {t.clear}
                                        </button>
                                    )}
                                    <button onClick={() => setShowFilter(false)} className="p-2 bg-zinc-800 rounded-full text-zinc-400 hover:text-white">
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {/* Base Spirit Only */}
                                <div>
                                    <h4 className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-3">
                                        {lang === 'zh' ? '基酒' : 'Base Spirit'}
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {spirits.map(s => (
                                            <button
                                                key={s.id}
                                                onClick={() => setActiveSpirit(s.id)}
                                                className={clsx(
                                                    "whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium border transition-colors",
                                                    activeSpirit === s.id
                                                        ? "bg-indigo-500 text-white border-indigo-500 shadow-md shadow-indigo-500/20"
                                                        : "bg-zinc-800/40 text-zinc-400 border-white/10 hover:bg-zinc-700"
                                                )}
                                            >
                                                {s.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onClick={() => setShowFilter(false)}
                                    className="w-full py-4 bg-white text-black font-bold rounded-2xl mt-4 active:scale-[0.98] transition-transform"
                                >
                                    {lang === 'zh' ? `顯示 ${filteredRecipes.length} 個結果` : `Show ${filteredRecipes.length} Results`}
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Recipe Grid */}
            <div className="px-6 flex-1 pt-4">
                {filteredRecipes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-12">
                        <AnimatePresence mode='popLayout'>
                            {filteredRecipes.map((recipe) => (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.5 }}
                                    key={recipe.id}
                                    onClick={() => onSelectRecipe(recipe)}
                                    className="bg-zinc-800/30 backdrop-blur-md border border-white/10 shadow-lg rounded-2xl overflow-hidden active:scale-[0.98] transition-all"
                                >
                                    <div className="flex p-3 gap-4">
                                        <div className="w-[120px] h-[120px] rounded-xl bg-zinc-800 shrink-0 overflow-hidden relative">
                                            {recipe.image ? (
                                                <img src={recipe.image} alt={recipe.name.en} className="w-full h-full object-cover" loading="lazy" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-zinc-700">
                                                    <Martini size={24} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0 flex flex-col h-[120px] justify-between">
                                            <div>
                                                <div className="flex justify-between items-start mb-0.5">
                                                    <h3 className="text-white font-bold text-lg leading-tight truncate pr-2">{lang === 'zh' ? recipe.name.zh : recipe.name.en}</h3>
                                                    <motion.button
                                                        whileTap={{ scale: 0.8 }}
                                                        onClick={(e) => toggleFavorite(recipe.id, e)}
                                                        className={clsx(
                                                            "p-2 rounded-full transition-colors -mt-1 -mr-1",
                                                            favorites.has(recipe.id) ? "text-red-500 bg-red-500/10" : "text-zinc-500 hover:text-zinc-300"
                                                        )}
                                                    >
                                                        <Heart size={20} className={clsx(favorites.has(recipe.id) && "fill-red-500")} />
                                                    </motion.button>
                                                </div>
                                                <p className="text-zinc-400 text-xs line-clamp-2 leading-tight pr-7 h-8">
                                                    {recipe.description[lang]}
                                                </p>
                                            </div>
                                            <div className="flex flex-wrap gap-1.5 content-end">
                                                {recipe.tags[lang].slice(0, 3).map((tag: string) => (
                                                    <span key={tag} className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div >
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
                        <Martini size={48} className="mb-4 opacity-50" />
                        <p>{t.noResults}</p>
                        <button onClick={() => { setSearchQuery(''); setActiveSubTab('all'); setActiveSpirit('all'); }} className="mt-4 text-indigo-400 underline">
                            {t.clear}
                        </button>
                    </div>
                )
                }
            </div >
        </div >
    );
}
