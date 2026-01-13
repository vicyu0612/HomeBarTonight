
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase URL or Key missing');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadImage() {
    const filePath = '/Users/vic-yu/.gemini/antigravity/brain/bc7b8460-01e2-4fa4-a7cd-a512a59ec63b/gin_fizz_highball_1768312166700.png';
    const fileName = 'gin_fizz_highball_1768312166700.png';
    const bucket = 'cocktails';

    if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        return;
    }

    const fileBuffer = fs.readFileSync(filePath);

    console.log(`Uploading ${fileName} to bucket ${bucket}...`);

    const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, fileBuffer, {
            contentType: 'image/png',
            upsert: true
        });

    if (error) {
        console.error('Upload failed:', error);
        return; // Don't exit, might check if already exists/public URL
    }

    console.log('Upload successful:', data);

    const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(fileName);
    const publicUrl = publicUrlData.publicUrl;

    console.log('Public URL:', publicUrl);

    // Update DB
    console.log('Updating database...');
    const { error: dbError } = await supabase
        .from('recipes')
        .update({ image: publicUrl })
        .eq('id', 'gin_fizz');

    if (dbError) {
        console.error('Database update failed:', dbError);
    } else {
        console.log('Database updated successfully!');
    }
}

uploadImage();
