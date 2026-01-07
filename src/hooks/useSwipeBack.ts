import { useEffect } from 'react';

/**
 * Hook to detect iOS-style edge swipe back gesture.
 * @param onBack Function to call when swipe back is detected
 * @param threshold Minimum distance to swipe (default 60px)
 * @param edgeLimit Maximum X position to start swipe from (default 40px)
 */
export function useSwipeBack(
    onBack: () => void,
    threshold = 60,
    edgeLimit = 40
) {
    useEffect(() => {
        let startX = 0;
        let startY = 0;

        const handleTouchStart = (e: TouchEvent) => {
            if (e.touches.length !== 1) return;
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        };

        const handleTouchEnd = (e: TouchEvent) => {
            if (e.changedTouches.length !== 1) return;

            // Only process if started from the left edge
            if (startX > edgeLimit) return;

            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;

            const diffX = endX - startX;
            const diffY = endY - startY;

            // Conditions:
            // 1. Horizontal swipe > threshold
            // 2. Horizontal distance significantly larger than vertical (avoid diagonals)
            if (diffX > threshold && Math.abs(diffX) > Math.abs(diffY) * 1.5) {
                onBack();
            }
        };

        window.addEventListener('touchstart', handleTouchStart);
        window.addEventListener('touchend', handleTouchEnd);

        return () => {
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchend', handleTouchEnd);
        };
    }, [onBack, threshold, edgeLimit]);
}
