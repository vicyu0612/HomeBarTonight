import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GlassWater,
  Shuffle,
  Search,
  Martini,
  ChevronRight,
  Store,
  Heart,
  User
} from 'lucide-react';
import clsx from 'clsx';
import { recipes as localRecipes, type Recipe } from './data/recipes';
import { supabase } from './supabaseClient';
import type { Session } from '@supabase/supabase-js';
import { RecipeDetailModal } from './RecipeDetailModal';
import { RecipeManager } from './admin/RecipeManager';

// UI Translations
const translations = {
  en: {
    subtitle: "Tonight's Menu",
    searchPlaceholder: "Search cocktails or ingredients...",
    tabs: {
      all: "All",
      classic: "Classic",
      cvs: "CVS Mode",
      favorites: "Favorites"
    },
    spirits: {
      all: "All Spirits",
      gin: "Gin",
      vodka: "Vodka",
      rum: "Rum",
      tequila: "Tequila",
      whiskey: "Whiskey",
      brandy: "Brandy",
      wine: "Wine",
      liqueur: "Liqueur",
      beer: "Beer"
    },
    noResults: "No drinks found.",
    clear: "Clear filters",
    ingredients: "Ingredients",
    steps: "Steps",
    done: "Done Making It",
    login: {
      title: "Sign In",
      subtitle: "Save your favorites and sync across devices.",
      google: "Continue with Google",
      apple: "Continue with Apple",
      guest: "Continue as Guest"
    },
    specs: {
      alcohol: "Alcohol",
      sweetness: "Sweetness",
      ease: "Friendliness",
      alcoholDesc: "Low - High",
      sweetnessDesc: "Dry - Sweet",
      easeDesc: "Expert - Easy"
    },
    logout: {
      title: "Sign Out",
      message: "Are you sure you want to sign out?",
      confirm: "Sign Out",
      cancel: "Cancel"
    }
  },
  zh: {
    subtitle: "今晚的酒單",
    searchPlaceholder: "搜尋調酒或材料...",
    tabs: {
      all: "全部",
      classic: "經典",
      cvs: "超商模式",
      favorites: "我的最愛"
    },
    spirits: {
      all: "所有基酒",
      gin: "琴酒",
      vodka: "伏特加",
      rum: "蘭姆酒",
      tequila: "龍舌蘭",
      whiskey: "威士忌",
      brandy: "白蘭地",
      wine: "紅/白酒",
      liqueur: "香甜酒/奶酒",
      beer: "啤酒"
    },
    noResults: "找不到這款酒。",
    clear: "清除篩選",
    ingredients: "材料",
    steps: "步驟",
    done: "調好了！",
    login: {
      title: "登入帳號",
      subtitle: "儲存您的最愛清單並跨裝置同步。",
      google: "使用 Google 繼續",
      apple: "使用 Apple 繼續",
      guest: "以訪客身份繼續"
    },
    specs: {
      alcohol: "酒精強度",
      sweetness: "甜度",
      ease: "易飲度",
      alcoholDesc: "無酒精 - 高酒精",
      sweetnessDesc: "清爽不甜 - 甜蜜蜜",
      easeDesc: "有個性 - 輕鬆喝"
    },
    logout: {
      title: "登出",
      message: "確定要登出帳號嗎？",
      confirm: "登出",
      cancel: "取消"
    }
  }
};

const spiritsList = ['all', 'gin', 'vodka', 'rum', 'tequila', 'whiskey', 'brandy', 'wine', 'liqueur', 'beer'];



// Simple Google Icon SVG
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M23.52 12.29c0-.85-.08-1.68-.21-2.48H12v4.7h6.45c-.28 1.48-1.12 2.74-2.39 3.59v2.98h3.87c2.26-2.08 3.56-5.15 3.56-8.79z" fill="#4285F4" />
    <path d="M12 24c3.24 0 5.96-1.07 7.95-2.9l-3.87-2.98c-1.08.72-2.45 1.15-4.08 1.15-3.13 0-5.78-2.11-6.73-4.96H1.36v3.12C3.33 21.36 7.37 24 12 24z" fill="#34A853" />
    <path d="M5.27 14.29c-.25-.74-.38-1.53-.38-2.34s.13-1.6.38-2.34V6.49H1.36C.49 8.21 0 10.05 0 12c0 1.95.49 3.79 1.36 5.51l3.91-3.22z" fill="#FBBC05" />
    <path d="M12 4.75c1.76 0 3.34.6 4.58 1.79l3.44-3.44C17.96 1.18 15.24 0 12 0 7.37 0 3.33 2.64 1.36 6.49l3.91 3.22c.95-2.85 3.6-4.96 6.73-4.96z" fill="#EA4335" />
  </svg>
);

