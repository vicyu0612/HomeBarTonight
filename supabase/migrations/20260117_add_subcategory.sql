-- Add subcategory column to ingredients if it doesn't exist
do $$ 
begin 
    if not exists (select 1 from information_schema.columns where table_name = 'ingredients' and column_name = 'subcategory') then
        alter table public.ingredients add column subcategory text;
    end if;
end $$;

-- Update categories and subcategories
-- We include both underscore (_) and dash (-) variants for IDs to ensure we match existing data.

UPDATE public.ingredients
SET 
  category = CASE
    -- Base Spirits (Whiskey)
    WHEN id IN (
      'whiskey', 'bourbon', 'rye_whiskey', 'rye-whiskey', 'scotch', 'scotch_whiskey', 'scotch-whiskey', 
      'japanese_whiskey', 'japanese-whiskey', 'irish_whiskey', 'irish-whiskey', 
      'canadian_whiskey', 'canadian-whiskey', 'tennessee_whiskey', 'tennessee-whiskey', 
      'islay_whiskey', 'islay-whiskey', 'highland_whiskey', 'highland-whiskey', 
      'speyside_whiskey', 'speyside-whiskey', 'blended_whiskey', 'blended-whiskey', 'single_malt', 'single-malt'
    ) THEN 'base'
    
    -- Base Spirits (Gin)
    WHEN id IN (
      'gin', 'london_dry', 'london_dry_gin', 'london-dry-gin', 'plymouth_gin', 'plymouth-gin', 
      'old_tom_gin', 'old-tom-gin', 'sloe_gin', 'sloe-gin', 
      'navy_strength_gin', 'navy-strength-gin', 'botanical_gin', 'botanical-gin', 
      'hendricks', 'roku', 'tanqueray', 'beefeater', 'bombay_sapphire', 'bombay-sapphire'
    ) THEN 'base'
    
    -- Base Spirits (Rum)
    WHEN id IN (
      'rum', 'white_rum', 'white-rum', 'light_rum', 'light-rum', 'dark_rum', 'dark-rum', 
      'gold_rum', 'gold-rum', 'aged_rum', 'aged-rum', 'spiced_rum', 'spiced-rum', 
      'overproof_rum', 'overproof-rum', 'navy_rum', 'navy-rum', 'black_rum', 'black-rum', 
      'cachaça', 'cachaca', 'rhum_agricole', 'rhum-agricole', 'coconut_rum', 'coconut-rum', 'malibu'
    ) THEN 'base'
    
    -- Base Spirits (Tequila/Mezcal)
    WHEN id IN (
      'tequila', 'tequila_blanco', 'tequila-blanco', 'tequila_silver', 'tequila-silver', 
      'tequila_reposado', 'tequila-reposado', 'tequila_anejo', 'tequila-anejo', 
      'tequila_gold', 'tequila-gold', 'mezcal', 'mezcal_espadin', 'mezcal-espadin'
    ) THEN 'base'
    
    -- Base Spirits (Vodka)
    WHEN id IN (
      'vodka', 'vodka_citron', 'vodka-citron', 'citrus_vodka', 'citrus-vodka', 
      'vanilla_vodka', 'vanilla-vodka', 'flavored_vodka', 'flavored-vodka', 
      'grey_goose', 'grey-goose', 'absolut', 'smirnoff', 'ketel_one', 'ketel-one', 'belvedere'
    ) THEN 'base'
    
    -- Base Spirits (Brandy)
    WHEN id IN (
      'brandy', 'cognac', 'armagnac', 'calvados', 'pisco', 'apple_brandy', 'apple-brandy', 
      'apricot_brandy', 'apricot-brandy', 'cherry_brandy', 'cherry-brandy', 'grappa'
    ) THEN 'base'
    
    -- Base Spirits (Other)
    WHEN id IN ('kaoliang', 'moutai', 'chinese_spirit', 'chinese-spirit') THEN 'base'

    -- Liqueurs (Fruit)
    WHEN id IN (
      'cointreau', 'triple_sec', 'triple-sec', 'orange_liqueur', 'orange-liqueur', 
      'blue_curacao', 'blue-curacao', 'curacao', 'dry_curacao', 'dry-curacao', 
      'grand_marnier', 'grand-marnier', 'apricot_liqueur', 'apricot-liqueur', 
      'cherry_liqueur', 'cherry-liqueur', 'midori', 'melon_liqueur', 'melon-liqueur', 
      'chambord', 'raspberry_liqueur', 'raspberry-liqueur', 'creme_de_cassis', 'creme-de-cassis', 
      'creme_de_mure', 'creme-de-mure', 'peach_schnapps', 'peach-schnapps', 
      'peach_liqueur', 'peach-liqueur', 'limoncello', 'maraschino', 'maraschino_liqueur', 'maraschino-liqueur'
    ) THEN 'liqueur'
    
    -- Liqueurs (Herbal)
    WHEN id IN (
      'campari', 'aperol', 'jagermeister', 'chartreuse_green', 'chartreuse-green', 
      'chartreuse_yellow', 'chartreuse-yellow', 'chartreuse', 'benedictine', 
      'fernet_branca', 'fernet-branca', 'fernet', 'amaro', 'amaro_nonino', 'amaro-nonino', 
      'amaro_montenegro', 'amaro-montenegro', 'suze', 'cynar', 'absinthe', 'galliano', 
      'sambuca', 'drambuie', 'pimms'
    ) THEN 'liqueur'
    
    -- Liqueurs (Nut/Cream/Coffee)
    WHEN id IN (
      'amaretto', 'frangelico', 'hazelnut_liqueur', 'hazelnut-liqueur', 
      'kahlua', 'coffee_liqueur', 'coffee-liqueur', 'baileys', 'irish_cream', 'irish-cream', 
      'creme_de_cacao', 'creme-de-cacao', 'creme_de_cacao_white', 'creme-de-cacao-white', 
      'creme_de_cacao_dark', 'creme-de-cacao-dark', 'mozart', 'chocolate_liqueur', 'chocolate-liqueur', 
      'advocaat'
    ) THEN 'liqueur'
    
    -- Liqueurs (Floral)
    WHEN id IN ('st_germain', 'st-germain', 'elderflower_liqueur', 'elderflower-liqueur', 'creme_de_violette', 'creme-de-violette', 'parfait_amour', 'parfait-amour') THEN 'liqueur'

    -- Other Alcohol (Wine/Fortified)
    WHEN id IN (
      'vermouth', 'sweet_vermouth', 'sweet-vermouth', 'rosso_vermouth', 'rosso-vermouth', 
      'dry_vermouth', 'dry-vermouth', 'extra_dry_vermouth', 'extra-dry-vermouth', 
      'bianco_vermouth', 'bianco-vermouth', 'blanc_vermouth', 'blanc-vermouth', 
      'lillet', 'lillet_blanc', 'lillet-blanc', 'lillet_rouge', 'lillet-rouge', 
      'lillet_rose', 'lillet-rose', 'sherry', 'port', 'madeira', 'marsala', 
      'red_wine', 'red-wine', 'white_wine', 'white-wine', 'rose_wine', 'rose-wine', 
      'sparkling_wine', 'sparkling-wine', 'prosecco', 'champagne', 'cava', 'moscato', 
      'sake', 'soju', 'shochu'
    ) THEN 'other_alc'
    
    -- Other Alcohol (Beer/Cider)
    WHEN id IN (
      'beer', 'lager', 'ale', 'ipa', 'stout', 'pilsner', 'wheat_beer', 'wheat-beer', 
      'cider', 'hard_cider', 'hard-cider', 'apple_cider', 'apple-cider'
    ) THEN 'other_alc'

    -- Mixers (Soda)
    WHEN id IN (
      'soda', 'soda_water', 'soda-water', 'club_soda', 'club-soda', 
      'sparkling_water', 'sparkling-water', 'tonic', 'tonic_water', 'tonic-water', 
      'ginger_ale', 'ginger-ale', 'ginger_beer', 'ginger-beer', 
      'cola', 'coke', 'sprite', '7up', 'lemon_soda', 'lemon-soda', 
      'grapefruit_soda', 'grapefruit-soda', 'root_beer', 'root-beer', 'sarsaparilla'
    ) THEN 'mixer'
    
    -- Mixers (Juice)
    WHEN id IN (
      'lemon_juice', 'lemon-juice', 'lime_juice', 'lime-juice', 
      'orange_juice', 'orange-juice', 'fresh_orange_juice', 'fresh-orange-juice', 
      'blood_orange_juice', 'blood-orange-juice', 'grapefruit_juice', 'grapefruit-juice', 
      'pineapple_juice', 'pineapple-juice', 'cranberry_juice', 'cranberry-juice', 
      'tomato_juice', 'tomato-juice', 'apple_juice', 'apple-juice', 
      'guava_juice', 'guava-juice', 'peach_juice', 'peach-juice', 
      'grape_juice', 'grape-juice', 'pomegranate_juice', 'pomegranate-juice', 
      'asparagus_juice', 'asparagus-juice', 'peach_puree', 'peach-puree'
    ) THEN 'mixer'
    
    -- Mixers (Tea/Coffee)
    WHEN id IN (
      'tea', 'black_tea', 'black-tea', 'green_tea', 'green-tea', 
      'oolong_tea', 'oolong-tea', 'matcha', 'earl_grey', 'earl-grey', 
      'chrysanthemum_tea', 'chrysanthemum-tea', 'lemon_tea', 'lemon-tea', 
      'milk_tea', 'milk-tea', 'coffee', 'espresso', 'cold_brew', 'cold-brew', 
      'black_coffee', 'black-coffee', 'almond_tea', 'almond-tea', 
      'barley_tea', 'barley-tea', 'plum_green_tea', 'plum-green-tea'
    ) THEN 'mixer'
    
    -- Mixers (Dairy/Other)
    WHEN id IN (
      'milk', 'cream', 'heavy_cream', 'heavy-cream', 'half_and_half', 'half-and-half', 
      'soy_milk', 'soy-milk', 'oat_milk', 'oat-milk', 'coconut_milk', 'coconut-milk', 
      'almond_milk', 'almond-milk', 'yogurt', 'yakult', 'calpis', 
      'coffee_milk', 'coffee-milk', 'papaya_milk', 'papaya-milk', 
      'banana_milk', 'banana-milk', 'chocolate_milk', 'chocolate-milk', 
      'coconut_water', 'coconut-water', 'honey_lemon_water', 'honey-lemon-water', 
      'energy_drink', 'energy-drink', 'sports_drink', 'sports-drink', 
      'pudding', 'grass_jelly', 'grass-jelly', 'hot_chocolate', 'hot-chocolate', 
      'melon_popsicle', 'melon-popsicle', 'aloe'
    ) THEN 'mixer'
    
    -- Essentials (Syrup/Sweetener)
    WHEN id IN (
      'simple_syrup', 'simple-syrup', 'sugar_syrup', 'sugar-syrup', 
      'rich_syrup', 'rich-syrup', 'honey_syrup', 'honey-syrup', 
      'honey_water', 'honey-water', 'agave', 'agave_syrup', 'agave-syrup', 
      'maple_syrup', 'maple-syrup', 'grenadine', 'orgeat', 
      'gum_syrup', 'gum-syrup', 'ginger_syrup', 'ginger-syrup', 
      'cinnamon_syrup', 'cinnamon-syrup', 'passionfruit_syrup', 'passionfruit-syrup', 
      'vanilla_syrup', 'vanilla-syrup', 'sugar', 'honey'
    ) THEN 'essential'
    
    -- Essentials (Other)
    WHEN id IN (
      'ice', 'salt', 'pepper', 'egg', 'egg_white', 'egg-white', 
      'bitters', 'angostura', 'angostura_bitters', 'angostura-bitters', 
      'orange_bitters', 'orange-bitters', 'peychauds', 'peychauds_bitters', 'peychauds-bitters', 
      'chocolate_bitters', 'chocolate-bitters', 'worcestershire', 'hot_sauce', 'hot-sauce', 
      'tabasco', 'nutmeg', 'cinnamon'
    ) THEN 'essential'
    
    -- Garnish
    WHEN id IN (
      'lemon', 'lime', 'orange', 'grapefruit', 'cucumber', 'mint', 
      'basil', 'rosemary', 'thyme', 'olive', 'cherry', 'maraschino_cherry', 'maraschino-cherry', 
      'plum', 'marshmallow'
    ) THEN 'garnish'

    ELSE category
  END,

  subcategory = CASE
    -- Whiskey
    WHEN id IN (
      'whiskey', 'bourbon', 'rye_whiskey', 'rye-whiskey', 'scotch', 'scotch_whiskey', 'scotch-whiskey', 
      'japanese_whiskey', 'japanese-whiskey', 'irish_whiskey', 'irish-whiskey', 
      'canadian_whiskey', 'canadian-whiskey', 'tennessee_whiskey', 'tennessee-whiskey', 
      'islay_whiskey', 'islay-whiskey', 'highland_whiskey', 'highland-whiskey', 
      'speyside_whiskey', 'speyside-whiskey', 'blended_whiskey', 'blended-whiskey', 'single_malt', 'single-malt'
    ) THEN 'whiskey'
    
    -- Gin
    WHEN id IN (
      'gin', 'london_dry', 'london_dry_gin', 'london-dry-gin', 'plymouth_gin', 'plymouth-gin', 
      'old_tom_gin', 'old-tom-gin', 'sloe_gin', 'sloe-gin', 
      'navy_strength_gin', 'navy-strength-gin', 'botanical_gin', 'botanical-gin', 
      'hendricks', 'roku', 'tanqueray', 'beefeater', 'bombay_sapphire', 'bombay-sapphire'
    ) THEN 'gin'
    
    -- Rum
    WHEN id IN (
      'rum', 'white_rum', 'white-rum', 'light_rum', 'light-rum', 'dark_rum', 'dark-rum', 
      'gold_rum', 'gold-rum', 'aged_rum', 'aged-rum', 'spiced_rum', 'spiced-rum', 
      'overproof_rum', 'overproof-rum', 'navy_rum', 'navy-rum', 'black_rum', 'black-rum', 
      'cachaça', 'cachaca', 'rhum_agricole', 'rhum-agricole', 'coconut_rum', 'coconut-rum', 'malibu'
    ) THEN 'rum'
    
    -- Tequila/Mezcal
    WHEN id IN (
      'tequila', 'tequila_blanco', 'tequila-blanco', 'tequila_silver', 'tequila-silver', 
      'tequila_reposado', 'tequila-reposado', 'tequila_anejo', 'tequila-anejo', 
      'tequila_gold', 'tequila-gold', 'mezcal', 'mezcal_espadin', 'mezcal-espadin'
    ) THEN 'tequila'
    
    -- Vodka
    WHEN id IN (
      'vodka', 'vodka_citron', 'vodka-citron', 'citrus_vodka', 'citrus-vodka', 
      'vanilla_vodka', 'vanilla-vodka', 'flavored_vodka', 'flavored-vodka', 
      'grey_goose', 'grey-goose', 'absolut', 'smirnoff', 'ketel_one', 'ketel-one', 'belvedere'
    ) THEN 'vodka'
    
    -- Brandy
    WHEN id IN (
      'brandy', 'cognac', 'armagnac', 'calvados', 'pisco', 'apple_brandy', 'apple-brandy', 
      'apricot_brandy', 'apricot-brandy', 'cherry_brandy', 'cherry-brandy', 'grappa'
    ) THEN 'brandy'
    
    -- Chinese Spirits
    WHEN id IN ('kaoliang', 'moutai', 'chinese_spirit', 'chinese-spirit') THEN 'chinese_spirit'

    -- Fruit Liqueurs
    WHEN id IN (
      'cointreau', 'triple_sec', 'triple-sec', 'orange_liqueur', 'orange-liqueur', 
      'blue_curacao', 'blue-curacao', 'curacao', 'dry_curacao', 'dry-curacao', 
      'grand_marnier', 'grand-marnier', 'apricot_liqueur', 'apricot-liqueur', 
      'cherry_liqueur', 'cherry-liqueur', 'midori', 'melon_liqueur', 'melon-liqueur', 
      'chambord', 'raspberry_liqueur', 'raspberry-liqueur', 'creme_de_cassis', 'creme-de-cassis', 
      'creme_de_mure', 'creme-de-mure', 'peach_schnapps', 'peach-schnapps', 
      'peach_liqueur', 'peach-liqueur', 'limoncello', 'maraschino', 'maraschino_liqueur', 'maraschino-liqueur', 
      'umeshu'
    ) THEN 'fruit_liqueur'
    
    -- Herbal Liqueurs
    WHEN id IN (
      'campari', 'aperol', 'jagermeister', 'chartreuse_green', 'chartreuse-green', 
      'chartreuse_yellow', 'chartreuse-yellow', 'chartreuse', 'benedictine', 
      'fernet_branca', 'fernet-branca', 'fernet', 'amaro', 'amaro_nonino', 'amaro-nonino', 
      'amaro_montenegro', 'amaro-montenegro', 'suze', 'cynar', 'absinthe', 'galliano', 
      'sambuca', 'drambuie', 'pimms'
    ) THEN 'herbal_liqueur'
    
    -- Nut/Cream/Coffee Liqueurs
    WHEN id IN (
      'amaretto', 'frangelico', 'hazelnut_liqueur', 'hazelnut-liqueur', 
      'kahlua', 'coffee_liqueur', 'coffee-liqueur', 'baileys', 'irish_cream', 'irish-cream', 
      'creme_de_cacao', 'creme-de-cacao', 'creme_de_cacao_white', 'creme-de-cacao-white', 
      'creme_de_cacao_dark', 'creme-de-cacao-dark', 'mozart', 'chocolate_liqueur', 'chocolate-liqueur', 
      'advocaat'
    ) THEN 'nut_cream_liqueur'
    
    -- Floral Liqueurs
    WHEN id IN ('st_germain', 'st-germain', 'elderflower_liqueur', 'elderflower-liqueur', 'creme_de_violette', 'creme-de-violette', 'parfait_amour', 'parfait-amour', 'lillet', 'lillet_blanc', 'lillet-blanc', 'lillet_rouge', 'lillet-rouge', 'lillet_rose', 'lillet-rose') THEN 'floral_liqueur'
    
    -- Other Liqueurs
    WHEN id IN ('honey_whiskey', 'honey-whiskey', 'drambuie', 'southern_comfort', 'southern-comfort') THEN 'other_liqueur'

    -- Wine
    WHEN id IN (
      'vermouth', 'sweet_vermouth', 'sweet-vermouth', 'rosso_vermouth', 'rosso-vermouth', 
      'dry_vermouth', 'dry-vermouth', 'extra_dry_vermouth', 'extra-dry-vermouth', 
      'bianco_vermouth', 'bianco-vermouth', 'blanc_vermouth', 'blanc-vermouth', 
      'sherry', 'port', 'madeira', 'marsala', 'red_wine', 'red-wine', 'white_wine', 'white-wine', 
      'rose_wine', 'rose-wine', 'moscato'
    ) THEN 'wine'
    
    -- Sparkling Alcohol (Beer + Cider + Sparkling Wine)
    WHEN id IN (
      'beer', 'lager', 'ale', 'ipa', 'stout', 'pilsner', 'wheat_beer', 'wheat-beer', 
      'cider', 'hard_cider', 'hard-cider', 'apple_cider', 'apple-cider', 
      'ginger_beer', 'ginger-beer', 'sparkling_wine', 'sparkling-wine', 'prosecco', 'champagne', 'cava'
    ) THEN 'sparkling_alc'
    
    -- Rice Spirits
    WHEN id IN ('sake', 'soju', 'shochu') THEN 'rice_spirit'

    -- Soda
    WHEN id IN (
      'soda', 'soda_water', 'soda-water', 'club_soda', 'club-soda', 
      'sparkling_water', 'sparkling-water', 'tonic', 'tonic_water', 'tonic-water', 
      'ginger_ale', 'ginger-ale', 'cola', 'coke', 'sprite', '7up', 
      'lemon_soda', 'lemon-soda', 'grapefruit_soda', 'grapefruit-soda', 
      'root_beer', 'root-beer', 'sarsaparilla'
    ) THEN 'soda'
    
    -- Juice
    WHEN id IN (
      'lemon_juice', 'lemon-juice', 'lime_juice', 'lime-juice', 
      'orange_juice', 'orange-juice', 'fresh_orange_juice', 'fresh-orange-juice', 
      'blood_orange_juice', 'blood-orange-juice', 'grapefruit_juice', 'grapefruit-juice', 
      'pineapple_juice', 'pineapple-juice', 'cranberry_juice', 'cranberry-juice', 
      'tomato_juice', 'tomato-juice', 'apple_juice', 'apple-juice', 
      'guava_juice', 'guava-juice', 'peach_juice', 'peach-juice', 
      'grape_juice', 'grape-juice', 'pomegranate_juice', 'pomegranate-juice', 
      'asparagus_juice', 'asparagus-juice', 'peach_puree', 'peach-puree', 
      'coconut_water', 'coconut-water'
    ) THEN 'juice'
    
    -- Tea/Coffee
    WHEN id IN (
      'tea', 'black_tea', 'black-tea', 'green_tea', 'green-tea', 
      'oolong_tea', 'oolong-tea', 'matcha', 'earl_grey', 'earl-grey', 
      'chrysanthemum_tea', 'chrysanthemum-tea', 'lemon_tea', 'lemon-tea', 
      'milk_tea', 'milk-tea', 'coffee', 'espresso', 'cold_brew', 'cold-brew', 
      'black_coffee', 'black-coffee', 'almond_tea', 'almond-tea', 
      'barley_tea', 'barley-tea', 'plum_green_tea', 'plum-green-tea', 'ginger_tea', 'ginger-tea'
    ) THEN 'tea_coffee'
    
    -- Dairy
    WHEN id IN (
      'milk', 'cream', 'heavy_cream', 'heavy-cream', 'half_and_half', 'half-and-half', 
      'soy_milk', 'soy-milk', 'oat_milk', 'oat-milk', 'coconut_milk', 'coconut-milk', 
      'almond_milk', 'almond-milk', 'yogurt', 'yakult', 'calpis', 
      'coffee_milk', 'coffee-milk', 'papaya_milk', 'papaya-milk', 
      'banana_milk', 'banana-milk', 'chocolate_milk', 'chocolate-milk', 
      'pudding', 'grass_jelly', 'grass-jelly', 'hot_chocolate', 'hot-chocolate', 
      'melon_popsicle', 'melon-popsicle', 'aloe'
    ) THEN 'dairy'
    
    -- Syrup
    WHEN id IN (
      'simple_syrup', 'simple-syrup', 'sugar_syrup', 'sugar-syrup', 
      'rich_syrup', 'rich-syrup', 'honey_syrup', 'honey-syrup', 
      'honey_water', 'honey-water', 'agave', 'agave_syrup', 'agave-syrup', 
      'maple_syrup', 'maple-syrup', 'grenadine', 'orgeat', 
      'gum_syrup', 'gum-syrup', 'ginger_syrup', 'ginger-syrup', 
      'honey_ginger_syrup', 'honey-ginger-syrup',
      'cinnamon_syrup', 'cinnamon-syrup', 'passionfruit_syrup', 'passionfruit-syrup', 
      'vanilla_syrup', 'vanilla-syrup', 'sugar', 'honey'
    ) THEN 'syrup'

    -- Bitters
    WHEN id IN (
      'bitters', 'angostura', 'angostura_bitters', 'angostura-bitters', 
      'orange_bitters', 'orange-bitters', 'peychauds', 'peychauds_bitters', 'peychauds-bitters', 
      'chocolate_bitters', 'chocolate-bitters'
    ) THEN 'bitters'
    
    ELSE NULL
  END;

