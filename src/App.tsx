import { useEffect, useState, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { type Recipe } from './data/recipes';
import { RecipeDetailModal } from './RecipeDetailModal';
import { TabBar, type TabId } from './components/TabBar';
import { Capacitor } from '@capacitor/core';
import { App as CapApp } from '@capacitor/app';

import { MixingShaker } from './components/MixingShaker';

// Pages
const CocktailsPage = lazy(() => import('./pages/CocktailsPage').then(module => ({ default: module.CocktailsPage })));
const MyBarPage = lazy(() => import('./pages/MyBarPage').then(module => ({ default: module.MyBarPage })));
const FavoritesPage = lazy(() => import('./pages/FavoritesPage').then(module => ({ default: module.FavoritesPage })));
const ExplorePage = lazy(() => import('./pages/ExplorePage').then(module => ({ default: module.ExplorePage })));
const CollectionDetailPage = lazy(() => import('./pages/CollectionDetailPage').then(module => ({ default: module.CollectionDetailPage })));
const SettingsPage = lazy(() => import('./pages/SettingsPage').then(module => ({ default: module.SettingsPage })));

import { useIngredients } from './hooks/useIngredients';
import { useSubscription } from './hooks/useSubscription';
import { useAuth } from './hooks/useAuth';
import { useRecipes, filterRecipes } from './hooks/useRecipes';
import { useFavorites } from './hooks/useFavorites';
import { useInventory } from './hooks/useInventory';


// Language Detection Helper
const getSystemLang = (): 'en' | 'zh' => {
  try {
    // 1. Check LocalStorage (User Preference)
    const saved = localStorage.getItem('app_lang');
    if (saved === 'en' || saved === 'zh') return saved;

    // 2. Check System Lang
    const lang = navigator.language.toLowerCase();
    return lang.startsWith('zh') ? 'zh' : 'en';
  } catch {
    return 'en';
  }
};

function App() {
  // Global State
  const [lang, setLang] = useState<'en' | 'zh'>(getSystemLang());

  // Only persist language when explicitly changed by user
  const handleSetLang = (newLang: 'en' | 'zh') => {
    setLang(newLang);
    localStorage.setItem('app_lang', newLang);
  };

  // Tab Persistence
  const [activeTab, setActiveTab] = useState<TabId>(() => {
    // 0. Check URL for Deep Links (Priority)
    const path = window.location.pathname;
    if (path.startsWith('/collection/')) return 'collection';

    // 1. Check LocalStorage
    try {
      const saved = localStorage.getItem('activeTab');
      if (saved && ['explore', 'cocktails', 'my_bar', 'favorites', 'settings', 'collection'].includes(saved)) {
        // CORRECTION: If saved is 'collection' but we are at root '/', force 'explore'
        // This prevents the "Target ID: [empty]" error on root refresh
        if (saved === 'collection' && path === '/') return 'explore';

        return saved as TabId;
      }
      return 'explore';
    } catch { return 'explore'; }
  });

  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [currentList, setCurrentList] = useState<Recipe[]>([]);
  const [isShaking, setIsShaking] = useState(false);

  // Custom Hooks
  const { session, login, logout, deleteAccount } = useAuth();
  const { allRecipes, allCollections, loading: recipesLoading, refreshRecipes } = useRecipes();
  // Alias hooked ingredients to match prop name
  const { ingredients: allIngredients, categoriesMetadata, refetch: refetchIngredients } = useIngredients();
  const { favorites, toggleFavorite, clearFavorites } = useFavorites(session);
  const { myInventory, saveInventory, clearInventory } = useInventory(session);
  const { restorePurchases } = useSubscription();

  // Combined Refresh
  const handleRefresh = async () => {
    await Promise.all([refreshRecipes(), refetchIngredients()]);
  };

  // Recipe Detail Modal Persistence
  const [initialRecipeId] = useState(() => localStorage.getItem('selectedRecipeId'));

  // Sync selectedRecipe to localStorage
  useEffect(() => {
    if (selectedRecipe) {
      localStorage.setItem('selectedRecipeId', selectedRecipe.id);
    } else {
      localStorage.removeItem('selectedRecipeId');
    }
  }, [selectedRecipe]);

  const [hasRestoredRecipe, setHasRestoredRecipe] = useState(false);

  useEffect(() => {
    if (!initialRecipeId || hasRestoredRecipe) return;

    if (allRecipes.length > 0) {
      const found = allRecipes.find(r => r.id === initialRecipeId);
      if (found) {
        setSelectedRecipe(found);
      }
      setHasRestoredRecipe(true); // Mark as done regardless found or not to stop trying
    }
  }, [allRecipes, initialRecipeId, hasRestoredRecipe]);

  // Listen for Deep Links (Restore Only)
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    CapApp.addListener('appUrlOpen', async ({ url }) => {
      // 1. Handle Restore Purchases (RevenueCat Custom Action)
      if (url.includes('homebartonight://restore')) {
        const info = await restorePurchases();

        if (info) {
          const active = Object.keys(info.entitlements.active);
          if (active.length > 0) {
            alert(`Purchases Restored!\nActive Entitlements:\n${active.join(', ')}`);
          } else {
            alert('Restore completed, but no active subscriptions found.\n請確認您的 Apple ID 是否有訂閱紀錄。');
          }
        } else {
          alert('Restore Failed / 恢復失敗');
        }
        return;
      }
    });
  }, [restorePurchases]);


  const handleLogout = async () => {
    // 0. Final Sync (Inventory) ensures latest state is saved before logout
    if (session?.user?.id && myInventory.size > 0) {
      await saveInventory(myInventory);
    }

    // 1. Clear Local State immediately
    clearFavorites();
    clearInventory();
    localStorage.removeItem('app_last_session_user'); // Clear legacy sync tracker

    // 2. Call Supabase SignOut
    await logout();
  };

  const handleDeleteAccount = async () => {
    // Original logic: delete -> logout -> alert.
    // useAuth.deleteAccount calls logout internally.
    try {
      const success = await deleteAccount();
      if (success) {
        clearFavorites();
        clearInventory();
        alert('Your account has been permanently deleted.');
      }
    } catch (e) {
      alert('Failed to delete account. Please try again.');
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

  const handleLogin = (provider: 'google' | 'apple') => login(provider);

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
      className="fixed inset-0 w-full h-[100dvh] overflow-hidden bg-black text-white font-sans selection:bg-indigo-500/30 flex flex-col items-center"
    >
      {/* Main Content Area - Constrained Width */}
      <main className="flex-1 min-h-0 overflow-hidden relative w-full max-w-[1024px] mx-auto bg-black shadow-2xl md:border-x md:border-white/5">
        <Suspense fallback={
          <div className="w-full h-full flex items-center justify-center bg-black">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
          </div>
        }>

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
              onRefresh={handleRefresh}
              loading={recipesLoading}
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
                    const id = window.location.pathname.replace(/\/$/, '').split('/').pop() || '';
                    if (!id) return null; // Guard: If root path or empty ID, don't render detail
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
                          onRefresh={handleRefresh}
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
              onRefresh={handleRefresh}
              loading={recipesLoading}
            />
          </div>

          {/* My Bar Page */}
          <div className={activeTab === 'my_bar' ? 'h-full' : 'hidden'}>
            <MyBarPage
              allRecipes={allRecipes}
              myInventory={myInventory}
              setMyInventory={saveInventory}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              allIngredients={allIngredients as any}
              categoriesMetadata={categoriesMetadata}
              lang={lang}
              onSelectRecipe={handleSelectRecipe}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              onRefresh={handleRefresh}
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
              onRefresh={handleRefresh}
            />
          </div>

          {/* Settings Page */}
          <div className={activeTab === 'settings' ? 'h-full' : 'hidden'}>
            <SettingsPage
              session={session}
              lang={lang}
              setLang={handleSetLang}
              onLogin={handleLogin}
              onLogout={handleLogout}
              onDeleteAccount={handleDeleteAccount}
            />
          </div>
        </Suspense>
      </main>

      {/* Tab Bar - Fixed at bottom, constrained to width */}
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} lang={lang} />

      {/* Overlays: Shaker & Detail Modal (Root Level) */}
      <AnimatePresence>
        {
          isShaking && (
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
          )
        }
      </AnimatePresence >

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
            {/* Desktop Modal Wrapper - Constrained Size */}
            <div className="w-full h-full md:w-full md:max-w-[1024px] md:h-[90vh] md:rounded-2xl md:overflow-hidden md:shadow-2xl md:bg-black md:border md:border-white/10 relative">
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
    </div >
  );

}

export default App;
