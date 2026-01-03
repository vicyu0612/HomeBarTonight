
import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { recipes } from '../data/recipes';

export const RecipeManager = () => {
    const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const uploadRecipes = async () => {
        try {
            setStatus('uploading');
            setMessage('Starting upload...');

            // Normalize data to snake_case for Supabase if strictly mapping, 
            // but since we are using JSONB for most fields, we can keep the structure 
            // OR we map camelCase TS fields to snake_case DB columns (standard practice).

            const rows = recipes.map(r => ({
                id: r.id,
                name: r.name,
                type: r.type,
                base_spirit: r.baseSpirit, // Map camelCase to snake_case
                ingredients: r.ingredients,
                steps: r.steps,
                tags: r.tags,
                description: r.description,
                specs: r.specs,
                color: r.color,
                image: r.image
            }));

            const { error } = await supabase
                .from('recipes')
                .upsert(rows, { onConflict: 'id' });

            if (error) throw error;

            setStatus('success');
            setMessage(`Successfully uploaded ${recipes.length} recipes!`);
        } catch (err: any) {
            console.error(err);
            setStatus('error');
            setMessage(err.message || 'Failed to upload recipes');
        }
    };

    if (!supabase) return null;
    if (import.meta.env.MODE === 'production') return null; // Hide in prod for safety

    return (
        <div className="fixed bottom-4 left-4 z-50 p-4 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl max-w-sm">
            <h3 className="text-white font-bold mb-2">Recipe Manager (Dev Only)</h3>

            <div className="flex gap-2 items-center">
                <button
                    onClick={uploadRecipes}
                    disabled={status === 'uploading'}
                    className="px-4 py-2 bg-primary text-black font-bold rounded hover:opacity-90 disabled:opacity-50 text-xs"
                >
                    {status === 'uploading' ? 'Uploading...' : 'Sync Local to DB'}
                </button>

                {status === 'success' && <span className="text-green-500 text-xs">✓ Done</span>}
                {status === 'error' && <span className="text-red-500 text-xs">✗ Error</span>}
            </div>

            {message && <p className="text-zinc-400 text-[10px] mt-2 font-mono">{message}</p>}
        </div>
    );
};
