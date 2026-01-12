import { useState, useMemo, useEffect, useRef } from 'react';
import { MyBarModal, type IngredientItem } from '../components/MyBarModal';
import { ShakerIcon } from '../components/ShakerIcon';
import clsx from 'clsx';
import type { Recipe } from '../data/recipes';
import { normalizeIngredient } from '../utils/normalization';
import { RecipeCard } from '../components/RecipeCard';
import { RecipeCardSkeleton } from '../components/RecipeCardSkeleton';
import { useSubscription } from '../hooks/useSubscription';
import { motion } from 'framer-motion';
import { LockedContentCard } from '../components/LockedContentCard';

interface MyBarPageProps {
    allRecipes: Recipe[];
    myInventory: Set<string>;
    setMyInventory: (inventory: Set<string>) => void;
    allIngredients: IngredientItem[];
    lang: 'en' | 'zh';
    onSelectRecipe: (recipe: Recipe, list?: Recipe[]) => void;
    favorites: Set<string>;
    toggleFavorite: (id: string, e?: React.MouseEvent) => void;
}

export function MyBarPage({
    allRecipes,
    myInventory,
    setMyInventory,
    allIngredients,
    lang,
    onSelectRecipe,
    favorites,
    toggleFavorite
}: MyBarPageProps) {
    const { isPro, presentPaywall } = useSubscription();
    // Modal Persistence
    const [showModal, setShowModal] = useState(() => {
        try {
            return localStorage.getItem('myBarModalOpen') === 'true';
        } catch { return false; }
    });

    useEffect(() => {
        if (showModal) localStorage.setItem('myBarModalOpen', 'true');
        else localStorage.removeItem('myBarModalOpen');
    }, [showModal]);

    const [activeTab, setActiveTab] = useState<'available' | 'missing'>('available');
    const scrollRef = useRef<HTMLDivElement>(null);

    // Filter Logic and Categorization
    const { exactMatches, missingOneMatches } = useMemo(() => {
        if (myInventory.size === 0) return { exactMatches: [], missingOneMatches: [] };

        const ignorableIngredients = new Set([
            'ice', 'water'
        ]);

        const exact: Recipe[] = [];
        const missingOne: Array<{ recipe: Recipe, missing: string }> = [];

        for (const recipe of allRecipes) {
            const needed = recipe.ingredients['en'];
            const missingIngredients: string[] = [];

            // Check each required ingredient
            for (const ing of needed) {
                const canonicals = normalizeIngredient(ing.name, 'en');

                // 1. Do we have it?
                const hasIt = canonicals.some(id => myInventory.has(id));

                if (!hasIt) {
                    // 2. Is it ignorable?
                    const isIgnorable = canonicals.some(id =>
                        ignorableIngredients.has(id)
                    );

                    if (!isIgnorable) {
                        // We are missing this real ingredient.
                        let displayName = ing.name;

                        // Try to find the item in allIngredients using the canonical IDs
                        const dbItem = allIngredients.find(item => canonicals.includes(item.id));

                        if (dbItem) {
                            displayName = lang === 'zh' ? dbItem.name_zh : dbItem.name_en;
                        }

                        missingIngredients.push(displayName);
                    }
                }
            }

            if (missingIngredients.length === 0) {
                exact.push(recipe);
            } else if (missingIngredients.length === 1) {
                missingOne.push({ recipe, missing: missingIngredients[0] });
            }
        }

        return { exactMatches: exact, missingOneMatches: missingOne };

    }, [allRecipes, myInventory, allIngredients, lang]);

    // Derived Lists based on Subscription
    const displayedExactMatches = isPro ? exactMatches : exactMatches.slice(0, 2);
    const hiddenExactCount = Math.max(0, exactMatches.length - 2);

    const displayedMissing = isPro ? missingOneMatches : missingOneMatches.slice(0, 2);
    const hiddenMissingCount = Math.max(0, missingOneMatches.length - 2);



    return (
        <div className="h-full relative flex flex-col">
            {/* Status Bar Backdrop (Fixed) - Ensures status bar area is always readable */}
            <div
                className={clsx(
                    "absolute top-0 left-0 right-0 z-50 pointer-events-none",
                    "h-[calc(2.5rem+env(safe-area-inset-top))]",
                    "bg-gradient-to-b from-black/80 to-transparent backdrop-blur-md"
                )}
                style={{
                    maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)'
                }}
            />

            {/* Scrollable Content */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto w-full no-scrollbar pb-24"
            >
                {/* Header Content with Safe Area Padding */}
                <div className="px-4 pt-[calc(3rem+env(safe-area-inset-top))]">
                    <h1 className="text-3xl font-bold text-white mb-6">
                        {lang === 'zh' ? '我的吧台' : 'My Bar'}
                    </h1>

                    {/* Inventory Hero Card */}
                    <div
                        onClick={() => setShowModal(true)}
                        className="relative rounded-2xl overflow-hidden mb-4 group cursor-pointer shadow-2xl transition-transform active:scale-[0.98] border border-white/10 h-64"
                    >
                        {/* Background Image */}
                        <img
                            src="/assets/home_bartender.png"
                            alt="Home Bar"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        {/* Dark Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                        {/* Content */}
                        <div className="absolute inset-0 p-5 flex flex-col justify-end">
                            <div className="mb-4">
                                <h2 className="text-2xl font-bold text-white leading-tight mb-1">
                                    {lang === 'zh' ? '打造專屬吧台' : 'Build Your Bar'}
                                </h2>
                                <p className="text-zinc-300 text-sm font-medium">
                                    {lang === 'zh'
                                        ? `目前已有 ${myInventory.size} 項材料`
                                        : `You have ${myInventory.size} ingredients`}
                                </p>
                            </div>

                            {/* Explicit CTA Button */}
                            <button className={clsx(
                                "w-full py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all",
                                myInventory.size > 0
                                    ? "bg-indigo-500 text-white shadow-indigo-500/20"
                                    : "bg-white text-black shadow-black/20"
                            )}>
                                <ShakerIcon size={20} className={myInventory.size > 0 ? "text-white" : "text-black"} />
                                {lang === 'zh'
                                    ? `管理我的庫存 (${myInventory.size})`
                                    : `Manage my inventory (${myInventory.size})`}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sticky Header with Integrated Segmented Control */}
                {/* Removed pt-safe-area to eliminate static gap. Adjusted top position. */}
                <div className="sticky top-[calc(0.5rem+env(safe-area-inset-top))] z-40 px-4 mb-4 shadow-sm transition-all duration-300">
                    <div className="bg-black/60 backdrop-blur-md border border-white/10 p-1 rounded-2xl flex relative isolate">
                        <button
                            onClick={() => setActiveTab('available')}
                            className={clsx(
                                "flex-1 py-2.5 text-sm font-bold text-center rounded-xl transition-all duration-200 relative z-10 active:scale-95",
                                activeTab === 'available' ? "text-white" : "text-white/70"
                            )}
                        >
                            {activeTab === 'available' && (
                                <motion.div
                                    className="absolute inset-0 bg-white/10 border border-white/10 rounded-xl shadow-[0_0_15px_rgba(255,255,255,0.1)] -z-10"
                                    layoutId="activeTabBackground"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.3 }}
                                />
                            )}
                            <span className="relative drop-shadow-sm">
                                {lang === 'zh' ? `可調製酒譜 (${exactMatches.length})` : `Available (${exactMatches.length})`}
                            </span>
                        </button>

                        <button
                            onClick={() => setActiveTab('missing')}
                            className={clsx(
                                "flex-1 py-2.5 text-sm font-bold text-center rounded-xl transition-all duration-200 relative z-10 active:scale-95",
                                activeTab === 'missing' ? "text-white" : "text-white/70"
                            )}
                        >
                            {activeTab === 'missing' && (
                                <motion.div
                                    className="absolute inset-0 bg-white/10 border border-white/10 rounded-xl shadow-[0_0_15px_rgba(255,255,255,0.1)] -z-10"
                                    layoutId="activeTabBackground"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.3 }}
                                />
                            )}
                            <span className="relative drop-shadow-sm">
                                {lang === 'zh' ? `只缺一樣材料 (${missingOneMatches.length})` : `Missing One (${missingOneMatches.length})`}
                            </span>
                        </button>
                    </div>
                </div>

                {/* List Content */}
                <div className="px-4 min-h-[50vh]">
                    {activeTab === 'available' ? (
                        /* Available Tab */
                        allRecipes.length === 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <RecipeCardSkeleton key={i} variant="horizontal" />
                                ))}
                            </div>
                        ) : exactMatches.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-zinc-500">
                                <ShakerIcon size={48} className="mb-4 opacity-20" />
                                <p>{lang === 'zh' ? '庫存不足，無法完整調製任何酒譜' : 'Not enough ingredients.'}</p>
                                <p className="text-xs mt-2">{lang === 'zh' ? '試試新增更多材料？' : 'Try adding more ingredients.'}</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-10">
                                {displayedExactMatches.map((recipe, index) => (
                                    <RecipeCard
                                        key={recipe.id}
                                        recipe={recipe}
                                        lang={lang}
                                        isFavorite={favorites.has(recipe.id)}
                                        toggleFavorite={toggleFavorite}
                                        onClick={() => onSelectRecipe(recipe, exactMatches)}
                                        priority={index < 4}
                                        isLocked={recipe.is_premium && !isPro}
                                    />
                                ))}

                                {/* Locked State Call to Action for Available */}
                                {!isPro && hiddenExactCount > 0 && (
                                    <div className="md:col-span-2">
                                        <LockedContentCard
                                            lang={lang}
                                            onUnlock={presentPaywall}
                                            title={{
                                                zh: `還有 ${hiddenExactCount} 款可調製酒譜等待解鎖`,
                                                en: `Unlock ${hiddenExactCount} Ready-to-Make Recipes`
                                            }}
                                            description={{
                                                zh: '訂閱Premium，查看所有您現在就能調製的酒譜，不錯過任何微醺時刻！',
                                                en: 'Subscribe to Premium to see all recipes you can make with your current ingredients! Don\'t miss out!'
                                            }}
                                            buttonText={{
                                                zh: '立即解鎖查看完整清單',
                                                en: 'Unlock to View Full List'
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        )
                    ) : (
                        /* Missing One Tab */
                        <div className="flex flex-col gap-4 pb-10">
                            {missingOneMatches.length === 0 ? (
                                <div className="text-center py-16 text-zinc-500">
                                    <p>{lang === 'zh' ? '沒有只缺一樣材料的酒譜' : 'No near-miss recipes found.'}</p>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Show limited list if not Pro */}
                                        {displayedMissing.map(({ recipe, missing }) => (
                                            <RecipeCard
                                                key={recipe.id}
                                                recipe={recipe}
                                                lang={lang}
                                                isFavorite={favorites.has(recipe.id)}
                                                toggleFavorite={toggleFavorite}
                                                onClick={() => onSelectRecipe(recipe, missingOneMatches.map(m => m.recipe))}
                                                missingIngredient={missing}
                                                isLocked={recipe.is_premium && !isPro}
                                            />
                                        ))}
                                    </div>

                                    {/* Locked State Call to Action */}
                                    {!isPro && hiddenMissingCount > 0 && (
                                        <LockedContentCard
                                            lang={lang}
                                            onUnlock={presentPaywall}
                                            title={{
                                                zh: `還有 ${hiddenMissingCount} 款推薦酒譜等待解鎖`,
                                                en: `Unlock ${hiddenMissingCount} Recommended Recipes`
                                            }}
                                            description={{
                                                zh: '訂閱Premium，查看所有只缺一樣材料的酒譜建議，不再錯過任何可能性！',
                                                en: "Subscribe to Premium to see all recipes missing just one ingredient. Don't miss out on any possibilities!"
                                            }}
                                            buttonText={{
                                                zh: '立即解鎖查看完整清單',
                                                en: 'Unlock to View Full List'
                                            }}
                                        />
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            <MyBarModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                myInventory={myInventory}
                setMyInventory={setMyInventory}
                lang={lang}
                allIngredients={allIngredients}
            />
        </div>
    );
}
