import clsx from 'clsx';

interface RecipeCardSkeletonProps {
    variant?: 'horizontal' | 'vertical';
    className?: string;
}

export function RecipeCardSkeleton({ variant = 'horizontal', className }: RecipeCardSkeletonProps) {
    if (variant === 'vertical') {
        return (
            <div
                className={clsx(
                    "bg-zinc-800/30 backdrop-blur-md border border-white/10 shadow-lg rounded-2xl overflow-hidden h-full flex flex-col",
                    className
                )}
            >
                {/* Image Skeleton */}
                <div className="w-full aspect-square bg-zinc-800 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800 animate-shimmer bg-[length:200%_100%]" />
                </div>

                {/* Content Skeleton */}
                <div className="p-4 flex-1 flex flex-col gap-2">
                    {/* Title */}
                    <div className="h-5 bg-zinc-700 rounded-lg w-3/4 animate-pulse" />

                    {/* Subtitle */}
                    <div className="h-4 bg-zinc-700/60 rounded-lg w-1/2 animate-pulse" style={{ animationDelay: '150ms' }} />

                    {/* Tags */}
                    <div className="flex gap-2 mt-2">
                        <div className="h-6 bg-zinc-700/40 rounded-full w-16 animate-pulse" style={{ animationDelay: '300ms' }} />
                        <div className="h-6 bg-zinc-700/40 rounded-full w-20 animate-pulse" style={{ animationDelay: '450ms' }} />
                    </div>
                </div>
            </div>
        );
    }

    // Horizontal variant
    return (
        <div
            className={clsx(
                "bg-zinc-800/30 backdrop-blur-md border border-white/10 shadow-lg rounded-2xl overflow-hidden flex",
                className
            )}
        >
            {/* Image Skeleton */}
            <div className="w-24 h-24 bg-zinc-800 relative overflow-hidden shrink-0">
                <div className="absolute inset-0 bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800 animate-shimmer bg-[length:200%_100%]" />
            </div>

            {/* Content Skeleton */}
            <div className="flex-1 p-3 flex flex-col justify-center gap-2">
                {/* Title */}
                <div className="h-4 bg-zinc-700 rounded-lg w-2/3 animate-pulse" />

                {/* Subtitle */}
                <div className="h-3 bg-zinc-700/60 rounded-lg w-1/2 animate-pulse" style={{ animationDelay: '150ms' }} />

                {/* Tags */}
                <div className="flex gap-2 mt-1">
                    <div className="h-5 bg-zinc-700/40 rounded-full w-12 animate-pulse" style={{ animationDelay: '300ms' }} />
                    <div className="h-5 bg-zinc-700/40 rounded-full w-16 animate-pulse" style={{ animationDelay: '450ms' }} />
                </div>
            </div>
        </div>
    );
}