-- Safety nets for partial matches (User specific requests)
UPDATE public.ingredients SET subcategory = 'whiskey', category = 'base' WHERE (id ILIKE '%islay%' OR id ILIKE '%whiskey%' OR id ILIKE '%whisky%' OR id ILIKE '%bourbon%' OR id ILIKE '%scotch%') AND subcategory IS NULL;
UPDATE public.ingredients SET subcategory = 'gin', category = 'base' WHERE id ILIKE '%gin%' AND subcategory IS NULL;
UPDATE public.ingredients SET subcategory = 'rum', category = 'base' WHERE id ILIKE '%rum%' AND subcategory IS NULL;
UPDATE public.ingredients SET subcategory = 'tequila', category = 'base' WHERE (id ILIKE '%tequila%' OR id ILIKE '%mezcal%') AND subcategory IS NULL;
UPDATE public.ingredients SET subcategory = 'vodka', category = 'base' WHERE id ILIKE '%vodka%' AND subcategory IS NULL;
UPDATE public.ingredients SET subcategory = 'brandy', category = 'base' WHERE (id ILIKE '%brandy%' OR id ILIKE '%cognac%') AND subcategory IS NULL;

-- General cleanup for known suffixes
UPDATE public.ingredients SET subcategory = 'juice', category = 'mixer' WHERE id ILIKE '%juice%' AND subcategory IS NULL;
UPDATE public.ingredients SET subcategory = 'syrup', category = 'essential' WHERE (id ILIKE '%syrup%' OR id ILIKE '%sugar%') AND subcategory IS NULL;
UPDATE public.ingredients SET subcategory = 'soda', category = 'mixer' WHERE (id ILIKE '%soda%' OR id ILIKE '%sparkling%') AND subcategory IS NULL;

