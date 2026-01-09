
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

const IMAGES = [
    { id: 'oolong-gin', path: '/Users/vic-yu/.gemini/antigravity/brain/c9e52b82-590f-4189-8586-0f3bae5b6f67/oolong_gin_1767934099932.png', storagePath: 'cocktails/oolong-gin.png' },
    { id: 'red-eye-tw', path: '/Users/vic-yu/.gemini/antigravity/brain/c9e52b82-590f-4189-8586-0f3bae5b6f67/red_eye_tw_1767934114215.png', storagePath: 'cocktails/red-eye-tw.png' },
    { id: 'plum-green-whiskey', path: '/Users/vic-yu/.gemini/antigravity/brain/c9e52b82-590f-4189-8586-0f3bae5b6f67/plum_green_whiskey_1767934130136.png', storagePath: 'cocktails/plum-green-whiskey.png' },
    { id: 'lemon-tea-whiskey', path: '/Users/vic-yu/.gemini/antigravity/brain/c9e52b82-590f-4189-8586-0f3bae5b6f67/lemon_tea_whiskey_1767934144166.png', storagePath: 'cocktails/lemon-tea-whiskey.png' },
    { id: 'soymilk-baileys', path: '/Users/vic-yu/.gemini/antigravity/brain/c9e52b82-590f-4189-8586-0f3bae5b6f67/soymilk_baileys_1767934158897.png', storagePath: 'cocktails/soymilk-baileys.png' },
    { id: 'yakult-green-vodka', path: '/Users/vic-yu/.gemini/antigravity/brain/c9e52b82-590f-4189-8586-0f3bae5b6f67/yakult_green_vodka_1767934174992.png', storagePath: 'cocktails/yakult-green-vodka.png' }
]

async function uploadImages() {
    for (const img of IMAGES) {
        try {
            if (!fs.existsSync(img.path)) {
                console.error(`Local file not found: ${img.path}`)
                continue
            }

            const fileBuffer = fs.readFileSync(img.path)

            console.log(`Uploading ${img.storagePath}...`)
            const { error } = await supabase.storage
                .from('cocktails')
                .upload(img.storagePath, fileBuffer, {
                    contentType: 'image/png',
                    upsert: true
                })

            if (error) throw error

            const { data: { publicUrl } } = supabase.storage
                .from('cocktails')
                .getPublicUrl(img.storagePath)

            console.log(`Uploaded to: ${publicUrl}`)

            // Update recipe
            const { error: updateError } = await supabase
                .from('recipes')
                .update({ image: publicUrl })
                .eq('id', img.id)

            if (updateError) throw updateError

            console.log(`Recipe ${img.id} updated with new image URL.`)

        } catch (err) {
            console.error(`Error uploading ${img.id}:`, err.message)
        }
    }
}

uploadImages()
