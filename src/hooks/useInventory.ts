import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import type { Session } from '@supabase/supabase-js';

export function useInventory(session: Session | null) {
    const [myInventory, setMyInventory] = useState<Set<string>>(() => {
        try {
            const saved = localStorage.getItem('myInventory');
            return saved ? new Set(JSON.parse(saved)) : new Set();
        } catch { return new Set(); }
    });

    // Persistence
    useEffect(() => {
        localStorage.setItem('myInventory', JSON.stringify(Array.from(myInventory)));
    }, [myInventory]);

    // Sync Logic
    useEffect(() => {
        if (!session || !supabase) return;

        const sync = async () => {
            if (!supabase) return;
            const currentUser = session.user.id;
            const lastUser = localStorage.getItem('inv_last_user');
            const isSameUser = lastUser === currentUser;

            // Update tracker
            localStorage.setItem('inv_last_user', currentUser);

            try {
                const { data: invData, error: invError } = await supabase
                    .from('user_inventory')
                    .select('ingredients')
                    .eq('user_id', currentUser)
                    .single();

                if (!invError && invData) {
                    const ingredientsArray: string[] = Array.isArray(invData.ingredients) ? invData.ingredients : [];
                    const serverInv = new Set<string>(ingredientsArray);

                    if (!isSameUser && myInventory.size > 0) {
                        // Merge Local -> Server
                        const combined = new Set<string>([...serverInv, ...myInventory]);

                        // If combined has more items than server, update server
                        if (combined.size > serverInv.size) {
                            await supabase.from('user_inventory').upsert({
                                user_id: currentUser,
                                ingredients: Array.from(combined),
                                updated_at: new Date().toISOString()
                            });
                            setMyInventory(combined);
                        } else {
                            setMyInventory(serverInv);
                        }
                    } else {
                        // Restore Session: Trust Server
                        setMyInventory(serverInv);
                    }
                }
            } catch (e) {
                console.error('Inventory Sync Error:', e);
            }
        };

        sync();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session]);

    const saveInventory = async (inv: Set<string>) => {
        setMyInventory(inv); // Optimistic Update

        if (session && supabase) {
            try {
                await supabase.from('user_inventory').upsert({
                    user_id: session.user.id,
                    ingredients: Array.from(inv),
                    updated_at: new Date().toISOString()
                });
            } catch (e) {
                console.error('Save Inventory Error:', e);
            }
        }
    };

    const clearInventory = () => {
        setMyInventory(new Set());
    };

    return {
        myInventory,
        saveInventory,
        clearInventory
    };
}
