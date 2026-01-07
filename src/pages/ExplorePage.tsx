import { supabase } from '../supabaseClient';
import { useEffect, useState } from 'react';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { collections, type Collection } from '../data/collections';
import type { Recipe } from '../data/recipes';
import { RecipeCard } from '../components/RecipeCard';
import clsx from 'clsx';

interface FeaturedBanner {
    id: string;
    title_en: string;
    title_zh: string;
    subtitle_en?: string;
    subtitle_zh?: string;
    cover_image?: string;
    theme_color?: string;
    target_collection_id: string;
}

interface ExplorePageProps {
    lang: 'en' | 'zh';
    onSelectCollection: (id: string) => void;
    allRecipes: Recipe[];
    onSelectRecipe: (recipe: Recipe, list: Recipe[]) => void;
    toggleFavorite: (id: string, e?: React.MouseEvent) => void;
    favorites: Set<string>;
}

export function ExplorePage({
    lang,
    onSelectCollection,
    allRecipes,
    onSelectRecipe,
    toggleFavorite,
    favorites
}: ExplorePageProps) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [featuredBanner, setFeaturedBanner] = useState<FeaturedBanner | null>(null);

    useEffect(() => {
        const fetchBanner = async () => {
            if (!supabase) return;
            const { data } = await supabase
                .from('featured_banners')
                .select('*')
                .eq('is_active', true)
                .single();

            if (data) setFeaturedBanner(data);
        };
        fetchBanner();
    }, []);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        setIsScrolled(e.currentTarget.scrollTop > 20);
    };

    // Helper to get recipes... (keep existing)
    const getPreviewRecipes = (collection: Collection) => {
        return allRecipes.filter(r => {
            if (collection.type === 'curated' && collection.recipeIds) {
                return collection.recipeIds.includes(r.id);
            }
            if (collection.type === 'filter' && collection.filter) {
                return collection.filter(r);
            }
            return false;
        }).slice(0, 5);
    };

    // Resolve Hero Collection
    // Default to first collection, override if banner exists
    const defaultHero = collections[0];
    const heroCollection = featuredBanner ? {
        ...collections.find(c => c.id === featuredBanner.target_collection_id) || defaultHero,
        title: { en: featuredBanner.title_en, zh: featuredBanner.title_zh },
        subtitle: { en: featuredBanner.subtitle_en || '', zh: featuredBanner.subtitle_zh || '' },
        coverImage: featuredBanner.cover_image,
        themeColor: featuredBanner.theme_color || defaultHero.themeColor
    } : defaultHero;

    // Filter out hero from main list if it's there
    // If banner target matches collections[0], we skip [0]. 
    // If banner target matches something else, we arguably should skip that one.
    // For simplicity, let's just render collections.slice(1) as "Other Collections" for now,
    // assuming default behavior. If dynamic, we might duplicate.
    // Better: Filter `otherCollections` to exclude `heroCollection.id`.
    const otherCollections = collections.filter(c => c.id !== heroCollection.id);


    return (
        <div
            className="h-full w-full overflow-y-auto bg-black no-scrollbar"
            onScroll={handleScroll}
        >
            {/* Sticky Header... (keep) */}
            <div className={clsx(
                "fixed top-0 left-0 right-0 z-30 flex justify-center items-center transition-all duration-300",
                "h-[calc(3rem+env(safe-area-inset-top))] px-4 pb-2 pt-[calc(0.5rem+env(safe-area-inset-top))]"
            )}>
                {/* ... (keep background) */}
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

                <div className={clsx(
                    "font-bold text-lg text-white transition-opacity duration-300",
                    isScrolled ? "opacity-100" : "opacity-0"
                )}>
                    {lang === 'zh' ? '探索' : 'Explore'}
                </div>
            </div>

            {/* Content Container */}
            <div className="pb-32 pt-[calc(3rem+env(safe-area-inset-top))]">

                {/* Page Title */}
                <div className="px-4 mb-6 mt-2">
                    <h1 className="text-3xl font-bold text-white mb-1">
                        {lang === 'zh' ? '今晚，你想調點什麼？' : 'What’s the vibe tonight?'}
                    </h1>
                    <p className="text-zinc-400 text-sm">
                        {lang === 'zh' ? '無論什麼場合或心情，都能在這找到最對味的那一杯。' : 'For every mood and moment, we’ve got you.'}
                    </p>
                </div>

                {/* Hero Card */}
                <div className="px-4 mb-10">
                    <div
                        onClick={() => onSelectCollection(heroCollection.id)}
                        className={clsx(
                            "relative w-full aspect-[3/2] md:aspect-[21/9] rounded-2xl overflow-hidden shadow-lg group cursor-pointer border border-white/10", // Updated Styles
                            !heroCollection.coverImage && "bg-gradient-to-br",
                            !heroCollection.coverImage && heroCollection.themeColor
                        )}
                    >
                        {heroCollection.coverImage && (
                            <img
                                src={heroCollection.coverImage}
                                alt="Hero Cover"
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        )}

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/10" />

                        <div className="absolute bottom-0 left-0 right-0 p-6">
                            <div className="flex items-center gap-2 text-orange-300 text-xs font-bold tracking-wider uppercase mb-1">
                                <span className="px-2 py-0.5 rounded-full bg-orange-500/20 border border-orange-500/30 backdrop-blur-md">
                                    {lang === 'zh' ? '本月精選' : 'Featured'}
                                </span>
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-1 leading-tight text-shadow-sm">
                                {lang === 'zh' ? heroCollection.title.zh : heroCollection.title.en}
                            </h2>
                            <p className="text-white/90 text-xs line-clamp-1 mb-0 shadow-black drop-shadow-md">
                                {lang === 'zh' ? heroCollection.subtitle.zh : heroCollection.subtitle.en}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Collection Rows */}
                <div className="space-y-10">
                    {otherCollections.map(collection => (
                        <div key={collection.id} className="flex flex-col gap-4">
                            {/* Header */}
                            <div
                                className="px-4 flex items-center justify-between cursor-pointer active:opacity-70 transition-opacity"
                                onClick={() => onSelectCollection(collection.id)}
                            >
                                <div>
                                    <h3 className="text-xl font-bold text-white">
                                        {lang === 'zh' ? collection.title.zh : collection.title.en}
                                    </h3>
                                    <p className="text-zinc-400 text-xs">
                                        {lang === 'zh' ? collection.subtitle.zh : collection.subtitle.en}
                                    </p>
                                </div>
                                <ChevronRight className="text-zinc-600" />
                            </div>

                            {/* Horizontal Scroll List */}
                            <div className="overflow-x-auto no-scrollbar pb-4 flex gap-4 snap-x snap-mandatory">
                                <div className="snap-start shrink-0 w-0" /> {/* Leading Spacer (w-0 + gap-4 = 1rem offset) */}
                                {getPreviewRecipes(collection).map(recipe => (
                                    <div key={recipe.id} className="snap-start shrink-0 w-[160px]">
                                        <RecipeCard
                                            recipe={recipe}
                                            isFavorite={favorites.has(recipe.id)}
                                            toggleFavorite={toggleFavorite}
                                            onClick={() => onSelectRecipe(recipe, getPreviewRecipes(collection))}
                                            lang={lang}
                                            variant="vertical"
                                        />
                                    </div>
                                ))}
                                {/* See More Card (Vertical Style) */}
                                <button
                                    onClick={() => onSelectCollection(collection.id)}
                                    className="snap-start shrink-0 w-[160px] rounded-2xl bg-zinc-900/50 border border-white/5 flex flex-col items-center justify-center gap-3 active:scale-95 transition-transform aspect-[3/4]"
                                >
                                    <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400">
                                        <ArrowRight size={24} />
                                    </div>
                                    <span className="text-zinc-500 text-sm font-medium">
                                        {lang === 'zh' ? '更多' : 'See All'}
                                    </span>
                                </button>
                                <div className="snap-start shrink-0 w-0" /> {/* Trailing Spacer */}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
