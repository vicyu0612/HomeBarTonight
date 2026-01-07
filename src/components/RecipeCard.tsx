import { motion, type HTMLMotionProps } from 'framer-motion';
import { Heart, Martini } from 'lucide-react';
import clsx from 'clsx';
import type { Recipe } from '../data/recipes';

interface RecipeCardProps extends Omit<HTMLMotionProps<"div">, 'id'> {
    recipe: Recipe;
    lang: 'en' | 'zh';
    isFavorite: boolean;
    toggleFavorite: (id: string, e?: React.MouseEvent) => void;
    onClick: () => void;
}

export function RecipeCard({
    recipe,
    lang,
    isFavorite,
    toggleFavorite,
    onClick,
    className,
    ...motionProps
}: RecipeCardProps) {
    return (
        <motion.div
            onClick={onClick}
            className={clsx(
                "group bg-zinc-800/30 backdrop-blur-md border border-white/10 shadow-lg rounded-2xl overflow-hidden active:scale-[0.98] transition-all hover:bg-zinc-800/50 hover:border-white/20",
                className
            )}
            {...motionProps}
        >
            <div className="flex p-3 gap-4">
                {/* Image Section */}
                <div className="w-[120px] h-[120px] rounded-xl bg-zinc-800 shrink-0 overflow-hidden relative">
                    {recipe.image ? (
                        <img
                            src={recipe.image}
                            alt={recipe.name[lang]}
                            onError={(e) => {
                                e.currentTarget.src = "/placeholder.png";
                                // If placeholder also fails or we want to show icon instead:
                                // For now, let's stick to simple fallback or keep broken image hidden?
                                // Better: fallback to icon if error?
                                // Simple fix: just keeping existing logic or better.
                                // Existing logic in FavoritesPage sets src to placeholder.
                            }}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            loading="lazy"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-700">
                            <Martini size={24} />
                        </div>
                    )}
                </div>

                {/* Content Section */}
                <div className="flex-1 min-w-0 flex flex-col h-[120px] justify-between">
                    <div>
                        <div className="flex justify-between items-start mb-0.5">
                            <h3 className="text-white font-bold text-lg leading-tight truncate pr-2">
                                {recipe.name[lang]}
                            </h3>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleFavorite(recipe.id, e);
                                }}
                                className={clsx(
                                    "p-2 rounded-full transition-colors -mt-1 -mr-1",
                                    isFavorite ? "text-red-500 bg-red-500/10" : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
                                )}
                            >
                                <Heart size={20} className={clsx(isFavorite && "fill-red-500")} />
                            </button>
                        </div>
                        <p className="text-zinc-400 text-xs line-clamp-2 leading-tight pr-7 h-8">
                            {recipe.description[lang]}
                        </p>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 content-end">
                        {recipe.tags[lang].slice(0, 3).map((tag) => (
                            <span
                                key={tag}
                                className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 bg-white/5 px-2 py-0.5 rounded-md border border-white/5 group-hover:bg-white/10 group-hover:text-zinc-300 transition-colors"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
