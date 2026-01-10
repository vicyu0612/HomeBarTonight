import { useState, useMemo, useEffect } from 'react';
import { MyBarModal, type IngredientItem } from '../components/MyBarModal';
import { ShakerIcon } from '../components/ShakerIcon';
import clsx from 'clsx';
import type { Recipe } from '../data/recipes';
import { normalizeIngredient } from '../utils/normalization';
import { RecipeCard } from '../components/RecipeCard';
import { RecipeCardSkeleton } from '../components/RecipeCardSkeleton';

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

    const [isScrolled, setIsScrolled] = useState(false);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        setIsScrolled(e.currentTarget.scrollTop > 40);
    };

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
                    // Check if *any* of the canonical IDs are ignorable OR if it's categorized as 'essential'/'garnish'
                    // Actually, let's stick to the explicit set plus category check for robustness
                    const isIgnorable = canonicals.some(id =>
                        ignorableIngredients.has(id)
                    );

                    if (!isIgnorable) {
                        // We are missing this real ingredient.
                        // Attempt to find the DB Item to get the correct localized name
                        let displayName = ing.name;

                        // Try to find the item in allIngredients using the canonical IDs
                        const dbItem = allIngredients.find(item => canonicals.includes(item.id));

                        if (dbItem) {
                            displayName = lang === 'zh' ? dbItem.name_zh : dbItem.name_en;
                        } else {
                            // Fallback: Check if we can find it in the ZH recipe ingredients directly?
                            // Since we are iterating 'en' needed, we can try to look at 'zh' at the same index?
                            // But let's trust the DB lookup first. If DB lookup fails, keep the EN name or try normalization fallback.
                            // Actually, if we can't find it in DB, we likely can't translate it easily without index matching.
                            // Let's stick to the mapped name if found, otherwise original.
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

    return (
        <div className="h-full relative flex flex-col">
            {/* Sticky Header */}
            <div className={clsx(
                "absolute top-0 left-0 right-0 z-20 flex justify-center items-center transition-all duration-300",
                "h-[calc(3rem+env(safe-area-inset-top))] px-4 pb-2 pt-[calc(0.5rem+env(safe-area-inset-top))]"
            )}>
                {/* Gradient Blur Background */}
                <div
                    className={clsx(
                        "absolute inset-0 -z-10 transition-opacity duration-300",
                        isScrolled ? "opacity-100" : "opacity-0",
                        "bg-gradient-to-b from-black to-transparent"
                    )}
                    style={{
                        backdropFilter: 'blur(60px)',
                        WebkitBackdropFilter: 'blur(60px)',
                        maskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
                        WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)'
                    }}
                />
                {/* Title Removed
                <span className={clsx(
                    "font-bold text-white transition-opacity duration-300",
                    isScrolled ? "opacity-100" : "opacity-0"
                )}>
                    {lang === 'zh' ? '我的吧台' : 'My Bar'}
                </span>
                */}
            </div>

            {/* Scrollable Content */}
            <div
                className="flex-1 overflow-y-auto px-4 pb-24 no-scrollbar pt-[calc(3rem+env(safe-area-inset-top))]"
                onScroll={handleScroll}
            >
                <h1 className="text-3xl font-bold text-white mb-6 mt-2">
                    {lang === 'zh' ? '我的吧台' : 'My Bar'}
                </h1>

                {/* Inventory Hero Card */}
                <div
                    onClick={() => setShowModal(true)}
                    className="relative rounded-2xl overflow-hidden mb-8 group cursor-pointer shadow-2xl transition-transform active:scale-[0.98] border border-white/10 h-64"
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

                {/* --- Section 1: Exact Matches --- */}
                <div className="flex items-center gap-4 mb-4">
                    <div className="h-px bg-zinc-800 flex-1" />
                    <h2 className="text-zinc-400 text-sm font-medium whitespace-nowrap">
                        {lang === 'zh' ? `根據庫存可以調的酒 (${exactMatches.length})` : `Available cocktails (${exactMatches.length})`}
                    </h2>
                    <div className="h-px bg-zinc-800 flex-1" />
                </div>

                {allRecipes.length === 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <RecipeCardSkeleton key={i} variant="horizontal" />
                        ))}
                    </div>
                ) : exactMatches.length === 0 ? (
                    <div className="text-center py-10 text-zinc-600 mb-8">
                        <p>{lang === 'zh' ? '庫存不足，無法完整調製任何酒譜' : 'Not enough ingredients to make a full cocktail.'}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                        {exactMatches.map((recipe, index) => (
                            <RecipeCard
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                key={recipe.id}
                                recipe={recipe}
                                lang={lang}
                                isFavorite={favorites.has(recipe.id)}
                                toggleFavorite={toggleFavorite}
                                onClick={() => onSelectRecipe(recipe, exactMatches)}
                                priority={index < 4}
                            />
                        ))}
                    </div>
                )}

                {/* --- Section 2: Missing One Ingredient --- */}
                {missingOneMatches.length > 0 && (
                    <>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="h-px bg-indigo-400/20 flex-1" />
                            <h2 className="text-indigo-400 text-sm font-bold whitespace-nowrap">
                                {lang === 'zh' ? `只缺一樣材料 (${missingOneMatches.length})` : `Missing 1 Ingredient (${missingOneMatches.length})`}
                            </h2>
                            <div className="h-px bg-indigo-400/20 flex-1" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {missingOneMatches.map(({ recipe, missing }, index) => (
                                <RecipeCard
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    key={recipe.id}
                                    recipe={recipe}
                                    lang={lang}
                                    isFavorite={favorites.has(recipe.id)}
                                    toggleFavorite={toggleFavorite}
                                    onClick={() => onSelectRecipe(recipe, missingOneMatches.map(m => m.recipe))}
                                    missingIngredient={missing} // Pass the missing item
                                />
                            ))}
                        </div>
                    </>
                )}
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
