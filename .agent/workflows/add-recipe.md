---
description: Adding new cocktail recipes with proper ingredient mapping, scoring rules, and automated image upload
---

# Workflow: Add New Cocktail Recipe

Follow these steps whenever adding a new cocktail to the database.

## 1. Proposal & Review
- Draft a proposal including:
    - **Description**: Background story (movie/book checks), taste profile.
    - **Specs**:
        - **Alcohol (1-10)**: 1 = Beer/Cider, 10 = Pure Spirit.
        - **Sweetness (1-10)**: 1 = Dry, 10 = Syrupy.
        - **Ease (1-10)**: **CRITICAL DEFINITION**
            - **DEFINITION**: "How easy to drink" (Drinkability).
            - **10**: Juice/Dessert-like (e.g., Baileys Milk Tea, Yakult).
            - **8-9**: Refreshing Highballs (e.g., Gin Tonic, Mojito).
            - **6-7**: Balanced Sours (e.g., Margarita, Whiskey Sour).
            - **3-4**: Strong Sippers (e.g., Old Fashioned, Negroni, Godfather).
            - **1-2**: Raw Spirit burn (e.g., Dry Martini).
- **Normalize Ingredients**: Check `src/utils/normalization.ts` and `ingredients` table.
    - **CRITICAL**: Ensure new ingredients are assigned a valid `subcategory` in the `ingredients` table.
    - **Valid Subcategories**:
        - **Base**: `whiskey`, `gin`, `rum`, `vodka`, `tequila`, `brandy`, `chinese_spirit`
        - **Liqueur**: `fruit_liqueur`, `herbal_liqueur`, `nut_cream_liqueur`, `floral_liqueur`, `other_liqueur`, `rice_spirit`
        - **Wine/Other**: `vermouth`, `wine`, `sparkling_alc`
        - **Mixer**: `soda` (Sparkling Drinks), `juice` (Veg/Fruit), `tea_coffee` (Tea/Coffee/Cocoa), `dairy`
        - **Essential**: `syrup`, `bitters`, `egg`, `hot_sauce`
        - **Fruit/Dessert**: `fruit`, `dessert`
        - **Other**: `pantry`

## 2. Image Generation
- Generate high-quality, realistic 4K images.
- Style: Moody, cinematic, "Home Bar" aesthetic.
- **Action**: Save the generated artifacts and note their absolute paths.

## 3. SQL Generation (Supabase Schema)
- Use `INSERT ... ON CONFLICT (id) DO UPDATE` pattern.
- **Table: `recipes`**
    - `id`: Unique slug (e.g., 'gin-fizz').
    - `name`: JSONB `{"en": "Gin Fizz", "zh": "琴費士"}`.
    - `type`: Category string (e.g., 'classic', 'original', 'cvs').
    - `base_spirit`: Array of strings (e.g., `["gin"]`).
    - `steps`: JSONB `{"en": ["Step 1", "Step 2"], "zh": ["步驟1", "步驟2"]}`.
    - `ingredients`: JSONB `{"en": [{"name": "Gin", "amount": "45ml"}], "zh": [{"name": "琴酒", "amount": "45ml"}]}`.
    - `tags`: JSONB `{"en": ["Classic"], "zh": ["經典"]}`.
    - `description`: JSONB `{"en": "...", "zh": "..."}`.
    - `specs`: JSONB `{"ease": 6, "alcohol": 5, "sweetness": 6}`. **(Numeric 1-10 Only)**.
    - `collections`: Array of strings (e.g., `["cvs-hacks"]`).
    - `is_premium`: Boolean.
- **Table: `collections`** (If adding a new collection)
    - `id`: Unique slug.
    - `title`, `subtitle`, `description`: JSONB `{"en": "...", "zh": "..."}`.
    - `type`: 'filter' or 'manual'.
    - `filter_rules`: JSONB `{"collection": "slug"}` or similar.

## 4. Execution & Image Sync
This step combines adding the data and uploading the image.

**Step 4a: Insert Data**
- Execute the generated SQL to insert the recipe data (without image URL initially, or update later).

**Step 4b: Upload Image**
1. Update `scripts/quick_upload_images.js`:
    ```javascript
    const imageMappings = [
        { id: 'recipe-id', path: '/absolute/path/to/generated/image.png' }
    ];
    ```
2. Run the upload script:
    // turbo
    ```bash
    node scripts/quick_upload_images.js
    ```
    *(This script will upload to Supabase storage `cocktails` bucket and automatically update the `recipes` table with the public URL)*.

## 5. Verification
- Verify ingredient mapping in valid JSON format.
- Check Supabase Dashboard or App to confirm recipe appears with image.
- content check: `npx tsx scripts/check_db_recipe.ts` (helper script).
- Update `task.md`.
