import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import type { Session } from '@supabase/supabase-js';

export function useFavorites(session: Session | null) {
    const [favorites, setFavorites] = useState<Set<string>>(() => {
        try {
            const saved = localStorage.getItem('favorites');
            return saved ? new Set(JSON.parse(saved)) : new Set();
        } catch { return new Set(); }
    });

    // Persistence
    useEffect(() => {
        localStorage.setItem('favorites', JSON.stringify(Array.from(favorites)));
    }, [favorites]);

    // Sync Logic
    useEffect(() => {
        if (!session || !supabase) return;

        const sync = async () => {
            if (!supabase) return;

            const currentUser = session.user.id;
            const lastUser = localStorage.getItem('fav_last_user');
            const isSameUser = lastUser === currentUser;

            // Update tracker
            localStorage.setItem('fav_last_user', currentUser);

            try {
                if (!isSameUser) {
                    // New Login or Switch: MERGE local -> server
                    const localArray = Array.from(favorites);
                    if (localArray.length > 0) {
                        const { data: existing } = await supabase
                            .from('favorites')
                            .select('recipe_id')
                            .eq('user_id', currentUser);

                        const existingIds = new Set(existing?.map((x: any) => x.recipe_id) || []);
                        const toAdd = localArray.filter(id => !existingIds.has(id));

                        if (toAdd.length > 0) {
                            await supabase.from('favorites').insert(
                                toAdd.map(id => ({ user_id: currentUser, recipe_id: id }))
                            );
                        }
                    }
                }

                // Always fetch final state from server
                const { data: dbFavs, error: favError } = await supabase
                    .from('favorites')
                    .select('recipe_id')
                    .eq('user_id', currentUser);

                if (!favError && dbFavs) {
                    setFavorites(new Set(dbFavs.map((f: any) => f.recipe_id)));
                }
            } catch (e) {
                console.error('Favorites Sync Error:', e);
            }
        };

        sync();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session]);

    const toggleFavorite = async (id: string, e?: React.MouseEvent) => {
        e?.stopPropagation();
        const prevFavs = new Set(favorites);
        const newFavs = new Set(favorites);
        const isAdding = !newFavs.has(id);

        if (isAdding) newFavs.add(id); else newFavs.delete(id);
        setFavorites(newFavs);

        if (session && supabase) {
            try {
                const cleanId = id.trim();
                if (isAdding) {
                    const { data: existing } = await supabase
                        .from('favorites')
                        .select('id')
                        .eq('recipe_id', cleanId)
                        .eq('user_id', session.user.id)
                        .maybeSingle();

                    if (!existing) {
                        const { error } = await supabase.from('favorites').insert({
                            user_id: session.user.id,
                            recipe_id: cleanId
                        });
                        if (error) throw error;
                    }
                } else {
                    const { error } = await supabase
                        .from('favorites')
                        .delete({ count: 'exact' })
                        .eq('recipe_id', cleanId); // RLS handles user_id check
                    if (error) throw error;
                }
            } catch (err) {
                console.error('Toggle Favorite Error:', err);
                setFavorites(prevFavs); // Revert
            }
        }
    };

    const clearFavorites = () => {
        setFavorites(new Set());
    };

    return {
        favorites,
        toggleFavorite,
        clearFavorites
    };
}
