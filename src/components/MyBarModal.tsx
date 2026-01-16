import { useMemo, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search } from 'lucide-react';
import clsx from 'clsx';

// Define Ingredient interface matching DB schema
export interface IngredientItem {
    id: string;
    name_en: string;
    name_zh: string;
    category: 'base' | 'liqueur' | 'other_alc' | 'essential' | 'mixer' | 'garnish' | 'fruit_dessert';
    subcategory?: string;
}

import { PullToRefresh } from './PullToRefresh';

interface MyBarModalProps {
    isOpen: boolean;
    onClose: () => void;
    // allRecipes removed as we use allIngredients from DB now
    myInventory: Set<string>;
    setMyInventory: (inventory: Set<string>) => void;
    lang: 'en' | 'zh';
    allIngredients: IngredientItem[]; // New Prop
    onRefresh?: () => Promise<void>;
}

export function MyBarModal({
    isOpen,
    onClose,
    myInventory,
    setMyInventory,
    lang,
    allIngredients,
    onRefresh
}: MyBarModalProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [showClearConfirm, setShowClearConfirm] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const mainInputRef = useRef<HTMLInputElement>(null);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        // Threshold to switch header mode (roughly when the content title/search scrolls up)
        setIsScrolled(e.currentTarget.scrollTop > 80);
    };

    // Extract and categorize ingredients from DB Data directly
    const categories = useMemo(() => {
        // Prepare groups structure
        const cats: Record<string, { items: string[], subcategories: Record<string, string[]> }> = {
            base: { items: [], subcategories: {} },
            liqueur: { items: [], subcategories: {} },
            other_alc: { items: [], subcategories: {} },
            essential: { items: [], subcategories: {} },
            mixer: { items: [], subcategories: {} },
            fruit_dessert: { items: [], subcategories: {} },
            garnish: { items: [], subcategories: {} },
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

        // Sort by Name
        const sorted = [...filteredList].sort((a, b) => {
            const nameA = lang === 'zh' ? a.name_zh : a.name_en;
            const nameB = lang === 'zh' ? b.name_zh : b.name_en;
            return nameA.localeCompare(nameB);
        });

        sorted.forEach(ing => {
            // Default to garnish if category is unknown
            const catKey = cats[ing.category] ? ing.category : 'garnish';
            const group = cats[catKey];

            if (ing.subcategory) {
                if (!group.subcategories[ing.subcategory]) {
                    group.subcategories[ing.subcategory] = [];
                }
                group.subcategories[ing.subcategory].push(ing.id);
            } else {
                group.items.push(ing.id);
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

    const getSubcategoryLabel = (sub: string) => {
        // Simple mapping for now, can be moved to a config or DB later
        const labels: Record<string, { en: string, zh: string }> = {
            'whiskey': { en: 'Whiskey', zh: '威士忌' },
            'gin': { en: 'Gin', zh: '琴酒' },
            'rum': { en: 'Rum', zh: '蘭姆酒' },
            'vodka': { en: 'Vodka', zh: '伏特加' },
            'tequila': { en: 'Tequila / Mezcal', zh: '龍舌蘭 / 梅斯卡爾' },
            'brandy': { en: 'Brandy / Cognac', zh: '白蘭地' },
            'chinese_spirit': { en: 'Chinese Spirits', zh: '中式烈酒' },
            'rice_spirit': { en: 'Rice Spirits (Sake / Soju)', zh: '清酒 / 燒酒' },
            'fruit_liqueur': { en: 'Fruit Liqueurs', zh: '水果利口酒' },
            'herbal_liqueur': { en: 'Herbal Liqueurs', zh: '草本利口酒' },
            'nut_cream_liqueur': { en: 'Nut & Cream', zh: '堅果 & 奶類利口酒' },
            'floral_liqueur': { en: 'Floral Liqueurs', zh: '花香利口酒' },
            'other_liqueur': { en: 'Other Liqueurs', zh: '其他利口酒' },
            'vermouth': { en: 'Vermouth', zh: '香艾酒' },
            'wine': { en: 'Wine', zh: '葡萄酒' },
            'sparkling_alc': { en: 'Sparkling Alcohol', zh: '氣泡類酒' },
            'soda': { en: 'Sparkling Drinks', zh: '氣泡飲品' },
            'juice': { en: 'Vegetable & Fruit Juice', zh: '蔬果汁' },
            'tea_coffee': { en: 'Tea / Coffee / Cocoa', zh: '茶 / 咖啡 / 可可' },
            'dairy': { en: 'Dairy & Alternatives', zh: '乳製品 & 替代品' },
            'syrup': { en: 'Syrup / Sweetener', zh: '糖漿 / 甜味劑' },
            'bitters': { en: 'Bitters', zh: '苦精' },
            'egg': { en: 'Egg / Egg White', zh: '蛋/蛋白' },
            'hot_sauce': { en: 'Hot Sauce', zh: '辣醬' },
            'fruit': { en: 'Fruit', zh: '水果' },
            'dessert': { en: 'Dessert', zh: '甜品' },
            'pantry': { en: 'Pantry', zh: '家中常備' },
            'basic': { en: 'Basic', zh: '基本' },
            'aperitif': { en: 'Aperitivo / Aperitif', zh: '開胃酒' },
        };
        const label = labels[sub];
        if (!label) return sub.charAt(0).toUpperCase() + sub.slice(1);
        return lang === 'zh' ? label.zh : label.en;
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

    const toggleList = (items: string[]) => {
        const newSet = new Set(myInventory);
        const allSelected = items.every(i => newSet.has(i));

        if (allSelected) {
            items.forEach(i => newSet.delete(i));
        } else {
            items.forEach(i => newSet.add(i));
        }
        setMyInventory(newSet);
    };

    const toggleSection = (data: { items: string[], subcategories: Record<string, string[]> }) => {
        // Collect ALL items in this section (flat + all subcategories)
        let allItems = [...data.items];
        Object.values(data.subcategories).forEach(subList => {
            allItems = allItems.concat(subList);
        });
        toggleList(allItems);
    };

    // Helper to check if a section is fully selected
    const isSectionSelected = (data: { items: string[], subcategories: Record<string, string[]> }) => {
        const allItems = [...data.items];
        Object.values(data.subcategories).forEach(subList => {
            allItems.push(...subList);
        });
        if (allItems.length === 0) return false;
        return allItems.every(i => myInventory.has(i));
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
                        // 1. Changed bg-black/40 backdrop-blur-2xl to bg-black solid
                        className="bg-black w-full h-full md:h-auto md:max-w-2xl md:max-h-[85vh] md:rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5),inset_0_0.5px_0_rgba(255,255,255,0.1)] overflow-hidden flex flex-col border-0 md:border-[0.5px] border-white/10"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className={clsx(
                            "w-full z-20 flex justify-between items-center bg-black transition-all duration-300",
                            "px-4 pb-3 pt-[calc(0.75rem+env(safe-area-inset-top))] md:p-6"
                        )}>

                            {/* Sticky Header Search Bar (Visible when scrolled) */}
                            {/* Always in flow (flex-1), toggling opacity only */}
                            {/* Sticky Header Search Icon (Visible when scrolled) */}
                            <button
                                onClick={() => mainInputRef.current?.focus()}
                                className={clsx(
                                    "p-2 rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-white shadow-lg hover:bg-black/50 active:scale-95 transition-all duration-500 ease-in-out mr-3 transform",
                                    isScrolled ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-75 pointer-events-none"
                                )}
                            >
                                <Search size={24} />
                            </button>

                            {/* Right Actions */}
                            <div className="flex items-center gap-2 relative z-10 shrink-0">
                                {myInventory.size > 0 && (
                                    <button
                                        onClick={() => setShowClearConfirm(true)}
                                        className="px-4 py-3 rounded-full bg-red-500/10 backdrop-blur-md border border-red-500/20 text-red-400 hover:bg-red-500/20 active:scale-95 text-xs font-bold transition-all"
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
                        < PullToRefresh
                            className="flex-1 overflow-y-auto px-4 space-y-8 custom-scrollbar pt-0 pb-32"
                            onRefresh={onRefresh || (async () => { })}
                            onScroll={handleScroll}
                        >
                            {/* Header Group (Title + Large Search) */}
                            {/* Scroll normally without collapsing/hiding */}
                            <div className="space-y-4 mt-2">
                                <h2 className="text-2xl font-bold text-white">
                                    {lang === 'zh' ? '我的庫存' : 'My Inventory'}
                                </h2>

                                {/* Large Search Bar */}
                                <div className="relative">
                                    <Search className="absolute left-4 top-3.5 text-white z-10" size={20} />
                                    <input
                                        ref={mainInputRef}
                                        type="text"
                                        placeholder={lang === 'zh' ? '搜尋成分...' : 'Search ingredients...'}
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                        className="w-full bg-zinc-800/40 border border-white/10 rounded-full py-3 pl-12 pr-10 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 h-[50px]"
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
                            {
                                [
                                    { id: 'base', title: lang === 'zh' ? '基酒' : 'Base Spirits', color: 'bg-amber-500', data: categories.base },
                                    { id: 'liqueur', title: lang === 'zh' ? '利口酒' : 'Liqueurs', color: 'bg-orange-500', data: categories.liqueur },
                                    { id: 'other_alc', title: lang === 'zh' ? '其他酒類' : 'Other Alcohol', color: 'bg-red-500', data: categories.other_alc },
                                    { id: 'essential', title: lang === 'zh' ? '基本材料' : 'Essentials', color: 'bg-zinc-400', data: categories.essential },
                                    { id: 'mixer', title: lang === 'zh' ? '常見飲料' : 'Mixers', color: 'bg-blue-400', data: categories.mixer },
                                    { id: 'fruit_dessert', title: lang === 'zh' ? '水果 & 甜品' : 'Fruit & Dessert', color: 'bg-pink-400', data: categories.fruit_dessert },
                                    { id: 'garnish', title: lang === 'zh' ? '裝飾 & 其他' : 'Garnishes & Others', color: 'bg-green-500', data: categories.garnish },
                                ].map(section => {
                                    const hasItems = section.data.items.length > 0;
                                    const hasSubcats = Object.keys(section.data.subcategories).length > 0;

                                    if (!hasItems && !hasSubcats) return null;

                                    return (
                                        <section key={section.id}>
                                            <div className="flex justify-between items-center mb-4 sticky top-0 bg-black py-3 z-10 px-4 -mx-4 border-b border-white/5">
                                                <h3 className="text-base font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                                                    <span className={`w-1.5 h-1.5 rounded-full ${section.color}`}></span>
                                                    {section.title}
                                                </h3>
                                                <button
                                                    onClick={() => toggleSection(section.data)}
                                                    className={`text-sm px-2 py-1 rounded transition-colors ${isSectionSelected(section.data)
                                                        ? 'text-zinc-400 hover:text-zinc-200 hover:bg-white/10'
                                                        : 'text-indigo-500 hover:text-indigo-400 hover:bg-indigo-500/10'
                                                        }`}
                                                >
                                                    {isSectionSelected(section.data)
                                                        ? (lang === 'zh' ? '全取消' : 'Unselect All')
                                                        : (lang === 'zh' ? '全選' : 'Select All')}
                                                </button>
                                            </div>

                                            {/* Render Subcategories first */}
                                            {Object.entries(section.data.subcategories)
                                                .sort(([keyA], [keyB]) => {
                                                    if (keyA === 'basic') return -1;
                                                    if (keyB === 'basic') return 1;
                                                    return 0;
                                                })
                                                .map(([subKey, items]) => (
                                                    <div key={subKey} className="mb-4 pl-2 border-l border-white/5 ml-1">
                                                        <div className="flex justify-between items-center mb-2">
                                                            <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                                                                {getSubcategoryLabel(subKey)}
                                                            </h4>
                                                        </div>
                                                        <div className="flex flex-wrap gap-2 mb-2">
                                                            {items.map(item => (
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
                                                    </div>
                                                ))}

                                            {/* Render remaining flat items */}
                                            {section.data.items.length > 0 && (
                                                <div className={clsx("flex flex-wrap gap-2", hasSubcats && "pl-2 border-l border-white/5 ml-1 pt-2")}>
                                                    {hasSubcats && <h4 className="w-full text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1">{lang === 'zh' ? '其他' : 'Others'}</h4>}
                                                    {section.data.items.map(item => (
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
                                            )}
                                        </section>
                                    );
                                })
                            }
                        </PullToRefresh >

                        {/* Footer */}
                        < div className="p-6 border-t-[0.5px] border-white/10 bg-black/20 backdrop-blur-xl z-10" >
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
                        </div >
                    </motion.div >

                    {/* Confirmation Modal */}
                    <AnimatePresence>
                        {
                            showClearConfirm && (
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
                                        className="bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl relative"
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
                            )
                        }
                    </AnimatePresence >
                </motion.div >
            )
            }
        </AnimatePresence >
    );
}