function App() {
  const [lang, setLang] = useState<'en' | 'zh'>('zh');
  const [activeTab, setActiveTab] = useState<'all' | 'classic' | 'cvs' | 'favorites'>('all');
  const [activeSpirit, setActiveSpirit] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  // Auth & User State
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [session, setSession] = useState<Session | null>(null);

  // Favorites State
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('favorites');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch (e) {
      return new Set();
    }
  });

  // Save to localStorage whenever favorites change
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(Array.from(favorites)));
  }, [favorites]);

  // Sync favorites from DB on login
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!session || !supabase) return;

      const { data, error } = await supabase
        .from('favorites')
        .select('recipe_id')
        .eq('user_id', session.user.id);

      if (!error && data) {
        const dbFavs = new Set(data.map((f: any) => f.recipe_id));
        setFavorites(prev => {
          // Merge local and DB favorites
          const merged = new Set([...prev, ...dbFavs]);
          return merged;
        });
      }
    };

    fetchFavorites();
  }, [session]);

  // Data State
  const [allRecipes, setAllRecipes] = useState<Recipe[]>(localRecipes);

  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Fetch Recipes from DB
    const fetchRecipes = async () => {
      if (!supabase) return;
      const { data, error } = await supabase
        .from('recipes')
        .select('*');

      if (error) {
        console.error('Error fetching recipes:', error);
      } else if (data && data.length > 0) {
        const mappedRecipes: Recipe[] = data.map((r: any) => ({
          id: r.id,
          name: r.name,
          type: r.type,
          baseSpirit: r.base_spirit,
          ingredients: r.ingredients,
          steps: r.steps,
          tags: r.tags,
          description: r.description,
          specs: r.specs,
          color: r.color,
          image: r.image
        }));
        setAllRecipes(mappedRecipes);
      }
    };
    fetchRecipes();

    return () => subscription.unsubscribe();
  }, []);

  const toggleFavorite = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();

    // Optimistic UI update
    setFavorites(prev => {
      const newFavs = new Set(prev);
      if (newFavs.has(id)) {
        newFavs.delete(id);
      } else {
        newFavs.add(id);
      }
      return newFavs;
    });

    // Sync to DB if logged in
    if (session && supabase) {
      const isFavorited = favorites.has(id); // Check current state before toggle
      if (isFavorited) {
        // Remove from DB (We are checking previous state, so if it WAS faved, we remove)
        await supabase.from('favorites').delete().eq('user_id', session.user.id).eq('recipe_id', id);
      } else {
        // Add to DB
        await supabase.from('favorites').insert({ user_id: session.user.id, recipe_id: id });
      }
    }
  };

  const handleLogin = async (provider: 'google') => {
    if (!supabase) {
      alert("Please configure Supabase credentials in .env.local to enable login.");
      return;
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: window.location.origin,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      }
    });
    if (error) {
      console.error('Error logging in:', error.message);
    }
  };

  const handleGuestLogin = async () => {
    if (!supabase) {
      alert("Please configure Supabase credentials in .env.local to enable login.");
      return;
    }
    const { error } = await supabase.auth.signInAnonymously();
    if (error) {
      console.error('Error logging in anonymously:', error.message);
      alert(`Guest login failed: ${error.message}\n(Make sure 'Anonymous Sign-ins' are enabled in your Supabase Auth settings)`);
    } else {
      setShowLoginModal(false);
    }
  };

  const handleLogout = async () => {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error logging out:', error.message);
    setShowLogoutConfirm(false);
  };

  const t = translations[lang];

  const filteredRecipes = useMemo(() => {
    return allRecipes.filter(recipe => {
      // Favorite Tab Logic
      if (activeTab === 'favorites') {
        if (!favorites.has(recipe.id)) return false;
      } else if (activeTab !== 'all' && recipe.type !== activeTab) {
        return false;
      }

      const matchesSpirit = activeSpirit === 'all' || recipe.baseSpirit.includes(activeSpirit);

      const name = recipe.name[lang].toLowerCase();
      const ingredients = recipe.ingredients[lang].map(i => i.name.toLowerCase()).join(' ');
      const searchLower = searchQuery.toLowerCase();

      const matchesSearch = name.includes(searchLower) || ingredients.includes(searchLower);
      return matchesSpirit && matchesSearch;
    });
  }, [activeTab, activeSpirit, searchQuery, lang, favorites, allRecipes]);

  const handleRandom = () => {
    const random = filteredRecipes[Math.floor(Math.random() * filteredRecipes.length)];
    if (random) setSelectedRecipe(random);
  };

  const toggleLang = () => {
    setLang(prev => prev === 'en' ? 'zh' : 'en');
  }

  return (
    <div className="min-h-screen pb-20 bg-zinc-950 text-zinc-100 font-sans">
      <RecipeManager />
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
              onClick={() => session ? setShowLogoutConfirm(true) : setShowLoginModal(true)}
              className={clsx(
                "p-1 rounded-full hover:bg-white/20 active:scale-95 transition-all backdrop-blur-md border border-white/5 overflow-hidden",
                session ? "border-primary/50" : "bg-white/10 text-zinc-300"
              )}
            >
              {session?.user?.user_metadata?.avatar_url ? (
                <img src={session.user.user_metadata.avatar_url} alt="User" className="w-8 h-8 rounded-full" />
              ) : session ? (
                <div className="w-8 h-8 bg-primary/20 flex items-center justify-center rounded-full text-primary">
                  <User size={18} />
                </div>
              ) : (
                <div className="w-8 h-8 flex items-center justify-center">
                  <User size={20} />
                </div>
              )}
            </button>
            <button
              onClick={toggleLang}
              className="p-1 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-zinc-300 backdrop-blur-md border border-white/5 overflow-hidden"
            >
              <div className="w-8 h-8 flex items-center justify-center">
                <span className="font-bold text-xs">{lang === 'en' ? '中' : 'EN'}</span>
              </div>
            </button>
            <button
              onClick={handleRandom}
              className="p-1 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-accent backdrop-blur-md border border-white/5 overflow-hidden"
            >
              <div className="w-8 h-8 flex items-center justify-center">
                <Shuffle size={20} />
              </div>
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
              { id: 'favorites', label: t.tabs.favorites, icon: Heart }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={clsx(
                  "flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-bold transition-all duration-300",
                  activeTab === tab.id
                    ? "bg-white/10 text-white shadow-lg"
                    : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
                )}
              >
                <tab.icon size={14} fill={tab.id === 'favorites' && activeTab === 'favorites' ? "currentColor" : "none"} />
                <span className="truncate">{tab.label}</span>
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
                className="glass-card p-3 flex items-center gap-4 cursor-pointer group hover:bg-white/10 transition-colors overflow-hidden relative"
                style={{ borderColor: `${recipe.color}30` }}
              >
                {/* Favorite Button on Card */}
                <button
                  onClick={(e) => toggleFavorite(recipe.id, e)}
                  className="absolute top-2 right-2 p-2 rounded-full z-10 text-white/50 hover:text-red-500 hover:bg-white/10 transition-all active:scale-90"
                >
                  <Heart size={18} fill={favorites.has(recipe.id) ? "#ef4444" : "none"} className={clsx(favorites.has(recipe.id) && "text-red-500")} />
                </button>

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
                  <div className="flex justify-between items-start pr-8">
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

      </div >

      {/* Login Modal */}
      <AnimatePresence>
        {
          showLoginModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setShowLoginModal(false)} />

              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-zinc-900 w-full max-w-sm rounded-[2rem] overflow-hidden relative border border-white/10 p-8 shadow-2xl"
              >
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4 border border-primary/20 shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                    <User size={32} className="text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                    {t.login.title}
                  </h2>
                  <p className="text-zinc-400 text-sm mt-2">{t.login.subtitle}</p>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => handleLogin('google')}
                    className="w-full py-3.5 rounded-xl bg-white text-zinc-900 font-bold flex items-center justify-center gap-3 hover:bg-zinc-200 transition-colors"
                  >
                    <GoogleIcon />
                    {t.login.google}
                  </button>
                </div>

                <div className="mt-6 text-center">
                  <button
                    onClick={handleGuestLogin}
                    className="text-zinc-500 text-sm hover:text-white transition-colors"
                  >
                    {t.login.guest}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )
        }
      </AnimatePresence>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setShowLogoutConfirm(false)} />

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-zinc-900 w-full max-w-xs rounded-3xl overflow-hidden relative border border-white/10 p-6 shadow-2xl text-center"
            >
              <h3 className="text-xl font-bold text-white mb-2">{t.logout.title}</h3>
              <p className="text-zinc-400 text-sm mb-6">{t.logout.message}</p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 py-3 rounded-xl bg-zinc-800 text-zinc-300 font-bold hover:bg-zinc-700 transition-colors"
                >
                  {t.logout.cancel}
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 py-3 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 font-bold hover:bg-red-500/20 transition-colors"
                >
                  {t.logout.confirm}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detail Modal */}
      <AnimatePresence>
        {
          selectedRecipe && (
            <RecipeDetailModal
              recipe={selectedRecipe}
              onClose={() => setSelectedRecipe(null)}
              isFavorite={favorites.has(selectedRecipe.id)}
              onToggleFavorite={toggleFavorite}
              t={t}
              lang={lang}
            />
          )
        }
      </AnimatePresence >
    </div >
  );
}

export default App;