-- Fix User Specific Requests via Fuzzy Match (Last Resort to overwrite above if needed)
UPDATE public.ingredients SET subcategory = 'tea_coffee', category = 'mixer' WHERE id ILIKE '%ginger_tea%' OR id ILIKE '%ginger-tea%';
UPDATE public.ingredients SET subcategory = 'syrup', category = 'essential' WHERE id ILIKE '%honey_ginger_syrup%' OR id ILIKE '%honey-ginger-syrup%';
UPDATE public.ingredients SET subcategory = 'other_liqueur', category = 'liqueur' WHERE id ILIKE '%honey_whiskey%' OR id ILIKE '%honey-whiskey%';
UPDATE public.ingredients SET subcategory = 'sparkling_alc', category = 'other_alc' WHERE id ILIKE '%prosecco%' OR id ILIKE '%champagne%' OR id ILIKE '%sparkling_wine%' OR id ILIKE '%sparkling-wine%';
UPDATE public.ingredients SET subcategory = 'rice_spirit', category = 'other_alc' WHERE id ILIKE '%sake%' OR id ILIKE '%soju%' OR id ILIKE '%shochu%';

-- Corrections 2026-01-16 (Cocoa, Fruit & Dessert additions)
UPDATE public.ingredients SET subcategory = 'tea_coffee', category = 'mixer' WHERE id ILIKE 'hot_chocolate' OR id ILIKE 'hot-chocolate' OR id ILIKE '%cocoa%';
UPDATE public.ingredients SET subcategory = 'wine', category = 'other_alc' WHERE id ILIKE 'red_wine' OR id ILIKE 'red-wine'; 

