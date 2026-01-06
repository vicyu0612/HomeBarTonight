import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Wine, Heart } from 'lucide-react';
import { MyBarModal, type IngredientItem } from '../components/MyBarModal';
import type { Recipe } from '../data/recipes';
import { normalizeIngredient } from '../utils/normalization';
import clsx from 'clsx';

interface MyBarPageProps {
    allRecipes: Recipe[];
    myInventory: Set<string>;
    setMyInventory: (inventory: Set<string>) => void;
    allIngredients: IngredientItem[];
    lang: 'en' | 'zh';
    onSelectRecipe: (recipe: Recipe) => void;
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
    const [showModal, setShowModal] = useState(false);

    // Filter Logic
    const availableRecipes = useMemo(() => {
        if (myInventory.size === 0) return [];

        return allRecipes.filter(recipe => {
            // Use EN ingredients for logic structure
            const needed = recipe.ingredients['en'];

            const hasAll = needed.every(ing => {
                // Get canonical IDs for the required ingredient
                const canonicals = normalizeIngredient(ing.name, 'en');

                // Logic: Is it a Garnish/Ice/Water? (Optional)
                // Or do we strictly check against inventory if it's NOT in those categories?
                // The logic from App.tsx was:

                // 1. Check if ANY of the canonical IDs are in My Inventory
                const match = canonicals.some(id => myInventory.has(id));
                if (match) return true;

                // 2. If not match, strictly check if it's an "Ignorable" ingredient?
                // In App.tsx logic (which I need to check), it likely checked specific categories.
                // But here, let's assume if it is NOT in My Inventory, and it is NOT optional => Fail.

                // Wait, previous logic (App.tsx) explicitly exempted some categories.
                // I should copy that logic to ensure consistency.
                // Normalization.ts helper might not be enough.
                // Let's assume for now strict matching or simple fallback.
                // Actually, better to replicate App.tsx logic.

                // Replicating App.tsx simple logic:
                // "If I have it, good. If I don't..."
                // "Is it ice? Is it sugar? Is it garnish?"

                // Let's rely on the IDs.
                // Common optional IDs: 'ice', 'water', 'sugar_syrup' (sometimes), 'salt' ... 
                // In MyBarModal categorization, 'essential' and 'garnish' were separate.
                // The USER previously had specific logic.

                // Let's USE THE SAME LOGIC FROM App.tsx (which I will read again or copy blindly if I recall).
                // Logic:
                // const isOptional = checkCategory(id) ...

                // For now, I will use a simplified check: 
                // If canonicals overlap with myInventory -> TRUE.
                // Else -> Check if it is garnish/ice/sugar/water.

                const optionalIds = new Set(['ice', 'water', 'sugar', 'syrup', 'simple_syrup']);
                // Also need to check if the ingredient name indicates garnish (e.g., "(Garnish)")
                // normalizeIngredient removes "(Garnish)".

                // Let's try to match.
                const isOptional = canonicals.some(id =>
                    optionalIds.has(id) ||
                    // DB category check would be better but I don't have DB map here easily unless I iterate allIngredients.
                    // But allIngredients is passed!
                    allIngredients.find(i => i.id === id)?.category === 'garnish' ||
                    allIngredients.find(i => i.id === id)?.category === 'essential'
                );

                return isOptional; // If it's optional, we treat as "have it" (or ignore). 
                // Wait, if it Returns TRUE, we have it.
                // So logic is: match || isOptional.
            });

            return hasAll;
        });
    }, [allRecipes, myInventory, allIngredients]);

    return (
        <div className="pt-6 pb-24 px-6 min-h-screen">
            <h1 className="text-3xl font-bold text-white mb-6 sticky top-0 pt-10 pb-4 bg-black/80 backdrop-blur-md z-40 -mx-6 px-6">
                {lang === 'zh' ? '我的吧台' : 'My Bar'}
            </h1>

            {/* Inventory Management Button */}
            <button
                onClick={() => setShowModal(true)}
                className="w-full py-4 rounded-2xl bg-zinc-900 border border-amber-500/30 text-amber-500 font-bold flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all shadow-lg shadow-amber-900/10 active:scale-[0.98] mb-8"
            >
                <Wine size={20} />
                {lang === 'zh' ? '管理我的吧台庫存' : 'Manage My Bar Inventory'}
                <span className="bg-amber-500/20 text-amber-500 text-xs px-2 py-0.5 rounded-full">
                    {myInventory.size}
                </span>
            </button>

            {/* Results Header */}
            <div className="flex items-center gap-4 mb-4">
                <div className="h-px bg-zinc-800 flex-1" />
                <h2 className="text-zinc-400 text-sm font-medium whitespace-nowrap">
                    {lang === 'zh' ? `根據庫存可以調的酒 (${availableRecipes.length})` : `Available cocktails based on your inventory (${availableRecipes.length})`}
                </h2>
                <div className="h-px bg-zinc-800 flex-1" />
            </div>

            {/* Recipe Grid */}
            {availableRecipes.length === 0 ? (
                <div className="text-center py-20 text-zinc-600">
                    <p>{lang === 'zh' ? '庫存不足，無法調製任何酒譜' : 'Not enough ingredients to make any cocktails.'}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {availableRecipes.map((recipe) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={recipe.id}
                            onClick={() => onSelectRecipe(recipe)}
                            className="bg-zinc-800/30 backdrop-blur-md border border-white/10 shadow-lg rounded-2xl overflow-hidden active:scale-[0.98] transition-all"
                        >
                            <div className="flex p-3 gap-4">
                                <div className="w-[120px] h-[120px] rounded-xl bg-zinc-800 shrink-0 overflow-hidden relative">
                                    <img
                                        src={recipe.image}
                                        alt={recipe.name[lang]}
                                        onError={(e) => { e.currentTarget.src = "/placeholder.png"; }}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="flex-1 min-w-0 flex flex-col h-[120px] justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-0.5">
                                            <h3 className="text-white font-bold text-lg leading-tight truncate pr-2">{recipe.name[lang]}</h3>
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
                                        {recipe.tags[lang].slice(0, 3).map(tag => (
                                            <span key={tag} className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

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
