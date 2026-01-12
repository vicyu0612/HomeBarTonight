import { useState, useRef } from 'react';
import { motion, useAnimation, useMotionValue, useTransform } from 'framer-motion';
import { Loader2, ArrowDown } from 'lucide-react';
import clsx from 'clsx';

interface PullToRefreshProps {
    onRefresh: () => Promise<void>;
    children: React.ReactNode;
    className?: string;
    triggerHeight?: number; // How far to pull to trigger refresh
    isPullable?: boolean; // Can disable if needed
    onScroll?: React.UIEventHandler<HTMLDivElement>;
}

export const PullToRefresh = ({
    onRefresh,
    children,
    className,
    triggerHeight = 80,
    isPullable = true,
    onScroll
}: PullToRefreshProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [status, setStatus] = useState<'idle' | 'pulling' | 'refreshing'>('idle');
    const [pullDistance, setPullDistance] = useState(0);

    // Touch state
    const startY = useRef(0);
    const isDragging = useRef(false);

    const pullY = useMotionValue(0);
    const controls = useAnimation();

    // Derived animations
    const rotate = useTransform(pullY, [0, triggerHeight], [0, 180]);
    const opacity = useTransform(pullY, [0, triggerHeight / 2], [0, 1]);

    const handleTouchStart = (e: React.TouchEvent) => {
        if (!isPullable || status === 'refreshing') return;

        const container = containerRef.current;
        if (!container) return;

        // Only explicitly enable pulling if we are at the very top
        if (container.scrollTop <= 0) {
            startY.current = e.touches[0].clientY;
            isDragging.current = true;
        }
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging.current || status === 'refreshing') return;

        const container = containerRef.current;
        if (!container) return;

        // If user scrolls down, let them (abort pull)
        if (container.scrollTop > 0) {
            isDragging.current = false;
            pullY.set(0);
            setPullDistance(0);
            return;
        }

        const currentY = e.touches[0].clientY;
        const diff = currentY - startY.current;

        // Only allow pulling down logic
        if (diff > 0) {
            // Add resistance
            const damped = Math.min(diff * 0.5, triggerHeight * 1.5);
            pullY.set(damped);
            setPullDistance(damped);

            if (damped >= triggerHeight) {
                setStatus('pulling');
            } else {
                setStatus('idle');
            }

            // Prevent default browser refresh/scroll only if we are effectively pulling
            // e.preventDefault(); // CAREFUL: standard passive listeners don't allow this.
        }
    };

    const handleTouchEnd = async () => {
        if (!isDragging.current || status === 'refreshing') return;
        isDragging.current = false;

        if (pullDistance >= triggerHeight) {
            setStatus('refreshing');
            // Checkpoint animation
            await controls.start({ y: triggerHeight, transition: { type: 'spring', stiffness: 300, damping: 30 } });

            // Trigger Refresh
            try {
                await onRefresh();
            } finally {
                setStatus('idle');
                controls.start({ y: 0 });
                pullY.set(0);
                setPullDistance(0);
            }
        } else {
            // Reset
            controls.start({ y: 0 });
            pullY.set(0);
            setPullDistance(0);
        }
    };

    return (
        <div
            className="flex-1 h-full relative overflow-hidden flex flex-col"
        >
            {/* Refresh Indicator Layer */}
            <motion.div
                className="absolute top-0 left-0 right-0 flex justify-center items-center pointer-events-none z-20"
                style={{ y: pullY, opacity }}
            >
                <div className="absolute -top-10 w-full flex justify-center py-4">
                    <div className="bg-black/40 backdrop-blur-md rounded-full mt-2 p-2 shadow-xl border border-white/10">
                        {status === 'refreshing' ? (
                            <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
                        ) : (
                            <motion.div style={{ rotate }}>
                                <ArrowDown className={clsx(
                                    "w-5 h-5 transition-colors",
                                    status === 'pulling' ? "text-indigo-400" : "text-white/70"
                                )} />
                            </motion.div>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* Scrollable Content Container */}
            <motion.div
                ref={containerRef}
                className={clsx("flex-1 overflow-y-auto w-full no-scrollbar relative z-10", className)}
                animate={controls}
                style={{ y: pullY }} // Controlled by drag or animation
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onScroll={onScroll}
            >
                {children}
            </motion.div>
        </div>
    );
};
