import { useEffect, useRef } from 'react';
import { useSubscription } from '../hooks/useSubscription';

interface PaywallProps {
    onClose?: () => void;
}

export const Paywall = ({ onClose }: PaywallProps) => {
    const { presentPaywall } = useSubscription();
    const hasPresented = useRef(false);

    useEffect(() => {
        if (!hasPresented.current) {
            hasPresented.current = true;
            // Automatically present native paywall on mount
            presentPaywall().then(() => {
                // When paywall is dismissed/closed, we call onClose if provided
                onClose?.();
            });
        }
    }, [presentPaywall, onClose]);

    // Return a dummy loader or blank as the native view covers it
    return (
        <div className="flex items-center justify-center h-full w-full bg-black/80">
            <div className="animate-pulse text-white/50 text-sm">Loading Premium Experience...</div>
        </div>
    );
};
