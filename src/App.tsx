import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GlassWater,
  Wine,
  Beer,
  Shuffle,
  Search,
  X,
  Martini,
  Flame,
  ChevronRight,
  Store,
  Languages,
  Thermometer,
  Zap,
  Smile
} from 'lucide-react';
import clsx from 'clsx';
import { recipes, type Recipe } from './data/recipes';

// UI Translations
const translations = {
  en: {
    subtitle: "Tonight's Menu",
    searchPlaceholder: "Search cocktails or ingredients...",
    tabs: {
      all: "All",
      classic: "Classic",
      cvs: "CVS Mode"
    },
    spirits: {
      all: "All Spirits",
      gin: "Gin",
      vodka: "Vodka",
      rum: "Rum",
      tequila: "Tequila",
      whiskey: "Whiskey",
      brandy: "Brandy",
      wine: "Wine"
    },
    noResults: "No drinks found.",
    clear: "Clear filters",
    ingredients: "Ingredients",
    steps: "Steps",
    done: "Done Making It",
    specs: {
      alcohol: "Alcohol",
      sweetness: "Sweetness",
      ease: "Friendliness",
      alcoholDesc: "Low - High",
      sweetnessDesc: "Dry - Sweet",
      easeDesc: "Expert - Easy"
    }
  },
  zh: {
    subtitle: "今晚的酒單",
    searchPlaceholder: "搜尋調酒或材料...",
    tabs: {
      all: "全部",
      classic: "經典",
      cvs: "超商模式"
    },
    spirits: {
      all: "所有基酒",
      gin: "琴酒",
      vodka: "伏特加",
      rum: "蘭姆酒",
      tequila: "龍舌蘭",
      whiskey: "威士忌",
      brandy: "白蘭地",
      wine: "紅/白酒"
    },
    noResults: "找不到這款酒。",
    clear: "清除篩選",
    ingredients: "材料",
    steps: "步驟",
    done: "調好了！",
    specs: {
      alcohol: "酒精強度",
      sweetness: "酸甜度",
      ease: "易飲度",
      alcoholDesc: "無酒精 - 高酒精",
      sweetnessDesc: "清爽酸 - 甜蜜蜜",
      easeDesc: "酒鬼 - 輕鬆喝"
    }
  }
};

const spiritsList = ['all', 'gin', 'vodka', 'rum', 'tequila', 'whiskey', 'brandy', 'wine'];

const SpecBar = ({ value, label, subLabel, icon: Icon, colorClass, barColorClass }: { value: number; label: string; subLabel: string; icon: any; colorClass: string; barColorClass: string }) => (
  <div className="space-y-1.5">
    <div className="flex justify-between items-end">
      <div className="flex items-center gap-1.5 text-sm font-medium text-zinc-200">
        <Icon size={14} className={colorClass} />
        {label}
      </div>
      <span className="text-[10px] text-zinc-500 uppercase tracking-wider">{subLabel}</span>
    </div>
    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value * 10}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className={clsx("h-full rounded-full", barColorClass)}
      />
    </div>
  </div>
);

