import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { recipes as localRecipes, type Recipe } from '../data/recipes';
import { collections as fallbackCollections, type Collection } from '../data/collections';

export function useRecipes() {
    const [allRecipes, setAllRecipes] = useState<Recipe[]>(localRecipes);
    const [allCollections, setAllCollections] = useState<Collection[]>(fallbackCollections);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        if (!supabase) return;
        setLoading(true);
        try {
            // 1. Fetch Recipes
            const { data: recipeData } = await supabase.from('recipes').select('*').order('id', { ascending: true });

            if (recipeData && recipeData.length > 0) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                setAllRecipes(recipeData.map((r: any) => ({
                    id: r.id,
                    name: r.name,
                    type: r.type,
                    baseSpirit: r.base_spirit,
                    ingredients: r.ingredients,
                    steps: r.steps,
                    tags: r.tags,
                    description: r.description,
                    specs: r.specs,
                    color: r.color,
                    image: r.image ? `${r.image}?v=${new Date().getTime()}` : (r.image || ""),
                    collections: r.collections,
                    is_premium: r.is_premium
                })));
            }

            // 2. Fetch Collections
            const { data: colData } = await supabase
                .from('collections')
                .select('*')
                .eq('is_active', true)
                .order('sort_order', { ascending: true });

            if (colData && colData.length > 0) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const mappedCollections: Collection[] = colData.map((c: any) => ({
                    id: c.id,
                    title: c.title,
                    subtitle: c.subtitle,
                    type: c.type,
                    recipeIds: c.recipe_ids,
                    coverImage: c.cover_image,
                    coverImageEn: c.cover_image_en,
                    themeColor: c.theme_color,
                    description: c.description,
                    sortOrder: c.sort_order,
                    isActive: c.is_active
                }));
                setAllCollections(mappedCollections);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        allRecipes,
        allCollections,
        loading,
        refreshRecipes: fetchData
    };
}

// Helper to filter recipes based on collection rules
export const filterRecipes = (collection: Collection, recipes: Recipe[]): Recipe[] => {
    return recipes.filter(r => r.collections && r.collections.includes(collection.id));
};
