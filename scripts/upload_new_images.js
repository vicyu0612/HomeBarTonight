
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Load environment variables manually since we are in a module
// and might not have dotenv CLI
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

const ARTIFACT_DIR = '/Users/vic-yu/.gemini/antigravity/brain/c9e52b82-590f-4189-8586-0f3bae5b6f67'

// Manual mapping of recipe IDs to generated filenames (subtrings to match)
const RECIPE_MAP = {
    'french-75': 'french_75',
    'aperol-spritz': 'aperol_spritz',
    'moscow-mule': 'moscow_mule',
    'pina-colada': 'pina_colada',
    'long-island': 'long_island',
    'sex-on-the-beach': 'sex_on_the_beach',
    'singapore-sling': 'singapore_sling',
    'caipirinha': 'caipirinha',
    'pisco-sour': 'pisco_sour',
    'boulevardier': 'boulevardier',
    'mint-julep': 'mint_julep',
    'sazerac': 'sazerac',
    'dark-n-stormy': 'dark_n_stormy',
    'amaretto-sour': 'amaretto_sour',
    'bellini': 'bellini',
    'mimosa': 'mimosa',
    'clover-club': 'clover_club',
    'last-word': 'last_word',
    'bees-knees': 'bees_knees',
    'southside': 'southside'
}

async function uploadImages() {
    console.log('Starting image upload...')

    // Get all files in artifact dir
    const files = fs.readdirSync(ARTIFACT_DIR)

    for (const [recipeId, filePattern] of Object.entries(RECIPE_MAP)) {
        // Find the file that starts with the pattern
        const filename = files.find(f => f.startsWith(filePattern) && f.endsWith('.png'))

        if (!filename) {
            console.warn(`No image found for ${recipeId} (pattern: ${filePattern})`)
            continue
        }

        const filePath = path.join(ARTIFACT_DIR, filename)
        const fileBuffer = fs.readFileSync(filePath)

        // Upload to Supabase Storage
        // We'll use the recipeId as the filename in storage for cleanliness: recipeId.png
        console.log(`Uploading ${filename} as ${recipeId}.png...`)

        const { data: uploadData, error: uploadError } = await supabase
            .storage
            .from('cocktails')
            .upload(`${recipeId}.png`, fileBuffer, {
                contentType: 'image/png',
                upsert: true
            })

        if (uploadError) {
            console.error(`Failed to upload ${recipeId}:`, uploadError.message)
            continue
        }

        // Get Public URL
        const { data: { publicUrl } } = supabase
            .storage
            .from('cocktails')
            .getPublicUrl(`${recipeId}.png`)

        console.log(`Uploaded! Public URL: ${publicUrl}`)

        // Update Recipe in Database
        // Using simple update since row should exist
        console.log(`Updating recipe ${recipeId} in database...`)

        const { error: dbError } = await supabase
            .from('recipes')
            .update({ image: publicUrl })
            .eq('id', recipeId)

        if (dbError) {
            console.error(`Failed to update DB for ${recipeId}:`, dbError.message)
        } else {
            console.log(`Successfully updated ${recipeId}`)
        }
    }
}

uploadImages().catch(console.error)
