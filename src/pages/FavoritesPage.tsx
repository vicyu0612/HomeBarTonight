import { AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { RecipeCard } from '../components/RecipeCard';
import type { Recipe } from '../data/recipes';


interface FavoritesPageProps {
    recipes: Recipe[];
    favorites: Set<string>;
    toggleFavorite: (id: string, e?: React.MouseEvent) => void;
    onSelectRecipe: (recipe: Recipe, list?: Recipe[]) => void;
    lang: 'en' | 'zh';
}

export function FavoritesPage({ recipes, favorites, toggleFavorite, onSelectRecipe, lang }: FavoritesPageProps) {
    const favoriteRecipes = recipes.filter(r => favorites.has(r.id));

    return (
        <div className="pt-6 pb-24 px-6 min-h-screen flex flex-col">
            <h1 className="text-3xl font-bold text-white mb-6 sticky top-0 pt-10 pb-4 bg-black/80 backdrop-blur-md z-40 -mx-6 px-6">
                {lang === 'zh' ? '我的最愛' : 'Favorites'}
            </h1>

            {favoriteRecipes.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 pb-20">
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
    );
}
