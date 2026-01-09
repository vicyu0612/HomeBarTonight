
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

// Load environment variables manually since we are in a module
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Missing Supabase credentials in .env.local')
    process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

const ARTIFACT_DIR = '/Users/vic-yu/.gemini/antigravity/brain/c9e52b82-590f-4189-8586-0f3bae5b6f67'

// Target specific upload
const RECIPE_ID = 'calpis-beer' // We assume this ID, will confirm with SQL query result if different
const RAW_FILENAME_PATTERN = 'calpis_beer_real_v2'

async function uploadSingleImage() {
    console.log('Starting single image upload...')

    const files = fs.readdirSync(ARTIFACT_DIR)
    const filename = files.find(f => f.startsWith(RAW_FILENAME_PATTERN) && f.endsWith('.png'))

    if (!filename) {
        console.error(`No image found matching pattern: ${RAW_FILENAME_PATTERN}`)
        return
    }

    const filePath = path.join(ARTIFACT_DIR, filename)
    const fileBuffer = fs.readFileSync(filePath)

    console.log(`Uploading ${filename} as ${RECIPE_ID}.png...`)

    const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('cocktails')
        .upload(`${RECIPE_ID}.png`, fileBuffer, {
            contentType: 'image/png',
            upsert: true
        })

    if (uploadError) {
        console.error('Upload failed:', uploadError.message)
        return
    }

    const { data: { publicUrl } } = supabase
        .storage
        .from('cocktails')
        .getPublicUrl(`${RECIPE_ID}.png`)

    // Force unique URL to bypass cache key if needed, or just trust simple URL
    const finalUrl = `${publicUrl}?t=${Date.now()}`
    console.log(`Uploaded! Public URL: ${finalUrl}`)

    console.log(`Updating recipe ${RECIPE_ID} in database...`)

    // Check if recipe exists first to avoid error if ID is wrong
    const { data: exists } = await supabase.from('recipes').select('id').eq('id', RECIPE_ID).single()

    if (!exists) {
        console.error(`Recipe ID ${RECIPE_ID} not found in DB!`)
        return
    }

    const { error: dbError } = await supabase
        .from('recipes')
        .update({ image: finalUrl })
        .eq('id', RECIPE_ID)

    if (dbError) {
        console.error('DB Update failed:', dbError.message)
    } else {
        console.log('Successfully updated recipe image!')
    }
}

uploadSingleImage().catch(console.error)
