import { Heart, Settings, Wine, Compass } from 'lucide-react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { ShakerIcon } from './ShakerIcon';

export type TabId = 'explore' | 'cocktails' | 'my_bar' | 'favorites' | 'settings';

interface TabBarProps {
    activeTab: TabId;
    onTabChange: (tab: TabId) => void;
    lang: 'en' | 'zh';
}

export function TabBar({ activeTab, onTabChange, lang }: TabBarProps) {
    const tabs = [
        { id: 'explore', icon: Compass, label: lang === 'zh' ? '探索' : 'Explore' },
        { id: 'cocktails', icon: Wine, label: lang === 'zh' ? '酒譜' : 'Cocktails' },
        { id: 'my_bar', icon: ShakerIcon, label: lang === 'zh' ? '我的吧台' : 'My Bar' },
        { id: 'favorites', icon: Heart, label: lang === 'zh' ? '我的最愛' : 'Favorites' },
        { id: 'settings', icon: Settings, label: lang === 'zh' ? '設定' : 'Settings' },
    ] as const;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-6 pt-2 pointer-events-none">
            <nav className="relative mx-auto max-w-md bg-black/60 backdrop-blur-2xl saturate-150 border border-white/10 rounded-full shadow-2xl flex items-center p-1.5 overflow-visible pointer-events-auto min-h-[64px]">
                {/* Glass reflection effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-white/0 pointer-events-none rounded-full" />

                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    const Icon = tab.icon;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id as TabId)}
                            className="relative flex flex-col items-center justify-center gap-1 flex-1 h-14 outline-none group"
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="tab-pill"
                                    className="absolute inset-0 bg-zinc-800/40 rounded-full"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}

                            <Icon
                                size={24}
                                strokeWidth={isActive ? 2.5 : 2}
                                className={clsx(
                                    "relative z-10 transition-colors duration-300 drop-shadow-sm",
                                    isActive ? "text-white" : "text-zinc-500 group-hover:text-zinc-300"
                                )}
                            />
                            <span className={clsx(
                                "relative z-10 text-[10px] font-medium transition-colors duration-300",
                                isActive ? "text-white" : "text-zinc-500"
                            )}>
                                {tab.label}
                            </span>
                        </button>
                    );
                })}
            </nav>
        </div>
    );
}
