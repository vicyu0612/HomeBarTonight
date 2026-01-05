import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import clsx from 'clsx';
import type { Recipe } from '../data/recipes';
import { normalizeIngredient, getIngredientLabel } from '../utils/normalization';

interface MyBarModalProps {
    isOpen: boolean;
    onClose: () => void;
    allRecipes: Recipe[];
    myInventory: Set<string>;
    setMyInventory: (inventory: Set<string>) => void;
    lang: 'en' | 'zh';
}

export function MyBarModal({
    isOpen,
    onClose,
    allRecipes,
    myInventory,
    setMyInventory,
    lang
}: MyBarModalProps) {

    // Extract and categorize ingredients
    const categories = useMemo(() => {
        const cats = {
            base: new Set<string>(),
            liqueur: new Set<string>(),
            other_alc: new Set<string>(),
            essential: new Set<string>(),
            mixer: new Set<string>(),
            garnish: new Set<string>(),
            other: new Set<string>()
        };

        allRecipes.forEach(recipe => {
            recipe.ingredients[lang].forEach(ing => {
                // normalizeIngredient now returns IDs
                const ids = normalizeIngredient(ing.name, lang);

                ids.forEach(id => {
                    // ID-based categorization

                    // 1. Base Spirits
                    if (
                        id === 'whiskey' || id === 'gin' || id === 'vodka' ||
                        id === 'rum' || id === 'tequila' || id === 'brandy'
                    ) {
                        cats.base.add(id);
                    }
                    // 2. Liqueurs & Vermouth
                    else if (
                        id === 'liqueur' || id === 'cointreau' || id === 'coffee_liqueur' ||
                        id === 'baileys' || id === 'malibu' || id === 'campari' ||
                        id === 'aperol' || id === 'vermouth' || id === 'dry_vermouth' ||
                        id === 'cocoa_liqueur' ||
                        id === 'grand_marnier' || id === 'amaretto'
                    ) {
                        cats.liqueur.add(id);
                    }
                    // 3. Other Alcohols
                    else if (
                        id === 'beer' || id === 'wine' ||
                        id === 'soju' || id === 'sake' || id === 'champagne' ||
                        id === 'hard_cider' || id === 'cider' || id === 'kaoliang'
                    ) {
                        cats.other_alc.add(id);
                    }
                    // 4. Essentials
                    else if (
                        id === 'ice' || id === 'sugar' || id === 'salt' ||
                        id === 'bitters' || id === 'lemon' || id === 'lime' ||
                        id === 'cream' || id === 'egg' || id === 'honey' ||
                        id === 'worcestershire' || id === 'hot_sauce'
                    ) {
                        cats.essential.add(id);
                    }
                    // 5. Common Drinks & Desserts (Mixers)
                    else if (
                        id === 'soda' || id === 'tonic' || id === 'ginger_ale' ||
                        id === 'coke' || id === 'sprite' || id === 'lemon_soda' ||
                        id === 'juice' || id === 'orange_juice' || id === 'tea' ||
                        id === 'coffee' || id === 'water' || id === 'yakult' ||
                        id === 'calpis' || id === 'milk' || id === 'grenadine' ||
                        id === 'melon_popsicle' || id === 'apple_soda' ||
                        id === 'espresso' || id === 'tomato_juice' || id === 'guava_juice' ||
                        id === 'grapefruit_soda' || id === 'oolong_tea' ||
                        id === 'cranberry_juice' || id === 'orgeat' || id === 'lime_cordial' ||
                        id === 'sarsaparilla' || id === 'grape_juice' || id === 'aloe'
                    ) {
                        cats.mixer.add(id);
                    }
                    // 6. Garnishes & Others
                    else {
                        cats.garnish.add(id);
                        // Explicitly check for known garnishes if needed, but else block catches 'celery', 'olive', 'nutmeg' etc.
                    }
                });
            });
        });

        // Convert Sets to sorted Arrays
        return {
            base: Array.from(cats.base).sort(),
            liqueur: Array.from(cats.liqueur).sort(),
            other_alc: Array.from(cats.other_alc).sort(),
            essential: Array.from(cats.essential).sort(),
            mixer: Array.from(cats.mixer).sort(),
            garnish: Array.from(cats.garnish).sort().concat(Array.from(cats.other).sort())
        };
    }, [allRecipes, lang]);

    const toggleItem = (item: string) => {
        const newSet = new Set(myInventory);
        if (newSet.has(item)) {
            newSet.delete(item);
        } else {
            newSet.add(item);
        }
        setMyInventory(newSet);
    };

    const toggleAll = (items: string[]) => {
        const newSet = new Set(myInventory);
        const allSelected = items.every(i => newSet.has(i));

        if (allSelected) {
            items.forEach(i => newSet.delete(i));
        } else {
            items.forEach(i => newSet.add(i));
        }
        setMyInventory(newSet);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="bg-zinc-900 w-full max-w-2xl max-h-[85vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-zinc-800"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50 backdrop-blur-xl">
                            <div>
                                <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                                    {lang === 'zh' ? '我的吧台' : 'My Bar'}
                                </h2>
                                <p className="text-zinc-400 text-sm mt-1">
                                    {lang === 'zh'
                                        ? `已選擇 ${myInventory.size} 項材料`
                                        : `${myInventory.size} ingredients selected`}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setMyInventory(new Set())}
                                    className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-bold transition-colors border border-red-500/20"
                                >
                                    {lang === 'zh' ? '全部清除' : 'Clear All'}
                                </button>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400 hover:text-white"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">

                            {/* Helper to render sections */}
                            {[
                                { id: 'base', title: lang === 'zh' ? '基酒' : 'Base Spirits', color: 'bg-amber-500', items: categories.base },
                                { id: 'liqueur', title: lang === 'zh' ? '利口酒' : 'Liqueurs', color: 'bg-orange-500', items: categories.liqueur },
                                { id: 'other_alc', title: lang === 'zh' ? '其他酒類' : 'Other Alcohol', color: 'bg-red-500', items: categories.other_alc },
                                { id: 'essential', title: lang === 'zh' ? '基本 (冰、糖、檸檬、苦精)' : 'Essentials (Ice, Sugar, Lemon, Bitters)', color: 'bg-zinc-400', items: categories.essential },
                                { id: 'mixer', title: lang === 'zh' ? '常見飲料甜品 (果汁、汽水、冰棒)' : 'Common Drinks & Desserts (Juice, Soda, Popsicle)', color: 'bg-blue-400', items: categories.mixer },
                                { id: 'garnish', title: lang === 'zh' ? '裝飾 & 其他 (薄荷、橄欖、小黃瓜...)' : 'Garnishes & Others (Mint, Olive, Cucumber...)', color: 'bg-green-500', items: categories.garnish },
                            ].map(section => (
                                section.items.length > 0 && (
                                    <section key={section.id}>
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                                                <span className={`w-1.5 h-1.5 rounded-full ${section.color}`}></span>
                                                {section.title}
                                            </h3>
                                            <button
                                                onClick={() => toggleAll(section.items)}
                                                className={`text-xs px-2 py-1 rounded transition-colors ${section.items.every(i => myInventory.has(i))
                                                    ? 'text-zinc-400 hover:text-zinc-200 hover:bg-white/10'
                                                    : 'text-primary hover:text-primary/80 hover:bg-primary/10'
                                                    }`}
                                            >
                                                {section.items.every(i => myInventory.has(i))
                                                    ? (lang === 'zh' ? '全取消' : 'Unselect All')
                                                    : (lang === 'zh' ? '全選' : 'Select All')}
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            {section.items.map(item => (
                                                <button
                                                    key={item}
                                                    onClick={() => toggleItem(item)}
                                                    className={clsx(
                                                        "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left border relative overflow-hidden",
                                                        myInventory.has(item)
                                                            ? `bg-${section.color.split('-')[1]}-500/20 text-${section.color.split('-')[1]}-200 border-${section.color.split('-')[1]}-500/50 shadow-[0_0_10px_rgba(255,255,255,0.1)]`
                                                            : "bg-white/5 text-zinc-400 border-white/5 hover:bg-white/10"
                                                    )}
                                                >
                                                    <div className={clsx(
                                                        "w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors",
                                                        myInventory.has(item)
                                                            ? "bg-primary border-primary text-black"
                                                            : "border-zinc-600 bg-transparent"
                                                    )}>
                                                        {myInventory.has(item) && <Check size={12} strokeWidth={3} />}
                                                    </div>
                                                    <span className={clsx(
                                                        "truncate",
                                                        myInventory.has(item) && "text-white"
                                                    )}>{getIngredientLabel(item, lang)}</span>

                                                    {/* Active Glow Background override */}
                                                    {myInventory.has(item) && (
                                                        <div className={clsx(
                                                            "absolute inset-0 opacity-10 pointer-events-none",
                                                            section.id === 'base' ? "bg-amber-500" :
                                                                section.id === 'liqueur' ? "bg-orange-500" :
                                                                    section.id === 'other_alc' ? "bg-red-500" :
                                                                        section.id === 'essential' ? "bg-zinc-400" :
                                                                            section.id === 'mixer' ? "bg-blue-400" :
                                                                                "bg-green-500"
                                                        )} />
                                                    )}
                                                    {myInventory.has(item) && (
                                                        <div className={clsx(
                                                            "absolute inset-0 border-2 rounded-xl pointer-events-none opacity-50",
                                                            section.id === 'base' ? "border-amber-500" :
                                                                section.id === 'liqueur' ? "border-orange-500" :
                                                                    section.id === 'other_alc' ? "border-red-500" :
                                                                        section.id === 'essential' ? "border-zinc-400" :
                                                                            section.id === 'mixer' ? "border-blue-400" :
                                                                                "border-green-500"
                                                        )} />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </section>
                                )
                            ))}

                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-white/5 bg-zinc-900 z-10">
                            <button
                                onClick={onClose}
                                className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 text-white font-bold shadow-lg shadow-amber-900/40 active:scale-[0.98] transition-all"
                            >
                                {lang === 'zh' ? `完成 (${myInventory.size} 項材料)` : `Done (${myInventory.size} items)`}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )
            }
        </AnimatePresence >
    );
}
