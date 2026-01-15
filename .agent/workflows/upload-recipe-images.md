---
description: Upload generated cocktail recipe images to Supabase
---

# Upload Recipe Images Workflow

Use this workflow when you have generated new cocktail images and need to upload them to Supabase storage and update the database.

## Prerequisites

- Generated images saved in the artifacts directory
- Recipe IDs already exist in the database
- `.env.local` file with Supabase credentials configured

## Steps

### 1. Generate Images

Use the `generate_image` tool to create professional cocktail photographs for each recipe. Save the image paths.

### 2. Create Upload Script

Create or update `scripts/quick_upload_images.js` with the image mappings:

```javascript
const imageMappings = [
    { id: 'recipe-id', path: '/path/to/generated/image.png' },
    // ... more mappings
];
```

The script should:
- Read Supabase credentials from `.env.local`
- Upload each image to the `cocktails` bucket
- Update the `recipes` table with the public URL

### 3. Execute Upload

// turbo
```bash
node scripts/quick_upload_images.js
```

### 4. Verify Upload

// turbo
```bash
node -e "
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const parser = require('dotenv');
const envConfig = parser.parse(fs.readFileSync('.env.local'));
const supabase = createClient(envConfig.VITE_SUPABASE_URL, envConfig.SUPABASE_SERVICE_ROLE_KEY);

const ids = ['recipe-id-1', 'recipe-id-2']; // Replace with actual IDs

async function verify() {
    const { data } = await supabase
        .from('recipes')
        .select('id, name, image')
        .in('id', ids);
    
    console.log('✅ Verification Results:\n');
    data.forEach(recipe => {
        const hasImage = recipe.image && recipe.image.includes('supabase.co');
        console.log(\`\${hasImage ? '✅' : '❌'} \${recipe.id}: \${recipe.name.zh}\`);
        if (hasImage) console.log(\`   🔗 \${recipe.image}\`);
    });
}
verify();
"
```

## Notes

- Image filenames should match recipe IDs (e.g., `gin-jin.png` for recipe ID `gin-jin`)
- Use `upsert: true` to allow re-uploading/updating images
- The `SUPABASE_SERVICE_ROLE_KEY` is required for storage uploads
- Images are stored in the `cocktails` bucket with public access

## Troubleshooting

If upload is slow or hangs:
- Check network connection
- Verify Supabase credentials are correct
- Try uploading images one at a time
- Consider manual upload via Supabase dashboard if script fails
