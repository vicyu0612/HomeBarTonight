import { motion } from 'framer-motion';
import { Lock, Crown } from 'lucide-react';

interface LockedContentCardProps {
    title: { zh: string; en: string };
    description: { zh: string; en: string };
    buttonText: { zh: string; en: string };
    onUnlock: () => void;
    lang: 'zh' | 'en';
}

export const LockedContentCard = ({
    title,
    description,
    buttonText,
    onUnlock,
    lang
}: LockedContentCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative mt-2 p-6 rounded-2xl overflow-hidden text-center group border border-white/10"
        >
            {/* Background Image */}
            <div className="absolute inset-0">
                <img
                    src="/assets/locked_content_bg.png"
                    alt="Premium Unlocked"
                    className="w-full h-full object-cover scale-[1.2] transition-transform duration-700 group-hover:scale-[1.25]"
                />
                {/* Gradient Overlay for Text Readability - Dark Purple Accent */}
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/95 to-purple-900/30" />
            </div>

            <div className="relative z-10 flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-indigo-500/20 backdrop-blur-sm flex items-center justify-center text-indigo-300 mb-1 border border-indigo-500/30">
                    <Lock size={24} />
                </div>

                <h3 className="text-xl font-bold text-white drop-shadow-md">
                    {lang === 'zh' ? title.zh : title.en}
                </h3>

                <p className="text-white text-sm max-w-[90%] mx-auto mb-2 leading-relaxed drop-shadow-sm font-medium">
                    {lang === 'zh' ? description.zh : description.en}
                </p>

                <button
                    onClick={onUnlock}
                    className="px-8 py-3 rounded-full bg-white text-indigo-900 font-bold text-sm shadow-xl hover:bg-indigo-50 transition-colors flex items-center gap-2"
                >
                    <Crown size={16} className="text-amber-500" />
                    {lang === 'zh' ? buttonText.zh : buttonText.en}
                </button>
            </div>
        </motion.div>
    );
};
