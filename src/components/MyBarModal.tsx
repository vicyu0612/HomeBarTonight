import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import clsx from 'clsx';

// Define Ingredient interface matching DB schema
export interface IngredientItem {
    id: string;
    name_en: string;
    name_zh: string;
    category: 'base' | 'liqueur' | 'other_alc' | 'essential' | 'mixer' | 'garnish';
}

interface MyBarModalProps {
    isOpen: boolean;
    onClose: () => void;
    // allRecipes removed as we use allIngredients from DB now
    myInventory: Set<string>;
    setMyInventory: (inventory: Set<string>) => void;
    lang: 'en' | 'zh';
    allIngredients: IngredientItem[]; // New Prop
}

export function MyBarModal({
    isOpen,
    onClose,
    myInventory,
    setMyInventory,
    lang,
    allIngredients
}: MyBarModalProps) {
    const [isScrolled, setIsScrolled] = useState(false);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        setIsScrolled(e.currentTarget.scrollTop > 20);
    };

    // Extract and categorize ingredients from DB Data directly
    const categories = useMemo(() => {
        const cats = {
            base: [] as string[],
            liqueur: [] as string[],
            other_alc: [] as string[],
            essential: [] as string[],
            mixer: [] as string[],
            garnish: [] as string[],
        };

        // Sort ingredients alphabetically or by ID? Let's use DB order (usually insert order) or Name?
        // Let's sort by Name for better UX
        const sorted = [...allIngredients].sort((a, b) => {
            const nameA = lang === 'zh' ? a.name_zh : a.name_en;
            const nameB = lang === 'zh' ? b.name_zh : b.name_en;
            return nameA.localeCompare(nameB);
        });

        sorted.forEach(ing => {
            if (cats[ing.category]) {
                cats[ing.category].push(ing.id);
            } else {
                // Fallback for unknown categories
                cats.garnish.push(ing.id);
            }
        });

        return cats;
    }, [allIngredients, lang]);

    // Dynamic Label Helper
    const getLabel = (id: string) => {
        const found = allIngredients.find(i => i.id === id);
        if (found) {
            return lang === 'zh' ? found.name_zh : found.name_en;
        }
        return id;
    };

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
                    className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-4 bg-black/60 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="bg-black/40 backdrop-blur-2xl w-full h-[100dvh] md:h-auto md:max-w-2xl md:max-h-[85vh] rounded-none md:rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5),inset_0_0.5px_0_rgba(255,255,255,0.1)] overflow-hidden flex flex-col border-0 md:border-[0.5px] border-white/10"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className={clsx(
                            "absolute top-0 left-0 right-0 z-20 flex justify-between items-center transition-all duration-300",
                            "px-4 pb-3 pt-[calc(0.75rem+env(safe-area-inset-top))] md:p-6"
                        )}>
                            {/* Gradient Blur Background */}
                            <div
                                className={clsx(
                                    "absolute inset-0 -z-10 transition-opacity duration-300",
                                    isScrolled ? "opacity-100" : "opacity-0",
                                    "bg-gradient-to-b from-black to-transparent"
                                )}
                                style={{
                                    backdropFilter: 'blur(60px)',
                                    WebkitBackdropFilter: 'blur(60px)',
                                    maskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
                                    WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)'
                                }}
                            />
                            {/* Inline Title (Initially Hidden) */}
                            {/* Inline Title Removed */}

                            {/* Left Spacer */}
                            <div />

                            {/* Right Actions */}
                            <div className="flex items-center gap-2 relative z-10">
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
                        <div
                            className="flex-1 overflow-y-auto px-4 space-y-8 custom-scrollbar pt-[calc(3rem+env(safe-area-inset-top))]"
                            onScroll={handleScroll}
                        >
                            {/* Large Title */}
                            <div>
                                <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent mb-1">
                                    {lang === 'zh' ? '我的吧台' : 'My Bar'}
                                </h2>
                                <p className="text-zinc-400 text-sm">
                                    {lang === 'zh'
                                        ? `已選擇 ${myInventory.size} 項材料`
                                        : `${myInventory.size} ingredients selected`}
                                </p>
                            </div>

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
                                                        "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left border relative overflow-hidden group",
                                                        myInventory.has(item)
                                                            ? "bg-white text-black border-white shadow-lg shadow-white/10 scale-[1.02]"
                                                            : "bg-white/5 text-zinc-400 border-white/5 hover:bg-white/10 hover:border-white/10 active:scale-95"
                                                    )}
                                                >
                                                    <div className={clsx(
                                                        "w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors",
                                                        myInventory.has(item)
                                                            ? "bg-black border-black text-white"
                                                            : "border-zinc-700 bg-transparent group-hover:border-zinc-500"
                                                    )}>
                                                        {myInventory.has(item) && <Check size={12} strokeWidth={3} />}
                                                    </div>
                                                    <span className="truncate">{getLabel(item)}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </section>
                                )
                            ))}

                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t-[0.5px] border-white/10 bg-black/20 backdrop-blur-xl z-10">
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