function App() {
  const [lang, setLang] = useState<'en' | 'zh'>('zh'); // Default to Chinese
  const [activeTab, setActiveTab] = useState<'all' | 'classic' | 'cvs'>('all');
  const [activeSpirit, setActiveSpirit] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const t = translations[lang];

  const filteredRecipes = useMemo(() => {
    return recipes.filter(recipe => {
      const matchesTab = activeTab === 'all' || recipe.type === activeTab;

      const matchesSpirit = activeSpirit === 'all' || recipe.baseSpirit.includes(activeSpirit);

      const name = recipe.name[lang].toLowerCase();
      const ingredients = recipe.ingredients[lang].map(i => i.name.toLowerCase()).join(' ');
      const searchLower = searchQuery.toLowerCase();

      const matchesSearch = name.includes(searchLower) || ingredients.includes(searchLower);
      return matchesTab && matchesSpirit && matchesSearch;
    });
  }, [activeTab, activeSpirit, searchQuery, lang]);

  const handleRandom = () => {
    const random = filteredRecipes[Math.floor(Math.random() * filteredRecipes.length)];
    if (random) setSelectedRecipe(random);
  };

  const toggleLang = () => {
    setLang(prev => prev === 'en' ? 'zh' : 'en');
  }

  return (
    <div className="min-h-screen pb-20 bg-zinc-950 text-zinc-100 font-sans">
      {/* Background Image with Fallback */}
      <div
        className="fixed inset-0 z-0 opacity-40 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1514362545857-3bc16549766b?q=80&w=2670&auto=format&fit=crop')" }}
      />

      {/* Dark Overlay */}
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-0" />

      <div className="relative z-10 max-w-md mx-auto min-h-screen flex flex-col">

        {/* Header */}
        <header className="p-6 pt-12 flex justify-between items-center bg-gradient-to-b from-background to-transparent sticky top-0 z-20">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent tracking-tighter">
              HomeBar
            </h1>
            <p className="text-zinc-400 text-sm">{t.subtitle}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={toggleLang}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-zinc-300 backdrop-blur-md border border-white/5"
            >
              <span className="font-bold text-xs">{lang === 'en' ? '中' : 'EN'}</span>
            </button>
            <button
              onClick={handleRandom}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-accent backdrop-blur-md border border-white/5"
            >
              <Shuffle size={20} />
            </button>
          </div>
        </header>

        {/* Search & Filter */}
        <div className="px-6 space-y-4">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-white transition-colors" size={18} />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              className="w-full bg-surface/80 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-zinc-600 font-medium text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex p-1 bg-surface/80 backdrop-blur-xl rounded-xl border border-white/5">
            {[
              { id: 'all', label: t.tabs.all, icon: GlassWater },
              { id: 'classic', label: t.tabs.classic, icon: Martini },
              { id: 'cvs', label: t.tabs.cvs, icon: Store },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={clsx(
                  "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-300",
                  activeTab === tab.id
                    ? "bg-white/10 text-white shadow-lg"
                    : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
                )}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Scrollable Spirit Filter */}
          <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar -mx-6 px-6 mask-linear-fade">
            {spiritsList.map((spirit) => (
              <button
                key={spirit}
                onClick={() => setActiveSpirit(spirit)}
                className={clsx(
                  "whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border",
                  activeSpirit === spirit
                    ? "bg-primary text-white border-primary shadow-[0_0_15px_rgba(139,92,246,0.5)]"
                    : "bg-surface/50 text-zinc-400 border-white/5 hover:border-white/20 hover:text-zinc-200"
                )}
              >
                {t.spirits[spirit as keyof typeof t.spirits]}
              </button>
            ))}
          </div>
        </div>

        {/* Recipe Grid */}
        <main className="flex-1 px-6 grid gap-4 pb-24">
          <AnimatePresence mode="popLayout">
            {filteredRecipes.map((recipe) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={recipe.id}
                onClick={() => setSelectedRecipe(recipe)}
                whileTap={{ scale: 0.98 }}
                className="glass-card p-3 flex items-center gap-4 cursor-pointer group hover:bg-white/10 transition-colors overflow-hidden"
                style={{ borderColor: `${recipe.color}30` }}
              >
                <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-zinc-800 border border-white/10 relative">
                  <img
                    src={recipe.image}
                    alt={recipe.name[lang]}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Icon overlay just in case image fails or for style */}
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    {recipe.type === 'cvs' ? <Store size={20} className="text-white drop-shadow-lg" /> : <Martini size={20} className="text-white drop-shadow-lg" />}
                  </div>
                </div>

                <div className="flex-1 min-w-0 py-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg leading-tight truncate text-white">{recipe.name[lang]}</h3>
                  </div>
                  <p className="text-zinc-400 text-xs mt-1 line-clamp-2">{recipe.description[lang]}</p>
                  <div className="flex gap-2 mt-2">
                    {recipe.tags[lang].slice(0, 3).map(tag => (
                      <span key={tag} className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-full bg-white/5 text-zinc-300 border border-white/5">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <ChevronRight className="text-zinc-600 group-hover:text-white transition-colors mr-2" size={20} />
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredRecipes.length === 0 && (
            <div className="text-center py-20 text-zinc-500">
              <p>{t.noResults}</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveTab('all');
                  setActiveSpirit('all');
                }}
                className="mt-4 text-primary underline"
              >
                {t.clear}
              </button>
            </div>
          )}
        </main>

      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedRecipe && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          >
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setSelectedRecipe(null)} />

            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-zinc-900 w-full max-w-md rounded-t-3xl sm:rounded-3xl overflow-hidden relative border border-white/10 max-h-[90vh] flex flex-col"
            >
              {/* Modal Header Image Area */}
              <div
                className="h-64 w-full relative overflow-hidden shrink-0"
              >
                <img
                  src={selectedRecipe.image}
                  alt={selectedRecipe.name[lang]}
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-black/40"
                />

                <button
                  onClick={() => setSelectedRecipe(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-md z-20 border border-white/10"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content - Scrollable */}
              <div className="p-6 space-y-6 overflow-y-auto">
                <div>
                  <h2 className="text-3xl font-bold text-white">{selectedRecipe.name[lang]}</h2>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {selectedRecipe.tags[lang].map(tag => (
                      <span key={tag} className="text-xs uppercase font-bold tracking-wider text-zinc-400">#{tag}</span>
                    ))}
                  </div>
                  <p className="mt-4 text-zinc-300 leading-relaxed">
                    {selectedRecipe.description[lang]}
                  </p>
                </div>

                {/* Taste Profile Scale */}
                <div className="bg-surface/30 rounded-2xl p-4 border border-white/5 space-y-4">
                  <SpecBar
                    label={t.specs.alcohol}
                    subLabel={t.specs.alcoholDesc}
                    value={selectedRecipe.specs.alcohol}
                    icon={Flame}
                    colorClass="text-red-500"
                    barColorClass="bg-red-500"
                  />
                  <SpecBar
                    label={t.specs.sweetness}
                    subLabel={t.specs.sweetnessDesc}
                    value={selectedRecipe.specs.sweetness}
                    icon={GlassWater}
                    colorClass="text-pink-400"
                    barColorClass="bg-pink-400"
                  />
                  <SpecBar
                    label={t.specs.ease}
                    subLabel={t.specs.easeDesc}
                    value={selectedRecipe.specs.ease}
                    icon={Smile}
                    colorClass="text-green-400"
                    barColorClass="bg-green-400"
                  />
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                    <Wine size={14} /> {t.ingredients}
                  </h3>
                  <div className="bg-surface/50 rounded-xl p-4 border border-white/5 space-y-2">
                    {selectedRecipe.ingredients[lang].map((ing, i) => (
                      <div key={i} className="flex justify-between items-center text-sm border-b border-white/5 last:border-0 pb-2 last:pb-0">
                        <span className="text-zinc-200">{ing.name}</span>
                        <span className="text-primary font-bold">{ing.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                    <Flame size={14} /> {t.steps}
                  </h3>
                  <div className="space-y-4">
                    {selectedRecipe.steps[lang].map((step, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0 border border-primary/20 shadow-[0_0_10px_rgba(139,92,246,0.2)]">
                          {i + 1}
                        </div>
                        <p className="text-zinc-300 text-sm leading-relaxed">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 pb-6">
                  <button
                    onClick={() => setSelectedRecipe(null)}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-accent text-zinc-950 font-bold text-lg hover:opacity-90 active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(34,211,238,0.2)]"
                  >
                    {t.done}
                  </button>
                </div>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
