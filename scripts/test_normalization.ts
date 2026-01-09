import { normalizeIngredient } from '../src/utils/normalization';
import { INGREDIENT_DB } from '../src/utils/normalization';

// Test Honey
const res = normalizeIngredient('Honey', 'en');
console.log('Normalization of "Honey":', res);

// Test if it matches 'sugar'
console.log('DB ID for Honey:', INGREDIENT_DB['honey'] ? 'honey' : 'not found');
console.log('DB ID for Sugar:', INGREDIENT_DB['sugar'] ? 'sugar' : 'not found');

// Check fuzzy match logic for "Honey" manually if needed
// (But running the function provides the truth)

// Check reverse lookup
console.log('Reverse EN keys for honey:', Object.keys(INGREDIENT_DB).filter(k => INGREDIENT_DB[k].en.toLowerCase() === 'honey'));
