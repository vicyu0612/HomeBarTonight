import { supabase } from '../supabaseClient';
import { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { PullToRefresh } from '../components/PullToRefresh';
import type { Collection } from '../data/collections';
import type { Recipe } from '../data/recipes';
import { RecipeCard } from '../components/RecipeCard';
import { RecipeCardSkeleton } from '../components/RecipeCardSkeleton';
import clsx from 'clsx';
import { useState } from 'react';
import { useSwipeBack } from '../hooks/useSwipeBack';

interface CollectionDetailPageProps {
    collectionId: string;
    onBack: () => void;
    allRecipes: Recipe[];
    allCollections: Collection[];
    filterRecipes: (collection: Collection, recipes: Recipe[]) => Recipe[];
    onSelectRecipe: (recipe: Recipe, list: Recipe[]) => void;
    toggleFavorite: (id: string, e?: React.MouseEvent) => void;
    favorites: Set<string>;
    lang: 'en' | 'zh';
    onRefresh?: () => Promise<void>;
}

export function CollectionDetailPage({
    collectionId,
    onBack,
    allRecipes,
    allCollections,
    filterRecipes,
    onSelectRecipe,
    toggleFavorite,
    favorites,
    lang,
    onRefresh
}: CollectionDetailPageProps) {
    useSwipeBack(onBack);

    const collection = allCollections.find(c => c.id === collectionId);
    const [isScrolled, setIsScrolled] = useState(false);
    const [dynamicCover, setDynamicCover] = useState<string | null>(null);

    // Fetch dynamic metadata
    useEffect(() => {
        if (!collectionId || !supabase) return;

        const fetchMeta = async () => {
            if (!supabase) return;
            const { data } = await supabase
                .from('collections')
                .select('cover_image, cover_image_en')
                .eq('id', collectionId)
                .single();

            if (data) {
                // If lang is en and we have en image, use it. Otherwise default.
                if (lang === 'en' && data.cover_image_en) {
                    setDynamicCover(data.cover_image_en);
                } else if (data.cover_image) {
                    setDynamicCover(data.cover_image);
                }
            }
        };
        fetchMeta();
    }, [collectionId, lang]); // Add lang dependency

    // Effective Cover Image: Priority Dynamic -> Local (Lang aware) -> Local Default
    const effectiveCover = dynamicCover || (lang === 'en' && collection?.coverImageEn ? collection.coverImageEn : collection?.coverImage);

    // Filter recipes based on collection type using helper
    const collectionRecipes = collection ? filterRecipes(collection, allRecipes) : [];

    // Fallback for legacy local collections if helper fails or returns empty (optional safety)
    if (collectionRecipes.length === 0 && collection?.filter) {
        // collectionRecipes.push(...allRecipes.filter(collection.filter)); 
        // Actually filterRecipes should handle it if we passed the right logic.
        // But for safety let's leave as is, since filterRecipes in App.tsx handles IDs and Rules.
        // It does NOT handle the functional `filter` property which is not serializable.
        // So we should check for that here as a fallback!
        const legacyFiltered = allRecipes.filter(collection.filter);
        if (legacyFiltered.length > 0) {
            // Merge unique? Or just use legacy if dynamic returned nothing?
            // Local collections use `filter` function in `collections.ts`.
            // Our App.tsx `filterRecipes` only handles `recipeIds` and `filterRules`.
            // So we MUST use `collection.filter` if present.
            collectionRecipes.push(...legacyFiltered);
        }
    }

    // Handle Scroll for sticky header
    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        setIsScrolled(e.currentTarget.scrollTop > 20);
    };

    if (!collection) {
        return (
            <div className="h-full w-full bg-black flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mb-4 text-zinc-500">
                    <ArrowLeft size={24} />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Collection Not Found</h2>
                <div className="text-left bg-zinc-900 p-4 rounded-lg w-full max-w-sm overflow-hidden text-xs font-mono text-zinc-400">
                    <p className="mb-2 text-red-400">Target ID: "{collectionId}"</p>
                    <p className="mb-1 text-zinc-600 text-[10px]">Path: {window.location.pathname}</p>
                    <p className="mb-1 text-zinc-500">Available IDs ({allCollections.length}):</p>
                    <p className="break-all">{allCollections.map(c => c.id).join(', ')}</p>
                </div>
                <button
                    onClick={onBack}
                    className="mt-8 px-6 py-3 bg-white text-black font-bold rounded-full active:scale-95 transition-transform"
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="relative h-full w-full bg-black overflow-hidden flex flex-col">
            {/* Header (Absolute/Overlay) */}
            <div className={clsx(
                "absolute top-0 left-0 right-0 z-30 transition-all duration-300 pointer-events-none",
                "h-[calc(4rem+env(safe-area-inset-top))] px-4 pb-2 pt-[calc(1rem+env(safe-area-inset-top))]"
            )}>
                {/* Gradient Blur Background */}
                <div
                    className={clsx(
                        "absolute inset-0 -z-10 transition-opacity duration-300",
                        isScrolled ? "opacity-100" : "opacity-0",
                        "bg-black/60 backdrop-blur-xl"
                    )}
                    style={{
                        maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
                        WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)'
                    }}
                />

                <div className="flex items-center gap-3 h-full max-w-5xl mx-auto w-full md:px-6 pointer-events-auto">
                    <button
                        onClick={onBack}
                        className="p-3 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white border border-white/10 shadow-lg hover:bg-black/50 active:scale-95 transition-all"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <span className={clsx(
                        "font-bold text-lg text-white transition-opacity duration-300",
                        isScrolled ? "opacity-100" : "opacity-0"
                    )}>
                        {collection.title[lang]}
                    </span>
                </div>
            </div>

            {/* Scrollable Content */}
            <PullToRefresh
                className="flex-1 overflow-y-auto no-scrollbar w-full h-full bg-black"
                onScroll={handleScroll}
                onRefresh={onRefresh || (async () => { })}
            >


                {/* Hero Area */}
                <div className={clsx(
                    "relative pt-48 pb-8 px-6 md:pt-64 md:pb-16 overflow-hidden",
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

                    <div className="relative z-10 max-w-5xl mx-auto w-full"> {/* Centered content for desktop */}
                        <h1 className="text-3xl font-bold text-white mb-2 text-shadow-lg">
                            {lang === 'zh' ? collection.title.zh : collection.title.en}
                        </h1>
                        <p className="text-white/90 text-sm leading-relaxed max-w-md drop-shadow-md">
                            {lang === 'zh' ? collection.description?.zh : collection.description?.en}
                        </p>
                    </div>
                </div>

                {/* DEBUG OVERLAY */}
                {/* 
            <div className="fixed top-20 left-4 z-[100] bg-black/80 text-white text-xs p-2 pointer-events-none">
                ID: {collectionId}<br/>
                Found: {collection ? 'Yes' : 'No'}<br/>
                Recipes In: {allRecipes.length}<br/>
                Recipes Out: {collectionRecipes.length}<br/>
                Type: {collection?.type}<br/>
                Rules: {JSON.stringify(collection?.filterRules || collection?.recipeIds)}
            </div>
            */}

                {/* Recipe List - 2 Column Grid */}
                <div className="px-4 py-6 pb-48">
                    {collectionRecipes.length === 0 && (
                        <div className="text-white text-center mt-10 opacity-70">
                            <p>No recipes found in this collection.</p>
                            <p className="text-xs mt-2 text-zinc-500">
                                ID: {collectionId} / Total: {allRecipes.length}
                            </p>
                        </div>
                    )}
                    <div className="grid grid-cols-2 gap-3">
                        {allRecipes.length === 0 ? (
                            Array.from({ length: 6 }).map((_, i) => (
                                <RecipeCardSkeleton key={i} variant="vertical" />
                            ))
                        ) : (
                            collectionRecipes.map((recipe, index) => (
                                <RecipeCard
                                    key={recipe.id}
                                    recipe={recipe}
                                    isFavorite={favorites.has(recipe.id)}
                                    toggleFavorite={toggleFavorite}
                                    onClick={() => onSelectRecipe(recipe, collectionRecipes)}
                                    lang={lang}
                                    variant="vertical"
                                    priority={index < 6}
                                />
                            ))
                        )}
                    </div>
                </div>
            </PullToRefresh>
        </div >
    );
}
