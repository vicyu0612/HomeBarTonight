import { Compass } from 'lucide-react';

export function ExplorePage({ lang }: { lang: 'en' | 'zh' }) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-zinc-500">
            <div className="w-20 h-20 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center mb-6 shadow-2xl shadow-indigo-500/10">
                <Compass size={40} className="text-zinc-600" strokeWidth={1.5} />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">
                {lang === 'zh' ? '探索功能開發中' : 'Explore Coming Soon'}
            </h2>
            <p className="text-center max-w-xs text-sm opacity-60">
                {lang === 'zh'
                    ? '我們正在釀造一些有趣的靈感，敬請期待...'
                    : 'We are brewing some interesting inspirations. Stay tuned...'}
            </p>
        </div>
    );
}
