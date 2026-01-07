import { useRef } from 'react';
import { motion, useScroll, useTransform, useMotionTemplate } from 'framer-motion';
import { Heart, X, Flame, GlassWater, Smile, Wine, ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import { useSwipeBack } from './hooks/useSwipeBack';

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

export const RecipeDetailModal = ({ recipe, onClose, isFavorite, onToggleFavorite, t, lang, onPrev, onNext, hasPrev, hasNext }: any) => {
    useSwipeBack(onClose);
    const scrollRef = useRef(null);
    const { scrollY } = useScroll({ container: scrollRef });
    const imageBlur = useTransform(scrollY, [0, 300], [0, 12]);
    const imageScale = useTransform(scrollY, [0, 300], [1, 1.1]);
    const overlayOpacity = useTransform(scrollY, [0, 300], [0, 0.6]);

    return (
        <div className="w-full h-full bg-zinc-900 relative flex flex-col">

            <div
                className="w-full h-full overflow-hidden relative flex flex-col"
            >
                {/* Dynamic Background Image */}
                <motion.div className="absolute inset-0 z-0 h-[60vh]">
                    <motion.img
                        src={recipe.image}
                        alt={recipe.name.en}
                        onError={(e) => {
                            e.currentTarget.src = "/placeholder.png";
                            e.currentTarget.onerror = null;
                        }}
                        className="w-full h-full object-cover"
                        style={{ filter: useMotionTemplate`blur(${imageBlur}px)`, scale: imageScale }}
                    />
                    <motion.div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-zinc-900" />
                    <motion.div className="absolute inset-0 bg-black" style={{ opacity: overlayOpacity }} />
                </motion.div>

                {/* Header Actions */}
                <div className="absolute top-0 left-0 right-0 z-30 p-6 pt-12 sm:pt-6 flex justify-end gap-3 items-start pointer-events-none">
                    {onToggleFavorite && (
                        <button
                            onClick={() => onToggleFavorite(recipe.id)}
                            className={clsx(
                                "pointer-events-auto p-3 rounded-full transition-all active:scale-95 shadow-lg",
                                "bg-black/30 backdrop-blur-md text-white border border-white/10 hover:bg-black/50" // Unified Style
                            )}
                        >
                            <Heart
                                size={24}
                                className={clsx("transition-colors", isFavorite ? "fill-red-500 text-red-500" : "text-white")}
                            />
                        </button>
                    )}

                    <button
                        onClick={onClose}
                        className="pointer-events-auto p-3 rounded-full bg-black/30 backdrop-blur-md text-white border border-white/10 transition-all active:scale-95 shadow-lg hover:bg-black/50"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Floating Navigation Buttons (Bottom) */}
                <div className="absolute bottom-8 left-6 right-6 z-30 flex justify-between pointer-events-none">
                    {hasPrev ? (
                        <button
                            onClick={(e) => { e.stopPropagation(); onPrev(); }}
                            className="p-4 rounded-full bg-zinc-800/80 backdrop-blur-xl text-white border border-white/10 shadow-xl hover:bg-zinc-700 active:scale-95 transition-all pointer-events-auto"
                        >
                            <ChevronLeft size={24} />
                        </button>
                    ) : <div />} {/* Spacer */}

                    {hasNext && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onNext(); }}
                            className="p-4 rounded-full bg-zinc-800/80 backdrop-blur-xl text-white border border-white/10 shadow-xl hover:bg-zinc-700 active:scale-95 transition-all pointer-events-auto"
                        >
                            <ChevronRight size={24} />
                        </button>
                    )}
                </div>

                {/* Scroll Container */}
                <div ref={scrollRef} className="absolute inset-0 z-10 overflow-y-auto overflow-x-hidden no-scrollbar">
                    {/* Spacer to reveal image (Clicking it closes modal which feels natural) */}
                    <div className="h-[50vh] w-full" onClick={onClose} />

                    {/* Content Sheet */}
                    <div className="min-h-[60vh] bg-zinc-950/90 backdrop-blur-3xl rounded-t-[2.5rem] p-8 pb-32 border-t border-white/10 relative shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
                        {/* Drag handle hint */}
                        <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-8" />

                        <div className="mb-8">
                            <h2 className="text-4xl font-bold text-white mb-3 leading-tight tracking-tight">{recipe.name[lang]}</h2>
                            <div className="flex gap-2 flex-wrap mb-4">
                                {recipe.tags[lang].map((tag: string) => (
                                    <span key={tag} className="text-xs uppercase font-bold tracking-wider text-zinc-400 bg-white/5 px-2 py-1 rounded-md border border-white/5">{tag}</span>
                                ))}
                            </div>
                            <p className="text-zinc-300 leading-relaxed text-lg font-light">
                                {recipe.description[lang]}
                            </p>
                        </div>

                        {/* Taste Profile Scale */}
                        <div className="bg-white/5 rounded-3xl p-6 border border-white/5 space-y-5 mb-8">
                            <SpecBar
                                label={t.specs.alcohol}
                                subLabel={t.specs.alcoholDesc}
                                value={recipe.specs.alcohol}
                                icon={Flame}
                                colorClass="text-red-500"
                                barColorClass="bg-gradient-to-r from-red-600 to-orange-500"
                            />
                            <SpecBar
                                label={t.specs.sweetness}
                                subLabel={t.specs.sweetnessDesc}
                                value={recipe.specs.sweetness}
                                icon={GlassWater}
                                colorClass="text-pink-400"
                                barColorClass="bg-gradient-to-r from-pink-500 to-purple-500"
                            />
                            <SpecBar
                                label={t.specs.ease}
                                subLabel={t.specs.easeDesc}
                                value={recipe.specs.ease}
                                icon={Smile}
                                colorClass="text-green-400"
                                barColorClass="bg-gradient-to-r from-green-500 to-emerald-500"
                            />
                        </div>

                        <div className="space-y-6 mb-8">
                            <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                <Wine size={16} /> {t.ingredients}
                            </h3>
                            <div className="bg-white/5 rounded-2xl p-1 border border-white/5">
                                {recipe.ingredients[lang].map((ing: any, i: number) => (
                                    <div key={i} className="flex justify-between items-center p-3 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors rounded-xl">
                                        <span className="text-zinc-200 font-medium">{ing.name}</span>
                                        <span className="text-primary font-bold bg-primary/10 px-3 py-1 rounded-lg border border-primary/20">{ing.amount}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-6 mb-12">
                            <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                <Flame size={16} /> {t.steps}
                            </h3>
                            <div className="space-y-6 pl-2">
                                {recipe.steps[lang].map((step: string, i: number) => (
                                    <div key={i} className="flex gap-5 relative">
                                        {/* Connector Line */}
                                        {i !== recipe.steps[lang].length - 1 && (
                                            <div className="absolute left-[11px] top-8 bottom-[-24px] w-[2px] bg-white/10" />
                                        )}
                                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-black shrink-0 shadow-[0_0_15px_rgba(139,92,246,0.5)] z-10">
                                            {i + 1}
                                        </div>
                                        <p className="text-zinc-300 text-base leading-relaxed pt-0.5">{step}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="pt-4 pb-16">
                            <button
                                onClick={onClose}
                                className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary to-accent text-zinc-950 font-black text-xl hover:opacity-90 active:scale-[0.98] transition-all shadow-[0_0_30px_rgba(34,211,238,0.3)]"
                            >
                                {t.done}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
