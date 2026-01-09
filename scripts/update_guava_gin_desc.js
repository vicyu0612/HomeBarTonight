
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Missing Supabase credentials')
    process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

const RECIPE_ID = 'guava-gin'
const NEW_DESC_ZH = '當琴酒的杜松子草本香氣，遇上台灣辦桌經典、具有熱帶甜味的芭樂汁。優雅與豪爽的創意碰撞，芭樂的濃郁甜味完美平衡了酒精感，演繹出最接地氣的台式優雅。'

async function updateDescription() {
    console.log(`Fetching current description for ${RECIPE_ID}...`)
    const { data: recipe, error: fetchError } = await supabase
        .from('recipes')
        .select('description')
        .eq('id', RECIPE_ID)
        .single()

    if (fetchError) {
        console.error('Fetch failed:', fetchError.message)
        return
    }

    const currentDesc = recipe.description || {}
    const newDesc = { ...currentDesc, zh: NEW_DESC_ZH }

    console.log('Updating description to:', newDesc)

    const { error: updateError } = await supabase
        .from('recipes')
        .update({ description: newDesc })
        .eq('id', RECIPE_ID)

    if (updateError) {
        console.error('Update failed:', updateError.message)
    } else {
        console.log('Successfully updated description!')
    }
}

updateDescription().catch(console.error)
