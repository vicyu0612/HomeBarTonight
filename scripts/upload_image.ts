
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!; // Using Anon key might fail for upload if RLS is strict, but normally authorized users or Service Role is needed. 
// However, I don't have SERVICE_ROLE_KEY in the previous script. 
// I'll try with ANON_KEY. If it fails (Permission Denied), I'll ask for the Service Key or use the MCP tool to execute SQL if I can get the URL another way.
// Wait, the previous scripts used ANON_KEY. 
// Actually, usually RLS allows authenticated uploads or specific logic. 
// If this is a user-mode helper script, maybe it needs a signed-in user or service role.
// Let's assume for now that standard 'anon' key *might* have permissions if policies are open (common in dev), or I might need instructions.
// But wait, the environment is likely set up for the user.

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
        return;
    }

    console.log('Upload successful:', data);

    const publicUrlData = supabase.storage.from(bucket).getPublicUrl(fileName);
    const publicUrl = publicUrlData.data.publicUrl;

    console.log('Public URL:', publicUrl);

    // Update the recipe
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
