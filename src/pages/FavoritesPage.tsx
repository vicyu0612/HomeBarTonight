import { AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { RecipeCard } from '../components/RecipeCard';
import type { Recipe } from '../data/recipes';
import { useState } from 'react';
import clsx from 'clsx';


interface FavoritesPageProps {
    recipes: Recipe[];
    favorites: Set<string>;
    toggleFavorite: (id: string, e?: React.MouseEvent) => void;
    onSelectRecipe: (recipe: Recipe, list?: Recipe[]) => void;
    lang: 'en' | 'zh';
}

export function FavoritesPage({ recipes, favorites, toggleFavorite, onSelectRecipe, lang }: FavoritesPageProps) {
    const favoriteRecipes = recipes.filter(r => favorites.has(r.id));
    const [isScrolled, setIsScrolled] = useState(false);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        setIsScrolled(e.currentTarget.scrollTop > 40);
    };

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
                <span className={clsx(
                    "font-bold text-white transition-opacity duration-300",
                    isScrolled ? "opacity-100" : "opacity-0"
                )}>
                    {lang === 'zh' ? '我的最愛' : 'Favorites'}
                </span>
            </div>

            {/* Scrollable Content */}
            <div
                className="flex-1 overflow-y-auto px-4 pb-24 no-scrollbar pt-[calc(3rem+env(safe-area-inset-top))]"
                onScroll={handleScroll}
            >
                <h1 className="text-3xl font-bold text-white mb-6 mt-2">
                    {lang === 'zh' ? '我的最愛' : 'Favorites'}
                </h1>

                {favoriteRecipes.length === 0 ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-500 pt-[calc(3rem+env(safe-area-inset-top))] pb-24 pointer-events-none">
                        <Heart size={48} className="mb-4 opacity-20" />
                        <p>{lang === 'zh' ? '還沒有收藏任何調酒喔' : 'No favorites yet.'}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <AnimatePresence mode="popLayout">
                            {favoriteRecipes.map((recipe) => (
                                <RecipeCard
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    key={recipe.id}
                                    recipe={recipe}
                                    lang={lang}
                                    isFavorite={true}
                                    toggleFavorite={toggleFavorite}
                                    onClick={() => onSelectRecipe(recipe, favoriteRecipes)}
                                    whileTap={{ scale: 0.98 }}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
}
