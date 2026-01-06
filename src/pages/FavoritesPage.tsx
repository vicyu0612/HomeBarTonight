import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import type { Recipe } from '../data/recipes';


interface FavoritesPageProps {
    recipes: Recipe[];
    favorites: Set<string>;
    toggleFavorite: (id: string, e?: React.MouseEvent) => void;
    onSelectRecipe: (recipe: Recipe) => void;
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
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                key={recipe.id}
                                onClick={() => onSelectRecipe(recipe)}
                                whileTap={{ scale: 0.98 }}
                                className="bg-zinc-800/30 backdrop-blur-md border border-white/10 shadow-lg rounded-2xl overflow-hidden active:scale-[0.98] transition-all"
                            >
                                <div className="flex p-3 gap-4">
                                    <div className="w-[120px] h-[120px] rounded-xl bg-zinc-800 shrink-0 overflow-hidden relative">
                                        <img
                                            src={recipe.image}
                                            alt={recipe.name[lang]}
                                            onError={(e) => {
                                                e.currentTarget.src = "/placeholder.png";
                                                e.currentTarget.onerror = null;
                                            }}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    <div className="flex-1 min-w-0 flex flex-col h-[120px] justify-between">
                                        <div>
                                            <div className="flex justify-between items-start mb-0.5">
                                                <h3 className="text-white font-bold text-lg leading-tight truncate pr-2">{recipe.name[lang]}</h3>
                                                <button
                                                    onClick={(e) => toggleFavorite(recipe.id, e)}
                                                    className="p-2 rounded-full transition-colors -mt-1 -mr-1 text-red-500 bg-red-500/10"
                                                >
                                                    <Heart size={20} className="fill-red-500" />
                                                </button>
                                            </div>
                                            <p className="text-zinc-400 text-xs mt-1 line-clamp-2 leading-tight pr-7 h-8">{recipe.description[lang]}</p>
                                        </div>
                                        <div className="flex flex-wrap gap-1.5 content-end">
                                            {recipe.tags[lang].slice(0, 3).map(tag => (
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
                </div>
            )}
        </div>
    );
}
