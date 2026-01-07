import { type LucideProps } from 'lucide-react';

interface ShakerIconProps extends LucideProps {
    withGradient?: boolean;
}

export const ShakerIcon = ({ size = 24, strokeWidth = 1.5, className, withGradient = false, ...props }: ShakerIconProps) => {
    const gradientId = "shaker-gradient";
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={withGradient ? `url(#${gradientId})` : "currentColor"}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            {...props}
        >
            {withGradient && (
                <defs>
                    <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#a5b4fc" /> {/* indigo-300 */}
                        <stop offset="100%" stopColor="#d8b4fe" /> {/* purple-300 */}
                    </linearGradient>
                </defs>
            )}

            {/* Main Body */}
            <path d="M5 11L7 21H17L19 11" />

            {/* Middle Separator (Rim) */}
            <path d="M4 11H20" />

            {/* Top Dome */}
            <path d="M5.5 11C5.5 6 8.5 5 9 5H15C15.5 5 18.5 6 18.5 11" />

            {/* Cap */}
            <path d="M10 5V3H14V5" />
        </svg>
    );
};
