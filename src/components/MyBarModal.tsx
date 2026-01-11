import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search } from 'lucide-react';
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
    const [searchQuery, setSearchQuery] = useState('');
    const [showClearConfirm, setShowClearConfirm] = useState(false);

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

        // Filter First if query exists
        let filteredList = allIngredients;
        if (searchQuery.trim()) {
            const lowerQ = searchQuery.toLowerCase();
            filteredList = allIngredients.filter(i =>
                i.name_en.toLowerCase().includes(lowerQ) ||
                i.name_zh.includes(lowerQ)
            );
        }

        // Sort ingredients alphabetically or by ID? Let's use DB order (usually insert order) or Name?
        // Let's sort by Name for better UX
        const sorted = [...filteredList].sort((a, b) => {
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
    }, [allIngredients, lang, searchQuery]);

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
                        className="bg-black/40 backdrop-blur-2xl w-full h-full md:h-auto md:max-w-2xl md:max-h-[85vh] md:rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5),inset_0_0.5px_0_rgba(255,255,255,0.1)] overflow-hidden flex flex-col border-0 md:border-[0.5px] border-white/10"
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
                                {myInventory.size > 0 && (
                                    <button
                                        onClick={() => setShowClearConfirm(true)}
                                        className="h-10 px-4 py-2 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-bold transition-colors border border-red-500/20"
                                    >
                                        {lang === 'zh' ? '全部清除' : 'Clear All'}
                                    </button>
                                )}
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-full bg-black/30 backdrop-blur-md text-white border border-white/10 shadow-lg hover:bg-black/50 active:scale-95 transition-all"
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
                            {/* Header Group (Title + Search) */}
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold text-white">
                                    {lang === 'zh' ? '我的庫存' : 'My Inventory'}
                                </h2>

                                {/* Search Bar */}
                                <div className="relative">
                                    <Search className="absolute left-4 top-3.5 text-white z-10" size={20} />
                                    <input
                                        type="text"
                                        placeholder={lang === 'zh' ? '搜尋成分...' : 'Search ingredients...'}
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                        className="w-full bg-zinc-800/40 backdrop-blur-xl border border-white/10 rounded-full py-3 pl-12 pr-10 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 h-[50px]"
                                    />
                                    {searchQuery && (
                                        <button
                                            onClick={() => setSearchQuery('')}
                                            className="absolute right-3 top-3.5 p-0.5 rounded-full bg-white text-black hover:bg-zinc-200 transition-colors z-10"
                                        >
                                            <X size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Helper to render sections */}
                            {[
                                { id: 'base', title: lang === 'zh' ? '基酒' : 'Base Spirits', color: 'bg-amber-500', items: categories.base },
                                { id: 'liqueur', title: lang === 'zh' ? '利口酒' : 'Liqueurs', color: 'bg-orange-500', items: categories.liqueur },
                                { id: 'other_alc', title: lang === 'zh' ? '其他酒類' : 'Other Alcohol', color: 'bg-red-500', items: categories.other_alc },
                                { id: 'essential', title: lang === 'zh' ? '基本材料' : 'Essentials', color: 'bg-zinc-400', items: categories.essential },
                                { id: 'mixer', title: lang === 'zh' ? '常見飲料甜品' : 'Common Drinks & Desserts', color: 'bg-blue-400', items: categories.mixer },
                                { id: 'garnish', title: lang === 'zh' ? '裝飾 & 其他' : 'Garnishes & Others', color: 'bg-green-500', items: categories.garnish },
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
                                                    : 'text-indigo-500 hover:text-indigo-400 hover:bg-indigo-500/10'
                                                    }`}
                                            >
                                                {section.items.every(i => myInventory.has(i))
                                                    ? (lang === 'zh' ? '全取消' : 'Unselect All')
                                                    : (lang === 'zh' ? '全選' : 'Select All')}
                                            </button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {section.items.map(item => (
                                                <button
                                                    key={item}
                                                    onClick={() => toggleItem(item)}
                                                    className={clsx(
                                                        "whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium border transition-colors",
                                                        myInventory.has(item)
                                                            ? "bg-indigo-500 text-white border-indigo-500 shadow-md shadow-indigo-500/20"
                                                            : "bg-zinc-800/40 text-zinc-400 border-white/10 hover:bg-zinc-700"
                                                    )}
                                                >
                                                    {getLabel(item)}
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
                                className={clsx(
                                    "w-full py-4 font-bold rounded-2xl active:scale-[0.98] transition-all",
                                    myInventory.size > 0
                                        ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                                        : "bg-white text-black"
                                )}
                            >
                                {lang === 'zh' ? `完成 (${myInventory.size} 項材料)` : `Done (${myInventory.size} items)`}
                            </button>
                        </div>
                    </motion.div>

                    {/* Confirmation Modal */}
                    <AnimatePresence>
                        {showClearConfirm && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowClearConfirm(false);
                                }}
                            >
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.9, opacity: 0 }}
                                    className="bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 w-full max-w-xs shadow-2xl relative"
                                    onClick={e => e.stopPropagation()}
                                >
                                    <h3 className="text-lg font-bold text-white text-center">
                                        {lang === 'zh' ? '移除所有材料' : 'Remove all ingredients'}
                                    </h3>
                                    <p className="text-zinc-400 text-sm mt-3 text-center leading-relaxed">
                                        {lang === 'zh'
                                            ? '這將移除您的所有庫存材料。您可以隨時將它們加回來。'
                                            : 'This will remove all ingredients from your inventory. You can add them back anytime.'}
                                    </p>
                                    <div className="flex gap-3 mt-6">
                                        <button
                                            onClick={() => setShowClearConfirm(false)}
                                            className="flex-1 py-3 rounded-xl bg-zinc-800 text-white font-medium hover:bg-zinc-700 transition-colors text-sm"
                                        >
                                            {lang === 'zh' ? '取消' : 'Cancel'}
                                        </button>
                                        <button
                                            onClick={() => {
                                                setMyInventory(new Set());
                                                setShowClearConfirm(false);
                                            }}
                                            className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-colors text-sm shadow-lg shadow-red-500/20"
                                        >
                                            {lang === 'zh' ? '全部清除' : 'Clear all'}
                                        </button>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            )
            }
        </AnimatePresence >
    );
}
