import { useState, useEffect } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { decode } from 'blurhash';
import { clsx } from 'clsx';
import { Martini } from 'lucide-react';

interface ImageWithLoaderProps extends HTMLMotionProps<"img"> {
    src: string;
    alt: string;
    className?: string;
    containerClassName?: string;
    priority?: boolean;
    blurDataURL?: string; // Optional for future server-side blurhash
    blurHash?: string;
}

// Refactored ImageWithLoader using robust useEffect pattern
export const ImageWithLoader = ({
    src,
    alt,
    className,
    containerClassName,
    priority = false,
    blurDataURL,
    blurHash,
    ...props
}: ImageWithLoaderProps) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const [blurUrl, setBlurUrl] = useState<string | null>(null);

    // Generate BlurUrl if blurHash is provided
    useEffect(() => {
        if (blurHash) {
            const canvas = document.createElement('canvas');
            canvas.width = 32;
            canvas.height = 32;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                const pixels = decode(blurHash, 32, 32);
                const imageData = ctx.createImageData(32, 32);
                imageData.data.set(pixels);
                ctx.putImageData(imageData, 0, 0);
                setBlurUrl(canvas.toDataURL());
            }
        }
    }, [blurHash]);

    // Robust image loading check
    useEffect(() => {
        // Reset state on src change
        setIsLoading(true);
        setError(false);

        const img = new Image();
        img.src = src;

        const handleLoad = () => {
            setIsLoading(false);
        };

        const handleError = () => {
            setError(true);
            setIsLoading(false);
        };

        // Check availability immediately
        if (img.complete) {
            handleLoad();
        } else {
            img.onload = handleLoad;
            img.onerror = handleError;
        }

        return () => {
            img.onload = null;
            img.onerror = null;
        };
    }, [src]);

    return (
        <div className={clsx("relative overflow-hidden bg-zinc-800", containerClassName)}>
            {/* Fallback / Loading State */}
            {(isLoading || error) && (
                <div className="absolute inset-0 flex items-center justify-center bg-zinc-800 text-zinc-600 z-10">
                    {blurUrl && !error ? (
                        <img
                            src={blurUrl}
                            alt=""
                            className="absolute inset-0 w-full h-full object-cover opacity-50 blur-sm scale-110"
                        />
                    ) : (
                        <div className="animate-pulse">
                            <Martini size={24} className={error ? "text-red-900/50" : "opacity-50"} />
                        </div>
                    )}
                </div>
            )}

            {/* Actual Image */}
            <motion.img
                src={src}
                alt={alt}
                initial={{ opacity: 0 }}
                animate={{ opacity: isLoading ? 0 : 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={className}
                loading={priority ? "eager" : "lazy"}
                decoding={priority ? "sync" : "async"}
                {...props}
            />
        </div>
    );
};
