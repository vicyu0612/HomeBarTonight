import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { recipes as localRecipes, type Recipe } from './data/recipes';
import { supabase } from './supabaseClient';
import type { Session } from '@supabase/supabase-js';
import { RecipeDetailModal } from './RecipeDetailModal';
import { TabBar, type TabId } from './components/TabBar';
import { type IngredientItem } from './components/MyBarModal';
import { Capacitor } from '@capacitor/core';
import { App as CapApp } from '@capacitor/app';
import { Browser } from '@capacitor/browser';

import { MixingShaker } from './components/MixingShaker';

// Pages
import { CocktailsPage } from './pages/CocktailsPage';
import { MyBarPage } from './pages/MyBarPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { ExplorePage } from './pages/ExplorePage';
import { CollectionDetailPage } from './pages/CollectionDetailPage';
import { collections as fallbackCollections, type Collection } from './data/collections';
import { SettingsPage } from './pages/SettingsPage';



// Language Detection Helper
const getSystemLang = (): 'en' | 'zh' => {
  try {
    const lang = navigator.language.toLowerCase();
    return lang.startsWith('zh') ? 'zh' : 'en';
  } catch (e) {
    return 'en';
  }
};

function App() {
  // Global State
  const [lang, setLang] = useState<'en' | 'zh'>(getSystemLang());
  const [activeTab, setActiveTab] = useState<TabId>('explore');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [currentList, setCurrentList] = useState<Recipe[]>([]);
  /* Removed unused activeCollectionId */
  const [isShaking, setIsShaking] = useState(false);

  // Auth State
  const [session, setSession] = useState<Session | null>(null);

  // Data State
  const [allRecipes, setAllRecipes] = useState<Recipe[]>(localRecipes);
  const [allIngredients, setAllIngredients] = useState<IngredientItem[]>([]);
  const [allCollections, setAllCollections] = useState<Collection[]>(fallbackCollections);

  // Inventory State
  const [myInventory, setMyInventory] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('myInventory');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch (e) { return new Set(); }
  });

  useEffect(() => {
    localStorage.setItem('myInventory', JSON.stringify(Array.from(myInventory)));
  }, [myInventory]);

  // Favorites State
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('favorites');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch (e) { return new Set(); }
  });

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(Array.from(favorites)));
  }, [favorites]);

  // --- Auth & Sync Logic ---
  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));

    // Fetch Data
    const fetchData = async () => {
      if (!supabase) return;
      const { data: recipeData } = await supabase.from('recipes').select('*').order('id', { ascending: true });
      if (recipeData && recipeData.length > 0) {
        setAllRecipes(recipeData.map((r: any) => ({
          id: r.id, name: r.name, type: r.type, baseSpirit: r.base_spirit,
          ingredients: r.ingredients, steps: r.steps, tags: r.tags,
          description: r.description, specs: r.specs, color: r.color, image: r.image
        })));
      }
      if (supabase) {
        // Fetch Ingredients
        const { data: ingData } = await supabase.from('ingredients').select('*');
        if (ingData) setAllIngredients(ingData as IngredientItem[]);

        // Fetch Collections
        const { data: colData } = await supabase
          .from('collections')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true });

        if (colData && colData.length > 0) {
          // Map DB fields to Collection interface
          const mappedCollections: Collection[] = colData.map((c: any) => ({
            id: c.id,
            title: c.title,
            subtitle: c.subtitle,
            type: c.type,
            recipeIds: c.recipe_ids,
            filterRules: c.filter_rules,
            coverImage: c.cover_image,
            themeColor: c.theme_color,
            description: c.description,
            sortOrder: c.sort_order,
            isActive: c.is_active
          }));
          setAllCollections(mappedCollections);
        }
      }
    };
    fetchData();

    return () => subscription.unsubscribe();
  }, []);

  // Listen for Deep Links (Auth Callback)
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    CapApp.addListener('appUrlOpen', async ({ url }) => {
      console.log('App opened with URL:', url);
      if (url.includes('access_token') || url.includes('refresh_token')) {
        // Supabase V2: Extract tokens from URL fragment
        // But simpler: pass the full URL to supabase helpers if available, or parse manual.
        // Actually, Supabase JS usually handles `getSession` correctly if the URL is visited? 
        // No, in native app, we must feed it.

        // Extract fragment
        const hashMap = new URLSearchParams(new URL(url).hash.substring(1));
        const accessToken = hashMap.get('access_token');
        const refreshToken = hashMap.get('refresh_token');

        if (accessToken && refreshToken && supabase) {
          const { error } = await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
          if (error) console.error('Set Session Error:', error);
          // Close Browser/WebView if opened (iOS sometimes keeps SFSafariViewController open)
          // Browser.close(); // Not always needed but good practice
          try { await Browser.close(); } catch (e) { }
        }
      }
    });
  }, []);

  // Sync favorites/inventory on login
  useEffect(() => {
    if (!session || !supabase) return;
    const sync = async () => {
      if (!supabase) return;
      // 1. Favorites
      const localArray = Array.from(favorites);
      if (localArray.length > 0) {
        const { data: existing } = await supabase.from('favorites').select('recipe_id').eq('user_id', session.user.id);
        const existingIds = new Set(existing?.map((x: any) => x.recipe_id) || []);
        const toAdd = localArray.filter(id => !existingIds.has(id));
        if (toAdd.length > 0) await supabase.from('favorites').insert(toAdd.map(id => ({ user_id: session.user.id, recipe_id: id })));
      }
      const { data: dbFavs } = await supabase.from('favorites').select('recipe_id').eq('user_id', session.user.id);
      if (dbFavs) setFavorites(new Set(dbFavs.map((f: any) => f.recipe_id)));

      // 2. Inventory
      const { data: invData } = await supabase.from('user_inventory').select('ingredients').eq('user_id', session.user.id).single();
      if (invData) setMyInventory(prev => new Set([...prev, ...(invData.ingredients || [])]));
    };
    sync();
  }, [session]);

  const saveInventory = async (inv: Set<string>) => {
    setMyInventory(inv); // Optimistic Update
    if (!session?.user || !supabase) return;
    await supabase.from('user_inventory').upsert({
      user_id: session.user.id,
      ingredients: Array.from(inv),
      updated_at: new Date().toISOString()
    });
  };

  const toggleFavorite = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const newFavs = new Set(favorites);
    const isAdding = !newFavs.has(id);
    if (isAdding) newFavs.add(id); else newFavs.delete(id);
    setFavorites(newFavs);

    if (session && supabase) {
      if (isAdding) {
        await supabase.from('favorites').insert({ user_id: session.user.id, recipe_id: id });
      } else {
        await supabase.from('favorites').delete().eq('user_id', session.user.id).eq('recipe_id', id);
      }
    }
  };

  const handleShake = () => {
    setIsShaking(true);
    // Vibrate if allowed
    if ('vibrate' in navigator) navigator.vibrate([100, 50, 100]);
    setTimeout(() => {
      setIsShaking(false);
      // Random Pick logic
      const validRecipes = allRecipes.filter(r => r.type === 'cvs' || r.type === 'classic'); // Filter appropriately
      if (validRecipes.length > 0) {
        const random = validRecipes[Math.floor(Math.random() * validRecipes.length)];
        setSelectedRecipe(random);
      }
    }, 1500);
  };

  const handleSelectRecipe = (recipe: Recipe, list?: Recipe[]) => {
    setSelectedRecipe(recipe);
    setCurrentList(list || allRecipes);
  };

  const handlePrevRecipe = () => {
    if (!selectedRecipe || currentList.length === 0) return;
    const idx = currentList.findIndex(r => r.id === selectedRecipe.id);
    if (idx > 0) setSelectedRecipe(currentList[idx - 1]);
  };

  const handleNextRecipe = () => {
    if (!selectedRecipe || currentList.length === 0) return;
    const idx = currentList.findIndex(r => r.id === selectedRecipe.id);
    if (idx < currentList.length - 1) setSelectedRecipe(currentList[idx + 1]);
  };

  const handleLogin = async (provider: 'google' | 'apple') => {
    if (!supabase) return;

    if (Capacitor.isNativePlatform()) {
      // Native: Use Browser Plugin to ensure Safari View Controller (SVC)
      // This satisfies App Store Guideline 4.0 (avoiding default browser app)

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: 'homebartonight://auth/callback',
          skipBrowserRedirect: true // We handle redirection manually via Browser.open
        }
      });

      if (error) {
        console.error('Login Error:', error);
        return;
      }

      if (data?.url) {
        // Open the Auth URL in the In-App Browser (SVC on iOS)
        await Browser.open({
          url: data.url,
          windowName: '_self', // Suggests opening in-place/SVC
          presentationStyle: 'popover' // Optional, for nicer transition on iPad
        });
      }
    } else {
      // Web: Standard Redirect
      await supabase.auth.signInWithOAuth({
        provider: provider,
        options: { redirectTo: window.location.origin }
      });
    }
  };

  const handleLogout = async () => {
    if (!supabase) return;
    try {
      // 1. Clear Local State immediately
      setFavorites(new Set());
      setMyInventory(new Set());
      setSession(null); // Force UI update

      // 2. Call Supabase SignOut
      const { error } = await supabase.auth.signOut();
      if (error) console.error('SignOut Error:', error);
    } catch (e) {
      console.error('Logout Exception:', e);
    }
  };

  const handleDeleteAccount = async () => {
    if (!supabase) return;
    try {
      const { error } = await supabase.rpc('delete_own_account');
      if (error) throw error;
      // After successful deletion, clean up like logout
      await handleLogout();
      alert('Your account has been permanently deleted.');
    } catch (e) {
      console.error('Delete Account Error:', e);
      alert('Failed to delete account. Please try again.');
    }
  };

  // Helper function to filter recipes based on collection rules
  const filterRecipes = useMemo(() => (collection: Collection, recipes: Recipe[]): Recipe[] => {
    // 1. Curated List (IDs)
    if (collection.recipeIds && collection.recipeIds.length > 0) {
      const ids = collection.recipeIds;
      return recipes.filter(r => ids.includes(r.id));
    }

    // 2. Dynamic JSON Rules (DB)
    if (collection.filterRules) {
      const rules = collection.filterRules as any;
      console.log(`Filtering [${collection.id}] with rules:`, rules);

      // Handle "CVS" special case
      if (rules.type === 'cvs') {
        const cvsRecs = ['rum-coke', 'gin-tonic', 'screwdriver', 'highball', 'kalimotxo'];
        const results = recipes.filter(r => {
          if (cvsRecs.includes(r.id)) return true;
          if (r.tags && r.tags.en && r.tags.en.includes('cvs')) return true;
          return false;
        });
        console.log(`[${collection.id}] Results: ${results.length}`);
        return results;
      }

      // Handle "Party/Tag" special case
      if (rules.tag) {
        const results = recipes.filter(r => r.tags && r.tags.en && r.tags.en.includes(rules.tag));
        console.log(`[${collection.id}] Results: ${results.length}`);
        return results;
      }

      // Handle Generic Array Rules
      if (Array.isArray(rules)) {
        return recipes.filter(recipe => {
          for (const rule of rules) {
            const recipeValue = (recipe as any)[rule.field];
            if (recipeValue === undefined) return false;

            switch (rule.operator) {
              case 'eq':
                if (Array.isArray(recipeValue)) {
                  if (!recipeValue.includes(rule.value)) return false;
                } else {
                  if (recipeValue !== rule.value) return false;
                }
                break;
              case 'in':
                if (!Array.isArray(recipeValue) || !recipeValue.some((v: any) => (rule.value as string[]).includes(v))) return false;
                break;
              default:
                return false;
            }
          }
          return true;
        });
      }
    }

    // 3. Legacy Function Filter (Local Fallback)
    if (collection.filter) {
      return recipes.filter(collection.filter);
    }

    // 4. Default: Return Empty (Safety) - Don't show everything if no rules match
    return [];
  }, []);

  useEffect(() => {
    // Handle browser back/forward for collection detail page
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.startsWith('/collection/')) {
        setActiveTab('collection');
      } else {
        setActiveTab('explore');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <div
      className="fixed inset-0 w-full h-full overflow-hidden bg-black text-white font-sans selection:bg-indigo-500/30 select-none flex flex-col"
    >

      {/* Main Content Area */}
      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative max-w-5xl mx-auto w-full">

        {/* Explore Page */}
        <div className={activeTab === 'explore' || activeTab === 'collection' ? 'h-full relative overflow-hidden' : 'hidden'}>
          <ExplorePage
            lang={lang}
            onSelectCollection={(id) => {
              setActiveTab('collection');
              window.history.pushState({}, '', `/collection/${id}`);
            }}
            allRecipes={allRecipes}
            allCollections={allCollections} // Pass dynamic collections
            filterRecipes={filterRecipes} // Pass filter helper
            onSelectRecipe={handleSelectRecipe}
            toggleFavorite={toggleFavorite}
            favorites={favorites}
          />

          <AnimatePresence>
            {activeTab === 'collection' && (
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ ease: "circOut", duration: 0.3 }}
                className="absolute inset-0 z-50 bg-black h-full w-full overflow-hidden"
              >
                {(() => {
                  const id = window.location.pathname.split('/').pop() || '';
                  return (
                    <div className="absolute inset-0 bg-black z-50">
                      <CollectionDetailPage
                        collectionId={id}
                        allCollections={allCollections} // Pass dynamic collections
                        onBack={() => {
                          setActiveTab('explore');
                          window.history.pushState({}, '', '/');
                        }}
                        allRecipes={allRecipes}
                        onSelectRecipe={handleSelectRecipe}
                        toggleFavorite={toggleFavorite}
                        favorites={favorites}
                        lang={lang}
                        filterRecipes={filterRecipes}
                      />
                    </div>
                  );
                })()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Cocktails Page (Persistent) */}
        <div className={activeTab === 'cocktails' ? 'h-full' : 'hidden'}>
          <CocktailsPage
            allRecipes={allRecipes}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            onSelectRecipe={handleSelectRecipe}
            lang={lang}
            onShake={handleShake}
          />
        </div>

        {/* My Bar Page */}
        <div className={activeTab === 'my_bar' ? 'h-full' : 'hidden'}>
          <MyBarPage
            allRecipes={allRecipes}
            myInventory={myInventory}
            setMyInventory={saveInventory}
            allIngredients={allIngredients}
            lang={lang}
            onSelectRecipe={handleSelectRecipe}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
          />
        </div>

        {/* Favorites Page */}
        <div className={activeTab === 'favorites' ? 'h-full' : 'hidden'}>
          <FavoritesPage
            recipes={allRecipes}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            onSelectRecipe={handleSelectRecipe}
            lang={lang}
          />
        </div>

        {/* Settings Page */}
        <div className={activeTab === 'settings' ? 'h-full' : 'hidden'}>
          <SettingsPage
            session={session}
            lang={lang}
            setLang={setLang}
            onLogin={handleLogin}
            onLogout={handleLogout}
            onDeleteAccount={handleDeleteAccount}
          />
        </div>
      </main>

      {/* Tab Bar */}
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} lang={lang} />

      {/* Overlays: Shaker & Detail Modal */}
      <AnimatePresence>
        {isShaking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-black/80 backdrop-blur-md"
          >
            <motion.div
              animate={{ rotate: [0, -15, 15, -15, 15, 0], y: [0, -10, 5, -10, 5, 0], scale: [1, 1.1, 1.1, 1.1, 1] }}
              transition={{ duration: 0.5, repeat: 3, ease: "easeInOut" }}
            >
              <MixingShaker size={200} />
            </motion.div>
            <p className="mt-8 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-300 tracking-widest uppercase">
              Mixing...
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedRecipe && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ ease: "circOut", duration: 0.3 }}
            className="fixed inset-0 z-[60] w-full h-full overflow-hidden bg-black md:bg-black/80 md:backdrop-blur-sm md:flex md:items-center md:justify-center"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={false}
          >
            {/* Desktop Modal Wrapper */}
            <div className="w-full h-full md:w-full md:max-w-2xl md:h-[90vh] md:rounded-2xl md:overflow-hidden md:shadow-2xl md:bg-black md:border md:border-white/10 relative">
              <RecipeDetailModal
                recipe={selectedRecipe}
                onClose={() => setSelectedRecipe(null)}
                isFavorite={favorites.has(selectedRecipe.id)}
                onToggleFavorite={toggleFavorite}
                t={{
                  done: lang === 'zh' ? '完成' : 'Done Making It',
                  ingredients: lang === 'zh' ? '材料' : 'Ingredients',
                  steps: lang === 'zh' ? '步驟' : 'Steps',
                  specs: {
                    alcohol: lang === 'zh' ? '酒精濃度' : 'Alcohol',
                    alcoholDesc: lang === 'zh' ? '低 - 高' : 'LOW - HIGH',
                    sweetness: lang === 'zh' ? '甜度' : 'Sweetness',
                    sweetnessDesc: lang === 'zh' ? '不甜 - 甜' : 'DRY - SWEET',
                    ease: lang === 'zh' ? '易飲度' : 'Easy to drink',
                    easeDesc: lang === 'zh' ? '挑戰 - 輕鬆' : 'CHALLENGING - EASY'
                  }
                }}
                lang={lang}

                hasPrev={selectedRecipe && currentList.findIndex(r => r.id === selectedRecipe.id) > 0}
                hasNext={selectedRecipe && currentList.findIndex(r => r.id === selectedRecipe.id) < currentList.length - 1}
                onPrev={handlePrevRecipe}
                onNext={handleNextRecipe}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
