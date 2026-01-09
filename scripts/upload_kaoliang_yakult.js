
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

// Try loading from .env.local
dotenv.config({ path: '.env.local' })

const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Missing Supabase credentials in .env.local')
    process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// Absolute path to the generated v4 image
const IMAGE_PATH = '/Users/vic-yu/.gemini/antigravity/brain/c9e52b82-590f-4189-8586-0f3bae5b6f67/kaoliang_yakult_v4_1768002451046.png'
const RECIPE_ID = 'kaoliang-yakult'

async function uploadImage() {
    console.log('Starting Kaoliang Yakult image upload...')

    if (!fs.existsSync(IMAGE_PATH)) {
        console.error(`File not found: ${IMAGE_PATH}`)
        return
    }

    const fileBuffer = fs.readFileSync(IMAGE_PATH)

    console.log(`Uploading to ${RECIPE_ID}.png...`)

    const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('cocktails')
        .upload(`${RECIPE_ID}.png`, fileBuffer, {
            contentType: 'image/png',
            upsert: true
        })

    if (uploadError) {
        console.error(`Failed to upload:`, uploadError.message)
        return
    }

    // Get Public URL
    const { data: { publicUrl } } = supabase
        .storage
        .from('cocktails')
        .getPublicUrl(`${RECIPE_ID}.png`)

    console.log(`Uploaded! Public URL: ${publicUrl}`)

    // Update Recipe in Database
    console.log(`Updating recipe ${RECIPE_ID} in database...`)

    const { error: dbError } = await supabase
        .from('recipes')
        .update({ image: publicUrl })
        .eq('id', RECIPE_ID)

    if (dbError) {
        console.error(`Failed to update DB:`, dbError.message)
    } else {
        console.log(`Successfully updated ${RECIPE_ID}`)
    }
}

uploadImage().catch(console.error)