-- Move items to Fruit & Dessert (No subcategory needed or maybe 'fruit' is fine, but MyBarModal defaults using main category)
-- Setting subcategory to 'fruit' for consistency if available, or just keeping it null is fine if main cat is fruit_dessert.
-- Let's use 'fruit' or 'dessert' subcategory if we want to be fancy, but current UI maps `fruit` -> `Fruit`.
-- Let's just set category = 'fruit_dessert' and subcategory = 'fruit' (since we have 'fruit' in translation map) or 'dessert' (not in map).
-- Map has 'fruit': { en: 'Fruit', zh: '水果' }.
-- For things like Pudding/Popsicle maybe new subcategory 'dessert'?
-- Map has 'pantry' for "家中常備".
-- Let's check MyBarModal labels again... 'fruit_dessert' category is shown.
-- The user didn't ask for subcategory "Dessert", just "Fruit & Dessert" category.
-- I will assign them to category='fruit_dessert' and subcategory='fruit' for fruit items, and maybe just leave subcategory NULL or make a 'dessert' one if needed.
-- But wait, standard Fruits (Lemon, Lime) are currently 'garnish'.
-- Let's move them to 'fruit_dessert' category, and maybe 'fruit' subcategory.

UPDATE public.ingredients SET category = 'fruit_dessert', subcategory = 'fruit' WHERE 
  id IN ('lemon', 'lime', 'orange', 'grapefruit', 'cucumber', 'watermelon', 'pineapple') 
  OR id ILIKE '%melon_popsicle%' OR id ILIKE '%melon-popsicle%'
  OR id ILIKE '%pudding%'
  OR id ILIKE '%marshmallow%';

