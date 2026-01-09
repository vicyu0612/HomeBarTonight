
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Missing Supabase credentials')
    process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
const ARTIFACT_DIR = '/Users/vic-yu/.gemini/antigravity/brain/c9e52b82-590f-4189-8586-0f3bae5b6f67'

const RECIPE_ID = 'beer-green-tea'
const RAW_FILENAME_PATTERN = 'beer_green_tea_v3'

async function uploadBeerGreenTea() {
    console.log('Starting Beer Green Tea upload...')
    const files = fs.readdirSync(ARTIFACT_DIR)
    const filename = files.find(f => f.startsWith(RAW_FILENAME_PATTERN) && f.endsWith('.png'))

    if (!filename) {
        console.error(`No image found matching pattern: ${RAW_FILENAME_PATTERN}`)
        return
    }

    const filePath = path.join(ARTIFACT_DIR, filename)
    const fileBuffer = fs.readFileSync(filePath)

    console.log(`Uploading ${filename} as ${RECIPE_ID}.png...`)

    const { error: uploadError } = await supabase.storage
        .from('cocktails')
        .upload(`${RECIPE_ID}.png`, fileBuffer, {
            contentType: 'image/png',
            upsert: true
        })

    if (uploadError) {
        console.error('Upload failed:', uploadError.message)
        return
    }

    // Cache-busting URL
    const { data: { publicUrl } } = supabase.storage
        .from('cocktails')
        .getPublicUrl(`${RECIPE_ID}.png`)

    const finalUrl = `${publicUrl}?t=${Date.now()}`
    console.log(`Uploaded! URL: ${finalUrl}`)

    console.log(`Updating DB for ${RECIPE_ID}...`)
    const { error: dbError } = await supabase
        .from('recipes')
        .update({ image: finalUrl })
        .eq('id', RECIPE_ID)

    if (dbError) console.error('DB Update failed:', dbError.message)
    else console.log('Successfully updated recipe image in DB!')
}

uploadBeerGreenTea().catch(console.error)
