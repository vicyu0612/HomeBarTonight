import { motion } from 'framer-motion';

export const MixingShaker = ({ size = 320 }: { size?: number }) => {
    const strokeWidth = 1.5; // Slightly thicker for visibility

    // Gradient ID
    const gradientId = "mixing-gradient";
    const liquidGradientId = "liquid-gradient";

    return (
        <motion.svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="overflow-visible" // Allow elements to move slightly without clipping if needed
        >
            <defs>
                <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#a5b4fc" /> {/* indigo-300 */}
                    <stop offset="100%" stopColor="#d8b4fe" /> {/* purple-300 */}
                </linearGradient>
                <linearGradient id={liquidGradientId} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#a5b4fc" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#d8b4fe" stopOpacity={0.6} />
                </linearGradient>
                <clipPath id="mixing-clip-path">
                    {/* Define the inner volume of the shaker */}
                    <path d="M5 11 L7 21 H17 L19 11 L18.5 11 C18.5 6 15.5 5 15 5 H9 C8.5 5 5.5 6 5.5 11 L5 11 Z" />
                </clipPath>
            </defs>

            {/* --- Internal Contents (Clipped) --- */}
            <g clipPath="url(#mixing-clip-path)">
                {/* Liquid Level */}
                <motion.path
                    d="M6 16 L6.5 21H17.5 L18 16 Q12 18 6 16 Z"
                    fill={`url(#${liquidGradientId})`}
                    stroke="none"
                    animate={{
                        d: [
                            "M6 16 L6.5 21H17.5 L18 16 Q12 18 6 16 Z",
                            "M5 15 L6.5 21H17.5 L19 17 Q12 15 5 15 Z",
                            "M5 17 L6.5 21H17.5 L19 15 Q12 19 5 17 Z",
                            "M6 16 L6.5 21H17.5 L18 16 Q12 18 6 16 Z"
                        ]
                    }}
                    transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />

                {/* Ice Cubes - Positioned strictly inside body (y > 11 and y < 21) */}
                <motion.rect
                    width="3" height="3" rx="0.5"
                    stroke={`url(#${gradientId})`}
                    fill={`url(#${gradientId})`}
                    fillOpacity={0.8}
                    strokeWidth={1}
                    initial={{ x: 8, y: 14 }}
                    animate={{
                        y: [14, 12, 15, 14],
                        rotate: [0, 10, -10, 0],
                        x: [8, 9, 7, 8]
                    }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                />

                <motion.rect
                    width="2.5" height="2.5" rx="0.5"
                    stroke={`url(#${gradientId})`}
                    fill={`url(#${gradientId})`}
                    fillOpacity={0.8}
                    strokeWidth={1}
                    initial={{ x: 13, y: 15 }}
                    animate={{
                        y: [15, 17, 13, 15],
                        rotate: [15, -5, 20, 15],
                        x: [13, 12, 14, 13]
                    }}
                    transition={{ duration: 0.9, repeat: Infinity, delay: 0.1 }}
                />

                <motion.rect
                    width="2" height="2" rx="0.5"
                    stroke={`url(#${gradientId})`}
                    fill={`url(#${gradientId})`}
                    fillOpacity={0.8}
                    strokeWidth={1}
                    initial={{ x: 11, y: 13 }}
                    animate={{
                        y: [13, 14, 12, 13],
                        rotate: [-10, 20, 0, -10],
                    }}
                    transition={{ duration: 0.7, repeat: Infinity, delay: 0.2 }}
                />
            </g>


            {/* --- External Container (The Shaker Outline) --- */}
            {/* Draw this LAST so it sits on top of clipped contents */}

            {/* Main Body */}
            <path d="M5 11L7 21H17L19 11" />

            {/* Middle Separator (Wide Rim) */}
            <path d="M4 11H20" />

            {/* Top Dome */}
            <path d="M5.5 11C5.5 6 8.5 5 9 5H15C15.5 5 18.5 6 18.5 11" />

            {/* Cap */}
            <path d="M10 5V3H14V5" />

        </motion.svg>
    );
};
