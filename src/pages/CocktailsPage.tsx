import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Martini, SlidersHorizontal } from 'lucide-react';
import type { Recipe } from '../data/recipes';
import clsx from 'clsx';

// Shaker Icon Component
import { ShakerIcon } from '../components/ShakerIcon';
import { RecipeCard } from '../components/RecipeCard';
import { RecipeCardSkeleton } from '../components/RecipeCardSkeleton';
import { useSubscription } from '../hooks/useSubscription';

interface CocktailsPageProps {
    allRecipes: Recipe[];
    favorites: Set<string>;
    toggleFavorite: (id: string, e?: React.MouseEvent) => void;
    onSelectRecipe: (recipe: Recipe, list?: Recipe[]) => void;
    lang: 'en' | 'zh';
    onShake: () => void;
}

export function CocktailsPage({ allRecipes, favorites, toggleFavorite, onSelectRecipe, lang, onShake }: CocktailsPageProps) {
    const { isPro } = useSubscription();

    // State Initialization with URL Search Params
    const [selectedCategories, setSelectedCategories] = useState<Set<'classic' | 'cvs'>>(() => {
        const params = new URLSearchParams(window.location.search);
        const cat = params.get('cat');
        if (!cat) return new Set();
        return new Set(cat.split(',').filter((c): c is 'classic' | 'cvs' => c === 'classic' || c === 'cvs'));
    });

    const [selectedSpirits, setSelectedSpirits] = useState<Set<string>>(() => {
        const params = new URLSearchParams(window.location.search);
        const spirits = params.get('spirit');
        return spirits ? new Set(spirits.split(',')) : new Set();
    });

    const [searchQuery, setSearchQuery] = useState(() => {
        return new URLSearchParams(window.location.search).get('q') || '';
    });

    const [showFilter, setShowFilter] = useState(false);

    // Sync State to URL
    useEffect(() => {
        const params = new URLSearchParams();

        if (selectedCategories.size > 0) {
            params.set('cat', Array.from(selectedCategories).join(','));
        }

        if (selectedSpirits.size > 0) {
            params.set('spirit', Array.from(selectedSpirits).join(','));
        }

        if (searchQuery) {
            params.set('q', searchQuery);
        }

        const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
        window.history.replaceState({}, '', newUrl);
    }, [selectedCategories, selectedSpirits, searchQuery]);

    const tabs: ('cvs' | 'classic')[] = ['cvs', 'classic'];

    const t = {
        title: lang === 'zh' ? '調酒' : 'Cocktails',
        searchPlaceholder: lang === 'zh' ? '搜尋調酒或材料...' : 'Cocktails or ingredients...',
        tabs: {
            all: lang === 'zh' ? '全部' : 'All',
            classic: lang === 'zh' ? '經典調酒' : 'Classic',
            cvs: lang === 'zh' ? '超商速調' : 'Easy Mixes'
        },
        spirits: {
            all: lang === 'zh' ? '所有基酒' : 'All Spirits',
            gin: 'Gin', vodka: 'Vodka', rum: 'Rum', tequila: 'Tequila', whiskey: 'Whiskey',
            brandy: 'Brandy', wine: 'Wine', liqueur: 'Liqueur', beer: 'Beer'
        },
        noResults: lang === 'zh' ? '找不到相關調酒' : 'No drinks found.',
        clear: lang === 'zh' ? '清除篩選' : 'Clear filters'
    };

    const spirits = [
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

    const activeFilterCount = selectedCategories.size + selectedSpirits.size;

    const filteredRecipes = useMemo(() => {
        return allRecipes.filter(recipe => {
            // Category filter (OR logic within categories)
            const categoryMatch = selectedCategories.size === 0 ||
                (selectedCategories.has('classic') && recipe.type === 'classic') ||
                (selectedCategories.has('cvs') && recipe.type === 'cvs');

            // Spirit filter (OR logic within spirits)
            const spiritMatch = selectedSpirits.size === 0 ||
                Array.from(selectedSpirits).some(spirit => recipe.baseSpirit.includes(spirit));

            // Search filter
            if (!searchQuery) return categoryMatch && spiritMatch;
            const q = searchQuery.toLowerCase();
            const matchName = recipe.name.en.toLowerCase().includes(q) || recipe.name.zh.toLowerCase().includes(q);
            const matchIng = recipe.ingredients.en.some(i => i.name.toLowerCase().includes(q)) ||
                recipe.ingredients.zh.some(i => i.name.toLowerCase().includes(q));
            const searchMatch = matchName || matchIng;

            return categoryMatch && spiritMatch && searchMatch;
        });
    }, [allRecipes, selectedCategories, selectedSpirits, searchQuery]);

    const [isSticky, setIsSticky] = useState(false);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const scrollTop = e.currentTarget.scrollTop;
        setIsSticky(scrollTop > 50);
    };

    const toggleCategory = (cat: 'classic' | 'cvs') => {
        const newSet = new Set(selectedCategories);
        if (newSet.has(cat)) {
            newSet.delete(cat);
        } else {
            newSet.add(cat);
        }
        setSelectedCategories(newSet);
    };

    const toggleSpirit = (spirit: string) => {
        const newSet = new Set(selectedSpirits);
        if (newSet.has(spirit)) {
            newSet.delete(spirit);
        } else {
            newSet.add(spirit);
        }
        setSelectedSpirits(newSet);
    };

    return (
        <div
            className="h-full overflow-y-auto no-scrollbar flex flex-col"
            onScroll={handleScroll}
        >
            {/* Scroll Sentinel (Removed) */}

            {/* Header (Scrolls away) */}
            <div className="px-4 pb-4 pt-[calc(3rem+env(safe-area-inset-top))] flex justify-between items-center bg-transparent relative z-10">
                <h1 className="text-3xl font-bold text-white">{t.title}</h1>
            </div>

            {/* Sticky Header Group: Search & Tabs */}
            <div className={clsx(
                "sticky top-0 px-4 pb-2 pt-[calc(0.5rem+env(safe-area-inset-top))] -mt-[calc(0.5rem+env(safe-area-inset-top))] transition-all duration-300 z-40",
                // Container is always transparent now, enabling the inner gradient div to handle the look
                "bg-transparent"
            )}>
                <div
                    className={clsx(
                        "absolute inset-0 bg-gradient-to-b from-black/90 via-black/60 to-transparent -z-10 transition-opacity duration-300",
                        isSticky ? "opacity-100 visible" : "opacity-0 invisible"
                    )}
                    style={{
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
                        WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
                        maskRepeat: 'no-repeat',
                        WebkitMaskRepeat: 'no-repeat'
                    }}
                />

                {/* Search Bar & Filter Button */}
                <div className="flex gap-3">
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
                                className="absolute right-3 top-3.5 p-0.5 rounded-full bg-white text-black hover:bg-zinc-200 transition-colors z-10"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>
                    {/* Shake Button */}
                    <button
                        onClick={onShake}
                        className="w-[50px] h-[50px] rounded-full bg-zinc-800/40 flex items-center justify-center border border-white/10 text-white active:scale-95 transition-all shrink-0 hover:bg-zinc-700"
                    >
                        <ShakerIcon />
                    </button>
                    <button
                        onClick={() => setShowFilter(true)}
                        className="relative w-[50px] h-[50px] rounded-full bg-zinc-800/40 flex items-center justify-center border border-white/10 text-white hover:bg-zinc-700 transition-colors shrink-0"
                    >
                        <SlidersHorizontal size={20} />
                        {activeFilterCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                {activeFilterCount}
                            </span>
                        )}
                    </button>
                </div>

                {/* Category Tabs (Restored here) */}
                {/* Category Tabs Moved to Filter */}
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
                            className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[1024px] z-[101] bg-black/40 backdrop-blur-2xl rounded-t-[2.5rem] border-t-[0.5px] border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.5),inset_0_0.5px_0_rgba(255,255,255,0.1)] p-6 pb-12 mx-auto"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold text-white">{lang === 'zh' ? '篩選' : 'Filters'}</h3>
                                <div className="flex gap-2">
                                    {activeFilterCount > 0 && (
                                        <button
                                            onClick={() => {
                                                setSelectedCategories(new Set());
                                                setSelectedSpirits(new Set());
                                            }}
                                            className="px-4 py-2 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-bold transition-colors border border-red-500/20"
                                        >
                                            {lang === 'zh' ? '全部清除' : 'Clear All'}
                                        </button>
                                    )}
                                    <button onClick={() => setShowFilter(false)} className="p-2 rounded-full bg-black/30 backdrop-blur-md text-white border border-white/10 shadow-lg hover:bg-black/50 active:scale-95 transition-all">
                                        <X size={24} />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {/* Category Section */}
                                <div>
                                    <h4 className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-3">
                                        {lang === 'zh' ? '分類' : 'Category'}
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {tabs.map(tab => {
                                            const labels = {
                                                cvs: t.tabs.cvs,
                                                classic: t.tabs.classic
                                            };
                                            return (
                                                <button
                                                    key={tab}
                                                    onClick={() => toggleCategory(tab)}
                                                    className={clsx(
                                                        "whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium border transition-colors",
                                                        selectedCategories.has(tab)
                                                            ? "bg-indigo-500 text-white border-indigo-500 shadow-md shadow-indigo-500/20"
                                                            : "bg-zinc-800/40 text-zinc-400 border-white/10 hover:bg-zinc-700"
                                                    )}
                                                >
                                                    {labels[tab]}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                                {/* Base Spirit Only */}
                                <div>
                                    <h4 className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-3">
                                        {lang === 'zh' ? '基酒' : 'Base Spirit'}
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {spirits.map(s => (
                                            <button
                                                key={s.id}
                                                onClick={() => toggleSpirit(s.id)}
                                                className={clsx(
                                                    "whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium border transition-colors",
                                                    selectedSpirits.has(s.id)
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
                                    className={clsx(
                                        "w-full py-4 font-bold rounded-2xl mt-4 active:scale-[0.98] transition-all",
                                        activeFilterCount > 0
                                            ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                                            : "bg-white text-black"
                                    )}
                                >
                                    {lang === 'zh' ? `顯示 ${filteredRecipes.length} 個結果` : `Show ${filteredRecipes.length} Results`}
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Recipe Grid */}
            <div className="px-4 flex-1 pt-4 pb-24">
                {allRecipes.length === 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-12">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <RecipeCardSkeleton key={i} variant="horizontal" />
                        ))}
                    </div>
                ) : filteredRecipes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-12">
                        {filteredRecipes.map((recipe, index) => (
                            <RecipeCard
                                key={recipe.id}
                                recipe={recipe}
                                lang={lang}
                                isFavorite={favorites.has(recipe.id)}
                                toggleFavorite={toggleFavorite}
                                onClick={() => onSelectRecipe(recipe, filteredRecipes)}
                                priority={index < 6}
                                isLocked={recipe.is_premium && !isPro}
                            />
                        ))}
                    </div >
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
                        <Martini size={48} className="mb-4 opacity-50" />
                        <p>{t.noResults}</p>
                        <button onClick={() => { setSearchQuery(''); setSelectedCategories(new Set()); setSelectedSpirits(new Set()); }} className="mt-4 text-indigo-400 underline">
                            {lang === 'zh' ? '清除篩選' : 'Clear filters'}
                        </button>
                    </div>
                )
                }
            </div >
        </div >
    );
}
