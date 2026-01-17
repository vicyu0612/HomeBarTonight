import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export interface Ingredient {
    id: string;
    name_en: string;
    name_zh: string;
    category?: string;
    subcategory?: string;
    aliases?: string[];
}

export interface Category {
    id: string;
    name_en: string;
    name_zh: string;
    sort_order: number;
    color: string;
}

export interface Subcategory {
    id: string;
    category_id: string;
    name_en: string;
    name_zh: string;
    sort_order: number;
}

export interface CategoriesMetadata {
    categories: Category[];
    subcategories: Subcategory[];
}

interface UseIngredientsResult {
    ingredients: Ingredient[];
    categoriesMetadata: CategoriesMetadata;
    loading: boolean;
    error: Error | null;
    normalizeIngredient: (name: string, lang: 'en' | 'zh') => string[];
    getIngredientLabel: (id: string, lang: 'en' | 'zh') => string;
    refetch: () => Promise<void>;
}

// Global cache
let cachedIngredients: Ingredient[] | null = null;
let cachedMetadata: CategoriesMetadata | null = null;
let fetchPromise: Promise<[Ingredient[], CategoriesMetadata]> | null = null;

export function useIngredients(): UseIngredientsResult {
    const [ingredients, setIngredients] = useState<Ingredient[]>(cachedIngredients || []);
    const [metadata, setMetadata] = useState<CategoriesMetadata>(cachedMetadata || { categories: [], subcategories: [] });
    const [loading, setLoading] = useState(!cachedIngredients);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = async (force = false) => {
        if (!force && cachedIngredients && cachedMetadata) {
            setIngredients(cachedIngredients);
            setMetadata(cachedMetadata);
            setLoading(false);
            setError(null);
            return;
        }

        if (!force && fetchPromise) {
            setLoading(true);
            try {
                const [ingData, metaData] = await fetchPromise;
                setIngredients(ingData);
                setMetadata(metaData);
                setError(null);
            } catch (err: any) {
                setError(err);
            } finally {
                setLoading(false);
            }
            return;
        }

        setLoading(true);
        setError(null);

        if (!supabase) {
            setLoading(false);
            return;
        }

        const currentFetchPromise = Promise.all([
            supabase.from('ingredients').select('*').order('sort_order', { ascending: true }).order('id', { ascending: true })
                .then(({ data, error }) => { if (error) throw error; return data as Ingredient[]; }),

            Promise.all([
                supabase.from('ingredient_categories').select('*').order('sort_order'),
                supabase.from('ingredient_subcategories').select('*').order('sort_order')
            ]).then(([cats, subcats]) => {
                if (cats.error) throw cats.error;
                if (subcats.error) throw subcats.error;
                return {
                    categories: cats.data as Category[],
                    subcategories: subcats.data as Subcategory[]
                };
            })
        ]);

        fetchPromise = currentFetchPromise;

        try {
            const [ingData, metaData] = await currentFetchPromise;
            cachedIngredients = ingData;
            cachedMetadata = metaData;
            setIngredients(ingData);
            setMetadata(metaData);
        } catch (err: any) {
            console.error('Error fetching ingredients/metadata:', err);
            setError(err);
        } finally {
            setLoading(false);
            if (fetchPromise === currentFetchPromise) {
                fetchPromise = null;
            }
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const refetch = () => fetchData(true);

    // --- Normalization Logic ---
    // Build Maps
    const nameToIdZH: Record<string, string> = {};
    const nameToIdEN: Record<string, string> = {};
    const aliasMap: Record<string, string> = {};

    ingredients.forEach(ing => {
        nameToIdEN[ing.name_en.toLowerCase()] = ing.id;
        nameToIdZH[ing.name_zh] = ing.id;
        if (ing.aliases) {
            ing.aliases.forEach(alias => {
                aliasMap[alias.toLowerCase()] = ing.id;
            });
        }
    });

    const getIngredientLabel = (id: string, lang: 'en' | 'zh'): string => {
        const ing = ingredients.find(i => i.id === id);
        if (!ing) return id;
        return lang === 'en' ? ing.name_en : ing.name_zh;
    };

    const normalizeIngredient = (name: string, lang: 'en' | 'zh'): string[] => {
        let cleanName = name.replace(/\s*\(.*?\)/g, '').trim();
        if (!cleanName) cleanName = name.trim();

        const splitters = lang === 'en' ? [/ or /i, /\//] : [/或/, /、/, /\//, /／/];
        let parts = [cleanName];

        for (const splitter of splitters) {
            let newParts: string[] = [];
            parts.forEach(p => {
                newParts = newParts.concat(p.split(splitter));
            });
            parts = newParts;
        }

        const normalizedIds = new Set<string>();

        parts.forEach(part => {
            const p = part.trim();
            if (!p) return;

            const lowerP = p.toLowerCase();
            let id: string | undefined;

            if (lang === 'zh') {
                id = nameToIdZH[p];
                if (!id) id = aliasMap[p];
                if (!id) {
                    const match = ingredients.find(ing => {
                        if (p.includes(ing.name_zh)) return true;
                        if (ing.aliases) return ing.aliases.some(alias => p.includes(alias));
                        return false;
                    });
                    if (match) id = match.id;
                }
            } else {
                id = nameToIdEN[lowerP];
                if (!id) id = aliasMap[lowerP];
                if (!id) {
                    const match = ingredients.find(ing => {
                        if (lowerP.includes(ing.name_en.toLowerCase())) return true;
                        if (ing.aliases) return ing.aliases.some(alias => lowerP.includes(alias.toLowerCase()));
                        return false;
                    });
                    if (match) id = match.id;
                }
            }
            normalizedIds.add(id || p);
        });

        return Array.from(normalizedIds).filter(Boolean);
    };

    return {
        ingredients,
        categoriesMetadata: metadata,
        loading,
        error,
        normalizeIngredient,
        getIngredientLabel,
        refetch
    };
}
