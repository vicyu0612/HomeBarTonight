import { ArrowLeft } from 'lucide-react';
import { collections } from '../data/collections';
import type { Recipe } from '../data/recipes';
import { RecipeCard } from '../components/RecipeCard';
import clsx from 'clsx';
import { useState } from 'react';

interface CollectionDetailPageProps {
    collectionId: string;
    onBack: () => void;
    allRecipes: Recipe[];
    onSelectRecipe: (recipe: Recipe, list: Recipe[]) => void;
    toggleFavorite: (id: string, e?: React.MouseEvent) => void;
    favorites: Set<string>;
    lang: 'en' | 'zh';
}

export function CollectionDetailPage({
    collectionId,
    onBack,
    allRecipes,
    onSelectRecipe,
    toggleFavorite,
    favorites,
    lang
}: CollectionDetailPageProps) {
    const collection = collections.find(c => c.id === collectionId);
    const [isScrolled, setIsScrolled] = useState(false);

    // Filter recipes based on collection type
    const collectionRecipes = allRecipes.filter(r => {
        if (!collection) return false;
        if (collection.type === 'curated' && collection.recipeIds) {
            return collection.recipeIds.includes(r.id);
        }
        if (collection.type === 'filter' && collection.filter) {
            return collection.filter(r);
        }
        return false;
    });

    // Handle Scroll for sticky header
    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        setIsScrolled(e.currentTarget.scrollTop > 20);
    };

    if (!collection) return null;

    return (
        <div
            className="h-full w-full overflow-y-auto bg-black no-scrollbar"
            onScroll={handleScroll}
        >
            {/* Sticky Header */}
            <div className={clsx(
                "fixed top-0 left-0 right-0 z-30 transition-all duration-300",
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

                <div className="flex items-center gap-3 h-full">
                    <button
                        onClick={onBack}
                        className="w-10 h-10 rounded-full bg-zinc-800/50 flex items-center justify-center text-white backdrop-blur-md active:scale-95 transition-transform"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <span className={clsx(
                        "font-bold text-lg text-white transition-opacity duration-300",
                        isScrolled ? "opacity-100" : "opacity-0"
                    )}>
                        {lang === 'zh' ? collection.title.zh : collection.title.en}
                    </span>
                </div>
            </div>

            {/* Hero Area */}
            <div className={clsx(
                "relative pt-32 pb-8 px-6",
                "bg-gradient-to-b",
                collection.themeColor || "from-zinc-800 to-black"
            )}>
                <div className="absolute inset-0 bg-black/40" /> {/* Dimmer */}

                <div className="relative z-10">
                    <h1 className="text-3xl font-bold text-white mb-2">
                        {lang === 'zh' ? collection.title.zh : collection.title.en}
                    </h1>
                    <p className="text-white/80 text-sm leading-relaxed max-w-md">
                        {lang === 'zh' ? collection.description?.zh : collection.description?.en}
                    </p>
                </div>
            </div>

            {/* Recipe List */}
            <div className="px-4 py-6 space-y-4 pb-32">
                {collectionRecipes.map(recipe => (
                    <RecipeCard
                        key={recipe.id}
                        recipe={recipe}
                        isFavorite={favorites.has(recipe.id)}
                        toggleFavorite={toggleFavorite}
                        onClick={() => onSelectRecipe(recipe, collectionRecipes)}
                        lang={lang}
                    />
                ))}
            </div>
        </div>
    );
}
