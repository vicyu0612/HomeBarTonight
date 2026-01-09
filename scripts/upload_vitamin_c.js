
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

dotenv.config({ path: '.env.local' })

const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Missing Supabase credentials')
    process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

const LOCAL_IMAGE_PATH = '/Users/vic-yu/.gemini/antigravity/brain/c9e52b82-590f-4189-8586-0f3bae5b6f67/vitamin_c_vodka_1767933665732.png'
const STORAGE_PATH = 'cocktails/vitamin-c-vodka.png'
const RECIPE_ID = 'vitamin-c-vodka'

async function uploadImage() {
    try {
        if (!fs.existsSync(LOCAL_IMAGE_PATH)) {
            throw new Error(`Local file not found: ${LOCAL_IMAGE_PATH}`)
        }

        const fileBuffer = fs.readFileSync(LOCAL_IMAGE_PATH)

        console.log(`Uploading ${STORAGE_PATH}...`)
        const { data, error } = await supabase.storage
            .from('cocktails')
            .upload(STORAGE_PATH, fileBuffer, {
                contentType: 'image/png',
                upsert: true
            })

        if (error) throw error

        const { data: { publicUrl } } = supabase.storage
            .from('cocktails')
            .getPublicUrl(STORAGE_PATH)

        console.log(`Image uploaded to: ${publicUrl}`)

        // Update recipe
        const { error: updateError } = await supabase
            .from('recipes')
            .update({ image: publicUrl })
            .eq('id', RECIPE_ID)

        if (updateError) throw updateError

        console.log(`Recipe ${RECIPE_ID} updated with new image URL.`)

    } catch (err) {
        console.error('Error:', err.message)
    }
}

uploadImage()
