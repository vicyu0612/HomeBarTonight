---
description: Adding new cocktail recipes with proper ingredient mapping
---

# Add New Recipe Workflow

When adding new cocktail recipes to the database, follow these steps to ensure proper ingredient mapping and translation consistency.

## 1. Recipe Structure

New recipes must follow the Supabase `recipes` table schema:
```json
{
  "id": "unique_recipe_id",
  "name": { "zh": "中文名稱", "en": "English Name" },
  "type": "cocktail",
  "base_spirit": "whiskey|gin|vodka|rum|tequila|brandy|other",
  "ingredients": {
    "zh": [{ "name": "材料名稱", "amount": "份量" }],
    "en": [{ "name": "Ingredient Name", "amount": "Amount" }]
  },
  "steps": {
    "zh": ["步驟1", "步驟2"],
    "en": ["Step 1", "Step 2"]
  },
  "tags": ["tag1", "tag2"],
  "description": { "zh": "描述", "en": "Description" },
  "specs": { "glassware": "杯型", "difficulty": "easy|medium|hard" },
  "color": "#hexcolor",
  "image": "supabase_storage_url",
  "collections": ["collection_id"],
  "is_premium": false
}
```

## 2. Ingredient Mapping Checklist

For EACH ingredient in the recipe:

### Step 2a: Check Existing Ingredients
Query the `ingredients` table to find a match:
```sql
SELECT id, name_en, name_zh, category FROM ingredients 
WHERE name_en ILIKE '%ingredient_name%' OR name_zh LIKE '%材料名稱%';
```

### Step 2b: Decision Tree
- **Exact match found**: Use the existing ingredient's naming in the recipe
- **Similar match found**: ASK USER whether to merge or create new
- **No match found**: Proceed to add new ingredient

### Step 2c: Add Missing Ingredients to Database
```sql
INSERT INTO ingredients (id, name_en, name_zh, category)
VALUES ('ingredient_id', 'English Name', '中文名稱', 'category');
```

Categories:
- `base` - Base spirits (whiskey, gin, vodka, rum, tequila, brandy)
- `liqueur` - Liqueurs (coffee liqueur, amaretto, etc.)
- `other_alc` - Other alcohol (beer, wine, sake, etc.)
- `essential` - Essentials (sugar, bitters, lemon, etc.)
- `mixer` - Common drinks/desserts (sodas, juices, teas, etc.)
- `garnish` - Garnishes (mint, olive, celery, etc.)

## 3. Update Normalization Aliases

Add aliases to `src/utils/normalization.ts` so the ingredient can be properly matched:

### For Chinese aliases (ALIAS_MAP_ZH):
```typescript
"材料別名": "ingredient_id",
"另一個別名": "ingredient_id",
```

### For English aliases (ALIAS_MAP_EN):
```typescript
"ingredient alias": "ingredient_id",
"another alias": "ingredient_id",
```

**IMPORTANT**: This ensures:
- Inventory filtering works correctly
- Missing ingredient tags display proper translations
- Recipes are correctly matched when users select ingredients

## 4. Verification

After adding the recipe:
1. Check inventory modal shows the new ingredient under correct category
2. Test recipe appears when selecting all its ingredients
3. Test missing ingredient tag shows correct translation (not raw English)

## Example: Adding "Spiced Hot Chocolate" Recipe

1. **Ingredients**: Hot Chocolate, Rum, Cinnamon
2. **Check DB**: `hot_chocolate` exists, `rum` exists, `cinnamon` - NOT FOUND
3. **Ask User**: "Cinnamon (肉桂) is not in the database. Should I add it as a new ingredient in the 'garnish' category, or merge with an existing spice?"
4. **After confirmation**: Add to DB, add aliases
5. **Add recipe with correct naming**
