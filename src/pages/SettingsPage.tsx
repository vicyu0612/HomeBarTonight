import { HelpCircle, ChevronRight, X, FileText, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import clsx from 'clsx';

interface SettingsPageProps {
    session: Session | null;
    lang: 'en' | 'zh';
    setLang: (lang: 'en' | 'zh') => void;
    onLogin: () => void;
    onLogout: () => void;
}

const GoogleIcon = () => (
    <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
);

export function SettingsPage({ session, lang, setLang, onLogin, onLogout }: SettingsPageProps) {
    const [showLanguageSheet, setShowLanguageSheet] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        setIsScrolled(e.currentTarget.scrollTop > 40);
    };

    const t = {
        title: lang === 'zh' ? '設定' : 'Settings',
        account: {
            title: lang === 'zh' ? '帳戶' : 'Account',
            guest: lang === 'zh' ? '訪客' : 'Guest',
            login: lang === 'zh' ? '登入' : 'Sign In',
            logout: lang === 'zh' ? '登出' : 'Sign Out',
            confirmLogout: lang === 'zh' ? '確定要登出嗎？' : 'Are you sure you want to sign out?',
            cancel: lang === 'zh' ? '取消' : 'Cancel'
        },
        language: {
            title: lang === 'zh' ? '當前語言' : 'Current Language',
            current: lang === 'zh' ? '中文' : 'English'
        },
        about: {
            title: lang === 'zh' ? '關於' : 'About',
            support: lang === 'zh' ? '支援' : 'Support',
            privacy: lang === 'zh' ? '隱私政策' : 'Privacy Policy'
        }
    };

    const openLink = (url: string) => window.open(url, '_blank');

    return (
        <div className="h-full relative flex flex-col">
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
                <span className={clsx(
                    "font-bold text-white transition-opacity duration-300",
                    isScrolled ? "opacity-100" : "opacity-0"
                )}>
                    {t.title}
                </span>
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
                            <div className="bg-zinc-900/50 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden p-4 flex items-center justify-between">
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
                                    <div className="overflow-hidden">
                                        <p className="text-white font-medium truncate max-w-[200px]">{session.user.email}</p>
                                        <button onClick={() => setShowLogoutConfirm(true)} className="text-red-400 text-sm mt-0.5 hover:text-red-300 transition-colors text-left">
                                            {t.account.logout}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={onLogin}
                                className="w-full py-4 px-4 rounded-2xl bg-white text-zinc-900 font-bold text-lg flex items-center justify-center gap-3 active:scale-[0.98] transition-transform shadow-lg"
                            >
                                <div className="w-6 h-6 flex items-center justify-center shrink-0">
                                    <GoogleIcon />
                                </div>
                                <span>{lang === 'zh' ? '使用 Google 帳號登入' : 'Sign in with Google'}</span>
                            </button>
                        )}
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
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowLanguageSheet(false)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
                        />
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed bottom-0 left-0 right-0 z-[101] bg-zinc-900 rounded-t-3xl border-t border-white/10 p-6 pb-12 ring-1 ring-white/10 mx-auto max-w-[1024px]"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-white">{t.language.title}</h3>
                                <button onClick={() => setShowLanguageSheet(false)} className="p-2 bg-zinc-800 rounded-full text-zinc-400 hover:text-white">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-3">
                                {[
                                    { code: 'system', label: lang === 'zh' ? '跟隨系統' : 'System Default' },
                                    { code: 'zh', label: '中文 (繁體)' },
                                    { code: 'en', label: 'English' }
                                ].map((opt) => (
                                    <button
                                        key={opt.code}
                                        onClick={() => {
                                            if (opt.code === 'system') {
                                                const sys = navigator.language.toLowerCase().startsWith('zh') ? 'zh' : 'en';
                                                setLang(sys as 'en' | 'zh');
                                            } else {
                                                setLang(opt.code as 'en' | 'zh');
                                            }
                                            setShowLanguageSheet(false);
                                        }}
                                        className={clsx(
                                            "w-full p-4 rounded-xl font-medium text-left transition-all border",
                                            (opt.code === 'system' ? false : lang === opt.code)
                                                ? "bg-white text-black border-white"
                                                : "bg-zinc-800 text-zinc-300 border-transparent hover:bg-zinc-700"
                                        )}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </>
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
        </div>
    );
}
