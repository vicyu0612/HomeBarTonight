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
    variant?: 'horizontal' | 'vertical';
}

export function RecipeCard({
    recipe,
    lang,
    isFavorite,
    toggleFavorite,
    onClick,
    className,
    variant = 'horizontal',
    ...motionProps
}: RecipeCardProps) {
    // Shared Heart Button
    const HeartButton = (
        <button
            onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(recipe.id, e);
            }}
            className={clsx(
                "p-2 rounded-full transition-colors",
                variant === 'vertical'
                    ? "bg-black/40 backdrop-blur-md text-white hover:bg-black/60"
                    : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5 -mt-1 -mr-1",
                isFavorite && variant === 'horizontal' ? "text-red-500 bg-red-500/10" : "",
                isFavorite && variant === 'vertical' ? "text-red-500 bg-black/40" : ""
            )}
        >
            <Heart size={20} className={clsx(isFavorite && "fill-red-500")} />
        </button>
    );

    // Shared Image Logic
    const ImageContent = (
        <>
            {recipe.image ? (
                <img
                    src={recipe.image}
                    alt={recipe.name[lang]}
                    onError={(e) => { e.currentTarget.src = "/placeholder.png"; }}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-700">
                    <Martini size={24} />
                </div>
            )}
        </>
    );

    if (variant === 'vertical') {
        return (
            <motion.div
                onClick={onClick}
                className={clsx(
                    "group bg-zinc-800/30 backdrop-blur-md border border-white/10 shadow-lg rounded-2xl overflow-hidden active:scale-[0.98] transition-all hover:bg-zinc-800/50 hover:border-white/20 h-full flex flex-col",
                    className
                )}
                {...motionProps}
            >
                {/* Image Area with Overlay Heart */}
                <div className="w-full aspect-square bg-zinc-800 relative overflow-hidden">
                    {ImageContent}
                    <div className="absolute top-2 right-2 z-10">
                        {HeartButton}
                    </div>
                </div>

                {/* Content Area */}
                <div className="p-4 flex flex-col flex-1">
                    <h3 className="text-white font-bold text-lg mb-1 leading-tight line-clamp-1">
                        {recipe.name[lang]}
                    </h3>
                    <p className="text-zinc-400 text-xs line-clamp-2 mb-3 flex-1">
                        {recipe.description[lang]}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mt-auto">
                        {recipe.tags[lang].slice(0, 2).map((tag) => (
                            <span
                                key={tag}
                                className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 bg-white/5 px-2 py-0.5 rounded-md border border-white/5"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </motion.div>
        );
    }

    // Default Horizontal Layout
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
                <div className="w-[120px] h-[120px] rounded-xl bg-zinc-800 shrink-0 overflow-hidden relative">
                    {ImageContent}
                </div>

                <div className="flex-1 min-w-0 flex flex-col h-[120px] justify-between">
                    <div>
                        <div className="flex justify-between items-start mb-0.5">
                            <h3 className="text-white font-bold text-lg leading-tight truncate pr-2">
                                {recipe.name[lang]}
                            </h3>
                            {HeartButton}
                        </div>
                        <p className="text-zinc-400 text-xs line-clamp-2 leading-tight pr-7 h-8">
                            {recipe.description[lang]}
                        </p>
                    </div>

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
