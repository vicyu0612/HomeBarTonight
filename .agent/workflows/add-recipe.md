---
description: Adding new cocktail recipes with proper ingredient mapping and scoring rules
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
- **Normalize Ingredients**: Check `src/utils/normalization.ts` and `ingredients` table. Ensure new ingredients (e.g., Lillet) are added with specific IDs and categories.

## 2. Image Generation
- Generate high-quality, realistic 4K images.
- Style: Moody, cinematic, "Home Bar" aesthetic.
- Upload to Supabase Storage (`cocktails` bucket) and get Public URL.

## 3. SQL Generation
- Use `INSERT ... ON CONFLICT (id) DO UPDATE` pattern.
- **Columns**:
    - `steps`: Array of strings for instructions.
    - `type`: Category (e.g., 'classic', 'original', 'cvs').
    - `specs`: JSONB `{"alcohol": X, "sweetness": Y, "ease": Z}`.
    - `ingredients`: Array of `{"name": "...", "amount": "..."}` objects.
- **Double Check**: Ensure `ease` score aligns with the definition above.

## 4. Verification
- Verify ingredient mapping in valid JSON format.
- execute SQL and confirm success.
- Update `task.md`.
