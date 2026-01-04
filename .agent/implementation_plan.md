# Implementation Plan - Refine My Bar Modal Categories

## Objective
Refine the "My Bar" modal to categorize ingredients into specific groups for better usability.

## Categorization Logic
Ingredients are now normalized and classified into the following 6 categories:
1. **Base Spirits**: Whiskey, Gin, Vodka, Rum, Tequila, Brandy, Cognac.
2. **Liqueurs**: Cointreau, Kahlua, Baileys, Campari, Vermouth, etc.
3. **Other Alcohol**: Beer, Wine, Cider, Soju, Sake, Champagne.
4. **Essentials**: Ice, Sugar, Lemon, Lime, Bitters, Cream, Egg, Honey, Salt.
5. **Mixers**: Soda, Tonic, Ginger Ale, Coke, Sprite, Juices, Tea, Coffee, Water, Milk, Calpis.
6. **Garnishes & Others**: Everything else (Mint, Cucumber, etc.).

## Changes
### 1. `src/utils/normalization.ts`
- Added comprehensive mapping for sugar-related ingredients ("Sugar Cube", "Simple Syrup", etc.) to canonical "Sugar".
- Added fuzzy matching for sugar and syrup.

### 2. `src/components/MyBarModal.tsx`
- Refactored `useMemo` to classify ingredients into the 6 categories above efficiently.
- Updated rendering logic to display 6 distinct sections with unique color coding:
    - Base Spirits: Amber
    - Liqueurs: Orange
    - Other Alcohol: Red
    - Essentials: Zinc (Gray)
    - Mixers: Blue
    - Garnishes: Green
- Added "Select All" / "Unselect All" functionality per section.

### 3. `src/App.tsx`
- Confirmed "My Bar" filter logic uses `normalizeIngredient` to correctly match recipe requirements against the user's categorized inventory key.

## Verification
- Build passed (`npm run build`).
- Logic review confirms alignment between Normalization -> Categorization -> Filtering.