-- Ensure Lemon/Lime are not overwritten by previous Garnish rules if this runs last. 
-- Note: 'cucumber', 'marshmallow', 'lemon', 'lime', 'grapefruit' were in Garnish list above.
-- Since this block is at the END, it will overwrite them correctly.

-- Corrections 2026-01-16 Part 2
-- Green Chartreuse & Green Menthe -> Herbal Liqueur
UPDATE public.ingredients SET subcategory = 'herbal_liqueur', category = 'liqueur' WHERE id ILIKE '%chartreuse%' AND id ILIKE '%green%';
UPDATE public.ingredients SET subcategory = 'herbal_liqueur', category = 'liqueur' WHERE (id ILIKE '%menthe%' AND id ILIKE '%green%') OR id ILIKE '%creme_de_menthe%';

-- Ginger Beer -> Sparkling Drinks (soda)
-- Previously in beer/sparkling_alc, moving to soda/mixer
UPDATE public.ingredients SET subcategory = 'soda', category = 'mixer' WHERE id ILIKE '%ginger_beer%' OR id ILIKE '%ginger-beer%';

-- Red Wine -> Wine (Other Alc)
UPDATE public.ingredients SET subcategory = 'wine', category = 'other_alc' WHERE id ILIKE 'red_wine' OR id ILIKE 'red-wine';

-- Fruit & Dessert Split
-- Assign Dessert subcategory
UPDATE public.ingredients SET subcategory = 'dessert', category = 'fruit_dessert' WHERE 
  id ILIKE '%melon_popsicle%' OR id ILIKE '%melon-popsicle%' 
  OR id ILIKE '%pudding%' 
  OR id ILIKE '%marshmallow%'
  OR id ILIKE '%ice_cream%' OR id ILIKE '%ice-cream%'
  OR id ILIKE '%chocolate_sauce%';

-- Assign Fruit subcategory (Dragon Fruit & others)
UPDATE public.ingredients SET subcategory = 'fruit', category = 'fruit_dessert' WHERE
  id ILIKE '%dragon_fruit%' OR id ILIKE '%dragonfruit%' OR id ILIKE '%pitaya%';


