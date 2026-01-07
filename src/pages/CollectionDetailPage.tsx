import { supabase } from '../supabaseClient';
import { useEffect } from 'react';
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
    const [dynamicCover, setDynamicCover] = useState<string | null>(null);

    // Fetch dynamic metadata
    useEffect(() => {
        if (!collectionId || !supabase) return;

        // Optimistic check: if we have local, use it first (already rendered), then update if DB differs
        // Actually, just fetch silently.
        const fetchMeta = async () => {
            if (!supabase) return;
            const { data } = await supabase
                .from('collections_meta')
                .select('cover_image')
                .eq('id', collectionId)
                .single();

            if (data?.cover_image) {
                setDynamicCover(data.cover_image);
            }
        };
        fetchMeta();
    }, [collectionId]);

    // Effective Cover Image
    const effectiveCover = dynamicCover || collection?.coverImage;

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
                "h-[calc(4rem+env(safe-area-inset-top))] px-4 pb-2 pt-[calc(1rem+env(safe-area-inset-top))]"
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

                <div className="flex items-center gap-3 h-full max-w-5xl mx-auto w-full md:px-6">
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
                "relative pt-32 pb-8 px-6 overflow-hidden",
                "bg-zinc-900" // Fallback bg
            )}>
                {/* Background Image or Gradient */}
                {effectiveCover ? (
                    <img
                        src={effectiveCover}
                        alt={collection.title.en}
                        className="absolute inset-0 w-full h-full object-cover opacity-60"
                    />
                ) : (
                    <div className={clsx("absolute inset-0 bg-gradient-to-b", collection.themeColor || "from-zinc-800 to-black")} />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/60" /> {/* Gradient Overlay */}

                <div className="relative z-10">
                    <h1 className="text-3xl font-bold text-white mb-2 text-shadow-lg">
                        {lang === 'zh' ? collection.title.zh : collection.title.en}
                    </h1>
                    <p className="text-white/90 text-sm leading-relaxed max-w-md drop-shadow-md">
                        {lang === 'zh' ? collection.description?.zh : collection.description?.en}
                    </p>
                </div>
            </div>

            {/* Recipe List - 2 Column Grid */}
            <div className="px-4 py-6 pb-48">
                <div className="grid grid-cols-2 gap-3">
                    {collectionRecipes.map(recipe => (
                        <RecipeCard
                            key={recipe.id}
                            recipe={recipe}
                            isFavorite={favorites.has(recipe.id)}
                            toggleFavorite={toggleFavorite}
                            onClick={() => onSelectRecipe(recipe, collectionRecipes)}
                            lang={lang}
                            variant="vertical"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
