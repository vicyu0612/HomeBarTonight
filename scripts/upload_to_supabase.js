
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

// import dotenv from 'dotenv' -- REMOVED
// Manual env parsing
const envFile = fs.readFileSync(path.resolve(process.cwd(), '.env.local'), 'utf-8')
const envConfig = {}
envFile.split('\n').forEach(line => {
    const [key, value] = line.split('=')
    if (key && value) {
        envConfig[key.trim()] = value.trim()
    }
})

const supabaseUrl = envConfig.VITE_SUPABASE_URL
const supabaseAnonKey = envConfig.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase Config')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

const COCKTAILS_DIR = path.resolve(process.cwd(), 'public/cocktails')
const BUCKET_NAME = 'cocktails'

async function uploadImages() {
    const files = fs.readdirSync(COCKTAILS_DIR)

    for (const file of files) {
        if (!file.endsWith('.png') && !file.endsWith('.jpg')) continue

        const filePath = path.join(COCKTAILS_DIR, file)
        const fileContent = fs.readFileSync(filePath)

        // Upload uses the filename as key
        const { data, error } = await supabase
            .storage
            .from(BUCKET_NAME)
            .upload(file, fileContent, {
                contentType: 'image/png',
                upsert: true
            })

        if (error) {
            console.error(`Error uploading ${file}:`, error.message)
        } else {
            console.log(`Uploaded ${file}`)
        }
    }
}

uploadImages()
