import { HelpCircle, ChevronRight, X, FileText, Globe, ArrowLeft, LogOut, Trash2, RefreshCw, Star, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import clsx from 'clsx';
import { useSubscription } from '../hooks/useSubscription';


interface SettingsPageProps {
    session: Session | null;
    lang: 'en' | 'zh';
    setLang: (lang: 'en' | 'zh') => void;
    onLogin: (provider: 'google' | 'apple') => void;
    onLogout: () => void;
    onDeleteAccount: () => void;
}

const GoogleIcon = () => (
    <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
);

export function SettingsPage({ session, lang, setLang, onLogin, onLogout, onDeleteAccount }: SettingsPageProps) {
    const { presentCustomerCenter, restorePurchases } = useSubscription();
    const [view, setView] = useState<'main' | 'account'>('main');
    const [showLanguageSheet, setShowLanguageSheet] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [restoreAlert, setRestoreAlert] = useState<{ visible: boolean, title: string, message: string }>({ visible: false, title: '', message: '' });
    const [isScrolled, setIsScrolled] = useState(false);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        setIsScrolled(e.currentTarget.scrollTop > 40);
    };

    const t = {
        title: lang === 'zh' ? '設定' : 'Settings',
        account: {
            title: lang === 'zh' ? '帳戶' : 'Account',
            details: lang === 'zh' ? '帳戶詳情' : 'Account Details',
            guest: lang === 'zh' ? '訪客' : 'Guest',
            joined: lang === 'zh' ? '加入於' : 'Joined',
            login: lang === 'zh' ? '登入' : 'Sign In',
            logout: lang === 'zh' ? '登出' : 'Sign Out',
            confirmLogout: lang === 'zh' ? '確定要登出嗎？' : 'Are you sure you want to sign out?',
            delete: lang === 'zh' ? '刪除帳號' : 'Delete Account',
            confirmDeleteTitle: lang === 'zh' ? '永久刪除帳號' : 'Permanently Delete Account',
            confirmDeleteMsg: lang === 'zh'
                ? '此動作無法復原。您的所有收藏、庫存和設定將從我們的資料庫中永久刪除。確定要繼續嗎？'
                : 'This action cannot be undone. All your favorites, inventory, and settings will be permanently deleted from our database. Are you sure you want to proceed?',
            cancel: lang === 'zh' ? '取消' : 'Cancel',
            hiddenEmail: lang === 'zh' ? '隱藏的電子郵件' : 'Hidden Email'
        },
        language: {
            title: lang === 'zh' ? '語言' : 'Language',
            current: lang === 'zh' ? '中文' : 'English',
            select: lang === 'zh' ? '選擇語言' : 'Select Language'
        },
        about: {
            title: lang === 'zh' ? '關於' : 'About',
            support: lang === 'zh' ? '支援' : 'Support',
            privacy: lang === 'zh' ? '隱私政策' : 'Privacy Policy'
        },
        subscription: {
            title: lang === 'zh' ? '訂閱' : 'Subscription',
            manage: lang === 'zh' ? '管理訂閱' : 'Manage Subscription',
            restore: lang === 'zh' ? '恢復購買' : 'Restore Purchases'
        }
    };

    const openLink = (url: string) => window.open(url, '_blank');

    const formatDate = (isoString?: string) => {
        if (!isoString) return '';
        return new Date(isoString).toLocaleDateString(lang === 'zh' ? 'zh-TW' : 'en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Helper to get display email
    const getDisplayEmail = () => {
        if (!session?.user?.email) return '';
        if (session.user.email.includes('privaterelay.appleid.com')) {
            return t.account.hiddenEmail;
        }
        return session.user.email;
    };

    // Helper to get display name (Name -> Email -> 'User')
    const getDisplayName = () => {
        return session?.user?.user_metadata?.full_name || getDisplayEmail() || 'User';
    };

    // Account Detail View
    if (view === 'account' && session) {
        return (
            <div key="account-view" className="h-full w-full bg-black relative">
                {/* Floating Header */}
                {/* Floating Header */}
                {/* Floating Header */}
                <div className={clsx(
                    "fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[1024px] z-30 flex items-center justify-between transition-all duration-300 pointer-events-none",
                    "h-[calc(4rem+env(safe-area-inset-top))] px-4 pt-[calc(1rem+env(safe-area-inset-top))]"
                )}>
                    <div className="pointer-events-auto z-10">
                        <button
                            onClick={() => setView('main')}
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-md text-white border border-white/10 active:scale-90 transition-transform"
                        >
                            <ArrowLeft size={20} />
                        </button>
                    </div>

                    {/* Centered Title */}
                    <div className="absolute inset-0 flex items-center justify-center pt-[calc(1rem+env(safe-area-inset-top))] pointer-events-none">
                        <span className="font-bold text-white text-lg drop-shadow-md bg-black/20 backdrop-blur-sm px-4 py-1 rounded-full border border-white/5">
                            {t.account.details}
                        </span>
                    </div>

                    <div className="w-10" />
                </div>

                <div
                    className="h-full overflow-y-auto px-4 pb-12 pt-[calc(4rem+env(safe-area-inset-top))] max-w-[1024px] mx-auto w-full"
                >
                    {/* Profile Card */}
                    <div className="flex flex-col items-center py-6">
                        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/10 shadow-2xl bg-zinc-800 flex items-center justify-center mb-4">
                            {session.user.user_metadata.avatar_url ? (
                                <img src={session.user.user_metadata.avatar_url} alt="User" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-indigo-500 text-white font-bold text-3xl">
                                    {session.user.email?.[0].toUpperCase() || 'U'}
                                </div>
                            )}
                        </div>
                        <h2 className="text-xl font-bold text-white text-center px-4">
                            {getDisplayName()}
                        </h2>
                        <p className="text-zinc-500 text-sm mt-1">{getDisplayEmail()}</p>
                        <p className="text-zinc-600 text-xs mt-4 bg-zinc-900/50 px-3 py-1 rounded-full border border-white/5">
                            {t.account.joined} {formatDate(session.user.created_at)}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="bg-zinc-900/50 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden divide-y divide-white/5 mt-4">
                        <button
                            onClick={() => setShowLogoutConfirm(true)}
                            className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors text-white group"
                        >
                            <div className="flex items-center gap-3">
                                <LogOut size={20} className="text-zinc-400 group-hover:text-white transition-colors" />
                                <span>{t.account.logout}</span>
                            </div>
                            <ChevronRight size={20} className="text-zinc-500" />
                        </button>
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="w-full p-4 flex items-center justify-between hover:bg-red-500/10 transition-colors text-red-500 group"
                        >
                            <div className="flex items-center gap-3">
                                <Trash2 size={20} className="text-red-500/70 group-hover:text-red-500 transition-colors" />
                                <span>{t.account.delete}</span>
                            </div>
                            <ChevronRight size={20} className="text-red-500/50" />
                        </button>
                    </div>
                </div>

                {/* Modals placed here as well to work in this view */}
                <AnimatePresence>
                    {showLogoutConfirm && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setShowLogoutConfirm(false)}
                                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                            />
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="relative bg-zinc-900 border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl"
                            >
                                <h3 className="text-lg font-bold text-white mb-2">{t.account.logout}</h3>
                                <p className="text-zinc-400 mb-6">{t.account.confirmLogout}</p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowLogoutConfirm(false)}
                                        className="flex-1 py-3 rounded-xl bg-zinc-800 text-white font-medium hover:bg-zinc-700 transition-colors"
                                    >
                                        {t.account.cancel}
                                    </button>
                                    <button
                                        onClick={() => {
                                            onLogout();
                                            setShowLogoutConfirm(false);
                                            setView('main'); // Go back to main on logout
                                        }}
                                        className="flex-1 py-3 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 font-medium hover:bg-red-500/20 transition-colors"
                                    >
                                        {t.account.logout}
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {showDeleteConfirm && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setShowDeleteConfirm(false)}
                                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                            />
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="relative bg-zinc-900 border border-red-500/30 rounded-2xl p-6 w-full max-w-sm shadow-2xl"
                            >
                                <h3 className="text-lg font-bold text-red-500 mb-2">{t.account.confirmDeleteTitle}</h3>
                                <p className="text-zinc-300 mb-6">{t.account.confirmDeleteMsg}</p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowDeleteConfirm(false)}
                                        className="flex-1 py-3 rounded-xl bg-zinc-800 text-white font-medium hover:bg-zinc-700 transition-colors"
                                    >
                                        {t.account.cancel}
                                    </button>
                                    <button
                                        onClick={() => {
                                            onDeleteAccount();
                                            setShowDeleteConfirm(false);
                                        }}
                                        className="flex-1 py-3 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-colors shadow-lg shadow-red-900/20"
                                    >
                                        {t.account.delete}
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        );
    }

    return (
        <div key="main-view" className="h-full relative flex flex-col">
            {/* Sticky Header */}
            <div className={clsx(
                "absolute top-0 left-0 right-0 z-20 flex justify-center items-center transition-all duration-300",
                "h-[calc(3rem+env(safe-area-inset-top))] px-4 pb-2 pt-[calc(0.5rem+env(safe-area-inset-top))]"
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
                {/* Title Removed
                <span className={clsx(
                    "font-bold text-white transition-opacity duration-300",
                    isScrolled ? "opacity-100" : "opacity-0"
                )}>
                    {t.title}
                </span>
                */}
            </div>

            {/* Scrollable Content */}
            <div
                className="flex-1 overflow-y-auto px-4 pb-32 no-scrollbar pt-[calc(3rem+env(safe-area-inset-top))]"
                onScroll={handleScroll}
            >
                <h1 className="text-3xl font-bold text-white mb-8 mt-2">{t.title}</h1>

                <div className="space-y-8">
                    {/* Account Section */}
                    <section>
                        <h2 className="text-zinc-500 text-sm font-medium mb-3 ml-1">{t.account.title}</h2>
                        {session ? (
                            <button
                                onClick={() => setView('account')}
                                className="w-full bg-zinc-900/50 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center justify-between hover:bg-white/5 transition-colors group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10 shadow-lg bg-zinc-800 flex items-center justify-center shrink-0">
                                        {session.user.user_metadata.avatar_url ? (
                                            <img src={session.user.user_metadata.avatar_url} alt="User" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-indigo-500 text-white font-bold text-lg">
                                                {session.user.email?.[0].toUpperCase() || 'U'}
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-left overflow-hidden">
                                        <p className="text-white font-medium truncate max-w-[200px]">
                                            {getDisplayName()}
                                        </p>
                                        <p className="text-zinc-500 text-sm group-hover:text-zinc-400 transition-colors">
                                            {getDisplayEmail()}
                                        </p>
                                    </div>
                                </div>
                                <ChevronRight size={20} className="text-zinc-500 group-hover:text-white transition-colors" />
                            </button>
                        ) : (
                            <div className="space-y-3">
                                <button
                                    onClick={() => onLogin('apple')}
                                    className="w-full py-4 px-4 rounded-2xl bg-white text-black font-bold text-lg flex items-center justify-center gap-3 active:scale-[0.98] transition-transform shadow-lg"
                                >
                                    <div className="w-6 h-6 flex items-center justify-center shrink-0">
                                        <svg viewBox="0 0 384 512" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 52.3-11.4 69.5-34.3z" fill="currentColor" />
                                        </svg>
                                    </div>
                                    <span>{lang === 'zh' ? '使用 Apple 帳號登入' : 'Sign in with Apple'}</span>
                                </button>

                                <button
                                    onClick={() => onLogin('google')}
                                    className="w-full py-4 px-4 rounded-2xl bg-zinc-800 text-white font-bold text-lg flex items-center justify-center gap-3 active:scale-[0.98] transition-transform shadow-lg border border-white/10"
                                >
                                    <div className="w-6 h-6 flex items-center justify-center shrink-0">
                                        <GoogleIcon />
                                    </div>
                                    <span>{lang === 'zh' ? '使用 Google 帳號登入' : 'Sign in with Google'}</span>
                                </button>

                                <p className="text-center text-zinc-500 text-xs mt-3 px-4">
                                    {lang === 'zh'
                                        ? '同步您的最愛酒譜與吧台庫存至雲端'
                                        : 'Sync your favorites and bar inventory across devices'}
                                </p>
                            </div>
                        )}
                    </section>

                    {/* Subscription Management */}
                    <section>
                        <h2 className="text-zinc-500 text-sm font-medium mb-3 ml-1">{t.subscription.title}</h2>
                        <div className="bg-zinc-900/50 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden divide-y divide-white/5">
                            <button
                                onClick={() => presentCustomerCenter()}
                                className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <Star size={20} className="text-yellow-400" />
                                    <span className="text-white font-medium">{t.subscription.manage}</span>
                                </div>
                                <ChevronRight size={20} className="text-zinc-500" />
                            </button>
                            <button
                                onClick={async () => {
                                    const info = await restorePurchases();
                                    if (info) {
                                        const isPro = info.entitlements.all['HomeBarTonight Pro']?.isActive;
                                        if (isPro) {
                                            setRestoreAlert({
                                                visible: true,
                                                title: lang === 'zh' ? '購買已恢復' : 'Purchases Restored',
                                                message: lang === 'zh' ? '您的訂閱已成功恢復' : 'Your subscription has been successfully restored'
                                            });
                                        } else {
                                            setRestoreAlert({
                                                visible: true,
                                                title: lang === 'zh' ? '恢復購買失敗' : 'Restore Purchases Failed',
                                                message: lang === 'zh' ? '您目前沒有有效的訂閱' : 'You don\'t have an active subscription'
                                            });
                                        }
                                    } else {
                                        setRestoreAlert({
                                            visible: true,
                                            title: lang === 'zh' ? '恢復失敗' : 'Restore Failed',
                                            message: lang === 'zh' ? '請稍後再試' : 'Please try again later'
                                        });
                                    }
                                }}
                                className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <RefreshCw size={20} className="text-zinc-400" />
                                    <span className="text-white font-medium">{lang === 'zh' ? '恢復購買' : 'Restore Purchases'}</span>
                                </div>
                                <ChevronRight size={20} className="text-zinc-500" />
                            </button>
                        </div>
                    </section>

                    {/* Language Section */}
                    <section>
                        <h2 className="text-zinc-500 text-sm font-medium mb-3 ml-1">{t.language.title}</h2>
                        <button
                            onClick={() => setShowLanguageSheet(true)}
                            className="w-full bg-zinc-900/50 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <Globe size={20} className="text-zinc-400" />
                                <span className="text-white font-medium">{t.language.current}</span>
                            </div>
                            <ChevronRight size={20} className="text-zinc-500" />
                        </button>
                    </section>

                    {/* About Section */}
                    <section>
                        <h2 className="text-zinc-500 text-sm font-medium mb-3 ml-1">{t.about.title}</h2>
                        <div className="bg-zinc-900/50 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden divide-y divide-white/5">
                            <button
                                onClick={() => openLink('https://docs.google.com/document/d/1O_uWSZ8r-jCsEfZE4r276m-Xb1L1kS7PS1CAi8pgaJc/view')}
                                className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <HelpCircle size={20} className="text-zinc-400" />
                                    <span className="text-white">{t.about.support}</span>
                                </div>
                                <ChevronRight size={20} className="text-zinc-500" />
                            </button>
                            <button
                                onClick={() => openLink('https://docs.google.com/document/d/1t56AP7vWITorzdr8OI7Fz-r0VvT2n_-zWRP8Fe4n-kA/view')}
                                className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <FileText size={20} className="text-zinc-400" />
                                    <span className="text-white">{t.about.privacy}</span>
                                </div>
                                <ChevronRight size={20} className="text-zinc-500" />
                            </button>
                        </div>
                    </section>
                </div>

            </div>
            {/* Language Action Sheet */}
            <AnimatePresence>
                {showLanguageSheet && (
                    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowLanguageSheet(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="relative w-full sm:max-w-md bg-zinc-900 border-t sm:border border-white/10 rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl pb-[calc(1.5rem+env(safe-area-inset-bottom))]"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-white">{t.language.select}</h3>
                                <button
                                    onClick={() => setShowLanguageSheet(false)}
                                    className="p-2 -mr-2 text-zinc-400 hover:text-white transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                            <div className="space-y-3">
                                <button
                                    onClick={() => {
                                        setLang('en');
                                        setShowLanguageSheet(false);
                                    }}
                                    className={clsx(
                                        "w-full p-4 rounded-xl flex items-center justify-between transition-colors",
                                        lang === 'en' ? "bg-white text-black" : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                                    )}
                                >
                                    <span className="font-medium">English</span>
                                    {lang === 'en' && <Check size={20} />}
                                </button>
                                <button
                                    onClick={() => {
                                        setLang('zh');
                                        setShowLanguageSheet(false);
                                    }}
                                    className={clsx(
                                        "w-full p-4 rounded-xl flex items-center justify-between transition-colors",
                                        lang === 'zh' ? "bg-white text-black" : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                                    )}
                                >
                                    <span className="font-medium">繁體中文</span>
                                    {lang === 'zh' && <Check size={20} />}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {/* Restore Alert Modal */}
                {restoreAlert.visible && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setRestoreAlert(prev => ({ ...prev, visible: false }))}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative bg-zinc-900 border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl flex flex-col items-center text-center"
                        >
                            <h3 className="text-xl font-bold text-white mb-2">{restoreAlert.title}</h3>
                            <p className="text-zinc-400 mb-6 leading-relaxed whitespace-pre-line">{restoreAlert.message}</p>
                            <button
                                onClick={() => setRestoreAlert(prev => ({ ...prev, visible: false }))}
                                className="w-full py-3 rounded-xl bg-white text-black font-bold hover:bg-zinc-200 transition-colors"
                            >
                                {lang === 'zh' ? '好的' : 'OK'}
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Logout Confirmation Modal */}
            <AnimatePresence>
                {showLogoutConfirm && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowLogoutConfirm(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative bg-zinc-900 border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl"
                        >
                            <h3 className="text-lg font-bold text-white mb-2">{t.account.logout}</h3>
                            <p className="text-zinc-400 mb-6">{t.account.confirmLogout}</p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowLogoutConfirm(false)}
                                    className="flex-1 py-3 rounded-xl bg-zinc-800 text-white font-medium hover:bg-zinc-700 transition-colors"
                                >
                                    {t.account.cancel}
                                </button>
                                <button
                                    onClick={() => {
                                        onLogout();
                                        setShowLogoutConfirm(false);
                                    }}
                                    className="flex-1 py-3 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 font-medium hover:bg-red-500/20 transition-colors"
                                >
                                    {t.account.logout}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div >
    );
}
