import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export interface Ingredient {
    id: string;
    name_en: string;
    name_zh: string;
    category?: string;
    aliases?: string[];
}

interface UseIngredientsResult {
    ingredients: Ingredient[];
    loading: boolean;
    error: Error | null;
    normalizeIngredient: (name: string, lang: 'en' | 'zh') => string[];
    getIngredientLabel: (id: string, lang: 'en' | 'zh') => string;
    refetch: () => Promise<void>;
}

// Global cache to avoid re-fetching on every mount (simple singleton)
let cachedIngredients: Ingredient[] | null = null;
let fetchPromise: Promise<Ingredient[]> | null = null;

export function useIngredients(): UseIngredientsResult {
    const [ingredients, setIngredients] = useState<Ingredient[]>(cachedIngredients || []);
    const [loading, setLoading] = useState(!cachedIngredients);
    const [error, setError] = useState<Error | null>(null);

    // Maps for fast lookup (rebuilt if ingredients change or on mount)
    // We use refs or memo to store them?
    // Since ingredients is state, we can compute these.
    // However, computing them on every render is expensive if list is huge? 
    // It's ~120 items. Cheap.

    const fetchIngredients = async (force = false) => {
        if (!force && cachedIngredients) {
            setIngredients(cachedIngredients);
            setLoading(false);
            setError(null); // Clear any previous error
            return;
        }

        // If a fetch is already in progress and not forcing, await it
        if (!force && fetchPromise) {
            setLoading(true); // Still show loading if waiting for an ongoing fetch
            try {
                const data = await fetchPromise;
                setIngredients(data);
                setError(null);
            } catch (err: any) {
                setError(err);
            } finally {
                setLoading(false);
            }
            return;
        }

        setLoading(true);
        setError(null); // Clear previous errors before new fetch

        if (!supabase) {
            setLoading(false);
            return;
        }

        const currentFetchPromise = supabase
            .from('ingredients')
            .select('*')
            .then(({ data, error }) => {
                if (error) throw error;
                return data as Ingredient[];
            }) as Promise<Ingredient[]>;

        fetchPromise = currentFetchPromise; // Store the promise globally

        try {
            const data = await currentFetchPromise;
            cachedIngredients = data;
            setIngredients(data);
        } catch (err: any) {
            console.error('Error fetching ingredients:', err);
            setError(err);
        } finally {
            setLoading(false);
            // Only clear fetchPromise if it's the one we just started.
            if (fetchPromise === currentFetchPromise) {
                fetchPromise = null;
            }
        }
    };

    useEffect(() => {
        fetchIngredients();
    }, []);

    const refetch = () => fetchIngredients(true);

    // --- Normalization Logic ---

    // Build Maps
    const nameToIdZH: Record<string, string> = {};
    const nameToIdEN: Record<string, string> = {};
    const aliasMap: Record<string, string> = {}; // alias -> id

    ingredients.forEach(ing => {
        nameToIdEN[ing.name_en.toLowerCase()] = ing.id;
        nameToIdZH[ing.name_zh] = ing.id;

        // Exact aliases
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
        // 0. Remove content in parentheses
        let cleanName = name.replace(/\s*\(.*?\)/g, '').trim();
        if (!cleanName) cleanName = name.trim();

        // 1. Split compound ingredients
        const splitters = lang === 'en' ? [/ or /i, /\//] : [/或/, /、/, /\//, /／/];
        let parts = [cleanName];

        for (const splitter of splitters) {
            let newParts: string[] = [];
            parts.forEach(p => {
                newParts = newParts.concat(p.split(splitter));
            });
            parts = newParts;
        }

        // 2. Normalize each part
        const normalizedIds = new Set<string>();

        parts.forEach(part => {
            const p = part.trim();
            if (!p) return;

            const lowerP = p.toLowerCase();
            let id: string | undefined;

            if (lang === 'zh') {
                // Exact name
                id = nameToIdZH[p];
                // Exact alias
                if (!id) id = aliasMap[p];

                // Fuzzy fallback (The "Backend-driven" part: check if input contains any alias)
                if (!id) {
                    // Iterate all ingredients, check if any alias is a substring of p
                    // OR if base name is substring?
                    // normalization.ts checked `if (p.includes('威士忌'))`. '威士忌' is name_zh of whiskey.
                    // So we check if any ingredient's name_zh or alias is contained in p.

                    const match = ingredients.find(ing => {
                        if (p.includes(ing.name_zh)) return true;
                        if (ing.aliases) {
                            return ing.aliases.some(alias => p.includes(alias));
                        }
                        return false;
                    });
                    if (match) id = match.id;
                }
            } else {
                // EN
                id = nameToIdEN[lowerP];
                if (!id) id = aliasMap[lowerP];

                if (!id) {
                    const match = ingredients.find(ing => {
                        if (lowerP.includes(ing.name_en.toLowerCase())) return true;
                        if (ing.aliases) {
                            return ing.aliases.some(alias => lowerP.includes(alias.toLowerCase()));
                        }
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
        loading,
        error,
        normalizeIngredient,
        getIngredientLabel,
        refetch
    };
}
