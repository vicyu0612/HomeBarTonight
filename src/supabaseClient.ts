import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

let supabase: SupabaseClient | null = null;

if (supabaseUrl && supabaseAnonKey && supabaseUrl !== 'YOUR_SUPABASE_URL_HERE') {
    try {
        supabase = createClient(supabaseUrl, supabaseAnonKey)
    } catch (error) {
        console.warn('Failed to initialize Supabase client:', error)
    }
} else {
    console.warn('Supabase credentials missing or invalid. Auth features will be disabled.')
}

export { supabase }
